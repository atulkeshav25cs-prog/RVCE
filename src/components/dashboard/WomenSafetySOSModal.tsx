"use client";

import { useState } from "react";
import { ShieldAlert, X, MapPin, Loader2, CheckCircle2 } from "lucide-react";

interface WomenSafetySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (reportId: string) => void;
}

export default function WomenSafetySOSModal({ isOpen, onClose, onSuccess }: WomenSafetySOSModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/women-safety/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location,
          description
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to trigger SOS");

      onSuccess(data.report.reportId);
      onClose();
      setLocation("");
      setDescription("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border-2 border-red-500 animate-in zoom-in-95 duration-200">
        
        <div className="bg-red-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center text-white">
            <ShieldAlert className="w-5 h-5 mr-2" />
            <h2 className="text-lg font-bold uppercase tracking-wide">Women Safety SOS</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-red-50 text-red-700 text-xs font-semibold p-3 rounded-lg border border-red-100 flex items-start">
            <ShieldAlert className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
            <p>Your Trusted Contacts will be automatically notified and attached to this critical priority SOS if configured.</p>
          </div>

          {error && (
            <div className="bg-red-900/10 border border-red-500/50 text-red-600 px-4 py-3 rounded-lg text-sm text-center font-bold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Current Location <span className="text-red-500">*</span></label>
            <div className="relative">
              <input 
                required 
                type="text" 
                placeholder="e.g. Near Central Metro Station" 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-colors"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Emergency Description</label>
            <textarea 
              placeholder="Brief details (Optional)..." 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-colors h-24 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider py-4 rounded-xl text-sm shadow-lg shadow-red-500/30 transition-all hover:shadow-red-500/50 active:scale-[0.98] flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Trigger Immediate SOS"}
          </button>
        </form>
      </div>
    </div>
  );
}
