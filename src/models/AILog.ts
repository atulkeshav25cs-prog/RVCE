import mongoose from 'mongoose';

export interface IAILog {
  userId: string;
  userRole: string;
  sessionId: string;
  question: string;
  modelUsed: string;
  intentClassification: string;
  timestamp: Date;
}

const AILogSchema = new mongoose.Schema<IAILog>({
  userId: { type: String, required: true },
  userRole: { type: String, required: true },
  sessionId: { type: String, required: true },
  question: { type: String, required: true },
  modelUsed: { type: String, required: true },
  intentClassification: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.AILog || mongoose.model<IAILog>('AILog', AILogSchema);
