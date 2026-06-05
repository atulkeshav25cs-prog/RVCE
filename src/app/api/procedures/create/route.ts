import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Procedure from "@/models/Procedure";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "authority") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const newProcedure = await Procedure.create({
      ...body,
      lastVerifiedAt: new Date()
    });

    return NextResponse.json({ success: true, procedure: newProcedure }, { status: 201 });
  } catch (error: any) {
    console.error("Create Procedure Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
