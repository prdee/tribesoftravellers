import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function AgentProfile() {
  const [form, setForm] = useState({ agencyName: '', logo: '', bio: '', city: '', phone: '', website: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/agents/profile').then(d => { if (d && !d.message) setForm(f => ({ ...f, ...d })); }).catch(() => {});
  }, []);

  const handleSave = async () => {
    await api.put('/agents/profile', form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold font-heading text-[#1A1A1A] mb-6">Agency Profile</h1>
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        {[
          { key: 'agencyName', label: 'Agency Name', type: 'text' },
          { key: 'logo', label: 'Logo URL', type: 'text' },
          { key: 'city', label: 'City', type: 'text' },
          { key: 'phone', label: 'Contact Phone', type: 'tel' },
          { key: 'website', label: 'Website', type: 'url' },
        ].map(({ key, label, type }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input type={type} value={(form as Record<string, string>)[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]" />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio / About Agency</label>
          <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]" />
        </div>
        <button onClick={handleSave} className="bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold px-8 py-3 rounded-lg transition">
          {saved ? '✓ Saved!' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}
