import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema({
  alertId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  alertType: { 
    type: String, 
    required: true,
    enum: ["Weather", "Flood", "Fire", "Medical", "Security", "Disaster"]
  },
  severity: { 
    type: String, 
    required: true,
    enum: ["Low", "Medium", "High", "Critical"]
  },
  targetArea: { type: String, required: true },
  status: { 
    type: String, 
    required: true,
    enum: ["Active", "Expired"],
    default: "Active"
  },
  createdByAuthorityId: { type: String, required: true },
  createdByAuthorityName: { type: String, required: true },
  isPinned: { type: Boolean, default: false },
  affectedDepartments: { type: [String], default: [] },
  expiresAt: { type: Date, required: true },
}, { timestamps: true, collection: "alerts" });

export default mongoose.models.Alert || mongoose.model("Alert", AlertSchema);
