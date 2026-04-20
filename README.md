# The Tribes of Travellers 🌍

A complete travel booking platform with admin panel, agent portal, and public booking system.

## ✨ Features

- 🔐 **Firebase Authentication** — Google + Phone OTP
- 👨‍💼 **Admin Panel** — Full CRUD for destinations, packages, hotels, agents, bookings
- 🏢 **Agent Portal** — Package management, bookings, leads, coupons
- 💳 **Razorpay Integration** — Secure payment processing
- 🗺️ **Google Maps** — Hotel location display
- 📱 **Responsive Design** — Mobile-friendly UI
- ☁️ **AWS Deployment** — S3 + CloudFront + Lambda + API Gateway

## 🚀 Quick Start

```bash
# Automated setup (recommended)
./quickstart.sh

# Or manual setup
npm install
cd backend && npm install && cd ..
cd backend && npm run seed:all
```

Then:
```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
npm run dev
```

Visit: http://localhost:5173

## 📚 Documentation

- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** — Complete setup guide
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** — Full project overview
- **[SETUP.md](SETUP.md)** — Detailed setup instructions

## 🗄️ Database

After seeding, you'll have:
- **29 Destinations** (13 domestic + 16 international)
- **21 Packages** with full itineraries
- **10 Hotels** across India and international
- **3 Homepage Banners**

## 🔧 Tech Stack

### Frontend
- React 19 + TypeScript + Vite
- Tailwind CSS + Radix UI
- React Router v7
- Firebase SDK

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Firebase Admin SDK
- Razorpay
- JWT Authentication

### Deployment
- AWS S3 + CloudFront (Frontend)
- AWS Lambda + API Gateway (Backend)
- MongoDB Atlas (Database)

## 📁 Project Structure

```
├── src/
│   ├── pages/
│   │   ├── admin/          # Admin panel (6 pages)
│   │   └── agent/          # Agent portal (6 pages)
│   └── lib/api.ts          # API client
├── backend/
│   ├── models/             # Mongoose models (9 models)
│   ├── routes/             # Express routes (10 routes)
│   ├── scripts/            # Seed scripts
│   ├── lambda.js           # AWS Lambda handler
│   └── server.js           # Express app
├── cicd-deploy.sh          # Complete CI/CD script
└── quickstart.sh           # Automated setup
```

## 🎯 Admin Panel

### Superadmin (`/superadmin`)
- Dashboard with 7 stat cards
- User Management — change roles
- All admin features

### Admin (`/admin`)
- **Dashboard** — Overview stats
- **Destinations** — Full CRUD
- **Packages** — Full CRUD with itineraries
- **Hotels** — Full CRUD with locations
- **Agents** — Verify/manage agents
- **Bookings** — View/update all bookings
- **Leads** — Manage travel agent leads
- **Banners** — Homepage carousel management

### Agent (`/agent`)
- Dashboard with stats
- My Packages — Create/manage packages
- Bookings — View assigned bookings
- My Leads — View assigned leads
- Coupons — Create discount coupons
- Profile — Edit agency details

## 🔐 Environment Setup

### Frontend (`.env.local`)
```bash
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
# ... other Firebase config
```

### Backend (`backend/.env`)
```bash
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="..."
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

## 🚀 Deployment

### First-Time Setup
```bash
# Configure AWS credentials
aws configure

# Create all AWS resources
./cicd-deploy.sh --setup
```

### Deploy Updates
```bash
# Deploy everything
./cicd-deploy.sh

# Deploy only frontend
./cicd-deploy.sh --frontend-only

# Deploy only backend
./cicd-deploy.sh --backend-only
```

## 📊 API Endpoints

- `GET /api/health` — Health check
- `POST /api/auth/sync` — Firebase → JWT
- `GET /api/destinations` — List destinations
- `GET /api/packages` — List packages
- `GET /api/hotels` — List hotels
- `POST /api/bookings` — Create booking
- `GET /api/admin/stats` — Dashboard stats
- ... and 30+ more endpoints

See [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for complete API documentation.

## 🧪 Testing

```bash
# Run backend
cd backend && npm run dev

# Run frontend
npm run dev

# Seed database
cd backend && npm run seed:all
```

## 📝 Creating Admin User

1. Sign in with Google or Phone OTP
2. Go to MongoDB Atlas → Browse Collections → `users`
3. Find your user document
4. Change `role` field to `"superadmin"`
5. Sign out and sign back in
6. Navigate to `/superadmin`

## 🆘 Troubleshooting

### MongoDB Connection Error
- Check `MONGODB_URI` in `backend/.env`
- Whitelist IP in MongoDB Atlas (0.0.0.0/0 for dev)

### Firebase Auth Not Working
- Check all Firebase env vars in `.env.local`
- Ensure Google/Phone auth enabled in Firebase Console

### Build Errors
- Run `npm install` in both root and `backend/`
- Check Node version: `node -v` (should be 18+)

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please read the documentation first.

---

**Built with ❤️ for travelers worldwide**
