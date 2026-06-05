"use client";

import { useState, useEffect } from "react";

const citizenImages = [
  "/images/hero_emergency_1780594689899.png",
  "/images/mission_response_1780594704142.png",
  "/images/cat_medical_1780594719908.png",
  "/images/cat_fire_1780594733902.png",
  "/images/bg_disaster_1780596711164.png",
  "/images/bg_public_safety_1780596727648.png"
];

const authorityImages = [
  "/images/auth/authority/cmd_center_1780616616764.png",
  "/images/auth/authority/ops_room_1780616632173.png",
  "/images/auth/authority/sit_room_1780616644913.png",
  "/images/auth/authority/dispatch_center_1780616656769.png"
];

export default function AuthBackground({ type }: { type: "citizen" | "authority" }) {
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    const images = type === "citizen" ? citizenImages : authorityImages;
    const randomImg = images[Math.floor(Math.random() * images.length)];
    setBgImage(randomImg);
  }, [type]);

  if (!bgImage) return <div className="fixed inset-0 bg-[#0B1120] -z-20" />;

  return (
    <>
      <div
        className="fixed inset-0 -z-20"
        style={{ 
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          imageRendering: "auto"
        }}
      />
      <div 
        className="fixed inset-0 -z-10" 
        style={{ backgroundColor: "rgba(2, 6, 23, 0.30)" }} 
      />
    </>
  );
}
