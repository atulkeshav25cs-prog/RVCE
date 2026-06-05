import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Resource from "@/models/Resource";
import EmergencyReport from "@/models/EmergencyReport";

export async function GET(req: Request, { params }: { params: { reportId: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { reportId } = params;

    await dbConnect();

    // Verify access rights
    if (session.role === "citizen") {
      const report = await EmergencyReport.findOne({ reportId });
      if (!report || report.citizenId.toString() !== session.id) {
        return NextResponse.json({ error: "Unauthorized access to this report" }, { status: 403 });
      }
    }

    const resources = await Resource.find({ assignedReportId: reportId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, resources }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Report Resources Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
