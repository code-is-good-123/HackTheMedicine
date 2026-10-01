"use client";

import { useState } from "react";
import { Plus, Trash2, Clock, Check, Loader2 } from "lucide-react";

interface ScheduleFormProps {
  medicationName: string;
  onSaveSchedule: (doses: Array<{ time: string; dosage: string }>) => Promise<void>;
  isSaving?: boolean;
}

export default function ScheduleForm({
  medicationName,
  onSaveSchedule,
  isSaving = false,
}: ScheduleFormProps) {
  const [doses, setDoses] = useState<Array<{ time: string; dosage: string }>>([
    { time: "08:00", dosage: "1 Dose" },
  ]);

  const addDose = () => {
    setDoses([...doses, { time: "20:00", dosage: "1 Dose" }]);
  };

  const removeDose = (index: number) => {
    if (doses.length > 1) {
      setDoses(doses.filter((_, i) => i !== index));
    }
  };

  const updateDose = (index: number, field: "time" | "dosage", value: string) => {
    const updated = [...doses];
    updated[index][field] = value;
    setDoses(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveSchedule(doses);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-5 rounded-3xl border-2 border-slate-900 shadow-[0_4px_0_0_#0f172a]">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-black text-slate-900">Set Dosage Schedule</h4>
          <p className="text-xs text-slate-500 font-bold">
            Configure daily reminder alerts for {medicationName}
          </p>
        </div>
        <button
          type="button"
          onClick={addDose}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-900 font-black text-xs uppercase rounded-xl border border-slate-900 shadow-[0_2px_0_0_#0f172a]"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add Dose
        </button>
      </div>

      <div className="space-y-3">
        {doses.map((dose, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl border-2 border-slate-900"
          >
            <Clock className="w-4 h-4 text-slate-500 shrink-0" />
            <input
              type="time"
              required
              value={dose.time}
              onChange={(e) => updateDose(idx, "time", e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl font-black text-slate-900 text-xs focus:outline-none"
            />
            <input
              type="text"
              required
              value={dose.dosage}
              onChange={(e) => updateDose(idx, "dosage", e.target.value)}
              placeholder="e.g. 1 Tablet (500mg)"
              className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 text-xs focus:outline-none placeholder:text-slate-400"
            />
            {doses.length > 1 && (
              <button
                type="button"
                onClick={() => removeDose(idx)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-slate-900 shadow-[0_3px_0_0_#0f172a] active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50"
      >
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            SAVING TO CABINET...
          </>
        ) : (
          <>
            <Check className="w-4 h-4 stroke-[3]" />
            SAVE MEDICINE & SET SCHEDULE
          </>
        )}
      </button>
    </form>
  );
}
