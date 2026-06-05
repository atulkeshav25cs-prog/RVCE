"use client";

import { useEffect, useState } from "react";
import { Loader2, Users, Shield, FileText, AlertTriangle, Clock, Activity, CheckCircle, Database } from "lucide-react";

export default function AnalyticsOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/overview")
      .then(res => res.json())
      .then(d => {
        if (d.success) setData(d.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-xl border border-slate-200">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const { demoMetrics, resourceMetrics, timeMetrics } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard icon={Users} label="Total Citizens" value={demoMetrics.totalCitizens} color="text-blue-600" bg="bg-blue-50" />
        <MetricCard icon={Shield} label="Total Authorities" value={demoMetrics.totalAuthorities} color="text-indigo-600" bg="bg-indigo-50" />
        <MetricCard icon={Database} label="Public Archives" value={demoMetrics.totalPublicRecords} color="text-slate-600" bg="bg-slate-100" />
        <MetricCard icon={AlertTriangle} label="Total Broadcasts" value={demoMetrics.totalAlerts} color="text-amber-600" bg="bg-amber-50" />
        <MetricCard icon={FileText} label="Emergency Reports" value={demoMetrics.totalERs} color="text-orange-600" bg="bg-orange-50" />
        <MetricCard icon={Activity} label="Women Safety SOS" value={demoMetrics.totalWSs} color="text-pink-600" bg="bg-pink-50" />
        
        <div className="col-span-2 md:col-span-1 bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-center">
          <div className="flex items-center text-emerald-600 mb-2">
            <Clock className="w-5 h-5 mr-2" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg Resolution Time</h3>
          </div>
          <div className="text-2xl font-black text-slate-800">{timeMetrics.avgResolutionTimeER}</div>
          <p className="text-[10px] text-slate-400 mt-1 uppercase">General Emergencies</p>
        </div>

        <div className="col-span-2 md:col-span-1 bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Resource Efficiency</h3>
            <CheckCircle className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="flex items-end gap-2">
            <div className="text-2xl font-black text-slate-800">{resourceMetrics.resourceUtilization}%</div>
            <div className="text-xs text-slate-500 font-medium pb-1">Utilization</div>
          </div>
          <div className="w-full bg-slate-100 h-2 mt-2 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${resourceMetrics.resourceUtilization}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, color, bg }: any) {
  return (
    <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center">
      <div className={`p-3 rounded-lg ${bg} ${color} mr-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
}
