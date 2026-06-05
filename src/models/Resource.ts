import mongoose from "mongoose";

const AssignmentHistorySchema = new mongoose.Schema({
  reportId: { type: String, required: true },
  assignedAt: { type: Date, required: true },
  releasedAt: { type: Date },
  authorityId: { type: mongoose.Schema.Types.ObjectId, ref: "Authority", required: true }
}, { _id: false });

const ResourceSchema = new mongoose.Schema({
  resourceId: { type: String, required: true, unique: true, index: true },
  resourceName: { type: String, required: true },
  resourceType: { 
    type: String, 
    enum: ["Ambulance", "Fire Truck", "Rescue Team", "Police Unit", "Medical Team", "Disaster Response Team"],
    required: true 
  },
  status: { 
    type: String, 
    enum: ["Available", "Assigned", "Dispatched", "Busy", "Offline"], 
    default: "Available" 
  },
  currentLocation: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  assignedReportId: { type: String },
  assignedReportReference: { type: mongoose.Schema.Types.ObjectId, ref: "EmergencyReport" },
  assignedAuthorityId: { type: mongoose.Schema.Types.ObjectId, ref: "Authority" },
  assignedAuthorityName: { type: String },
  estimatedArrivalMinutes: { type: Number },
  assignmentHistory: [AssignmentHistorySchema]
}, { timestamps: true, collection: "resources" });

export default mongoose.models.Resource || mongoose.model("Resource", ResourceSchema);
