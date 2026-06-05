import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import EmergencyReport from "@/models/EmergencyReport";
import Resource from "@/models/Resource";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "citizen") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    
    // Ensure Citizen can only view their own reports
    const reports = await EmergencyReport.find({ citizenId: session.id }).sort({ createdAt: -1 }).lean();

    const reportIds = reports.map(r => r.reportId);
    const resources = await Resource.find({ assignedReportId: { $in: reportIds } }).lean();

    const enrichedReports = reports.map(report => {
      const assignedResource = resources.find(r => r.assignedReportId === report.reportId);
      return {
        ...report,
        assignedResource: assignedResource ? {
          resourceId: assignedResource.resourceId,
          resourceType: assignedResource.resourceType,
          estimatedArrivalMinutes: assignedResource.estimatedArrivalMinutes
        } : null
      };
    });

    return NextResponse.json({ success: true, reports: enrichedReports }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Citizen Reports Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
