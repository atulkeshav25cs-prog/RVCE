import Link from "next/link";
import { AlertTriangle, Clock, MapPin, Radio } from "lucide-react";
import dbConnect from "@/lib/mongoose";
import Alert from "@/models/Alert";

export const dynamic = "force-dynamic";

export default async function PublicAlertsPage() {
  await dbConnect();
  
  // Only fetch active alerts for the public
  const alerts = await Alert.find({ status: "Active" }).sort({ createdAt: -1 }).lean();

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-amber-500 selection:text-white pb-20">
      
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Radio className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white tracking-tight text-lg">National Emergency Authority</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-slate-900 pt-16 pb-24 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-500/10 to-transparent"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center justify-center px-3 py-1 mb-6 text-xs font-bold tracking-widest text-amber-300 uppercase bg-amber-500/10 border border-amber-500/20 rounded-full">
            Active Broadcast System
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
            Active <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Emergency Alerts</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mx-auto leading-relaxed">
            Real-time critical warnings and regional advisories broadcasted by National Emergency Authorities.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-6">
        {alerts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-emerald-200 p-12 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Radio className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No Active Alerts</h3>
            <p className="text-slate-600">The nationwide alert system is currently standing by. There are no active regional or national emergency broadcasts.</p>
          </div>
        ) : (
          alerts.map((alert: any) => {
            let color = "bg-blue-500";
            if (alert.severity === "Critical") color = "bg-red-600";
            if (alert.severity === "High") color = "bg-orange-500";
            if (alert.severity === "Medium") color = "bg-amber-500";
            
            return (
              <div key={alert._id.toString()} className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden flex flex-col md:flex-row">
                <div className={`w-2 md:w-4 shrink-0 ${color}`}></div>
                <div className="p-6 md:p-8 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      {alert.severity} Priority
                    </span>
                    <span className="text-xs font-bold text-slate-400 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(alert.createdAt).toLocaleString()}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 mb-3">{alert.title}</h3>
                  <p className="text-slate-700 text-lg mb-6 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {alert.message}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm font-bold text-slate-600 uppercase tracking-wider">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-slate-400" />
                      {alert.targetAudience}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
