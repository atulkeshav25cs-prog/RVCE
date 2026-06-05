import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import { AlertTriangle, Activity, Flame, Droplets, ShieldAlert, Clock, User, Phone, Droplet, Calendar } from "lucide-react";

export default async function CitizenDashboard() {
  const session = await getSession();
  if (!session || session.role !== "citizen") {
    redirect("/citizen/login");
  }

  // Fetch full user details
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(session.id) as any;

  return (
    <div className="min-h-screen pt-[120px] pb-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-blue-500" />
              Citizen Command Center
            </h1>
            <p className="text-slate-400 mt-2">National Emergency Authority &bull; Authorized Access</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-sm font-medium text-slate-300">
            System Status: <span className="text-emerald-500 animate-pulse">Monitoring</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="space-y-8 lg:col-span-1">
            
            {/* Profile Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
                <User className="w-5 h-5 text-slate-400" />
                <h2 className="text-lg font-bold text-slate-200">Identity Profile</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-white font-medium text-lg">{user?.full_name || "Unknown"}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Phone className="w-3 h-3"/> Phone</p>
                    <p className="text-slate-300">{user?.phone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> Age</p>
                    <p className="text-slate-300">{user?.age || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Droplet className="w-3 h-3"/> Blood</p>
                    <p className="text-rose-400 font-bold">{user?.blood_group || "Unknown"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Gender</p>
                    <p className="text-slate-300 capitalize">{user?.gender || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Alerts */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              <div className="bg-rose-950/30 px-6 py-4 border-b border-rose-900/50 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <h2 className="text-lg font-bold text-rose-200">Active Advisories</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-slate-800/50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                  <h3 className="text-amber-500 font-bold text-sm">Severe Weather Warning</h3>
                  <p className="text-slate-400 text-xs mt-1">High winds and heavy rain expected in your sector over the next 24 hours.</p>
                </div>
                <div className="text-center">
                  <button className="text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider">View All Broadcasts &rarr;</button>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-8 lg:col-span-2">
            
            {/* Quick Actions */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-800">
                <h2 className="text-lg font-bold text-slate-200">Emergency Dispatch (Quick Actions)</h2>
                <p className="text-xs text-slate-500 mt-1">Select the nature of your emergency to immediately alert authorities.</p>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button className="flex flex-col items-center justify-center gap-3 bg-rose-950/40 border border-rose-900/50 hover:bg-rose-900/40 p-6 rounded-xl transition-colors group">
                  <Activity className="w-10 h-10 text-rose-500 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-rose-200 text-sm">Medical Assist</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-3 bg-orange-950/40 border border-orange-900/50 hover:bg-orange-900/40 p-6 rounded-xl transition-colors group">
                  <Flame className="w-10 h-10 text-orange-500 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-orange-200 text-sm">Fire Incident</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-3 bg-cyan-950/40 border border-cyan-900/50 hover:bg-cyan-900/40 p-6 rounded-xl transition-colors group">
                  <Droplets className="w-10 h-10 text-cyan-500 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-cyan-200 text-sm">Flood / Rescue</span>
                </button>
              </div>
              <div className="bg-slate-950 px-6 py-4 text-center border-t border-slate-800">
                <button className="text-sm font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-6 py-2 rounded-lg transition-colors">
                  Submit Detailed Report
                </button>
              </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
                <Clock className="w-5 h-5 text-slate-400" />
                <h2 className="text-lg font-bold text-slate-200">Incident History</h2>
              </div>
              <div className="p-6">
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <Clock className="w-12 h-12 mb-3 opacity-20" />
                  <p className="text-sm font-medium">No recent reports found.</p>
                  <p className="text-xs mt-1 opacity-70">Your emergency submissions will appear here.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
