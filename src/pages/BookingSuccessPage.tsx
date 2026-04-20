import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { api } from '../lib/api';

export default function BookingSuccessPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState<{ contactName: string; amount: number; packageId: { name: string } | null } | null>(null);

  useEffect(() => {
    if (id) api.get(`/bookings/${id}`).then(setBooking).catch(() => {});
  }, [id]);

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-12 text-center max-w-md w-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold font-heading text-[#1A1A1A] mb-2">Booking Confirmed!</h1>
        {booking && (
          <>
            <p className="text-gray-600 mb-1">Hi <strong>{booking.contactName}</strong>,</p>
            <p className="text-gray-600 mb-4">Your booking for <strong>{booking.packageId?.name}</strong> is confirmed.</p>
            <div className="bg-orange-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500">Amount Paid</p>
              <p className="text-2xl font-bold text-[#FF6B00]">₹{booking.amount.toLocaleString()}</p>
            </div>
          </>
        )}
        <p className="text-xs text-gray-400 mb-6">Booking ID: {id}</p>
        <Link to="/" className="inline-block bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold px-8 py-3 rounded-lg transition">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
