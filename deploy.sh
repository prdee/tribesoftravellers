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

SITE_DOMAIN="${SITE_DOMAIN:-$S3_BUCKET_NAME}"
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

echo "▶ Creating S3 bucket..."
if [[ "$AWS_REGION" == "us-east-1" ]]; then
  aws s3api create-bucket \
    --bucket "$S3_BUCKET_NAME" \
    --region "$AWS_REGION" 2>/dev/null || echo "  Bucket already exists, skipping."
else
  aws s3api create-bucket \
    --bucket "$S3_BUCKET_NAME" \
    --region "$AWS_REGION" \
    --create-bucket-configuration "LocationConstraint=$AWS_REGION" 2>/dev/null || echo "  Bucket already exists, skipping."
fi

# Block all public access (CloudFront will access it via OAC)
aws s3api put-public-access-block \
  --bucket "$S3_BUCKET_NAME" \
  --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

echo "▶ Syncing build files to S3..."
aws s3 sync "$BUILD_DIR/" "s3://$S3_BUCKET_NAME" --delete \
  --cache-control "public,max-age=31536000,immutable" \
  --exclude "index.html"

# index.html should not be cached aggressively
aws s3 cp "$BUILD_DIR/index.html" "s3://$S3_BUCKET_NAME/index.html" \
  --cache-control "no-cache,no-store,must-revalidate"

echo ""
echo "✅ Files uploaded to S3."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "NEXT STEPS (one-time manual setup in AWS Console):"
echo ""
echo "1. Request ACM Certificate:"
echo "   → Go to: https://console.aws.amazon.com/acm/home?region=us-east-1"
echo "   → Request public cert for: $SITE_DOMAIN and www.$SITE_DOMAIN"
echo "   → Choose DNS validation → copy the CNAME records to Hostinger DNS"
echo "   → Wait for status: Issued"
echo ""
echo "2. Create CloudFront Distribution:"
echo "   → Origin: $S3_BUCKET_NAME.s3.$AWS_REGION.amazonaws.com"
echo "   → Origin access: Origin Access Control (OAC) — create new"
echo "   → Viewer protocol: Redirect HTTP to HTTPS"
echo "   → Alternate domain names (CNAMEs): $SITE_DOMAIN, www.$SITE_DOMAIN"
echo "   → SSL cert: select the ACM cert you just created"
echo "   → Default root object: index.html"
echo "   → After creation, copy the S3 bucket policy shown and apply it to your bucket"
echo ""
echo "3. Add CloudFront Error Page (for React Router SPA):"
echo "   → In your distribution → Error pages → Create custom error response"
echo "   → HTTP error code: 403 → Response page path: /index.html → HTTP 200"
echo "   → Repeat for 404"
echo ""
echo "4. Point Hostinger DNS to CloudFront:"
echo "   → In Hostinger DNS, add:"
echo "     CNAME  @    <your-cloudfront-id>.cloudfront.net"
echo "     CNAME  www  <your-cloudfront-id>.cloudfront.net"
echo "   → (Some registrars need ALIAS/ANAME for root domain — Hostinger supports CNAME flattening)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
