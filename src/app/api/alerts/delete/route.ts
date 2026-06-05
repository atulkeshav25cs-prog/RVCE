import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Alert from "@/models/Alert";

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "authority") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const alertId = searchParams.get("alertId");

    if (!alertId) {
      return NextResponse.json({ error: "Missing alertId" }, { status: 400 });
    }

    await dbConnect();
    const result = await Alert.findOneAndDelete({ alertId });
    if (!result) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Delete Alert Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
