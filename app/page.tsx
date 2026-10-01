import Image from "next/image";
import Link from "next/link";
import {
  ScanLine,
  Sparkles,
  Clock,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  BellRing,
  AlertTriangle,
  Check,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-900 font-sans selection:bg-clinical-500 selection:text-white flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b-2 border-slate-900 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-clinical-50 border-2 border-slate-900 p-1 flex items-center justify-center shadow-[0_3px_0_0_#0f172a] group-hover:translate-y-0.5 group-hover:shadow-[0_1px_0_0_#0f172a] transition-all">
              <Image
                src="/logo.png"
                alt="Hack The Medicine Logo"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              Hack The Medicine
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors"
            >
              LOG IN
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 text-xs font-black tracking-wider uppercase text-white bg-clinical-500 hover:bg-clinical-400 rounded-2xl border-2 border-slate-900 shadow-[0_4px_0_0_#0f172a] active:translate-y-1 active:shadow-none transition-all"
            >
              GET STARTED
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24 space-y-20 md:space-y-28 flex-1 w-full">
        {/* Hero Section */}
        <section className="text-center max-w-2xl mx-auto pt-6">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Understand your medicine in{" "}
              <span className="text-clinical-600 underline decoration-clinical-300 decoration-wavy underline-offset-8">
                plain English
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed max-w-xl mx-auto">
              Scan any prescription or medicine package to decode body effects,
              dosages, and get real-time safety and overdue dosage alerts.
            </p>
          </div>

          <div className="pt-10 md:pt-12 pb-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-slate-900 shadow-[0_4px_0_0_#0f172a] active:translate-y-1 active:shadow-none transition-all"
            >
              START SCANNING FREE
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Link>
          </div>
        </section>

        {/* Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tile 1: Safety Engine Banner */}
          <div className="md:col-span-3 bg-rose-50/80 rounded-3xl p-6 sm:p-8 border-2 border-slate-900 shadow-[0_6px_0_0_#0f172a] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 border-2 border-slate-900 flex items-center justify-center text-rose-600 shadow-[0_3px_0_0_#0f172a] shrink-0">
                  <BellRing className="w-6 h-6 stroke-[2.5] animate-bounce" />
                </div>
                <div>
                  <span className="bg-rose-200 border border-slate-900 text-rose-900 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider">
                    SAFETY ENGINE
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    Real-Time Dosage & Overdue Alert System
                  </h3>
                </div>
              </div>
              <p className="text-xs font-bold text-slate-600 max-w-md">
                Never double-dose or miss critical prescription timings. Receive
                immediate tactile alerts for overdue medications with one-tap
                status logging.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border-2 border-slate-900 shadow-[0_3px_0_0_#0f172a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-100 border-2 border-slate-900 flex items-center justify-center text-rose-600 shrink-0">
                  <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-rose-500 text-white px-2 py-0.5 rounded-md text-[10px] font-black uppercase">
                      OVERDUE 45 MINS
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      Amoxicillin 500mg
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-600">
                    Take 1 capsule with full glass of water after food.
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-400 text-slate-900 font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a]">
                <Check className="w-4 h-4 stroke-[3]" />
                LOG AS TAKEN
              </div>
            </div>
          </div>

          {/* Tile 2: Point, Scan & Decode */}
          <div className="md:col-span-2 bg-white rounded-3xl p-8 border-2 border-slate-900 shadow-[0_6px_0_0_#0f172a] flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 border-2 border-slate-900 flex items-center justify-center text-sky-600 shadow-[0_3px_0_0_#0f172a]">
                <ScanLine className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Point, Scan & Decode
              </h3>
              <p className="text-slate-600 font-medium text-sm leading-relaxed">
                Scan package barcodes or type the medicine name. Our engine
                queries official openFDA databases and converts complex medical
                leaflets into plain English.
              </p>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-900 text-emerald-900 font-bold text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Instant FDA database lookups with clear body-effect breakdowns
              </span>
            </div>
          </div>

          {/* Tile 3: Gemini AI 5-Point Clarity */}
          <div className="bg-clinical-500 text-white rounded-3xl p-8 border-2 border-slate-900 shadow-[0_6px_0_0_#0f172a] flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-900 flex items-center justify-center text-clinical-600 shadow-[0_3px_0_0_#0f172a]">
                <Sparkles className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h3 className="text-2xl font-black text-white">5-Point Clarity</h3>
              <p className="text-clinical-100 font-medium text-sm leading-relaxed">
                Gemini AI summarizes medicine into 5 facts: purpose, body effect,
                treated conditions, side effects, and warnings.
              </p>
            </div>

            <div className="pt-3 border-t-2 border-clinical-400/50 flex items-center gap-2 text-xs font-bold text-clinical-100">
              <ShieldAlert className="w-4 h-4 text-white" /> Medical Safety
              Guidelines
            </div>
          </div>

          {/* Tile 4: CTA Banner */}
          <div className="md:col-span-3 bg-emerald-400 rounded-3xl p-8 border-2 border-slate-900 shadow-[0_6px_0_0_#0f172a] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-900 flex items-center justify-center text-emerald-700 shadow-[0_3px_0_0_#0f172a] mx-auto sm:mx-0">
                <Clock className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Ready to organize your daily medications?
              </h3>
              <p className="text-slate-900 font-bold text-sm leading-relaxed max-w-xl">
                Set dose schedules, track streaks, and scan prescriptions for
                free.
              </p>
            </div>

            <Link
              href="/register"
              className="px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-slate-900 shadow-[0_4px_0_0_#0f172a] active:translate-y-1 active:shadow-none transition-all whitespace-nowrap"
            >
              CREATE YOUR CABINET NOW
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-slate-900 bg-white py-6 text-center">
        <p className="text-xs font-extrabold text-slate-600 tracking-wide">
          © {new Date().getFullYear()} Hack The Medicine • Simple & Tactile Healthcare Intelligence
        </p>
      </footer>
    </div>
  );
}