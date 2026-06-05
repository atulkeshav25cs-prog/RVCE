import { ShieldCheck } from "lucide-react";

export default function SafetyStatusBanner() {
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <div className="bg-emerald-100 p-2 rounded-full mr-4">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-emerald-900 uppercase tracking-wider">Safety Status: Secure</h2>
          <p className="text-sm text-emerald-700 font-medium">You are in a safe zone. No immediate threats detected in your registered location.</p>
        </div>
      </div>
      <button className="hidden sm:block text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-4 py-2 rounded-lg transition-colors uppercase tracking-wider">
        Update Location
      </button>
    </div>
  );
}
