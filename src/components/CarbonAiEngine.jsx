import React from 'react';
import { 
  Database, 
  Sparkles, 
  ShieldAlert, 
  TrendingUp, 
  Info, 
  CheckCircle2, 
  Cpu,
  HelpCircle,
  BrainCircuit,
  FileSpreadsheet
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { METHODOLOGY_INFO } from '../data/mockDatasets';

export default function CarbonAiEngine({ selectedSite, activeDisaster, currentRole }) {
  // If disaster is active, calculate degraded metrics
  const effectiveRiskScore = activeDisaster ? activeDisaster.impactRiskScore : selectedSite.reversalRisk.score;
  
  const riskTier = effectiveRiskScore > 70 ? 'CRITICAL' : effectiveRiskScore > 40 ? 'HIGH' : effectiveRiskScore > 25 ? 'MEDIUM' : 'LOW';

  const riskBadgeColor = {
    CRITICAL: 'bg-red-500/20 text-red-400 border-red-500/50 shadow-sm shadow-red-950',
    HIGH: 'bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-sm shadow-rose-950',
    MEDIUM: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
    LOW: 'bg-zinc-800/80 text-zinc-300 border-red-500/30'
  }[riskTier];

  const stockBreakdownData = [
    { name: 'Above-Ground (AGB)', value: selectedSite.carbonStock.agb, fill: '#ef4444' },
    { name: 'Below-Ground (BGB)', value: selectedSite.carbonStock.bgb, fill: '#f43f5e' },
    { name: 'Soil Organic (SOC 1m)', value: selectedSite.carbonStock.soc, fill: '#be123c' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner: Scientific Methodology Overview */}
      <div className="glass-panel p-6 rounded-2xl border border-red-950/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-red-600/25 to-rose-600/25 border border-red-500/40 flex items-center justify-center shrink-0">
            <BrainCircuit className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-extrabold text-white">AI Carbon Stock & Reversal Risk Engine</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-red-500/10 text-red-300 border border-red-500/30 rounded-full">
                IPCC Tier 3 Verified
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Calibrated via <strong className="text-zinc-200">{METHODOLOGY_INFO.standard}</strong> using Sentinel-2B & LiDAR Allometric Equations
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-zinc-950/90 p-3 rounded-xl border border-zinc-800 text-xs">
          <div>
            <span className="text-zinc-400 block text-[10px] uppercase font-bold">Total Baseline Stock</span>
            <span className="text-base font-black text-red-400">
              {(selectedSite.carbonStock.totalCO2e / 1000).toFixed(1)}k <span className="text-xs font-semibold text-zinc-300">tCO₂e</span>
            </span>
          </div>
          <div className="w-px h-8 bg-zinc-800"></div>
          <div>
            <span className="text-zinc-400 block text-[10px] uppercase font-bold">Annual Rate</span>
            <span className="text-base font-black text-rose-300">
              {selectedSite.carbonStock.annualSequestrationHa} <span className="text-xs font-semibold text-zinc-300">t/ha/yr</span>
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Carbon Stock Breakdown & Reversal Risk Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Carbon Stock Breakdown Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-red-400" /> Carbon Pool Breakdown (t/ha)
            </h3>
            <span className="text-[11px] text-zinc-400 font-mono">
              {selectedSite.carbonStock.confidenceInterval}
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockBreakdownData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f2e" />
                <XAxis type="number" stroke="#71717a" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#a1a1aa" fontSize={11} width={130} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090e', borderColor: '#ef4444', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Bar dataKey="value" name="Metric Tons C / ha" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
            <div className="bg-zinc-950/80 p-2 rounded-xl border border-zinc-800">
              <span className="text-[10px] text-zinc-400 block">Above Ground (AGB)</span>
              <strong className="text-red-400">{selectedSite.carbonStock.agb} t/ha</strong>
            </div>
            <div className="bg-zinc-950/80 p-2 rounded-xl border border-zinc-800">
              <span className="text-[10px] text-zinc-400 block">Below Ground (BGB)</span>
              <strong className="text-rose-400">{selectedSite.carbonStock.bgb} t/ha</strong>
            </div>
            <div className="bg-zinc-950/80 p-2 rounded-xl border border-zinc-800">
              <span className="text-[10px] text-zinc-400 block">Soil Organic (SOC)</span>
              <strong className="text-zinc-200">{selectedSite.carbonStock.soc} t/ha</strong>
            </div>
          </div>
        </div>

        {/* Card 2: Reversal Risk Prediction Engine (SHAP Explainable AI) */}
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-orange-400" /> Carbon Reversal Risk Engine
            </h3>
            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${riskBadgeColor}`}>
              RISK LEVEL: {riskTier} ({effectiveRiskScore}%)
            </span>
          </div>

          {/* Risk Score Progress Bar */}
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-semibold">
              <span className="text-zinc-400">Reversal Risk Probability Score:</span>
              <span className="text-white font-mono font-black">{effectiveRiskScore} / 100</span>
            </div>
            <div className="w-full h-3 rounded-full bg-zinc-950 border border-zinc-800 overflow-hidden">
              <div 
                className={`h-full transition-all duration-700 ${
                  effectiveRiskScore > 70 ? 'bg-red-600' : effectiveRiskScore > 40 ? 'bg-orange-500' : 'bg-red-400'
                }`}
                style={{ width: `${effectiveRiskScore}%` }}
              ></div>
            </div>
          </div>

          {/* SHAP Feature Importance List */}
          <div>
            <h4 className="text-xs font-extrabold uppercase text-zinc-400 tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-red-400" /> SHAP Feature Attribution (Explainable AI)
            </h4>

            <div className="space-y-2">
              {selectedSite.reversalRisk.shapDrivers.map((driver, index) => (
                <div key={index} className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-zinc-200">
                    <span>{driver.feature}</span>
                    <span className={driver.impact > 0 ? 'text-red-400 font-mono' : 'text-zinc-400 font-mono'}>
                      {driver.impact > 0 ? `+${(driver.impact * 100).toFixed(0)}%` : `${(driver.impact * 100).toFixed(0)}%`}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">{driver.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Historical Sequestration & AI Forecast (2020-2026) */}
      <div className="glass-panel p-6 rounded-2xl border border-zinc-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-400" /> Multi-Year Carbon Sequestration & Forecasting (2020 - 2026)
            </h3>
            <p className="text-xs text-zinc-400">Historical Sentinel-2 NDVI trend vs Cumulative $CO_2e$ Carbon Stock (k Tons)</p>
          </div>
          <span className="text-xs bg-zinc-950 border border-zinc-800 text-red-400 px-3 py-1 rounded-xl font-mono font-semibold">
            CAGR: +3.8% Annual Growth
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={selectedSite.historicalData}>
              <defs>
                <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f2e" />
              <XAxis dataKey="year" stroke="#71717a" fontSize={11} />
              <YAxis stroke="#71717a" fontSize={11} domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090e', borderColor: '#ef4444', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="carbonStockK" name="Carbon Stock (k tCO₂e)" stroke="#ef4444" fillOpacity={1} fill="url(#colorCarbon)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
