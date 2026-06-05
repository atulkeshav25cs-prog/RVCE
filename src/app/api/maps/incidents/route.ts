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

    // Fetch all active/resolved incidents that have coordinates
    const emergencyIncidents = await EmergencyReport.find({ latitude: { $exists: true }, longitude: { $exists: true } })
      .select("reportId emergencyType title description location latitude longitude severity status createdAt resolutionNotes")
      .lean();

    const wsIncidents = await WomenSafetyReport.find({ latitude: { $exists: true }, longitude: { $exists: true } })
      .select("reportId emergencyType location latitude longitude status priority createdAt")
      .lean();

    // Sanitize WS incidents further for map API transmission
    const sanitizedWS = wsIncidents.map(inc => ({
      ...inc,
      severity: inc.priority || "Critical", // Map priority to severity for unified logic
      isWomenSafety: true
    }));

    return NextResponse.json({ 
      success: true, 
      incidents: [...emergencyIncidents, ...sanitizedWS] 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Map Incidents API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
