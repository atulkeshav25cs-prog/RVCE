"use client";

import { useState } from "react";
import { X, Flame, HeartPulse, ShieldAlert, Droplets, AlertTriangle, AlertCircle, MapPin, Loader2, CheckCircle } from "lucide-react";

interface SOSCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  { id: "Medical", title: "Medical Emergency", icon: HeartPulse, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", hover: "hover:border-rose-400 hover:bg-rose-50" },
  { id: "Fire", title: "Fire Emergency", icon: Flame, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", hover: "hover:border-orange-400 hover:bg-orange-50" },
  { id: "Police", title: "Security / Police", icon: ShieldAlert, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", hover: "hover:border-blue-400 hover:bg-blue-50" },
  { id: "WomenSafety", title: "Women Safety", icon: AlertCircle, color: "text-pink-600", bg: "bg-pink-50", border: "border-pink-200", hover: "hover:border-pink-400 hover:bg-pink-50" },
  { id: "Flood", title: "Flood / Rescue", icon: Droplets, color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-200", hover: "hover:border-cyan-400 hover:bg-cyan-50" },
  { id: "General", title: "General SOS", icon: AlertTriangle, color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200", hover: "hover:border-slate-400 hover:bg-slate-50" }
];

export default function SOSCategoryModal({ isOpen, onClose }: SOSCategoryModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<any>(null);
  const [locationStatus, setLocationStatus] = useState<"pending" | "acquired" | "denied">("pending");
  const [manualLocation, setManualLocation] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  if (!isOpen) return null;

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
    // Request GPS silently when they choose a category
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationStatus("acquired");
        },
        () => setLocationStatus("denied")
      );
    } else {
      setLocationStatus("denied");
    }
  };

  const handleDispatch = async () => {
    if (!selectedCategory) return;
    if (locationStatus === "denied" && !manualLocation.trim()) return;

    setIsSubmitting(true);

    const payload = {
      isSOS: true,
      emergencyType: selectedCategory === "WomenSafety" ? "Women Safety Incident" : selectedCategory,
      title: `${selectedCategory} SOS`,
      description: note.trim() || `Instant SOS Dispatch triggered for ${selectedCategory}.`,
      location: locationStatus === "acquired" ? "GPS Automatically Acquired" : manualLocation,
      latitude: coords?.lat,
      longitude: coords?.lng,
      severity: "Critical",
      emergencyCategory: selectedCategory
    };

    try {
      const endpoint = selectedCategory === "WomenSafety" ? "/api/women-safety/create" : "/api/reports/create";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        setSubmittedReport(data.report || data.sos);
      } else {
        alert("Failed to dispatch: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error dispatching SOS");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setNote("");
    setSubmittedReport(null);
    setLocationStatus("pending");
    setManualLocation("");
    setCoords(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleReset} />
      
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-red-600 text-white">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            <h2 className="font-bold tracking-tight">Instant SOS Dispatch</h2>
          </div>
          <button onClick={handleReset} className="text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {submittedReport ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Emergency Request Submitted</h3>
              <p className="text-slate-500 mb-6">Authorities have been notified immediately.</p>
              
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-slate-500">Reference:</span>
                  <span className="text-sm font-bold font-mono text-slate-900">{submittedReport.reportId || submittedReport.sosId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-slate-500">Status:</span>
                  <span className="text-sm font-bold text-amber-600">Pending Dispatch</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-slate-500">Location:</span>
                  <span className="text-sm font-bold text-slate-900 text-right max-w-[200px] truncate">
                    {submittedReport.location}
                  </span>
                </div>
              </div>

              <button 
                onClick={handleReset}
                className="w-full bg-slate-900 text-white font-bold py-3 px-4 rounded-xl hover:bg-slate-800 transition-colors"
              >
                Close & Return
              </button>
            </div>
          ) : !selectedCategory ? (
            <>
              <p className="text-slate-600 text-sm mb-6 text-center">
                Select the type of emergency you are experiencing. Help will be dispatched immediately.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all cursor-pointer bg-white ${cat.border} ${cat.hover}`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${cat.bg}`}>
                        <Icon className={`w-6 h-6 ${cat.color}`} />
                      </div>
                      <span className="font-bold text-slate-800 text-sm text-center">{cat.title}</span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                {CATEGORIES.find(c => c.id === selectedCategory) && (() => {
                  const cat = CATEGORIES.find(c => c.id === selectedCategory)!;
                  const Icon = cat.icon;
                  return (
                    <>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cat.bg}`}>
                        <Icon className={`w-5 h-5 ${cat.color}`} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Selected Category</p>
                        <p className="font-bold text-slate-900">{cat.title}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedCategory(null)}
                        className="ml-auto text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Change
                      </button>
                    </>
                  );
                })()}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  What happened? <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, 200))}
                  placeholder="Provide quick details (e.g. 3rd floor, fire in kitchen)"
                  className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={2}
                />
                <p className="text-right text-xs text-slate-400 mt-1">{note.length}/200</p>
              </div>

              {locationStatus === "denied" && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                  <label className="block text-sm font-bold text-red-800 mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Location Required
                  </label>
                  <p className="text-xs text-red-600 mb-3">GPS access was denied. Please type your location manually.</p>
                  <input
                    type="text"
                    value={manualLocation}
                    onChange={(e) => setManualLocation(e.target.value)}
                    placeholder="E.g. Main Street near Central Park"
                    className="w-full border border-red-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  />
                </div>
              )}

              <button
                onClick={handleDispatch}
                disabled={isSubmitting || (locationStatus === "denied" && !manualLocation.trim())}
                className="w-full flex items-center justify-center bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 active:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    DISPATCH NOW
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
