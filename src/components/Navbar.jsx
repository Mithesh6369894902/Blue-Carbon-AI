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
    <header className="sticky top-0 z-50 glass-panel border-b border-red-950/40 px-4 lg:px-8 py-3">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        
        {/* Brand & Subtitle */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-600/30">
              <ShieldCheck className="w-6 h-6 text-white font-bold" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-[#030712] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-red-400 bg-clip-text text-transparent">
                BlueCarbon AI
              </h1>
            </div>
            <p className="text-xs text-zinc-400 font-medium">
              Blockchain-Backed Blue Carbon Registry & Real-Time MRV System
            </p>
          </div>
        </div>

        {/* Hotspot & Role Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Active Hotspot Selector */}
          <div className="flex items-center space-x-2 bg-zinc-950/90 border border-zinc-800 rounded-xl px-3 py-1.5 focus-within:border-red-500/60">
            <MapPin className="w-4 h-4 text-red-400" />
            <select
              value={selectedSite.id}
              onChange={(e) => {
                const found = BLUE_CARBON_HOTSPOTS.find(h => h.id === e.target.value);
                if (found) setSelectedSite(found);
              }}
              className="bg-transparent text-xs font-semibold text-zinc-200 focus:outline-none cursor-pointer pr-2"
            >
              {BLUE_CARBON_HOTSPOTS.map((site) => (
                <option key={site.id} value={site.id} className="bg-zinc-950 text-zinc-200">
                  {site.name} ({site.state})
                </option>
              ))}
            </select>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center bg-zinc-950/90 p-1 rounded-xl border border-zinc-800 text-xs">
            <button
              onClick={() => {
                setCurrentRole('DEVELOPER');
              }}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                currentRole === 'DEVELOPER'
                  ? 'bg-red-600/25 text-red-300 border border-red-500/50 shadow-sm shadow-red-950'
                  : 'text-zinc-400 hover:text-zinc-200'
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
                  ? 'bg-rose-600/25 text-rose-300 border border-rose-500/50 shadow-sm shadow-rose-950'
                  : 'text-zinc-400 hover:text-zinc-200'
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
                  ? 'bg-zinc-800 text-zinc-200 border border-zinc-700 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
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
                ? 'bg-red-500/15 border-red-500/50 text-red-300 shadow-lg shadow-red-600/15'
                : 'bg-zinc-950 border-zinc-800 text-zinc-500'
            }`}
          >
            <Activity className={`w-3.5 h-3.5 ${isLiveStreaming ? 'animate-spin-slow text-red-400' : ''}`} />
            <span>{isLiveStreaming ? 'IoT STREAMING' : 'STREAM PAUSED'}</span>
          </button>

          {/* Download Raw Datasets Button */}
          <div className="relative group">
            <button
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold bg-zinc-950 border-zinc-800 text-zinc-300 hover:text-white hover:border-red-500/50 transition-all"
            >
              <Database className="w-3.5 h-3.5 text-red-400" />
              <span>Raw Datasets</span>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-zinc-950 border border-zinc-800 rounded-xl p-2 shadow-2xl w-56 z-50 space-y-1">
              <a
                href="/datasets/indian_blue_carbon_master.json"
                download="indian_blue_carbon_master.json"
                className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-zinc-900 text-xs text-zinc-200"
              >
                <span>Master GeoJSON Data</span>
                <span className="text-[10px] text-red-400 font-mono">JSON</span>
              </a>
              <a
                href="/datasets/marine_iot_telemetry_logs.csv"
                download="marine_iot_telemetry_logs.csv"
                className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-zinc-900 text-xs text-zinc-200"
              >
                <span>IoT Telemetry Logs</span>
                <span className="text-[10px] text-rose-400 font-mono">CSV</span>
              </a>
              <a
                href="/datasets/ipcc_tier3_allometric_factors.csv"
                download="ipcc_tier3_allometric_factors.csv"
                className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-zinc-900 text-xs text-zinc-200"
              >
                <span>IPCC Biomass Factors</span>
                <span className="text-[10px] text-zinc-400 font-mono">CSV</span>
              </a>
            </div>
          </div>

          {/* System Clock */}
          <div className="hidden xl:flex items-center space-x-1.5 text-xs text-zinc-400 bg-zinc-950/80 px-3 py-1.5 rounded-xl border border-zinc-800">
            <Clock className="w-3.5 h-3.5 text-red-400" />
            <span className="font-mono text-[11px] text-zinc-300">{timeString}</span>
          </div>

        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex items-center space-x-1 mt-3 pt-2 border-t border-zinc-800/60 overflow-x-auto scrollbar-none text-xs font-semibold">
        <button
          onClick={() => setActiveTab('digital-twin')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'digital-twin'
              ? 'bg-gradient-to-r from-red-600/25 to-rose-600/25 text-red-300 border border-red-500/40 shadow-sm shadow-red-950'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>GIS Digital Twin</span>
        </button>

        <button
          onClick={() => setActiveTab('iot-telemetry')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'iot-telemetry'
              ? 'bg-gradient-to-r from-red-600/25 to-rose-600/25 text-red-300 border border-red-500/40 shadow-sm shadow-red-950'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>IoT Ocean Buoy Stream</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-engine')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'ai-engine'
              ? 'bg-gradient-to-r from-red-600/25 to-rose-600/25 text-red-300 border border-red-500/40 shadow-sm shadow-red-950'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>AI Carbon & Reversal Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'simulator'
              ? 'bg-gradient-to-r from-red-600/30 to-amber-600/30 text-red-300 border border-red-500/50 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
          <span>Disaster & Stress Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('blockchain')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'blockchain'
              ? 'bg-gradient-to-r from-red-600/25 to-rose-600/25 text-red-300 border border-red-500/40 shadow-sm shadow-red-950'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Web3 Evidence Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab('auditor-portal')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'auditor-portal'
              ? 'bg-gradient-to-r from-rose-600/25 to-red-600/25 text-rose-300 border border-rose-500/40 shadow-sm shadow-red-950'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>MoES Verifier Workflow</span>
        </button>
      </nav>
    </header>
  );
}
