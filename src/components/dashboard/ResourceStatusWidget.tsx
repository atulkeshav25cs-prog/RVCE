interface ResourceStatusWidgetProps {
  label: string;
  total: number;
  available: number;
  deployed: number;
  colorClass: string;
}

export default function ResourceStatusWidget({ label, total, available, deployed, colorClass }: ResourceStatusWidgetProps) {
  const percentage = Math.round((available / total) * 100);
  
  return (
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
      <div className="flex justify-between items-center mb-3">
        <span className="font-semibold text-slate-300 text-sm">{label}</span>
        <span className={`text-xs font-bold px-2 py-1 rounded bg-slate-900 border border-slate-800 ${colorClass}`}>
          {percentage}% Ready
        </span>
      </div>
      <div className="w-full bg-slate-900 rounded-full h-2.5 mb-3 border border-slate-800 overflow-hidden">
        <div 
          className={`h-2.5 rounded-full ${colorClass.replace("text-", "bg-")}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs font-medium">
        <span className="text-emerald-400">{available} Available</span>
        <span className="text-slate-500">{deployed} Deployed</span>
      </div>
    </div>
  );
}
