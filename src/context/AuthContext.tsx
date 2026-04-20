import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  signInWithPopup, GoogleAuthProvider, signInWithPhoneNumber,
  RecaptchaVerifier, type ConfirmationResult, signOut as firebaseSignOut,
  onAuthStateChanged, type User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { api } from '../lib/api';

interface AuthUser {
  id: string;
  name: string;
  role: string;
  photoURL?: string;
  email?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  sendOTP: (phone: string) => Promise<ConfirmationResult>;
  verifyOTP: (confirmation: ConfirmationResult, otp: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const syncWithBackend = async (firebaseUser: FirebaseUser) => {
    try {
      const idToken = await firebaseUser.getIdToken();
      const data = await api.post('/auth/sync', { idToken });
      if (data.token) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
      }
    } catch (err) {
      console.error('Failed to sync with backend:', err);
      // Continue without backend sync - user can still use app
    }
  };

  useEffect(() => {
    let unsub: (() => void) | undefined;
    
    try {
      unsub = onAuthStateChanged(auth, async (firebaseUser) => {
        try {
          if (firebaseUser) {
            await syncWithBackend(firebaseUser);
          } else {
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (err) {
          console.error('Auth state change error:', err);
        } finally {
          setLoading(false);
        }
      });
    } catch (err) {
      console.error('Firebase auth initialization error:', err);
      setLoading(false);
    }
    
    return () => unsub?.();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const sendOTP = async (phone: string): Promise<ConfirmationResult> => {
    const recaptcha = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
    return signInWithPhoneNumber(auth, phone, recaptcha);
  };

  const verifyOTP = async (confirmation: ConfirmationResult, otp: string) => {
    await confirmation.confirm(otp);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, sendOTP, verifyOTP, signOut }}>
      <div id="recaptcha-container" />
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
