import mongoose, { Schema, Document } from "mongoose";

export interface IDoseLog extends Document {
  userId: mongoose.Types.ObjectId;
  medicationId: mongoose.Types.ObjectId;
  scheduleId: mongoose.Types.ObjectId;
  scheduledTime: string; // e.g., "08:00"
  dosage: string; // e.g., "1 Tablet"
  status: "taken" | "skipped" | "missed";
  takenAt?: Date;
  date: string; // YYYY-MM-DD format for fast querying on the dashboard
  createdAt: Date;
}

const DoseLogSchema = new Schema<IDoseLog>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  medicationId: { type: Schema.Types.ObjectId, ref: "Medication", required: true },
  scheduleId: { type: Schema.Types.ObjectId, ref: "Schedule", required: true },
  scheduledTime: { type: String, required: true },
  dosage: { type: String, required: true },
  status: {
    type: String,
    enum: ["taken", "skipped", "missed"],
    default: "taken",
  },
  takenAt: { type: Date, default: Date.now },
  date: { type: String, required: true }, // e.g. "2026-10-01"
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.DoseLog || mongoose.model<IDoseLog>("DoseLog", DoseLogSchema);