import { useState, useEffect } from 'react';
import { X, Send, ChevronRight } from 'lucide-react';

interface LeadPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeadPopup = ({ isOpen, onClose }: LeadPopupProps) => {
  const [step, setStep] = useState(1);
  const [tripType, setTripType] = useState('');
  const [destination, setDestination] = useState('');
  const [phone, setPhone] = useState('');

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setTripType('');
      setDestination('');
      setPhone('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1 && tripType) setStep(2);
    else if (step === 2 && destination) setStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    const message = `Hi, I'm planning a ${tripType} to ${destination}. My number is ${phone}.`;
    window.open(`https://wa.me/18001235555?text=${encodeURIComponent(message)}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-teal flex items-center justify-between px-6 py-4 text-white">
          <h2 className="font-bold text-lg flex items-center">
            <span className="bg-white/20 p-1.5 rounded mr-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </span>
            Trip Planner
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {/* Chat bubbles */}
          <div className="space-y-4 mb-6">
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-4 text-gray-700 text-sm w-11/12 shadow-sm">
              <p className="font-medium mb-1">Hey! I'm The Tribes of Travellers' Trip Planner...</p>
              <p>Are you looking for help in planning your trip?</p>
            </div>
          </div>

          {/* Steps */}
          {step === 1 && (
            <div className="space-y-3 animate-in slide-in-from-right-4 duration-300">
              {['Yes! A romantic trip', 'Yes! For a family trip', 'Yes! A honeymoon trip', 'Yes! For a trip with my friends', 'For a group trip', 'For a solo trip'].map((type) => (
                <label 
                  key={type}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                    tripType === type ? 'border-teal bg-teal/5 ring-1 ring-teal/20' : 'border-gray-200 hover:border-teal/50 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 shrink-0 ${
                    tripType === type ? 'border-teal bg-teal' : 'border-gray-300'
                  }`}>
                    {tripType === type && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <span className="text-gray-700 text-sm font-medium">{type}</span>
                  <input type="radio" name="tripType" value={type} checked={tripType === type} onChange={() => setTripType(type)} className="hidden" />
                </label>
              ))}
              <button 
                onClick={handleNext}
                disabled={!tripType}
                className="w-full mt-4 bg-coral hover:bg-coral-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg flex items-center justify-center transition-colors"
              >
                Next <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <div className="bg-teal/10 rounded-2xl rounded-tr-sm p-4 text-teal-dark text-sm w-11/12 ml-auto shadow-sm">
                {tripType}
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-4 text-gray-700 text-sm w-11/12 shadow-sm">
                <p>Awesome! Where do you want to go?</p>
              </div>
              <div className="mt-4">
                <input 
                  type="text" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Goa, Maldives, Paris..."
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-all"
                  autoFocus
                />
                <button 
                  onClick={handleNext}
                  disabled={!destination.trim()}
                  className="w-full mt-4 bg-coral hover:bg-coral-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg flex items-center justify-center transition-colors"
                >
                  Next <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <div className="bg-teal/10 rounded-2xl rounded-tr-sm p-4 text-teal-dark text-sm w-11/12 ml-auto shadow-sm">
                {destination}
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-4 text-gray-700 text-sm w-11/12 shadow-sm">
                <p>Great choice! Please share your WhatsApp number so our experts can send you the best quotes.</p>
              </div>
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    +91
                  </span>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter mobile number"
                    className="w-full border border-gray-300 rounded-r-lg p-3 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-all"
                    required
                    pattern="[0-9]{10}"
                    title="10 digit mobile number"
                    autoFocus
                  />
                </div>
                <button 
                  type="submit"
                  disabled={phone.length < 10}
                  className="w-full mt-4 bg-teal hover:bg-teal-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg flex items-center justify-center transition-colors shadow-md"
                >
                  Get Free Quotes <Send className="w-4 h-4 ml-2" />
                </button>
                <p className="text-xs text-center text-gray-400 mt-3 flex items-center justify-center">
                  <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  100% Safe & Secure
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadPopup;