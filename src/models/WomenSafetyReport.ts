import mongoose from "mongoose";

const WomenSafetyReportSchema = new mongoose.Schema({
  // Scaffold only
}, { timestamps: true, collection: "women_safety_reports", strict: false });

export default mongoose.models.WomenSafetyReport || mongoose.model("WomenSafetyReport", WomenSafetyReportSchema);
