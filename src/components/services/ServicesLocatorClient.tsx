"use client";

import { useState, useEffect } from "react";
import { Navigation, Search, MapPin, AlertCircle, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

const ServicesMap = dynamic(() => import("./ServicesMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-500">Loading Map Engine...</div>
});

const CITY_COORDS: Record<string, { lat: number, lng: number }> = {
  "Bangalore": { lat: 12.9716, lng: 77.5946 },
  "Delhi": { lat: 28.6139, lng: 77.2090 },
  "Mumbai": { lat: 19.0760, lng: 72.8777 },
  "Chennai": { lat: 13.0827, lng: 80.2707 },
  "Pune": { lat: 18.5204, lng: 73.8567 },
  "Hyderabad": { lat: 17.3850, lng: 78.4867 }
};

export default function ServicesLocatorClient() {
  const [mode, setMode] = useState<"gps" | "city">("gps");
  const [city, setCity] = useState("Bangalore");
  const [radius, setRadius] = useState("5");
  const [category, setCategory] = useState("All");
  
  const [center, setCenter] = useState<[number, number]>([12.9716, 77.5946]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const requestGPS = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      setError("");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCenter([pos.coords.latitude, pos.coords.longitude]);
          setMode("gps");
          setLoading(false);
          // Wait for state to settle then fetch
          setTimeout(() => handleSearch(pos.coords.latitude, pos.coords.longitude), 100);
        },
        (err) => {
          console.error(err);
          setError("Location access denied. Please search by city.");
          setMode("city");
          setLoading(false);
        },
        { timeout: 10000, maximumAge: 60000 }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setMode("city");
    }
  };

  const handleSearch = async (lat = center[0], lng = center[1]) => {
    if (mode === "city") {
      const coords = CITY_COORDS[city];
      lat = coords.lat;
      lng = coords.lng;
      setCenter([lat, lng]);
    }

    setLoading(true);
    setError("");
    setHasSearched(true);
    setResults([]);

    try {
      const res = await fetch(`/api/services?lat=${lat}&lng=${lng}&radius=${radius}&category=${encodeURIComponent(category)}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch services");
      
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message || "Unable to retrieve nearby services right now. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    requestGPS();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] min-h-[600px]">
      
      {/* Sidebar Controls & Results */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6 h-full">
        
        {/* Controls Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm shrink-0">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-3">
            Search Controls
          </h2>

          <div className="space-y-4">
            <button 
              onClick={requestGPS}
              className={`w-full flex items-center justify-center py-2.5 px-4 rounded-lg font-bold text-sm transition-colors ${mode === "gps" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Use My Current Location
            </button>

            <div className="flex items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-xs font-semibold text-slate-400">OR</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">City</label>
                <select 
                  value={city} 
                  onChange={(e) => { setCity(e.target.value); setMode("city"); }}
                  className="w-full text-sm font-semibold bg-slate-50 border border-slate-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.keys(CITY_COORDS).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Radius</label>
                <select 
                  value={radius} 
                  onChange={(e) => setRadius(e.target.value)}
                  className="w-full text-sm font-semibold bg-slate-50 border border-slate-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1">1 km</option>
                  <option value="2">2 km</option>
                  <option value="5">5 km</option>
                  <option value="10">10 km</option>
                  <option value="25">25 km</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Service Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-sm font-semibold bg-slate-50 border border-slate-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Services</option>
                <optgroup label="Healthcare">
                  <option value="Hospitals">Hospitals & Clinics</option>
                  <option value="Blood Banks">Blood Banks</option>
                  <option value="Pharmacies">Pharmacies</option>
                </optgroup>
                <optgroup label="Public Safety">
                  <option value="Police Stations">Police Stations</option>
                  <option value="Fire Stations">Fire Stations</option>
                </optgroup>
                <optgroup label="Disaster Response">
                  <option value="Shelters">Emergency Shelters</option>
                </optgroup>
              </select>
            </div>

            <button 
              onClick={() => handleSearch()}
              disabled={loading}
              className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
              {loading ? "Searching..." : "Search Services"}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden flex-1">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 shrink-0">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Nearby Results</h2>
          </div>
          
          <div className="overflow-y-auto p-4 flex-1 bg-slate-50/50">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200 flex items-start mb-4">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {!loading && !error && hasSearched && results.length === 0 && (
              <div className="text-center p-8 text-slate-500 font-medium">
                No services found within {radius} km. Try increasing the radius or changing the category.
              </div>
            )}

            {!loading && results.map((res, i) => (
              <div key={res.id || i} className="bg-white border border-slate-200 rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-slate-900 text-sm">{res.name}</h3>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2">
                    {res.distance} km
                  </span>
                </div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">{res.type}</div>
                
                <div className="text-xs text-slate-600 flex items-start mb-1">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 shrink-0 text-slate-400 mt-0.5" />
                  <span className="line-clamp-2">{res.address}</span>
                </div>
                
                {res.phone && (
                  <div className="text-xs text-slate-600 flex items-center mb-3">
                    <span className="w-3.5 h-3.5 mr-1.5 shrink-0 inline-flex items-center justify-center text-slate-400">📞</span>
                    <span className="font-semibold">{res.phone}</span>
                  </div>
                )}
                
                <div className="mt-3 flex gap-2">
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${res.lat},${res.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 rounded text-center transition-colors"
                  >
                    Directions
                  </a>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${res.lat},${res.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold py-2 rounded text-center transition-colors"
                  >
                    View Map
                  </a>
                </div>
              </div>
            ))}

            {loading && !results.length && (
              <div className="space-y-3">
                {[1,2,3].map(n => (
                  <div key={n} className="bg-white border border-slate-100 rounded-lg p-4 animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/4 mb-4"></div>
                    <div className="h-3 bg-slate-100 rounded w-full mb-2"></div>
                    <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="w-full lg:w-2/3 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm relative min-h-[400px]">
        <ServicesMap center={center} services={results} />
      </div>
      
    </div>
  );
}
