import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface Props {
  open: boolean;
  onClose: () => void;
  pkg: { _id?: string; id?: string; name: string; price: number; agentId?: string } | null;
}

declare global {
  interface Window { Razorpay: new (options: Record<string, unknown>) => { open: () => void }; }
}

export default function BookingModal({ open, onClose, pkg }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ contactName: '', contactPhone: '', contactEmail: '', travelDate: '', travellers: 1 });
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  const handlePay = async () => {
    if (!pkg || !user) return;
    setLoading(true);
    try {
      const totalAmount = pkg.price * form.travellers;
      const { orderId, key } = await api.post('/payments/create-order', { amount: totalAmount });

      // Create pending booking
      const booking = await api.post('/bookings', {
        packageId: pkg._id || pkg.id,
        agentId: pkg.agentId,
        amount: totalAmount,
        ...form,
        travellers: Array.from({ length: form.travellers }, (_, i) => ({ name: `Traveller ${i + 1}`, type: 'adult' })),
      });

      // Load Razorpay script if not loaded
      if (!window.Razorpay) {
        await new Promise<void>((resolve) => {
          const s = document.createElement('script');
          s.src = 'https://checkout.razorpay.com/v1/checkout.js';
          s.onload = () => resolve();
          document.body.appendChild(s);
        });
      }

      const rzp = new window.Razorpay({
        key,
        amount: totalAmount * 100,
        currency: 'INR',
        name: 'The Tribes of Travellers',
        description: pkg.name,
        order_id: orderId,
        prefill: { name: form.contactName, email: form.contactEmail, contact: form.contactPhone },
        theme: { color: '#FF6B00' },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          await api.post('/payments/verify', {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            bookingId: booking._id,
          });
          onClose();
          navigate(`/booking/success/${booking._id}`);
        },
      });
      rzp.open();
    } catch (e) {
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle className="font-heading text-[#1A1A1A]">Book: {pkg?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {[
            { key: 'contactName', label: 'Your Name', type: 'text' },
            { key: 'contactPhone', label: 'Phone Number', type: 'tel' },
            { key: 'contactEmail', label: 'Email', type: 'email' },
            { key: 'travelDate', label: 'Travel Date', type: 'date' },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type={type} value={(form as Record<string, string | number>)[key]}
                onChange={e => set(key, e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Travellers</label>
            <input type="number" min={1} max={20} value={form.travellers}
              onChange={e => set('travellers', Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]" />
          </div>

          <div className="bg-orange-50 rounded-lg p-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Amount</span>
            <span className="text-xl font-bold text-[#FF6B00]">₹{((pkg?.price || 0) * form.travellers).toLocaleString()}</span>
          </div>

          <button onClick={handlePay} disabled={loading || !form.contactName || !form.contactPhone}
            className="w-full bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50">
            {loading ? 'Processing...' : `Pay ₹${((pkg?.price || 0) * form.travellers).toLocaleString()}`}
          </button>
          <p className="text-xs text-center text-gray-400">Secured by Razorpay · Test mode active</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
