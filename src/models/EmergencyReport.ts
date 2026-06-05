import mongoose from "mongoose";

const EmergencyReportSchema = new mongoose.Schema({
  // Scaffold only
}, { timestamps: true, collection: "emergency_reports", strict: false });

export default mongoose.models.EmergencyReport || mongoose.model("EmergencyReport", EmergencyReportSchema);
