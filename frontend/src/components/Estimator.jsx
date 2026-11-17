import React, { useState, useEffect } from 'react';

const SERVICES = [
  { id: 'web_app', label: 'Full-Stack Web App', desc: 'Scalable SaaS, portals & web platforms' },
  { id: 'mobile_app', label: 'Mobile Application', desc: 'iOS & Android cross-platform apps' },
  { id: 'ai_integration', label: 'AI & Automation', desc: 'LLM agents, workflows & smart analytics' },
  { id: 'ui_ux_redesign', label: 'UI/UX Modernization', desc: 'High-converting design systems' },
];

const FEATURES = [
  { id: 'auth', label: 'Role-Based Auth & SSO' },
  { id: 'payments', label: 'Payment & Subscription Billing' },
  { id: 'admin_dashboard', label: 'Custom Admin & CRM Panel' },
  { id: 'ai_chatbot', label: 'AI Assistant / RAG Search' },
  { id: 'analytics', label: 'Real-Time Analytics Charts' },
  { id: 'api_integrations', label: 'Third-Party API Integrations' },
];

export default function Estimator({ apiBase }) {
  const [serviceType, setServiceType] = useState('web_app');
  const [selectedFeatures, setSelectedFeatures] = useState(['auth', 'admin_dashboard']);
  const [urgency, setUrgency] = useState('standard');
  const [estimate, setEstimate] = useState(null);
  const [loadingCalc, setLoadingCalc] = useState(false);

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedProposal, setSubmittedProposal] = useState(null);

  useEffect(() => {
    const fetchEstimate = async () => {
      setLoadingCalc(true);
      try {
        const res = await fetch(`${apiBase}/estimate/calculate/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_type: serviceType,
            selected_features: selectedFeatures,
            urgency,
          }),
        });
        const data = await res.json();
        setEstimate(data);
      } catch (err) {
        console.error('Calculation error:', err);
      } finally {
        setLoadingCalc(false);
      }
    };
    fetchEstimate();
  }, [serviceType, selectedFeatures, urgency, apiBase]);

  const toggleFeature = (id) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!estimate) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/leads/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: clientName,
          client_email: clientEmail,
          company_name: companyName,
          service_type: serviceType,
          selected_features: selectedFeatures,
          urgency,
          estimated_min_cost: estimate.estimated_min_cost,
          estimated_max_cost: estimate.estimated_max_cost,
          estimated_weeks: estimate.estimated_weeks,
          notes,
        }),
      });
      if (res.ok) {
        const saved = await res.json();
        setSubmittedProposal(saved);
      }
    } catch (err) {
      alert('Failed to submit proposal. Check backend connection.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedProposal) {
    return (
      <div className="max-w-2xl mx-auto bg-slate-900 border border-emerald-500/40 rounded-2xl p-8 shadow-xl">
        <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4">
          Proposal Generated & Saved to Cynbit CRM
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Thank you, {submittedProposal.client_name}!
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          Your project scope has been logged. Our engineering lead will reach out to{' '}
          <span className="text-white font-medium">{submittedProposal.client_email}</span> within 24 hours.
        </p>

        <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3 text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-slate-400">Reference ID:</span>
            <span className="font-mono text-indigo-400">#CYN-{submittedProposal.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Selected Solution:</span>
            <span className="text-white font-medium capitalize">
              {submittedProposal.service_type.replace('_', ' ')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Estimated Investment:</span>
            <span className="text-emerald-400 font-bold">
              ${submittedProposal.estimated_min_cost.toLocaleString()} – $
              {submittedProposal.estimated_max_cost.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Estimated Delivery:</span>
            <span className="text-white font-medium">{submittedProposal.estimated_weeks} Weeks</span>
          </div>
        </div>

        <button
          onClick={() => {
            setSubmittedProposal(null);
            setClientName('');
            setClientEmail('');
            setNotes('');
          }}
          className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition"
        >
          Configure Another Project
        </button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Scope Your Project in 60 Seconds
          </h1>
          <p className="text-slate-400">
            Select your platform, required modules, and timeline to get an instant engineering estimate from Cynbit.
          </p>
        </div>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm uppercase tracking-wider text-indigo-400 font-semibold mb-4">
            1. Choose Core Solution
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {SERVICES.map((srv) => (
              <button
                key={srv.id}
                type="button"
                onClick={() => setServiceType(srv.id)}
                className={`text-left p-4 rounded-xl border transition ${
                  serviceType === srv.id
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-white">{srv.label}</div>
                <div className="text-xs text-slate-400 mt-1">{srv.desc}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm uppercase tracking-wider text-indigo-400 font-semibold mb-4">
            2. Select Required Modules
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {FEATURES.map((feat) => {
              const active = selectedFeatures.includes(feat.id);
              return (
                <button
                  key={feat.id}
                  type="button"
                  onClick={() => toggleFeature(feat.id)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition ${
                    active
                      ? 'border-indigo-500 bg-indigo-500/10 text-white'
                      : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-sm font-medium">{feat.label}</span>
                  <span
                    className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                      active ? 'bg-indigo-600 text-white' : 'border border-slate-600'
                    }`}
                  >
                    {active ? '✓' : ''}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm uppercase tracking-wider text-indigo-400 font-semibold mb-4">
            3. Delivery Speed
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'relaxed', label: 'Flexible (-10%)', sub: 'Standard pace' },
              { id: 'standard', label: 'Standard', sub: 'Recommended' },
              { id: 'rush', label: 'Accelerated (+30%)', sub: 'Priority sprint' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setUrgency(item.id)}
                className={`p-3.5 rounded-xl border text-center transition ${
                  urgency === item.id
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                }`}
              >
                <div className="text-sm font-semibold text-white">{item.label}</div>
                <div className="text-xs text-slate-400 mt-0.5">{item.sub}</div>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-24 shadow-xl">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Live Engineering Estimate
          </div>

          {loadingCalc || !estimate ? (
            <div className="py-8 text-slate-400 text-sm animate-pulse">Calculating scope...</div>
          ) : (
            <div className="my-4 pb-4 border-b border-slate-800">
              <div className="text-3xl font-extrabold text-white">
                ${estimate.estimated_min_cost.toLocaleString()} – $
                {estimate.estimated_max_cost.toLocaleString()}
              </div>
              <div className="text-sm text-indigo-400 font-medium mt-1">
                Estimated Timeline: ~{estimate.estimated_weeks} Weeks
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Dhruv Joshi"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Work Email *</label>
              <input
                type="email"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Company / Startup</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Corp"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Project Brief (Optional)</label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific integrations or goals..."
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 transition"
            >
              {submitting ? 'Generating Proposal...' : 'Lock Estimate & Request Proposal'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
