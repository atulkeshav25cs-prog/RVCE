import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";

import Resource from "@/models/Resource";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "authority") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const resStatus = await Resource.aggregate([
      { $group: { _id: "$status", value: { $sum: 1 } } }
    ]);
    
    const resType = await Resource.aggregate([
      { $group: { _id: "$resourceType", value: { $sum: 1 } } }
    ]);

    const statusData = resStatus.map(s => ({ name: s._id, value: s.value }));
    const typeData = resType.map(s => ({ name: s._id, value: s.value })).sort((a,b) => b.value - a.value);

    return NextResponse.json({
      success: true,
      data: {
        statusData,
        typeData
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Analytics Resources API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
