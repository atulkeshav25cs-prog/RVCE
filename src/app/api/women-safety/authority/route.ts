import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import WomenSafetyReport from "@/models/WomenSafetyReport";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "authority") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    const reports = await WomenSafetyReport.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, reports }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch WS Authority Reports Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
