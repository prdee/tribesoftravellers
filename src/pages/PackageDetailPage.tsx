import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, Star, Check, Info, Phone, ArrowRight, ChevronDown } from 'lucide-react';
import { packages, destinations } from '../data/destinations';
import type { Package } from '../data/destinations';

const PackageDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [activeDay, setActiveDay] = useState<number | null>(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (slug) {
      const foundPkg = packages.find(p => p.slug === slug);
      if (foundPkg) {
        setPkg(foundPkg);
      }
    }
  }, [slug]);

  if (!pkg) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Package not found</h2>
        <Link to="/tour-packages" className="text-teal hover:underline flex items-center">
          <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> Back to Packages
        </Link>
      </div>
    );
  }

  const destinationSlug = destinations.find(d => d.name === pkg.destination)?.slug || pkg.destination.toLowerCase().replace(/\s+/g, '-');

  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in the "${pkg.name}" package (${pkg.duration}) starting at ₹${pkg.price}. Please provide more details.`;
    window.open(`https://wa.me/1234567890?text=${encodeURIComponent(message)}`, '_blank');
  };

  const images = pkg.images || [pkg.image, pkg.image, pkg.image];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center text-xs md:text-sm text-gray-500">
            <Link to="/" className="hover:text-teal transition-colors">Home</Link>
            <span className="mx-2">&gt;</span>
            <Link to="/tour-packages" className="hover:text-teal transition-colors">Tour Packages</Link>
            <span className="mx-2">&gt;</span>
            <Link to={`/destination/${destinationSlug}`} className="hover:text-teal transition-colors">{pkg.destination}</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-700 truncate max-w-[200px] md:max-w-none">{pkg.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Title & Header Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <span className="bg-teal/10 text-teal text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {pkg.destination}
                </span>
                <div className="flex items-center text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                  {pkg.rating} <span className="mx-1 text-gray-400">|</span> {pkg.reviews} Reviews
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-tt-dark leading-tight mb-4">
                {pkg.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-teal mr-2" />
                  <span className="font-medium">{pkg.duration}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-teal mr-2" />
                  <span className="font-medium">{pkg.destination}</span>
                </div>
                {pkg.tags && pkg.tags.map(tag => (
                  <div key={tag} className="flex items-center capitalize">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-2"></span>
                    {tag}
                  </div>
                ))}
              </div>
            </div>

            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-2">
              <div className="grid grid-cols-4 gap-2 h-[400px]">
                <div className="col-span-4 md:col-span-3 h-full relative group rounded-lg overflow-hidden">
                  <img src={images[0]} alt={pkg.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="hidden md:flex col-span-1 flex-col gap-2 h-full">
                  <div className="flex-1 relative group rounded-lg overflow-hidden">
                    <img src={images[1]} alt={pkg.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="flex-1 relative group rounded-lg overflow-hidden">
                    <img src={images[2]} alt={pkg.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    {images.length > 3 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/40 transition-colors">
                        <span className="text-white font-bold text-lg">+{images.length - 3}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-tt-dark mb-4 flex items-center">
                <Info className="w-6 h-6 text-teal mr-2" /> Package Overview
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {pkg.overview || `Experience the best of ${pkg.destination} with this carefully curated ${pkg.duration} package. From stunning sights to comfortable stays, everything is designed to give you a memorable holiday.`}
              </p>
            </div>

            {/* Itinerary */}
            {pkg.itinerary && pkg.itinerary.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h2 className="text-xl font-bold text-tt-dark mb-6 flex items-center">
                  <Calendar className="w-6 h-6 text-teal mr-2" /> Day Wise Itinerary
                </h2>
                
                <div className="space-y-4">
                  {pkg.itinerary.map((day) => (
                    <div 
                      key={day.day} 
                      className={`border rounded-lg transition-all duration-300 overflow-hidden ${
                        activeDay === day.day ? 'border-teal ring-1 ring-teal/20 bg-white shadow-sm' : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50'
                      }`}
                    >
                      <button
                        onClick={() => setActiveDay(activeDay === day.day ? null : day.day)}
                        className="w-full flex items-center justify-between p-4 md:p-5 text-left focus:outline-none"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`flex items-center justify-center w-12 h-12 rounded-lg shrink-0 font-bold ${
                            activeDay === day.day ? 'bg-teal text-white' : 'bg-gray-200 text-gray-600'
                          }`}>
                            Day {day.day}
                          </div>
                          <h3 className={`font-bold text-base md:text-lg ${
                            activeDay === day.day ? 'text-teal' : 'text-tt-dark'
                          }`}>
                            {day.title}
                          </h3>
                        </div>
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 shrink-0 ${
                          activeDay === day.day ? 'rotate-180 text-teal' : 'text-gray-400'
                        }`} />
                      </button>
                      
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        activeDay === day.day ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        <div className="p-5 pt-0 ml-16 border-t border-gray-100">
                          <p className="text-gray-600 leading-relaxed mt-4">
                            {day.description}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">Hotel Stay</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">Sightseeing</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">Meals</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Pricing & Booking Card */}
              <div className="bg-white rounded-xl shadow-card border border-gray-100 p-6 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal to-coral"></div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-500 uppercase tracking-wide mb-1 font-semibold">Starting From</p>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-3xl font-bold text-tt-dark">₹{pkg.price.toLocaleString()}</span>
                    <span className="text-gray-500 mb-1">/person</span>
                  </div>
                  {pkg.originalPrice && (
                    <div className="flex items-center text-sm">
                      <span className="line-through text-gray-400 mr-2">₹{pkg.originalPrice.toLocaleString()}</span>
                      <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">
                        Save ₹{(pkg.originalPrice - pkg.price).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-2">*Prices are subject to availability</p>
                </div>

                <div className="space-y-3 mb-6">
                  <button 
                    onClick={handleWhatsApp}
                    className="w-full bg-coral hover:bg-coral-dark text-white font-bold py-4 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center group"
                  >
                    Customize & Book <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={handleWhatsApp}
                    className="w-full bg-white border-2 border-teal text-teal hover:bg-teal/5 font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center"
                  >
                    <Phone className="w-4 h-4 mr-2" /> Contact Expert
                  </button>
                </div>
                
                <div className="flex items-center justify-center text-sm text-gray-500 bg-gray-50 py-3 rounded-lg border border-gray-100">
                  <Phone className="w-4 h-4 mr-2 text-teal" /> 
                  Need help? Call us <a href="tel:18001235555" className="font-bold text-tt-dark ml-1 hover:text-teal">1800-123-5555</a>
                </div>
              </div>

              {/* Inclusions Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-lg text-tt-dark mb-4 pb-3 border-b border-gray-100">Package Inclusions</h3>
                <ul className="space-y-3">
                  {pkg.inclusions.map((inclusion, index) => (
                    <li key={index} className="flex items-start">
                      <div className="bg-teal/10 rounded-full p-1 mr-3 mt-0.5 shrink-0">
                        <Check className="w-3 h-3 text-teal" />
                      </div>
                      <span className="text-gray-600 text-sm">{inclusion}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm flex flex-col items-center justify-center">
                  <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                    <Check className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-xs font-bold text-gray-700">Verified<br/>Agents</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm flex flex-col items-center justify-center">
                  <div className="bg-green-50 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                    <Star className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-xs font-bold text-gray-700">Best Price<br/>Guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailPage;