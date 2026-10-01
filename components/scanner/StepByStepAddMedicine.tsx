"use client";

import { useState } from "react";
import {
  QrCode,
  Search,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Clock,
  Plus,
  Trash2,
  AlertTriangle,
  Info,
  HeartHandshake,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  Pill,
} from "lucide-react";
import BarcodeScanner from "@/components/scanner/BarcodeScanner";
import AlertBadge from "@/components/ui/AlertBadge";

interface StepByStepAddMedicineProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

const COMMON_PRESETS = [
  "Amoxicillin",
  "Paracetamol",
  "Ibuprofen",
  "Metformin",
  "Cetirizine",
  "Omeprazole",
];

export default function StepByStepAddMedicine({
  onComplete,
  onCancel,
}: StepByStepAddMedicineProps) {
  // Step 1: Choose method & Enter/Scan
  // Step 2: AI Decode Review (5-Point Clarity)
  // Step 3: Set Dose Times & Quantity
  // Step 4: Success Celebration
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [inputMethod, setInputMethod] = useState<"name" | "barcode">("name");
  const [medName, setMedName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Decoded medicine info
  const [decodedMed, setDecodedMed] = useState<{
    _id?: string;
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
  } | null>(null);

  // Dosage times
  const [doses, setDoses] = useState<Array<{ time: string; dosage: string }>>([
    { time: "08:00", dosage: "1 Tablet" },
  ]);
  const [saving, setSaving] = useState(false);

  // Handle Scan or Name Submit
  const handleDecode = async (queryParam: { barcode?: string; manualName?: string }) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(queryParam),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to decode medicine.");
      }

      setDecodedMed(data.medicine);
      setStep(2);
    } catch (err: any) {
      setError(err?.message || "Failed to process medicine details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    if (!decodedMed) return;
    setSaving(true);
    setError("");

    try {
      // 1. Save Medication
      const medRes = await fetch("/api/medications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(decodedMed),
      });
      const medJson = await medRes.json();
      const savedMedId = medJson.data?._id || decodedMed._id;

      // 2. Save Schedule
      if (savedMedId) {
        await fetch("/api/schedules", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            medicationId: savedMedId,
            doses,
          }),
        });
      }

      setStep(4);
    } catch (err: any) {
      setError(err?.message || "Could not save schedule. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const addDoseRow = () => {
    setDoses([...doses, { time: "20:00", dosage: "1 Tablet" }]);
  };

  const removeDoseRow = (idx: number) => {
    if (doses.length > 1) {
      setDoses(doses.filter((_, i) => i !== idx));
    }
  };

  const updateDose = (idx: number, field: "time" | "dosage", val: string) => {
    const updated = [...doses];
    updated[idx][field] = val;
    setDoses(updated);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[0_6px_0_0_#0f172a] p-6 sm:p-8 space-y-6">
      {/* Duolingo-style Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-500">
          <span>
            {step === 1 && "Step 1 of 3: Enter Medicine"}
            {step === 2 && "Step 2 of 3: AI Clarity Check"}
            {step === 3 && "Step 3 of 3: Set Doses & Schedule"}
            {step === 4 && "All Done! 🎉"}
          </span>
          <span className="text-emerald-600 font-extrabold">
            {step === 1 && "33%"}
            {step === 2 && "66%"}
            {step === 3 && "90%"}
            {step === 4 && "100%"}
          </span>
        </div>

        <div className="w-full h-3.5 bg-slate-100 border-2 border-slate-900 rounded-full p-0.5 overflow-hidden shadow-inner">
          <div
            className="h-full bg-emerald-400 rounded-full transition-all duration-300 border-r border-slate-900"
            style={{
              width:
                step === 1 ? "33%" : step === 2 ? "66%" : step === 3 ? "90%" : "100%",
            }}
          />
        </div>
      </div>

      {/* Error message if any */}
      {error && (
        <div className="bg-rose-100 border-2 border-slate-900 text-rose-900 px-4 py-3 rounded-2xl text-xs font-bold shadow-[0_3px_0_0_#0f172a] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Medicine Input */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-clinical-50 border-2 border-slate-900 p-2 flex items-center justify-center shadow-[0_3px_0_0_#0f172a] mx-auto text-clinical-600">
              <Pill className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              Which medicine are you taking?
            </h2>
            <p className="text-xs font-bold text-slate-500">
              Type the brand or generic name, or scan the package barcode with your camera.
            </p>
          </div>

          {/* Option Selector: Name vs Barcode */}
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            <button
              type="button"
              onClick={() => setInputMethod("name")}
              className={`p-3 rounded-2xl border-2 border-slate-900 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                inputMethod === "name"
                  ? "bg-clinical-500 text-white shadow-[0_4px_0_0_#0f172a] translate-y-[-2px]"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 shadow-[0_2px_0_0_#0f172a]"
              }`}
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              Type Name
            </button>

            <button
              type="button"
              onClick={() => setInputMethod("barcode")}
              className={`p-3 rounded-2xl border-2 border-slate-900 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                inputMethod === "barcode"
                  ? "bg-clinical-500 text-white shadow-[0_4px_0_0_#0f172a] translate-y-[-2px]"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 shadow-[0_2px_0_0_#0f172a]"
              }`}
            >
              <QrCode className="w-4 h-4 stroke-[2.5]" />
              Scan Barcode
            </button>
          </div>

          {/* Type Name View */}
          {inputMethod === "name" && (
            <div className="space-y-5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (medName.trim()) handleDecode({ manualName: medName.trim() });
                }}
                className="space-y-4"
              >
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-5 h-5 stroke-[2.5]" />
                  </span>
                  <input
                    type="text"
                    required
                    value={medName}
                    onChange={(e) => setMedName(e.target.value)}
                    placeholder="e.g. Amoxicillin, Paracetamol, Metformin..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-900 rounded-2xl text-slate-900 font-black placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-400 shadow-[0_3px_0_0_#0f172a] text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !medName.trim()}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-slate-900 shadow-[0_4px_0_0_#0f172a] active:translate-y-1 active:shadow-none transition-all disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      ANALYZING MEDICINE...
                    </>
                  ) : (
                    <>
                      CONTINUE TO CLARITY CHECK
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Preset Pills */}
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                  Quick Select Common Medicines:
                </span>
                <div className="flex flex-wrap gap-2">
                  {COMMON_PRESETS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setMedName(p);
                        handleDecode({ manualName: p });
                      }}
                      className="px-3.5 py-1.5 bg-white hover:bg-clinical-50 text-slate-800 font-black text-xs rounded-xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Scan Barcode View */}
          {inputMethod === "barcode" && (
            <BarcodeScanner
              onDetected={(barcode) => handleDecode({ barcode })}
              isLoading={loading}
            />
          )}
        </div>
      )}

      {/* STEP 2: AI Clarity Review */}
      {step === 2 && decodedMed && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AlertBadge type={decodedMed.source === "openfda" ? "success" : "info"}>
                  {decodedMed.source === "openfda" ? "FDA Verified" : "AI Summarized"}
                </AlertBadge>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {decodedMed.name}
              </h2>
              {decodedMed.brandName && decodedMed.brandName !== decodedMed.name && (
                <p className="text-xs font-bold text-slate-500">
                  Brand Name: {decodedMed.brandName}
                </p>
              )}
            </div>

            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border-2 border-slate-900 flex items-center justify-center text-emerald-700 shadow-[0_2px_0_0_#0f172a] shrink-0">
              <Sparkles className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>

          <p className="text-xs font-black text-slate-500 uppercase tracking-wider">
            Review your 5-point plain English summary:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
            {/* 1. Purpose */}
            <div className="p-4 bg-sky-50 rounded-2xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] space-y-1">
              <div className="flex items-center gap-1.5 text-sky-800 font-black">
                <Info className="w-4 h-4 stroke-[2.5]" />
                <span className="uppercase text-[11px]">1. What It Does</span>
              </div>
              <p className="text-slate-800 font-bold">{decodedMed.aiSummary.purpose}</p>
            </div>

            {/* 2. Body Effect */}
            <div className="p-4 bg-indigo-50 rounded-2xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] space-y-1">
              <div className="flex items-center gap-1.5 text-indigo-800 font-black">
                <HeartHandshake className="w-4 h-4 stroke-[2.5]" />
                <span className="uppercase text-[11px]">2. How It Works in Body</span>
              </div>
              <p className="text-slate-800 font-bold">{decodedMed.aiSummary.bodyEffect}</p>
            </div>

            {/* 3. Conditions */}
            <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-800 font-black">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span className="uppercase text-[11px]">3. Conditions Treated</span>
              </div>
              <p className="text-slate-800 font-bold">{decodedMed.aiSummary.conditionsTreated}</p>
            </div>

            {/* 4. Side Effects */}
            <div className="p-4 bg-amber-50 rounded-2xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] space-y-1">
              <div className="flex items-center gap-1.5 text-amber-800 font-black">
                <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
                <span className="uppercase text-[11px]">4. Common Side Effects</span>
              </div>
              <p className="text-slate-800 font-bold">
                {decodedMed.aiSummary.sideEffects?.join(", ") || "None commonly reported"}
              </p>
            </div>

            {/* 5. Safety */}
            <div className="md:col-span-2 p-4 bg-rose-50 rounded-2xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] space-y-1">
              <div className="flex items-center gap-1.5 text-rose-800 font-black">
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                <span className="uppercase text-[11px]">5. Crucial Safety & Instructions</span>
              </div>
              <p className="text-rose-950 font-bold">{decodedMed.aiSummary.safetyInfo}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-slate-900 shadow-[0_4px_0_0_#0f172a] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 inline mr-1" />
              BACK
            </button>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-slate-900 shadow-[0_4px_0_0_#0f172a] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              SET MY DAILY DOSAGE SCHEDULE
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Dosage & Schedule Configuration */}
      {step === 3 && decodedMed && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="text-center space-y-1">
            <span className="bg-clinical-100 border border-slate-900 text-clinical-900 px-3 py-1 rounded-xl text-[10px] font-black uppercase">
              DOSAGE REMINDER CONFIGURATION
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              When do you take {decodedMed.name}?
            </h2>
            <p className="text-xs font-bold text-slate-500">
              Set the exact times and dosage amounts. Push notifications will alert you on time.
            </p>
          </div>

          <div className="space-y-3">
            {doses.map((dose, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-3.5 bg-slate-50 rounded-2xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-clinical-100 border border-slate-900 flex items-center justify-center text-clinical-800 shrink-0 font-black text-xs">
                    {idx + 1}
                  </div>

                  <div className="flex items-center gap-1.5 bg-white border-2 border-slate-900 rounded-xl px-2.5 py-1.5 shrink-0">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <input
                      type="time"
                      required
                      value={dose.time}
                      onChange={(e) => updateDose(idx, "time", e.target.value)}
                      className="font-black text-slate-900 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    required
                    value={dose.dosage}
                    onChange={(e) => updateDose(idx, "dosage", e.target.value)}
                    placeholder="e.g. 1 Tablet (500mg)"
                    className="flex-1 min-w-0 px-3 py-2 bg-white border-2 border-slate-900 rounded-xl font-bold text-slate-900 text-xs focus:outline-none placeholder:text-slate-400"
                  />

                  {doses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDoseRow(idx)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl border border-transparent hover:border-slate-300 transition-colors cursor-pointer shrink-0"
                      title="Remove dose"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addDoseRow}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-100 hover:bg-sky-200 text-sky-900 font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Add Another Daily Dose
            </button>
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-slate-900 shadow-[0_4px_0_0_#0f172a] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 inline mr-1" />
              BACK
            </button>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={saving}
              className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-slate-900 shadow-[0_4px_0_0_#0f172a] active:translate-y-1 active:shadow-none transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  SAVING TO CABINET...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  SAVE & ACTIVATE REMINDERS
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Success Celebration */}
      {step === 4 && decodedMed && (
        <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 border-2 border-slate-900 flex items-center justify-center text-emerald-700 shadow-[0_4px_0_0_#0f172a] mx-auto">
            <Check className="w-9 h-9 stroke-[3]" />
          </div>

          <div className="space-y-1.5 max-w-sm mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              You&apos;re All Set!
            </h2>
            <p className="text-xs font-bold text-slate-600 leading-relaxed">
              <span className="text-slate-900 font-black">{decodedMed.name}</span> has been added to your active cabinet with {doses.length} daily reminder {doses.length === 1 ? "time" : "times"}.
            </p>
          </div>

          <div className="p-4 bg-emerald-50 border-2 border-slate-900 rounded-2xl text-xs font-bold text-emerald-950 max-w-md mx-auto shadow-[0_2px_0_0_#0f172a]">
            🔔 Push alerts will notify you whenever your dose is due.
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (onComplete) onComplete();
                else window.location.href = "/dashboard";
              }}
              className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-slate-900 shadow-[0_4px_0_0_#0f172a] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              GO TO DASHBOARD
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
