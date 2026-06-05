import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";

import EmergencyReport from "@/models/EmergencyReport";
import WomenSafetyReport from "@/models/WomenSafetyReport";
import Alert from "@/models/Alert";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "authority") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Calculate last 7 days
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const timelineMap: Record<string, any> = {};

    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
      timelineMap[dateStr] = { date: dateStr, emergencies: 0, sos: 0, alerts: 0 };
    }

    // Fetch records within the last 7 days
    const ers = await EmergencyReport.find({ createdAt: { $gte: sevenDaysAgo, $lte: today } }).select("createdAt").lean();
    const wss = await WomenSafetyReport.find({ 
      $or: [
        { createdAt: { $gte: sevenDaysAgo, $lte: today } },
        { timestamp: { $gte: sevenDaysAgo, $lte: today } }
      ]
    }).select("createdAt timestamp").lean();
    const alerts = await Alert.find({ createdAt: { $gte: sevenDaysAgo, $lte: today } }).select("createdAt").lean();

    ers.forEach((r: any) => {
      const dateStr = new Date(r.createdAt).toISOString().split("T")[0];
      if (timelineMap[dateStr]) timelineMap[dateStr].emergencies += 1;
    });

    wss.forEach((r: any) => {
      const dateStr = new Date(r.createdAt || r.timestamp).toISOString().split("T")[0];
      if (timelineMap[dateStr]) timelineMap[dateStr].sos += 1;
    });

    alerts.forEach((r: any) => {
      const dateStr = new Date(r.createdAt).toISOString().split("T")[0];
      if (timelineMap[dateStr]) timelineMap[dateStr].alerts += 1;
    });

    const timelineData = Object.values(timelineMap);

    return NextResponse.json({
      success: true,
      data: {
        timelineData
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Analytics Timeline API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
