import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';

interface Destination {
  _id: string;
  name: string;
  slug: string;
  type: string[];
  image: string;
  packages: number;
  startingPrice: number;
  bestTime: string;
  rating: number;
  travelers: number;
  description: string;
  isInternational: boolean;
}

const empty: Omit<Destination, '_id'> = {
  name: '', slug: '', type: [], image: '', packages: 0,
  startingPrice: 0, bestTime: '', rating: 4.0, travelers: 0,
  description: '', isInternational: false,
};

const TYPE_OPTIONS = ['honeymoon', 'family', 'adventure', 'nature', 'luxury', 'culture', 'religious', 'friends', 'water-activities', 'shopping', 'wildlife'];

export default function AdminDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [form, setForm] = useState({ ...empty });
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = () => api.get('/destinations').then(setDestinations).catch(() => setError('Failed to load destinations'));
  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm({ ...empty }); setEditId(null); setShowForm(false); setError(''); };

  const handleEdit = (d: Destination) => {
    setForm({ name: d.name, slug: d.slug, type: d.type, image: d.image, packages: d.packages, startingPrice: d.startingPrice, bestTime: d.bestTime, rating: d.rating, travelers: d.travelers, description: d.description, isInternational: d.isInternational });
    setEditId(d._id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.slug) return setError('Name and slug are required');
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/destinations/${editId}`, form);
      } else {
        await api.post('/destinations', form);
      }
      resetForm();
      load();
    } catch {
      setError('Failed to save destination');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this destination?')) return;
    await api.delete(`/destinations/${id}`);
    load();
  };

  const toggleType = (t: string) => {
    setForm(f => ({ ...f, type: f.type.includes(t) ? f.type.filter(x => x !== t) : [...f.type, t] }));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading text-[#1A1A1A]">Destinations</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-[#FF6B00] text-white px-4 py-2 rounded-lg hover:bg-[#E55A00] transition text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Destination
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#1A1A1A]">{editId ? 'Edit Destination' : 'New Destination'}</h2>
            <button onClick={resetForm}><X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'name', label: 'Name', type: 'text' },
              { key: 'slug', label: 'Slug (URL)', type: 'text' },
              { key: 'image', label: 'Image URL', type: 'text' },
              { key: 'bestTime', label: 'Best Time to Visit', type: 'text' },
              { key: 'startingPrice', label: 'Starting Price (₹)', type: 'number' },
              { key: 'packages', label: 'Package Count', type: 'number' },
              { key: 'travelers', label: 'Travelers Count', type: 'number' },
              { key: 'rating', label: 'Rating (0-5)', type: 'number' },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input type={type} value={(form as Record<string, string | number | boolean | string[]>)[key] as string | number}
                  onChange={e => setForm(f => ({ ...f, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]" />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-2">Types</label>
              <div className="flex flex-wrap gap-2">
                {TYPE_OPTIONS.map(t => (
                  <button key={t} type="button" onClick={() => toggleType(t)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${form.type.includes(t) ? 'bg-[#FF6B00] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isIntl" checked={form.isInternational} onChange={e => setForm(f => ({ ...f, isInternational: e.target.checked }))} className="w-4 h-4 accent-[#FF6B00]" />
              <label htmlFor="isIntl" className="text-sm text-gray-700">International Destination</label>
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
            <tr>{['Image', 'Name', 'Type', 'Price From', 'Rating', 'Travelers', 'Region', 'Actions'].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {destinations.map(d => (
              <tr key={d._id} className="hover:bg-gray-50">
                <td className="px-4 py-3"><img src={d.image} alt={d.name} className="w-16 h-10 object-cover rounded" /></td>
                <td className="px-4 py-3 font-medium text-[#1A1A1A]">{d.name}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {d.type.slice(0, 2).map(t => <span key={t} className="text-xs bg-orange-50 text-[#FF6B00] px-2 py-0.5 rounded-full">{t}</span>)}
                    {d.type.length > 2 && <span className="text-xs text-gray-400">+{d.type.length - 2}</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">₹{d.startingPrice.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-600">⭐ {d.rating}</td>
                <td className="px-4 py-3 text-gray-600">{d.travelers.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${d.isInternational ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {d.isInternational ? 'International' : 'Domestic'}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleEdit(d)} className="text-blue-400 hover:text-blue-600 transition"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(d._id)} className="text-red-400 hover:text-red-600 transition"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {destinations.length === 0 && <p className="text-center text-gray-400 py-12">No destinations yet.</p>}
      </div>
    </div>
  );
}
