import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Plus, Trash2 } from 'lucide-react';

interface Coupon { _id: string; code: string; discountPercent: number; maxUses: number; usedCount: number; expiresAt: string; isActive: boolean; }
const emptyForm = { code: '', discountPercent: 10, maxUses: 100, expiresAt: '' };

export default function AgentCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [adding, setAdding] = useState(false);

  const load = () => api.get('/agents/coupons').then(d => Array.isArray(d) && setCoupons(d)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    await api.post('/agents/coupons', form);
    setForm({ ...emptyForm }); setAdding(false); load();
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/agents/coupons/${id}`); load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading text-[#1A1A1A]">My Coupons</h1>
        <button onClick={() => setAdding(!adding)} className="flex items-center gap-2 bg-[#FF6B00] text-white px-4 py-2 rounded-lg hover:bg-[#E55A00] transition text-sm font-medium">
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      {adding && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'code', label: 'Coupon Code (e.g. SUMMER10)', type: 'text' },
            { key: 'discountPercent', label: 'Discount %', type: 'number' },
            { key: 'maxUses', label: 'Max Uses', type: 'number' },
            { key: 'expiresAt', label: 'Expiry Date', type: 'date' },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input type={type} value={(form as Record<string, string | number>)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]" />
            </div>
          ))}
          <div className="md:col-span-2 flex gap-3">
            <button onClick={handleAdd} className="bg-[#FF6B00] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#E55A00] transition">Create</button>
            <button onClick={() => setAdding(false)} className="border border-gray-200 px-6 py-2 rounded-lg text-sm hover:bg-gray-50 transition">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map(c => (
          <div key={c._id} className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-[#FF6B00]">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xl font-bold font-heading text-[#FF6B00] tracking-wider">{c.code}</p>
                <p className="text-sm text-gray-500">{c.discountPercent}% off</p>
              </div>
              <button onClick={() => handleDelete(c._id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Used: {c.usedCount} / {c.maxUses}</p>
              {c.expiresAt && <p>Expires: {new Date(c.expiresAt).toLocaleDateString('en-IN')}</p>}
              <span className={`inline-block px-2 py-0.5 rounded-full font-medium ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {c.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
        {coupons.length === 0 && <p className="text-gray-400 col-span-3 text-center py-12">No coupons yet.</p>}
      </div>
    </div>
  );
}
