import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Alert from "@/models/Alert";

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "authority") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { alertId, status } = await req.json();

    if (!alertId || !status) {
      return NextResponse.json({ error: "Missing alertId or status" }, { status: 400 });
    }

    await dbConnect();
    const alert = await Alert.findOne({ alertId });
    if (!alert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    alert.status = status;
    await alert.save();

    return NextResponse.json({ success: true, alert }, { status: 200 });
  } catch (error: any) {
    console.error("Update Alert Status Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
