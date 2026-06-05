import Link from "next/link";
import { Database, ArrowLeft } from "lucide-react";

export default function RecordNotFound() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center justify-center p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-slate-200 text-center max-w-lg w-full">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Database className="w-8 h-8 text-slate-400" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Record Not Found</h1>
        <p className="text-slate-600 mb-8 leading-relaxed">
          The public record you are looking for does not exist, has been removed, or the ID is invalid.
        </p>
        <Link 
          href="/public-records" 
          className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-indigo-500/20"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Return to Public Archive
        </Link>
      </div>
    </div>
  );
}
