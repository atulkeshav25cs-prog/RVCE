import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Resource from "@/models/Resource";

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "authority") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const { resourceId, status } = body;

    if (!resourceId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    const resource = await Resource.findOne({ resourceId });
    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    // Status transition rules logic could be enforced here if needed
    resource.status = status;

    // If manually releasing a resource, update history and clear assignment
    if (status === "Available") {
      const activeAssignment = resource.assignmentHistory.find((h: any) => !h.releasedAt);
      if (activeAssignment) {
        activeAssignment.releasedAt = new Date();
      }
      resource.assignedReportId = undefined;
      resource.assignedReportReference = undefined;
      resource.assignedAuthorityId = undefined;
      resource.assignedAuthorityName = undefined;
      resource.estimatedArrivalMinutes = undefined;
    }

    await resource.save();

    return NextResponse.json({ success: true, resource }, { status: 200 });
  } catch (error: any) {
    console.error("Update Resource Status Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
