import React, { useState } from 'react';
import Navbar from './components/Navbar';
import DigitalTwinMap from './components/DigitalTwinMap';
import TelemetryStream from './components/TelemetryStream';
import CarbonAiEngine from './components/CarbonAiEngine';
import DisasterSimulator from './components/DisasterSimulator';
import BlockchainLedger from './components/BlockchainLedger';
import AuditorWorkflow from './components/AuditorWorkflow';
import { BLUE_CARBON_HOTSPOTS } from './data/mockDatasets';

export default function App() {
  const [selectedSite, setSelectedSite] = useState(BLUE_CARBON_HOTSPOTS[0]);
  const [currentRole, setCurrentRole] = useState('DEVELOPER'); // DEVELOPER | AUDITOR | PUBLIC
  const [activeTab, setActiveTab] = useState('digital-twin'); // digital-twin | iot-telemetry | ai-engine | simulator | blockchain | auditor-portal
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [activeDisaster, setActiveDisaster] = useState(null);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      
      {/* Top Main Navbar */}
      <Navbar
        selectedSite={selectedSite}
        setSelectedSite={setSelectedSite}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        isLiveStreaming={isLiveStreaming}
        setIsLiveStreaming={setIsLiveStreaming}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 space-y-6">
        
        {/* Active Role Info Context Bar */}
        <div className="glass-panel p-3 px-5 rounded-xl border border-red-950/50 flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-zinc-400 font-semibold">Active Role Context:</span>
            {currentRole === 'DEVELOPER' && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/30 font-bold uppercase flex items-center gap-1.5 shadow-sm shadow-red-950">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                Project NGO Developer Mode (Full Admin & Simulation Access)
              </span>
            )}
            {currentRole === 'AUDITOR' && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 font-bold uppercase flex items-center gap-1.5 shadow-sm shadow-rose-950">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                MoES Verifier Auditor Mode (Government Verification & Signature Control)
              </span>
            )}
            {currentRole === 'PUBLIC' && (
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-red-500/25 font-bold uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
                Public Transparency Mode (Immutable Evidence Audit & Open Ledger)
              </span>
            )}
          </div>
          <div className="text-[11px] text-zinc-400 font-mono">
            Active Site: <strong className="text-red-400">{selectedSite.name}</strong> ({selectedSite.state})
          </div>
        </div>

        {/* Render Tab Content based on activeTab */}
        {activeTab === 'digital-twin' && (
          <DigitalTwinMap
            selectedSite={selectedSite}
            setSelectedSite={setSelectedSite}
            activeDisaster={activeDisaster}
            currentRole={currentRole}
          />
        )}

        {activeTab === 'iot-telemetry' && (
          <TelemetryStream
            selectedSite={selectedSite}
            isLiveStreaming={isLiveStreaming}
            activeDisaster={activeDisaster}
            currentRole={currentRole}
          />
        )}

        {activeTab === 'ai-engine' && (
          <CarbonAiEngine
            selectedSite={selectedSite}
            activeDisaster={activeDisaster}
            currentRole={currentRole}
          />
        )}

        {activeTab === 'simulator' && (
          <DisasterSimulator
            selectedSite={selectedSite}
            activeDisaster={activeDisaster}
            setActiveDisaster={setActiveDisaster}
            currentRole={currentRole}
          />
        )}

        {activeTab === 'blockchain' && (
          <BlockchainLedger
            selectedSite={selectedSite}
            activeDisaster={activeDisaster}
            currentRole={currentRole}
          />
        )}

        {activeTab === 'auditor-portal' && (
          <AuditorWorkflow
            selectedSite={selectedSite}
            currentRole={currentRole}
          />
        )}

      </main>

      {/* Footer System Status Bar */}
      <footer className="glass-panel border-t border-red-950/40 px-6 py-3 text-xs text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5 text-red-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>MoES Blue Carbon Mesh: Operational</span>
          </span>
          <span className="text-zinc-600">•</span>
          <span>5 Major Hotspots Tracked</span>
          <span className="text-zinc-600">•</span>
          <span>Polygon POS Audit Ledger</span>
        </div>

        <div className="text-[11px] text-zinc-500 font-mono">
          Clean & Green Technology • Ministry of Earth Sciences
        </div>
      </footer>

    </div>
  );
}
