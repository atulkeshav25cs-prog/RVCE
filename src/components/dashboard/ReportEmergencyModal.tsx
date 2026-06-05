"use client";

import { useState, useEffect } from "react";
import { X, AlertOctagon, MapPin } from "lucide-react";

interface ReportEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (reportId: string) => void;
  prefilledType?: string;
  prefilledSeverity?: string;
}

export default function ReportEmergencyModal({ isOpen, onClose, onSuccess, prefilledType, prefilledSeverity }: ReportEmergencyModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (isOpen && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log("Geolocation error:", err.message),
        { timeout: 10000, maximumAge: 60000 }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      emergencyCategory: formData.get("emergencyCategory"),
      emergencyType: formData.get("emergencyType"),
      title: formData.get("title"),
      description: formData.get("description"),
      location: formData.get("location"),
      severity: formData.get("severity"),
      contactPhone: formData.get("contactPhone"),
      latitude: coords?.lat,
      longitude: coords?.lng,
    };

    try {
      const res = await fetch("/api/reports/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create report");

      onSuccess(data.report.reportId);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center text-red-600">
            <AlertOctagon className="w-6 h-6 mr-2" />
            <h2 className="text-lg font-bold">Report Emergency</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-semibold border border-red-200">{error}</div>}
          
          <form id="emergency-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Emergency Category</label>
                <select name="emergencyCategory" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium">
                  <option value="Medical">Medical</option>
                  <option value="Fire">Fire</option>
                  <option value="Rescue">Rescue</option>
                  <option value="Crime">Crime</option>
                  <option value="Disaster">Natural Disaster</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Emergency Type</label>
                <input name="emergencyType" defaultValue={prefilledType} required type="text" placeholder="e.g., Structural Collapse" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Severity</label>
                <select name="severity" defaultValue={prefilledSeverity || "High"} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium">
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Contact Phone</label>
                <input name="contactPhone" type="tel" placeholder="Your Phone Number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Incident Title</label>
              <input name="title" required type="text" placeholder="Brief summary of the incident" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex justify-between">
                Exact Location
                {coords && <span className="text-emerald-600 flex items-center text-[10px]"><MapPin className="w-3 h-3 mr-0.5" /> GPS Captured</span>}
              </label>
              <input name="location" required type="text" placeholder="Address or specific landmark" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Detailed Description</label>
              <textarea name="description" required rows={4} placeholder="Provide all necessary details for responders..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium resize-none"></textarea>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors">
            Cancel
          </button>
          <button form="emergency-form" disabled={loading} type="submit" className="px-6 py-2.5 rounded-lg text-sm font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors disabled:opacity-50">
            {loading ? "Submitting..." : "Submit Emergency Report"}
          </button>
        </div>

      </div>
    </div>
  );
}
