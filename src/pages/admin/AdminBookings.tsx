import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface Booking {
  _id: string;
  status: string;
  amount: number;
  travelDate: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  razorpayPaymentId: string;
  packageId: { name: string; image: string; destination: string } | null;
  userId: { name: string; email: string } | null;
  agentId: { name: string } | null;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const load = () => api.get('/bookings').then(d => Array.isArray(d) && setBookings(d)).catch(() => {});
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await api.put(`/bookings/${id}/status`, { status });
    load();
  };

  const filtered = bookings.filter(b => {
    const matchStatus = filter === 'all' || b.status === filter;
    const matchSearch = !search ||
      b.contactName?.toLowerCase().includes(search.toLowerCase()) ||
      b.packageId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.razorpayPaymentId?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalRevenue = bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading text-[#1A1A1A]">All Bookings</h1>
        <div className="text-sm text-gray-500">
          Confirmed Revenue: <span className="font-bold text-[#FF6B00]">₹{totalRevenue.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, package, payment ID..."
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B00]" />
        <div className="flex gap-2">
          {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition capitalize ${filter === s ? 'bg-[#FF6B00] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['Package', 'Customer', 'Agent', 'Amount', 'Travel Date', 'Payment ID', 'Status', 'Actions'].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(b => (
              <tr key={b._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-[#1A1A1A] max-w-[160px] truncate">{b.packageId?.name || 'N/A'}</p>
                  <p className="text-xs text-gray-400">{b.packageId?.destination}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{b.contactName}</p>
                  <p className="text-xs text-gray-400">{b.contactPhone}</p>
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs">{b.agentId?.name || '—'}</td>
                <td className="px-4 py-3 font-semibold text-[#FF6B00]">₹{b.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">
                  {b.travelDate ? new Date(b.travelDate).toLocaleDateString('en-IN') : '—'}
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                  {b.razorpayPaymentId ? b.razorpayPaymentId.slice(0, 12) + '...' : '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                </td>
                <td className="px-4 py-3">
                  <select value={b.status} onChange={e => updateStatus(b._id, e.target.value)}
                    className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#FF6B00]">
                    {['pending', 'confirmed', 'cancelled', 'completed'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-gray-400 py-12">No bookings found.</p>}
      </div>
    </div>
  );
}
