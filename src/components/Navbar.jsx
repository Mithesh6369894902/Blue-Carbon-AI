import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Layers, 
  Database, 
  Clock, 
  MapPin,
  UserCheck,
  Building2,
  Globe
} from 'lucide-react';
import { BLUE_CARBON_HOTSPOTS } from '../data/mockDatasets';

export default function Navbar({ 
  selectedSite, 
  setSelectedSite, 
  currentRole, 
  setCurrentRole,
  isLiveStreaming,
  setIsLiveStreaming,
  activeTab,
  setActiveTab
}) {
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('en-US', { hour12: false }) + ' IST');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        
        {/* Brand & Subtitle */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#030a16] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                BlueCarbon AI
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Blockchain-Backed Blue Carbon Registry & Real-Time MRV System
            </p>
          </div>
        </div>

        {/* Hotspot & Role Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Active Hotspot Selector */}
          <div className="flex items-center space-x-2 bg-slate-900/80 border border-slate-700/60 rounded-xl px-3 py-1.5">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <select
              value={selectedSite.id}
              onChange={(e) => {
                const found = BLUE_CARBON_HOTSPOTS.find(h => h.id === e.target.value);
                if (found) setSelectedSite(found);
              }}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer pr-2"
            >
              {BLUE_CARBON_HOTSPOTS.map((site) => (
                <option key={site.id} value={site.id} className="bg-slate-900 text-slate-200">
                  {site.name} ({site.state})
                </option>
              ))}
            </select>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-700/60 text-xs">
            <button
              onClick={() => {
                setCurrentRole('DEVELOPER');
              }}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                currentRole === 'DEVELOPER'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Project NGO</span>
            </button>
            <button
              onClick={() => {
                setCurrentRole('AUDITOR');
                setActiveTab('auditor-portal');
              }}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                currentRole === 'AUDITOR'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>MoES Auditor</span>
            </button>
            <button
              onClick={() => {
                setCurrentRole('PUBLIC');
                setActiveTab('blockchain');
              }}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                currentRole === 'PUBLIC'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Public Registry</span>
            </button>
          </div>

          {/* Live Telemetry Ticker Toggle */}
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isLiveStreaming
                ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            <Activity className={`w-3.5 h-3.5 ${isLiveStreaming ? 'animate-spin-slow text-emerald-400' : ''}`} />
            <span>{isLiveStreaming ? 'IoT STREAMING' : 'STREAM PAUSED'}</span>
          </button>

          {/* Download Raw Datasets Button */}
          <div className="relative group">
            <button
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-emerald-500/50 transition-all"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Raw Datasets</span>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-2xl w-56 z-50 space-y-1">
              <a
                href="/datasets/indian_blue_carbon_master.json"
                download="indian_blue_carbon_master.json"
                className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-slate-800 text-xs text-slate-200"
              >
                <span>Master GeoJSON Data</span>
                <span className="text-[10px] text-emerald-400 font-mono">JSON</span>
              </a>
              <a
                href="/datasets/marine_iot_telemetry_logs.csv"
                download="marine_iot_telemetry_logs.csv"
                className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-slate-800 text-xs text-slate-200"
              >
                <span>IoT Telemetry Logs</span>
                <span className="text-[10px] text-cyan-400 font-mono">CSV</span>
              </a>
              <a
                href="/datasets/ipcc_tier3_allometric_factors.csv"
                download="ipcc_tier3_allometric_factors.csv"
                className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-slate-800 text-xs text-slate-200"
              >
                <span>IPCC Biomass Factors</span>
                <span className="text-[10px] text-purple-400 font-mono">CSV</span>
              </a>
            </div>
          </div>

          {/* System Clock */}
          <div className="hidden xl:flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-[11px] text-slate-300">{timeString}</span>
          </div>

        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex items-center space-x-1 mt-3 pt-2 border-t border-slate-800/60 overflow-x-auto scrollbar-none text-xs font-semibold">
        <button
          onClick={() => setActiveTab('digital-twin')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'digital-twin'
              ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>GIS Digital Twin</span>
        </button>

        <button
          onClick={() => setActiveTab('iot-telemetry')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'iot-telemetry'
              ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>IoT Ocean Buoy Stream</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-engine')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'ai-engine'
              ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>AI Carbon & Reversal Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'simulator'
              ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-orange-300 border border-orange-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
          <span>Disaster & Stress Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('blockchain')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'blockchain'
              ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Web3 Evidence Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab('auditor-portal')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'auditor-portal'
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>MoES Verifier Workflow</span>
        </button>
      </nav>
    </header>
  );
}
