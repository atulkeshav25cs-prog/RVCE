import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";

import Citizen from "@/models/Citizen";
import Authority from "@/models/Authority";
import EmergencyReport from "@/models/EmergencyReport";
import WomenSafetyReport from "@/models/WomenSafetyReport";
import PublicRecord from "@/models/PublicRecord";
import Alert from "@/models/Alert";
import Resource from "@/models/Resource";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "authority") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // 1. Judge-Demo Metrics (Total Counts)
    const [
      totalCitizens,
      totalAuthorities,
      totalERs,
      totalWSs,
      totalPublicRecords,
      totalAlerts,
      totalResources
    ] = await Promise.all([
      Citizen.countDocuments(),
      Authority.countDocuments(),
      EmergencyReport.countDocuments(),
      WomenSafetyReport.countDocuments(),
      PublicRecord.countDocuments(),
      Alert.countDocuments(),
      Resource.countDocuments()
    ]);

    // 2. Resource Utilization %
    const activeResourcesCount = await Resource.countDocuments({
      status: { $in: ["Assigned", "Dispatched", "Busy"] }
    });
    
    let resourceUtilization = 0;
    if (totalResources > 0) {
      resourceUtilization = Math.round((activeResourcesCount / totalResources) * 100);
    }

    // 3. Response / Resolution Times
    // For Emergency Reports
    const resolvedERs = await EmergencyReport.find({ status: "Resolved", resolvedAt: { $exists: true } }).select("createdAt resolvedAt").lean();
    let avgResolutionTimeER = "N/A";
    if (resolvedERs.length > 0) {
      const totalTime = resolvedERs.reduce((acc, r: any) => {
        const diff = new Date(r.resolvedAt).getTime() - new Date(r.createdAt).getTime();
        return acc + diff;
      }, 0);
      const avgMinutes = Math.round((totalTime / resolvedERs.length) / 60000);
      avgResolutionTimeER = avgMinutes > 60 ? `${(avgMinutes/60).toFixed(1)}h` : `${avgMinutes}m`;
    }

    // For Women Safety (WS usually uses timeline to track resolution, but we can do a simplified check)
    // WS doesn't have an explicit `resolvedAt` field historically in this codebase, but we can check timeline array for "Resolved"
    const resolvedWSs = await WomenSafetyReport.find({ status: "Resolved" }).select("createdAt timeline").lean();
    let avgResolutionTimeWS = "N/A";
    if (resolvedWSs.length > 0) {
      const totalTime = resolvedWSs.reduce((acc, r: any) => {
        const resolvedEvent = r.timeline?.find((t: any) => t.status === "Resolved");
        if (resolvedEvent) {
          const diff = new Date(resolvedEvent.timestamp).getTime() - new Date(r.createdAt || r.timestamp).getTime();
          return acc + diff;
        }
        return acc;
      }, 0);
      
      const validWSs = resolvedWSs.filter((r: any) => r.timeline?.some((t:any) => t.status === "Resolved")).length;
      if (validWSs > 0) {
        const avgMinutes = Math.round((totalTime / validWSs) / 60000);
        avgResolutionTimeWS = avgMinutes > 60 ? `${(avgMinutes/60).toFixed(1)}h` : `${avgMinutes}m`;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        demoMetrics: {
          totalCitizens,
          totalAuthorities,
          totalERs,
          totalWSs,
          totalPublicRecords,
          totalAlerts
        },
        resourceMetrics: {
          totalResources,
          activeResources: activeResourcesCount,
          resourceUtilization
        },
        timeMetrics: {
          avgResolutionTimeER,
          avgResolutionTimeWS
        }
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Analytics Overview API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
