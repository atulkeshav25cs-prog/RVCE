import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import EmergencyReport from "@/models/EmergencyReport";
import WomenSafetyReport from "@/models/WomenSafetyReport";
import PublicRecord from "@/models/PublicRecord";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "authority") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Fetch all published records to filter them out
    const publishedRecords = await PublicRecord.find({}).select("incidentId").lean();
    const publishedIds = publishedRecords.map(r => r.incidentId);

    const standardResolved = await EmergencyReport.find({ status: "Resolved", reportId: { $nin: publishedIds } }).lean();
    const wsResolved = await WomenSafetyReport.find({ status: "Resolved", reportId: { $nin: publishedIds } }).lean();

    const eligible = [...standardResolved, ...wsResolved].sort((a: any, b: any) => 
      new Date(b.resolvedAt || b.updatedAt).getTime() - new Date(a.resolvedAt || a.updatedAt).getTime()
    );

    return NextResponse.json({ success: true, eligible }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Eligible Records Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
