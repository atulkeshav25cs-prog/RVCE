import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Authority from "@/models/Authority";
import { FileText } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AuthorityIncidentManager from "@/components/dashboard/AuthorityIncidentManager";
import LiveIncidentMap from "@/components/dashboard/LiveIncidentMap";

import EmergencyReport from "@/models/EmergencyReport";
import WomenSafetyReport from "@/models/WomenSafetyReport";
import GuestSOS from "@/models/GuestSOS";

export default async function AuthorityReportsPage() {
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
    reportId: r.referenceId, // normalize ID field
    citizenName: "Anonymous Citizen", // normalize citizen name
    severity: "Critical",
    isSOS: true,
    isGuestSOS: true
  }));

  const allReports = [...standardReports, ...wsReports, ...formattedGuestReports];

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

  return (
    <DashboardLayout 
      role="authority" 
      userName={user?.fullName} 
      department={user?.department}
    >
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center">
          <FileText className="w-6 h-6 text-indigo-600 mr-2" />
          Incident Management & Reports
        </h1>
        <p className="text-slate-500 mt-1">
          Detailed view of all active and resolved emergency incidents.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <AuthorityIncidentManager initialReports={allReports.map((r: any) => ({
            reportId: r.reportId,
            citizenId: r.citizenId ? r.citizenId.toString() : "guest",
            citizenName: r.citizenName,
            emergencyType: r.emergencyType,
            severity: r.severity || r.priority,
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
        
        <LiveIncidentMap />
      </div>
    </DashboardLayout>
  );
}
