import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Authority from "@/models/Authority";
import { ShieldAlert, AlertTriangle, Activity, Users, Radio, CarFront } from "lucide-react";

import StatCard from "@/components/dashboard/StatCard";
import RecentReportsTable from "@/components/dashboard/RecentReportsTable";
import ResourceStatusWidget from "@/components/dashboard/ResourceStatusWidget";
import ActivityFeed from "@/components/dashboard/ActivityFeed";

export default async function AuthorityDashboard() {
  const session = await getSession();
  if (!session || session.role !== "authority") {
    redirect("/authority/login");
  }

  await dbConnect();
  const user = await Authority.findById(session.id);
  
  // Current datetime formatting
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen pt-[120px] pb-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Section: Welcome Banner */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-amber-500" />
              Emergency Operations Center
            </h1>
            <p className="text-slate-400 mt-2 text-lg">
              Commander: <span className="text-white font-medium">{user?.fullName || "Authorized Personnel"}</span> &bull; {user?.department || "Central Command"}
            </p>
          </div>
          <div className="flex flex-col items-end text-right">
            <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">{formattedDate}</p>
            <p className="text-2xl font-mono text-emerald-400">{formattedTime} Local</p>
            <div className="mt-2 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-md text-xs font-bold text-rose-400 animate-pulse">
              DEFCON 4 • ELEVATED READINESS
            </div>
          </div>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Active Incidents" value={14} icon={AlertTriangle} trend="2 since last hour" trendUp={false} colorClass="text-amber-500" />
          <StatCard title="Pending Reports" value={8} icon={Radio} trend="All localized" trendUp={true} colorClass="text-blue-500" />
          <StatCard title="Response Teams" value={32} icon={Users} trend="Active in field" trendUp={true} colorClass="text-emerald-500" />
          <StatCard title="Critical Incidents" value={3} icon={Activity} trend="Requires attention" trendUp={false} colorClass="text-rose-500" />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left / Center Column (Map & Reports) */}
          <div className="space-y-8 lg:col-span-2">
            
            {/* Map Placeholder */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl h-96 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('/images/bg_disaster_1780596711164.png')] bg-cover bg-center opacity-20 grayscale"></div>
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"></div>
              
              <div className="relative z-10 text-center space-y-4 p-8 border border-slate-700/50 bg-slate-900/80 backdrop-blur-md rounded-2xl">
                <ShieldAlert className="w-12 h-12 text-slate-500 mx-auto" />
                <h2 className="text-2xl font-bold text-white tracking-tight">Live Incident Map Coming Soon</h2>
                <p className="text-slate-400 text-sm max-w-sm">
                  Geospatial tracking, live unit telemetry, and real-time incident plotting will be deployed in the upcoming geospatial update.
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded border border-amber-500/20 uppercase tracking-widest mt-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  Module Offline
                </div>
              </div>
            </div>

            {/* Recent Reports Table */}
            <RecentReportsTable />

          </div>

          {/* Right Column (Comms & Resources) */}
          <div className="space-y-8 lg:col-span-1">
            
            {/* Resource Status Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-200">Resource Status</h2>
                <CarFront className="w-5 h-5 text-slate-500" />
              </div>
              <div className="p-6 space-y-4">
                <ResourceStatusWidget label="Medical Units" total={40} available={12} deployed={28} colorClass="text-rose-500" />
                <ResourceStatusWidget label="Fire Engines" total={25} available={18} deployed={7} colorClass="text-orange-500" />
                <ResourceStatusWidget label="Rescue Squads" total={15} available={4} deployed={11} colorClass="text-cyan-500" />
                <ResourceStatusWidget label="Police Patrols" total={60} available={45} deployed={15} colorClass="text-blue-500" />
              </div>
            </div>

            {/* Command Center Panel / Activity Feed */}
            <ActivityFeed />

          </div>
        </div>

      </div>
    </div>
  );
}
