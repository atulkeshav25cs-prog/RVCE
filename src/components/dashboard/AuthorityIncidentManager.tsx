"use client";

import { useState, useMemo } from "react";
import IncidentDetailsDrawer from "./IncidentDetailsDrawer";
import { Filter } from "lucide-react";

export default function AuthorityIncidentManager({ initialReports }: { initialReports: any[] }) {
  const [reports, setReports] = useState(initialReports);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [filter, setFilter] = useState("All");

  const filteredReports = useMemo(() => {
    if (filter === "All") return reports;
    if (filter === "Critical") return reports.filter(r => r.severity === "Critical");
    if (filter === "Pending") return reports.filter(r => r.status === "Pending");
    if (filter === "Resolved") return reports.filter(r => r.status === "Resolved");
    return reports;
  }, [reports, filter]);

  const handleUpdateStatus = async (reportId: string, status: string, notes: string) => {
    try {
      const res = await fetch("/api/reports/update-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, status, resolutionNotes: notes })
      });
      const data = await res.json();
      if (data.success) {
        // Refresh local state instantly
        setReports(prev => prev.map(r => r.reportId === reportId ? { ...r, status, resolutionNotes: notes } : r));
        setSelectedReport(data.report);
      }
    } catch (err) {
      console.error("Failed to update status", err);
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
      case "High": return "text-orange-600 bg-orange-50";
      case "Medium": return "text-amber-600 bg-amber-50";
      case "Low": return "text-blue-600 bg-blue-50";
      default: return "text-slate-600 bg-slate-50";
    }
  };

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
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">{report.reportId}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{report.citizenName}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{report.emergencyType}</td>
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
                  <td className="px-6 py-4 text-right font-mono text-xs">{new Date(report.createdAt).toLocaleTimeString()}</td>
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
