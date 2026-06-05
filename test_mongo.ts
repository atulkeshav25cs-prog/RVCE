import { config } from "dotenv";
config({ path: ".env.local" });
import dbConnect from "./src/lib/mongoose";
import Citizen from "./src/models/Citizen";
import Authority from "./src/models/Authority";
import EmergencyReport from "./src/models/EmergencyReport";
import WomenSafetyReport from "./src/models/WomenSafetyReport";

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    const conn = await dbConnect();
    console.log("MongoDB connection SUCCESS. Host:", conn.connection.host);
    console.log("Database Name:", conn.connection.name);

    await Citizen.init();
    await Authority.init();
    await EmergencyReport.init();
    await WomenSafetyReport.init();
    
    // Create collections if they don't exist
    await Citizen.createCollection().catch(() => {});
    await Authority.createCollection().catch(() => {});
    await EmergencyReport.createCollection().catch(() => {});
    await WomenSafetyReport.createCollection().catch(() => {});
    
    const collections = await conn.connection.db.listCollections().toArray();
    console.log("Collections available:");
    collections.forEach(c => console.log("- " + c.name));
    
    process.exit(0);
  } catch (error) {
    console.error("MongoDB connection FAILED:", error);
    process.exit(1);
  }
}
run();
