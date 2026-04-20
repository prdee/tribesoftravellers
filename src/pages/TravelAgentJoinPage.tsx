import { useState } from 'react';
import { api } from '../lib/api';
import { CheckCircle, Users, TrendingUp, Shield } from 'lucide-react';

const STEPS = ['Personal Info', 'Agency Details'];

export default function TravelAgentJoinPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', email: '', city: '',
    agencyName: '', experience: '', website: '',
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/leads', form);
      setSubmitted(true);
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-[#1A1A1A] mb-2">Application Submitted!</h2>
          <p className="text-gray-600">Our team will review your application and contact you within 24 hours on <strong>{form.phone}</strong>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#FF6B00] to-[#FF9933] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-heading mb-4">Join Our Travel Agent Network</h1>
          <p className="text-xl text-white/90 mb-8">Partner with 650+ agents. Earn more. Grow your business.</p>
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[
              { icon: Users, label: '650+ Active Agents' },
              { icon: TrendingUp, label: '10 Lac+ Travelers Served' },
              { icon: Shield, label: 'Verified & Trusted Platform' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="text-center">
                <Icon className="w-8 h-8 mx-auto mb-2 text-white/80" />
                <p className="text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${i <= step ? 'bg-[#FF6B00] text-white' : 'bg-gray-200 text-gray-500'}`}>{i + 1}</div>
              <span className={`text-sm font-medium ${i === step ? 'text-[#FF6B00]' : 'text-gray-500'}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`w-12 h-0.5 ${i < step ? 'bg-[#FF6B00]' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-heading text-[#1A1A1A] mb-6">Personal Information</h2>
              {[
                { key: 'name', label: 'Full Name', type: 'text', required: true },
                { key: 'phone', label: 'Phone Number', type: 'tel', required: true },
                { key: 'email', label: 'Email Address', type: 'email', required: false },
                { key: 'city', label: 'City', type: 'text', required: true },
              ].map(({ key, label, type, required }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
                  <input type={type} value={form[key as keyof typeof form]} onChange={e => set(key, e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]" />
                </div>
              ))}
              <button
                onClick={() => setStep(1)}
                disabled={!form.name || !form.phone || !form.city}
                className="w-full bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 mt-4"
              >
                Next →
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-heading text-[#1A1A1A] mb-6">Agency Details</h2>
              {[
                { key: 'agencyName', label: 'Agency / Company Name', type: 'text', required: true },
                { key: 'experience', label: 'Years of Experience', type: 'text', required: true },
                { key: 'website', label: 'Website (optional)', type: 'url', required: false },
              ].map(({ key, label, type, required }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
                  <input type={type} value={form[key as keyof typeof form]} onChange={e => set(key, e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]" />
                </div>
              ))}
              <div className="flex gap-3 mt-4">
                <button onClick={() => setStep(0)} className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition">← Back</button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !form.agencyName || !form.experience}
                  className="flex-1 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
