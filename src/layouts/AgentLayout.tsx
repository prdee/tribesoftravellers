import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, BookOpen, FileText, Tag, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/agent/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/agent/packages', label: 'My Packages', icon: Package },
  { to: '/agent/bookings', label: 'Bookings', icon: BookOpen },
  { to: '/agent/leads', label: 'My Leads', icon: FileText },
  { to: '/agent/coupons', label: 'Coupons', icon: Tag },
  { to: '/agent/profile', label: 'Profile', icon: User },
];

export default function AgentLayout() {
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen flex bg-[#FFF8F0]">
      <aside className="w-64 bg-[#1A1A1A] text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Agent Dashboard</p>
          <p className="font-semibold font-heading truncate">{user?.name}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map(({ to, label, icon: Icon, exact }) => {
            const active = exact ? pathname === to : pathname.startsWith(to);
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
      <main className="flex-1 overflow-auto"><Outlet /></main>
    </div>
  );
}
