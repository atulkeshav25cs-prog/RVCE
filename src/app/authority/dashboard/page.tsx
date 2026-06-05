import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Authority from "@/models/Authority";
import { ShieldAlert } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AuthorityIncidentManager from "@/components/dashboard/AuthorityIncidentManager";
import ResourceStatusWidget from "@/components/dashboard/ResourceStatusWidget";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import IncidentMap from "@/components/dashboard/IncidentMap";
import WeatherWidget from "@/components/dashboard/WeatherWidget";

import EmergencyReport from "@/models/EmergencyReport";

export default async function AuthorityDashboard() {
  const session = await getSession();
  if (!session || session.role !== "authority") {
    redirect("/authority/login");
  }

  await dbConnect();
  const user = await Authority.findById(session.id);
  const reports = await EmergencyReport.find({}).sort({ createdAt: -1 }).lean();

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
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center border border-emerald-200">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2"></span>
            System Nominal
          </span>
          <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
            Initiate Dispatch
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Central Command Feed (8 Columns) */}
        <div className="lg:col-span-8 space-y-6 flex flex-col">
          {/* Main Incident Command Table */}
          <div className="flex-1">
            <AuthorityIncidentManager initialReports={JSON.parse(JSON.stringify(reports))} />
          </div>

          {/* Active Incident Map */}
          <IncidentMap />
        </div>

        {/* Right Sidebar: Operations & Resources (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          <WeatherWidget weather={mockAuthorityData.weatherConditions} />

          {/* Resource & Fleet Command */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Resource Deployment</h2>
              <button className="text-slate-500 hover:text-slate-900 text-xs font-bold transition-colors">Manage</button>
            </div>
            <div className="space-y-4">
              <ResourceStatusWidget label="Ambulance Units" total={mockAuthorityData.resourceAvailability.ambulances.total} available={mockAuthorityData.resourceAvailability.ambulances.available} deployed={mockAuthorityData.resourceAvailability.ambulances.deployed} colorClass="text-blue-600" />
              <ResourceStatusWidget label="Fire Engines" total={mockAuthorityData.resourceAvailability.fireTrucks.total} available={mockAuthorityData.resourceAvailability.fireTrucks.available} deployed={mockAuthorityData.resourceAvailability.fireTrucks.deployed} colorClass="text-red-600" />
              <ResourceStatusWidget label="Police Patrols" total={mockAuthorityData.resourceAvailability.policeUnits.total} available={mockAuthorityData.resourceAvailability.policeUnits.available} deployed={mockAuthorityData.resourceAvailability.policeUnits.deployed} colorClass="text-amber-600" />
              <ResourceStatusWidget label="Search & Rescue" total={mockAuthorityData.resourceAvailability.rescueTeams.total} available={mockAuthorityData.resourceAvailability.rescueTeams.available} deployed={mockAuthorityData.resourceAvailability.rescueTeams.deployed} colorClass="text-emerald-600" />
            </div>
          </div>

          <ActivityFeed activities={[]} /> {/* We pass empty array for now, waiting for actual incidents */}
        </div>

      </div>
    </DashboardLayout>
  );
}
