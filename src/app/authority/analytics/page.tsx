import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Authority from "@/models/Authority";
import { BarChart3 } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AnalyticsOverview from "@/components/dashboard/AnalyticsOverview";
import IncidentAnalytics from "@/components/dashboard/IncidentAnalytics";
import ResourceAnalytics from "@/components/dashboard/ResourceAnalytics";
import TimelineAnalytics from "@/components/dashboard/TimelineAnalytics";

export default async function AuthorityAnalyticsPage() {
  const session = await getSession();
  if (!session || session.role !== "authority") redirect("/authority/login");

  await dbConnect();
  const user = await Authority.findById(session.id);

  return (
    <DashboardLayout role="authority" userName={user?.fullName} department={user?.department}>
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center">
          <BarChart3 className="w-6 h-6 text-indigo-600 mr-2" />
          Command Intelligence & Analytics
        </h1>
        <p className="text-slate-500 mt-1">Deep operational insights and performance metrics.</p>
      </div>

      <div className="space-y-6">
        <AnalyticsOverview />
        <IncidentAnalytics />
        <ResourceAnalytics />
        <TimelineAnalytics />
      </div>
    </DashboardLayout>
  );
}
