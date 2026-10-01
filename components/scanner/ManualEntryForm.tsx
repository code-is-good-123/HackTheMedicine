"use client";

import { useState } from "react";
import { Search, Sparkles, Loader2 } from "lucide-react";

interface ManualEntryFormProps {
  onSubmit: (name: string) => void;
  isLoading?: boolean;
}

const COMMON_MEDICINES = [
  "Amoxicillin",
  "Paracetamol",
  "Ibuprofen",
  "Metformin",
  "Cetirizine",
  "Omeprazole",
  "Azithromycin",
  "Atorvastatin",
];

export default function ManualEntryForm({ onSubmit, isLoading = false }: ManualEntryFormProps) {
  const [medName, setMedName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (medName.trim()) {
      onSubmit(medName.trim());
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
            Medicine Name or Brand
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5 stroke-[2.5]" />
            </span>
            <input
              type="text"
              required
              value={medName}
              onChange={(e) => setMedName(e.target.value)}
              placeholder="e.g. Amoxicillin, Tylenol, Advil, Cetirizine..."
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-900 rounded-2xl text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-400 shadow-[0_2px_0_0_#0f172a] text-sm transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !medName.trim()}
          className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-clinical-500 hover:bg-clinical-400 text-white font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-slate-900 shadow-[0_4px_0_0_#0f172a] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              DECODING MEDICINE...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
              DECODE MEDICINE WITH AI
            </>
          )}
        </button>
      </form>

      {/* Suggested Medicines */}
      <div className="space-y-2">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
          Or Select a Common Medicine:
        </span>
        <div className="flex flex-wrap gap-2">
          {COMMON_MEDICINES.map((med) => (
            <button
              key={med}
              type="button"
              onClick={() => {
                setMedName(med);
                onSubmit(med);
              }}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              {med}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
