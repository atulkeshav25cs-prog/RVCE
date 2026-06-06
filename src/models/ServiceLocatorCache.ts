import mongoose, { Schema, Document } from "mongoose";

export interface IServiceLocatorCache extends Document {
  queryHash: string;
  lat: number;
  lng: number;
  radius: number;
  category: string;
  results: any[];
  cachedAt: Date;
}

const ServiceLocatorCacheSchema = new Schema<IServiceLocatorCache>({
  queryHash: { type: String, required: true, unique: true, index: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  radius: { type: Number, required: true },
  category: { type: String, required: true },
  results: { type: [Object], default: [] },
  cachedAt: { type: Date, default: Date.now, expires: 86400 } // 24 Hour TTL automatically handled by MongoDB
});

export default mongoose.models.ServiceLocatorCache || mongoose.model<IServiceLocatorCache>("ServiceLocatorCache", ServiceLocatorCacheSchema);
