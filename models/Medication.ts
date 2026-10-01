import mongoose, { Schema, Document } from "mongoose";

export interface IMedication extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  brandName?: string;
  barcode?: string;
  source: "openfda" | "ai_generated";
  aiSummary: {
    purpose: string;           // What the medicine does
    bodyEffect: string;        // How it affects the body
    conditionsTreated: string; // What conditions it is used for
    sideEffects: string[];     // Common side effects
    safetyInfo: string;        // Key safety warnings
  };
  createdAt: Date;
}

const MedicationSchema = new Schema<IMedication>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  brandName: { type: String },
  barcode: { type: String },
  source: { type: String, enum: ["openfda", "ai_generated"], default: "ai_generated" },
  aiSummary: {
    purpose: { type: String, required: true },
    bodyEffect: { type: String, required: true },
    conditionsTreated: { type: String, required: true },
    sideEffects: [{ type: String }],
    safetyInfo: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Medication || mongoose.model<IMedication>("Medication", MedicationSchema);
