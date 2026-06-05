import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import PublicRecord from "@/models/PublicRecord";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    
    const records = await PublicRecord.find({}).sort({ publishedAt: -1 }).lean();

    let resolvedEmergencies = 0;
    let resolvedWSCases = 0;

    records.forEach(r => {
      if (r.title === "Women Safety Incident") {
        resolvedWSCases++;
      } else {
        resolvedEmergencies++;
      }
    });

    const stats = {
      totalPublished: records.length,
      resolvedEmergencies,
      resolvedWSCases,
      latestPublicationDate: records.length > 0 ? records[0].publishedAt : null
    };

    return NextResponse.json({ success: true, records, stats }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Public Records Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
