import { X, MapPin, User, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";

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

  if (!isOpen || !report) return null;

  const handleUpdate = async () => {
    setUpdating(true);
    await onUpdateStatus(report.reportId, status, notes);
    setUpdating(false);
  };

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
          <div className="flex items-start">
            <Clock className="w-4 h-4 text-slate-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Time Logged</p>
              <p className="text-sm font-medium text-slate-900">{new Date(report.createdAt).toLocaleString()}</p>
            </div>
          </div>
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
