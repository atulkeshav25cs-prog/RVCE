"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

const backgrounds = [
  "/images/hero_emergency_1780594689899.png",
  "/images/mission_response_1780594704142.png",
  "/images/cat_medical_1780594719908.png",
  "/images/cat_fire_1780594733902.png",
  "/images/bg_disaster_1780596711164.png",
  "/images/bg_public_safety_1780596727648.png",
];

export default function BackgroundSystem() {
  const [bgImage, setBgImage] = useState<string>("");
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 2000], ["0%", "15%"]);

  useEffect(() => {
    // Select random background on client load to prevent hydration mismatch
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setBgImage(randomBg);
  }, []);

  if (!bgImage) return <div className="fixed inset-0 bg-slate-900 -z-50" />;

  return (
    <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden bg-slate-950">
      <motion.div style={{ y }} className="absolute inset-0 w-full h-[115%] -top-[10%]">
        <Image
          src={bgImage}
          alt="Emergency Authority Background"
          fill
          priority
          className="object-cover opacity-30"
          sizes="100vw"
        />
        {/* Deep, sophisticated overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-900/90 mix-blend-multiply" />
      </motion.div>
    </div>
  );
}
