import { Activity, Radio, AlertTriangle, ShieldCheck } from "lucide-react";

const activities = [
  { id: 1, type: "alert", text: "New critical alert: Multi-vehicle collision on I-95", time: "2 min ago", icon: AlertTriangle, color: "text-rose-500" },
  { id: 2, type: "dispatch", text: "Medical Unit 4 dispatched to Sector 7", time: "5 min ago", icon: Activity, color: "text-blue-500" },
  { id: 3, type: "comms", text: "Incoming transmission from Field Command Alpha", time: "12 min ago", icon: Radio, color: "text-amber-500" },
  { id: 4, type: "system", text: "Resource reallocation successful across all sectors", time: "28 min ago", icon: ShieldCheck, color: "text-emerald-500" },
];

export default function ActivityFeed() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-6">
      <h2 className="text-lg font-bold text-slate-200 mb-4 border-b border-slate-800 pb-2">Live Activity Feed</h2>
      <div className="space-y-4">
        {activities.map((act) => (
          <div key={act.id} className="flex items-start gap-3">
            <div className={`mt-1 bg-slate-800 p-1.5 rounded-full border border-slate-700 ${act.color}`}>
              <act.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-300">{act.text}</p>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{act.time}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 py-2 border border-slate-800 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors uppercase tracking-wider">
        View Full Logs
      </button>
    </div>
  );
}
