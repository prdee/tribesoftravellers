import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react';

interface Agent {
  _id: string;
  agencyName: string;
  logo: string;
  bio: string;
  city: string;
  phone: string;
  website: string;
  isVerified: boolean;
  commissionRate: number;
  userId: { _id: string; name: string; email: string; photoURL: string };
  createdAt: string;
}

export default function AdminAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [loading, setLoading] = useState(false);

  const load = () => {
    const url = filter === 'verified' ? '/agents?verified=true' : '/agents/all';
    api.get(url).then(d => Array.isArray(d) && setAgents(d)).catch(() => {});
  };

  useEffect(() => { load(); }, [filter]);

  const handleVerify = async (id: string, isVerified: boolean) => {
    setLoading(true);
    await api.put(`/admin/agents/${id}/verify`, { isVerified });
    setLoading(false);
    load();
  };

  const filtered = agents.filter(a => {
    if (filter === 'verified') return a.isVerified;
    if (filter === 'pending') return !a.isVerified;
    return true;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading text-[#1A1A1A]">Travel Agents</h1>
        <div className="flex gap-2">
          {(['all', 'verified', 'pending'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${filter === f ? 'bg-[#FF6B00] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(a => (
          <div key={a._id} className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-start gap-3 mb-3">
              {a.logo ? (
                <img src={a.logo} alt={a.agencyName} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-[#FF6B00] font-bold text-lg">
                  {(a.agencyName || a.userId?.name || 'A')[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#1A1A1A] truncate">{a.agencyName || 'Unnamed Agency'}</p>
                <p className="text-sm text-gray-500 truncate">{a.userId?.name}</p>
                <p className="text-xs text-gray-400 truncate">{a.userId?.email}</p>
              </div>
              <span className={`shrink-0 text-xs px-2 py-1 rounded-full font-medium ${a.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {a.isVerified ? 'Verified' : 'Pending'}
              </span>
            </div>

            <div className="text-xs text-gray-500 space-y-1 mb-4">
              {a.city && <p>📍 {a.city}</p>}
              {a.phone && <p>📞 {a.phone}</p>}
              {a.website && (
                <a href={a.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-500 hover:underline">
                  <ExternalLink className="w-3 h-3" /> {a.website}
                </a>
              )}
              <p>💰 Commission: {a.commissionRate}%</p>
            </div>

            {a.bio && <p className="text-xs text-gray-600 mb-4 line-clamp-2">{a.bio}</p>}

            <div className="flex gap-2">
              {!a.isVerified ? (
                <button onClick={() => handleVerify(a._id, true)} disabled={loading}
                  className="flex-1 flex items-center justify-center gap-1 bg-green-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-green-600 transition disabled:opacity-50">
                  <CheckCircle className="w-3.5 h-3.5" /> Verify
                </button>
              ) : (
                <button onClick={() => handleVerify(a._id, false)} disabled={loading}
                  className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg text-xs font-medium hover:bg-red-100 transition disabled:opacity-50">
                  <XCircle className="w-3.5 h-3.5" /> Revoke
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-gray-400 col-span-3 text-center py-12">No agents found.</p>
        )}
      </div>
    </div>
  );
}
