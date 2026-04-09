import { useState } from 'react';
import { MessageCircle, X, Send, Phone } from 'lucide-react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const tripOptions = [
    'Yes! A romantic trip',
    'Yes! For a family trip',
    'Yes! A honeymoon trip',
    'Yes! For a trip with my friends',
    'For a group trip',
    'For a solo trip',
  ];

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  const handleSend = () => {
    if (message.trim() || selectedOption) {
      // In a real app, this would send the message
      alert(`Thank you! We'll help you plan ${selectedOption || 'your trip'}.`);
      setMessage('');
      setSelectedOption(null);
      setIsOpen(false);
    }
  };

  return (
    <div className="chat-widget">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-teal hover:bg-teal-dark rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="animate-slide-up bg-white rounded-lg shadow-2xl w-80 overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-teal p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold">Trip Planner</h4>
                <p className="text-white/80 text-xs">Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Content */}
          <div className="p-4 bg-gray-50 max-h-96 overflow-y-auto">
            {/* Bot Message */}
            <div className="flex items-start mb-4">
              <div className="w-8 h-8 bg-teal rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                <span className="text-white text-xs font-bold">H</span>
              </div>
              <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[80%]">
                <p className="text-sm text-gray-700">
                  Hey! I'm House of Travelling's Trip Planner...
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  Are you looking for help in planning your trip?
                </p>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2 mb-4">
              {tripOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className={`w-full text-left px-4 py-2 rounded-full text-sm border transition-all ${
                    selectedOption === option
                      ? 'bg-teal text-white border-teal'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-teal hover:text-teal'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* User Input */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Select or type your destination..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-teal hover:bg-teal-dark text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 p-3 text-center border-t border-gray-200">
            <a
              href="tel:1800-123-5555"
              className="inline-flex items-center text-teal hover:text-teal-dark text-sm font-medium"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call us: 1800-123-5555
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
