"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Loader2, MapPin } from "lucide-react";
import IncidentMapDrawer from "./IncidentMapDrawer";

const MapRenderer = dynamic(() => import("./MapRenderer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mb-3" />
      <p className="text-slate-500 font-bold text-xs uppercase">Loading Personal Map...</p>
    </div>
  )
});

export default function CitizenIncidentMap() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);

  const fetchMapData = async () => {
    try {
      const res = await fetch("/api/maps/citizen");
      const data = await res.json();
      if (data.success) {
        setIncidents(data.incidents);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMapData();
  }, []);

  if (error || (incidents.length === 0 && !loading)) {
    // If no incidents with coordinates, don't show the map layer at all to save space
    return null;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col relative h-[400px] mb-6">
      
      <div className="bg-slate-900 p-3 shrink-0 flex items-center z-10 relative">
        <MapPin className="w-4 h-4 text-indigo-400 mr-2" />
        <h2 className="text-white font-bold text-sm">Your Active Locations</h2>
        {loading && <Loader2 className="w-3 h-3 ml-2 text-slate-400 animate-spin" />}
      </div>

      <div className="flex-1 relative z-0">
        <MapRenderer 
          incidents={incidents} 
          resources={[]}
          hideResources={true}
          onMarkerClick={(inc) => setSelectedIncident(inc)}
          zoom={12}
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
