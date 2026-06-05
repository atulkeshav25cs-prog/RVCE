import { LucideIcon } from "lucide-react";

interface EmergencyActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  bgHoverClass: string;
  onClick?: () => void;
}

export default function EmergencyActionCard({ title, description, icon: Icon, colorClass, bgHoverClass, onClick }: EmergencyActionCardProps) {
  return (
    <button 
      onClick={onClick}
      className={`bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-left flex flex-col items-start transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${bgHoverClass} group w-full`}
    >
      <div className={`p-3 rounded-xl mb-4 transition-colors ${colorClass.replace("text-", "bg-").replace("600", "50")}`}>
        <Icon className={`w-8 h-8 ${colorClass}`} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-slate-900">{title}</h3>
      <p className="text-sm font-medium text-slate-500 group-hover:text-slate-600">{description}</p>
    </button>
  );
}
