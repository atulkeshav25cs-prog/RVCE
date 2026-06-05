import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import PublicRecord from "@/models/PublicRecord";
import EmergencyReport from "@/models/EmergencyReport";
import WomenSafetyReport from "@/models/WomenSafetyReport";
import Authority from "@/models/Authority";

function sanitizeWSLocation(exactLocation: string): string {
  // Simple heuristic to generalize location for privacy
  if (!exactLocation) return "Undisclosed Area";
  
  const lower = exactLocation.toLowerCase();
  if (lower.includes("metro") || lower.includes("station")) return "Central Transit District";
  if (lower.includes("street") || lower.includes("road") || lower.includes("ave")) return "Urban Residential Zone";
  if (lower.includes("mall") || lower.includes("market") || lower.includes("shop")) return "Commercial District";
  if (lower.includes("park") || lower.includes("garden")) return "Public Recreation Zone";
  
  // Fallback: take the first word and append "District"
  const firstWord = exactLocation.split(" ")[0].replace(/[^a-zA-Z]/g, '');
  if (firstWord.length > 2) {
    return `${firstWord.charAt(0).toUpperCase() + firstWord.slice(1)} District`;
  }
  return "General City Area";
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "authority") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { incidentId } = await req.json();

    if (!incidentId) {
      return NextResponse.json({ error: "Missing incidentId" }, { status: 400 });
    }

    await dbConnect();
    const authority = await Authority.findById(session.id);
    if (!authority) {
      return NextResponse.json({ error: "Authority not found" }, { status: 404 });
    }

    // Check if already published
    const existing = await PublicRecord.findOne({ incidentId });
    if (existing) {
      return NextResponse.json({ error: "Incident is already published" }, { status: 400 });
    }

    // Fetch the incident (try both collections)
    let incident = null;
    let isWS = false;

    incident = await EmergencyReport.findOne({ reportId: incidentId }).lean();
    if (!incident) {
      incident = await WomenSafetyReport.findOne({ reportId: incidentId }).lean();
      if (incident) isWS = true;
    }

    if (!incident) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

    if (incident.status !== "Resolved") {
      return NextResponse.json({ error: "Only resolved incidents can be published" }, { status: 400 });
    }

    // Sanitize and Map Fields
    let safeLocation = incident.location;
    if (isWS) {
      safeLocation = sanitizeWSLocation(incident.location);
    }

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const count = await PublicRecord.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) }
    });
    const recordId = `PR-${dateStr}-${(count + 1).toString().padStart(4, "0")}`;

    const newRecord = await PublicRecord.create({
      recordId,
      incidentId: incident.reportId,
      incidentType: incident.emergencyType || "Emergency",
      title: isWS ? "Women Safety Incident" : `${incident.emergencyType} Report`,
      description: isWS ? "A women safety incident was reported and successfully resolved by emergency teams." : incident.description,
      location: safeLocation,
      severity: incident.severity || incident.priority || "Medium",
      status: "Resolved",
      resolvedAt: incident.resolvedAt || incident.updatedAt,
      publishedByAuthorityId: authority._id.toString(),
      publishedByAuthorityName: authority.fullName,
      timeline: incident.timeline?.map((t: any) => ({
        status: t.status,
        timestamp: t.timestamp,
        notes: t.notes
      })) || [],
      resolutionNotes: incident.resolutionNotes || "Incident resolved successfully."
    });

    return NextResponse.json({ success: true, record: newRecord }, { status: 201 });
  } catch (error: any) {
    console.error("Publish Record Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
