import { X, AlertOctagon, ShieldAlert, MapPin, Clock, CheckCircle } from "lucide-react";

interface IncidentMapDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  incident: any;
}

export default function IncidentMapDrawer({ isOpen, onClose, incident }: IncidentMapDrawerProps) {
  if (!isOpen || !incident) return null;

  const isWS = incident.isWomenSafety;

  return (
    <div className={`fixed inset-y-0 right-0 z-[1000] w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
      
      {/* Header */}
      <div className={`px-6 py-5 border-b flex justify-between items-center ${isWS ? 'bg-pink-50 border-pink-100' : 'bg-slate-50 border-slate-100'}`}>
        <div className="flex items-center">
          {isWS ? <ShieldAlert className="w-5 h-5 mr-2 text-pink-600" /> : <AlertOctagon className="w-5 h-5 mr-2 text-slate-700" />}
          <h2 className={`font-bold ${isWS ? 'text-pink-900' : 'text-slate-800'}`}>Incident Details</h2>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Core Info */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-1 rounded">
              {incident.reportId}
            </span>
            <span className={`text-xs font-bold px-2 py-1 rounded border ${incident.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
              {incident.status}
            </span>
          </div>

          <h3 className="text-2xl font-black text-slate-900 mb-2">
            {incident.title || incident.emergencyType}
          </h3>
          
          <div className="flex items-start text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <MapPin className="w-4 h-4 mr-2 text-indigo-500 shrink-0 mt-0.5" />
            <span className="font-medium">{incident.location}</span>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
            {incident.description}
          </p>
        </div>

        {/* Read-Only Dispatch Note */}
        <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100 text-sm font-medium flex items-start">
          <CheckCircle className="w-5 h-5 mr-3 text-blue-600 shrink-0" />
          <p>This map view is read-only. To dispatch resources or update the status, please use the Incident Command Table in the main dashboard.</p>
        </div>

        {/* Timeline (if populated by API later, placeholder for now) */}
        <div className="border-t border-slate-100 pt-6">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center">
            <Clock className="w-4 h-4 mr-2 text-slate-400" />
            Reported At
          </h4>
          <p className="text-slate-600 font-medium">
            {new Date(incident.createdAt).toLocaleString()}
          </p>
        </div>

      </div>
    </div>
  );
}
