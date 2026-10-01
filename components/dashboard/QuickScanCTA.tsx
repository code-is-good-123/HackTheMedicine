"use client";

import Link from "next/link";
import { ScanLine, Sparkles, ArrowRight } from "lucide-react";

export default function QuickScanCTA() {
  return (
    <div className="flex flex-col justify-between h-full space-y-4">
      <div className="space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-white shadow-sm">
          <ScanLine className="w-6 h-6 stroke-[2.5]" />
        </div>
        <span className="inline-block px-2.5 py-0.5 rounded-lg bg-white/20 text-[10px] font-black uppercase tracking-wider text-white">
          INSTANT AI DECODE
        </span>
        <h3 className="text-xl font-black text-white leading-tight">
          Scan or Type Medicine Name
        </h3>
        <p className="text-xs text-white/80 font-semibold leading-relaxed">
          Point your camera at a barcode, or enter any medicine name to decode FDA leaflets into plain English.
        </p>
      </div>

      <Link
        href="/scan"
        className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-slate-900 shadow-[0_3px_0_0_#0f172a] active:translate-y-1 active:shadow-none transition-all"
      >
        <Sparkles className="w-4 h-4 stroke-[2.5]" />
        SCAN MEDICINE
        <ArrowRight className="w-4 h-4 stroke-[3]" />
      </Link>
    </div>
  );
}
