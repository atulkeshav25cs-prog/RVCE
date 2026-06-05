"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import Logo from "./Logo";
import EmergencyAccessModal from "@/components/emergency/EmergencyAccessModal";
import GlobalSOSButton from "@/components/emergency/GlobalSOSButton";

import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const pathname = usePathname() || "";
  const isLandingPage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isSolid = !isLandingPage || scrolled;

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isSolid
          ? "bg-white/85 backdrop-blur-md border-b border-slate-200/50 shadow-glass"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 lg:px-12">
        <div className="flex items-center">
          <Link href="/">
            <Logo light={!isSolid} className="transition-colors duration-300" />
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-12">
          <Link href="/directives" className={`text-[12px] font-bold uppercase tracking-[0.1em] transition-colors ${isSolid ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-white'}`}>
            Directives
          </Link>
          <Link href="/departments" className={`text-[12px] font-bold uppercase tracking-[0.1em] transition-colors ${isSolid ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-white'}`}>
            Departments
          </Link>
          <Link href="/public-records" className={`text-[12px] font-bold uppercase tracking-[0.1em] transition-colors ${isSolid ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-white'}`}>
            Public Records
          </Link>
          <Link href="/authority/login" className={`text-[12px] font-bold uppercase tracking-[0.1em] transition-colors ${isSolid ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-white'}`}>
            Authority Access
          </Link>
        </div>
        
        <div className="flex items-center">
          <button 
            onClick={() => setIsAccessModalOpen(true)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-[11px] uppercase tracking-[0.1em] hover:bg-red-700 transition-all shadow-md flex items-center space-x-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Get Help Now</span>
          </button>
        </div>
      </div>
      
      <EmergencyAccessModal isOpen={isAccessModalOpen} onClose={() => setIsAccessModalOpen(false)} />
      <GlobalSOSButton isLoggedIn={false} />
    </nav>
  );
}
