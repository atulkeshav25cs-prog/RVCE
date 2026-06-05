import mongoose from "mongoose";

const EmergencyReportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true, index: true },
  citizenId: { type: mongoose.Schema.Types.ObjectId, ref: "Citizen", required: true },
  citizenName: { type: String, required: true },
  citizenEmail: { type: String, required: true },
  contactPhone: { type: String },
  emergencyCategory: { type: String },
  emergencyType: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  latitude: { type: Number, required: false },
  longitude: { type: Number, required: false },
  severity: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
  status: { type: String, enum: ["Pending", "Acknowledged", "Dispatched", "In Progress", "Resolved"], default: "Pending" },
  assignedAuthority: { type: mongoose.Schema.Types.ObjectId, ref: "Authority" },
  assignedAuthorityName: { type: String },
  resolutionNotes: { type: String },
  resolvedAt: { type: Date },
  attachments: [{ type: String }]
}, { timestamps: true, collection: "emergency_reports" });

export default mongoose.models.EmergencyReport || mongoose.model("EmergencyReport", EmergencyReportSchema);
