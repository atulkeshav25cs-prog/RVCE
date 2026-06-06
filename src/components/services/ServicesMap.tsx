"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix standard marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}

const getIconForType = (type: string) => {
  let bgColor = "bg-slate-600";
  let iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;

  switch(type) {
    case "Hospital":
      bgColor = "bg-red-600";
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M2 12h20"/></svg>`;
      break;
    case "Police Station":
      bgColor = "bg-blue-600";
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
      break;
    case "Fire Station":
      bgColor = "bg-orange-600";
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`;
      break;
    case "Blood Bank":
      bgColor = "bg-rose-600";
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>`;
      break;
    case "Pharmacy":
      bgColor = "bg-emerald-600";
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>`;
      break;
    case "Shelter":
      bgColor = "bg-indigo-600";
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
      break;
  }

  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;color:white;box-shadow:0 2px 5px rgba(0,0,0,0.3);" class="${bgColor}">${iconHtml}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

const userIcon = L.divIcon({
  className: "user-div-icon",
  html: `<div style="display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background-color:#2563eb;color:white;border:3px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.4);"><div style="width:8px;height:8px;border-radius:50%;background:white;"></div></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

interface ServicesMapProps {
  center: [number, number];
  services: any[];
}

export default function ServicesMap({ center, services }: ServicesMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center">Loading Map...</div>;

  return (
    <MapContainer center={center} zoom={13} className="w-full h-full z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapUpdater center={center} />

      {/* User Location Marker */}
      <Marker position={center} icon={userIcon}>
        <Popup>
          <div className="text-sm font-bold">Your Location / Search Center</div>
        </Popup>
      </Marker>

      {/* Service Markers */}
      {services.map((service) => (
        <Marker 
          key={service.id} 
          position={[service.lat, service.lng]} 
          icon={getIconForType(service.type)}
        >
          <Popup>
            <div className="min-w-[150px]">
              <div className="font-bold text-slate-900">{service.name}</div>
              <div className="text-xs text-slate-500 font-semibold mb-1">{service.type}</div>
              <div className="text-xs text-slate-600 mb-2">{service.address}</div>
              <div className="text-xs font-bold text-blue-600">{service.distance} km away</div>
              {service.phone && <div className="text-xs text-slate-700 mt-1">📞 {service.phone}</div>}
              
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${service.lat},${service.lng}`} 
                target="_blank" 
                rel="noreferrer"
                className="mt-3 block text-center bg-slate-900 text-white text-xs font-bold py-1.5 rounded"
              >
                Directions
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
