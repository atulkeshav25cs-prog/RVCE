import { MapPin, Navigation } from "lucide-react";

export default function IncidentMap() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full min-h-[400px]">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Live Incident Map</h2>
        <button className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors flex items-center">
          <Navigation className="w-3 h-3 mr-1" />
          Recenter
        </button>
      </div>
      <div className="flex-1 relative bg-slate-100 overflow-hidden">
        {/* Placeholder for real map integration (e.g., Mapbox, Google Maps) */}
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center mix-blend-luminosity"></div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-100/80 to-transparent"></div>

        {/* Mock Map Pins */}
        <div className="absolute top-1/4 left-1/3 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
            <MapPin className="w-8 h-8 text-red-600 drop-shadow-md relative z-10" />
          </div>
          <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xl w-48 z-20">
            INC-992: Structural Collapse
          </div>
        </div>

        <div className="absolute top-1/2 right-1/4 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500 rounded-full animate-ping opacity-75 duration-1000"></div>
            <MapPin className="w-8 h-8 text-amber-500 drop-shadow-md relative z-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
