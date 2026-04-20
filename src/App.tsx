import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import AdminLayout from './layouts/AdminLayout';
import AgentLayout from './layouts/AgentLayout';

// Public pages
import HomePage from './pages/HomePage';
import DestinationPage from './pages/DestinationPage';
import TourPackagesPage from './pages/TourPackagesPage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import PackageDetailPage from './pages/PackageDetailPage';
import BlogPage from './pages/BlogPage';
import TravelGuidePage from './pages/TravelGuidePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import OffersPage from './pages/OffersPage';
import HotelsPage from './pages/HotelsPage';
import TravelAgentJoinPage from './pages/TravelAgentJoinPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import BookingSuccessPage from './pages/BookingSuccessPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBanners from './pages/admin/AdminBanners';
import AdminLeads from './pages/admin/AdminLeads';
import AdminDestinations from './pages/admin/AdminDestinations';
import AdminPackages from './pages/admin/AdminPackages';
import AdminHotels from './pages/admin/AdminHotels';
import AdminAgents from './pages/admin/AdminAgents';
import AdminBookings from './pages/admin/AdminBookings';
import AdminSettings from './pages/admin/AdminSettings';
import SuperAdminUsers from './pages/admin/SuperAdminUsers';

// Agent pages
import AgentDashboard from './pages/agent/AgentDashboard';
import AgentPackages from './pages/agent/AgentPackages';
import AgentBookings from './pages/agent/AgentBookings';
import AgentLeads from './pages/agent/AgentLeads';
import AgentCoupons from './pages/agent/AgentCoupons';
import AgentProfile from './pages/agent/AgentProfile';

import ChatWidget from './components/ChatWidget';
import LeadPopup from './components/LeadPopup';
import './App.css';

function App() {
  const [showChat, setShowChat] = useState(false);
  const [showLeadPopup, setShowLeadPopup] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowChat(true), 3000);
    const t2 = setTimeout(() => setShowLeadPopup(true), 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes with Layout */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/honeymoon-places" element={<Layout><DestinationPage type="honeymoon" /></Layout>} />
          <Route path="/family-places" element={<Layout><DestinationPage type="family" /></Layout>} />
          <Route path="/holiday-packages" element={<Layout><DestinationPage type="holiday" /></Layout>} />
          <Route path="/holiday-deals" element={<Layout><DestinationPage type="deals" /></Layout>} />
          <Route path="/luxury-holidays" element={<Layout><DestinationPage type="luxury" /></Layout>} />
          <Route path="/adventure-places" element={<Layout><DestinationPage type="adventure" /></Layout>} />
          <Route path="/nature-places" element={<Layout><DestinationPage type="nature" /></Layout>} />
          <Route path="/friends-places" element={<Layout><DestinationPage type="friends" /></Layout>} />
          <Route path="/tour-packages" element={<Layout><TourPackagesPage /></Layout>} />
          <Route path="/packages/:slug" element={<Layout><PackageDetailPage /></Layout>} />
          <Route path="/destination/:slug" element={<Layout><DestinationDetailPage /></Layout>} />
          <Route path="/destination/:slug/places-to-visit/:placeSlug" element={<Layout><TravelGuidePage /></Layout>} />
          <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
          <Route path="/aboutus" element={<Layout><AboutPage /></Layout>} />
          <Route path="/contact_us" element={<Layout><ContactPage /></Layout>} />
          <Route path="/offers" element={<Layout><OffersPage /></Layout>} />
          <Route path="/hotels" element={<Layout><HotelsPage /></Layout>} />
          <Route path="/online-leads-for-travel-agents" element={<Layout><TravelAgentJoinPage /></Layout>} />
          <Route path="/tnc" element={<Layout><TermsPage /></Layout>} />
          <Route path="/privacy" element={<Layout><PrivacyPage /></Layout>} />
          <Route path="/booking/success/:id" element={<Layout><BookingSuccessPage /></Layout>} />

          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="destinations" element={<AdminDestinations />} />
            <Route path="packages" element={<AdminPackages />} />
            <Route path="hotels" element={<AdminHotels />} />
            <Route path="agents" element={<AdminAgents />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="bookings" element={<AdminBookings />} />
          </Route>

          {/* Super Admin routes */}
          <Route path="/superadmin" element={<ProtectedRoute role="superadmin"><AdminLayout isSuperAdmin /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<SuperAdminUsers />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="destinations" element={<AdminDestinations />} />
            <Route path="packages" element={<AdminPackages />} />
            <Route path="hotels" element={<AdminHotels />} />
            <Route path="agents" element={<AdminAgents />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Agent routes */}
          <Route path="/agent" element={<ProtectedRoute role="agent"><AgentLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<AgentDashboard />} />
            <Route path="packages" element={<AgentPackages />} />
            <Route path="bookings" element={<AgentBookings />} />
            <Route path="leads" element={<AgentLeads />} />
            <Route path="coupons" element={<AgentCoupons />} />
            <Route path="profile" element={<AgentProfile />} />
          </Route>
        </Routes>

        {showChat && <ChatWidget />}
        <LeadPopup isOpen={showLeadPopup} onClose={() => setShowLeadPopup(false)} />
      </Router>
    </AuthProvider>
  );
}

export default App;
