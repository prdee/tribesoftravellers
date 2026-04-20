#!/bin/bash
# =============================================================================
# The Tribes of Travellers — Full CI/CD Deploy Script
# Deploys: Frontend → AWS S3 + CloudFront | Backend → AWS Lambda + API Gateway
#
# Usage:
#   ./cicd-deploy.sh                  # Deploy both frontend and backend
#   ./cicd-deploy.sh --frontend-only  # Deploy only frontend
#   ./cicd-deploy.sh --backend-only   # Deploy only backend
#   ./cicd-deploy.sh --setup          # First-time setup (creates all AWS resources)
#
# Prerequisites:
#   - AWS CLI installed and configured (aws configure)
#   - Node.js 18+ and npm installed
#   - zip installed (brew install zip on macOS)
#   - .env file with all required variables (see .env.example)
# =============================================================================

set -euo pipefail

# ─── Colors ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

log()     { echo -e "${BLUE}▶${NC} $*"; }
success() { echo -e "${GREEN}✓${NC} $*"; }
warn()    { echo -e "${YELLOW}⚠${NC} $*"; }
error()   { echo -e "${RED}✗${NC} $*" >&2; }
header()  { echo -e "\n${BOLD}${CYAN}══ $* ══${NC}\n"; }

# ─── Parse arguments ─────────────────────────────────────────────────────────
DEPLOY_FRONTEND=true
DEPLOY_BACKEND=true
SETUP_MODE=false

for arg in "$@"; do
  case $arg in
    --frontend-only) DEPLOY_BACKEND=false ;;
    --backend-only)  DEPLOY_FRONTEND=false ;;
    --setup)         SETUP_MODE=true ;;
    --help|-h)
      echo "Usage: $0 [--frontend-only|--backend-only|--setup]"
      exit 0
      ;;
  esac
done

# ─── Load environment ─────────────────────────────────────────────────────────
ENV_FILE="${ENV_FILE:-.env}"
if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
  success "Loaded environment from $ENV_FILE"
else
  error "Missing $ENV_FILE. Copy .env.example to .env and fill in your values."
  exit 1
fi

# ─── Validate required variables ─────────────────────────────────────────────
REQUIRED_VARS=(AWS_REGION S3_BUCKET_NAME)
if $DEPLOY_BACKEND; then
  REQUIRED_VARS+=(LAMBDA_FUNCTION_NAME API_GATEWAY_ID)
fi

for var in "${REQUIRED_VARS[@]}"; do
  if [[ -z "${!var:-}" ]]; then
    error "Required variable $var is not set in $ENV_FILE"
    exit 1
  fi
done

# ─── Check dependencies ───────────────────────────────────────────────────────
for cmd in aws npm node zip; do
  if ! command -v "$cmd" &>/dev/null; then
    error "$cmd is not installed or not in PATH"
    exit 1
  fi
done

export AWS_REGION
export AWS_DEFAULT_REGION="$AWS_REGION"
[[ -n "${AWS_PROFILE:-}" ]] && export AWS_PROFILE

BUILD_DIR="${BUILD_DIR:-dist}"
LAMBDA_ZIP="${LAMBDA_ZIP:-lambda-backend.zip}"
LAMBDA_RUNTIME="${LAMBDA_RUNTIME:-nodejs18.x}"
LAMBDA_HANDLER="${LAMBDA_HANDLER:-server.handler}"
LAMBDA_TIMEOUT="${LAMBDA_TIMEOUT:-30}"
LAMBDA_MEMORY="${LAMBDA_MEMORY:-512}"

# ─── SETUP MODE: Create all AWS resources ────────────────────────────────────
if $SETUP_MODE; then
  header "FIRST-TIME SETUP"

  # ── S3 Bucket ──
  log "Creating S3 bucket: $S3_BUCKET_NAME"
  if [[ "$AWS_REGION" == "us-east-1" ]]; then
    aws s3api create-bucket --bucket "$S3_BUCKET_NAME" --region "$AWS_REGION" 2>/dev/null || warn "Bucket already exists"
  else
    aws s3api create-bucket --bucket "$S3_BUCKET_NAME" --region "$AWS_REGION" \
      --create-bucket-configuration LocationConstraint="$AWS_REGION" 2>/dev/null || warn "Bucket already exists"
  fi

  log "Configuring S3 bucket for static website hosting..."
  aws s3api put-bucket-website --bucket "$S3_BUCKET_NAME" --website-configuration '{
    "IndexDocument": {"Suffix": "index.html"},
    "ErrorDocument": {"Key": "index.html"}
  }'

  log "Disabling S3 block public access..."
  aws s3api put-public-access-block --bucket "$S3_BUCKET_NAME" \
    --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

  log "Setting S3 bucket policy for public read..."
  aws s3api put-bucket-policy --bucket "$S3_BUCKET_NAME" --policy "{
    \"Version\": \"2012-10-17\",
    \"Statement\": [{
      \"Sid\": \"PublicReadGetObject\",
      \"Effect\": \"Allow\",
      \"Principal\": \"*\",
      \"Action\": \"s3:GetObject\",
      \"Resource\": \"arn:aws:s3:::${S3_BUCKET_NAME}/*\"
    }]
  }"
  success "S3 bucket configured"

  # ── Lambda IAM Role ──
  LAMBDA_ROLE_NAME="${LAMBDA_FUNCTION_NAME:-ttt-backend}-role"
  log "Creating Lambda IAM role: $LAMBDA_ROLE_NAME"
  ROLE_ARN=$(aws iam create-role \
    --role-name "$LAMBDA_ROLE_NAME" \
    --assume-role-policy-document '{
      "Version": "2012-10-17",
      "Statement": [{
        "Effect": "Allow",
        "Principal": {"Service": "lambda.amazonaws.com"},
        "Action": "sts:AssumeRole"
      }]
    }' \
    --query 'Role.Arn' --output text 2>/dev/null) || \
    ROLE_ARN=$(aws iam get-role --role-name "$LAMBDA_ROLE_NAME" --query 'Role.Arn' --output text)

  aws iam attach-role-policy --role-name "$LAMBDA_ROLE_NAME" \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole 2>/dev/null || true
  success "IAM role ready: $ROLE_ARN"

  # ── Lambda Function ──
  log "Building Lambda package..."
  cd backend
  npm ci --omit=dev --silent
  zip -r "../$LAMBDA_ZIP" . -x "*.git*" -x ".env" -x "node_modules/.cache/*" -x "*.DS_Store" -q
  cd ..
  success "Lambda package built: $LAMBDA_ZIP"

  log "Creating Lambda function: ${LAMBDA_FUNCTION_NAME:-ttt-backend}"
  sleep 10  # Wait for IAM role propagation

  # Build env vars JSON for Lambda
  ENV_JSON=$(node -e "
    const vars = {
      MONGODB_URI: process.env.MONGODB_URI || '',
      JWT_SECRET: process.env.JWT_SECRET || '',
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || '',
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY || '',
      RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
      RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
      CLIENT_URL: process.env.VITE_API_URL ? process.env.VITE_API_URL.replace('/api','') : 'https://${SITE_DOMAIN:-localhost}',
      NODE_ENV: 'production',
    };
    console.log(JSON.stringify({Variables: vars}));
  ")

  aws lambda create-function \
    --function-name "${LAMBDA_FUNCTION_NAME:-ttt-backend}" \
    --runtime "$LAMBDA_RUNTIME" \
    --role "$ROLE_ARN" \
    --handler "$LAMBDA_HANDLER" \
    --zip-file "fileb://$LAMBDA_ZIP" \
    --timeout "$LAMBDA_TIMEOUT" \
    --memory-size "$LAMBDA_MEMORY" \
    --environment "$ENV_JSON" \
    --region "$AWS_REGION" 2>/dev/null || warn "Lambda function already exists, updating..."

  success "Lambda function created/updated"

  # ── API Gateway ──
  log "Creating HTTP API Gateway..."
  API_ID=$(aws apigatewayv2 create-api \
    --name "${LAMBDA_FUNCTION_NAME:-ttt-backend}-api" \
    --protocol-type HTTP \
    --cors-configuration "AllowOrigins=*,AllowMethods=*,AllowHeaders=*" \
    --query 'ApiId' --output text)

  LAMBDA_ARN=$(aws lambda get-function --function-name "${LAMBDA_FUNCTION_NAME:-ttt-backend}" --query 'Configuration.FunctionArn' --output text)
  ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

  # Create Lambda integration
  INTEGRATION_ID=$(aws apigatewayv2 create-integration \
    --api-id "$API_ID" \
    --integration-type AWS_PROXY \
    --integration-uri "arn:aws:apigateway:${AWS_REGION}:lambda:path/2015-03-31/functions/${LAMBDA_ARN}/invocations" \
    --payload-format-version "2.0" \
    --query 'IntegrationId' --output text)

  # Create catch-all route
  aws apigatewayv2 create-route \
    --api-id "$API_ID" \
    --route-key 'ANY /{proxy+}' \
    --target "integrations/$INTEGRATION_ID" > /dev/null

  # Deploy to $default stage
  aws apigatewayv2 create-stage \
    --api-id "$API_ID" \
    --stage-name '$default' \
    --auto-deploy > /dev/null

  # Grant API Gateway permission to invoke Lambda
  aws lambda add-permission \
    --function-name "${LAMBDA_FUNCTION_NAME:-ttt-backend}" \
    --statement-id "apigateway-invoke" \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:${AWS_REGION}:${ACCOUNT_ID}:${API_ID}/*/*" 2>/dev/null || true

  API_URL="https://${API_ID}.execute-api.${AWS_REGION}.amazonaws.com"
  success "API Gateway created: $API_URL"

  echo ""
  echo -e "${BOLD}${GREEN}═══════════════════════════════════════════════════${NC}"
  echo -e "${BOLD}${GREEN}  SETUP COMPLETE!${NC}"
  echo -e "${BOLD}${GREEN}═══════════════════════════════════════════════════${NC}"
  echo ""
  echo "Add these to your .env file:"
  echo "  API_GATEWAY_ID=$API_ID"
  echo "  LAMBDA_FUNCTION_NAME=${LAMBDA_FUNCTION_NAME:-ttt-backend}"
  echo ""
  echo "Add this to your frontend .env.local:"
  echo "  VITE_API_URL=$API_URL/api"
  echo ""
  echo "Then run: ./cicd-deploy.sh"
  exit 0
fi

# ─── DEPLOY BACKEND ───────────────────────────────────────────────────────────
deploy_backend() {
  header "DEPLOYING BACKEND → AWS LAMBDA"

  log "Installing production dependencies..."
  cd backend
  npm ci --omit=dev --silent
  success "Dependencies installed"

  log "Creating Lambda deployment package..."
  rm -f "../$LAMBDA_ZIP"
  zip -r "../$LAMBDA_ZIP" . \
    -x "*.git*" \
    -x ".env" \
    -x "node_modules/.cache/*" \
    -x "*.DS_Store" \
    -x "scripts/*" \
    -q
  cd ..

  ZIP_SIZE=$(du -sh "$LAMBDA_ZIP" | cut -f1)
  success "Package created: $LAMBDA_ZIP ($ZIP_SIZE)"

  log "Updating Lambda function code..."
  aws lambda update-function-code \
    --function-name "$LAMBDA_FUNCTION_NAME" \
    --zip-file "fileb://$LAMBDA_ZIP" \
    --region "$AWS_REGION" \
    --output text > /dev/null

  log "Waiting for Lambda update to complete..."
  aws lambda wait function-updated \
    --function-name "$LAMBDA_FUNCTION_NAME" \
    --region "$AWS_REGION"

  # Update environment variables
  log "Updating Lambda environment variables..."
  ENV_JSON=$(node -e "
    const vars = {
      MONGODB_URI: process.env.MONGODB_URI || '',
      JWT_SECRET: process.env.JWT_SECRET || '',
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || '',
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY || '',
      RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
      RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
      CLIENT_URL: process.env.CLIENT_URL || '',
      NODE_ENV: 'production',
    };
    console.log(JSON.stringify({Variables: vars}));
  ")

  aws lambda update-function-configuration \
    --function-name "$LAMBDA_FUNCTION_NAME" \
    --environment "$ENV_JSON" \
    --timeout "$LAMBDA_TIMEOUT" \
    --memory-size "$LAMBDA_MEMORY" \
    --region "$AWS_REGION" \
    --output text > /dev/null

  # Redeploy API Gateway stage
  if [[ -n "${API_GATEWAY_ID:-}" ]]; then
    log "Redeploying API Gateway..."
    aws apigatewayv2 create-deployment \
      --api-id "$API_GATEWAY_ID" \
      --stage-name '$default' \
      --region "$AWS_REGION" \
      --output text > /dev/null
    success "API Gateway redeployed"
  fi

  # Clean up zip
  rm -f "$LAMBDA_ZIP"

  API_URL="https://${API_GATEWAY_ID}.execute-api.${AWS_REGION}.amazonaws.com"
  success "Backend deployed → $API_URL"
}

# ─── DEPLOY FRONTEND ──────────────────────────────────────────────────────────
deploy_frontend() {
  header "DEPLOYING FRONTEND → AWS S3 + CLOUDFRONT"

  log "Building frontend..."
  npm run build

  if [[ ! -f "$BUILD_DIR/index.html" ]]; then
    error "Build failed — $BUILD_DIR/index.html not found"
    exit 1
  fi
  success "Frontend built"

  log "Syncing assets to S3 (long cache)..."
  aws s3 sync "$BUILD_DIR/" "s3://$S3_BUCKET_NAME" \
    --delete \
    --cache-control "public,max-age=31536000,immutable" \
    --exclude "index.html" \
    --exclude "*.html" \
    --quiet

  log "Uploading HTML files (no cache)..."
  aws s3 cp "$BUILD_DIR/index.html" "s3://$S3_BUCKET_NAME/index.html" \
    --cache-control "no-cache,no-store,must-revalidate" \
    --content-type "text/html"

  # Upload any other HTML files
  find "$BUILD_DIR" -name "*.html" ! -name "index.html" | while read -r f; do
    key="${f#$BUILD_DIR/}"
    aws s3 cp "$f" "s3://$S3_BUCKET_NAME/$key" \
      --cache-control "no-cache,no-store,must-revalidate" \
      --content-type "text/html" \
      --quiet
  done

  success "Files synced to S3"

  # CloudFront invalidation
  if [[ -n "${CLOUDFRONT_DISTRIBUTION_ID:-}" ]]; then
    log "Invalidating CloudFront cache..."
    INVALIDATION_ID=$(aws cloudfront create-invalidation \
      --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
      --paths "/*" \
      --query 'Invalidation.Id' --output text)
    success "CloudFront invalidation started: $INVALIDATION_ID"
    success "Frontend deployed → https://${SITE_DOMAIN:-$S3_BUCKET_NAME}"
  else
    WEBSITE_URL="http://${S3_BUCKET_NAME}.s3-website-${AWS_REGION}.amazonaws.com"
    success "Frontend deployed → $WEBSITE_URL"
    warn "Set CLOUDFRONT_DISTRIBUTION_ID in .env for HTTPS + CDN"
  fi
}

# ─── RUN DEPLOYMENTS ──────────────────────────────────────────────────────────
START_TIME=$(date +%s)

echo ""
echo -e "${BOLD}${CYAN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${CYAN}║   The Tribes of Travellers — CI/CD Deploy        ║${NC}"
echo -e "${BOLD}${CYAN}╚══════════════════════════════════════════════════╝${NC}"
echo ""
echo "  Region:    $AWS_REGION"
echo "  S3 Bucket: $S3_BUCKET_NAME"
[[ -n "${LAMBDA_FUNCTION_NAME:-}" ]] && echo "  Lambda:    $LAMBDA_FUNCTION_NAME"
[[ -n "${CLOUDFRONT_DISTRIBUTION_ID:-}" ]] && echo "  CloudFront: $CLOUDFRONT_DISTRIBUTION_ID"
echo ""

$DEPLOY_BACKEND  && deploy_backend
$DEPLOY_FRONTEND && deploy_frontend

END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))

echo ""
echo -e "${BOLD}${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${GREEN}  DEPLOYMENT COMPLETE in ${ELAPSED}s${NC}"
echo -e "${BOLD}${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""
