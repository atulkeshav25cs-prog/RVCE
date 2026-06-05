import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Citizen from "@/models/Citizen";
import { Radio } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import CitizenAlertsBanner from "@/components/dashboard/CitizenAlertsBanner";

export default async function CitizenAlertsPage() {
  const session = await getSession();
  if (!session || session.role !== "citizen") redirect("/citizen/login");

  await dbConnect();
  const user = await Citizen.findById(session.id);
  if (!user) redirect("/citizen/login");

  return (
    <DashboardLayout role="citizen" userName={user.fullName}>
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center">
          <Radio className="w-6 h-6 text-indigo-600 mr-2" />
          Active Emergency Alerts
        </h1>
        <p className="text-slate-500 mt-1">Stay informed with real-time broadcasts from National Emergency Authorities.</p>
      </div>

      <CitizenAlertsBanner />
    </DashboardLayout>
  );
}
