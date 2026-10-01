import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ============================================================================
// CONFIGURE TARGET USERNAME HERE:
// Change "username" to your desired username or account name before running.
// ============================================================================
const username = "username";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ ERROR: MONGODB_URI environment variable is missing.");
  console.error("Please ensure MONGODB_URI is defined in your environment or .env.local file.");
  process.exit(1);
}

// Mongoose Schemas & Models
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fcmTokens: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

const MedicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
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
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  medicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Medication", required: true },
  doses: [
    {
      time: { type: String, required: true },
      dosage: { type: String, required: true },
    },
  ],
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const DoseLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  medicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Medication", required: true },
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Schedule", required: true },
  scheduledTime: { type: String, required: true },
  dosage: { type: String, required: true },
  status: { type: String, enum: ["taken", "skipped", "missed"], default: "taken" },
  takenAt: { type: Date, default: Date.now },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Medication = mongoose.models.Medication || mongoose.model("Medication", MedicationSchema);
const Schedule = mongoose.models.Schedule || mongoose.model("Schedule", ScheduleSchema);
const DoseLog = mongoose.models.DoseLog || mongoose.model("DoseLog", DoseLogSchema);

async function main() {
  console.log(`\nConnecting to MongoDB...`);
  await mongoose.connect(MONGODB_URI as string);
  console.log(`Connected successfully!`);

  console.log(`\nLooking up target user: "${username}"...`);

  // Try to find user by name or email
  let user = await User.findOne({
    $or: [
      { name: username },
      { email: username.toLowerCase() },
      { email: `${username.toLowerCase().replace(/[^a-z0-9]/g, "")}@example.com` },
    ],
  });

  if (!user) {
    const safeEmail = username.includes("@")
      ? username.toLowerCase()
      : `${username.toLowerCase().replace(/[^a-z0-9]/g, "")}@example.com`;

    const hashedPassword = await bcrypt.hash("password123", 10);
    user = await User.create({
      name: username,
      email: safeEmail,
      password: hashedPassword,
    });
    console.log(`Created new user:`);
    console.log(`  Name: ${user.name}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Default Password: password123`);
  } else {
    console.log(`Found existing user:`);
    console.log(`  ID: ${user._id}`);
    console.log(`  Name: ${user.name}`);
    console.log(`  Email: ${user.email}`);
  }

  const userId = user._id;

  // Clean previous records for a fresh, consistent seed
  console.log(`\nClearing previous medications, schedules, and logs for user ${userId}...`);
  await Medication.deleteMany({ userId });
  await Schedule.deleteMany({ userId });
  await DoseLog.deleteMany({ userId });

  console.log(`Inserting realistic medication records with 5-point clarity summaries...`);

  const fakeMedications = [
    {
      name: "Amoxicillin 500mg",
      brandName: "Amoxil",
      barcode: "0093-3109-01",
      source: "openfda",
      aiSummary: {
        purpose: "Broad-spectrum penicillin-type antibiotic used to eliminate bacterial infections.",
        bodyEffect: "Inhibits bacterial cell wall synthesis, causing the bacteria to break down and clear from the body.",
        conditionsTreated: "Ear infections, strep throat, pneumonia, skin infections, and dental abscesses.",
        sideEffects: ["Mild diarrhea", "Nausea", "Stomach cramps", "Mild headache"],
        safetyInfo: "Complete the full course even if symptoms subside. Seek immediate medical attention if skin rash or hives appear.",
      },
      doses: [
        { time: "08:00", dosage: "1 Capsule (500mg)" },
        { time: "20:00", dosage: "1 Capsule (500mg)" },
      ],
    },
    {
      name: "Lisinopril 10mg",
      brandName: "Prinivil / Zestril",
      barcode: "0093-7221-01",
      source: "openfda",
      aiSummary: {
        purpose: "ACE inhibitor used to manage high blood pressure and protect kidney function.",
        bodyEffect: "Relaxes and widens blood vessels so blood flows more smoothly and the heart pumps more easily.",
        conditionsTreated: "Hypertension (high blood pressure) and heart failure recovery.",
        sideEffects: ["Dry persistent cough", "Dizziness when standing", "Headache"],
        safetyInfo: "Do not use during pregnancy. Avoid high potassium supplements without consulting your doctor.",
      },
      doses: [
        { time: "09:00", dosage: "1 Tablet (10mg)" },
      ],
    },
    {
      name: "Metformin 500mg",
      brandName: "Glucophage",
      barcode: "0093-1048-01",
      source: "openfda",
      aiSummary: {
        purpose: "First-line oral anti-diabetic medicine used to balance blood sugar levels.",
        bodyEffect: "Reduces liver glucose output and enhances cellular sensitivity to your body's natural insulin.",
        conditionsTreated: "Type 2 diabetes mellitus and metabolic glycemic control.",
        sideEffects: ["Mild stomach upset", "Nausea", "Metallic taste in mouth"],
        safetyInfo: "Always take with meals or directly after eating to prevent stomach discomfort.",
      },
      doses: [
        { time: "08:30", dosage: "1 Tablet (500mg)" },
        { time: "19:30", dosage: "1 Tablet (500mg)" },
      ],
    },
    {
      name: "Atorvastatin 20mg",
      brandName: "Lipitor",
      barcode: "0071-0156-23",
      source: "openfda",
      aiSummary: {
        purpose: "Statin medication used to lower LDL (bad) cholesterol and triglycerides in the bloodstream.",
        bodyEffect: "Blocks the HMG-CoA reductase enzyme in the liver that produces cholesterol.",
        conditionsTreated: "High cholesterol, hyperlipidemia, and cardiovascular risk reduction.",
        sideEffects: ["Mild muscle stiffness", "Joint pain", "Digestive discomfort"],
        safetyInfo: "Notify your physician promptly if experiencing unexplained muscle tenderness or severe fatigue.",
      },
      doses: [
        { time: "21:00", dosage: "1 Tablet (20mg)" },
      ],
    },
    {
      name: "Cetirizine 10mg",
      brandName: "Zyrtec",
      barcode: "50580-726-30",
      source: "openfda",
      aiSummary: {
        purpose: "Non-drowsy 2nd generation antihistamine that provides 24-hour relief from allergy symptoms.",
        bodyEffect: "Selectively blocks peripheral histamine H1 receptors, preventing allergic inflammation.",
        conditionsTreated: "Allergic rhinitis, seasonal hay fever, pollen sensitivity, and hives.",
        sideEffects: ["Dry mouth", "Mild drowsiness in sensitive individuals", "Fatigue"],
        safetyInfo: "Limit alcohol consumption while taking antihistamines.",
      },
      doses: [
        { time: "22:00", dosage: "1 Tablet (10mg)" },
      ],
    },
  ];

  const todayStr = new Date().toISOString().split("T")[0];

  for (const item of fakeMedications) {
    const medDoc = await Medication.create({
      userId,
      name: item.name,
      brandName: item.brandName,
      barcode: item.barcode,
      source: item.source,
      aiSummary: item.aiSummary,
    });

    const schedDoc = await Schedule.create({
      userId,
      medicationId: medDoc._id,
      doses: item.doses,
      active: true,
    });

    console.log(`  Added: ${item.name} (${item.doses.length} dose/day schedule)`);

    // Log the first morning dose of Amoxicillin as taken today for realistic dashboard state
    if (item.name.startsWith("Amoxicillin")) {
      await DoseLog.create({
        userId,
        medicationId: medDoc._id,
        scheduleId: schedDoc._id,
        scheduledTime: item.doses[0].time,
        dosage: item.doses[0].dosage,
        status: "taken",
        takenAt: new Date(),
        date: todayStr,
      });
      console.log(`    ↳ Marked ${item.doses[0].time} dose as taken for today (${todayStr})`);
    }
  }

  console.log(`\nSeeding completed successfully!`);
  console.log(`  User: ${user.name} (${user.email})`);
  console.log(`  Medications added: ${fakeMedications.length}`);
  console.log(`  Date logged: ${todayStr}`);
  console.log(`\nYou can now log in or inspect the dashboard to view the populated cabinet and daily doses!\n`);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
