import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Authority from "@/models/Authority";
import dbConnect from "@/lib/mongoose";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AuthorityProcedureManager from "@/components/dashboard/AuthorityProcedureManager";

export default async function AuthorityProceduresPage() {
  const session = await getSession();
  if (!session || session.role !== "authority") {
    redirect("/authority/login");
  }

  await dbConnect();
  const user = await Authority.findById(session.id);

  return (
    <DashboardLayout 
      role="authority" 
      userName={user?.fullName} 
      department={user?.department}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Procedure Directory Management</h1>
          <p className="text-slate-500 mt-1">Manage public government procedures and standard operating protocols.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm min-h-[600px] overflow-hidden">
        <AuthorityProcedureManager />
      </div>
    </DashboardLayout>
  );
}
