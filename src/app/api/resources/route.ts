import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Resource from "@/models/Resource";

const seedData = [
  { resourceId: "AMB-001", resourceName: "Ambulance Unit 1", resourceType: "Ambulance", currentLocation: "Central Station" },
  { resourceId: "AMB-002", resourceName: "Ambulance Unit 2", resourceType: "Ambulance", currentLocation: "North District" },
  { resourceId: "AMB-003", resourceName: "Ambulance Unit 3", resourceType: "Ambulance", currentLocation: "East District" },
  { resourceId: "FIRE-001", resourceName: "Engine 1", resourceType: "Fire Truck", currentLocation: "Firehouse 1" },
  { resourceId: "FIRE-002", resourceName: "Ladder 2", resourceType: "Fire Truck", currentLocation: "Firehouse 2" },
  { resourceId: "RESCUE-001", resourceName: "Heavy Rescue 1", resourceType: "Rescue Team", currentLocation: "Central HQ" },
  { resourceId: "RESCUE-002", resourceName: "Water Rescue 1", resourceType: "Rescue Team", currentLocation: "Harbor Station" },
  { resourceId: "POLICE-001", resourceName: "Patrol Alpha", resourceType: "Police Unit", currentLocation: "Precinct 4" },
  { resourceId: "POLICE-002", resourceName: "Patrol Bravo", resourceType: "Police Unit", currentLocation: "Precinct 7" },
  { resourceId: "MEDICAL-001", resourceName: "Field Medics 1", resourceType: "Medical Team", currentLocation: "General Hospital" },
  { resourceId: "DRT-001", resourceName: "Disaster Response Team Alpha", resourceType: "Disaster Response Team", currentLocation: "EOC Main" },
];

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "authority") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    
    // Auto-seeding logic
    const count = await Resource.countDocuments();
    if (count === 0) {
      await Resource.insertMany(seedData.map(res => ({
        ...res,
        status: "Available"
      })));
    }

    const resources = await Resource.find({}).sort({ resourceId: 1 });

    return NextResponse.json({ success: true, resources }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Resources Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
