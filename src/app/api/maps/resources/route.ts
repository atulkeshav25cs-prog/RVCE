import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Resource from "@/models/Resource";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "authority") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Fetch all resources that have coordinates
    const resources = await Resource.find({ latitude: { $exists: true }, longitude: { $exists: true } })
      .select("resourceId resourceName resourceType status currentLocation latitude longitude assignedReportId estimatedArrivalMinutes")
      .lean();

    return NextResponse.json({ success: true, resources }, { status: 200 });

  } catch (error: any) {
    console.error("Map Resources API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
