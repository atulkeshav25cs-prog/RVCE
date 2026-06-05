import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Authority from "@/models/Authority";
import { Settings, Shield } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default async function AuthoritySettingsPage() {
  const session = await getSession();
  if (!session || session.role !== "authority") redirect("/authority/login");

  await dbConnect();
  const user = await Authority.findById(session.id).lean() as any;

  return (
    <DashboardLayout role="authority" userName={user?.fullName} department={user?.department}>
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center">
          <Settings className="w-6 h-6 text-indigo-600 mr-2" />
          Authority Settings
        </h1>
        <p className="text-slate-500 mt-1">Manage your professional credentials and department configurations.</p>
      </div>

      <div className="max-w-2xl bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center mb-6 border-b border-slate-100 pb-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mr-4">
            <Shield className="w-8 h-8 text-slate-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user?.fullName}</h2>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{user?.department}</p>
          </div>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
            <input type="text" disabled defaultValue={user?.fullName} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
            <input type="email" disabled defaultValue={user?.email} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Department</label>
            <input type="text" disabled defaultValue={user?.department} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Clearance Level</label>
            <input type="text" disabled defaultValue={user?.clearanceLevel} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Badge Number</label>
            <input type="text" disabled defaultValue={user?.badgeNumber} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed" />
          </div>
          <div className="pt-4 border-t border-slate-100">
            <button type="button" disabled className="bg-slate-300 text-slate-500 px-6 py-2 rounded-lg font-bold cursor-not-allowed">Save Changes</button>
            <p className="text-xs text-slate-400 mt-2">Authority profiles are synchronized with the central dispatch directory and cannot be edited locally.</p>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
