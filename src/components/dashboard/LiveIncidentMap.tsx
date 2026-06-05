"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Loader2, Map as MapIcon, Filter } from "lucide-react";
import IncidentMapDrawer from "./IncidentMapDrawer";

// Dynamically import the map without SSR
const MapRenderer = dynamic(() => import("./MapRenderer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
      <p className="text-slate-500 font-bold tracking-widest uppercase text-sm">Initializing Mapping Engine...</p>
    </div>
  )
});

export default function LiveIncidentMap() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [filterType, setFilterType] = useState("All"); // All, ER, WS, Resources
  const [filterSeverity, setFilterSeverity] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const [selectedIncident, setSelectedIncident] = useState<any>(null);

  const fetchMapData = async () => {
    try {
      const [incRes, resRes] = await Promise.all([
        fetch("/api/maps/incidents"),
        fetch("/api/maps/resources")
      ]);
      
      const incData = await incRes.json();
      const resData = await resRes.json();
      
      if (incData.success) setIncidents(incData.incidents);
      if (resData.success) setResources(resData.resources);
      
    } catch (err) {
      console.error("Map Fetch Error", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMapData();
    const interval = setInterval(fetchMapData, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, []);

  const filteredIncidents = incidents.filter(inc => {
    if (filterType === "Resources") return false;
    if (filterType === "ER" && inc.isWomenSafety) return false;
    if (filterType === "WS" && !inc.isWomenSafety) return false;
    
    if (filterSeverity !== "All" && inc.severity !== filterSeverity) return false;
    if (filterStatus !== "All" && inc.status !== filterStatus) return false;
    
    return true;
  });

  if (error) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center h-[600px]">
        <MapIcon className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-bold text-slate-700">Location unavailable</h3>
        <p className="text-slate-500 text-sm mt-2">The map visualization layer could not be loaded. Please continue using the dashboard tables.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col relative h-[600px]">
      
      {/* Header & Controls */}
      <div className="bg-slate-900 p-4 shrink-0 flex flex-col md:flex-row justify-between md:items-center gap-4 z-10 relative">
        <div className="flex items-center">
          <MapIcon className="w-5 h-5 text-indigo-400 mr-3" />
          <h2 className="text-white font-bold text-lg">EOC Live Map</h2>
          {loading && <Loader2 className="w-4 h-4 ml-3 text-slate-400 animate-spin" />}
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-800 rounded-lg px-3 py-1">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-2" />
            <select 
              value={filterType} 
              onChange={e => setFilterType(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none font-medium"
            >
              <option value="All" className="text-slate-900">All Layers</option>
              <option value="ER" className="text-slate-900">Emergency Reports Only</option>
              <option value="WS" className="text-slate-900">Women Safety Only</option>
              <option value="Resources" className="text-slate-900">Resources Only</option>
            </select>
          </div>
          
          {filterType !== "Resources" && (
            <>
              <select 
                value={filterSeverity} 
                onChange={e => setFilterSeverity(e.target.value)}
                className="bg-slate-800 text-sm text-white px-3 py-1.5 rounded-lg focus:outline-none font-medium"
              >
                <option value="All" className="text-slate-900">Any Severity</option>
                <option value="Critical" className="text-slate-900">Critical</option>
                <option value="High" className="text-slate-900">High</option>
                <option value="Medium" className="text-slate-900">Medium</option>
              </select>

              <select 
                value={filterStatus} 
                onChange={e => setFilterStatus(e.target.value)}
                className="bg-slate-800 text-sm text-white px-3 py-1.5 rounded-lg focus:outline-none font-medium"
              >
                <option value="All" className="text-slate-900">Any Status</option>
                <option value="Pending" className="text-slate-900">Pending</option>
                <option value="Dispatched" className="text-slate-900">Dispatched</option>
                <option value="Resolved" className="text-slate-900">Resolved</option>
              </select>
            </>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative z-0">
        <MapRenderer 
          incidents={filteredIncidents} 
          resources={filterType === "Resources" || filterType === "All" ? resources : []}
          hideResources={filterType !== "All" && filterType !== "Resources"}
          onMarkerClick={(inc) => setSelectedIncident(inc)}
          // Center coordinate default to New Delhi for mockup visualization
          center={[28.6139, 77.2090]} 
          zoom={11}
        />
      </div>

      <IncidentMapDrawer 
        isOpen={!!selectedIncident} 
        incident={selectedIncident} 
        onClose={() => setSelectedIncident(null)} 
      />
    </div>
  );
}
