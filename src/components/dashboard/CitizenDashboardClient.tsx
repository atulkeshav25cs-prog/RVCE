"use client";

import { useState } from "react";
import { AlertOctagon, HeartPulse, Flame, Droplets, ShieldAlert, CheckCircle2 } from "lucide-react";
import EmergencyActionCard from "./EmergencyActionCard";
import RecentReportsTable from "./RecentReportsTable";
import ReportEmergencyModal from "./ReportEmergencyModal";
import { Report } from "./RecentReportsTable";

export default function CitizenDashboardClient({ initialReports }: { initialReports: Report[] }) {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prefilledType, setPrefilledType] = useState("");
  const [prefilledSeverity, setPrefilledSeverity] = useState("High");
  const [successId, setSuccessId] = useState<string | null>(null);

  const openModal = (type: string, severity: string) => {
    setPrefilledType(type);
    setPrefilledSeverity(severity);
    setIsModalOpen(true);
  };

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/reports/citizen");
      const data = await res.json();
      if (data.success) {
        const mappedReports = data.reports.map((r: any) => ({
          id: r.reportId || r._id?.toString(),
          type: r.emergencyType,
          status: r.status,
          priority: r.severity,
          time: new Date(r.createdAt).toLocaleString(),
          assignedResource: r.assignedResource
        }));
        setReports(mappedReports);
      }
    } catch (err) {
      console.error("Failed to fetch reports", err);
    }
  };

  const handleSuccess = (reportId: string) => {
    setSuccessId(reportId);
    fetchReports(); // auto-refresh history
    setTimeout(() => setSuccessId(null), 5000); // hide after 5s
  };

  return (
    <>
      {successId && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-emerald-50 border border-emerald-200 p-4 rounded-xl shadow-lg flex items-start w-full max-w-md animate-in slide-in-from-top-4 fade-in duration-300">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider mb-1">Emergency Report Submitted</h3>
            <p className="text-xs font-semibold text-emerald-700">Reference ID: <span className="font-mono">{successId}</span></p>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-3">
          Emergency Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <EmergencyActionCard 
              title="SOS Alert" 
              description="Instantly broadcast your location to all nearby emergency responders."
              icon={AlertOctagon}
              colorClass="text-red-600"
              bgHoverClass="hover:bg-red-50"
              onClick={() => openModal("SOS Alert", "Critical")}
            />
          </div>
          <EmergencyActionCard 
            title="Medical Emergency" 
            description="Request an ambulance or medical assistance."
            icon={HeartPulse}
            colorClass="text-blue-600"
            bgHoverClass="hover:bg-blue-50"
            onClick={() => openModal("Medical Emergency", "Critical")}
          />
          <EmergencyActionCard 
            title="Fire Emergency" 
            description="Report a fire and request fire department."
            icon={Flame}
            colorClass="text-orange-600"
            bgHoverClass="hover:bg-orange-50"
            onClick={() => openModal("Fire Emergency", "Critical")}
          />
          <EmergencyActionCard 
            title="Flood / Rescue" 
            description="Request water rescue or report severe flooding."
            icon={Droplets}
            colorClass="text-cyan-600"
            bgHoverClass="hover:bg-cyan-50"
            onClick={() => openModal("Flood / Rescue", "High")}
          />
          <EmergencyActionCard 
            title="Women Safety" 
            description="Trigger priority police dispatch for women in distress."
            icon={ShieldAlert}
            colorClass="text-purple-600"
            bgHoverClass="hover:bg-purple-50"
            onClick={() => openModal("Women Safety Incident", "Critical")}
          />
        </div>
      </div>

      <RecentReportsTable reports={reports} />

      <ReportEmergencyModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        prefilledType={prefilledType}
        prefilledSeverity={prefilledSeverity}
      />
    </>
  );
}
