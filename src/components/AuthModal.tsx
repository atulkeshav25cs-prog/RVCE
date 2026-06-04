"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative z-10 w-full max-w-lg bg-white/95 backdrop-blur-sm border border-slate-200/50 shadow-2xl p-10 mx-4 animate-in fade-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="mb-10 text-center">
          <span className="inline-block px-3 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.15em] mb-6">
            Civilian Portal
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4 leading-tight">
            Select Access Level
          </h2>
          <p className="text-slate-600 font-medium text-sm max-w-sm mx-auto leading-relaxed">
            Please choose your required entry point. This system is monitored by federal authorities.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link 
            href="/citizen/login"
            onClick={onClose}
            className="flex flex-col items-center justify-center w-full py-6 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-slate-100 transition-all group"
          >
            <span className="text-slate-900 font-bold uppercase tracking-[0.1em] text-[13px] mb-1">
              Returning Citizen
            </span>
            <span className="text-slate-500 font-medium text-[11px] uppercase tracking-wider group-hover:text-slate-700 transition-colors">
              Access Existing Profile
            </span>
          </Link>

          <Link 
            href="/citizen/signup"
            onClick={onClose}
            className="flex flex-col items-center justify-center w-full py-6 bg-slate-900 border border-slate-900 hover:bg-slate-800 transition-all group shadow-md"
          >
            <span className="text-white font-bold uppercase tracking-[0.1em] text-[13px] mb-1">
              New Registration
            </span>
            <span className="text-white/60 font-medium text-[11px] uppercase tracking-wider group-hover:text-white/80 transition-colors">
              Create Civilian Profile
            </span>
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-200/50 text-center">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
            Secure 256-bit Encrypted Connection
          </p>
        </div>
      </div>
    </div>
  );
}
