import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', destination: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      content: '1800-123-5555',
      subtext: 'Toll-free number',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'customercare@thetribesoftravellers.com',
      subtext: 'We reply within 24 hours',
    },
    {
      icon: MapPin,
      title: 'Office',
      content: 'Plot No - 52, 3rd Floor, Gurugram - 122001, Haryana',
      subtext: 'Corporate Headquarters',
    },
    {
      icon: Clock,
      title: 'Working Hours',
      content: 'Monday - Saturday: 9:00 AM - 8:00 PM',
      subtext: 'Sunday: Closed',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Banner */}
      <div className="relative h-64">
        <img
          src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200"
          alt="Contact"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-gray-100">We'd love to hear from you</p>
          </div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info) => (
            <div
              key={info.title}
              className="bg-white rounded-xl shadow-md p-6 text-center hover:-translate-y-2 transition-transform duration-300 border border-gray-100"
            >
              <div className="w-14 h-14 mx-auto bg-teal/10 rounded-full flex items-center justify-center mb-4">
                <info.icon className="w-7 h-7 text-teal" />
              </div>
              <h3 className="font-bold text-tt-dark mb-2">{info.title}</h3>
              <p className="text-gray-700 text-sm">{info.content}</p>
              <p className="text-gray-500 text-xs mt-1">{info.subtext}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-tt-dark mb-6">
              Send us a Message
            </h2>
            
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 mx-auto text-teal mb-4" />
                <h3 className="text-xl font-bold text-tt-dark mb-2">Thank You!</h3>
                <p className="text-gray-600">We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal transition-all"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal transition-all"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination of Interest
                  </label>
                  <select
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal appearance-none transition-all"
                  >
                    <option value="">Select a destination</option>
                    <option value="kerala">Kerala</option>
                    <option value="goa">Goa</option>
                    <option value="maldives">Maldives</option>
                    <option value="dubai">Dubai</option>
                    <option value="thailand">Thailand</option>
                    <option value="himachal">Himachal</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal resize-none transition-all"
                    placeholder="Tell us about your travel plans..."
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-teal hover:bg-teal-dark text-white py-4 rounded-lg font-bold text-lg shadow-md transition-all"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            )}
          </div>

          {/* Map & Additional Info */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="h-80 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto text-teal mb-2 animate-bounce" />
                  <p className="text-gray-800 font-bold">Interactive Map</p>
                  <p className="text-sm text-gray-500">Gurugram, Haryana, India</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-tt-dark mb-4 text-xl">Why Choose Us?</h3>
              <ul className="space-y-4">
                {[
                  '650+ Verified Travel Agents',
                  'Best Price Guaranteed',
                  '24/7 Customer Support',
                  'Customized Packages',
                  'Hassle-free Booking',
                  'Secure Payments',
                ].map((item) => (
                  <li key={item} className="flex items-center text-gray-700">
                    <div className="bg-teal/10 p-1 rounded-full mr-3">
                      <CheckCircle className="w-4 h-4 text-teal" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-teal text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            Need Immediate Assistance?
          </h2>
          <p className="text-teal-50 mb-8 text-lg">
            Our travel experts are just a phone call away
          </p>
          <a
            href="tel:1800-123-5555"
            className="inline-flex items-center bg-white text-teal font-bold px-8 py-4 rounded-lg hover:bg-gray-50 transition-all shadow-md hover:-translate-y-1"
          >
            <Phone className="w-5 h-5 mr-2" />
            Call 1800-123-5555
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;