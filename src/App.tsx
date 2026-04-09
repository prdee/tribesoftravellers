import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
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
import ChatWidget from './components/ChatWidget';
import LeadPopup from './components/LeadPopup';
import './App.css';

function App() {
  const [showChat, setShowChat] = useState(false);
  const [showLeadPopup, setShowLeadPopup] = useState(false);

  useEffect(() => {
    // Show chat widget after 3 seconds
    const timer = setTimeout(() => {
      setShowChat(true);
    }, 3000);
    
    // Show lead popup after 8 seconds
    const leadTimer = setTimeout(() => {
      setShowLeadPopup(true);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearTimeout(leadTimer);
    };
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/honeymoon-places" element={<DestinationPage type="honeymoon" />} />
          <Route path="/family-places" element={<DestinationPage type="family" />} />
          <Route path="/holiday-packages" element={<DestinationPage type="holiday" />} />
          <Route path="/holiday-deals" element={<DestinationPage type="deals" />} />
          <Route path="/luxury-holidays" element={<DestinationPage type="luxury" />} />
          <Route path="/adventure-places" element={<DestinationPage type="adventure" />} />
          <Route path="/nature-places" element={<DestinationPage type="nature" />} />
          <Route path="/friends-places" element={<DestinationPage type="friends" />} />
          <Route path="/tour-packages" element={<TourPackagesPage />} />
          <Route path="/packages/:slug" element={<PackageDetailPage />} />
          <Route path="/destination/:slug" element={<DestinationDetailPage />} />
          <Route path="/destination/:slug/places-to-visit/:placeSlug" element={<TravelGuidePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/aboutus" element={<AboutPage />} />
          <Route path="/contact_us" element={<ContactPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/hotels" element={<DestinationPage type="hotels" />} />
          <Route path="/destination-guides" element={<DestinationPage type="guides" />} />
          <Route path="/holiday-themes" element={<DestinationPage type="themes" />} />
        </Routes>
      </Layout>
      {showChat && <ChatWidget />}
      <LeadPopup isOpen={showLeadPopup} onClose={() => setShowLeadPopup(false)} />
    </Router>
  );
}

export default App;
