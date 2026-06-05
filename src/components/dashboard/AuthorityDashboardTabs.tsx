"use client";

import { useState } from "react";
import { Command, BarChart3 } from "lucide-react";

interface AuthorityDashboardTabsProps {
  operationsContent: React.ReactNode;
  analyticsContent: React.ReactNode;
}

export default function AuthorityDashboardTabs({ operationsContent, analyticsContent }: AuthorityDashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<"operations" | "analytics">("operations");

  return (
    <div className="flex flex-col space-y-6">
      
      <div className="bg-white border border-slate-200 p-1.5 rounded-xl inline-flex shadow-sm w-fit">
        <button 
          onClick={() => setActiveTab("operations")}
          className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === "operations" 
              ? "bg-slate-900 text-white shadow-md" 
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          }`}
        >
          <Command className="w-4 h-4 mr-2" />
          Command Center
        </button>
        <button 
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === "analytics" 
              ? "bg-slate-900 text-white shadow-md" 
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          }`}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Command Intelligence
        </button>
      </div>

      <div className={activeTab === "operations" ? "block" : "hidden"}>
        {operationsContent}
      </div>
      
      <div className={activeTab === "analytics" ? "block" : "hidden"}>
        {analyticsContent}
      </div>

    </div>
  );
}
