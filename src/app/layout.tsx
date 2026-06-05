import type { Metadata } from "next";
import "./globals.css";
import RouteWrapper from "@/components/layout/RouteWrapper";

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
        <RouteWrapper>
          {children}
        </RouteWrapper>
      </body>
    </html>
  );
}
