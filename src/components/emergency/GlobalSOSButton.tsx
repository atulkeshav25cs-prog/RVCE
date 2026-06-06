"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import SOSCategoryModal from "./SOSCategoryModal";
import EmergencyAccessModal from "./EmergencyAccessModal";

interface GlobalSOSButtonProps {
  isLoggedIn?: boolean;
  isStandalone?: boolean;
}

export default function GlobalSOSButton({ isLoggedIn = false, isStandalone = true }: GlobalSOSButtonProps) {
  const [isSOSOpen, setIsSOSOpen] = useState(false);

  const handleClick = () => {
    setIsSOSOpen(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`${isStandalone ? "fixed bottom-6 right-6 z-50" : "relative pointer-events-auto"} flex items-center justify-center w-16 h-16 bg-red-600 text-white rounded-full shadow-2xl hover:bg-red-700 hover:scale-105 active:scale-95 transition-all animate-pulse shadow-red-500/50 border-4 border-white dark:border-slate-900`}
        aria-label="Trigger SOS"
      >
        <AlertTriangle className="w-8 h-8" />
      </button>

      <SOSCategoryModal isOpen={isSOSOpen} onClose={() => setIsSOSOpen(false)} isGuest={!isLoggedIn} />
    </>
  );
}
