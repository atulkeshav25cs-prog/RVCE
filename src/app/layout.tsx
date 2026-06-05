import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundSystem from "@/components/BackgroundSystem";

export const metadata: Metadata = {
  title: "National Emergency Authority",
  description: "The centralized authority for immediate crisis response.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased min-h-screen flex flex-col text-slate-900 bg-transparent">
          <BackgroundSystem />
          <Navbar />
          <main className="flex-grow relative z-10">
            {children}
          </main>
          <Footer />
      </body>
    </html>
  );
}
