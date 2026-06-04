"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./Logo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/85 backdrop-blur-md border-b border-slate-200/50 shadow-glass"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 lg:px-12">
        <div className="flex items-center">
          <Link href="/">
            <Logo light={!scrolled} className="transition-colors duration-300" />
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-12">
          <Link href="#" className={`text-[12px] font-bold uppercase tracking-[0.1em] transition-colors ${scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-white'}`}>
            Directives
          </Link>
          <Link href="#" className={`text-[12px] font-bold uppercase tracking-[0.1em] transition-colors ${scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-white'}`}>
            Departments
          </Link>
          <Link href="#" className={`text-[12px] font-bold uppercase tracking-[0.1em] transition-colors ${scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-white'}`}>
            Public Records
          </Link>
        </div>
        
        <div className="flex items-center">
          <button className={`px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.1em] transition-all duration-300 ${
            scrolled 
              ? 'bg-slate-900/95 backdrop-blur-sm text-white border-none hover:bg-slate-800' 
              : 'bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white hover:text-slate-900'
          }`}>
            Report Incident
          </button>
        </div>
      </div>
    </nav>
  );
}
