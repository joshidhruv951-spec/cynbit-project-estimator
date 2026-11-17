import React, { useState, useEffect } from 'react';

export default function AdminDashboard({ apiBase }) {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ total_leads: 0, total_pipeline_value: 0, new_leads: 0 });
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/leads/`);
      const data = await res.json();
      setLeads(data.leads || []);
      setStats(data.stats || {});
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [apiBase]);

  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`${apiBase}/leads/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchLeads();
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Cynbit Sales & Lead Pipeline</h1>
          <p className="text-sm text-slate-400">
            Internal CRM view showing real-time project scopes submitted via the website estimator.
          </p>
        </div>
        <button
          onClick={fetchLeads}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-white transition"
        >
          Refresh Data
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-400 uppercase">Total Scoped Leads</div>
          <div className="text-3xl font-bold text-white mt-1">{stats.total_leads}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-400 uppercase">Est. Pipeline Value</div>
          <div className="text-3xl font-bold text-emerald-400 mt-1">
            ${(stats.total_pipeline_value || 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-400 uppercase">Action Required (New)</div>
          <div className="text-3xl font-bold text-indigo-400 mt-1">{stats.new_leads}</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading pipeline...</div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No leads submitted yet. Switch to "Client Estimator" and submit a test project!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase">
                <tr>
                  <th className="px-5 py-3.5">Client</th>
                  <th className="px-5 py-3.5">Solution & Features</th>
                  <th className="px-5 py-3.5">Estimate</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/40">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{lead.client_name}</div>
                      <div className="text-xs text-slate-400">{lead.client_email}</div>
                      {lead.company_name && (
                        <div className="text-xs text-indigo-400 mt-0.5">{lead.company_name}</div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-200 capitalize">
                        {lead.service_type.replace('_', ' ')} ({lead.estimated_weeks}w)
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {lead.selected_features.map((f) => (
                          <span
                            key={f}
                            className="px-2 py-0.5 rounded bg-slate-800 text-xs text-slate-300"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-emerald-400">
                      ${lead.estimated_min_cost.toLocaleString()} – $
                      {lead.estimated_max_cost.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="NEW">New Lead</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="PROPOSAL_SENT">Proposal Sent</option>
                        <option value="CLOSED">Closed Won</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
