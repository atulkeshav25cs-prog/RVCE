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
  const [gpsLocation, setGpsLocation] = useState<[number, number] | null>(null);
  const [gpsDenied, setGpsDenied] = useState(false);

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
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => setGpsLocation([position.coords.latitude, position.coords.longitude]),
        () => setGpsDenied(true)
      );
    } else {
      setGpsDenied(true);
    }
  }, []);

  if (error || (incidents.length === 0 && !loading && !gpsLocation)) {
    // If no incidents and no GPS, don't show the map layer at all to save space
    return null;
  }

  let mapCenter: [number, number] = [20.5937, 78.9629];
  let mapZoom = 5;
  let showDeniedMessage = false;

  if (gpsLocation) {
    mapCenter = gpsLocation;
    mapZoom = 14;
  } else if (gpsDenied && incidents.length > 0 && incidents[0].latitude && incidents[0].longitude) {
    mapCenter = [incidents[0].latitude, incidents[0].longitude];
    mapZoom = 12;
    showDeniedMessage = true;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col relative h-[400px]">
      
      <div className="bg-slate-900 p-3 shrink-0 flex items-center z-10 relative">
        <MapPin className="w-4 h-4 text-indigo-400 mr-2" />
        <h2 className="text-white font-bold text-sm">Your Active Locations</h2>
        {loading && <Loader2 className="w-3 h-3 ml-2 text-slate-400 animate-spin" />}
      </div>
      
      {showDeniedMessage && (
        <div className="bg-amber-50 text-amber-800 text-xs px-3 py-1.5 border-b border-amber-200 flex items-center shrink-0">
          <MapPin className="w-3 h-3 mr-1 shrink-0" />
          Location permission denied. Showing your latest reported incident.
        </div>
      )}

      <div className="flex-1 relative z-0">
        <MapRenderer 
          incidents={incidents} 
          resources={[]}
          hideResources={true}
          onMarkerClick={(inc) => setSelectedIncident(inc)}
          center={mapCenter}
          zoom={mapZoom}
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
