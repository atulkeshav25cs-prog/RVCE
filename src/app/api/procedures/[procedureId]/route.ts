import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Procedure from "@/models/Procedure";

export async function GET(req: Request, { params }: { params: Promise<{ procedureId: string }> }) {
  try {
    await dbConnect();
    const { procedureId } = await params;

    const procedure = await Procedure.findOne({ procedureId }).lean();
    if (!procedure) {
      return NextResponse.json({ error: "Procedure not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, procedure }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Procedure Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
