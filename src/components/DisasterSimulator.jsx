import React from 'react';
import { 
  Flame, 
  Wind, 
  Droplet, 
  Axe, 
  RotateCcw, 
  AlertOctagon, 
  ShieldAlert, 
  CheckCircle,
  Radio,
  Zap
} from 'lucide-react';

export default function DisasterSimulator({ 
  selectedSite, 
  activeDisaster, 
  setActiveDisaster,
  currentRole
}) {
  const totalStock = selectedSite.carbonStock.totalCO2e;
  
  const DISASTER_SCENARIOS = [
    {
      id: 'cyclone',
      name: 'Category 4 Super Cyclone Landfall',
      type: 'CYCLONE',
      icon: Wind,
      color: 'from-red-900 via-rose-950 to-zinc-950',
      borderColor: 'border-red-500/50',
      impactRiskScore: 82,
      impactNdviDrop: 0.24,
      carbonLossEstimate: `${Math.round(totalStock * 0.15).toLocaleString()} tCO₂e`,
      description: `185 km/h cyclonic winds cause mass mangrove canopy defoliation and severe coastal wave erosion in ${selectedSite.name}.`,
      blockchainEvent: 'EMERGENCY_FREEZE_CYCLONE_DAMAGE'
    },
    {
      id: 'oil-spill',
      name: 'Coastal Oil Spill & Marine Pollution',
      type: 'OIL_SPILL',
      icon: Droplet,
      color: 'from-amber-900 via-stone-900 to-zinc-950',
      borderColor: 'border-amber-500/50',
      impactRiskScore: 78,
      impactNdviDrop: 0.18,
      carbonLossEstimate: `${Math.round(totalStock * 0.08).toLocaleString()} tCO₂e`,
      description: `Petroleum slick smothers pneumatophore aerial roots across ${selectedSite.name}, blocking mangrove respiration and soil oxidation.`,
      blockchainEvent: 'ALERT_POLLUTION_SOIL_TOXICITY'
    },
    {
      id: 'deforestation',
      name: 'Illegal Mangrove Clearing & Encroachment',
      type: 'DEFORESTATION',
      icon: Axe,
      color: 'from-red-700 via-red-900 to-zinc-950',
      borderColor: 'border-red-500/60',
      impactRiskScore: 94,
      impactNdviDrop: 0.38,
      carbonLossEstimate: `${Math.round(totalStock * 0.22).toLocaleString()} tCO₂e`,
      description: `Unauthorized heavy machinery clearing of ${selectedSite.name} for commercial pond conversion.`,
      blockchainEvent: 'CRITICAL_FRAUD_ILLEGAL_CLEARING'
    },
    {
      id: 'heatwave',
      name: 'Marine Heatwave & Thermal Water Stress',
      type: 'HEATWAVE',
      icon: Flame,
      color: 'from-rose-600 via-orange-900 to-zinc-950',
      borderColor: 'border-orange-500/50',
      impactRiskScore: 68,
      impactNdviDrop: 0.14,
      carbonLossEstimate: `${Math.round(totalStock * 0.05).toLocaleString()} tCO₂e`,
      description: `Sea surface temperatures exceed 33.5°C for 14 consecutive days across ${selectedSite.name}, causing thermal bleaching.`,
      blockchainEvent: 'WARNING_THERMAL_BLEACHING_RISK'
    }
  ];

  const handleTriggerDisaster = async (scenario) => {
    setActiveDisaster(scenario);
    try {
      await fetch('/api/simulate-disaster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disasterType: scenario.type, siteId: selectedSite.id })
      });
    } catch (e) {
      // client fallback
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-red-500/40 bg-gradient-to-r from-zinc-950 via-zinc-900 to-red-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center">
            <AlertOctagon className="w-6 h-6 text-red-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-extrabold text-white">Live Environmental Stress & Disaster Simulator</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40 rounded-full">
                Interactive Backend Simulator
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Simulate extreme environmental events to observe real-time AI risk recalculation and Web3 safety freeze response.
            </p>
          </div>
        </div>

        {activeDisaster ? (
          <button
            onClick={() => setActiveDisaster(null)}
            className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-500 transition-all flex items-center space-x-2 shadow-lg shadow-red-600/30"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Ecosystem Baseline</span>
          </button>
        ) : (
          <div className="text-xs text-zinc-400 bg-zinc-950/90 px-4 py-2 rounded-xl border border-zinc-800 flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-red-400" />
            <span>Ecosystem Baseline Healthy (0 Active Disasters)</span>
          </div>
        )}
      </div>

      {/* Grid of 4 Disaster Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DISASTER_SCENARIOS.map((scenario) => {
          const IconComponent = scenario.icon;
          const isActive = activeDisaster?.id === scenario.id;

          return (
            <div
              key={scenario.id}
              onClick={() => handleTriggerDisaster(scenario)}
              className={`glass-panel p-5 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                isActive
                  ? `border-red-500 bg-red-950/50 shadow-2xl ring-2 ring-red-500/60`
                  : `border-zinc-800 hover:border-red-500/40 bg-zinc-950/70 hover:bg-zinc-900/80`
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${scenario.color} flex items-center justify-center shadow-md border border-red-500/20`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white group-hover:text-red-300 transition-colors">
                      {scenario.name}
                    </h3>
                    <span className="text-[11px] font-mono text-zinc-400">
                      Simulate Impact on {selectedSite.name}
                    </span>
                  </div>
                </div>

                {isActive && (
                  <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-red-600 text-white rounded-full animate-pulse shadow-md shadow-red-950">
                    ACTIVE NOW
                  </span>
                )}
              </div>

              <p className="text-xs text-zinc-300 mt-3 leading-relaxed">
                {scenario.description}
              </p>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-zinc-800/80 text-[11px]">
                <div className="bg-zinc-950/90 p-2 rounded-xl text-center border border-zinc-900">
                  <span className="text-zinc-400 block text-[10px]">AI Risk Score</span>
                  <strong className="text-red-400 text-xs font-mono">{scenario.impactRiskScore}%</strong>
                </div>
                <div className="bg-zinc-950/90 p-2 rounded-xl text-center border border-zinc-900">
                  <span className="text-zinc-400 block text-[10px]">NDVI Drop</span>
                  <strong className="text-orange-400 text-xs font-mono">-{scenario.impactNdviDrop}</strong>
                </div>
                <div className="bg-zinc-950/90 p-2 rounded-xl text-center border border-zinc-900">
                  <span className="text-zinc-400 block text-[10px]">Est. CO₂ Loss</span>
                  <strong className="text-rose-300 text-xs font-mono">{scenario.carbonLossEstimate}</strong>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400">
                <span className="flex items-center gap-1 font-mono text-[10px]">
                  <Radio className="w-3 h-3 text-red-400" /> Web3 Trigger: {scenario.blockchainEvent}
                </span>
                <span className="text-xs text-red-400 font-bold group-hover:underline">
                  {isActive ? 'Simulating Impact...' : 'Click to Trigger Event →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Disaster Response Status Box */}
      {activeDisaster && (
        <div className="glass-panel p-5 rounded-2xl border border-red-500/50 bg-red-950/30 space-y-3">
          <div className="flex items-center justify-between border-b border-red-500/30 pb-3">
            <h4 className="text-xs font-extrabold uppercase text-red-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" /> SYSTEM RESPONSE TO ACTIVE EVENT: {activeDisaster.name}
            </h4>
            <span className="text-[11px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
              STATUS: EMISSION PAUSED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-zinc-950/90 rounded-xl border border-red-500/30">
              <span className="text-zinc-400 block text-[10px] uppercase font-bold">1. Digital Twin Reaction</span>
              <p className="text-zinc-200 mt-1">
                Satellite NDVI degraded to <strong className="text-red-400">{(selectedSite.spectral.ndvi - activeDisaster.impactNdviDrop).toFixed(2)}</strong>. Boundary marked with alert overlay.
              </p>
            </div>
            <div className="p-3 bg-zinc-950/90 rounded-xl border border-red-500/30">
              <span className="text-zinc-400 block text-[10px] uppercase font-bold">2. AI Reversal Risk Engine</span>
              <p className="text-zinc-200 mt-1">
                Risk score jumped from <strong className="text-red-400">{selectedSite.reversalRisk.score}%</strong> to <strong className="text-red-400 font-extrabold">{activeDisaster.impactRiskScore}% (CRITICAL)</strong>.
              </p>
            </div>
            <div className="p-3 bg-zinc-950/90 rounded-xl border border-red-500/30">
              <span className="text-zinc-400 block text-[10px] uppercase font-bold">3. Blockchain Action</span>
              <p className="text-zinc-200 mt-1">
                Smart contract emitted <code className="text-rose-300 font-mono">{activeDisaster.blockchainEvent}</code>. Carbon credit issuance frozen.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
