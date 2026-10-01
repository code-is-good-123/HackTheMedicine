// In-memory data store for fallback when MongoDB is unreachable or offline
export interface MockUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  fcmTokens?: string[];
  createdAt: string;
}

export interface MockMedication {
  _id: string;
  userId: string;
  name: string;
  brandName?: string;
  barcode?: string;
  source: "openfda" | "ai_generated";
  aiSummary: {
    purpose: string;
    bodyEffect: string;
    conditionsTreated: string;
    sideEffects: string[];
    safetyInfo: string;
  };
  createdAt: string;
}

export interface MockSchedule {
  _id: string;
  userId: string;
  medicationId: string | MockMedication;
  doses: Array<{ time: string; dosage: string }>;
  dosage?: string;
  frequency?: string;
  times?: Array<{ time: string; label?: string; amount?: string }>;
  active: boolean;
  createdAt: string;
}

export interface MockDoseLog {
  _id: string;
  userId: string;
  medicationId: string | MockMedication;
  scheduleId: string;
  scheduledTime: string;
  dosage: string;
  status: "taken" | "skipped" | "missed";
  takenAt?: string;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

// Initial sample data so dashboard displays realistic content right away
const defaultUsers: MockUser[] = [
  {
    _id: "demo_user_1",
    name: "Alex Rivera",
    email: "demo@hackthemedicine.com",
    createdAt: new Date().toISOString(),
  },
];

const defaultMeds: MockMedication[] = [
  {
    _id: "med_1",
    userId: "demo_user_1",
    name: "Amoxicillin 500mg",
    brandName: "Amoxil",
    barcode: "0093-3109-01",
    source: "openfda",
    aiSummary: {
      purpose: "An antibiotic used to fight and stop bacterial infections throughout the body.",
      bodyEffect: "Breaks down bacterial cell walls so your immune system can destroy them.",
      conditionsTreated: "Chest infections, ear/nose/throat infections, and dental abscesses.",
      sideEffects: ["Mild stomach ache", "Soft stools or diarrhea", "Mild nausea"],
      safetyInfo: "Take right after a meal. Always finish the entire prescribed course.",
    },
    createdAt: new Date().toISOString(),
  },
  {
    _id: "med_2",
    userId: "demo_user_1",
    name: "Cetirizine 10mg",
    brandName: "Zyrtec",
    barcode: "50580-726-30",
    source: "openfda",
    aiSummary: {
      purpose: "Non-drowsy antihistamine for allergy relief and hay fever.",
      bodyEffect: "Blocks histamine chemical signals that trigger sneezing, itching, and swelling.",
      conditionsTreated: "Seasonal allergies, pet dander allergies, and itchy skin hives.",
      sideEffects: ["Occasional mild drowsiness", "Dry mouth", "Mild headache"],
      safetyInfo: "Take once daily in the evening or morning with plenty of water.",
    },
    createdAt: new Date().toISOString(),
  },
  {
    _id: "med_3",
    userId: "demo_user_1",
    name: "Metformin 500mg",
    brandName: "Glucophage",
    barcode: "0093-1048-01",
    source: "ai_generated",
    aiSummary: {
      purpose: "Helps maintain healthy blood sugar levels for type 2 diabetes management.",
      bodyEffect: "Increases insulin sensitivity and lowers glucose production in your liver.",
      conditionsTreated: "Type 2 diabetes and prediabetes management.",
      sideEffects: ["Bloating or gas", "Mild stomach discomfort", "Metallic taste"],
      safetyInfo: "Always take during or immediately after meals to avoid stomach upset.",
    },
    createdAt: new Date().toISOString(),
  },
];

const defaultSchedules: MockSchedule[] = [
  {
    _id: "sched_1",
    userId: "demo_user_1",
    medicationId: "med_1",
    doses: [
      { time: "08:00", dosage: "1 Capsule (500mg)" },
      { time: "20:00", dosage: "1 Capsule (500mg)" },
    ],
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "sched_2",
    userId: "demo_user_1",
    medicationId: "med_2",
    doses: [{ time: "09:00", dosage: "1 Tablet (10mg)" }],
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "sched_3",
    userId: "demo_user_1",
    medicationId: "med_3",
    doses: [{ time: "19:00", dosage: "1 Tablet (500mg)" }],
    active: true,
    createdAt: new Date().toISOString(),
  },
];

const todayStr = new Date().toISOString().split("T")[0];
const defaultDoseLogs: MockDoseLog[] = [
  {
    _id: "log_1",
    userId: "demo_user_1",
    medicationId: "med_1",
    scheduleId: "sched_1",
    scheduledTime: "08:00",
    dosage: "1 Capsule (500mg)",
    status: "taken",
    takenAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    date: todayStr,
    createdAt: new Date().toISOString(),
  },
];

// Global in-memory storage singleton
class MemoryStore {
  users: MockUser[] = [...defaultUsers];
  medications: MockMedication[] = [...defaultMeds];
  schedules: MockSchedule[] = [...defaultSchedules];
  doseLogs: MockDoseLog[] = [...defaultDoseLogs];

  getUserByEmail(email: string) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string) {
    return this.users.find((u) => u._id === id);
  }

  addUser(user: Omit<MockUser, "_id" | "createdAt"> & { _id?: string }) {
    const newUser: MockUser = {
      _id: user._id || "user_" + Math.random().toString(36).substring(2, 9),
      name: user.name,
      email: user.email,
      password: user.password,
      image: user.image,
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  getMedications(userId?: string) {
    if (!userId) return this.medications;
    return this.medications.filter((m) => m.userId === userId || m.userId === "demo_user_1");
  }

  getMedicationById(id: string) {
    return this.medications.find((m) => m._id === id);
  }

  addMedication(med: Omit<MockMedication, "_id" | "createdAt"> & { _id?: string }) {
    const newMed: MockMedication = {
      _id: med._id || "med_" + Math.random().toString(36).substring(2, 9),
      ...med,
      createdAt: new Date().toISOString(),
    };
    this.medications.unshift(newMed);
    return newMed;
  }

  deleteMedication(id: string) {
    const index = this.medications.findIndex((m) => m._id === id);
    if (index >= 0) {
      this.medications.splice(index, 1);
      return true;
    }
    return false;
  }

  getSchedules(userId?: string) {
    const list = userId
      ? this.schedules.filter((s) => s.userId === userId || s.userId === "demo_user_1")
      : this.schedules;

    // Populate medication object if available
    return list.map((sched) => {
      const medId = typeof sched.medicationId === "string" ? sched.medicationId : sched.medicationId._id;
      const med = this.getMedicationById(medId);
      return {
        ...sched,
        medicationId: med || sched.medicationId,
      };
    });
  }

  addSchedule(sched: Omit<MockSchedule, "_id" | "createdAt"> & { _id?: string }) {
    const newSched: MockSchedule = {
      _id: sched._id || "sched_" + Math.random().toString(36).substring(2, 9),
      ...sched,
      createdAt: new Date().toISOString(),
    };
    this.schedules.push(newSched);
    return newSched;
  }

  getDoseLogs(date?: string, userId?: string) {
    let logs = this.doseLogs;
    if (date) {
      logs = logs.filter((l) => l.date === date);
    }
    if (userId) {
      logs = logs.filter((l) => l.userId === userId || l.userId === "demo_user_1");
    }
    return logs.map((log) => {
      const medId = typeof log.medicationId === "string" ? log.medicationId : log.medicationId._id;
      const med = this.getMedicationById(medId);
      return {
        ...log,
        medicationId: med || log.medicationId,
      };
    });
  }

  logDose(entry: {
    userId: string;
    medicationId: string;
    scheduleId: string;
    scheduledTime: string;
    dosage: string;
    status: "taken" | "skipped" | "missed";
    date?: string;
  }) {
    const logDate = entry.date || new Date().toISOString().split("T")[0];
    const existing = this.doseLogs.find(
      (l) =>
        l.scheduleId === entry.scheduleId &&
        l.scheduledTime === entry.scheduledTime &&
        l.date === logDate
    );

    if (existing) {
      existing.status = entry.status;
      existing.takenAt = entry.status === "taken" ? new Date().toISOString() : undefined;
      return existing;
    }

    const newLog: MockDoseLog = {
      _id: "log_" + Math.random().toString(36).substring(2, 9),
      userId: entry.userId,
      medicationId: entry.medicationId,
      scheduleId: entry.scheduleId,
      scheduledTime: entry.scheduledTime,
      dosage: entry.dosage,
      status: entry.status,
      takenAt: entry.status === "taken" ? new Date().toISOString() : undefined,
      date: logDate,
      createdAt: new Date().toISOString(),
    };
    this.doseLogs.push(newLog);
    return newLog;
  }
}

const globalForStore = global as unknown as { mockStoreInstance?: MemoryStore };
export const mockStore = globalForStore.mockStoreInstance || new MemoryStore();
if (process.env.NODE_ENV !== "production") globalForStore.mockStoreInstance = mockStore;
