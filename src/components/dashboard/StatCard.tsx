import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  colorClass?: string;
}

export default function StatCard({ title, value, icon: Icon, trend, trendUp, colorClass = "text-blue-500" }: StatCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{title}</h3>
        <Icon className={`w-5 h-5 ${colorClass}`} />
      </div>
      <div>
        <p className="text-3xl font-extrabold text-white">{value}</p>
        {trend && (
          <p className={`text-xs mt-2 font-medium ${trendUp ? "text-emerald-500" : "text-rose-500"}`}>
            {trendUp ? "↑" : "↓"} {trend}
          </p>
        )}
      </div>
    </div>
  );
}
