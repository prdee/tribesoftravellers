export default function TermsPage() {
  const sections = [
    { title: '1. Acceptance of Terms', content: 'By accessing and using The Tribes of Travellers platform ("Platform"), operated by Holiday Triangle Travel Pvt. Ltd., you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.' },
    { title: '2. Services', content: 'The Tribes of Travellers is an online marketplace that connects travelers with local travel agents. We facilitate bookings but do not directly provide travel services. All travel services are provided by independent travel agents listed on our platform.' },
    { title: '3. User Accounts', content: 'You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your account credentials. You must be at least 18 years old to create an account and make bookings.' },
    { title: '4. Bookings & Payments', content: 'All bookings are subject to availability and confirmation by the travel agent. Prices displayed are indicative and may change. Payment is processed securely through Razorpay. A booking is confirmed only upon receipt of full payment and written confirmation from the agent.' },
    { title: '5. Cancellation & Refund Policy', content: 'Cancellation policies vary by package and travel agent. Generally: cancellations made 30+ days before travel receive a 75% refund; 15-29 days receive 50%; 7-14 days receive 25%; less than 7 days receive no refund. Processing fees are non-refundable.' },
    { title: '6. Travel Agent Responsibilities', content: 'Travel agents listed on our platform are independent contractors. They are responsible for the accuracy of their listings, delivery of services, and compliance with applicable laws. The Tribes of Travellers is not liable for any acts or omissions of travel agents.' },
    { title: '7. Limitation of Liability', content: 'Holiday Triangle Travel Pvt. Ltd. acts solely as an intermediary. We are not liable for any loss, damage, injury, or disappointment suffered as a result of travel services provided by agents. Our maximum liability is limited to the booking amount paid through our platform.' },
    { title: '8. Privacy', content: 'Your use of the Platform is also governed by our Privacy Policy. We collect and process personal data as described therein. By using our services, you consent to such processing.' },
    { title: '9. Intellectual Property', content: 'All content on this Platform, including text, graphics, logos, and software, is the property of Holiday Triangle Travel Pvt. Ltd. and is protected by applicable intellectual property laws.' },
    { title: '10. Governing Law', content: 'These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in New Delhi, India.' },
    { title: '11. Contact Us', content: 'For any queries regarding these Terms, contact us at: legal@thetribesoftravellers.com or call +91 92814 49440.' },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <div className="bg-[#FF6B00] text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold font-heading">Terms & Conditions</h1>
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
