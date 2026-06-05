import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import EmergencyReport from "@/models/EmergencyReport";
import WomenSafetyReport from "@/models/WomenSafetyReport";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "citizen") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const emergencyIncidents = await EmergencyReport.find({ 
      citizenId: session.id,
      latitude: { $exists: true }, 
      longitude: { $exists: true } 
    }).select("reportId emergencyType title description location latitude longitude severity status createdAt").lean();

    const wsIncidents = await WomenSafetyReport.find({ 
      citizenId: session.id,
      latitude: { $exists: true }, 
      longitude: { $exists: true } 
    }).select("reportId emergencyType description location latitude longitude status priority createdAt").lean();

    const mappedWS = wsIncidents.map(inc => ({
      ...inc,
      title: "Women Safety Incident",
      severity: inc.priority || "Critical",
      isWomenSafety: true
    }));

    return NextResponse.json({ 
      success: true, 
      incidents: [...emergencyIncidents, ...mappedWS] 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Citizen Map API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
