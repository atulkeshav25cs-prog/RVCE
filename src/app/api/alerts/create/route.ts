import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Alert from "@/models/Alert";
import Authority from "@/models/Authority";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "authority") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, alertType, severity, targetArea, expiresAt, isPinned, affectedDepartments } = await req.json();

    if (!title || !description || !alertType || !severity || !targetArea || !expiresAt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();
    const authority = await Authority.findById(session.id);
    if (!authority) {
      return NextResponse.json({ error: "Authority not found" }, { status: 404 });
    }

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const count = await Alert.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) }
    });
    const alertId = `ALT-${dateStr}-${(count + 1).toString().padStart(4, "0")}`;

    const alert = await Alert.create({
      alertId,
      title,
      description,
      alertType,
      severity,
      targetArea,
      expiresAt: new Date(expiresAt),
      status: "Active",
      createdByAuthorityId: authority._id.toString(),
      createdByAuthorityName: authority.fullName,
      isPinned: isPinned || false,
      affectedDepartments: affectedDepartments || []
    });

    return NextResponse.json({ success: true, alert }, { status: 201 });
  } catch (error: any) {
    console.error("Create Alert Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
