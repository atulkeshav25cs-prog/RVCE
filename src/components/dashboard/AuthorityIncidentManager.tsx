"use client";

import { useState, useMemo } from "react";
import IncidentDetailsDrawer from "./IncidentDetailsDrawer";
import { Filter } from "lucide-react";

export default function AuthorityIncidentManager({ initialReports }: { initialReports: any[] }) {
  const [reports, setReports] = useState(initialReports);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [filter, setFilter] = useState("All");

  const filteredReports = useMemo(() => {
    let result = reports;
    if (filter === "Critical") result = reports.filter(r => r.severity === "Critical");
    if (filter === "Pending") result = reports.filter(r => r.status === "Pending");
    if (filter === "Resolved") result = reports.filter(r => r.status === "Resolved");

    return result.sort((a, b) => {
      // 1. Active SOS
      // 2. Active Women Safety
      // 3. Critical Reports
      // 4. High
      // 5. Medium
      // 6. Low
      // 7. Resolved
      const isAResolved = a.status === "Resolved";
      const isBResolved = b.status === "Resolved";
      if (isAResolved !== isBResolved) return isAResolved ? 1 : -1;
      
      const isAWomenSafety = a.reportId.startsWith("WS-");
      const isBWomenSafety = b.reportId.startsWith("WS-");

      const getScore = (r: any, isWS: boolean) => {
        if (r.isSOS) return 60;
        if (isWS) return 50;
        if (r.severity === "Critical") return 40;
        if (r.severity === "High") return 30;
        if (r.severity === "Medium") return 20;
        if (r.severity === "Low") return 10;
        return 0;
      };

      const scoreA = getScore(a, isAWomenSafety);
      const scoreB = getScore(b, isBWomenSafety);

      if (scoreA !== scoreB) return scoreB - scoreA;
      
      // Newest first if tied
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [reports, filter]);

  const handleUpdateStatus = async (reportId: string, status: string, notes: string) => {
    try {
      const isWS = reportId.startsWith("WS-");
      const isGSOS = reportId.startsWith("GSOS-");
      
      let endpoint = "/api/reports/update-status";
      if (isGSOS) endpoint = "/api/guest-sos/update-status";
      else if (isWS) endpoint = "/api/women-safety/update-status";

      const body = isWS 
        ? { reportId, status, notes } 
        : { reportId, status, resolutionNotes: notes };

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      if (data.success) {
        // Refresh local state instantly
        const updatedReport = {
          ...data.report,
          severity: data.report.severity || data.report.priority
        };
        
        setReports(prev => prev.map(r => r.reportId === reportId ? { 
          ...r, 
          status, 
          resolutionNotes: notes,
          timeline: data.report.timeline
        } : r));
        setSelectedReport(updatedReport);
      } else {
        alert("Update failed: " + data.error);
      }
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "text-amber-700 bg-amber-50 border-amber-200";
      case "Acknowledged": return "text-blue-700 bg-blue-50 border-blue-200";
      case "Dispatched": return "text-indigo-700 bg-indigo-50 border-indigo-200";
      case "In Progress": return "text-purple-700 bg-purple-50 border-purple-200";
      case "Resolved": return "text-emerald-700 bg-emerald-50 border-emerald-200";
      default: return "text-slate-600 bg-slate-100 border-slate-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "text-red-600 bg-red-50";
      case "High": return "text-orange-600 bg-orange-50 border-orange-200";
      case "Medium": return "text-amber-600 bg-amber-50 border-amber-200";
      case "Low": return "text-blue-600 bg-blue-50 border-blue-200";
      default: return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  const isWomenSafety = (id: string) => id.startsWith("WS-");

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col flex-1 h-full min-h-[400px]">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Active Incident Queue</h2>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-600 focus:outline-none cursor-pointer"
            >
              <option value="All">All Incidents</option>
              <option value="Critical">Critical Only</option>
              <option value="Pending">Pending Review</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Incident ID</th>
                <th className="px-6 py-3">Citizen</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Severity</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.map((report) => (
                <tr 
                  key={report.reportId} 
                  onClick={() => setSelectedReport(report)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {report.isGuestSOS && (
                          <span className="bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm shadow-amber-500/50">
                            GUEST SOS
                          </span>
                      )}
                      {report.isSOS && !report.isGuestSOS && (
                          <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded animate-pulse shadow-sm shadow-red-500/50">
                            SOS
                          </span>
                      )}
                      {isWomenSafety(report.reportId) && !report.isSOS && (
                          <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" title="Women Safety Incident"></div>
                      )}
                      <span className={`font-mono font-bold ${(report.isSOS || isWomenSafety(report.reportId)) ? 'text-red-700' : 'text-slate-900'}`}>{report.reportId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{report.citizenName}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{report.emergencyType}</p>
                    <p className="text-xs text-slate-500 max-w-xs truncate">{report.description || "No description provided"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${getPriorityColor(report.severity)}`}>
                      {report.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${getStatusColor(report.status)}`}>
                      {report.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-xs" suppressHydrationWarning>{new Date(report.createdAt).toLocaleTimeString()}</td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500 font-medium">
                    No incidents match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <IncidentDetailsDrawer 
        isOpen={!!selectedReport}
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </>
  );
}
