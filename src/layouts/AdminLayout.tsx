import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Image, MapPin, Package, Hotel, Users, FileText, BookOpen, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/banners', label: 'Banners', icon: Image },
  { to: '/admin/destinations', label: 'Destinations', icon: MapPin },
  { to: '/admin/packages', label: 'Packages', icon: Package },
  { to: '/admin/hotels', label: 'Hotels', icon: Hotel },
  { to: '/admin/agents', label: 'Travel Agents', icon: Users },
  { to: '/admin/leads', label: 'Leads', icon: FileText },
  { to: '/admin/bookings', label: 'Bookings', icon: BookOpen },
];

const superAdminLinks = [
  { to: '/superadmin/users', label: 'All Users', icon: Users },
  { to: '/superadmin/settings', label: 'Settings', icon: Settings },
];

interface Props { isSuperAdmin?: boolean; }

export default function AdminLayout({ isSuperAdmin = false }: Props) {
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const links = isSuperAdmin ? [...adminLinks, ...superAdminLinks] : adminLinks;

  return (
    <div className="min-h-screen flex bg-[#FFF8F0]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1A1A] text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <p className="text-xs text-white/50 uppercase tracking-wider mb-1">{isSuperAdmin ? 'Super Admin' : 'Admin'} Panel</p>
          <p className="font-semibold font-heading truncate">{user?.name}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || (pathname.startsWith(to) && to !== '/admin' && to !== '/superadmin');
            return (
              <Link key={to} to={to} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${active ? 'bg-[#FF6B00] text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={signOut} className="flex items-center gap-2 text-white/60 hover:text-white text-sm w-full px-3 py-2 rounded-lg hover:bg-white/10 transition">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
