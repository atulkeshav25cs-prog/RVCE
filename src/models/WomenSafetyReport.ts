import mongoose from "mongoose";

const TimelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  updatedBy: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  notes: { type: String }
}, { _id: false });

const TrustedContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true }
}, { _id: false });

const WomenSafetyReportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true, index: true },
  citizenId: { type: mongoose.Schema.Types.ObjectId, ref: "Citizen", required: true },
  citizenName: { type: String, required: true },
  citizenEmail: { type: String, required: true },
  contactPhone: { type: String },
  emergencyType: { type: String, default: "Women Safety Incident" },
  description: { type: String },
  location: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  status: { 
    type: String, 
    enum: ["Pending", "Acknowledged", "Dispatched", "In Progress", "Resolved"], 
    default: "Pending" 
  },
  priority: { type: String, default: "Critical" },
  trustedContacts: [TrustedContactSchema],
  assignedAuthority: { type: mongoose.Schema.Types.ObjectId, ref: "Authority" },
  assignedAuthorityName: { type: String },
  timeline: [TimelineSchema]
}, { timestamps: true, collection: "women_safety_reports" });

export default mongoose.models.WomenSafetyReport || mongoose.model("WomenSafetyReport", WomenSafetyReportSchema);
