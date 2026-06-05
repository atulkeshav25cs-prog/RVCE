import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Authority from "@/models/Authority";
import { Radio } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AuthorityAlertsManager from "@/components/dashboard/AuthorityAlertsManager";

export default async function AuthorityAlertsPage() {
  const session = await getSession();
  if (!session || session.role !== "authority") redirect("/authority/login");

  await dbConnect();
  const user = await Authority.findById(session.id);

  return (
    <DashboardLayout role="authority" userName={user?.fullName} department={user?.department}>
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center">
          <Radio className="w-6 h-6 text-indigo-600 mr-2" />
          Emergency Alert Broadcast System
        </h1>
        <p className="text-slate-500 mt-1">Create and manage nationwide and regional civilian alerts.</p>
      </div>

      <div className="max-w-4xl">
        <AuthorityAlertsManager />
      </div>
    </DashboardLayout>
  );
}
