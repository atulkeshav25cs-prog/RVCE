import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import GuestSOS from "@/models/GuestSOS";

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "authority") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { reportId, status, resolutionNotes } = body;

    if (!reportId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const report = await GuestSOS.findOne({ referenceId: reportId });
    if (!report) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

    report.status = status;
    if (resolutionNotes) {
      report.resolutionNotes = resolutionNotes;
    }

    report.timeline.push({
      status,
      timestamp: new Date(),
      notes: resolutionNotes || `Status updated to ${status}`,
      updatedBy: session.name || "Authority"
    });

    await report.save();

    return NextResponse.json({ success: true, report }, { status: 200 });
  } catch (error: any) {
    console.error("Guest SOS Update Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
