import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface Lead { _id: string; name: string; phone: string; city: string; status: string; createdAt: string; }

export default function AgentLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  useEffect(() => { api.get('/leads/mine').then(d => Array.isArray(d) && setLeads(d)).catch(() => {}); }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold font-heading text-[#1A1A1A] mb-6">My Assigned Leads</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['Name', 'Phone', 'City', 'Status', 'Date'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {leads.map(l => (
              <tr key={l._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{l.name}</td>
                <td className="px-4 py-3 text-gray-600">{l.phone}</td>
                <td className="px-4 py-3 text-gray-600">{l.city}</td>
                <td className="px-4 py-3"><span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{l.status}</span></td>
                <td className="px-4 py-3 text-gray-400 text-xs">{new Date(l.createdAt).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && <p className="text-center text-gray-400 py-12">No leads assigned yet.</p>}
      </div>
    </div>
  );
}
