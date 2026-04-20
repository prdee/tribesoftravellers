import { useState } from 'react';
import { Globe, Bell, Shield, Database } from 'lucide-react';

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'The Tribes of Travellers',
    supportEmail: 'support@thetribesoftravellers.com',
    supportPhone: '+91 98765 43210',
    whatsappNumber: '+919876543210',
    razorpayMode: 'test',
    leadAutoAssign: false,
    emailNotifications: true,
    maintenanceMode: false,
  });

  const handleSave = () => {
    // In production, this would call an API endpoint
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold font-heading text-[#1A1A1A] mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Site Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-[#FF6B00]" />
            <h2 className="font-semibold text-[#1A1A1A]">Site Settings</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'siteName', label: 'Site Name' },
              { key: 'supportEmail', label: 'Support Email' },
              { key: 'supportPhone', label: 'Support Phone' },
              { key: 'whatsappNumber', label: 'WhatsApp Number' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input value={(settings as Record<string, string | boolean>)[key] as string}
                  onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]" />
              </div>
            ))}
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-[#FF6B00]" />
            <h2 className="font-semibold text-[#1A1A1A]">Payment Settings</h2>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Razorpay Mode</label>
            <select value={settings.razorpayMode} onChange={e => setSettings(s => ({ ...s, razorpayMode: e.target.value }))}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]">
              <option value="test">Test Mode</option>
              <option value="live">Live Mode</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">Switch to Live Mode only when ready for production payments.</p>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-[#FF6B00]" />
            <h2 className="font-semibold text-[#1A1A1A]">Notifications & Automation</h2>
          </div>
          <div className="space-y-3">
            {[
              { key: 'emailNotifications', label: 'Email Notifications', desc: 'Send email alerts for new bookings and leads' },
              { key: 'leadAutoAssign', label: 'Auto-assign Leads', desc: 'Automatically assign new leads to available agents' },
              { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Show maintenance page to public users' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={(settings as Record<string, string | boolean>)[key] as boolean}
                    onChange={e => setSettings(s => ({ ...s, [key]: e.target.checked }))} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B00]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Database Info */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-[#FF6B00]" />
            <h2 className="font-semibold text-[#1A1A1A]">System Info</h2>
          </div>
          <div className="text-sm text-gray-600 space-y-2">
            <p>Backend: Node.js + Express + MongoDB</p>
            <p>Auth: Firebase (Google + Phone OTP)</p>
            <p>Payments: Razorpay</p>
            <p>Frontend: React + Vite + Tailwind CSS</p>
            <p>Deployment: AWS S3 + CloudFront (Frontend) + Lambda (Backend)</p>
          </div>
        </div>

        <button onClick={handleSave}
          className="bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold px-8 py-3 rounded-lg transition">
          {saved ? '✓ Settings Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
