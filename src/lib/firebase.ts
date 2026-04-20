import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate Firebase config
const isFirebaseConfigValid = Object.values(firebaseConfig).every(val => val && val !== 'undefined');

if (!isFirebaseConfigValid) {
  console.warn('Firebase configuration is incomplete. Some features may not work.');
}

let app;
let auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (err) {
  console.error('Failed to initialize Firebase:', err);
  // Create a dummy auth object to prevent crashes
  auth = null as any;
}

export { auth };
