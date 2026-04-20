import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface User { _id: string; name: string; email: string; phone: string; role: string; createdAt: string; }

const ROLES = ['user', 'agent', 'admin', 'superadmin'];
const ROLE_COLORS: Record<string, string> = {
  user: 'bg-gray-100 text-gray-700',
  agent: 'bg-blue-100 text-blue-700',
  admin: 'bg-orange-100 text-orange-700',
  superadmin: 'bg-purple-100 text-purple-700',
};

export default function SuperAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);

  const load = () => api.get('/admin/users').then(setUsers).catch(() => {});
  useEffect(() => { load(); }, []);

  const updateRole = async (id: string, role: string) => {
    await api.put(`/admin/users/${id}/role`, { role });
    load();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold font-heading text-[#1A1A1A] mb-6">User Management</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['Name', 'Email / Phone', 'Role', 'Joined'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map(u => (
              <tr key={u._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-gray-600">{u.email || u.phone}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={e => updateRole(u._id, e.target.value)}
                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${ROLE_COLORS[u.role]}`}
                  >
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="text-center text-gray-400 py-12">No users found.</p>}
      </div>
    </div>
  );
}
