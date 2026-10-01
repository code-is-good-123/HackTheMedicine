// --- User Types ---
export interface IUserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  fcmTokens?: string[];
  createdAt: string;
}

// --- Medication Types ---
export interface IAISummary {
  purpose: string;           // What the medicine does
  bodyEffect: string;        // How it affects the body
  conditionsTreated: string; // What conditions it is used for
  sideEffects: string[];     // Common side effects
  safetyInfo: string;        // Key safety warnings
}

export interface IMedicationItem {
  _id: string;
  userId: string;
  name: string;
  brandName?: string;
  barcode?: string;
  source: "openfda" | "ai_generated";
  aiSummary: IAISummary;
  createdAt: string;
}

// --- Schedule Types ---
export interface IDoseTime {
  time: string;   // e.g. "08:00"
  label?: string; // e.g. "Morning", "Before Bed"
  amount?: string; // e.g. "1 Tablet", "10ml"
}

export interface IScheduleItem {
  _id: string;
  userId: string;
  medicationId: string | IMedicationItem;
  dosage: string;
  frequency: "daily" | "weekly" | "as_needed";
  times: IDoseTime[];
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
}

// --- Dose Log Types ---
export type DoseStatus = "taken" | "skipped" | "pending" | "missed";

export interface IDoseLogItem {
  _id: string;
  userId: string;
  scheduleId: string;
  medicationId: string | IMedicationItem;
  scheduledTime: string; // ISO date string or "HH:mm"
  status: DoseStatus;
  loggedAt?: string;
}

// --- Scanner & API Response Types ---
export interface IScanRequest {
  barcode?: string;
  query?: string;
}

export interface IScanResponseData {
  name: string;
  brandName?: string;
  barcode?: string;
  source: "openfda" | "ai_generated";
  aiSummary: IAISummary;
  fdaRaw?: Record<string, any>;
}

export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// --- Dashboard Bento Stats ---
export interface IDashboardStats {
  totalMedications: number;
  adherenceRate: number; // e.g., 94 for 94%
  streakDays: number;
  pendingDosesToday: number;
}