"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AlertBadge from "@/components/ui/AlertBadge";
import {
  ArrowLeft,
  Pill,
  Clock,
  Trash2,
  Info,
  HeartHandshake,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Loader2,
} from "lucide-react";

export default function MedicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [medication, setMedication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/medications/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data) {
          setMedication(data.data);
        }
      })
      .catch((err) => console.warn("Failed to load medication:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to remove this medication from your cabinet?")) {
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(`/api/medications/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/medications");
      }
    } catch (err) {
      console.error("Failed to delete medication:", err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-clinical-600" />
        <span className="text-xs font-bold">Loading medication details...</span>
      </div>
    );
  }

  if (!medication) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4">
        <h2 className="text-xl font-black text-slate-900">Medication Not Found</h2>
        <p className="text-xs font-bold text-slate-500">
          This medication may have been deleted or the link is invalid.
        </p>
        <Link
          href="/medications"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-clinical-500 text-white font-black text-xs uppercase rounded-xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cabinet
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 pb-24 sm:pb-12 font-sans">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/medications"
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-slate-600 hover:text-slate-900 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Cabinet
        </Link>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 font-black text-xs uppercase rounded-xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          {deleting ? "REMOVING..." : "DELETE FROM CABINET"}
        </button>
      </div>

      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-900 shadow-[0_6px_0_0_#0f172a] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-clinical-50 border-2 border-slate-900 flex items-center justify-center text-clinical-600 shadow-[0_3px_0_0_#0f172a] shrink-0">
              <Pill className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AlertBadge type={medication.source === "openfda" ? "success" : "info"}>
                  {medication.source === "openfda" ? "FDA Verified" : "AI Summarized"}
                </AlertBadge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {medication.name}
              </h1>
              {medication.brandName && medication.brandName !== medication.name && (
                <p className="text-xs font-bold text-slate-500">
                  Brand Name: <span className="text-slate-800">{medication.brandName}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5-Point Clarity Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-900 shadow-[0_6px_0_0_#0f172a] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
          <h3 className="text-lg font-black text-slate-900">
            5-Point Plain English Clarity Breakdown
          </h3>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-clinical-100 text-clinical-900 border border-slate-900 rounded-md">
            GRADE 10 LANGUAGE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Point 1 */}
          <div className="p-4 bg-sky-50 rounded-2xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] space-y-1.5">
            <div className="flex items-center gap-1.5 text-sky-700">
              <Info className="w-4 h-4 stroke-[2.5]" />
              <h4 className="text-xs font-black uppercase tracking-wider">1. What It Does (Purpose)</h4>
            </div>
            <p className="text-xs font-bold text-slate-800 leading-relaxed">
              {medication.aiSummary?.purpose || "Prescribed medication."}
            </p>
          </div>

          {/* Point 2 */}
          <div className="p-4 bg-indigo-50 rounded-2xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] space-y-1.5">
            <div className="flex items-center gap-1.5 text-indigo-700">
              <HeartHandshake className="w-4 h-4 stroke-[2.5]" />
              <h4 className="text-xs font-black uppercase tracking-wider">2. How It Works in Your Body</h4>
            </div>
            <p className="text-xs font-bold text-slate-800 leading-relaxed">
              {medication.aiSummary?.bodyEffect || "Works through physiological action."}
            </p>
          </div>

          {/* Point 3 */}
          <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <h4 className="text-xs font-black uppercase tracking-wider">3. Conditions Treated</h4>
            </div>
            <p className="text-xs font-bold text-slate-800 leading-relaxed">
              {medication.aiSummary?.conditionsTreated || "General health conditions."}
            </p>
          </div>

          {/* Point 4 */}
          <div className="p-4 bg-amber-50 rounded-2xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-700">
              <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
              <h4 className="text-xs font-black uppercase tracking-wider">4. Common Side Effects</h4>
            </div>
            <ul className="list-disc list-inside text-xs font-bold text-slate-800 space-y-0.5">
              {(medication.aiSummary?.sideEffects || ["Consult physician"]).map(
                (side: string, i: number) => (
                  <li key={i}>{side}</li>
                )
              )}
            </ul>
          </div>

          {/* Point 5 */}
          <div className="md:col-span-2 p-4 bg-rose-50 rounded-2xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] space-y-1.5">
            <div className="flex items-center gap-1.5 text-rose-700">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              <h4 className="text-xs font-black uppercase tracking-wider">5. Key Safety Warnings & Instructions</h4>
            </div>
            <p className="text-xs font-bold text-rose-950 leading-relaxed">
              {medication.aiSummary?.safetyInfo || "Follow medical practitioner instructions."}
            </p>
          </div>
        </div>
      </div>

      {/* Schedule Details if configured */}
      {medication.schedule?.doses && medication.schedule.doses.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-900 shadow-[0_6px_0_0_#0f172a] space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-clinical-600" />
            <h3 className="text-lg font-black text-slate-900">Current Daily Dose Schedule</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {medication.schedule.doses.map((dose: any, i: number) => (
              <div
                key={i}
                className="p-3.5 bg-slate-50 rounded-2xl border-2 border-slate-900 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-slate-900">{dose.time}</span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-200 text-slate-800">
                    {dose.dosage}
                  </span>
                </div>
                <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-slate-900">
                  ACTIVE
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
