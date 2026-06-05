import { LucideIcon } from "lucide-react";

export interface ActivityItem {
  id: string;
  type: string;
  text: string;
  time: string;
  icon: LucideIcon;
  color: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col h-full">
      <h2 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3 uppercase tracking-wider">Live Incident Feed</h2>
      <div className="space-y-5 flex-1">
        {activities.map((act, index) => (
          <div key={act.id} className="relative flex items-start gap-4">
            {index !== activities.length - 1 && (
              <div className="absolute left-4 top-8 bottom-[-20px] w-px bg-slate-200"></div>
            )}
            <div className={`relative z-10 flex-shrink-0 bg-white p-2 rounded-full border shadow-sm ${act.color.replace('text-', 'border-').replace('500', '200')} ${act.color}`}>
              <act.icon className="w-4 h-4" />
            </div>
            <div className="pt-1.5">
              <p className="text-sm font-medium text-slate-700">{act.text}</p>
              <p className="text-xs text-slate-500 font-mono mt-1">{act.time}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-6 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors uppercase tracking-wider">
        View Full Logs
      </button>
    </div>
  );
}
