import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Clock, Percent, Gift, ArrowRight, Copy, Check } from 'lucide-react';

const OffersPage = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const offers = [
    {
      id: '1',
      title: 'Flat 20% Off on Honeymoon Packages',
      description: 'Book your dream honeymoon and get flat 20% off on all honeymoon packages to Maldives, Bali, and more.',
      code: 'HONEY20',
      discount: '20%',
      validUntil: '2026-12-31',
      image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600',
      category: 'Honeymoon',
    },
    {
      id: '2',
      title: 'Early Bird Offer - Save upto ₹5000',
      description: 'Book your holiday 60 days in advance and save upto ₹5000 on your package.',
      code: 'EARLYBIRD',
      discount: '₹5000',
      validUntil: '2026-06-30',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600',
      category: 'All Packages',
    },
    {
      id: '3',
      title: 'Family Package Deal - Kids Stay Free',
      description: 'Book a family package and kids below 12 years stay absolutely free.',
      code: 'FAMILYFUN',
      discount: 'FREE',
      validUntil: '2026-08-31',
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600',
      category: 'Family',
    },
    {
      id: '4',
      title: 'Weekend Getaway - 15% Off',
      description: 'Plan a quick weekend escape with 15% off on all 2-3 day packages.',
      code: 'WEEKEND15',
      discount: '15%',
      validUntil: '2026-12-31',
      image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=600',
      category: 'Weekend',
    },
    {
      id: '5',
      title: 'International Packages - ₹10,000 Off',
      description: 'Get ₹10,000 off on all international packages above ₹50,000.',
      code: 'INTL10K',
      discount: '₹10,000',
      validUntil: '2026-09-30',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600',
      category: 'International',
    },
    {
      id: '6',
      title: 'First Booking - Flat ₹2000 Off',
      description: 'New to The Tribes of Travellers? Get ₹2000 off on your first booking.',
      code: 'FIRST2000',
      discount: '₹2000',
      validUntil: '2026-12-31',
      image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600',
      category: 'New Users',
    },
  ];

  const bankOffers = [
    {
      bank: 'HDFC Bank',
      offer: '10% Instant Discount',
      description: 'Get 10% instant discount upto ₹3000 on HDFC Bank Credit Cards',
      code: 'HDFC10',
    },
    {
      bank: 'ICICI Bank',
      offer: '15% Cashback',
      description: 'Get 15% cashback upto ₹5000 on ICICI Bank Credit & Debit Cards',
      code: 'ICICI15',
    },
    {
      bank: 'SBI Card',
      offer: 'Flat ₹2500 Off',
      description: 'Get flat ₹2500 off on transactions above ₹25,000 with SBI Cards',
      code: 'SBI2500',
    },
  ];

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Banner */}
      <div className="relative h-80">
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200"
          alt="Offers"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Exclusive Travel Offers
            </h1>
            <p className="text-lg mb-6 text-gray-100">
              Save big on your next holiday with our amazing deals
            </p>
            <div className="flex items-center justify-center space-x-4 bg-white text-tt-dark px-6 py-3 rounded-full shadow-lg">
              <Gift className="w-6 h-6 text-coral" />
              <span className="text-xl font-bold">Upto 50% Off</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Offers */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-tt-dark mb-8 flex items-center">
          <Tag className="w-6 h-6 mr-3 text-teal" />
          Current Offers & Deals
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-3 left-3 bg-coral text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                  {offer.discount} OFF
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-xs font-bold text-tt-dark shadow-sm uppercase tracking-wider">
                  {offer.category}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-lg text-tt-dark mb-2">{offer.title}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">{offer.description}</p>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center text-sm text-gray-500 font-medium">
                    <Clock className="w-4 h-4 mr-1 text-teal" />
                    Valid till {new Date(offer.validUntil).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg flex items-center">
                    <span className="font-mono font-bold text-teal tracking-wider">{offer.code}</span>
                    <button
                      onClick={() => copyCode(offer.code)}
                      className="ml-3 text-gray-400 hover:text-teal transition-colors"
                      title="Copy Code"
                    >
                      {copiedCode === offer.code ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <Link
                    to="/tour-packages"
                    className="bg-teal hover:bg-teal-dark text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bank Offers */}
      <div className="py-16 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-tt-dark mb-8 flex items-center">
            <Percent className="w-6 h-6 mr-3 text-teal" />
            Bank Offers
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {bankOffers.map((offer) => (
              <div
                key={offer.bank}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-tt-dark">{offer.bank}</h3>
                  <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-teal">
                      {offer.bank.split(' ')[0][0]}
                    </span>
                  </div>
                </div>
                
                <p className="text-coral font-bold text-xl mb-2">{offer.offer}</p>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">{offer.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded flex items-center">
                    <span className="font-mono text-sm font-bold text-gray-700 tracking-widest">{offer.code}</span>
                  </div>
                  <button
                    onClick={() => copyCode(offer.code)}
                    className="text-teal hover:text-teal-dark text-sm font-bold transition-colors"
                  >
                    {copiedCode === offer.code ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How to Use */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-tt-dark mb-12 text-center">
          How to Use Offers
        </h2>
        
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: 1, title: 'Choose Package', desc: 'Select your preferred holiday package' },
            { step: 2, title: 'Apply Code', desc: 'Enter the offer code at checkout' },
            { step: 3, title: 'Verify', desc: 'Discount will be applied automatically' },
            { step: 4, title: 'Enjoy', desc: 'Complete booking and enjoy your trip' },
          ].map((item) => (
            <div key={item.step} className="text-center group">
              <div className="w-20 h-20 mx-auto bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform">
                <span className="text-3xl font-bold text-teal">{item.step}</span>
              </div>
              <h3 className="font-bold text-tt-dark mb-2 text-lg">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-tt-dark mb-6">
              Terms & Conditions
            </h2>
            <ul className="space-y-4 text-gray-600 text-sm leading-relaxed">
              <li className="flex items-start">
                <span className="text-teal mr-3 text-lg leading-none">•</span>
                Offers are valid for a limited period only and subject to availability.
              </li>
              <li className="flex items-start">
                <span className="text-teal mr-3 text-lg leading-none">•</span>
                Only one offer code can be used per booking.
              </li>
              <li className="flex items-start">
                <span className="text-teal mr-3 text-lg leading-none">•</span>
                Offers cannot be combined with other ongoing promotions or discounts.
              </li>
              <li className="flex items-start">
                <span className="text-teal mr-3 text-lg leading-none">•</span>
                The Tribes of Travellers reserves the right to modify or withdraw offers without prior notice.
              </li>
              <li className="flex items-start">
                <span className="text-teal mr-3 text-lg leading-none">•</span>
                For bank offers, valid credit/debit cards must be used during payment checkout.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-teal text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Don't Miss Out on These Amazing Deals!
          </h2>
          <p className="text-teal-50 mb-10 text-xl max-w-2xl mx-auto">
            Book now and save big on your dream vacation
          </p>
          <Link
            to="/tour-packages"
            className="inline-flex items-center bg-white text-teal font-bold px-10 py-4 rounded-lg hover:bg-gray-50 transition-all shadow-md hover:-translate-y-1 text-lg"
          >
            Browse Packages <ArrowRight className="w-6 h-6 ml-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OffersPage;