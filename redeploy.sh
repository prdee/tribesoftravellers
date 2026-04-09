#!/bin/bash
set -euo pipefail

ENV_FILE="${ENV_FILE:-.env}"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
else
  echo "❌ Missing $ENV_FILE. Update .env with your AWS/S3 deployment settings first."
  exit 1
fi

if ! command -v aws >/dev/null 2>&1; then
  echo "❌ AWS CLI is not installed or not available in PATH."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "❌ npm is not installed or not available in PATH."
  exit 1
fi

: "${AWS_REGION:?Set AWS_REGION in .env}"
: "${S3_BUCKET_NAME:?Set S3_BUCKET_NAME in .env}"

BUILD_DIR="${BUILD_DIR:-dist}"
export AWS_REGION
export AWS_DEFAULT_REGION="$AWS_REGION"

if [[ -n "${AWS_PROFILE:-}" ]]; then
  export AWS_PROFILE
fi

echo "▶ Building app..."
npm run build

if [[ ! -f "$BUILD_DIR/index.html" ]]; then
  echo "❌ Build output not found at $BUILD_DIR/index.html"
  exit 1
fi

echo "▶ Syncing to S3..."
aws s3 sync "$BUILD_DIR/" "s3://$S3_BUCKET_NAME" --delete \
  --cache-control "public,max-age=31536000,immutable" \
  --exclude "index.html"

aws s3 cp "$BUILD_DIR/index.html" "s3://$S3_BUCKET_NAME/index.html" \
  --cache-control "no-cache,no-store,must-revalidate"

if [[ -n "${CLOUDFRONT_DISTRIBUTION_ID:-}" ]]; then
  echo "▶ Invalidating CloudFront cache..."
  aws cloudfront create-invalidation \
    --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
    --paths "/*"
else
  echo "ℹ Skipping CloudFront invalidation because CLOUDFRONT_DISTRIBUTION_ID is not set."
fi

echo "✅ Deployment complete!"
