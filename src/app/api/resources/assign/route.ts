import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Resource from "@/models/Resource";
import EmergencyReport from "@/models/EmergencyReport";
import WomenSafetyReport from "@/models/WomenSafetyReport";
import GuestSOS from "@/models/GuestSOS";
import Authority from "@/models/Authority";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "authority") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const { reportId, resourceId, estimatedArrivalMinutes } = body;

    if (!reportId || !resourceId || estimatedArrivalMinutes === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    // Verify incident exists in either collection
    let report: any = await EmergencyReport.findOne({ reportId });
    if (!report) {
      report = await WomenSafetyReport.findOne({ reportId });
    }
    if (!report) {
      report = await GuestSOS.findOne({ referenceId: reportId });
    }
    
    if (!report) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

    // Verify resource exists and is available
    const resource = await Resource.findOne({ resourceId });
    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    if (resource.status !== "Available") {
      return NextResponse.json({ error: "Resource is not Available for assignment" }, { status: 400 });
    }

    const authority = await Authority.findById(session.id);

    // Atomic assignment
    const now = new Date();
    resource.status = "Assigned";
    resource.assignedReportId = reportId;
    resource.assignedReportReference = report._id;
    resource.assignedAuthorityId = authority._id;
    resource.assignedAuthorityName = authority.fullName;
    resource.estimatedArrivalMinutes = Number(estimatedArrivalMinutes);
    
    // Push to history
    resource.assignmentHistory.push({
      reportId,
      assignedAt: now,
      authorityId: authority._id
    });

    await resource.save();

    // Auto-progress incident status if Pending
    if (report.status === "Pending") {
      report.status = "Acknowledged";
      report.assignedAuthority = authority._id;
      report.assignedAuthorityName = authority.fullName;
      
      // Push timeline if it's a Women Safety Report
      if (report.timeline) {
        report.timeline.push({
          status: "Acknowledged",
          updatedBy: authority.fullName,
          notes: `Resource ${resourceId} dispatched automatically`
        });
      }
      
      await report.save();
    }

    return NextResponse.json({ success: true, resource, report }, { status: 200 });
  } catch (error: any) {
    console.error("Assign Resource Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
