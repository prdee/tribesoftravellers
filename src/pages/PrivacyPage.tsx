export default function PrivacyPage() {
  const sections = [
    { title: '1. Information We Collect', content: 'We collect information you provide directly: name, email, phone number, and payment details when you register or make a booking. We also collect usage data, device information, and location data to improve our services.' },
    { title: '2. How We Use Your Information', content: 'We use your information to: process bookings and payments; communicate with you about your trips; send promotional offers (with your consent); improve our platform; comply with legal obligations; and prevent fraud.' },
    { title: '3. Information Sharing', content: 'We share your information with: travel agents to fulfill your bookings; payment processors (Razorpay) to process payments; analytics providers to improve our services. We do not sell your personal data to third parties.' },
    { title: '4. Data Security', content: 'We implement industry-standard security measures including SSL encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.' },
    { title: '5. Cookies', content: 'We use cookies to enhance your experience, remember your preferences, and analyze site traffic. You can control cookie settings through your browser, though disabling cookies may affect site functionality.' },
    { title: '6. Your Rights', content: 'You have the right to: access your personal data; correct inaccurate data; request deletion of your data; opt out of marketing communications; and lodge a complaint with a supervisory authority.' },
    { title: '7. Data Retention', content: 'We retain your data for as long as your account is active or as needed to provide services. Booking records are retained for 7 years for legal and tax purposes.' },
    { title: '8. Contact', content: 'For privacy-related queries, contact our Data Protection Officer at: privacy@thetribesoftravellers.com or +91 93817 99440.' },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <div className="bg-[#FF6B00] text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold font-heading">Privacy Policy</h1>
          <p className="text-white/80 mt-2">Last updated: April 2026</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
          {sections.map(({ title, content }) => (
            <div key={title}>
              <h2 className="text-lg font-bold font-heading text-[#1A1A1A] mb-3">{title}</h2>
              <p className="text-gray-600 leading-relaxed">{content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
