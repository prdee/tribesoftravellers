#!/bin/bash
# Quick Start Script for The Tribes of Travellers

set -e

echo "🚀 The Tribes of Travellers — Quick Start"
echo "=========================================="
echo ""

# Check if backend/.env exists
if [ ! -f backend/.env ]; then
    echo "❌ backend/.env not found!"
    echo "📝 Creating from template..."
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env"
    echo ""
    echo "⚠️  IMPORTANT: Edit backend/.env and add your:"
    echo "   - MONGODB_URI"
    echo "   - JWT_SECRET"
    echo "   - FIREBASE_* keys"
    echo "   - RAZORPAY_* keys (optional for now)"
    echo ""
    echo "Then run this script again."
    exit 1
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found!"
    echo "📝 Creating from template..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your Firebase web config"
    echo ""
    echo "Then run this script again."
    exit 1
fi

# Check if MongoDB URI is configured
if grep -q "mongodb+srv://<user>:<password>" backend/.env; then
    echo "❌ MongoDB URI not configured in backend/.env"
    echo "📝 Please update MONGODB_URI with your actual connection string"
    exit 1
fi

echo "✅ Environment files configured"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo ""

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

echo "✅ Dependencies installed"
echo ""

# Seed database
echo "🌱 Seeding database..."
echo ""
cd backend

if npm run seed:all; then
    echo ""
    echo "✅ Database seeded successfully!"
    echo ""
    echo "📊 Your database now has:"
    echo "   - 29 destinations (13 domestic + 16 international)"
    echo "   - 21 packages with full itineraries"
    echo "   - 3 homepage banners"
    echo "   - 10 premium hotels"
    echo ""
else
    echo ""
    echo "❌ Database seeding failed!"
    echo "Please check your MONGODB_URI in backend/.env"
    exit 1
fi

cd ..

echo "🎉 Setup complete!"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Start the backend:"
echo "   cd backend && npm run dev"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   npm run dev"
echo ""
echo "3. Visit http://localhost:5173"
echo ""
echo "4. Sign in with Google or Phone OTP"
echo ""
echo "5. To become admin:"
echo "   - Go to MongoDB Atlas → Browse Collections → users"
echo "   - Find your user and change role to 'superadmin'"
echo "   - Sign out and back in"
echo "   - Visit http://localhost:5173/superadmin"
echo ""
echo "📖 For deployment to AWS, see DEPLOYMENT_CHECKLIST.md"
echo ""
