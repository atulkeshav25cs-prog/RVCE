import Link from "next/link";
import { Building2, Stethoscope, Flame, ShieldAlert, BadgeInfo } from "lucide-react";

export default function DepartmentsPage() {
  const departments = [
    {
      name: "National Disaster Response Force (NDRF)",
      icon: ShieldAlert,
      color: "text-blue-600",
      bg: "bg-blue-100",
      description: "Primary federal agency responsible for disaster response, emergency coordination, and large-scale evacuations."
    },
    {
      name: "Emergency Medical Services (EMS)",
      icon: Stethoscope,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      description: "Provides critical pre-hospital care, ambulance dispatch, and immediate medical triage across all zones."
    },
    {
      name: "Fire & Rescue Department",
      icon: Flame,
      color: "text-orange-600",
      bg: "bg-orange-100",
      description: "Handles structural fires, hazardous material containment, and complex urban search and rescue operations."
    },
    {
      name: "Law Enforcement & Security",
      icon: Building2,
      color: "text-slate-600",
      bg: "bg-slate-200",
      description: "Ensures civilian safety, manages crowd control, and secures perimeter zones during active emergency situations."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Authority Departments</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Discover the specialized divisions that power our integrated emergency response network.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {departments.map((dept, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start">
              <div className={`w-16 h-16 shrink-0 ${dept.bg} ${dept.color} rounded-2xl flex items-center justify-center`}>
                <dept.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{dept.name}</h3>
                <p className="text-slate-600 leading-relaxed mb-4">{dept.description}</p>
                <div className="flex items-center text-sm font-bold text-slate-400 uppercase tracking-wider">
                  <BadgeInfo className="w-4 h-4 mr-2" /> Active 24/7
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-8 border-t border-slate-200">
          <Link href="/" className="inline-flex items-center text-slate-500 hover:text-slate-900 font-bold transition-colors">
            ← Return to Homepage
          </Link>
        </div>

      </div>
    </div>
  );
}
