import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Citizen from "@/models/Citizen";
import { AlertOctagon, Flame, HeartPulse, Droplets, ShieldAlert } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SafetyStatusBanner from "@/components/dashboard/SafetyStatusBanner";
import AdvisoryNotice from "@/components/dashboard/AdvisoryNotice";
import ProfileCard from "@/components/dashboard/ProfileCard";
import CitizenDashboardClient from "@/components/dashboard/CitizenDashboardClient";
import EmergencyReport from "@/models/EmergencyReport";
import Resource from "@/models/Resource";

import { mockCitizenData } from "@/lib/mockData";

export default async function CitizenDashboard() {
  const session = await getSession();
  if (!session || session.role !== "citizen") {
    redirect("/citizen/login");
  }

  await dbConnect();
  const user = await Citizen.findById(session.id);
  const reports = await EmergencyReport.find({ citizenId: session.id }).sort({ createdAt: -1 }).lean();
  const reportIds = reports.map(r => r.reportId);
  const resources = await Resource.find({ assignedReportId: { $in: reportIds } }).lean();

  const enrichedReports = reports.map(report => {
    const assignedResource = resources.find(r => r.assignedReportId === report.reportId);
    return {
      ...report,
      assignedResource: assignedResource ? {
        resourceId: assignedResource.resourceId,
        resourceType: assignedResource.resourceType,
        estimatedArrivalMinutes: assignedResource.estimatedArrivalMinutes
      } : null
    };
  });
  
  return (
    <DashboardLayout 
      role="citizen" 
      userName={user?.fullName} 
      department="Citizen Portal"
    >
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Welcome back, {user?.fullName?.split(' ')[0] || 'Citizen'}
        </h1>
        <p className="text-slate-500 mt-1">
          National Emergency Authority - Citizen Safety Portal
        </p>
      </div>

      <SafetyStatusBanner />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Main Content (Left 8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          <CitizenDashboardClient initialReports={enrichedReports.map(r => ({
            id: r.reportId,
            type: r.emergencyType,
            status: r.status,
            priority: r.severity,
            time: new Date(r.createdAt).toLocaleString(),
            assignedResource: r.assignedResource
          }))} />
        </div>

        {/* Sidebar (Right 4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          <ProfileCard profile={user} />
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-3">
              Local Advisories
            </h2>
            <div className="space-y-4">
              {mockCitizenData.advisories.map(adv => (
                <AdvisoryNotice key={adv.id} advisory={adv} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
