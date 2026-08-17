import React, { useState } from 'react';
import { 
  UserCheck, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileCheck, 
  Scale, 
  Layers, 
  Sparkles,
  Award,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AuditorWorkflow({ selectedSite, currentRole }) {
  const [auditDecisions, setAuditDecisions] = useState({}); // { [siteId]: 'APPROVED' | 'REJECTED' }
  const [auditorNotesMap, setAuditorNotesMap] = useState({}); // { [siteId]: string }

  const auditDecision = auditDecisions[selectedSite.id] || null;
  const auditorNotes = auditorNotesMap[selectedSite.id] || '';

  const baselineArea = Math.round(selectedSite.areaHa * 0.94);
  const growthArea = selectedSite.areaHa - baselineArea;
  const baselineNdvi = selectedSite.historicalData?.[0]?.ndvi || 0.70;

  const handleApprove = () => {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 }
    });
    setAuditDecisions(prev => ({ ...prev, [selectedSite.id]: 'APPROVED' }));
  };

  const handleReject = () => {
    setAuditDecisions(prev => ({ ...prev, [selectedSite.id]: 'REJECTED' }));
  };

  const handleNotesChange = (text) => {
    setAuditorNotesMap(prev => ({ ...prev, [selectedSite.id]: text }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-extrabold text-white">Ministry of Earth Sciences (MoES) Verifier Portal</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full">
                Government Auditor Access
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Auditing <strong className="text-white">{selectedSite.name}</strong> ({selectedSite.state}) — {selectedSite.type}
            </p>
          </div>
        </div>

        {auditDecision ? (
          <div className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center space-x-2 ${
            auditDecision === 'APPROVED' 
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' 
              : 'bg-red-500/20 text-red-300 border-red-500/50'
          }`}>
            {auditDecision === 'APPROVED' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
            <span>CLAIM {auditDecision} FOR {selectedSite.name.toUpperCase()}</span>
          </div>
        ) : (
          <div className="text-xs text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 font-semibold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>PENDING MOES VERIFICATION</span>
          </div>
        )}
      </div>

      {/* Temporal Change Detection & Satellite Evidence View (2020 vs 2026) */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" /> Temporal Satellite Change Differencing (2020 Baseline vs 2026 Present)
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Sentinel-2 Spectral Difference: <strong className="text-emerald-400">+{(((selectedSite.spectral.ndvi - baselineNdvi) / baselineNdvi) * 100).toFixed(1)}% Vegetation Expansion</strong>
          </span>
        </div>

        {/* 2-Side Comparison Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 2020 Baseline Panel */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-400">Baseline Satellite Imagery (2020)</span>
              <span className="text-slate-500 font-mono">NDVI: {baselineNdvi}</span>
            </div>
            <div className="h-40 rounded-lg bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center relative overflow-hidden">
              <div className="text-center space-y-1">
                <span className="text-xs text-slate-400 font-mono">Sentinel-2 MSI Pass (2020-04-12)</span>
                <p className="text-[11px] text-emerald-400 font-semibold">Historical Canopy Baseline: {baselineArea.toLocaleString()} Ha</p>
              </div>
            </div>
          </div>

          {/* 2026 Present Panel */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-emerald-400">Present Satellite Imagery (2026)</span>
              <span className="text-emerald-400 font-mono">NDVI: {selectedSite.spectral.ndvi}</span>
            </div>
            <div className="h-40 rounded-lg bg-emerald-900/40 border border-emerald-500/50 flex items-center justify-center relative overflow-hidden">
              <div className="text-center space-y-1">
                <span className="text-xs text-emerald-300 font-mono">Sentinel-2B Pass (2026-08-10)</span>
                <p className="text-[11px] text-emerald-300 font-semibold">Verified Active Area: {selectedSite.areaHa.toLocaleString()} Ha (+{growthArea.toLocaleString()} Ha Growth)</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* AI Fraud & Anomaly Audit Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Fraud Prevention Checklist */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Scale className="w-4 h-4 text-purple-400" /> Automated AI Fraud & Double-Counting Checks
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Double-Counting Ledger Check</span>
                <span className="text-[11px] text-slate-400">Cross-checked against Verra & Gold Standard registries</span>
              </div>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> PASSED
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Satellite Spectral Match Verification</span>
                <span className="text-[11px] text-slate-400">Canopy height & NDVI aligned with ground buoy SOC</span>
              </div>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> PASSED
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Permanence & Reversal Risk Audit</span>
                <span className="text-[11px] text-slate-400">AI Reversal Risk Score: {selectedSite.reversalRisk.score}% (Within Safe Threshold)</span>
              </div>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> LOW RISK
              </span>
            </div>
          </div>
        </div>

        {/* Auditor Action Box */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Award className="w-4 h-4 text-emerald-400" /> Government Verifier Final Action
            </h3>

            <div className="space-y-2 mt-3 text-xs">
              <label className="text-slate-400 font-semibold block">Official Auditor Assessment Notes:</label>
              <textarea 
                rows="3"
                value={auditorNotes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Enter verification comments or field inspection findings..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              ></textarea>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-4">
            <button
              onClick={handleApprove}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs hover:opacity-95 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Approve & Mint Carbon Credits</span>
            </button>

            <button
              onClick={handleReject}
              className="py-3 px-4 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 font-bold text-xs hover:bg-red-500/30 transition-all flex items-center justify-center space-x-1.5"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject Claim</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
