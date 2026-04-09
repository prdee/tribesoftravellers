import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronDown, Star, Phone } from 'lucide-react';
import { packages, getDestinationBySlug, getPackagesByDestination } from '../data/destinations';

const DestinationDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [expandedCity, setExpandedCity] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  
  const destination = slug ? getDestinationBySlug(slug) : null;
  
  // If destination not found, show a generic page
  const destData = destination || {
    name: slug?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Destination',
    slug: slug || '',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200',
    packages: 50,
    startingPrice: 10000,
    bestTime: 'OCT - MAR',
    rating: 4.5,
    travelers: 5000,
    description: 'Explore this amazing destination with our curated travel packages.',
    isInternational: false,
  };

  const faqs = [
    { question: `When is the best time to visit ${destData.name}?`, answer: `The best time to visit ${destData.name} is generally between ${destData.bestTime}. The weather is pleasant and ideal for sightseeing and outdoor activities.` },
    { question: `How many days are enough for a trip to ${destData.name}?`, answer: `Typically, a trip of 4 to 6 days is sufficient to explore the major attractions of ${destData.name}. However, if you want a more relaxed pace, you can plan for 7 to 9 days.` },
    { question: `What are some of the famous places to visit in ${destData.name}?`, answer: `Some of the top places to visit include the beautiful beaches, historic temples, local markets, and scenic viewpoints that ${destData.name} is famous for.` },
    { question: `What can one shop for in ${destData.name}?`, answer: `You can shop for local handicrafts, traditional clothing, spices, and unique souvenirs at the vibrant local markets in ${destData.name}.` }
  ];

  const relatedPackages = slug ? getPackagesByDestination(slug) : packages.slice(0, 4);
  const displayPackages = relatedPackages.length > 0 ? relatedPackages : packages.slice(0, 4);

  const cities = [
    'Munnar', 'Alleppey', 'Thekkady', 'Kochi', 'Kovalam', 'Trivandrum', 
    'Kumarakom', 'Varkala', 'Wayanad', 'Cherai', 'Vagamon'
  ];

  const travelGuides = [
    { name: `${destData.name} Tour Packages`, path: `/tour-packages?destination=${destData.slug}` },
    { name: `${destData.name} Tourism`, path: `#` },
    { name: `Places to Visit in ${destData.name}`, path: `#` },
    { name: `Things to Do in ${destData.name}`, path: `#` },
    { name: `${destData.name} Travel Guide Tips`, path: `#` },
    { name: `Best Time to Visit ${destData.name}`, path: `#` },
    { name: `How To Reach ${destData.name} From Kolkata`, path: `#` },
    { name: `How To Reach ${destData.name} From Bangalore`, path: `#` },
    { name: `How To Reach ${destData.name} From New Delhi`, path: `#` },
    { name: `How To Reach ${destData.name} From Mumbai`, path: `#` },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-teal transition-colors">The Tribes of Travellers</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-700">{destData.name} Travel Guide</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-tt-dark mb-4">
            Explore {destData.name} At The Tribes of Travellers
          </h1>
          
          {/* Travel Guide Links */}
          <div className="flex flex-wrap gap-2">
            {travelGuides.slice(0, 7).map((guide) => (
              <Link
                key={guide.name}
                to={guide.path}
                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-sm text-gray-700 transition-colors shadow-sm"
              >
                {guide.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Destination Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative group">
              <img
                src={destData.image}
                alt={destData.name}
                className="rounded-xl shadow-md w-full h-96 object-cover group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl"></div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-white text-tt-dark px-3 py-1 rounded text-sm font-bold shadow-sm">
                  {destData.name}
                </span>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-tt-dark mb-4">
                Discover {destData.name}
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {destData.description}
              </p>
              
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-gray-50 border border-gray-100 rounded-lg">
                  <p className="text-2xl font-bold text-teal">{destData.packages}+</p>
                  <p className="text-sm text-gray-500">Packages</p>
                </div>
                <div className="text-center p-4 bg-gray-50 border border-gray-100 rounded-lg">
                  <p className="text-2xl font-bold text-teal">{destData.travelers.toLocaleString()}+</p>
                  <p className="text-sm text-gray-500">Travelers</p>
                </div>
                <div className="text-center p-4 bg-gray-50 border border-gray-100 rounded-lg">
                  <div className="flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    <span className="text-2xl font-bold text-teal ml-1">{destData.rating}</span>
                  </div>
                  <p className="text-sm text-gray-500">Rating</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-teal/5 border border-teal/10 rounded-lg mb-8">
                <div className="text-center sm:text-left mb-4 sm:mb-0">
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Best Time to Visit</p>
                  <p className="font-bold text-tt-dark text-lg">{destData.bestTime}</p>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Starting From</p>
                  <p className="font-bold text-teal text-2xl">₹{destData.startingPrice.toLocaleString()}</p>
                </div>
              </div>
              
              <Link
                to={`/tour-packages?destination=${destData.slug}`}
                className="inline-block bg-coral hover:bg-coral-dark text-white font-bold px-8 py-3 rounded-lg transition-colors shadow-md hover:-translate-y-1"
              >
                Explore Packages
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Cities Accordion */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-tt-dark mb-6">Top Destinations in {destData.name}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {cities.map((city) => (
            <div key={city} className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
              <button
                onClick={() => setExpandedCity(expandedCity === city ? null : city)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-tt-dark">{city}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedCity === city ? 'rotate-180' : ''}`} />
              </button>
              {expandedCity === city && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Explore {city} with our curated packages. Known for its beautiful landscapes and rich culture.
                  </p>
                  <div className="mt-3 flex gap-3">
                    <Link
                      to={`/tour-packages?destination=${destData.slug}`}
                      className="inline-block text-teal hover:text-teal-dark hover:underline text-sm font-semibold transition-colors"
                    >
                      View Packages
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link
                      to={`/destination/${destData.slug}/places-to-visit/${city.toLowerCase().replace(/\s+/g, '-')}`}
                      className="inline-block text-coral hover:text-coral-dark hover:underline text-sm font-semibold transition-colors"
                    >
                      Travel Guide
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Related Packages */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-tt-dark mb-8">
          Popular {destData.name} Packages
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-tt-dark text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
                  {pkg.rating}
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-teal font-medium">{pkg.destination}</p>
                <p className="text-xs text-gray-500 mb-2">({pkg.duration})</p>
                <h4 className="font-bold text-tt-dark text-sm mt-2 line-clamp-2">{pkg.name}</h4>
                <div className="flex flex-wrap gap-2 mt-3">
                  {pkg.inclusions.slice(0, 3).map((inc, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{inc}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Starting from</p>
                    <p className="font-bold text-teal text-lg">₹{pkg.price.toLocaleString()}</p>
                  </div>
                  <Link
                    to={`/packages/${pkg.slug}`}
                    className="bg-white border border-teal text-teal hover:bg-teal hover:text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-tt-dark mb-2">Frequently Asked Questions</h2>
          <p className="text-gray-600">Get your answers — before you plan your trip.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* FAQ Accordion */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-tt-dark mb-6">FAQs About {destData.name} Packages</h3>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className="w-full flex items-center justify-between text-left focus:outline-none group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full border-2 border-coral text-coral flex items-center justify-center font-bold text-sm group-hover:bg-coral group-hover:text-white transition-colors shrink-0">
                        Q
                      </div>
                      <span className="font-semibold text-gray-800 text-sm md:text-base group-hover:text-coral transition-colors">{faq.question}</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedFAQ === index ? 'rotate-180 text-coral' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedFAQ === index ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                    <p className="text-gray-600 text-sm pl-9">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <button className="border border-blue-500 text-blue-500 hover:bg-blue-50 font-semibold px-8 py-2.5 rounded transition-colors">
                Load More
              </button>
            </div>
          </div>

          {/* Why Book With Us Card */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 shadow-sm rounded overflow-hidden">
              <div className="bg-teal text-white font-bold text-center py-4 px-4 text-lg">
                Why Book With Our Agents?
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Only The Best Agents</h4>
                  <p className="text-sm text-gray-600">Travelers deal with only the top 10% reviewed agents who are selected after a 23 step rigorous assessment procedure by The Tribes of Travellers.</p>
                </div>
                <div className="border-t border-gray-100 pt-6">
                  <h4 className="font-bold text-gray-800 mb-2">Ensuring Quality</h4>
                  <p className="text-sm text-gray-600">The Tribes of Travellers ensures quality service via verified partners by releasing the payment only after the booking vouchers/receipts are received by the traveler.</p>
                </div>
                <div className="border-t border-gray-100 pt-6">
                  <h4 className="font-bold text-gray-800 mb-2">24*7 On-trip assistance by Local Travel Agents</h4>
                  <p className="text-sm text-gray-600">Travelers deal with only the top 10% reviewed agents who are selected after a 23 step rigorous assessment procedure by The Tribes of Travellers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-teal text-white py-16 mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            Plan Your {destData.name} Trip Today!
          </h2>
          <p className="text-teal-50 mb-8 text-lg">
            Get customized packages from our verified travel experts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={`/tour-packages?destination=${destData.slug}`}
              className="inline-block bg-coral hover:bg-coral-dark text-white font-bold px-8 py-4 rounded-lg transition-all shadow-md hover:-translate-y-1"
            >
              Browse Packages
            </Link>
            <a
              href="tel:1800-123-5555"
              className="inline-flex items-center justify-center bg-white text-teal font-bold px-8 py-4 rounded-lg transition-all shadow-md hover:-translate-y-1"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call 1800-123-5555
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetailPage;
