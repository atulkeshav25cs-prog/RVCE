"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, AlertTriangle, Activity, Truck, Bell, FileText, PieChart, Settings, LogOut, ShieldAlert, BookOpen } from "lucide-react";

export default function Sidebar({ role }: { role: string }) {
  const isAuthority = role === "authority";
  const basePath = isAuthority ? "/authority" : "/citizen";

  const pathname = usePathname() || "";
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error(e);
      window.location.href = "/";
    }
  };

  const authorityNav = [
    { name: "Dashboard", href: "/authority/dashboard", icon: LayoutDashboard },
    { name: "Emergency Reports", href: "/authority/reports", icon: AlertTriangle },
    { name: "Incident Management", href: "/authority/reports", icon: Activity },
    { name: "Resource Tracking", href: "/authority/resources", icon: Truck },
    { name: "Emergency Alerts", href: "/authority/alerts", icon: Bell },
    { name: "Public Records", href: "/authority/records", icon: FileText },
    { name: "Gov Procedures", href: "/authority/procedures", icon: BookOpen },
    { name: "Analytics", href: "/authority/analytics", icon: PieChart },
    { name: "Settings", href: "/authority/settings", icon: Settings },
  ];

  const citizenNav = [
    { name: "Dashboard", href: "/citizen/dashboard", icon: LayoutDashboard },
    { name: "Emergency Reports", href: "/citizen/reports", icon: AlertTriangle },
    { name: "Emergency Alerts", href: "/citizen/alerts", icon: Bell },
    { name: "Public Records", href: "/citizen/records", icon: FileText },
    { name: "Settings", href: "/citizen/settings", icon: Settings },
  ];

  const navItems = isAuthority ? authorityNav : citizenNav;

  return (
    <div className="w-64 bg-[#F8FAFC] text-[#0F172A] flex flex-col h-full border-r border-[#D6DCE5] hidden md:flex shadow-sm z-20 relative">
      <div className="h-20 flex items-center px-5 border-b border-[#D6DCE5] bg-white">
        <div className="bg-[#1E3A5F] p-2 rounded-md mr-3 shadow-sm">
          <ShieldAlert className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-[#0F172A] font-bold text-xs uppercase tracking-widest leading-tight">National Emergency</span>
          <span className="text-[#0F172A] font-bold text-xs uppercase tracking-widest leading-tight">Authority</span>
          <span className="text-slate-500 font-semibold text-[9px] uppercase tracking-wider mt-0.5">Operations Center</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-5">
        <nav className="space-y-1.5 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2.5 text-sm font-semibold rounded-lg transition-all border border-transparent ${
                  isActive
                    ? "bg-[#1E3A5F]/10 text-[#1E3A5F] border-[#1E3A5F]/20 shadow-sm" 
                    : "text-slate-600 hover:bg-[#EEF2F7] hover:text-[#0F172A] hover:border-[#D6DCE5]"
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 flex-shrink-0 ${isActive ? "text-[#1E3A5F]" : "text-slate-400 group-hover:text-slate-600"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-[#D6DCE5] bg-slate-50">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2.5 text-sm font-bold text-slate-600 rounded-lg hover:bg-red-50 hover:text-[#DC2626] transition-colors group border border-transparent hover:border-red-100"
        >
          <LogOut className="w-5 h-5 mr-3 text-slate-400 group-hover:text-[#DC2626] transition-colors" />
          Secure Logout
        </button>
      </div>
    </div>
  );
}
