"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { LogOut, QrCode, Pill, LayoutDashboard } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-slate-900 px-4 sm:px-6 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-clinical-50 border-2 border-slate-900 p-1 flex items-center justify-center shadow-[0_2px_0_0_#0f172a] group-hover:translate-y-0.5 group-hover:shadow-none transition-all">
            <Image
              src="/logo.png"
              alt="Hack The Medicine Logo"
              width={28}
              height={28}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 block leading-tight">
              Hack The Medicine
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Dosage & Safety Engine
            </span>
          </div>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-black uppercase text-slate-700 hover:text-slate-900 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>

          <Link
            href="/medications"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-black uppercase text-slate-700 hover:text-slate-900 transition-colors"
          >
            <Pill className="w-4 h-4" />
            Cabinet
          </Link>

          <Link
            href="/scan"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-clinical-500 hover:bg-clinical-400 text-white font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] active:translate-y-0.5 active:shadow-none transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">SCAN MEDICINE</span>
            <span className="sm:hidden">SCAN</span>
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </header>
  );
}
