import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Authority from "@/models/Authority";
import { Database } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AuthorityRecordsManager from "@/components/dashboard/AuthorityRecordsManager";

export default async function AuthorityRecordsPage() {
  const session = await getSession();
  if (!session || session.role !== "authority") redirect("/authority/login");

  await dbConnect();
  const user = await Authority.findById(session.id);

  return (
    <DashboardLayout role="authority" userName={user?.fullName} department={user?.department}>
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center">
          <Database className="w-6 h-6 text-indigo-600 mr-2" />
          Public Records Manager
        </h1>
        <p className="text-slate-500 mt-1">Publish sanitized incident reports to the civilian archive.</p>
      </div>

      <div className="max-w-4xl">
        <AuthorityRecordsManager />
      </div>
    </DashboardLayout>
  );
}
