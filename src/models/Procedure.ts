import mongoose from "mongoose";

const ProcedureSchema = new mongoose.Schema({
  procedureId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  officialWebsite: { type: String, required: true },
  summary: { type: String, required: true },
  requiredDocuments: [{ type: String }],
  steps: [{ type: String }],
  processingTime: { type: String, required: true },
  fees: { type: String, required: true },
  contactInformation: { type: String, required: true },
  emergencyLevel: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Low" },
  lastVerifiedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.Procedure || mongoose.model("Procedure", ProcedureSchema);
