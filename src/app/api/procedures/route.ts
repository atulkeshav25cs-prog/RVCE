import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Procedure from "@/models/Procedure";
import { seedProcedures } from "@/lib/procedureData";

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    // Auto-seeding logic
    const count = await Procedure.countDocuments();
    if (count === 0) {
      await Procedure.insertMany(seedProcedures);
      console.log("Seeded initial government procedures.");
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let query: any = {};
    if (category && category !== "All Procedures") {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const procedures = await Procedure.find(query).sort({ category: 1, title: 1 }).lean();
    return NextResponse.json({ success: true, procedures }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Procedures Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
