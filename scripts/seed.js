const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI environment variable not found.");
  process.exit(1);
}

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const MedicationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  brandName: { type: String },
  barcode: { type: String },
  source: { type: String, enum: ["openfda", "ai_generated"], default: "openfda" },
  aiSummary: {
    purpose: { type: String, required: true },
    bodyEffect: { type: String, required: true },
    conditionsTreated: { type: String, required: true },
    sideEffects: [{ type: String }],
    safetyInfo: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

const ScheduleSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  medicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Medication", required: true },
  doses: [{ time: { type: String, required: true }, dosage: { type: String, required: true } }],
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Medication = mongoose.models.Medication || mongoose.model("Medication", MedicationSchema);
const Schedule = mongoose.models.Schedule || mongoose.model("Schedule", ScheduleSchema);

async function seed() {
  console.log("Connecting to MongoDB for test account seeding...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected!");

  // Create or find Test Account: test@hackthemedicine.com
  const testEmail = "test@hackthemedicine.com";
  let testUser = await User.findOne({ email: testEmail });
  if (!testUser) {
    const hashedPassword = await bcrypt.hash("password123", 10);
    testUser = await User.create({
      name: "Test Patient",
      email: testEmail,
      password: hashedPassword,
    });
    console.log("Created test user:", testUser.email);
  } else {
    console.log("Found existing test user:", testUser.email);
  }

  const userId = testUser._id.toString();

  // Clear previous test account data to avoid duplication
  await Medication.deleteMany({ userId });
  await Schedule.deleteMany({ userId });
  console.log("Cleaned previous test account medications and schedules.");

  // Add 2 realistic medications under the test account in MongoDB
  const med1 = await Medication.create({
    userId,
    name: "Amoxicillin 500mg",
    brandName: "Amoxil",
    barcode: "0093-3109-01",
    source: "openfda",
    aiSummary: {
      purpose: "Antibiotic used to fight bacterial infections in various parts of the body.",
      bodyEffect: "Stops bacteria from building cell walls, killing them and curing the infection.",
      conditionsTreated: "Ear, throat, chest infections, and dental abscesses.",
      sideEffects: ["Diarrhea", "Mild stomach pain", "Nausea"],
      safetyInfo: "Always finish the complete course even if you feel better. Seek medical help if a rash occurs.",
    },
  });

  const med2 = await Medication.create({
    userId,
    name: "Metformin 500mg",
    brandName: "Glucophage",
    barcode: "0093-1048-01",
    source: "openfda",
    aiSummary: {
      purpose: "Helps lower high blood glucose levels in adults with type 2 diabetes.",
      bodyEffect: "Decreases glucose production in the liver and improves body response to insulin.",
      conditionsTreated: "Type 2 diabetes and insulin resistance management.",
      sideEffects: ["Mild nausea", "Stomach upset", "Metallic taste"],
      safetyInfo: "Take with or right after meals to reduce stomach discomfort.",
    },
  });

  console.log("Created medications:", med1.name, med2.name);

  // Add schedules
  await Schedule.create({
    userId,
    medicationId: med1._id,
    doses: [
      { time: "08:00", dosage: "1 Capsule (500mg)" },
      { time: "20:00", dosage: "1 Capsule (500mg)" },
    ],
    active: true,
  });

  await Schedule.create({
    userId,
    medicationId: med2._id,
    doses: [{ time: "08:30", dosage: "1 Tablet (500mg)" }],
    active: true,
  });

  console.log("Test account seeded successfully with 2 medications and schedules!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
