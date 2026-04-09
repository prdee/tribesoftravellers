import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { packages } from '../data/destinations';

const TravelGuidePage = () => {
  const { slug, placeSlug } = useParams<{ slug: string; placeSlug: string }>();
  const [activeTab, setActiveTab] = useState('how-to-reach');

  const placeName = placeSlug ? placeSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Cola Beach';
  const destinationName = slug ? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Goa';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'how-to-reach', label: 'How to reach' },
    { id: 'entry-fees', label: 'Entry fees' },
    { id: 'timings', label: 'Timings' },
  ];

  const travelData = [
    { from: `Pune to ${destinationName}`, air: '1.0 hours', road: '7.0 hours', train: '11.0 hours', sea: '-' },
    { from: `Kolkata to ${destinationName}`, air: '7.0 hours', road: '50.0 hours', train: '33.0 hours', sea: '-' },
    { from: `New Delhi to ${destinationName}`, air: '2.0 hours', road: '18.0 hours', train: '25.0 hours', sea: '-' },
    { from: `Bangalore to ${destinationName}`, air: '1.5 hours', road: '14.0 hours', train: '14.0 hours', sea: '-' },
    { from: `Mumbai to ${destinationName}`, air: '1.0 hours', road: '10.0 hours', train: '6.0 hours', sea: '-' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero Image */}
      <div className="h-64 md:h-80 w-full relative">
        <img 
          src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600" 
          alt={placeName} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Sticky Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-14 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="flex overflow-x-auto no-scrollbar py-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-4 transition-colors ${
                    activeTab === tab.id ? 'border-teal text-teal' : 'border-transparent text-gray-600 hover:text-teal hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="py-3 sm:py-0 hidden sm:block">
              <button 
                onClick={() => window.open(`https://wa.me/18001235555?text=Hi,%20I'm%20interested%20in%20visiting%20${placeName}`, '_blank')}
                className="bg-coral hover:bg-coral-dark text-white font-bold py-2 px-6 rounded text-sm transition-colors shadow-sm"
              >
                Get Free Quotes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Breadcrumb */}
            <div className="flex items-center text-xs text-gray-500 mb-6 flex-wrap">
              <Link to="/" className="hover:text-teal text-teal">The Tribes of Travellers</Link>
              <span className="mx-1.5">&gt;</span>
              <Link to="/destination/india" className="hover:text-teal text-teal">India</Link>
              <span className="mx-1.5">&gt;</span>
              <Link to={`/destination/${destinationName.toLowerCase()}`} className="hover:text-teal text-teal">{destinationName}</Link>
              <span className="mx-1.5">&gt;</span>
              <Link to={`/destination/${destinationName.toLowerCase()}-tourism`} className="hover:text-teal text-teal">{destinationName} Tourism</Link>
              <span className="mx-1.5">&gt;</span>
              <span className="hover:text-teal text-teal cursor-pointer">Places To Visit</span>
              <span className="mx-1.5">&gt;</span>
              <span className="hover:text-teal text-teal cursor-pointer">{placeName}</span>
              <span className="mx-1.5">&gt;</span>
              <span className="text-gray-700">How To Reach</span>
              <span className="ml-auto text-[10px] text-gray-400 hidden md:block">Rated 4.30/5 (based on 4272 reviews)</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-tt-dark mb-4">
              How To Reach {placeName} In {destinationName}
            </h1>
            
            <p className="text-gray-600 leading-relaxed mb-4 text-sm md:text-base">
              {placeName} is a perfect escape from the city's hustle-bustle life. People come here to spend some serene moments in a secluded and beautiful beach. So if you also want to explore {placeName} in South {destinationName} and wondering <strong className="text-gray-800">how to reach {placeName}</strong>, go through our detailed guide and choose the best possible mode of transportation.
            </p>
            
            <button className="text-teal hover:text-teal-dark hover:underline text-sm font-medium mb-8">
              Read More
            </button>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-3 mb-8">
              {travelData.map((data, index) => (
                <button key={index} className="border border-teal/30 text-teal hover:bg-teal hover:text-white px-4 py-1.5 rounded-full text-xs font-medium transition-colors">
                  {data.from}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-12">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 font-bold text-gray-700 w-1/4"></th>
                      <th className="px-6 py-4 font-bold text-gray-700 text-center">By Air</th>
                      <th className="px-6 py-4 font-bold text-gray-700 text-center">By Road</th>
                      <th className="px-6 py-4 font-bold text-gray-700 text-center">By Train</th>
                      <th className="px-6 py-4 font-bold text-gray-700 text-center">By Sea</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {travelData.map((data, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-teal">{data.from}</td>
                        <td className="px-6 py-4 text-gray-600 text-center">{data.air}</td>
                        <td className="px-6 py-4 text-gray-600 text-center">{data.road}</td>
                        <td className="px-6 py-4 text-gray-600 text-center">{data.train}</td>
                        <td className="px-6 py-4 text-gray-600 text-center">{data.sea}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Popular Packages */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-tt-dark">Popular Packages</h2>
                <p className="text-xs text-gray-400">Unlimited Choices. Trusted Agents. Best Prices. Happy Memories.</p>
              </div>
              <Link to={`/tour-packages?destination=${destinationName.toLowerCase()}`} className="text-teal font-bold text-sm hover:underline">
                View All
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {packages.filter(p => p.destination === destinationName).slice(0, 3).map(pkg => (
                <Link key={pkg.id} to={`/packages/${pkg.slug}`} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
                  <div className="h-32 relative overflow-hidden">
                    <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {pkg.duration}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-tt-dark text-sm line-clamp-2 mb-2 leading-tight group-hover:text-teal transition-colors">{pkg.name}</h3>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Starting from</span>
                      <span className="font-bold text-teal text-base">₹{pkg.price.toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>

          {/* Right Sidebar - Trip Planner */}
          <div className="lg:w-1/3">
            <div className="sticky top-32">
              <div className="bg-white rounded-lg shadow-card border border-gray-100 overflow-hidden">
                <div className="bg-teal text-white font-bold px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center mr-2">
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                    Trip Planner
                  </div>
                  <button className="text-white/80 hover:text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-5 bg-gray-50">
                  <div className="bg-white border border-gray-200 rounded-xl rounded-tl-sm p-4 text-gray-700 text-sm w-11/12 shadow-sm mb-6">
                    <p className="mb-2">Hey! I'm The Tribes of Travellers Trip Planner...</p>
                    <p>Are you looking for help in planning your trip?</p>
                  </div>

                  <div className="space-y-2">
                    {['Yes! A romantic trip', 'Yes! For a family trip', 'Yes! A honeymoon trip', 'Yes! For a trip with my friends'].map((type) => (
                      <button key={type} className="w-full text-left bg-white border border-teal text-teal hover:bg-teal hover:text-white px-4 py-2.5 rounded-full text-sm transition-colors">
                        {type}
                      </button>
                    ))}
                    <div className="flex gap-2">
                      <button className="flex-1 bg-white border border-teal text-teal hover:bg-teal hover:text-white px-4 py-2.5 rounded-full text-sm transition-colors text-center">
                        For a group trip
                      </button>
                      <button className="flex-1 bg-white border border-teal text-teal hover:bg-teal hover:text-white px-4 py-2.5 rounded-full text-sm transition-colors text-center">
                        For a solo trip
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
                  <input type="text" placeholder="Select or type your destination..." className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-teal" />
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded text-sm transition-colors">
                    SEND
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TravelGuidePage;
