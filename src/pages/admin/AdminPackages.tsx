import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Plus, Trash2, Edit2, X, Check, ToggleLeft, ToggleRight } from 'lucide-react';

interface Package {
  _id: string;
  name: string;
  slug: string;
  destination: string;
  duration: string;
  nights: number;
  days: number;
  price: number;
  originalPrice?: number;
  inclusions: string[];
  image: string;
  rating: number;
  reviews: number;
  tags: string[];
  overview: string;
  isActive: boolean;
}

const empty = {
  name: '', slug: '', destination: '', duration: '', nights: 4, days: 5,
  price: 0, originalPrice: 0, inclusions: '', image: '', rating: 4.0,
  reviews: 0, tags: '', overview: '', isActive: true,
};

export default function AdminPackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [form, setForm] = useState({ ...empty });
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = () => api.get('/packages').then(d => Array.isArray(d) && setPackages(d)).catch(() => setError('Failed to load packages'));
  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm({ ...empty }); setEditId(null); setShowForm(false); setError(''); };

  const handleEdit = (p: Package) => {
    setForm({
      name: p.name, slug: p.slug, destination: p.destination, duration: p.duration,
      nights: p.nights, days: p.days, price: p.price, originalPrice: p.originalPrice || 0,
      inclusions: p.inclusions.join(', '), image: p.image, rating: p.rating,
      reviews: p.reviews, tags: p.tags.join(', '), overview: p.overview, isActive: p.isActive,
    });
    setEditId(p._id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.slug) return setError('Name and slug are required');
    setLoading(true);
    try {
      const payload = {
        ...form,
        inclusions: form.inclusions.split(',').map(s => s.trim()).filter(Boolean),
        tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
        duration: form.duration || `${form.nights} Nights/${form.days} Days`,
        originalPrice: form.originalPrice || undefined,
      };
      if (editId) {
        await api.put(`/packages/${editId}`, payload);
      } else {
        await api.post('/packages', payload);
      }
      resetForm();
      load();
    } catch {
      setError('Failed to save package');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this package?')) return;
    await api.delete(`/packages/${id}`);
    load();
  };

  const handleToggle = async (p: Package) => {
    await api.put(`/packages/${p._id}`, { isActive: !p.isActive });
    load();
  };

  const filtered = packages.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading text-[#1A1A1A]">Packages</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-[#FF6B00] text-white px-4 py-2 rounded-lg hover:bg-[#E55A00] transition text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Package
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

      <div className="mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search packages..."
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B00]" />
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#1A1A1A]">{editId ? 'Edit Package' : 'New Package'}</h2>
            <button onClick={resetForm}><X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'name', label: 'Package Name', type: 'text' },
              { key: 'slug', label: 'Slug (URL)', type: 'text' },
              { key: 'destination', label: 'Destination', type: 'text' },
              { key: 'duration', label: 'Duration (e.g. 4 Nights/5 Days)', type: 'text' },
              { key: 'nights', label: 'Nights', type: 'number' },
              { key: 'days', label: 'Days', type: 'number' },
              { key: 'price', label: 'Price (₹)', type: 'number' },
              { key: 'originalPrice', label: 'Original Price (₹, optional)', type: 'number' },
              { key: 'image', label: 'Main Image URL', type: 'text' },
              { key: 'rating', label: 'Rating (0-5)', type: 'number' },
              { key: 'reviews', label: 'Review Count', type: 'number' },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input type={type} value={(form as Record<string, string | number | boolean>)[key] as string | number}
                  onChange={e => setForm(f => ({ ...f, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Inclusions (comma-separated)</label>
              <input value={form.inclusions} onChange={e => setForm(f => ({ ...f, inclusions: e.target.value }))}
                placeholder="3 Stars, Breakfast, Transfers"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tags (comma-separated)</label>
              <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                placeholder="honeymoon, luxury, nature"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Overview</label>
              <textarea value={form.overview} onChange={e => setForm(f => ({ ...f, overview: e.target.value }))}
                rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 accent-[#FF6B00]" />
              <label htmlFor="isActive" className="text-sm text-gray-700">Active (visible to users)</label>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} disabled={loading}
              className="flex items-center gap-2 bg-[#FF6B00] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#E55A00] transition disabled:opacity-50">
              <Check className="w-4 h-4" /> {loading ? 'Saving...' : 'Save'}
            </button>
            <button onClick={resetForm} className="border border-gray-200 px-6 py-2 rounded-lg text-sm hover:bg-gray-50 transition">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['Image', 'Package', 'Destination', 'Duration', 'Price', 'Rating', 'Status', 'Actions'].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(p => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="px-4 py-3"><img src={p.image} alt={p.name} className="w-16 h-10 object-cover rounded" /></td>
                <td className="px-4 py-3 font-medium text-[#1A1A1A] max-w-[200px] truncate">{p.name}</td>
                <td className="px-4 py-3 text-gray-600">{p.destination}</td>
                <td className="px-4 py-3 text-gray-600">{p.duration}</td>
                <td className="px-4 py-3 font-semibold text-[#FF6B00]">₹{p.price.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-600">⭐ {p.rating}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleToggle(p)} className={`flex items-center gap-1 text-xs font-medium ${p.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                    {p.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    {p.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleEdit(p)} className="text-blue-400 hover:text-blue-600 transition"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(p._id)} className="text-red-400 hover:text-red-600 transition"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-gray-400 py-12">No packages found.</p>}
      </div>
    </div>
  );
}
