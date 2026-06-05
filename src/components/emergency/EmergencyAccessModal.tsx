"use client";

import { X, ShieldAlert, User, UserPlus } from "lucide-react";
import Link from "next/link";

interface EmergencyAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmergencyAccessModal({ isOpen, onClose }: EmergencyAccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-red-600 p-6 text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Emergency Access Required</h2>
          <p className="text-red-100 text-sm">You must be logged in to dispatch emergency services or trigger an SOS.</p>
        </div>

        <div className="p-6 space-y-4">
          <Link 
            href="/citizen/login"
            className="w-full flex items-center justify-center space-x-3 bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-xl font-bold transition-all"
            onClick={onClose}
          >
            <User className="w-5 h-5 text-slate-300" />
            <span>Citizen Login</span>
          </Link>
          
          <Link 
            href="/citizen/signup"
            className="w-full flex items-center justify-center space-x-3 bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 p-4 rounded-xl font-bold transition-all"
            onClick={onClose}
          >
            <UserPlus className="w-5 h-5 text-slate-500" />
            <span>Create Account</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
