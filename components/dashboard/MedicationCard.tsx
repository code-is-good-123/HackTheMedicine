"use client";

import Link from "next/link";
import { Pill, AlertCircle, ArrowRight, Trash2 } from "lucide-react";
import AlertBadge from "@/components/ui/AlertBadge";

interface MedicationCardProps {
  medication: {
    _id: string;
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
  };
  onDelete?: (id: string) => void;
}

export default function MedicationCard({ medication, onDelete }: MedicationCardProps) {
  return (
    <div className="bg-white p-5 rounded-3xl border-2 border-slate-900 shadow-[0_4px_0_0_#0f172a] hover:translate-y-[-2px] transition-all flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-clinical-100 border-2 border-slate-900 flex items-center justify-center text-clinical-800 shadow-[0_2px_0_0_#0f172a] shrink-0">
              <Pill className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-snug">
                {medication.name}
              </h3>
              {medication.brandName && medication.brandName !== medication.name && (
                <p className="text-xs font-bold text-slate-500">
                  Brand: {medication.brandName}
                </p>
              )}
            </div>
          </div>

          <AlertBadge
            type={medication.source === "openfda" ? "success" : "info"}
            className="shrink-0"
          >
            {medication.source === "openfda" ? "FDA Verified" : "AI Summarized"}
          </AlertBadge>
        </div>

        {/* 5-Point Summary Preview */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
          <div>
            <span className="font-black text-slate-900 uppercase text-[10px] tracking-wider block">
              What it does:
            </span>
            <p className="text-slate-700 font-medium line-clamp-2">
              {medication.aiSummary?.purpose || "Prescribed medication."}
            </p>
          </div>

          {medication.aiSummary?.safetyInfo && (
            <div className="flex items-center gap-1.5 text-rose-700 font-bold text-[11px] pt-1 border-t border-slate-200">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{medication.aiSummary.safetyInfo}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t-2 border-slate-100">
        <Link
          href={`/medications/${medication._id}`}
          className="inline-flex items-center gap-1 text-xs font-black text-clinical-600 hover:text-clinical-700 group"
        >
          View 5-Point Details
          <ArrowRight className="w-3.5 h-3.5 stroke-[3] group-hover:translate-x-1 transition-transform" />
        </Link>

        {onDelete && (
          <button
            onClick={() => onDelete(medication._id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            title="Remove from cabinet"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
