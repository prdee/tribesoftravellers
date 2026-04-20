import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Plus, Trash2, Edit2, X, Check, ToggleLeft, ToggleRight } from 'lucide-react';

interface Hotel {
  _id: string;
  name: string;
  location: { lat: number; lng: number; address: string; city: string; state: string; country: string };
  images: string[];
  pricePerNight: number;
  rating: number;
  amenities: string[];
  description: string;
  stars: number;
  isActive: boolean;
}

const empty = {
  name: '', address: '', city: '', state: '', country: 'India',
  lat: 0, lng: 0, images: '', pricePerNight: 0, rating: 4.0,
  amenities: '', description: '', stars: 3, isActive: true,
};

export default function AdminHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [form, setForm] = useState({ ...empty });
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = () => api.get('/hotels').then(d => Array.isArray(d) && setHotels(d)).catch(() => setError('Failed to load hotels'));
  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm({ ...empty }); setEditId(null); setShowForm(false); setError(''); };

  const handleEdit = (h: Hotel) => {
    setForm({
      name: h.name, address: h.location.address, city: h.location.city,
      state: h.location.state, country: h.location.country,
      lat: h.location.lat, lng: h.location.lng,
      images: h.images.join(', '), pricePerNight: h.pricePerNight,
      rating: h.rating, amenities: h.amenities.join(', '),
      description: h.description, stars: h.stars, isActive: h.isActive,
    });
    setEditId(h._id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.city) return setError('Name and city are required');
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        location: { lat: form.lat, lng: form.lng, address: form.address, city: form.city, state: form.state, country: form.country },
        images: form.images.split(',').map(s => s.trim()).filter(Boolean),
        pricePerNight: form.pricePerNight,
        rating: form.rating,
        amenities: form.amenities.split(',').map(s => s.trim()).filter(Boolean),
        description: form.description,
        stars: form.stars,
        isActive: form.isActive,
      };
      if (editId) {
        await api.put(`/hotels/${editId}`, payload);
      } else {
        await api.post('/hotels', payload);
      }
      resetForm();
      load();
    } catch {
      setError('Failed to save hotel');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this hotel?')) return;
    await api.delete(`/hotels/${id}`);
    load();
  };

  const handleToggle = async (h: Hotel) => {
    await api.put(`/hotels/${h._id}`, { isActive: !h.isActive });
    load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading text-[#1A1A1A]">Hotels</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-[#FF6B00] text-white px-4 py-2 rounded-lg hover:bg-[#E55A00] transition text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Hotel
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#1A1A1A]">{editId ? 'Edit Hotel' : 'New Hotel'}</h2>
            <button onClick={resetForm}><X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'name', label: 'Hotel Name', type: 'text' },
              { key: 'stars', label: 'Star Rating (1-5)', type: 'number' },
              { key: 'city', label: 'City', type: 'text' },
              { key: 'state', label: 'State', type: 'text' },
              { key: 'country', label: 'Country', type: 'text' },
              { key: 'address', label: 'Full Address', type: 'text' },
              { key: 'lat', label: 'Latitude', type: 'number' },
              { key: 'lng', label: 'Longitude', type: 'number' },
              { key: 'pricePerNight', label: 'Price Per Night (₹)', type: 'number' },
              { key: 'rating', label: 'Rating (0-5)', type: 'number' },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input type={type} value={(form as Record<string, string | number | boolean>)[key] as string | number}
                  onChange={e => setForm(f => ({ ...f, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Image URLs (comma-separated)</label>
              <input value={form.images} onChange={e => setForm(f => ({ ...f, images: e.target.value }))}
                placeholder="https://..., https://..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Amenities (comma-separated)</label>
              <input value={form.amenities} onChange={e => setForm(f => ({ ...f, amenities: e.target.value }))}
                placeholder="WiFi, Pool, Gym, Spa"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
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
            <tr>{['Hotel', 'Location', 'Stars', 'Price/Night', 'Rating', 'Status', 'Actions'].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {hotels.map(h => (
              <tr key={h._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-[#1A1A1A]">{h.name}</td>
                <td className="px-4 py-3 text-gray-600">{h.location.city}, {h.location.state}</td>
                <td className="px-4 py-3 text-gray-600">{'⭐'.repeat(h.stars)}</td>
                <td className="px-4 py-3 font-semibold text-[#FF6B00]">₹{h.pricePerNight.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-600">⭐ {h.rating}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleToggle(h)} className={`flex items-center gap-1 text-xs font-medium ${h.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                    {h.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    {h.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleEdit(h)} className="text-blue-400 hover:text-blue-600 transition"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(h._id)} className="text-red-400 hover:text-red-600 transition"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {hotels.length === 0 && <p className="text-center text-gray-400 py-12">No hotels yet.</p>}
      </div>
    </div>
  );
}
