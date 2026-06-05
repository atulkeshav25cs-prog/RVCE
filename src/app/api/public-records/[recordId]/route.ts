import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import PublicRecord from "@/models/PublicRecord";

export async function GET(req: Request, { params }: any) {
  try {
    await dbConnect();
    const { recordId } = params;

    const record = await PublicRecord.findOne({ recordId }).lean();
    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, record }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Public Record Detail Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
