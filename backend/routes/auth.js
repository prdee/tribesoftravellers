const router = require('express').Router();
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const https = require('https');

// Disable SSL certificate validation for development (ONLY FOR DEV!)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

// Lazy init Firebase Admin
let firebaseInitialized = false;
const initFirebase = () => {
  if (!firebaseInitialized && process.env.FIREBASE_PROJECT_ID) {
    // Set environment variable to disable certificate validation
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    firebaseInitialized = true;
  }
};

// POST /api/auth/sync — verify Firebase token, upsert user, return JWT
router.post('/sync', async (req, res) => {
  try {
    initFirebase();
    const { idToken } = req.body;
    const decoded = await admin.auth().verifyIdToken(idToken);

    let user = await User.findOne({ firebaseUid: decoded.uid });
    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        name: decoded.name || decoded.email?.split('@')[0] || 'User',
        email: decoded.email || null,
        phone: decoded.phone_number || null,
        photoURL: decoded.picture || null,
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user._id, name: user.name, role: user.role, photoURL: user.photoURL } });
  } catch (err) {
    res.status(401).json({ message: 'Auth failed', error: err.message });
  }
});

// POST /api/auth/promote-to-admin — Promote user to admin (dev only)
// This endpoint allows the first user to promote themselves to admin
// Remove this in production!
router.post('/promote-to-admin', async (req, res) => {
  try {
    const { email, adminSecret } = req.body;
    
    // Simple security check - use a secret from env
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: 'Invalid admin secret' });
    }
    
    const user = await User.findOneAndUpdate(
      { email },
      { role: 'admin' },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User promoted to admin', user });
  } catch (err) {
    res.status(500).json({ message: 'Error promoting user', error: err.message });
  }
});

module.exports = router;
