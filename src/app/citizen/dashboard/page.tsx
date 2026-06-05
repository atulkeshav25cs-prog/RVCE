import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Citizen from "@/models/Citizen";
import { AlertOctagon, Flame, HeartPulse, Droplets, ShieldAlert } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SafetyStatusBanner from "@/components/dashboard/SafetyStatusBanner";
import EmergencyActionCard from "@/components/dashboard/EmergencyActionCard";
import AdvisoryNotice from "@/components/dashboard/AdvisoryNotice";
import ProfileCard from "@/components/dashboard/ProfileCard";
import RecentReportsTable from "@/components/dashboard/RecentReportsTable";

import { mockCitizenData } from "@/lib/mockData";

export default async function CitizenDashboard() {
  const session = await getSession();
  if (!session || session.role !== "citizen") {
    redirect("/citizen/login");
  }

  await dbConnect();
  const user = await Citizen.findById(session.id);
  
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
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-3">
              Emergency Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <EmergencyActionCard 
                  title="SOS Alert" 
                  description="Instantly broadcast your location to all nearby emergency responders."
                  icon={AlertOctagon}
                  colorClass="text-red-600"
                  bgHoverClass="hover:bg-red-50"
                />
              </div>
              <EmergencyActionCard 
                title="Medical Emergency" 
                description="Request an ambulance or medical assistance."
                icon={HeartPulse}
                colorClass="text-blue-600"
                bgHoverClass="hover:bg-blue-50"
              />
              <EmergencyActionCard 
                title="Fire Emergency" 
                description="Report a fire and request fire department."
                icon={Flame}
                colorClass="text-orange-600"
                bgHoverClass="hover:bg-orange-50"
              />
              <EmergencyActionCard 
                title="Flood / Rescue" 
                description="Request water rescue or report severe flooding."
                icon={Droplets}
                colorClass="text-cyan-600"
                bgHoverClass="hover:bg-cyan-50"
              />
              <EmergencyActionCard 
                title="Women Safety" 
                description="Trigger priority police dispatch for women in distress."
                icon={ShieldAlert}
                colorClass="text-purple-600"
                bgHoverClass="hover:bg-purple-50"
              />
            </div>
          </div>

          <RecentReportsTable reports={mockCitizenData.reportHistory as any} />
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
