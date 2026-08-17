import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  Compass, 
  Activity, 
  MapPin, 
  Maximize2, 
  Sparkles, 
  Eye, 
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { BLUE_CARBON_HOTSPOTS } from '../data/mockDatasets';

export default function DigitalTwinMap({ selectedSite, setSelectedSite, activeDisaster, currentRole }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const polygonLayerRef = useRef(null);
  const markerGroupRef = useRef(null);

  const [spectralMode, setSpectralMode] = useState('TRUE_COLOR'); // TRUE_COLOR | NDVI | NDWI | CANOPY
  const [isDrawingRoi, setIsDrawingRoi] = useState(false);
  const [customRoiArea, setCustomRoiArea] = useState(null);

  // Reset custom ROI popup when selectedSite changes
  useEffect(() => {
    setCustomRoiArea(null);
  }, [selectedSite]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [selectedSite.coordinates.lat, selectedSite.coordinates.lng],
        zoom: 11,
        zoomControl: false,
        attributionControl: false
      });

      // Esri World Imagery Satellite Tile Layer
      const satelliteTile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
      }).addTo(map);

      // Label overlay tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
      markerGroupRef.current = L.layerGroup().addTo(map);
      polygonLayerRef.current = L.layerGroup().addTo(map);
    }
  }, []);

  // Update map view when selected site or spectral mode or disaster changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    map.flyTo([selectedSite.coordinates.lat, selectedSite.coordinates.lng], 12, {
      duration: 1.5,
      easeLinearity: 0.25
    });

    // Clear existing markers & polygons
    if (markerGroupRef.current) markerGroupRef.current.clearLayers();
    if (polygonLayerRef.current) polygonLayerRef.current.clearLayers();

    // Render Hotspot Pins
    BLUE_CARBON_HOTSPOTS.forEach((spot) => {
      const isCurrent = spot.id === selectedSite.id;

      // Custom HTML Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div class="relative group cursor-pointer">
            <div class="w-8 h-8 rounded-full ${isCurrent ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50 scale-110' : 'bg-slate-900 border border-emerald-500/40'} flex items-center justify-center text-white transition-all">
              <span class="w-2.5 h-2.5 rounded-full ${isCurrent ? 'bg-white animate-ping' : 'bg-emerald-400'}"></span>
            </div>
            <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow border border-slate-700 whitespace-nowrap z-50">
              ${spot.name}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([spot.coordinates.lat, spot.coordinates.lng], { icon: customIcon })
        .addTo(markerGroupRef.current)
        .on('click', () => setSelectedSite(spot));
    });

    // Color based on spectral mode & active disaster
    let strokeColor = '#10b981';
    let fillColor = '#10b981';
    let fillOpacity = 0.35;

    if (activeDisaster) {
      strokeColor = '#ef4444';
      fillColor = '#dc2626';
      fillOpacity = 0.55;
    } else if (spectralMode === 'NDVI') {
      strokeColor = '#34d399';
      fillColor = '#059669';
      fillOpacity = 0.45;
    } else if (spectralMode === 'NDWI') {
      strokeColor = '#22d3ee';
      fillColor = '#0891b2';
      fillOpacity = 0.45;
    } else if (spectralMode === 'CANOPY') {
      strokeColor = '#a855f7';
      fillColor = '#7e22ce';
      fillOpacity = 0.4;
    }

    // Polygon boundary offset simulation around hotspot
    const centerLat = selectedSite.coordinates.lat;
    const centerLng = selectedSite.coordinates.lng;
    const bounds = [
      [centerLat + 0.035, centerLng - 0.045],
      [centerLat + 0.045, centerLng + 0.035],
      [centerLat - 0.025, centerLng + 0.055],
      [centerLat - 0.045, centerLng - 0.025]
    ];

    const polygon = L.polygon(bounds, {
      color: strokeColor,
      weight: activeDisaster ? 3 : 2,
      dashArray: activeDisaster ? '6, 6' : null,
      fillColor: fillColor,
      fillOpacity: fillOpacity
    }).addTo(polygonLayerRef.current);

    polygon.bindPopup(`
      <div class="p-2 space-y-1 text-xs">
        <h4 class="font-extrabold text-emerald-400">${selectedSite.name}</h4>
        <p class="text-slate-300">Type: <span class="font-semibold">${selectedSite.type}</span></p>
        <p class="text-slate-300">Area: <span class="font-semibold">${selectedSite.areaHa.toLocaleString()} Ha</span></p>
        <p class="text-slate-300">Baseline Carbon: <span class="font-semibold">${(selectedSite.carbonStock.totalCO2e / 1000).toFixed(1)}k tCO₂e</span></p>
        <p class="text-slate-300">Status: <span class="text-emerald-400 font-bold">${selectedSite.mrvStatus}</span></p>
      </div>
    `);

  }, [selectedSite, spectralMode, activeDisaster]);

  const handleSimulateCustomRoi = () => {
    setIsDrawingRoi(true);
    setTimeout(() => {
      const roiHa = Math.round(selectedSite.areaHa * 0.12);
      const estCarbon = Math.round(selectedSite.carbonStock.totalCO2e * 0.12).toLocaleString();
      setCustomRoiArea({
        areaHa: roiHa > 0 ? roiHa : 450,
        estimatedCarbon: `${estCarbon} tCO₂e`,
        ndviScore: selectedSite.spectral.ndvi,
        reversalRisk: `${selectedSite.reversalRisk.level} (${selectedSite.reversalRisk.score}%)`
      });
      setIsDrawingRoi(false);
    }, 1200);
  };

  return (
    <div className="relative w-full h-[calc(100vh-140px)] rounded-2xl overflow-hidden glass-panel border border-slate-800">
      
      {/* Leaflet Map Target */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Header Banner */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pointer-events-none">
        
        {/* Active Hotspot Info Badge */}
        <div className="glass-panel-accent p-4 rounded-2xl border border-emerald-500/30 shadow-xl pointer-events-auto flex items-center space-x-4 max-w-lg">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <Compass className="w-6 h-6 text-emerald-400 animate-pulse-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-sm text-white">{selectedSite.name}</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-900 text-emerald-400 border border-emerald-500/30 rounded-full">
                {selectedSite.state}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Ecosystem: <span className="text-emerald-300 font-semibold">{selectedSite.type}</span> • {selectedSite.areaHa.toLocaleString()} Hectares
            </p>
            <div className="flex items-center space-x-3 mt-1.5 text-[11px] text-slate-400 font-medium">
              <span>NDVI: <strong className="text-emerald-400">{selectedSite.spectral.ndvi}</strong></span>
              <span>Canopy Height: <strong className="text-cyan-400">{selectedSite.spectral.canopyHeightMeters}m</strong></span>
              <span>Baseline: <strong className="text-purple-300">{(selectedSite.carbonStock.totalCO2e / 1000).toFixed(0)}k tCO₂e</strong></span>
            </div>
          </div>
        </div>

        {/* Disaster Active Warning Overlay */}
        {activeDisaster && (
          <div className="glass-panel p-3 px-5 rounded-2xl border border-red-500/60 bg-red-950/40 shadow-2xl pointer-events-auto flex items-center space-x-3 animate-bounce">
            <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
            <div>
              <h4 className="text-xs font-black uppercase text-red-300 tracking-wider">
                ACTIVE STRESS EVENT: {activeDisaster.name}
              </h4>
              <p className="text-[11px] text-red-200">
                Satellite & IoT indices degraded • Carbon Reversal Risk Spiked to <strong className="text-white font-extrabold">{activeDisaster.impactRiskScore}%</strong>
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Floating Controls Bar (Bottom Left) */}
      <div className="absolute bottom-6 left-6 z-10 glass-panel p-3 rounded-2xl border border-slate-700/80 shadow-2xl flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-cyan-400" /> Spectral Layer:
        </span>
        
        <button
          onClick={() => setSpectralMode('TRUE_COLOR')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            spectralMode === 'TRUE_COLOR'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
              : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          True Color
        </button>

        <button
          onClick={() => setSpectralMode('NDVI')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            spectralMode === 'NDVI'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
              : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          NDVI (Canopy Health)
        </button>

        <button
          onClick={() => setSpectralMode('NDWI')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            spectralMode === 'NDWI'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
              : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          NDWI (Water Content)
        </button>

        <button
          onClick={() => setSpectralMode('CANOPY')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            spectralMode === 'CANOPY'
              ? 'bg-purple-500 text-white shadow-md font-bold'
              : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          LiDAR Height Mesh
        </button>

        <div className="w-px h-6 bg-slate-700 mx-1"></div>

        {/* Draw Custom Polygon Button */}
        <button
          onClick={handleSimulateCustomRoi}
          disabled={isDrawingRoi}
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:opacity-90 transition-all flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isDrawingRoi ? 'Analyzing Boundary...' : 'Draw Custom ROI Boundary'}</span>
        </button>
      </div>

      {/* Custom ROI Analysis Modal Card */}
      {customRoiArea && (
        <div className="absolute bottom-20 right-6 z-20 glass-panel p-4 rounded-2xl border border-emerald-500/40 w-80 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <h4 className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-400" /> CUSTOM POLYGON ANALYZED
            </h4>
            <button 
              onClick={() => setCustomRoiArea(null)}
              className="text-slate-400 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Selected Area:</span>
              <span className="font-extrabold text-white">{customRoiArea.areaHa} Hectares</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Est. Carbon Stock:</span>
              <span className="font-extrabold text-emerald-400">{customRoiArea.estimatedCarbon}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Avg. NDVI Health:</span>
              <span className="font-extrabold text-cyan-300">{customRoiArea.ndviScore}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Reversal Risk:</span>
              <span className="font-extrabold text-emerald-400">{customRoiArea.reversalRisk}</span>
            </div>
          </div>
        </div>
      )}

      {/* Satellite Metadata Stamp (Top Right) */}
      <div className="absolute top-4 right-4 z-10 glass-panel p-3 rounded-2xl border border-slate-800 text-[11px] space-y-1 text-slate-400 hidden sm:block">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold">
          <Activity className="w-3.5 h-3.5" />
          <span>SENTINEL-2B MSI PASS</span>
        </div>
        <div>Sensor: <span className="text-slate-200">10m Multispectral</span></div>
        <div>Revisit Interval: <span className="text-slate-200">5 Days</span></div>
        <div>Cloud Cover: <span className="text-emerald-400 font-bold">0.8% (Optimal)</span></div>
      </div>

    </div>
  );
}
