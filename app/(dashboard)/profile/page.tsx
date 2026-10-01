"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User, Mail, Bell, Shield, LogOut, ArrowLeft, Heart } from "lucide-react";
import PushNotificationManager from "@/components/dashboard/PushNotificationManager";

export default function ProfilePage() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Patient Member";
  const userEmail = session?.user?.email || "demo@hackthemedicine.com";

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6 pb-24 sm:pb-12 font-sans selection:bg-clinical-500 selection:text-white">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-slate-700 hover:text-slate-900 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform stroke-[2.5]" />
        Back to Dashboard
      </Link>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-900 shadow-[0_6px_0_0_#0f172a] space-y-6">
        <div className="flex items-center gap-4 pb-5 border-b-2 border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-clinical-100 border-2 border-slate-900 flex items-center justify-center text-clinical-800 shadow-[0_3px_0_0_#0f172a] shrink-0 font-black text-xl">
            <User className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div className="overflow-hidden">
            <span className="bg-emerald-100 border border-slate-900 text-emerald-950 px-2 py-0.5 rounded-md text-[10px] font-black uppercase">
              ACTIVE ACCOUNT
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 truncate">
              {userName}
            </h1>
            <p className="text-xs font-bold text-slate-500 flex items-center gap-1 mt-0.5 truncate">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              {userEmail}
            </p>
          </div>
        </div>

        {/* Notifications Setting */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-clinical-600" />
            Device Notification Engine
          </h3>
          <PushNotificationManager />
        </div>

        {/* App Info & Safety */}
        <div className="p-4 bg-sky-50 rounded-2xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] space-y-2 text-xs">
          <div className="flex items-center gap-2 font-black text-sky-900">
            <Shield className="w-4 h-4 stroke-[2.5]" />
            <span>AI Safety Guidelines</span>
          </div>
          <p className="text-slate-700 font-bold leading-relaxed">
            Hack The Medicine uses official openFDA data and Google Gemini AI to translate pharmaceutical jargon into plain English. Always follow your prescribing healthcare practitioner&apos;s direct instructions.
          </p>
        </div>

        {/* Logout */}
        <div className="pt-2">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-800 font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-slate-900 shadow-[0_4px_0_0_#0f172a] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 stroke-[2.5]" />
            SIGN OUT OF ACCOUNT
          </button>
        </div>
      </div>
    </div>
  );
}
