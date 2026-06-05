import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Alert from "@/models/Alert";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "authority") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    // Auto-expire alerts in the database if their time has passed
    await Alert.updateMany(
      { status: "Active", expiresAt: { $lt: new Date() } },
      { $set: { status: "Expired" } }
    );

    // Fetch all alerts for authority, sorted by newest first
    const alerts = await Alert.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, alerts }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Authority Alerts Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
