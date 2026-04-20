import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, User, ChevronDown, Menu, X, Gift, BookOpen, Users, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const mainNavItems = [
    { name: 'Honeymoon Packages', path: '/honeymoon-places', hasDropdown: true },
    { name: 'Family Packages', path: '/family-places', hasDropdown: true },
    { name: 'Holiday Packages', path: '/holiday-packages', hasDropdown: true },
    { name: 'Holiday Deals', path: '/holiday-deals', hasDropdown: false },
    { name: 'Luxury Holidays', path: '/luxury-holidays', hasDropdown: false },
  ];

  const secondaryNavItems = [
    { name: 'Hotels', path: '/hotels', hasDropdown: true },
    { name: 'Destination Guides', path: '/destination-guides', hasDropdown: true },
    { name: 'Holiday Themes', path: '/holiday-themes', hasDropdown: true },
  ];

  const topLinks = [
    { name: 'Travel Agent? Join Us', path: '/online-leads-for-travel-agents', icon: Users },
    { name: 'Blog', path: '/blog', icon: BookOpen },
    { name: 'Offers', path: '/offers', icon: Gift },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end text-sm py-1">
            <div className="hidden md:flex items-center space-x-6">
              <a href="tel:+919281449440" className="flex items-center text-saffron font-semibold hover:text-saffron-dark transition-colors">
                <Phone className="w-4 h-4 mr-1" />
                +91 92814 49440
              </a>
              {topLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="flex items-center text-gray-600 hover:text-saffron transition-colors whitespace-nowrap"
                >
                  <link.icon className="w-4 h-4 mr-1" />
                  {link.name}
                </Link>
              ))}
              {/* Auth */}
              {user ? (
                <div className="relative">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 text-gray-700 hover:text-saffron transition">
                    {user.photoURL
                      ? <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full object-cover" />
                      : <div className="w-8 h-8 rounded-full bg-[#FF6B00] text-white flex items-center justify-center text-sm font-bold">{user.name?.[0]}</div>
                    }
                    <span className="text-sm font-medium max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-xl border border-gray-100 py-2 z-50">
                      {(user.role === 'admin' || user.role === 'superadmin') && (
                        <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <LayoutDashboard className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      {user.role === 'agent' && (
                        <Link to="/agent/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <LayoutDashboard className="w-4 h-4" /> Agent Dashboard
                        </Link>
                      )}
                      <button onClick={() => { signOut(); setUserMenuOpen(false); }} className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-gray-50 w-full text-left">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => setAuthOpen(true)} className="flex items-center gap-1 text-gray-600 hover:text-saffron transition font-medium whitespace-nowrap">
                  <User className="w-4 h-4" /> Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0">
              <img src="/logo.png" alt="The Tribes of Travellers" className="h-16 md:h-20 w-auto object-contain" />
            </Link>
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {mainNavItems.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.path)
                        ? 'text-teal bg-teal/10'
                        : 'text-gray-700 hover:text-teal hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                    {item.hasDropdown && <ChevronDown className="w-4 h-4 ml-1" />}
                  </Link>
                  {item.hasDropdown && (
                    <div className="absolute top-full left-0 w-64 bg-white shadow-lg rounded-lg py-2 nav-dropdown border border-gray-100">
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                        Popular Destinations
                      </div>
                      <Link to="/destination/kerala" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal">
                        Kerala
                      </Link>
                      <Link to="/destination/goa" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal">
                        Goa
                      </Link>
                      <Link to="/destination/maldives" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal">
                        Maldives
                      </Link>
                      <Link to="/destination/dubai" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal">
                        Dubai
                      </Link>
                      <Link to="/destination/thailand" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal">
                        Thailand
                      </Link>
                    </div>
                  )}
                </div>
              ))}
              {secondaryNavItems.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.path)
                        ? 'text-teal bg-teal/10'
                        : 'text-gray-700 hover:text-teal hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                    {item.hasDropdown && <ChevronDown className="w-4 h-4 ml-1" />}
                  </Link>
                </div>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <Link
                to="/tour-packages"
                className="bg-coral hover:bg-coral-dark text-white px-6 py-2.5 rounded-md font-semibold text-sm transition-colors shadow-md whitespace-nowrap"
              >
                Plan My Holiday
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 animate-slide-in">
          <div className="px-4 py-3 space-y-2">
            {[...mainNavItems, ...secondaryNavItems].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-teal rounded-md font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {!user && (
              <button onClick={() => { setAuthOpen(true); setMobileMenuOpen(false); }}
                className="block w-full text-center border border-[#FF6B00] text-[#FF6B00] px-6 py-3 rounded-md font-semibold">
                Sign In / Sign Up
              </button>
            )}
            <Link
              to="/tour-packages"
              className="block w-full text-center bg-[#FF6B00] text-white px-6 py-3 rounded-md font-semibold mt-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Plan My Holiday
            </Link>
          </div>
        </div>
      )}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
};

export default Header;
