import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import GuestSOS from "@/models/GuestSOS";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { emergencyType, description, contactNumber, location, latitude, longitude } = body;

    if (!emergencyType || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Capture and hash IP
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

    // Anti-Spam Rate Limit (5 minutes cooldown for same IP)
    const cooldownPeriod = new Date(Date.now() - 5 * 60 * 1000);
    const recentRequest = await GuestSOS.findOne({
      ipHash,
      createdAt: { $gte: cooldownPeriod }
    });

    if (recentRequest) {
      return NextResponse.json({ 
        error: "Rate limit exceeded. Please wait before submitting another request or login to bypass." 
      }, { status: 429 });
    }

    // Generate Report ID: GSOS-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const prefix = `GSOS-${dateStr}-`;
    
    // Find highest sequence number for today
    const lastReport = await GuestSOS.findOne({ referenceId: { $regex: `^${prefix}` } })
      .sort({ referenceId: -1 })
      .select("referenceId");

    let sequence = 1;
    if (lastReport) {
      const lastSeq = parseInt(lastReport.referenceId.split("-")[2], 10);
      sequence = lastSeq + 1;
    }
    const referenceId = `${prefix}${sequence.toString().padStart(4, "0")}`;

    const newGuestSOS = await GuestSOS.create({
      referenceId,
      emergencyType,
      description,
      contactNumber,
      location,
      latitude,
      longitude,
      ipHash,
      status: "Pending",
      isSOS: true,
      severity: "Critical"
    });

    return NextResponse.json({ success: true, report: newGuestSOS }, { status: 201 });
  } catch (error: any) {
    console.error("Guest SOS Creation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
