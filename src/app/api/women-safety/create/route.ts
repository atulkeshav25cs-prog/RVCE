import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Citizen from "@/models/Citizen";
import WomenSafetyReport from "@/models/WomenSafetyReport";

function generateReportId() {
  const date = new Date();
  const dateString = date.toISOString().split("T")[0].replace(/-/g, "");
  const randomStr = Math.floor(1000 + Math.random() * 9000).toString();
  return `WS-${dateString}-${randomStr}`;
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "citizen") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { location, description, latitude, longitude } = await req.json();

    if (!location) {
      return NextResponse.json({ error: "Location is required" }, { status: 400 });
    }

    await dbConnect();

    // Prevent duplicate active SOS
    const activeReport = await WomenSafetyReport.findOne({
      citizenId: session.id,
      status: { $in: ["Pending", "Acknowledged", "Dispatched", "In Progress"] }
    });

    if (activeReport) {
      return NextResponse.json({ error: "You already have an active Women Safety emergency." }, { status: 400 });
    }

    const citizen = await Citizen.findById(session.id);
    if (!citizen) {
      return NextResponse.json({ error: "Citizen not found" }, { status: 404 });
    }

    const newReport = new WomenSafetyReport({
      reportId: generateReportId(),
      citizenId: citizen._id,
      citizenName: citizen.fullName,
      citizenEmail: citizen.email,
      contactPhone: citizen.phone,
      emergencyType: "Women Safety Incident",
      description: description || "Immediate assistance requested",
      location,
      latitude,
      longitude,
      status: "Pending",
      priority: "Critical",
      trustedContacts: citizen.trustedContacts || [],
      timeline: [{
        status: "Pending",
        updatedBy: citizen.fullName,
        notes: "SOS Triggered by Citizen"
      }]
    });

    await newReport.save();

    return NextResponse.json({ success: true, report: newReport }, { status: 201 });
  } catch (error: any) {
    console.error("Create Women Safety Report Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
