import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface Lead { _id: string; name: string; phone: string; email: string; city: string; agencyName: string; experience: string; status: string; createdAt: string; }

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  onboarded: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);

  const load = () => api.get('/leads').then(setLeads).catch(() => {});
  useEffect(() => { load(); const t = setInterval(load, 30000); return () => clearInterval(t); }, []);

  const updateStatus = async (id: string, status: string) => {
    await api.put(`/leads/${id}`, { status });
    load();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold font-heading text-[#1A1A1A] mb-6">Travel Agent Leads</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['Name', 'Phone', 'City', 'Agency', 'Experience', 'Status', 'Date'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {leads.map(l => (
              <tr key={l._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{l.name}</td>
                <td className="px-4 py-3 text-gray-600">{l.phone}</td>
                <td className="px-4 py-3 text-gray-600">{l.city}</td>
                <td className="px-4 py-3 text-gray-600">{l.agencyName}</td>
                <td className="px-4 py-3 text-gray-600">{l.experience}</td>
                <td className="px-4 py-3">
                  <select
                    value={l.status}
                    onChange={e => updateStatus(l._id, e.target.value)}
                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLORS[l.status]}`}
                  >
                    {['new', 'contacted', 'onboarded', 'rejected'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{new Date(l.createdAt).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && <p className="text-center text-gray-400 py-12">No leads yet.</p>}
      </div>
    </div>
  );
}
