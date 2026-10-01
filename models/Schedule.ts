import mongoose, { Schema, Document } from "mongoose";

export interface IDoseTime {
  time: string; // e.g., "08:00", "20:00"
  dosage: string; // e.g., "1 Tablet", "10ml"
}

export interface ISchedule extends Document {
  userId: mongoose.Types.ObjectId;
  medicationId: mongoose.Types.ObjectId;
  doses: IDoseTime[];
  active: boolean;
  createdAt: Date;
}

const ScheduleSchema = new Schema<ISchedule>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  medicationId: { type: Schema.Types.ObjectId, ref: "Medication", required: true },
  doses: [
    {
      time: { type: String, required: true },
      dosage: { type: String, required: true },
    },
  ],
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Schedule || mongoose.model<ISchedule>("Schedule", ScheduleSchema);