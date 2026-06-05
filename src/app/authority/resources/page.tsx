import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Authority from "@/models/Authority";
import Resource from "@/models/Resource";
import { Truck } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ResourceStatusWidget from "@/components/dashboard/ResourceStatusWidget";

export default async function AuthorityResourcesPage() {
  const session = await getSession();
  if (!session || session.role !== "authority") redirect("/authority/login");

  await dbConnect();
  const user = await Authority.findById(session.id);
  const resources = await Resource.find({}).lean();
  const getResourceCount = (status: string) => resources.filter(r => r.status === status).length;

  return (
    <DashboardLayout role="authority" userName={user?.fullName} department={user?.department}>
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center">
          <Truck className="w-6 h-6 text-indigo-600 mr-2" />
          Resource Tracking & Deployment
        </h1>
        <p className="text-slate-500 mt-1">Monitor availability and status of field units.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Fleet Status Overview</h2>
          </div>
          <div className="space-y-4">
            <ResourceStatusWidget label="Available" total={resources.length} available={getResourceCount("Available")} deployed={0} colorClass="text-emerald-600" />
            <ResourceStatusWidget label="Assigned" total={resources.length} available={getResourceCount("Assigned")} deployed={0} colorClass="text-blue-600" />
            <ResourceStatusWidget label="Dispatched" total={resources.length} available={getResourceCount("Dispatched")} deployed={0} colorClass="text-indigo-600" />
            <ResourceStatusWidget label="Busy / On Scene" total={resources.length} available={getResourceCount("Busy")} deployed={0} colorClass="text-purple-600" />
            <ResourceStatusWidget label="Offline" total={resources.length} available={getResourceCount("Offline")} deployed={0} colorClass="text-slate-600" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-center">
          <div className="text-center">
            <Truck className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">Advanced Fleet Manager</h3>
            <p className="text-slate-500 mt-2">To manage resources directly, use the Incident Command table to assign units to specific active emergencies.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
