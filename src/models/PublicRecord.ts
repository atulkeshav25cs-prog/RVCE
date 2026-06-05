import mongoose from "mongoose";

const PublicRecordSchema = new mongoose.Schema({
  recordId: { type: String, required: true, unique: true },
  incidentId: { type: String, required: true },
  incidentType: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  severity: { type: String, required: true },
  status: { type: String, required: true, default: "Resolved" },
  resolvedAt: { type: Date, required: true },
  publishedAt: { type: Date, required: true, default: Date.now },
  publishedByAuthorityId: { type: String, required: true },
  publishedByAuthorityName: { type: String, required: true },
  timeline: [{
    status: { type: String },
    updatedBy: { type: String },
    timestamp: { type: Date },
    notes: { type: String }
  }],
  resolutionNotes: { type: String }
}, { timestamps: true, collection: "public_records" });

export default mongoose.models.PublicRecord || mongoose.model("PublicRecord", PublicRecordSchema);
