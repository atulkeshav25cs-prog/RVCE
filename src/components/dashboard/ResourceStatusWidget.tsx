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
    <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <span className="font-bold text-slate-700 text-sm">{label}</span>
        <span className={`text-xs font-bold px-2 py-1 rounded-md bg-slate-50 border border-slate-100 ${colorClass}`}>
          {percentage}% Ready
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 mb-3 overflow-hidden">
        <div 
          className={`h-2 rounded-full ${colorClass.replace("text-", "bg-")}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs font-medium">
        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{available} Available</span>
        <span className="text-slate-500 bg-slate-50 px-2 py-0.5 rounded">{deployed} Deployed</span>
      </div>
    </div>
  );
}
