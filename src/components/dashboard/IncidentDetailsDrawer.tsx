"use client";

import { X, MapPin, User, AlertTriangle, CheckCircle, Clock, Truck } from "lucide-react";
import { useState, useEffect } from "react";

interface IncidentDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  report: any;
  onUpdateStatus: (reportId: string, status: string, notes: string) => void;
}

export default function IncidentDetailsDrawer({ isOpen, onClose, report, onUpdateStatus }: IncidentDetailsDrawerProps) {
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState(report?.status || "");
  const [updating, setUpdating] = useState(false);
  
  // Resources State
  const [assignedResources, setAssignedResources] = useState<any[]>([]);
  const [availableResources, setAvailableResources] = useState<any[]>([]);
  const [selectedResourceId, setSelectedResourceId] = useState("");
  const [eta, setEta] = useState("");
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (report) {
      setStatus(report.status);
      fetchResources();
    }
  }, [report]);

  const fetchResources = async () => {
    try {
      // Fetch all resources
      const res = await fetch("/api/resources");
      const data = await res.json();
      if (data.success) {
        setAvailableResources(data.resources.filter((r: any) => r.status === "Available"));
        // Find assigned resources locally for speed, or we can use the specific endpoint
        const assigned = data.resources.filter((r: any) => r.assignedReportId === report?.reportId);
        setAssignedResources(assigned);
      }
    } catch (err) {
      console.error("Failed to fetch resources", err);
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    await onUpdateStatus(report.reportId, status, notes);
    setUpdating(false);
  };

  const handleAssignResource = async () => {
    if (!selectedResourceId || !eta) return;
    setAssigning(true);
    try {
      const res = await fetch("/api/resources/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: report.reportId,
          resourceId: selectedResourceId,
          estimatedArrivalMinutes: parseInt(eta)
        })
      });
      const data = await res.json();
      if (data.success) {
        // Refresh local resources
        fetchResources();
        setSelectedResourceId("");
        setEta("");
        // Automatically sync incident status to Acknowledged in the parent UI if needed
        if (report.status === "Pending") {
          onUpdateStatus(report.reportId, "Acknowledged", "Resource Assigned");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAssigning(false);
    }
  };

  const handleResourceStatusUpdate = async (resourceId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/resources/update-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId, status: newStatus })
      });
      if (res.ok) {
        fetchResources();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-[100] w-full max-w-md bg-white shadow-2xl border-l border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Incident Details</h2>
          <p className="text-xs font-mono text-slate-500 mt-1">{report.reportId}</p>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-slate-100 text-slate-700">{report.emergencyType}</span>
            <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${report.severity === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'}`}>{report.severity} Priority</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">{report.title}</h3>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{report.description}</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
          <div className="flex items-start">
            <MapPin className="w-4 h-4 text-slate-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Location</p>
              <p className="text-sm font-medium text-slate-900">{report.location}</p>
            </div>
          </div>
          <div className="flex items-start">
            <User className="w-4 h-4 text-slate-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Reporter</p>
              <p className="text-sm font-medium text-slate-900">{report.citizenName}</p>
              <p className="text-xs text-slate-500">{report.contactPhone || report.citizenEmail}</p>
            </div>
          </div>
        </div>

        {/* RESOURCE DISPATCH MODULE */}
        <div className="border-t border-slate-100 pt-6">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center">
            <Truck className="w-4 h-4 mr-2 text-slate-500" />
            Assigned Resources
          </h4>
          
          {assignedResources.length > 0 ? (
            <div className="space-y-3 mb-6">
              {assignedResources.map(res => (
                <div key={res.resourceId} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{res.resourceId}</p>
                      <p className="text-xs text-slate-500">{res.resourceType}</p>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700 uppercase">
                      {res.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-600 font-medium">
                    <p>ETA: {res.estimatedArrivalMinutes} min</p>
                    <select 
                      value={res.status}
                      onChange={(e) => handleResourceStatusUpdate(res.resourceId, e.target.value)}
                      className="bg-transparent border-none text-blue-600 font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="Assigned">Assigned</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Busy">Busy</option>
                      <option value="Available">Release (Available)</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic mb-6">No resources assigned yet.</p>
          )}

          {/* Assign New Resource Panel */}
          {report.status !== "Resolved" && (
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <label className="block text-xs font-semibold text-slate-600 mb-2">Dispatch New Resource</label>
              <div className="space-y-3">
                <select 
                  value={selectedResourceId}
                  onChange={(e) => setSelectedResourceId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select Available Resource --</option>
                  {availableResources.map(r => (
                    <option key={r.resourceId} value={r.resourceId}>{r.resourceId} - {r.resourceType}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="ETA (mins)" 
                    value={eta}
                    onChange={(e) => setEta(e.target.value)}
                    className="w-24 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    onClick={handleAssignResource}
                    disabled={!selectedResourceId || !eta || assigning}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                  >
                    {assigning ? "Assigning..." : "Assign Resource"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Command Actions</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Update Status</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending Review</option>
                <option value="Acknowledged">Acknowledged</option>
                <option value="Dispatched">Unit Dispatched</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Resolution / Operational Notes</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Log dispatch units or resolution details..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-slate-100 bg-slate-50">
        <button 
          onClick={handleUpdate}
          disabled={updating || (status === report.status && !notes)}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-sm shadow-sm transition-colors disabled:opacity-50"
        >
          {updating ? "Updating..." : "Confirm Action"}
        </button>
      </div>
    </div>
  );
}
