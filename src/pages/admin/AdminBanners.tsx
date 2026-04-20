import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

interface Banner { _id: string; imageUrl: string; title: string; subtitle: string; ctaText: string; ctaLink: string; order: number; isActive: boolean; }
const empty = { imageUrl: '', title: '', subtitle: '', ctaText: '', ctaLink: '', order: 0, isActive: true };

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [form, setForm] = useState(empty);
  const [adding, setAdding] = useState(false);

  const load = () => api.get('/banners').then(setBanners).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    await api.post('/banners', form);
    setForm(empty); setAdding(false); load();
  };

  const handleToggle = async (b: Banner) => {
    await api.put(`/banners/${b._id}`, { isActive: !b.isActive });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    await api.delete(`/banners/${id}`);
    load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading text-[#1A1A1A]">Banners</h1>
        <button onClick={() => setAdding(!adding)} className="flex items-center gap-2 bg-[#FF6B00] text-white px-4 py-2 rounded-lg hover:bg-[#E55A00] transition text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      {adding && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['imageUrl', 'title', 'subtitle', 'ctaText', 'ctaLink'] as const).map(field => (
            <div key={field}>
              <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
              <input value={form[field] as string} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]" />
            </div>
          ))}
          <div className="md:col-span-2 flex gap-3">
            <button onClick={handleAdd} className="bg-[#FF6B00] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#E55A00] transition">Save</button>
            <button onClick={() => setAdding(false)} className="border border-gray-200 px-6 py-2 rounded-lg text-sm hover:bg-gray-50 transition">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['Preview', 'Title', 'CTA', 'Order', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {banners.map(b => (
              <tr key={b._id} className="hover:bg-gray-50">
                <td className="px-4 py-3"><img src={b.imageUrl} alt="" className="w-20 h-12 object-cover rounded" /></td>
                <td className="px-4 py-3 font-medium text-[#1A1A1A]">{b.title}</td>
                <td className="px-4 py-3 text-gray-500">{b.ctaText}</td>
                <td className="px-4 py-3 text-gray-500">{b.order}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleToggle(b)} className={`flex items-center gap-1 text-xs font-medium ${b.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                    {b.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    {b.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(b._id)} className="text-red-400 hover:text-red-600 transition"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {banners.length === 0 && <p className="text-center text-gray-400 py-12">No banners yet. Add one above.</p>}
      </div>
    </div>
  );
}
