import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Procedure from "@/models/Procedure";
import { getSession } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "authority") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { procedureId, ...updateData } = body;

    if (!procedureId) {
      return NextResponse.json({ error: "procedureId is required" }, { status: 400 });
    }

    const procedure = await Procedure.findOneAndUpdate(
      { procedureId },
      { ...updateData, lastVerifiedAt: new Date() },
      { new: true }
    );

    if (!procedure) {
      return NextResponse.json({ error: "Procedure not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, procedure }, { status: 200 });
  } catch (error: any) {
    console.error("Update Procedure Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
