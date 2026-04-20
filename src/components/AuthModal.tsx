import { useState } from 'react';
import { type ConfirmationResult } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: Props) {
  const { signInWithGoogle, sendOTP, verifyOTP } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [step, setStep] = useState<'choose' | 'phone' | 'otp'>('choose');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogle = async () => {
    setLoading(true);
    try { await signInWithGoogle(); onClose(); }
    catch (e: unknown) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  const handleSendOTP = async () => {
    setLoading(true); setError('');
    try {
      const result = await sendOTP(phone.startsWith('+') ? phone : `+91${phone}`);
      setConfirmation(result);
      setStep('otp');
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  const handleVerifyOTP = async () => {
    if (!confirmation) return;
    setLoading(true); setError('');
    try { await verifyOTP(confirmation, otp); onClose(); }
    catch (e: unknown) { setError('Invalid OTP. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold font-heading text-[#1A1A1A]">
            {step === 'otp' ? 'Enter OTP' : 'Sign In / Sign Up'}
          </DialogTitle>
        </DialogHeader>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {step === 'choose' && (
          <div className="space-y-4 py-2">
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg py-3 px-4 hover:bg-gray-50 transition font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500">or</span></div>
            </div>

            <button
              onClick={() => setStep('phone')}
              className="w-full border border-gray-200 rounded-lg py-3 px-4 hover:bg-gray-50 transition font-medium flex items-center justify-center gap-2"
            >
              📱 Continue with Phone Number
            </button>
          </div>
        )}

        {step === 'phone' && (
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="flex gap-2">
                <span className="flex items-center px-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 text-sm">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  maxLength={10}
                />
              </div>
            </div>
            <button
              onClick={handleSendOTP}
              disabled={loading || phone.length < 10}
              className="w-full bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
            <button onClick={() => setStep('choose')} className="w-full text-sm text-gray-500 hover:text-gray-700">← Back</button>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-4 py-2">
            <p className="text-sm text-gray-600 text-center">OTP sent to +91 {phone}</p>
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              maxLength={6}
            />
            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.length < 6}
              className="w-full bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button onClick={() => { setStep('phone'); setOtp(''); }} className="w-full text-sm text-gray-500 hover:text-gray-700">← Resend OTP</button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
