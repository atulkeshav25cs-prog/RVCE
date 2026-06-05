import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import EmergencyReport from "@/models/EmergencyReport";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "citizen") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    
    // Ensure Citizen can only view their own reports
    const reports = await EmergencyReport.find({ citizenId: session.id }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, reports }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Citizen Reports Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
