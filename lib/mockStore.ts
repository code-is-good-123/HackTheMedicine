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

// Clean initial store: No random or deterministic mock data
const defaultUsers: MockUser[] = [];
const defaultMedications: MockMedication[] = [];
const defaultSchedules: MockSchedule[] = [];
const defaultLogs: MockDoseLog[] = [];

class MockStore {
  private users: MockUser[] = [...defaultUsers];
  private medications: MockMedication[] = [...defaultMedications];
  private schedules: MockSchedule[] = [...defaultSchedules];
  private doseLogs: MockDoseLog[] = [...defaultLogs];

  getUserByEmail(email: string) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  addUser(user: Omit<MockUser, "_id" | "createdAt"> & { _id?: string }) {
    const newUser: MockUser = {
      _id: user._id || "user_" + Math.random().toString(36).substring(2, 9),
      ...user,
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  getMedications(userId?: string) {
    if (!userId) return this.medications;
    return this.medications.filter((m) => m.userId === userId);
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
      ? this.schedules.filter((s) => s.userId === userId)
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
    return this.doseLogs.filter((log) => {
      const dateMatch = date ? log.date === date : true;
      const userMatch = userId ? log.userId === userId : true;
      return dateMatch && userMatch;
    });
  }

  logDose(log: Omit<MockDoseLog, "_id" | "createdAt">) {
    const existingIndex = this.doseLogs.findIndex(
      (l) =>
        l.scheduleId === log.scheduleId &&
        l.scheduledTime === log.scheduledTime &&
        l.date === log.date
    );

    if (existingIndex >= 0) {
      this.doseLogs[existingIndex] = {
        ...this.doseLogs[existingIndex],
        ...log,
      };
      return this.doseLogs[existingIndex];
    } else {
      const newLog: MockDoseLog = {
        _id: "log_" + Math.random().toString(36).substring(2, 9),
        ...log,
        createdAt: new Date().toISOString(),
      };
      this.doseLogs.push(newLog);
      return newLog;
    }
  }
}

export const mockStore = new MockStore();
