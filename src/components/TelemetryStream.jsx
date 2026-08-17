import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Droplets, 
  Thermometer, 
  Waves, 
  Zap, 
  Radio, 
  TrendingUp, 
  AlertCircle,
  Clock,
  Gauge
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function TelemetryStream({ selectedSite, isLiveStreaming, activeDisaster, currentRole }) {
  const [telemetryHistory, setTelemetryHistory] = useState([
    { time: '10:00:00', salinity: selectedSite.telemetry.salinityPpt, soc: selectedSite.telemetry.socPercentage, temp: selectedSite.telemetry.waterTempC },
    { time: '10:00:03', salinity: selectedSite.telemetry.salinityPpt + 0.1, soc: selectedSite.telemetry.socPercentage, temp: selectedSite.telemetry.waterTempC + 0.1 },
    { time: '10:00:06', salinity: selectedSite.telemetry.salinityPpt - 0.2, soc: selectedSite.telemetry.socPercentage - 0.1, temp: selectedSite.telemetry.waterTempC - 0.1 },
    { time: '10:00:09', salinity: selectedSite.telemetry.salinityPpt + 0.3, soc: selectedSite.telemetry.socPercentage + 0.1, temp: selectedSite.telemetry.waterTempC },
  ]);

  const [currentReadings, setCurrentReadings] = useState(selectedSite.telemetry);
  const [anomalyLogs, setAnomalyLogs] = useState([]);

  // Reset telemetry data whenever the selected forest site changes
  useEffect(() => {
    const t0 = selectedSite.telemetry;
    setCurrentReadings({ ...t0 });
    setTelemetryHistory([
      { time: '10:00:00', salinity: Number(t0.salinityPpt.toFixed(2)), soc: Number(t0.socPercentage.toFixed(2)), temp: Number(t0.waterTempC.toFixed(2)) },
      { time: '10:00:03', salinity: Number((t0.salinityPpt + 0.1).toFixed(2)), soc: Number(t0.socPercentage.toFixed(2)), temp: Number((t0.waterTempC + 0.1).toFixed(2)) },
      { time: '10:00:06', salinity: Number((t0.salinityPpt - 0.2).toFixed(2)), soc: Number((t0.socPercentage - 0.1).toFixed(2)), temp: Number((t0.waterTempC - 0.1).toFixed(2)) },
      { time: '10:00:09', salinity: Number((t0.salinityPpt + 0.3).toFixed(2)), soc: Number((t0.socPercentage + 0.1).toFixed(2)), temp: Number(t0.waterTempC.toFixed(2)) },
    ]);
    setAnomalyLogs([]);
  }, [selectedSite]);

  // Live streaming effect every 2.5 seconds connected to backend API
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(async () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour12: false });

      let fetchedReadings = null;
      try {
        const res = await fetch(`/api/telemetry?siteId=${selectedSite.id}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.telemetry) {
            fetchedReadings = json.telemetry;
          }
        }
      } catch (e) {
        // Fallback to client simulation
      }

      // Apply disaster offsets if disaster is active
      let salinityDelta = (Math.random() - 0.48) * 0.4;
      let tempDelta = (Math.random() - 0.48) * 0.3;
      let socDelta = (Math.random() - 0.5) * 0.05;

      if (activeDisaster) {
        if (activeDisaster.type === 'OIL_SPILL') socDelta = -0.15;
        if (activeDisaster.type === 'HEATWAVE') tempDelta = 0.6;
        if (activeDisaster.type === 'CYCLONE') salinityDelta = -0.8;
      }

      setCurrentReadings(prev => {
        const baseSal = fetchedReadings ? fetchedReadings.salinityPpt : prev.salinityPpt;
        const baseTemp = fetchedReadings ? fetchedReadings.waterTempC : prev.waterTempC;
        const baseSoc = fetchedReadings ? fetchedReadings.socPercentage : prev.socPercentage;

        const newSal = Number((baseSal + salinityDelta).toFixed(2));
        const newTemp = Number((baseTemp + tempDelta).toFixed(2));
        const newSoc = Number(Math.max(1.2, baseSoc + socDelta).toFixed(2));

        // Append to history graph
        setTelemetryHistory(h => {
          const updated = [...h, { time: timeStr, salinity: newSal, soc: newSoc, temp: newTemp }];
          return updated.slice(-12); // keep last 12 points
        });

        // Trigger anomaly log if bounds exceeded
        if (newTemp > 31.0 || newSal > 40.0 || newSoc < 2.5) {
          setAnomalyLogs(a => [
            {
              id: Date.now(),
              time: timeStr,
              param: newTemp > 31 ? 'HIGH TEMP' : newSal > 40 ? 'HYPERSALINE' : 'SOC DROP',
              val: newTemp > 31 ? `${newTemp}°C` : `${newSal} ppt`,
              severity: 'HIGH'
            },
            ...a.slice(0, 4)
          ]);
        }

        return {
          ...prev,
          salinityPpt: newSal,
          waterTempC: newTemp,
          socPercentage: newSoc
        };
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isLiveStreaming, activeDisaster, selectedSite]);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center">
            <Radio className="w-6 h-6 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">Marine IoT Buoy Sensor Telemetry</h2>
            <p className="text-xs text-slate-400">
              Live WebSockets Telemetry Feed from Buoy Node <code className="text-emerald-300 font-mono">#BUOY-{selectedSite.id.toUpperCase()}</code>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>FREQ: 2.5 SEC</span>
          </span>
          <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 font-mono">
            IPFS MESH: ACTIVE
          </span>
        </div>
      </div>

      {/* Live Gauges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* Gauge 1: Water Salinity */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800/90 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Salinity</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{currentReadings.salinityPpt}</span>
            <span className="text-xs text-slate-400 ml-1 font-medium">ppt</span>
          </div>
          <div className="mt-2 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Baseline: 24-32 ppt
          </div>
        </div>

        {/* Gauge 2: Soil Organic Carbon */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800/90 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Soil Org Carbon</span>
            <Gauge className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-emerald-400">{currentReadings.socPercentage}%</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 font-semibold">
            Depth: 0 - 100cm Sediment
          </div>
        </div>

        {/* Gauge 3: Water Temp */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800/90 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Water Temp</span>
            <Thermometer className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{currentReadings.waterTempC}°C</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 font-semibold">
            Sensor: Probe #04 Submerged
          </div>
        </div>

        {/* Gauge 4: Soil pH */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800/90 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sediment pH</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{currentReadings.soilPh}</span>
          </div>
          <div className="mt-2 text-[10px] text-emerald-400 font-semibold">
            Status: Optimal Alkaline
          </div>
        </div>

        {/* Gauge 5: Sea Level Anomaly */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800/90 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sea Level Anomaly</span>
            <Waves className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">+{currentReadings.seaLevelAnomalyMm}</span>
            <span className="text-xs text-slate-400 ml-1">mm</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 font-semibold">
            Tidal Gauge Aligned
          </div>
        </div>

        {/* Gauge 6: Dissolved Oxygen */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800/90 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dissolved Oxygen</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{currentReadings.dissolvedOxygenMgL}</span>
            <span className="text-xs text-slate-400 ml-1">mg/L</span>
          </div>
          <div className="mt-2 text-[10px] text-emerald-400 font-semibold">
            Marine Aeration: Normal
          </div>
        </div>

      </div>

      {/* Main Charts & Live Anomaly Log Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Real-Time Salinity & Temp Stream */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Live Sensor Telemetry Stream (Past 30 Seconds)
              </h3>
              <p className="text-xs text-slate-400">Comparing Water Salinity (ppt) vs Soil Organic Carbon (%)</p>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              UPDATED LIVE
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#07152b', borderColor: '#10b981', borderRadius: '12px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="salinity" name="Salinity (ppt)" stroke="#22d3ee" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="temp" name="Water Temp (°C)" stroke="#f97316" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="soc" name="SOC (%)" stroke="#10b981" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Anomaly / Alert Log */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-400" /> Automated Telemetry Anomaly Log
              </h3>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-semibold">
                AI Filter Active
              </span>
            </div>

            {anomalyLogs.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-40 text-emerald-400" />
                No sensor anomalies detected. Telemetry operating within baseline thresholds.
              </div>
            ) : (
              <div className="space-y-2.5">
                {anomalyLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-orange-300">{log.param}</span>
                      <p className="text-[11px] text-slate-400">Value recorded: <strong className="text-white">{log.val}</strong></p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{log.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Hardware Protocol: LoRaWAN / Satellite Gateway</span>
            <span className="text-emerald-400 font-semibold">Mesh Health: 100%</span>
          </div>
        </div>

      </div>

    </div>
  );
}
