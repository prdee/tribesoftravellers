import { Link } from 'react-router-dom';
import { Users, MapPin, Award, TrendingUp } from 'lucide-react';

const AboutPage = () => {
  const stats = [
    { value: '20 Lakh+', label: 'Travelers monthly visiting us', icon: Users },
    { value: '650+', label: 'Network of expert travel agents', icon: MapPin },
    { value: '65+', label: 'Destinations served worldwide', icon: Award },
    { value: '97%', label: 'Positive quotient by travelers', icon: TrendingUp },
  ];

  const investors = [
    { name: 'Nandan Nilekani', role: 'Co-Founder and Chairman' },
    { name: 'Sanjeev Aggarwal', role: 'Co-Founder' },
    { name: 'Ashish Kumar', role: 'Principal' },
    { name: 'Mayank Khanduja', role: 'Principal' },
    { name: 'Deepak Gaur', role: 'Managing Director' },
    { name: 'Vishal Gupta', role: 'Managing Director' },
    { name: 'Anant Vidur Puri', role: 'Partner' },
    { name: 'Harsh Bothra', role: 'Principal' },
  ];

  const mediaCoverage = [
    {
      title: 'The Tribes of Travellers raises $12M to digitize India\'s travel bookings',
      date: 'Apr 2018',
      source: 'Economic Times',
    },
    {
      title: 'Holiday planning marketplace The Tribes of Travellers raises ₹12 Mn',
      date: 'Apr 2018',
      source: 'Business Standard',
    },
    {
      title: 'The Tribes of Travellers sets new benchmarks; records GMV over Rs. 350 Crore',
      date: 'June 2017',
      source: 'Inc42',
    },
    {
      title: 'Raised $10 Million in a Series B Round of funding led by RB Investments',
      date: 'Feb 2017',
      source: 'YourStory',
    },
    {
      title: 'Series B funding from RB Investments, SAIF Partners and BVP',
      date: 'Feb 2017',
      source: 'TechCrunch',
    },
    {
      title: 'A unique marketplace model leading to a profitable business',
      date: 'Aug 2016',
      source: 'Forbes India',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Banner */}
      <div className="relative h-80">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200"
          alt="Team"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Building the Holiday Eco-system for Happy Travelers
            </h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-14 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8 py-4">
            <Link to="/aboutus" className="text-teal font-bold border-b-2 border-teal pb-1">
              About Us
            </Link>
            <Link to="/team" className="text-gray-600 hover:text-teal transition-colors font-medium">
              Our Team
            </Link>
            <Link to="/career" className="bg-coral hover:bg-coral-dark text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm">
              We Are Hiring
            </Link>
          </div>
        </div>
      </div>

      {/* About Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm p-10 border border-gray-100">
          <p className="text-gray-700 text-lg leading-relaxed mb-8">
            Founded in 2011, <span className="font-bold text-tt-dark">The Tribes of Travellers</span> is India's leading online holiday marketplace bringing both the travelers, and trusted & expert travel agents on a common platform. With the recent Series C funding of $12 Million from Nandan Nilekani and Sanjeev Aggarwal backed Fundamentum in early 2018, it is on its way of encompassing all the components of holiday eco-system through its highly innovative and technology-focused product.
          </p>
          <p className="text-gray-600 leading-relaxed italic border-l-4 border-teal pl-6">
            Besides, having already raised close to a cumulative funding of $20 Million from SAIF Partners, Bessemer Venture Partners and RB Investments put together, the company has already achieved operating profitability, and on track to become EBITDA profitable by next year.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="py-16 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="w-20 h-20 mx-auto bg-teal/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-teal/20 transition-colors">
                  <stat.icon className="w-10 h-10 text-teal" />
                </div>
                <p className="text-3xl font-bold text-tt-dark mb-2">{stat.value}</p>
                <p className="text-gray-500 font-medium text-sm tracking-wide uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Investors */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-tt-dark mb-12 text-center">Our Investors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {investors.map((investor) => (
              <div
                key={investor.name}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                <div className="w-20 h-20 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-teal/5 transition-colors">
                  <span className="text-2xl font-bold text-teal">
                    {investor.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="font-bold text-tt-dark mb-2 text-lg">{investor.name}</h3>
                <p className="text-sm text-gray-500 font-medium">{investor.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Media Coverage */}
      <div className="py-20 bg-gray-100 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-tt-dark mb-12 text-center max-w-3xl mx-auto">
            Our Growth Story covered by all leading media publications
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mediaCoverage.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-all border border-gray-100"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-teal uppercase tracking-widest bg-teal/10 px-3 py-1 rounded-full">{item.date}</span>
                  <span className="text-xs font-medium text-gray-400">{item.source}</span>
                </div>
                <h3 className="font-bold text-tt-dark text-lg leading-tight">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-teal text-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Join Our Growing Team
          </h2>
          <p className="text-teal-50 mb-10 text-xl max-w-2xl mx-auto leading-relaxed">
            Be a part of India's fastest growing holiday marketplace and redefine travel experiences
          </p>
          <Link
            to="/career"
            className="inline-block bg-white text-teal font-bold px-10 py-4 rounded-lg hover:bg-gray-50 transition-all shadow-md hover:shadow-lg text-lg hover:-translate-y-1"
          >
            View Open Positions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;