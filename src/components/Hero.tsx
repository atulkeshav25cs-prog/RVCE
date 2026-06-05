"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShieldAlert, Radio } from "lucide-react";
import EmergencyAccessModal from "@/components/emergency/EmergencyAccessModal";

export default function Hero() {
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);

  return (
    <section className="relative w-full h-screen min-h-[800px] flex flex-col justify-end pb-32 pt-32 px-6 lg:px-12 bg-slate-900 overflow-hidden">
      {/* Restored exact Hero Image overlay structure */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero_emergency_1780594689899.png"
          alt="Emergency Command Center"
          fill
          priority
          className="object-cover opacity-60"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent mix-blend-multiply" />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto flex flex-col items-start">

        
        <h1 className="text-5xl sm:text-7xl lg:text-[7rem] font-bold tracking-tight text-white leading-[1.05] max-w-5xl">
          National Emergency Command
        </h1>
        
        <p className="mt-8 text-xl sm:text-2xl text-white/80 font-medium max-w-2xl leading-[1.6]">
          The centralized authority for immediate crisis response, public safety coordination, and rapid civilian assistance.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button 
              onClick={() => setIsAccessModalOpen(true)}
              className="px-8 py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2"
            >
              <ShieldAlert className="w-5 h-5" />
              <span>Request Immediate Help</span>
            </button>
            <Link 
              href="/alerts"
              className="px-8 py-4 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all flex items-center justify-center space-x-2 backdrop-blur-sm"
            >
              <Radio className="w-5 h-5" />
              <span>View Active Alerts</span>
            </Link>
        </div>
      </div>
      <EmergencyAccessModal isOpen={isAccessModalOpen} onClose={() => setIsAccessModalOpen(false)} />
    </section>
  );
}
