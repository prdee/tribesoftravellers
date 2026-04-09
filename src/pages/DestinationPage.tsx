import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronDown, Filter } from 'lucide-react';
import { destinations, getDestinationsByType } from '../data/destinations';

interface DestinationPageProps {
  type: string;
}

const DestinationPage = ({ type }: DestinationPageProps) => {
  const [filters, setFilters] = useState({
    india: false,
    international: false,
    budget: [] as string[],
    duration: [] as string[],
    activities: [] as string[],
  });
  const [showFilters, setShowFilters] = useState(true);
  const [expandedInfo, setExpandedInfo] = useState<string | null>(null);

  const typeTitles: { [key: string]: { title: string; subtitle: string; description: string } } = {
    honeymoon: {
      title: 'Honeymoon places in & outside India',
      subtitle: 'Showing 151 results',
      description: 'Almost nothing can override love between two people who decide to spend the rest of their lives with each other. It\'s a profoundly pure feeling that forms the very basis of mankind. Perhaps, the only feeling that deserves to be shown off. And what better way to display love towards your loved one than embarking on a romantic holiday to some heavenly honeymoon place in the world!',
    },
    family: {
      title: 'Family Holiday Destinations',
      subtitle: 'Showing 200+ results',
      description: 'Plan the perfect family vacation with our curated list of family-friendly destinations. From adventure parks to educational tours, create memories that last a lifetime.',
    },
    holiday: {
      title: 'Holiday Packages',
      subtitle: 'Showing 500+ results',
      description: 'Discover amazing holiday packages for every type of traveler. Whether you seek adventure, relaxation, or cultural experiences, we have the perfect package for you.',
    },
    deals: {
      title: 'Holiday Deals',
      subtitle: 'Limited Time Offers',
      description: 'Grab the best deals on holiday packages. Save big on your next vacation with our exclusive discounts and special offers.',
    },
    luxury: {
      title: 'Luxury Holidays',
      subtitle: 'Premium Experiences',
      description: 'Indulge in luxury travel experiences. From 5-star resorts to private villas, experience the finest hospitality around the world.',
    },
    adventure: {
      title: 'Adventure Destinations',
      subtitle: 'Showing 80+ results',
      description: 'Get your adrenaline pumping with our adventure travel packages. From trekking to water sports, experience thrilling adventures.',
    },
    nature: {
      title: 'Nature & Wildlife Destinations',
      subtitle: 'Showing 150+ results',
      description: 'Connect with nature at its best. Explore national parks, wildlife sanctuaries, and pristine natural landscapes.',
    },
    friends: {
      title: 'Group & Friends Destinations',
      subtitle: 'Showing 50+ results',
      description: 'Plan an unforgettable trip with your friends. From party destinations to group adventures, create memories together.',
    },
    hotels: {
      title: 'Hotels & Accommodations',
      subtitle: 'Best Stays',
      description: 'Find the perfect accommodation for your trip. From budget-friendly to luxury hotels, we have options for every traveler.',
    },
    guides: {
      title: 'Destination Guides',
      subtitle: 'Travel Information',
      description: 'Get comprehensive travel guides for destinations around the world. Plan your trip with expert tips and recommendations.',
    },
    themes: {
      title: 'Holiday Themes',
      subtitle: 'Travel by Interest',
      description: 'Explore destinations based on your interests. From beach holidays to mountain retreats, find your perfect theme.',
    },
  };

  const pageInfo = typeTitles[type] || typeTitles.holiday;

  // Filter destinations based on type and filters
  let filteredDestinations = type === 'holiday' || type === 'deals' || type === 'hotels' || type === 'guides' || type === 'themes'
    ? destinations
    : getDestinationsByType(type);

  if (filters.india && !filters.international) {
    filteredDestinations = filteredDestinations.filter(d => !d.isInternational);
  } else if (filters.international && !filters.india) {
    filteredDestinations = filteredDestinations.filter(d => d.isInternational);
  }

  const budgetRanges = [
    'Less than 10,000',
    '10,000 - 20,000',
    '20,000 - 40,000',
    '40,000 - 60,000',
    '60,000 - 80,000',
    'Above 80,000',
  ];

  const durations = ['1 to 3', '4 to 6', '7 to 9', '10 to 12', '13 or more'];

  const activities = ['Nature', 'Beach', 'Water Activities', 'City Tours', 'Adventure', 'Wildlife'];

  const toggleFilter = (category: 'budget' | 'duration' | 'activities', value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value],
    }));
  };

  const clearFilters = () => {
    setFilters({
      india: false,
      international: false,
      budget: [],
      duration: [],
      activities: [],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['All', 'Honeymoon', 'Adventure', 'Family', 'Friends / Group', 'Nature', 'Religious', 'Wildlife', 'Water Activities'].map((cat) => (
              <Link
                key={cat}
                to={`/${cat.toLowerCase().replace(/\s+/g, '-')}-places`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  (type === 'honeymoon' && cat === 'Honeymoon') ||
                  (type === 'adventure' && cat === 'Adventure') ||
                  (type === 'family' && cat === 'Family') ||
                  (type === 'friends' && cat === 'Friends / Group') ||
                  (type === 'nature' && cat === 'Nature')
                    ? 'bg-teal text-white border-teal shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          <h1 className="text-3xl font-bold text-tt-dark mb-2">{pageInfo.title}</h1>
          <p className="text-gray-500 mb-4">{pageInfo.subtitle}</p>
          <p className="text-gray-700 max-w-4xl leading-relaxed">{pageInfo.description}</p>
          
          <button className="text-teal hover:text-teal-dark hover:underline text-sm mt-4 flex items-center transition-colors">
            Read More <ChevronDown className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <h3 className="font-bold text-lg text-tt-dark">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-teal text-sm hover:text-teal-dark transition-colors"
                >
                  RESET
                </button>
              </div>

              {/* Destination Type */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center justify-between">
                  Type Of Destination
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.india}
                      onChange={() => setFilters(prev => ({ ...prev, india: !prev.india, international: false }))}
                      className="w-4 h-4 rounded text-teal focus:ring-teal border-gray-300 mr-3"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">India</span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.international}
                      onChange={() => setFilters(prev => ({ ...prev, international: !prev.international, india: false }))}
                      className="w-4 h-4 rounded text-teal focus:ring-teal border-gray-300 mr-3"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">International</span>
                  </label>
                </div>
              </div>

              {/* Budget */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center justify-between">
                  Budget Per Person (Rs)
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </h4>
                <div className="space-y-3">
                  {budgetRanges.map((range) => (
                    <label key={range} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.budget.includes(range)}
                        onChange={() => toggleFilter('budget', range)}
                        className="w-4 h-4 rounded text-teal focus:ring-teal border-gray-300 mr-3"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Duration (in Days)</h4>
                <div className="flex flex-wrap gap-2">
                  {durations.map((dur) => (
                    <button
                      key={dur}
                      onClick={() => toggleFilter('duration', dur)}
                      className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                        filters.duration.includes(dur)
                          ? 'bg-teal text-white border-teal shadow-sm'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div className="mb-2">
                <h4 className="font-semibold text-gray-800 mb-3">Activities</h4>
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <label key={activity} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.activities.includes(activity)}
                        onChange={() => toggleFilter('activities', activity)}
                        className="w-4 h-4 rounded text-teal focus:ring-teal border-gray-300 mr-3"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{activity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden mb-6 flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>

            <div className="grid md:grid-cols-2 gap-6">
              {filteredDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-transform duration-300 flex flex-col"
                >
                  <div className="relative h-56 shrink-0">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-xs font-bold text-tt-dark shadow-sm">
                      Best time:<br />{dest.bestTime}
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded flex items-center text-tt-dark shadow-sm">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="text-sm font-bold">{dest.rating}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center text-white text-sm">
                        <span className="font-bold">{dest.travelers.toLocaleString()}+ Travelers</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-tt-dark">{dest.name}</h3>
                      <div className="text-right">
                        <p className="text-teal font-bold">₹ {dest.startingPrice >= 1000 ? (dest.startingPrice/1000).toFixed(0) + 'K' : dest.startingPrice} to {dest.startingPrice > 50000 ? '2Lac' : '49K'}</p>
                        <p className="text-xs text-gray-500">per person</p>
                        <p className="text-xs text-gray-400">(Flight Excluded)</p>
                      </div>
                    </div>
                    
                    <p className={`text-sm text-gray-600 mb-3 leading-relaxed ${expandedInfo === dest.id ? '' : 'line-clamp-2'}`}>
                      {dest.description}
                    </p>
                    
                    <button
                      onClick={() => setExpandedInfo(expandedInfo === dest.id ? null : dest.id)}
                      className="text-teal text-sm hover:text-teal-dark transition-colors mb-4 text-left font-medium"
                    >
                      {expandedInfo === dest.id ? 'Show Less' : 'Expand info'}
                    </button>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <Link
                        to={`/destination/${dest.slug}`}
                        className="block w-full bg-teal hover:bg-teal-dark text-white text-center py-3 rounded-lg transition-colors shadow-sm"
                      >
                        <span className="font-bold">Explore packages</span><br />
                        <span className="text-xs font-normal text-teal-50">Personalize {dest.packages}+ Packages</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationPage;