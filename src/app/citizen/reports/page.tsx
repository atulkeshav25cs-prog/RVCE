import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Citizen from "@/models/Citizen";
import EmergencyReport from "@/models/EmergencyReport";
import WomenSafetyReport from "@/models/WomenSafetyReport";
import { FileText } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import CitizenDashboardClient from "@/components/dashboard/CitizenDashboardClient";

export default async function CitizenReportsPage() {
  const session = await getSession();
  if (!session || session.role !== "citizen") redirect("/citizen/login");

  await dbConnect();
  const user = await Citizen.findById(session.id);
  if (!user) redirect("/citizen/login");

  const ers = await EmergencyReport.find({ citizenId: session.id }).lean();
  const wss = await WomenSafetyReport.find({ citizenId: session.id }).lean();
  const allReports = [...ers, ...wss].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <DashboardLayout role="citizen" userName={user.fullName}>
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center">
          <FileText className="w-6 h-6 text-indigo-600 mr-2" />
          My Emergency Reports
        </h1>
        <p className="text-slate-500 mt-1">Review your active incidents and historical reports.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <CitizenDashboardClient 
          initialReports={allReports.map((r: any) => ({
            id: r.reportId || r._id.toString(),
            type: r.emergencyType,
            status: r.status,
            priority: r.severity || r.priority,
            time: new Date(r.createdAt).toLocaleString(),
            assignedResource: undefined // Can fetch resource if needed
          }))}
        />
      </div>
    </DashboardLayout>
  );
}
