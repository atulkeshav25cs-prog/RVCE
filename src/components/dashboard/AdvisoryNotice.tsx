import { AlertTriangle, Info } from "lucide-react";

interface Advisory {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
}

export default function AdvisoryNotice({ advisory }: { advisory: Advisory }) {
  const isWarning = advisory.type === "WARNING";
  const colorClass = isWarning ? "text-amber-700 bg-amber-50 border-amber-200" : "text-blue-700 bg-blue-50 border-blue-200";
  const iconColor = isWarning ? "text-amber-600" : "text-blue-600";
  const Icon = isWarning ? AlertTriangle : Info;

  return (
    <div className={`border rounded-xl p-5 shadow-sm ${colorClass}`}>
      <div className="flex items-start">
        <Icon className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${iconColor}`} />
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-1">{advisory.title}</h3>
          <p className="text-sm font-medium opacity-90 mb-2">{advisory.message}</p>
          <p className="text-xs font-semibold opacity-75">{advisory.time}</p>
        </div>
      </div>
    </div>
  );
}
