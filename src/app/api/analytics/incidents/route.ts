import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";

import EmergencyReport from "@/models/EmergencyReport";
import WomenSafetyReport from "@/models/WomenSafetyReport";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "authority") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Grouping ERs
    const erSeverity = await EmergencyReport.aggregate([
      { $group: { _id: "$severity", value: { $sum: 1 } } }
    ]);
    const erStatus = await EmergencyReport.aggregate([
      { $group: { _id: "$status", value: { $sum: 1 } } }
    ]);
    const erType = await EmergencyReport.aggregate([
      { $group: { _id: "$emergencyType", value: { $sum: 1 } } }
    ]);

    // Grouping WS
    const wsStatus = await WomenSafetyReport.aggregate([
      { $group: { _id: "$status", value: { $sum: 1 } } }
    ]);
    const wsCount = await WomenSafetyReport.countDocuments();

    // Map Severity
    const severityMap: Record<string, number> = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    erSeverity.forEach(s => { severityMap[s._id || "Medium"] += s.value; });
    // WS are all considered Critical for Analytics
    severityMap["Critical"] += wsCount;

    const severityData = Object.keys(severityMap).map(k => ({ name: k, value: severityMap[k] }));

    // Map Status
    const statusMap: Record<string, number> = {};
    erStatus.forEach(s => { statusMap[s._id] = (statusMap[s._id] || 0) + s.value; });
    wsStatus.forEach(s => { statusMap[s._id] = (statusMap[s._id] || 0) + s.value; });
    
    const statusData = Object.keys(statusMap).map(k => ({ name: k, value: statusMap[k] }));

    // Map Type
    const typeMap: Record<string, number> = {};
    erType.forEach(s => { typeMap[s._id || "Other"] = (typeMap[s._id || "Other"] || 0) + s.value; });
    if (wsCount > 0) typeMap["Women Safety Incident"] = wsCount;

    const typeData = Object.keys(typeMap).map(k => ({ name: k, value: typeMap[k] })).sort((a,b) => b.value - a.value);

    return NextResponse.json({
      success: true,
      data: {
        severityData,
        statusData,
        typeData
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Analytics Incidents API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
