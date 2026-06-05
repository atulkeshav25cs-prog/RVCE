import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";
import GlobalSOSButton from "@/components/emergency/GlobalSOSButton";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "authority" | "citizen";
  userName?: string;
  department?: string;
}

export default function DashboardLayout({ children, role, userName, department }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900 font-sans">
      {/* Sidebar - hidden on mobile, block on md+ */}
      <Sidebar role={role} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopHeader userName={userName} department={department} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {role === "citizen" && <GlobalSOSButton isLoggedIn={true} />}
    </div>
  );
}
