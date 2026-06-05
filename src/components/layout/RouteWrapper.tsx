"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundSystem from "@/components/BackgroundSystem";

export default function RouteWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Ensure login/signup pages keep the landing layout
  const isAuthPage = pathname.includes('/login') || pathname.includes('/signup');
  
  // App routes use the DashboardLayout shell, so we hide the landing shell
  const isAppRoute = (pathname.startsWith('/citizen') || pathname.startsWith('/authority')) && !isAuthPage;

  if (isAppRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <BackgroundSystem />
      <Navbar />
      <main className="flex-grow relative z-10">
        {children}
      </main>
      <Footer />
    </>
  );
}
