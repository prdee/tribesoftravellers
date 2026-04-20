import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { BookOpen, Users, FileText, TrendingUp, Package, MapPin } from 'lucide-react';

interface Stats {
  totalBookings: number;
  totalAgents: number;
  newLeads: number;
  revenue: number;
  totalUsers: number;
  totalPackages: number;
  totalDestinations: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0, totalAgents: 0, newLeads: 0, revenue: 0,
    totalUsers: 0, totalPackages: 0, totalDestinations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Total Bookings', value: stats.totalBookings, icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Active Agents', value: stats.totalAgents, icon: Users, color: 'bg-green-500' },
    { label: 'New Leads Today', value: stats.newLeads, icon: FileText, color: 'bg-[#FF6B00]' },
    { label: 'Confirmed Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-pink-500' },
    { label: 'Active Packages', value: stats.totalPackages, icon: Package, color: 'bg-indigo-500' },
    { label: 'Destinations', value: stats.totalDestinations, icon: MapPin, color: 'bg-teal-500' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold font-heading text-[#1A1A1A] mb-8">Dashboard</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
                  <div className="h-6 bg-gray-200 rounded w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
              <div className={`${color} text-white p-3 rounded-lg shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-[#1A1A1A]">{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-[#1A1A1A] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Add Destination', href: '/admin/destinations', color: 'bg-orange-50 text-[#FF6B00] hover:bg-orange-100' },
            { label: 'Add Package', href: '/admin/packages', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
            { label: 'Add Hotel', href: '/admin/hotels', color: 'bg-green-50 text-green-600 hover:bg-green-100' },
            { label: 'View Leads', href: '/admin/leads', color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
          ].map(({ label, href, color }) => (
            <a key={label} href={href}
              className={`${color} px-4 py-3 rounded-lg text-sm font-medium text-center transition`}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
