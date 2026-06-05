export interface Report {
  id: string;
  type: string;
  status: string;
  priority: string;
  time: string;
  assignedResource?: {
    resourceId: string;
    resourceType: string;
    estimatedArrivalMinutes: number;
  };
}

interface RecentReportsTableProps {
  reports: Report[];
}

export default function RecentReportsTable({ reports }: RecentReportsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "text-amber-700 bg-amber-50 border-amber-200";
      case "in progress":
      case "dispatched": return "text-blue-700 bg-blue-50 border-blue-200";
      case "resolved": 
      case "closed": return "text-emerald-700 bg-emerald-50 border-emerald-200";
      default: return "text-slate-600 bg-slate-100 border-slate-200";
    }
  };

  const getPriorityColor = (priority?: string) => {
    if (!priority) return "text-slate-600 bg-slate-50";
    switch (priority.toLowerCase()) {
      case "critical": return "text-red-600 bg-red-50";
      case "high": return "text-orange-600 bg-orange-50";
      case "medium": return "text-amber-600 bg-amber-50";
      case "low": return "text-blue-600 bg-blue-50";
      default: return "text-slate-600 bg-slate-50";
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Recent Emergency Reports</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Incident ID</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Severity</th>
              <th className="px-6 py-3">Assigned Unit</th>
              <th className="px-6 py-3 text-right">Time Logged</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono font-medium text-slate-900">{report.id}</td>
                <td className="px-6 py-4 font-medium text-slate-700">{report.type}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${getStatusColor(report.status)}`}>
                    {report.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${getPriorityColor(report.priority)}`}>
                    {report.priority ? report.priority.toUpperCase() : "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {report.assignedResource ? (
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800">{report.assignedResource.resourceId}</span>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">{report.assignedResource.resourceType}</span>
                      <span className="text-[10px] font-bold text-blue-600 mt-0.5">ETA: {report.assignedResource.estimatedArrivalMinutes} min</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Pending Assignment</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right font-mono text-xs">{report.time || (report as any).date || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
