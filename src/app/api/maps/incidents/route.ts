import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import EmergencyReport from "@/models/EmergencyReport";
import WomenSafetyReport from "@/models/WomenSafetyReport";
import GuestSOS from "@/models/GuestSOS";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "authority") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const emergencyIncidents = await EmergencyReport.find({ latitude: { $exists: true }, longitude: { $exists: true } })
      .select("reportId emergencyType title description location latitude longitude severity status createdAt resolutionNotes isSOS")
      .lean();

    const wsIncidents = await WomenSafetyReport.find({ latitude: { $exists: true }, longitude: { $exists: true } })
      .select("reportId emergencyType location latitude longitude status priority createdAt")
      .lean();

    const guestIncidents = await GuestSOS.find({ latitude: { $exists: true }, longitude: { $exists: true } })
      .select("referenceId emergencyType description location latitude longitude status createdAt")
      .lean();

    // Sanitize WS incidents further for map API transmission
    const sanitizedWS = wsIncidents.map(inc => ({
      ...inc,
      severity: inc.priority || "Critical", // Map priority to severity for unified logic
      isWomenSafety: true
    }));

    const sanitizedGuest = guestIncidents.map(inc => ({
      ...inc,
      reportId: (inc as any).referenceId,
      severity: "Critical",
      isSOS: true,
      isGuestSOS: true
    }));

    return NextResponse.json({ 
      success: true, 
      incidents: [...emergencyIncidents, ...sanitizedWS, ...sanitizedGuest] 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Map Incidents API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
