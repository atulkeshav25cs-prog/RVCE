import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import EmergencyReport from "@/models/EmergencyReport";
import Authority from "@/models/Authority";

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "authority") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const { reportId, status, resolutionNotes } = body;

    if (!reportId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();
    
    const authority = await Authority.findById(session.id);
    if (!authority) {
      return NextResponse.json({ error: "Authority not found" }, { status: 404 });
    }

    const updateData: any = {
      status,
      assignedAuthority: authority._id,
      assignedAuthorityName: authority.fullName
    };

    if (resolutionNotes) {
      updateData.resolutionNotes = resolutionNotes;
    }
    
    if (status === "Resolved") {
      updateData.resolvedAt = new Date();
    }

    const updatedReport = await EmergencyReport.findOneAndUpdate(
      { reportId },
      { $set: updateData },
      { new: true }
    );

    if (!updatedReport) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, report: updatedReport }, { status: 200 });
  } catch (error: any) {
    console.error("Update Report Status Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
