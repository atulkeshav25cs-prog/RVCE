"use client";
import { Search, Bell, User } from "lucide-react";
import { useState, useEffect } from "react";

export default function TopHeader({ userName, department }: { userName?: string; department?: string }) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('en-US', { 
        weekday: 'short', month: 'short', day: 'numeric', 
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-10">
      
      {/* Left side: Search */}
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search incidents, reports, resources..." 
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
          />
        </div>
      </div>

      {/* Right side: Time, Notifs, Profile */}
      <div className="ml-4 flex items-center space-x-6">
        <div className="hidden md:block text-sm text-slate-500 font-mono">
          {currentTime || "Loading time..."}
        </div>
        
        <button className="relative p-1 rounded-full text-slate-400 hover:text-slate-500 focus:outline-none">
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          <Bell className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-3 border-l border-slate-200 pl-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium text-slate-900">{userName || "Authorized User"}</span>
            <span className="text-xs text-slate-500">{department || "Citizen Portal"}</span>
          </div>
          <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center border border-slate-300 text-slate-600">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
