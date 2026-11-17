import React, { useState } from 'react';
import Estimator from './components/Estimator';
import AdminDashboard from './components/AdminDashboard';

const API_BASE = 'https://cynbit-project-estimator.onrender.com/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('estimator');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-lg">
              C
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-white">Cynbit</span>
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Smart Scope & Lead Engine
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('estimator')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                activeTab === 'estimator'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Client Estimator
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                activeTab === 'admin'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Admin Leads Portal (Demo)
            </button>
          </div>
        </div>
      </nav>

      <div className="bg-indigo-950/50 border-b border-indigo-500/20 py-2.5 px-4 text-center text-xs text-indigo-200">
        <strong>Website Improvement Prototype:</strong> Replaces static contact forms with an interactive scoping engine & real-time lead pipeline to increase visitor-to-client conversion.
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'estimator' ? (
          <Estimator apiBase={API_BASE} />
        ) : (
          <AdminDashboard apiBase={API_BASE} />
        )}
      </main>
    </div>
  );
}