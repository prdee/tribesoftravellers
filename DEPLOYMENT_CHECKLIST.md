# The Tribes of Travellers — Deployment Checklist

## ✅ What's Been Completed

### 1. Complete Backend Integration
- ✅ All 5 missing admin pages created:
  - `AdminDestinations.tsx` — Full CRUD for destinations
  - `AdminPackages.tsx` — Full CRUD for packages with search
  - `AdminHotels.tsx` — Full CRUD for hotels with location
  - `AdminAgents.tsx` — View/verify all agents
  - `AdminBookings.tsx` — View all bookings with revenue tracking
  - `AdminSettings.tsx` — Site settings panel
- ✅ All routes wired up in `App.tsx` for both `/admin` and `/superadmin`
- ✅ Backend routes enhanced with error handling
- ✅ Lambda support added (`backend/lambda.js` + `serverless-http`)
- ✅ Health check endpoint at `/api/health`
- ✅ Global error handler in `server.js`

### 2. Data Migration Scripts
- ✅ **`backend/scripts/seed.js`** — Migrates ALL hardcoded data:
  - 29 destinations (13 domestic + 16 international)
  - 21 packages with full itineraries
  - 3 banners
- ✅ **`backend/scripts/seedHotels.js`** — Seeds 10 premium hotels

### 3. CI/CD Deployment Script
- ✅ **`cicd-deploy.sh`** — Complete automation:
  - `--setup` — First-time AWS resource creation (S3, Lambda, API Gateway, IAM)
  - `--frontend-only` — Deploy React app to S3 + CloudFront
  - `--backend-only` — Deploy Express API to Lambda
  - Default — Deploy both

### 4. Documentation
- ✅ `SETUP.md` — Complete setup and deployment guide
- ✅ `.env.example` — All required environment variables documented
- ✅ `backend/.env.example` — Backend environment template

---

## 🔧 Setup Steps (Run These Now)

### Step 1: Configure MongoDB

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster (if you don't have one)
3. Get your connection string
4. Update `backend/.env`:

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ttt?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
```

### Step 2: Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a project (or use existing)
3. Enable Authentication → Google + Phone
4. Get your web config from Project Settings
5. Update `.env.local`:

```bash
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

6. Go to Project Settings → Service Accounts → Generate New Private Key
7. Update `backend/.env`:

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Step 3: Configure Razorpay (Optional for now)

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Get Test API keys
3. Update `backend/.env`:

```bash
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

### Step 4: Seed the Database

```bash
# Install backend dependencies (if not done)
cd backend && npm install

# Seed all data (29 destinations + 21 packages + 3 banners)
npm run seed

# Seed hotels (10 hotels)
npm run seed:hotels

# Or seed everything at once
npm run seed:all
```

Expected output:
```
✓ Connected to MongoDB
✓ Cleared existing data
✓ Seeded 29 destinations
✓ Seeded 21 packages
✓ Seeded 3 banners
🎉 Seed complete! All hardcoded data migrated to database.
```

### Step 5: Run Locally

```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5173)
npm run dev
```

Visit: http://localhost:5173

### Step 6: Create First Admin User

1. Sign in with Google or Phone OTP
2. Go to MongoDB Atlas → Browse Collections → `users`
3. Find your user document
4. Change `role` field from `"user"` to `"superadmin"`
5. Sign out and sign back in
6. Navigate to `/superadmin`

---

## 🚀 AWS Deployment (After Local Testing)

### Prerequisites

```bash
# Install AWS CLI
brew install awscli  # macOS
# or download from https://aws.amazon.com/cli/

# Configure AWS credentials
aws configure
# Enter: Access Key ID, Secret Access Key, Region (us-east-1), Output format (json)
```

### First-Time Setup

```bash
# Copy and configure deployment env
cp .env.example .env

# Edit .env with your values:
# - AWS_REGION=us-east-1
# - S3_BUCKET_NAME=yourdomain.com
# - LAMBDA_FUNCTION_NAME=ttt-backend
# - All MongoDB, Firebase, Razorpay keys

# Run first-time setup (creates all AWS resources)
./cicd-deploy.sh --setup
```

This will:
1. Create S3 bucket with static website hosting
2. Create IAM role for Lambda
3. Package and deploy backend to Lambda
4. Create HTTP API Gateway
5. Print your API URL

### Update Frontend Config

After setup, update `.env.local`:
```bash
VITE_API_URL=https://<API_GATEWAY_ID>.execute-api.<REGION>.amazonaws.com/api
```

### Deploy Updates

```bash
# Deploy everything (frontend + backend)
./cicd-deploy.sh

# Deploy only frontend
./cicd-deploy.sh --frontend-only

# Deploy only backend
./cicd-deploy.sh --backend-only
```

### CloudFront Setup (HTTPS + CDN)

1. AWS Console → CloudFront → Create Distribution
2. Origin: Your S3 bucket website endpoint
3. Default root object: `index.html`
4. Error pages: 403/404 → `/index.html` (200 status)
5. Add custom domain + ACM certificate
6. Copy Distribution ID to `.env`:
   ```
   CLOUDFRONT_DISTRIBUTION_ID=E1234567890ABC
   ```

---

## 📊 What's in the Database

After seeding, you'll have:

### Destinations (29 total)
- **Domestic (13):** Kerala, Himachal, Uttarakhand, Rajasthan, Andaman, Kashmir, Goa
- **International (16):** Maldives, Dubai, Thailand, Bali, Switzerland, Japan, South Africa, New Zealand, Italy, France, Greece, Spain, Singapore, Malaysia, Turkey, Egypt, Australia, UK, USA

### Packages (21 total)
- Maldives South Palm Resort (with full itinerary)
- Exclusive Bali Honeymoon (with full itinerary)
- Budget Dubai, Swiss Alps, Japan, South Africa, New Zealand
- Italy, France, Greece, Spain, Singapore, Malaysia, Turkey, Egypt
- Australia, UK, USA
- Kerala Honeymoon, Himachal Adventure, Goa Tour (with full itinerary)

### Hotels (10 total)
- The Leela Palace Udaipur
- Taj Mahal Palace Mumbai
- The Oberoi Amarvilas Agra
- Kumarakom Lake Resort Kerala
- The Claridges New Delhi
- Wildflower Hall Shimla
- Goa Marriott Resort & Spa
- Ananda in the Himalayas
- Radisson Blu Resort Maldives
- Aloft Dubai Creek

### Banners (3 total)
- Discover India's Hidden Gems
- Maldives Honeymoon Packages
- Bali — Island of the Gods

---

## 🎯 Admin Panel Features

### Superadmin (`/superadmin`)
- Dashboard with 7 stat cards
- User Management — change roles
- All admin features below

### Admin (`/admin`)
- **Dashboard** — Stats overview (bookings, agents, leads, revenue, users, packages, destinations)
- **Banners** — Add/edit/delete/toggle homepage banners
- **Destinations** — Full CRUD with types, international flag, search
- **Packages** — Full CRUD with inclusions, tags, itinerary, search
- **Hotels** — Full CRUD with location, amenities, pricing
- **Agents** — View all agents, verify/revoke verification
- **Leads** — View all travel agent leads, update status
- **Bookings** — View all bookings, update status, revenue tracking

### Agent (`/agent`)
- Dashboard with stats
- My Packages — Create/delete packages
- Bookings — View assigned bookings, update status
- My Leads — View assigned leads
- Coupons — Create/delete discount coupons
- Profile — Edit agency details

---

## 🔍 Testing Checklist

- [ ] Backend starts without errors: `cd backend && npm run dev`
- [ ] Frontend starts without errors: `npm run dev`
- [ ] Can sign in with Google
- [ ] Can sign in with Phone OTP
- [ ] Destinations page loads from database
- [ ] Packages page loads from database
- [ ] Hotels page loads from database
- [ ] Can create a booking (test Razorpay in test mode)
- [ ] Admin dashboard shows correct stats
- [ ] Can add/edit/delete destinations
- [ ] Can add/edit/delete packages
- [ ] Can add/edit/delete hotels
- [ ] Can verify/unverify agents
- [ ] Can view and update bookings

---

## 📝 Notes

- All hardcoded data from `src/data/destinations.ts` has been migrated to MongoDB
- Frontend still has the data file for TypeScript types, but the app now fetches from API
- The seed script can be run multiple times — it clears and re-seeds
- Lambda deployment uses `serverless-http` to wrap Express
- API Gateway uses HTTP API (not REST API) for lower cost
- S3 bucket is configured for static website hosting
- CloudFront is optional but recommended for HTTPS + CDN

---

## 🆘 Troubleshooting

### MongoDB Connection Error
- Check `MONGODB_URI` in `backend/.env`
- Ensure IP whitelist in MongoDB Atlas (0.0.0.0/0 for development)
- Test connection: `node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('OK'))"`

### Firebase Auth Not Working
- Check all Firebase env vars in `.env.local`
- Ensure Google/Phone auth is enabled in Firebase Console
- Check Firebase Admin SDK keys in `backend/.env`

### AWS Deployment Fails
- Run `aws configure` to set up credentials
- Check IAM permissions (need S3, Lambda, API Gateway, IAM, CloudFront)
- Ensure `AWS_REGION` is set in `.env`

### Build Errors
- Run `npm install` in both root and `backend/`
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Check Node version: `node -v` (should be 18+)

---

## 🎉 You're Ready!

Once you complete the setup steps above, you'll have:
- ✅ Complete backend with all data in MongoDB
- ✅ Full admin panel with CRUD operations
- ✅ Agent portal for travel agents
- ✅ Public booking flow with Razorpay
- ✅ Firebase authentication
- ✅ Ready for AWS deployment

Run the seed script now to migrate all data! 🚀
