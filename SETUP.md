# The Tribes of Travellers — Setup & Deployment Guide

## Local Development

### 1. Install dependencies

```bash
# Frontend
npm install

# Backend
cd backend && npm install
```

### 2. Configure environment

```bash
# Frontend env
cp .env.example .env.local
# Edit .env.local with your Firebase and API URL

# Backend env
cp backend/.env.example backend/.env
# Edit backend/.env with MongoDB, Firebase Admin, Razorpay keys
```

### 3. Seed the database

```bash
# Seed destinations, packages, and banners
cd backend && npm run seed

# Seed hotels
npm run seed:hotels

# Or seed everything at once
npm run seed:all
```

### 4. Run locally

```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5173)
npm run dev
```

---

## AWS Deployment

### Prerequisites

- AWS CLI installed: `brew install awscli`
- AWS configured: `aws configure` (enter Access Key, Secret, Region)
- Node.js 18+, npm, zip installed

### Environment Variables for Deployment

Copy `.env.example` to `.env` and fill in:

```bash
# AWS
AWS_REGION=us-east-1
S3_BUCKET_NAME=yourdomain.com
CLOUDFRONT_DISTRIBUTION_ID=E1234567890ABC   # After CloudFront setup

# Lambda
LAMBDA_FUNCTION_NAME=ttt-backend
API_GATEWAY_ID=abc123def                    # After first-time setup

# App secrets (same as backend/.env)
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="..."
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
CLIENT_URL=https://yourdomain.com
```

### First-Time Setup (creates all AWS resources)

```bash
./cicd-deploy.sh --setup
```

This will:
1. Create S3 bucket with static website hosting
2. Create IAM role for Lambda
3. Package and deploy the backend to Lambda
4. Create HTTP API Gateway pointing to Lambda
5. Print the API URL and API Gateway ID to add to your `.env`

After setup, add the printed values to your `.env`:
```
API_GATEWAY_ID=<printed value>
```

And update your frontend `.env.local`:
```
VITE_API_URL=https://<API_GATEWAY_ID>.execute-api.<REGION>.amazonaws.com/api
```

### CloudFront Setup (HTTPS + CDN)

1. Go to AWS Console → CloudFront → Create Distribution
2. Origin: your S3 bucket website endpoint
3. Default root object: `index.html`
4. Add custom error response: 403/404 → `/index.html` (200 status)
5. Add your domain and ACM certificate
6. Copy the Distribution ID to `.env` as `CLOUDFRONT_DISTRIBUTION_ID`

### Deploy (after first-time setup)

```bash
# Deploy everything (frontend + backend)
./cicd-deploy.sh

# Deploy only frontend
./cicd-deploy.sh --frontend-only

# Deploy only backend
./cicd-deploy.sh --backend-only
```

---

## Admin Access

1. Sign in with Google or Phone OTP
2. Go to AWS Console → MongoDB Atlas → find your user document
3. Change `role` field to `superadmin`
4. Sign out and sign back in
5. Navigate to `/superadmin`

Or use the SuperAdmin Users page to promote users once you have superadmin access.

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | — | Health check |
| POST | `/api/auth/sync` | — | Firebase → JWT |
| GET | `/api/destinations` | — | List destinations |
| GET | `/api/packages` | — | List packages |
| GET | `/api/hotels` | — | List hotels |
| GET | `/api/banners` | — | List banners |
| POST | `/api/leads` | — | Submit agent lead |
| POST | `/api/bookings` | User | Create booking |
| POST | `/api/payments/create-order` | User | Razorpay order |
| POST | `/api/payments/verify` | User | Verify payment |
| GET | `/api/admin/stats` | Admin | Dashboard stats |
| GET | `/api/admin/users` | Superadmin | All users |
| GET | `/api/agents/all` | Admin | All agents |
| PUT | `/api/admin/agents/:id/verify` | Admin | Verify agent |

---

## Project Structure

```
├── src/                    # React frontend
│   ├── pages/
│   │   ├── admin/          # Admin panel pages
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminBanners.tsx
│   │   │   ├── AdminDestinations.tsx  ← NEW
│   │   │   ├── AdminPackages.tsx      ← NEW
│   │   │   ├── AdminHotels.tsx        ← NEW
│   │   │   ├── AdminAgents.tsx        ← NEW
│   │   │   ├── AdminBookings.tsx      ← NEW
│   │   │   ├── AdminLeads.tsx
│   │   │   ├── AdminSettings.tsx      ← NEW
│   │   │   └── SuperAdminUsers.tsx
│   │   └── agent/          # Agent portal pages
│   └── lib/api.ts          # API client
├── backend/
│   ├── models/             # Mongoose models
│   ├── routes/             # Express routes
│   ├── middleware/auth.js  # JWT + role middleware
│   ├── scripts/
│   │   ├── seed.js         # Seed destinations, packages, banners
│   │   └── seedHotels.js   # Seed hotels ← NEW
│   ├── lambda.js           # AWS Lambda handler ← NEW
│   └── server.js           # Express app
├── cicd-deploy.sh          # Full CI/CD deploy script ← NEW
├── deploy.sh               # Frontend-only first deploy
└── redeploy.sh             # Frontend-only redeploy
```
