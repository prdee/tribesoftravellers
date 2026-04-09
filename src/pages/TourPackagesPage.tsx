import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { packages, destinations, findDestinationByValue, packageMatchesDestination } from '../data/destinations';

const TourPackagesPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const destQuery = searchParams.get('destination') || '';
  const durQuery = searchParams.get('duration') || '';
  const monthQuery = searchParams.get('month') || '';

  const [selectedDestination, setSelectedDestination] = useState(destQuery);
  const [selectedDuration, setSelectedDuration] = useState(durQuery);
  const [selectedMonth, setSelectedMonth] = useState(monthQuery);

  const [activeTab, setActiveTab] = useState('international');
  const [activeDuration, setActiveDuration] = useState(durQuery || '4-6');

  useEffect(() => {
    if (durQuery) {
      setActiveDuration(durQuery);
    }
  }, [durQuery]);

  const durations = [
    { id: '1-3', label: '1 to 3 days' },
    { id: '4-6', label: '4 to 6 days' },
    { id: '7-9', label: '7 to 9 days' },
    { id: '10-12', label: '10 to 12 days' },
    { id: '13+', label: '13 days or more' },
  ];

  const topDestinations = ['Bali', 'Dubai', 'Europe', 'Himachal', 'Kerala', 'Thailand', 'Uttarakhand'];

  const handleExplore = () => {
    navigate(`/tour-packages?destination=${selectedDestination}&duration=${selectedDuration}&month=${selectedMonth}`);
  };

  const filteredTablePackages = packages.filter(pkg => {
    let matchDest = true;
    let matchDur = true;
    if (destQuery) {
      const normalizedDestQuery = destQuery.toLowerCase();
      matchDest = packageMatchesDestination(pkg, destQuery)
        || pkg.destination.toLowerCase().includes(normalizedDestQuery)
        || pkg.name.toLowerCase().includes(normalizedDestQuery);
    }
    if (durQuery) {
       if (durQuery === '1-3') matchDur = pkg.days >= 1 && pkg.days <= 3;
       else if (durQuery === '4-6') matchDur = pkg.days >= 4 && pkg.days <= 6;
       else if (durQuery === '7-9') matchDur = pkg.days >= 7 && pkg.days <= 9;
       else if (durQuery === '10-12') matchDur = pkg.days >= 10 && pkg.days <= 12;
       else if (durQuery === '13+') matchDur = pkg.days >= 13;
    }
    return matchDest && matchDur;
  });

  const filteredPackages = packages.filter(p => {
    let matchesDest = true;
    if (destQuery) {
      const normalizedDestQuery = destQuery.toLowerCase();
      matchesDest = packageMatchesDestination(p, destQuery)
        || p.destination.toLowerCase().includes(normalizedDestQuery)
        || p.name.toLowerCase().includes(normalizedDestQuery);
    } else {
      const dest = findDestinationByValue(p.destination);
      matchesDest = activeTab === 'international'
        ? dest?.isInternational === true
        : dest?.isInternational === false;
    }
    
    let matchesDuration = true;
    if (activeDuration === '1-3') matchesDuration = p.days >= 1 && p.days <= 3;
    if (activeDuration === '4-6') matchesDuration = p.days >= 4 && p.days <= 6;
    if (activeDuration === '7-9') matchesDuration = p.days >= 7 && p.days <= 9;
    if (activeDuration === '10-12') matchesDuration = p.days >= 10 && p.days <= 12;
    if (activeDuration === '13+') matchesDuration = p.days >= 13;

    return matchesDest && matchesDuration;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Banner */}
      <div className="relative h-80">
        <img
          src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200"
          alt="Tour Packages"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 w-full max-w-4xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Tour Packages</h1>
            
            {/* Search Form */}
            <div className="bg-white rounded-xl p-4 mt-6 shadow-md border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select 
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal appearance-none text-gray-700">
                    <option value="">Type a Destination</option>
                    {destinations.map(d => (
                      <option key={d.id} value={d.slug}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select 
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal appearance-none text-gray-700">
                    <option value="">Select duration</option>
                    {durations.map(dur => (
                      <option key={dur.id} value={dur.id}>{dur.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal appearance-none text-gray-700">
                    <option value="">Select month</option>
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={handleExplore}
                  className="bg-coral hover:bg-coral-dark text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-sm">
                  Explore
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb & Rating */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Link to="/" className="hover:text-teal transition-colors">The Tribes of Travellers</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-700">Tour Packages</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-tt-dark">Tour Packages</h2>
            <div className="flex flex-wrap items-center text-sm bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
              <span className="text-gray-600 mr-2">Tour Packages: rated</span>
              <span className="font-bold text-gray-900">4.8/5</span>
              <span className="text-gray-600 mx-2">(based on</span>
              <span className="font-bold text-gray-900">123299</span>
              <span className="text-gray-600 mr-2">reviews)</span>
              <span className="hidden md:inline text-gray-300 mx-2">|</span>
              <span className="text-gray-600">Packages starting from</span>
              <span className="font-bold text-teal ml-2">₹999/-</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-gray-700 leading-relaxed">
          <p>
            Tour Packages are one of the best ways to travel hassle-free. With seamless planning, arrangements, and transfers being taken care of, booking tour packages from India is the best way to explore the world's varied landscapes.
          </p>
          <button className="text-teal hover:text-teal-dark hover:underline text-sm mt-3 font-medium transition-colors">Read More</button>
        </div>
      </div>

      {/* Bestselling Packages Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h3 className="text-xl font-bold text-tt-dark mb-6">Bestselling Tour Packages</h3>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Tour Packages</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Duration</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Price*</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Inclusions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTablePackages.length > 0 ? (
                  filteredTablePackages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <Link to={`/packages/${pkg.slug}`} className="text-teal hover:text-teal-dark hover:underline font-medium transition-colors">
                          {pkg.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{pkg.duration}</td>
                      <td className="px-6 py-4 text-sm font-bold text-tt-dark">₹{pkg.price.toLocaleString()}/-</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex flex-wrap gap-2">
                          {pkg.inclusions.map((inc, i) => (
                            <span key={i} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs border border-gray-200">{inc}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No packages found matching your criteria. Try adjusting your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Explore by Destination */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h3 className="text-xl font-bold text-tt-dark">
            {destQuery ? `Explore packages for ${destQuery.charAt(0).toUpperCase() + destQuery.slice(1)}` : 'Explore best selling packages for'}
          </h3>
          {!destQuery && (
            <div className="flex space-x-6">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={activeTab === 'international'}
                  onChange={() => setActiveTab('international')}
                  className="w-5 h-5 rounded text-teal focus:ring-teal border-gray-300 mr-3"
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-tt-dark transition-colors">International Destinations</span>
              </label>
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={activeTab === 'domestic'}
                  onChange={() => setActiveTab('domestic')}
                  className="w-5 h-5 rounded text-teal focus:ring-teal border-gray-300 mr-3"
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-tt-dark transition-colors">Destinations within India</span>
              </label>
            </div>
          )}
        </div>

        {/* Duration Slider */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            {durations.map((dur) => (
              <button
                key={dur.id}
                onClick={() => setActiveDuration(dur.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                  activeDuration === dur.id
                    ? 'bg-teal text-white border-teal shadow-md'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {dur.label}
              </button>
            ))}
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredPackages.length > 0 ? (
            filteredPackages.slice(0, 8).map((pkg) => (
              <Link
                key={pkg.id}
                to={`/packages/${pkg.slug}`}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col"
              >
                <div className="relative h-56 overflow-hidden shrink-0">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 flex items-center bg-black/40 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-medium cursor-pointer hover:bg-black/60 transition-colors z-10" onClick={(e) => e.preventDefault()}>
                    Add To Compare <div className="w-3 h-3 ml-1.5 border border-white/80 rounded-sm"></div>
                  </div>
                  
                  {/* Icons Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/80 to-transparent pt-10 pb-2 px-4">
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-700">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-5 h-5 mb-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Upto 3 Stars
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-5 h-5 mb-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 15a2 2 0 01-2 2H5a2 2 0 01-2-2m18 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v6m18 0l-2-2M3 15l2-2" />
                        </svg>
                        Meals
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-5 h-5 mb-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Sightseeing
                      </div>
                      <div className="flex flex-col justify-center text-teal font-bold ml-auto">
                        +2 more
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1 relative">
                  <h4 className="font-bold text-lg text-tt-dark mb-1 line-clamp-2 leading-tight">{pkg.name}</h4>
                  
                  <div className="flex items-center text-sm mb-3">
                    <span className="text-orange-500 font-bold">{pkg.days} Days & {pkg.nights} Nights</span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="text-gray-400">Customizable</span>
                  </div>

                  <div className="flex items-center justify-between mb-1 text-xs">
                    <div className="flex items-center text-gray-500">
                      Starting from: 
                      {pkg.originalPrice && <span className="bg-teal text-white font-bold px-2 py-0.5 rounded-full ml-2 text-[10px]">{Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)}% Off</span>}
                      <div className="w-3.5 h-3.5 rounded-full border border-gray-300 text-gray-400 flex items-center justify-center ml-1 cursor-help">i</div>
                    </div>
                    <div className="flex gap-1">
                      {pkg.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="border border-gray-200 text-gray-400 px-2 py-0.5 rounded-full text-[10px] capitalize bg-white">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-2xl font-bold text-green-600 tracking-tight">₹ {pkg.price.toLocaleString()}/-</span>
                    {pkg.originalPrice && <span className="text-gray-400 line-through text-sm mb-1">₹ {pkg.originalPrice.toLocaleString()}/-</span>}
                  </div>
                  <p className="text-xs text-gray-400 mb-4 font-medium">Per Person on twin sharing</p>

                  <div className="flex items-start justify-between gap-4 mt-auto border-t border-gray-100 pt-4">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-700 mb-1">Hotel included in package:</p>
                      <div className="flex items-center text-sm text-gray-800">
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-teal bg-white flex items-center justify-center mr-1.5">
                          <div className="w-1.5 h-1.5 bg-teal rounded-full"></div>
                        </div>
                        3 Star
                      </div>
                      <p className="text-xs font-bold text-gray-700 mt-3">Cities: <span className="font-normal text-gray-600">{pkg.destination} ({pkg.days}D)</span></p>
                    </div>
                    <div className="w-1/2">
                      <p className="text-xs text-gray-400 line-clamp-4 leading-relaxed">{pkg.overview || 'Explore the best tour packages for a wonderful vacation experience. Grab exclusive deals now!'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100">
                    <span className="text-coral font-bold text-sm hover:underline cursor-pointer">View Details</span>
                    <button onClick={(e) => { e.preventDefault(); window.open(`https://wa.me/18001235555?text=Hi,%20I'm%20interested%20in%20${pkg.name}`, '_blank'); }} className="bg-coral hover:bg-coral-dark text-white text-sm font-bold py-2.5 px-4 rounded-md transition-colors w-full text-center shadow-sm">
                      Customize & Get Quotes
                    </button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
              No packages found matching these filters.
            </div>
          )}
        </div>
      </div>

      {/* Top Holiday Destinations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-8">
        <h3 className="text-xl font-bold text-tt-dark mb-6">Packages for Top Holiday Destinations</h3>
        <div className="flex flex-wrap gap-3">
          {topDestinations.map((dest) => (
            <Link
              key={dest}
              to={`/destination/${dest.toLowerCase()}`}
              className="px-6 py-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 hover:-translate-y-1 transition-all text-gray-700 font-medium text-sm text-center"
            >
              {dest} Tour Packages
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-teal text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-teal-50 mb-8 text-lg">
            Our travel experts can create a customized package just for you
          </p>
          <Link
            to="/contact_us"
            className="inline-flex items-center bg-white text-teal font-bold px-8 py-4 rounded-lg hover:bg-gray-50 transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
          >
            Get Custom Quote <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourPackagesPage;
