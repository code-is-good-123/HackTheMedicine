"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import StepByStepAddMedicine from "@/components/scanner/StepByStepAddMedicine";

export default function ScanPage() {
  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6 pb-24 sm:pb-12 font-sans selection:bg-clinical-500 selection:text-white">
      {/* Back button */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-slate-700 hover:text-slate-900 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform stroke-[2.5]" />
          Back to Dashboard
        </Link>
      </div>

      <StepByStepAddMedicine
        onComplete={() => {
          window.location.href = "/dashboard";
        }}
        onCancel={() => {
          window.location.href = "/dashboard";
        }}
      />
    </div>
  );
}
