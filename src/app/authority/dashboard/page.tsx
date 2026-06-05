import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Authority from "@/models/Authority";
import { ShieldAlert, AlertTriangle, Activity, Users, CarFront } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import RecentReportsTable from "@/components/dashboard/RecentReportsTable";
import ResourceStatusWidget from "@/components/dashboard/ResourceStatusWidget";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import IncidentMap from "@/components/dashboard/IncidentMap";
import WeatherWidget from "@/components/dashboard/WeatherWidget";

import { mockAuthorityData } from "@/lib/mockData";

export default async function AuthorityDashboard() {
  const session = await getSession();
  if (!session || session.role !== "authority") {
    redirect("/authority/login");
  }

  await dbConnect();
  const user = await Authority.findById(session.id);
  
  return (
    <DashboardLayout 
      role="authority" 
      userName={user?.fullName} 
      department={user?.department}
    >
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center">
            <ShieldAlert className="w-6 h-6 text-blue-600 mr-2" />
            Emergency Operations Center
          </h1>
          <p className="text-slate-500 mt-1">
            National Disaster Management System
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2"></span>
            System Nominal
          </span>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (70%) */}
        <div className="lg:col-span-8 space-y-6">
          {/* KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Active Emergencies" value={mockAuthorityData.kpis.activeEmergencies} icon={AlertTriangle} trend="12% from yesterday" trendUp={false} colorClass="text-red-600" />
            <StatCard title="Response Teams" value={mockAuthorityData.kpis.responseTeamsDeployed} icon={Users} trend="All units operational" trendUp={true} colorClass="text-blue-600" />
            <StatCard title="Critical Alerts" value={mockAuthorityData.kpis.criticalAlerts} icon={ShieldAlert} trend="Needs Attention" trendUp={false} colorClass="text-amber-600" />
            <StatCard title="Avg Response" value={mockAuthorityData.kpis.avgResponseTime} icon={Activity} trend="2m faster" trendUp={true} colorClass="text-emerald-600" />
          </div>

          {/* Incident Map */}
          <IncidentMap />

          {/* Activity Feed */}
          <ActivityFeed activities={[]} /> {/* Empty for now, wait I should use mock data or keep it generic */}
        </div>

        {/* Right Column (30%) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Weather Widget */}
          <WeatherWidget weather={mockAuthorityData.weatherConditions} />

          {/* Resource Availability */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Fleet & Resources</h2>
              <button className="text-blue-600 hover:text-blue-700 text-xs font-bold">Manage</button>
            </div>
            <div className="space-y-4">
              <ResourceStatusWidget label="Ambulance Units" total={mockAuthorityData.resourceAvailability.ambulances.total} available={mockAuthorityData.resourceAvailability.ambulances.available} deployed={mockAuthorityData.resourceAvailability.ambulances.deployed} colorClass="text-blue-600" />
              <ResourceStatusWidget label="Fire Engines" total={mockAuthorityData.resourceAvailability.fireTrucks.total} available={mockAuthorityData.resourceAvailability.fireTrucks.available} deployed={mockAuthorityData.resourceAvailability.fireTrucks.deployed} colorClass="text-red-600" />
              <ResourceStatusWidget label="Police Patrols" total={mockAuthorityData.resourceAvailability.policeUnits.total} available={mockAuthorityData.resourceAvailability.policeUnits.available} deployed={mockAuthorityData.resourceAvailability.policeUnits.deployed} colorClass="text-amber-600" />
              <ResourceStatusWidget label="Search & Rescue" total={mockAuthorityData.resourceAvailability.rescueTeams.total} available={mockAuthorityData.resourceAvailability.rescueTeams.available} deployed={mockAuthorityData.resourceAvailability.rescueTeams.deployed} colorClass="text-emerald-600" />
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Row */}
      <RecentReportsTable reports={[]} /> 
    </DashboardLayout>
  );
}
