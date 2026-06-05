import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import EmergencyReport from "@/models/EmergencyReport";
import Citizen from "@/models/Citizen";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "citizen") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    const citizen = await Citizen.findById(session.id);
    if (!citizen) {
      return NextResponse.json({ error: "Citizen not found" }, { status: 404 });
    }

    const body = await req.json();
    const { emergencyType, title, description, location, severity, contactPhone, emergencyCategory } = body;

    if (!emergencyType || !title || !description || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate Report ID: REP-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const prefix = `REP-${dateStr}-`;
    
    // Find highest sequence number for today
    const lastReport = await EmergencyReport.findOne({ reportId: { $regex: `^${prefix}` } })
      .sort({ reportId: -1 })
      .select("reportId");

    let sequence = 1;
    if (lastReport) {
      const lastSeq = parseInt(lastReport.reportId.split("-")[2], 10);
      sequence = lastSeq + 1;
    }
    const reportId = `${prefix}${sequence.toString().padStart(4, "0")}`;

    const newReport = await EmergencyReport.create({
      reportId,
      citizenId: citizen._id,
      citizenName: citizen.fullName,
      citizenEmail: citizen.email,
      contactPhone: contactPhone || citizen.phone,
      emergencyCategory: emergencyCategory || "General",
      emergencyType,
      title,
      description,
      location,
      severity: severity || "Medium",
      status: "Pending"
    });

    return NextResponse.json({ success: true, report: newReport }, { status: 201 });
  } catch (error: any) {
    console.error("Report Creation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
