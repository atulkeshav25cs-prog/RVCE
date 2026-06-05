import mongoose from "mongoose";

const CitizenSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  phone: { type: String },
  gender: { type: String },
  age: { type: Number },
  bloodGroup: { type: String },
  role: { type: String, default: "citizen" },
  trustedContacts: [{
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true }
  }],
}, { timestamps: true, collection: "citizens" });
export default mongoose.models.Citizen || mongoose.model("Citizen", CitizenSchema);
