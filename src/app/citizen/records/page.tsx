import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Citizen from "@/models/Citizen";
import { Database, ShieldAlert, MapPin, Clock, CheckCircle } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";

async function getRecordsData() {
  const res = await fetch("http://localhost:3000/api/public-records", { cache: "no-store" });
  if (!res.ok) return { records: [], stats: null };
  return res.json();
}

export default async function CitizenRecordsPage() {
  const session = await getSession();
  if (!session || session.role !== "citizen") redirect("/citizen/login");

  await dbConnect();
  const user = await Citizen.findById(session.id);
  if (!user) redirect("/citizen/login");

  const data = await getRecordsData();
  const records = data.records || [];

  return (
    <DashboardLayout role="citizen" userName={user.fullName}>
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center">
          <Database className="w-6 h-6 text-indigo-600 mr-2" />
          Public Incident Archive
        </h1>
        <p className="text-slate-500 mt-1">Review sanitized historical incident data published by authorities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {records.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Database className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700">No Records Found</h3>
            <p className="text-slate-500 mt-1">The public archive is currently empty.</p>
          </div>
        ) : (
          records.map((record: any) => {
            const isWS = record.title === "Women Safety Incident";
            return (
              <div key={record.recordId} className="group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className={`h-2 w-full ${isWS ? 'bg-pink-500' : 'bg-indigo-500'}`}></div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                      {record.recordId}
                    </span>
                    {isWS && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-pink-700 bg-pink-50 px-2 py-1 rounded border border-pink-200 flex items-center">
                        <ShieldAlert className="w-3 h-3 mr-1" />
                        Women Safety
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{record.title}</h3>
                  <p className="text-sm text-slate-600 mb-6 line-clamp-2 flex-1">{record.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm font-medium text-slate-600">
                      <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                      <span className="truncate">{record.location}</span>
                    </div>
                    <div className="flex items-center text-sm font-medium text-slate-600">
                      <Clock className="w-4 h-4 mr-2 text-slate-400" />
                      Resolved: {new Date(record.resolvedAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                      <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                      {record.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}
