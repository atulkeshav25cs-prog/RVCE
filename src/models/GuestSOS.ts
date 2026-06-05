import mongoose from "mongoose";

const GuestSOSSchema = new mongoose.Schema({
  referenceId: { type: String, required: true, unique: true },
  emergencyType: { type: String, required: true },
  description: { type: String, required: false },
  contactNumber: { type: String, required: false },
  location: { type: String, required: true },
  latitude: { type: Number, required: false },
  longitude: { type: Number, required: false },
  status: { type: String, enum: ["Pending", "Acknowledged", "Dispatched", "In Progress", "Resolved"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
  ipHash: { type: String, required: true },
  isSOS: { type: Boolean, default: true },
  severity: { type: String, default: "Critical" },
  resolutionNotes: { type: String },
  timeline: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    notes: String,
    updatedBy: String
  }]
});

export default mongoose.models.GuestSOS || mongoose.model("GuestSOS", GuestSOSSchema);
