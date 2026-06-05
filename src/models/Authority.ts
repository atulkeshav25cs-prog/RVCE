import mongoose from "mongoose";

const AuthoritySchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  department: { type: String },
  authorityId: { type: String, unique: true },
  role: { type: String, default: "authority" },
}, { timestamps: true, collection: "authorities" });

export default mongoose.models.Authority || mongoose.model("Authority", AuthoritySchema);
