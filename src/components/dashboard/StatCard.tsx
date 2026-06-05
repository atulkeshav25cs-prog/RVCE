import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  colorClass?: string;
}

export default function StatCard({ title, value, icon: Icon, trend, trendUp, colorClass = "text-blue-600" }: StatCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</h3>
        <div className={`p-2 rounded-lg bg-slate-50 ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <p className="text-3xl font-extrabold text-slate-900">{value}</p>
        {trend && (
          <p className={`text-xs mt-2 font-semibold flex items-center ${trendUp ? "text-emerald-600" : "text-rose-600"}`}>
            {trendUp ? "↑" : "↓"} {trend}
          </p>
        )}
      </div>
    </div>
  );
}
