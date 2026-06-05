import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Alert from "@/models/Alert";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "citizen") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    const now = new Date();

    // Fetch all active alerts that haven't expired
    // Using native Mongo query to filter out expired ones automatically
    const activeAlerts = await Alert.find({
      status: "Active",
      expiresAt: { $gt: now }
    }).lean();

    // Sort by Severity (Critical -> High -> Medium -> Low), then Newest First
    const severityWeight = (severity: string) => {
      switch (severity) {
        case "Critical": return 4;
        case "High": return 3;
        case "Medium": return 2;
        case "Low": return 1;
        default: return 0;
      }
    };

    activeAlerts.sort((a: any, b: any) => {
      const weightA = severityWeight(a.severity);
      const weightB = severityWeight(b.severity);
      if (weightA !== weightB) {
        return weightB - weightA;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json({ success: true, alerts: activeAlerts }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Citizen Alerts Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
