import Link from "next/link";
import { Shield, FileText, AlertTriangle, Info } from "lucide-react";

export default function DirectivesPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">National Directives & Preparedness</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Official guidelines and emergency protocols for civilian defense and disaster readiness.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Civilian Defense Protocols</h3>
            <p className="text-slate-600 mb-4 leading-relaxed">Instructions for maintaining personal safety during nationwide critical alerts, including shelter-in-place and evacuation procedures.</p>
            <button className="text-blue-600 font-bold text-sm uppercase tracking-wider hover:text-blue-800 transition-colors">Download PDF</button>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Natural Disaster Readiness</h3>
            <p className="text-slate-600 mb-4 leading-relaxed">Preparedness checklists for floods, earthquakes, and severe weather. Ensure you have a 72-hour survival kit assembled.</p>
            <button className="text-amber-600 font-bold text-sm uppercase tracking-wider hover:text-amber-800 transition-colors">View Checklist</button>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Federal Relief Funds</h3>
            <p className="text-slate-600 mb-4 leading-relaxed">Guidelines on applying for emergency financial assistance following a declared federal disaster or localized emergency.</p>
            <button className="text-indigo-600 font-bold text-sm uppercase tracking-wider hover:text-indigo-800 transition-colors">Read Guidelines</button>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">First Aid & Triage</h3>
            <p className="text-slate-600 mb-4 leading-relaxed">Basic civilian triage and first aid instructions to stabilize injuries before professional emergency services arrive.</p>
            <button className="text-emerald-600 font-bold text-sm uppercase tracking-wider hover:text-emerald-800 transition-colors">View Manual</button>
          </div>

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
