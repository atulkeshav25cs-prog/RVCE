"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon path issues in Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;

const customIcon = (color: string, pulsing: boolean = false) => {
  return L.divIcon({
    className: "custom-leaflet-icon",
    html: `
      <div style="
        width: 24px; 
        height: 24px; 
        background-color: ${color}; 
        border: 3px solid white; 
        border-radius: 50%; 
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        ${pulsing ? "animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;" : ""}
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "Critical": return "#dc2626"; // red
    case "High": return "#ea580c"; // orange
    case "Medium": return "#eab308"; // yellow
    case "Low": return "#3b82f6"; // blue
    default: return "#64748b";
  }
};

const getResourceColor = (status: string) => {
  switch (status) {
    case "Available": return "#10b981"; // green
    case "Assigned": return "#f59e0b"; // amber
    case "Dispatched": return "#3b82f6"; // blue
    case "Busy": return "#ef4444"; // red
    case "Offline": return "#64748b"; // gray
    default: return "#94a3b8";
  }
};

interface MapRendererProps {
  incidents: any[];
  resources: any[];
  onMarkerClick: (incident: any) => void;
  center?: [number, number];
  zoom?: number;
  hideResources?: boolean;
  bounds?: [number, number][] | null;
}

function MapUpdater({ center, zoom, bounds }: { center: [number, number]; zoom: number; bounds?: [number, number][] | null }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds as L.LatLngBoundsExpression, { padding: [50, 50], maxZoom: 15 });
    } else {
      map.setView(center, zoom);
    }
  }, [center, zoom, bounds, map]);
  return null;
}

export default function MapRenderer({ incidents, resources, onMarkerClick, center = [20.5937, 78.9629], zoom = 5, hideResources = false, bounds = null }: MapRendererProps) {
  
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%", zIndex: 1 }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater center={center} zoom={zoom} bounds={bounds} />
      
      {/* Incidents Layer */}
      {incidents.map((inc) => {
        if (!inc.latitude || !inc.longitude) return null;
        
        const isWS = inc.isWomenSafety;
        const color = isWS ? "#dc2626" : getSeverityColor(inc.severity);
        const icon = customIcon(color, isWS);

        return (
          <Marker 
            key={inc.reportId} 
            position={[inc.latitude, inc.longitude]} 
            icon={icon}
            eventHandlers={{ click: () => onMarkerClick(inc) }}
          />
        );
      })}

      {/* Resources Layer */}
      {!hideResources && resources.map((res) => {
        if (!res.latitude || !res.longitude) return null;
        
        const color = getResourceColor(res.status);
        const icon = customIcon(color, false);

        return (
          <Marker key={res.resourceId} position={[res.latitude, res.longitude]} icon={icon}>
            <Popup>
              <div className="font-sans">
                <div className="font-bold text-slate-800 mb-1 border-b pb-1">{res.resourceName}</div>
                <div className="text-xs mb-1"><span className="text-slate-500 font-bold">Type:</span> {res.resourceType}</div>
                <div className="text-xs mb-1"><span className="text-slate-500 font-bold">Status:</span> {res.status}</div>
                {res.assignedReportId && (
                  <div className="text-xs mt-2 bg-blue-50 text-blue-800 px-2 py-1 rounded">
                    Assigned to: <strong>{res.assignedReportId}</strong>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}

    </MapContainer>
  );
}
