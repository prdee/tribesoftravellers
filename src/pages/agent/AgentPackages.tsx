import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface Pkg { _id: string; name: string; destination: string; days: number; price: number; isActive: boolean; }
const emptyPkg = { name: '', destination: '', days: 5, nights: 4, price: 0, duration: '', inclusions: [], image: '', tags: [], overview: '', slug: '' };

export default function AgentPackages() {
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [form, setForm] = useState({ ...emptyPkg });
  const [adding, setAdding] = useState(false);

  const load = () => api.get('/agents/packages').then(d => Array.isArray(d) && setPackages(d)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    const slug = form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
    await api.post('/packages', { ...form, slug, duration: `${form.nights} Nights/${form.days} Days` });
    setForm({ ...emptyPkg }); setAdding(false); load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this package?')) return;
    await api.delete(`/packages/${id}`); load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading text-[#1A1A1A]">My Packages</h1>
        <button onClick={() => setAdding(!adding)} className="flex items-center gap-2 bg-[#FF6B00] text-white px-4 py-2 rounded-lg hover:bg-[#E55A00] transition text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Package
        </button>
      </div>

      {adding && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'name', label: 'Package Name', type: 'text' },
            { key: 'destination', label: 'Destination', type: 'text' },
            { key: 'days', label: 'Days', type: 'number' },
            { key: 'nights', label: 'Nights', type: 'number' },
            { key: 'price', label: 'Price (₹)', type: 'number' },
            { key: 'image', label: 'Image URL', type: 'text' },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input type={type} value={(form as unknown as Record<string, string | number>)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]" />
            </div>
          ))}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Overview</label>
            <textarea value={form.overview} onChange={e => setForm(f => ({ ...f, overview: e.target.value }))}
              rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]" />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button onClick={handleAdd} className="bg-[#FF6B00] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#E55A00] transition">Save Package</button>
            <button onClick={() => setAdding(false)} className="border border-gray-200 px-6 py-2 rounded-lg text-sm hover:bg-gray-50 transition">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['Package', 'Destination', 'Duration', 'Price', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {packages.map(p => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-[#1A1A1A]">{p.name}</td>
                <td className="px-4 py-3 text-gray-600">{p.destination}</td>
                <td className="px-4 py-3 text-gray-600">{p.days} Days</td>
                <td className="px-4 py-3 font-semibold text-[#FF6B00]">₹{p.price.toLocaleString()}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button className="text-blue-400 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(p._id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {packages.length === 0 && <p className="text-center text-gray-400 py-12">No packages yet. Add your first one!</p>}
      </div>
    </div>
  );
}
