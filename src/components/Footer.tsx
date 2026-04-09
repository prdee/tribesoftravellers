import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Facebook, Twitter, Instagram, PinIcon, ChevronDown, ChevronUp, Heart } from 'lucide-react';

const Footer = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const internationalDestinations = [
    'Thailand', 'Singapore', 'Malaysia', 'Nepal', 'Sri Lanka', 'Europe', 'Mauritius',
    'Maldives', 'Egypt', 'Africa', 'Australia', 'Indonesia', 'Bhutan', 'Cambodia',
    'Canada', 'Hong Kong', 'Japan', 'New Zealand', 'USA', 'Seychelles', 'Turkey', 'Israel'
  ];

  const domesticDestinations = [
    'Kerala', 'Ladakh', 'Goa', 'Rajasthan', 'Kashmir', 'Andaman', 'Andhra Pradesh',
    'Bihar', 'Gujarat', 'Himachal', 'Karnataka', 'Madhya Pradesh', 'Maharashtra',
    'Sikkim - Gangtok - Darjeeling', 'Odisha', 'Punjab', 'Tamil Nadu', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal'
  ];

  const quickLinks = [
    { name: 'About Us', path: '/aboutus' },
    { name: 'Team', path: '/team' },
    { name: 'We are hiring!', path: '/career' },
    { name: 'Testimonial', path: '/testimonials' },
    { name: 'Blog', path: '/blog' },
    { name: 'Terms and Conditions', path: '/tnc' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Travel Agent? Join Us', path: '/online-leads-for-travel-agents' },
    { name: 'FAQ', path: '/FAQs' },
    { name: 'Contact Us', path: '/contact_us' },
  ];

  const packageLinks = [
    '1 to 3 Days Honeymoon Packages',
    '4 to 6 Days Honeymoon Packages',
    '7 to 9 Days Honeymoon Packages',
    '10 to 12 Days Honeymoon Packages',
    '1 to 3 Days Family Packages',
    '4 to 6 Days Family Packages',
    '7 to 9 Days Family Packages',
    '10 to 12 Days Family Packages',
  ];

  return (
    <footer className="bg-tt-dark text-white">
      {/* Who We Are Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Who We Are */}
          <div>
            <div className="mb-6 bg-white/10 inline-block p-3 rounded-xl backdrop-blur-sm">
              <img 
                src="/logo.png" 
                alt="The Tribes of Travellers" 
                className="h-20 md:h-24 object-contain"
              />
            </div>
            <h3 className="text-xl font-bold mb-4">Who We Are?</h3>
            <div className="text-gray-300 text-sm leading-relaxed">
              <p className={showAbout ? '' : 'line-clamp-3'}>
                Obsessed with the idea of empowering the travelers with best vacation deals, The Tribes of Travellers is a product of
              Holiday Triangle Travel Pvt. Ltd. We are an online marketplace that connects a traveler to multiple local travel agents. With the help of these 650+ local
              travel experts The Tribes of Travellers has been able to cater to the needs of over 10 Lac travelers on international tour holidays as well as domestic India tours.
              </p>
              <button
                onClick={() => setShowAbout(!showAbout)}
                className="text-teal hover:text-teal-light text-sm mt-2 flex items-center"
              >
                {showAbout ? 'Show Less' : 'Read More'}
                {showAbout ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
              </button>
            </div>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="text-xl font-bold mb-4">Disclaimer</h3>
            <div className="text-gray-300 text-sm leading-relaxed">
              <p className={showDisclaimer ? '' : 'line-clamp-3'}>
                Holiday Triangle Travel Private Limited ("HTT" or "We") function solely as an
                intermediary, facilitating connections between travelers and travel agents. Our role is
                restricted to providing information about travel options and facilitating the booking process.
                While we strive to ensure a seamless travel experience, we cannot be held accountable for any
                deficiencies in the services rendered by travel agents. We neither bear any responsibility nor
                incur any liability toward owning, operating, or controlling the services offered by travel agents.
              </p>
              <button
                onClick={() => setShowDisclaimer(!showDisclaimer)}
                className="text-teal hover:text-teal-light text-sm mt-2 flex items-center"
              >
                {showDisclaimer ? 'Show Less' : 'Read More'}
                {showDisclaimer ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
              </button>
            </div>
          </div>
        </div>

        {/* Popular Travel Searches */}
        <div className="border-t border-gray-700 pt-8">
          <h3 className="text-lg font-bold mb-6 flex items-center">
            Popular Travel Searches
            <ChevronDown className="w-5 h-5 ml-2" />
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* International */}
            <div>
              <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3">International</h4>
              <ul className="space-y-2">
                {internationalDestinations.slice(0, 11).map((dest) => (
                  <li key={dest}>
                    <Link
                      to={`/destination/${dest.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      {dest}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* More International */}
            <div>
              <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3 opacity-0">International</h4>
              <ul className="space-y-2">
                {internationalDestinations.slice(11).map((dest) => (
                  <li key={dest}>
                    <Link
                      to={`/destination/${dest.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      {dest}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Domestic */}
            <div>
              <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3">Domestic</h4>
              <ul className="space-y-2">
                {domesticDestinations.slice(0, 10).map((dest) => (
                  <li key={dest}>
                    <Link
                      to={`/destination/${dest.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      {dest}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* More Domestic */}
            <div>
              <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3 opacity-0">Domestic</h4>
              <ul className="space-y-2">
                {domesticDestinations.slice(10).map((dest) => (
                  <li key={dest}>
                    <Link
                      to={`/destination/${dest.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      {dest}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Package Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div>
              <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3">Domestic Packages</h4>
              <ul className="space-y-2">
                {packageLinks.slice(0, 4).map((pkg) => (
                  <li key={pkg}>
                    <Link
                      to={`/tour-packages?type=${pkg.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      {pkg}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3">International Packages</h4>
              <ul className="space-y-2">
                {packageLinks.slice(0, 4).map((pkg) => (
                  <li key={pkg}>
                    <Link
                      to={`/tour-packages?type=${pkg.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      {pkg}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Links & Contact */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <a href="tel:1800-123-5555" className="flex items-center text-teal hover:text-teal-light">
              <Phone className="w-4 h-4 mr-2" />
              1800 123 5555
            </a>
            <a href="mailto:customercare@thetribesoftravellers.com" className="flex items-center text-teal hover:text-teal-light">
              <Mail className="w-4 h-4 mr-2" />
              customercare@thetribesoftravellers.com
            </a>
          </div>
        </div>

        {/* Corporate Office & Social */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold mb-3">Corporate Office:</h4>
              <p className="text-sm text-gray-300">
                Holiday Triangle Travel Private Limited<br />
                Address: Plot No - 52, 3rd Floor,<br />
                Batra House, Sector 32,<br />
                Gurugram - 122001, Haryana<br />
                Landline: 1800 123 5555
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Connect with us on:</h4>
              <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <PinIcon className="w-6 h-6" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 mt-8 text-center">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6 opacity-70" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-70" />
          </div>
          <p className="text-sm text-gray-400 flex items-center justify-center">
            Made with <Heart className="w-4 h-4 mx-1 text-coral fill-coral" /> in India
          </p>
          <p className="text-sm text-gray-500 mt-2">
            All rights reserved &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
