import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface Booking { _id: string; status: string; amount: number; travelDate: string; contactName: string; packageId: { name: string; image: string } | null; createdAt: string; }

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
};

export default function AgentBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const load = () => api.get('/bookings/agent').then(d => Array.isArray(d) && setBookings(d)).catch(() => {});
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await api.put(`/bookings/${id}/status`, { status }); load();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold font-heading text-[#1A1A1A] mb-6">My Bookings</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['Package', 'Customer', 'Amount', 'Travel Date', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {bookings.map(b => (
              <tr key={b._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{b.packageId?.name || 'N/A'}</td>
                <td className="px-4 py-3 text-gray-600">{b.contactName}</td>
                <td className="px-4 py-3 font-semibold text-[#FF6B00]">₹{b.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-600">{b.travelDate ? new Date(b.travelDate).toLocaleDateString('en-IN') : '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                </td>
                <td className="px-4 py-3">
                  <select value={b.status} onChange={e => updateStatus(b._id, e.target.value)}
                    className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#FF6B00]">
                    {['pending', 'confirmed', 'cancelled', 'completed'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && <p className="text-center text-gray-400 py-12">No bookings yet.</p>}
      </div>
    </div>
  );
}
