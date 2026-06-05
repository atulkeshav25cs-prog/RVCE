interface Report {
  id: string;
  type: string;
  status: "Pending" | "Dispatched" | "Resolved";
  priority: "High" | "Medium" | "Low" | "Critical";
  time: string;
}

const mockReports: Report[] = [
  { id: "INC-9012", type: "Medical Assist", status: "Pending", priority: "Critical", time: "10:42 AM" },
  { id: "INC-9011", type: "Fire Incident", status: "Dispatched", priority: "High", time: "10:35 AM" },
  { id: "INC-9010", type: "Flood / Rescue", status: "Resolved", priority: "Medium", time: "09:15 AM" },
  { id: "INC-9009", type: "Traffic Collision", status: "Dispatched", priority: "High", time: "08:50 AM" },
];

export default function RecentReportsTable() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "Dispatched": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "Resolved": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      default: return "text-slate-400 bg-slate-800 border-slate-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "text-rose-500";
      case "High": return "text-orange-500";
      case "Medium": return "text-amber-500";
      case "Low": return "text-blue-500";
      default: return "text-slate-400";
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <div className="px-6 py-4 border-b border-slate-800">
        <h2 className="text-lg font-bold text-slate-200">Recent Reports</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-800/50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th className="px-6 py-3">Incident ID</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Priority</th>
              <th className="px-6 py-3 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {mockReports.map((report) => (
              <tr key={report.id} className="hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4 font-mono font-medium text-slate-300">{report.id}</td>
                <td className="px-6 py-4 text-white font-medium">{report.type}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </td>
                <td className={`px-6 py-4 font-bold ${getPriorityColor(report.priority)}`}>{report.priority}</td>
                <td className="px-6 py-4 text-right">{report.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
