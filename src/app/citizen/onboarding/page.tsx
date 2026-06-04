"use client";
import { useEffect } from "react";
import { syncUserRole } from "@/actions/auth";

export default function CitizenOnboarding() {
  useEffect(() => {
    syncUserRole("citizen").catch(console.error);
  }, []);
  return (
    <section className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-6">
      <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-12 rounded-3xl text-center max-w-md w-full shadow-glass">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-4">Onboarding Complete</h1>
        <p className="text-white/60 text-sm font-medium">Your civilian profile has been successfully created. Welcome to the portal.</p>
      </div>
    </section>
  );
}
