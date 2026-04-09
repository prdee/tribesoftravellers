import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, ChevronRight, Star, Phone, Play, CheckCircle, Users, Shield, Headphones, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { destinations, packages, testimonials, themeCategories, findDestinationByValue } from '../data/destinations';

const HomePage = () => {
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [activeTab, setActiveTab] = useState('international');
  const [activeDuration, setActiveDuration] = useState('4-6');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [bottomDestination, setBottomDestination] = useState('');
  const [isVisible, setIsVisible] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const durations = [
    { id: '1-3', label: '1 to 3 days' },
    { id: '4-6', label: '4 to 6 days' },
    { id: '7-9', label: '7 to 9 days' },
    { id: '10-12', label: '10 to 12 days' },
    { id: '13+', label: '13 days or more' },
  ];

  const budgetRanges = [
    'Less than Rs. 10,000',
    'Rs. 10,000 to Rs. 20,000',
    'Rs. 20,000 to Rs. 40,000',
    'Rs. 40,000 to Rs. 60,000',
    'Rs. 60,000 to Rs. 80,000',
    'Above Rs. 80,000',
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const filteredPackages = packages.filter(p => {
    const dest = findDestinationByValue(p.destination);
    const matchesTab = activeTab === 'international'
      ? dest?.isInternational === true
      : dest?.isInternational === false;
    
    let matchesDuration = true;
    if (activeDuration === '1-3') matchesDuration = p.days >= 1 && p.days <= 3;
    if (activeDuration === '4-6') matchesDuration = p.days >= 4 && p.days <= 6;
    if (activeDuration === '7-9') matchesDuration = p.days >= 7 && p.days <= 9;
    if (activeDuration === '10-12') matchesDuration = p.days >= 10 && p.days <= 12;
    if (activeDuration === '13+') matchesDuration = p.days >= 13;

    return matchesTab && matchesDuration;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-tt-dark mb-4 leading-tight">
                Customize & Book<br />
                <span className="text-teal">Amazing Holiday Packages</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                650+ Travel Agents serving 65+ Destinations worldwide
              </p>
              
              {/* Search Form */}
              <div className="bg-white rounded-xl shadow-card p-4 border border-gray-100">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={selectedDestination}
                      onChange={(e) => setSelectedDestination(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal appearance-none bg-white"
                    >
                      <option value="">Type a Destination</option>
                      {destinations.map(d => (
                        <option key={d.id} value={d.slug}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={selectedDuration}
                      onChange={(e) => setSelectedDuration(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal appearance-none bg-white"
                    >
                      <option value="">Select duration</option>
                      {durations.map(d => (
                        <option key={d.id} value={d.id}>{d.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal appearance-none bg-white"
                    >
                      <option value="">Select month</option>
                      {months.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <Link
                    to={`/tour-packages?destination=${selectedDestination}&duration=${selectedDuration}&month=${selectedMonth}`}
                    className="bg-coral hover:bg-coral-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center shadow-md"
                  >
                    Explore
                  </Link>
                </div>
                <p className="text-sm text-gray-500 mt-3 text-center md:text-left">
                  Destination not sure?{' '}
                  <Link to="/honeymoon-places" className="text-teal hover:underline font-medium">
                    Click here!
                  </Link>
                </p>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
              <img
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800"
                alt="Travel"
                className="rounded-2xl shadow-xl w-full object-cover h-[500px]"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-teal" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-tt-dark">22 Lac+</p>
                    <p className="text-sm text-gray-500">Happy Travelers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destination Themes Section */}
      <section id="themes" data-animate className={`py-16 bg-gray-50 transition-all duration-700 ${isVisible['themes'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-tt-dark">
              Explore destinations by theme
            </h2>
            <a href="tel:1800-123-5555" className="hidden md:flex items-center text-teal font-semibold">
              <Phone className="w-5 h-5 mr-2" />
              For best packages, call us at 1800-123-5555
            </a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {themeCategories.slice(0, 6).map((theme) => (
              <Link
                key={theme.id}
                to={`/${theme.id}-places`}
                className="group relative overflow-hidden rounded-xl aspect-[3/4] bg-white shadow-sm"
              >
                <img
                  src={theme.image}
                  alt={theme.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-sm">{theme.name}</h3>
                  <p className="text-xs text-gray-300">{theme.destinations}+ destinations</p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link
              to="/All-Places"
              className="inline-flex items-center text-teal font-semibold hover:underline"
            >
              View All <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Best Selling Packages Section */}
      <section id="packages" data-animate className={`py-16 bg-white transition-all duration-700 ${isVisible['packages'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-tt-dark mb-6">
            Explore best selling packages for
          </h2>
          
          {/* Tabs */}
          <div className="flex space-x-6 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('international')}
              className={`flex items-center space-x-2 pb-3 border-b-2 transition-colors ${
                activeTab === 'international'
                  ? 'border-teal text-teal'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <input
                type="checkbox"
                checked={activeTab === 'international'}
                onChange={() => setActiveTab('international')}
                className="w-4 h-4 text-teal rounded focus:ring-teal"
              />
              <span className="font-medium">International Destinations</span>
            </button>
            <button
              onClick={() => setActiveTab('domestic')}
              className={`flex items-center space-x-2 pb-3 border-b-2 transition-colors ${
                activeTab === 'domestic'
                  ? 'border-teal text-teal'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <input
                type="checkbox"
                checked={activeTab === 'domestic'}
                onChange={() => setActiveTab('domestic')}
                className="w-4 h-4 text-teal rounded focus:ring-teal"
              />
              <span className="font-medium">Destinations within India</span>
            </button>
          </div>
          
          {/* Duration Slider */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 max-w-4xl">
              {durations.map((dur) => (
                <button
                  key={dur.id}
                  onClick={() => setActiveDuration(dur.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
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
            {filteredPackages.slice(0, 8).map((pkg) => (
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
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" data-animate className={`py-16 bg-gray-50 transition-all duration-700 ${isVisible['how-it-works'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-tt-dark mb-4">
              How it works
            </h2>
            <p className="text-gray-600">Customize & Book Amazing Holiday Packages in 3 Simple Steps</p>
            
            <Dialog>
              <DialogTrigger asChild>
                <button className="mt-4 inline-flex items-center text-teal hover:underline font-medium">
                  <Play className="w-5 h-5 mr-2" /> Watch Video
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl bg-white">
                <DialogHeader>
                  <DialogTitle className="text-tt-dark">How The Tribes of Travellers Works</DialogTitle>
                </DialogHeader>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Video content would play here</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: 'Select your package', desc: '& tell us your preferences', icon: '📋' },
              { step: 2, title: 'Get multiple free quotes', desc: 'from verified travel experts', icon: '💬' },
              { step: 3, title: 'Customize & book', desc: 'a perfect holiday experience', icon: '✅' },
            ].map((item) => (
              <div key={item.step} className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:-translate-y-2 transition-transform">
                <div className="w-20 h-20 mx-auto bg-teal/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <div className="w-8 h-8 mx-auto bg-teal text-white rounded-full flex items-center justify-center font-bold mb-3">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg text-tt-dark mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" data-animate className={`py-16 bg-white transition-all duration-700 ${isVisible['testimonials'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-tt-dark mb-8 text-center">
            Over 40 Lac+ Happy Travelers
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Real travelers. Real stories. Real opinions to help you make the right choice.
          </p>
          
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Testimonial Images */}
            <div className="grid grid-cols-4 gap-2">
              {testimonials.slice(0, 8).map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
                    currentTestimonial === i ? 'ring-4 ring-teal scale-105 z-10 shadow-lg' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            
            {/* Testimonial Content */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
              <div className="flex items-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <h3 className="text-xl font-bold text-tt-dark mb-2">
                {testimonials[currentTestimonial].name}'s {testimonials[currentTestimonial].destination} Holiday
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {testimonials[currentTestimonial].tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-white text-gray-600 border border-gray-200 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "{testimonials[currentTestimonial].review}"
              </p>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center">
                  <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-white shadow-sm"
                  />
                  <div>
                    <p className="font-semibold text-tt-dark">{testimonials[currentTestimonial].name}</p>
                    <p className="text-sm text-gray-500">{testimonials[currentTestimonial].location}, {testimonials[currentTestimonial].date}</p>
                  </div>
                </div>
              </div>
              <Link
                to={`/tour-packages?destination=${testimonials[currentTestimonial].destination}`}
                className="mt-6 block w-full bg-teal hover:bg-teal-dark text-white text-center py-3 rounded-lg font-semibold transition-colors shadow-md"
              >
                Get Quotes for this Package
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trip Planning Stage Section */}
      <section id="planning" data-animate className={`py-16 bg-gray-50 transition-all duration-700 ${isVisible['planning'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-tt-dark mb-4">
              Let us help you plan your perfect holiday
            </h2>
            <p className="text-gray-600">Select Your Trip Planning Stage</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { title: 'I know my destination', icon: MapPin, link: '/tour-packages' },
              { title: "My destination isn't finalized", icon: Calendar, link: '/honeymoon-places' },
              { title: 'I want a customized package', icon: CheckCircle, link: '/contact_us' },
            ].map((item) => (
              <Link
                key={item.title}
                to={item.link}
                className="group bg-white border border-gray-100 p-6 text-center rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <item.icon className="w-12 h-12 mx-auto text-teal mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-tt-dark">{item.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" data-animate className={`py-16 bg-white border-y border-gray-100 transition-all duration-700 ${isVisible['stats'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-tt-dark mb-8">
                Fastest Growing Holiday Marketplace
              </h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: '650+', label: 'Verified Agents', icon: Users },
                  { value: '22 Lac+', label: 'Happy Travellers', icon: Users },
                  { value: '65+', label: 'Destinations', icon: MapPin },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="bg-teal/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <stat.icon className="w-8 h-8 text-teal" />
                    </div>
                    <p className="text-2xl font-bold text-tt-dark">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-tt-dark mb-8">
                Easy, Secure & Reliable
              </h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: 'Verified', label: 'The Tribes of Travellers', icon: CheckCircle },
                  { value: 'Stringent', label: 'Quality Control', icon: Shield },
                  { value: '24/7', label: 'Support', icon: Headphones },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="bg-coral/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <stat.icon className="w-8 h-8 text-coral" />
                    </div>
                    <p className="text-lg font-bold text-tt-dark">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Budget Filter Section */}
      <section id="budget" data-animate className={`py-16 bg-gray-50 transition-all duration-700 ${isVisible['budget'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-tt-dark mb-2">
              Choose Your Destination by 4 Simple Filters
            </h2>
            <p className="text-gray-600">Filter by Budget, Duration, Season & Holiday themes</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
            <h3 className="text-lg font-semibold text-tt-dark mb-4">
              Best priced packages within your BUDGET
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {budgetRanges.map((range) => (
                <button
                  key={range}
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-teal hover:text-white hover:border-teal transition-colors text-center"
                >
                  {range}
                </button>
              ))}
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <p className="text-gray-600">
                You have <span className="text-teal font-bold text-xl">4335+</span> packages
              </p>
              <Link
                to="/tour-packages"
                className="text-teal font-semibold hover:underline flex items-center"
              >
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
          
          {/* Package Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.slice(0, 4).map((pkg) => (
              <Link
                key={pkg.id}
                to={`/packages/${pkg.slug}`}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-2 left-2 bg-coral text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                    Expert's Pick
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-teal font-medium">{pkg.destination}</p>
                  <p className="text-xs text-gray-500 mb-2">({pkg.duration})</p>
                  <h4 className="font-semibold text-tt-dark text-sm line-clamp-2">{pkg.name}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-teal text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-bold mb-6">
            Our experts would love to create a package just for you!
          </h2>
          <Link
            to="/contact_us"
            className="inline-block bg-white text-teal font-bold px-8 py-4 rounded-lg hover:bg-gray-50 transition-all shadow-lg hover:-translate-y-1"
          >
            Fill in your requirements here &gt;
          </Link>
        </div>
      </section>

      {/* Where to Go Form */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-teal" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-tt-dark text-center mb-8">
              Where do you want to go?
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={bottomDestination}
                    onChange={(e) => setBottomDestination(e.target.value)}
                    placeholder="Enter destination"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input type="checkbox" id="exploring" className="w-4 h-4 rounded text-teal focus:ring-teal border-gray-300" />
                <label htmlFor="exploring" className="text-sm text-gray-600 ml-2">I am exploring destinations</label>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                  <input
                    type="text"
                    placeholder="Departure city"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date (Choose Any)</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal"
                  />
                </div>
              </div>
              
              <Link 
                to={`/tour-packages?destination=${bottomDestination}`}
                className="w-full block text-center bg-coral hover:bg-coral-dark text-white py-4 rounded-lg font-bold text-lg shadow-md transition-all"
              >
                Next
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
