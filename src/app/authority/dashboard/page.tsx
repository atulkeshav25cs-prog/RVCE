import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Authority from "@/models/Authority";
import { ShieldAlert } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AuthorityIncidentManager from "@/components/dashboard/AuthorityIncidentManager";
import ResourceStatusWidget from "@/components/dashboard/ResourceStatusWidget";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import LiveIncidentMap from "@/components/dashboard/LiveIncidentMap";
import WeatherWidget from "@/components/dashboard/WeatherWidget";
import AuthorityAlertsManager from "@/components/dashboard/AuthorityAlertsManager";
import AuthorityRecordsManager from "@/components/dashboard/AuthorityRecordsManager";
import AuthorityDashboardTabs from "@/components/dashboard/AuthorityDashboardTabs";
import AnalyticsOverview from "@/components/dashboard/AnalyticsOverview";
import IncidentAnalytics from "@/components/dashboard/IncidentAnalytics";
import ResourceAnalytics from "@/components/dashboard/ResourceAnalytics";
import TimelineAnalytics from "@/components/dashboard/TimelineAnalytics";

import EmergencyReport from "@/models/EmergencyReport";
import WomenSafetyReport from "@/models/WomenSafetyReport";
import GuestSOS from "@/models/GuestSOS";
import Resource from "@/models/Resource";
import { mockAuthorityData } from "@/lib/mockData";

export default async function AuthorityDashboard() {
  const session = await getSession();
  if (!session || session.role !== "authority") {
    redirect("/authority/login");
  }

  await dbConnect();
  const user = await Authority.findById(session.id);
  
  const standardReports = await EmergencyReport.find({}).lean();
  const wsReports = await WomenSafetyReport.find({}).lean();
  const guestReports = await GuestSOS.find({}).lean();

  const formattedGuestReports = guestReports.map((r: any) => ({
    ...r,
    reportId: r.referenceId,
    citizenName: "Anonymous Citizen",
    severity: "Critical",
    isSOS: true,
    isGuestSOS: true
  }));

  const allReports = [...standardReports, ...wsReports, ...formattedGuestReports];

  // Sorting logic: 1. WS Critical, 2. REP Critical, 3. High, 4. Medium, 5. Low
  const priorityWeight = (r: any) => {
    if (r.reportId.startsWith("WS-")) return 5;
    const severity = r.severity || r.priority;
    if (severity === "Critical") return 4;
    if (severity === "High") return 3;
    if (severity === "Medium") return 2;
    if (severity === "Low") return 1;
    return 0;
  };

  allReports.sort((a, b) => {
    const pA = priorityWeight(a);
    const pB = priorityWeight(b);
    if (pA !== pB) return pB - pA;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const resources = await Resource.find({}).lean();

  const getResourceCount = (status: string) => resources.filter(r => r.status === status).length;

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

      <AuthorityDashboardTabs 
        operationsContent={
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Central Command Feed (8 Columns) */}
            <div className="lg:col-span-8 space-y-6 flex flex-col">
              {/* Main Incident Command Table */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm lg:col-span-12">
                <AuthorityIncidentManager initialReports={allReports.map((r: any) => ({
                  reportId: r.reportId,
                  citizenId: r.citizenId.toString(),
                  citizenName: r.citizenName,
                  emergencyType: r.emergencyType,
                  severity: r.severity || r.priority, // map priority to severity for unified UI
                  status: r.status,
                  createdAt: r.createdAt.toISOString(),
                  location: r.location,
                  description: r.description,
                  contactPhone: r.contactPhone,
                  citizenEmail: r.citizenEmail,
                  trustedContacts: r.trustedContacts,
                  timeline: r.timeline,
                  isSOS: r.isSOS,
                  isGuestSOS: r.isGuestSOS
                }))} />
              </div>

              {/* Active Incident Map */}
              <LiveIncidentMap />
            </div>

            {/* Right Sidebar: Operations & Resources (4 Columns) */}
            <div className="lg:col-span-4 space-y-6">
              
              <WeatherWidget weather={mockAuthorityData.weatherConditions} />
              
              <AuthorityAlertsManager />

              <AuthorityRecordsManager />

              {/* Resource Inventory Summary */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Resource Utilization Summary</h2>
                  <button className="text-slate-500 hover:text-slate-900 text-xs font-bold transition-colors">Manage All</button>
                </div>
                <div className="space-y-4">
                  <ResourceStatusWidget label="Available" total={resources.length} available={getResourceCount("Available")} deployed={0} colorClass="text-emerald-600" />
                  <ResourceStatusWidget label="Assigned" total={resources.length} available={getResourceCount("Assigned")} deployed={0} colorClass="text-blue-600" />
                  <ResourceStatusWidget label="Dispatched" total={resources.length} available={getResourceCount("Dispatched")} deployed={0} colorClass="text-indigo-600" />
                  <ResourceStatusWidget label="Busy / On Scene" total={resources.length} available={getResourceCount("Busy")} deployed={0} colorClass="text-purple-600" />
                  <ResourceStatusWidget label="Offline" total={resources.length} available={getResourceCount("Offline")} deployed={0} colorClass="text-slate-600" />
                </div>
              </div>

              <ActivityFeed activities={[]} />
            </div>

          </div>
        }
        analyticsContent={
          <div className="space-y-6">
            <AnalyticsOverview />
            <IncidentAnalytics />
            <ResourceAnalytics />
            <TimelineAnalytics />
          </div>
        }
      />

    </DashboardLayout>
  );
}
