import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Package, BookOpen, Tag, FileText } from 'lucide-react';

export default function AgentDashboard() {
  const [stats, setStats] = useState({ packages: 0, bookings: 0, coupons: 0, leads: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/agents/packages'),
      api.get('/bookings/agent'),
      api.get('/agents/coupons'),
      api.get('/leads/mine'),
    ]).then(([pkgs, bookings, coupons, leads]) => {
      setStats({
        packages: Array.isArray(pkgs) ? pkgs.length : 0,
        bookings: Array.isArray(bookings) ? bookings.length : 0,
        coupons: Array.isArray(coupons) ? coupons.length : 0,
        leads: Array.isArray(leads) ? leads.length : 0,
      });
    }).catch(() => {});
  }, []);

  const cards = [
    { label: 'My Packages', value: stats.packages, icon: Package, color: 'bg-blue-500' },
    { label: 'Total Bookings', value: stats.bookings, icon: BookOpen, color: 'bg-green-500' },
    { label: 'Active Coupons', value: stats.coupons, icon: Tag, color: 'bg-[#FF6B00]' },
    { label: 'Assigned Leads', value: stats.leads, icon: FileText, color: 'bg-purple-500' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold font-heading text-[#1A1A1A] mb-8">My Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className={`${color} text-white p-3 rounded-lg`}><Icon className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-2xl font-bold text-[#1A1A1A]">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
