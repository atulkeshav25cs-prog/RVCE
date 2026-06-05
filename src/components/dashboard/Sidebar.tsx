import Link from "next/link";
import { LayoutDashboard, AlertTriangle, Activity, Truck, Bell, FileText, PieChart, Settings, LogOut, ShieldAlert } from "lucide-react";

export default function Sidebar({ role }: { role: string }) {
  const isAuthority = role === "authority";
  const basePath = isAuthority ? "/authority" : "/citizen";

  const navItems = [
    { name: "Dashboard", href: `${basePath}/dashboard`, icon: LayoutDashboard, active: true },
    { name: "Emergency Reports", href: "#", icon: AlertTriangle, active: false },
    ...(isAuthority ? [
      { name: "Incident Management", href: "#", icon: Activity, active: false },
      { name: "Resource Tracking", href: "#", icon: Truck, active: false },
    ] : []),
    { name: "Emergency Alerts", href: "#", icon: Bell, active: false },
    { name: "Public Records", href: "#", icon: FileText, active: false },
    ...(isAuthority ? [
      { name: "Analytics", href: "#", icon: PieChart, active: false },
    ] : []),
    { name: "Settings", href: "#", icon: Settings, active: false },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
        <ShieldAlert className="w-6 h-6 text-blue-500 mr-2" />
        <span className="text-white font-bold tracking-wider">NEA PLATFORM</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  item.active 
                    ? "bg-blue-600/10 text-blue-400" 
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 flex-shrink-0 ${item.active ? "text-blue-500" : "text-slate-500"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <Link 
          href="/api/auth/logout"
          className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-400 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3 text-slate-500" />
          Logout
        </Link>
      </div>
    </div>
  );
}
