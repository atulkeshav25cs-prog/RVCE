"use client";
import { useEffect } from "react";
import { syncUserRole } from "@/actions/auth";

export default function AuthorityOnboarding() {
  useEffect(() => {
    syncUserRole("authority").catch(console.error);
  }, []);
  return (
    <section className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-6">
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/50 p-12 rounded-3xl text-center max-w-md w-full shadow-premium">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Authority Verified</h1>
        <p className="text-slate-500 text-sm font-medium">Your authority profile is active. Awaiting dispatch assignment.</p>
      </div>
    </section>
  );
}
