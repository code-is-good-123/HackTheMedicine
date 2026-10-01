import Link from "next/link";
import Image from "next/image"
import {
	Pill,
	ScanLine,
	Sparkles,
	ShieldCheck,
	Clock,
	ArrowRight,
	Activity,
	CheckCircle2,
	HeartPulse,
} from "lucide-react";

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-clinical-500 selection:text-white">
			{/* Top Navbar */}
			<header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/80 px-6 py-4">
				<div className="max-w-6xl mx-auto flex items-center justify-between">
					<div className="flex items-center gap-2.5">
						<div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center p-1.5 border border-slate-200">
							<Image
								src="/logo.png"
								alt="Hack The Medicine Logo"
								width={32}
								height={32}
								className="object-contain"
							/>
						</div>
						<span className="font-bold text-lg tracking-tight text-slate-900">
							Hack The Medicine
						</span>
					</div>

					<div className="flex items-center gap-3">
						<Link
							href="/login"
							className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
						>
							Sign In
						</Link>
						<Link
							href="/register"
							className="px-4 py-2 text-sm font-semibold text-white bg-clinical-500 hover:bg-clinical-600 rounded-xl shadow-md shadow-clinical-500/20 active:scale-95 transition-all"
						>
							Get Started
						</Link>
					</div>
				</div>
			</header>

			{/* Main Content / Bento Hero */}
			<main className="max-w-6xl mx-auto px-6 py-12 md:py-16 space-y-16 flex-1">
				{/* Hero Section */}
				<section className="text-center space-y-6 max-w-3xl mx-auto">
					<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-clinical-50 text-clinical-700 border border-clinical-200 text-xs font-semibold uppercase tracking-wider">
						<Sparkles className="w-4 h-4 text-clinical-500" />
						AI-Powered Medication Intelligence
					</div>

					<h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
						Understand Your Prescriptions in{" "}
						<span className="text-clinical-600">Plain English</span>
					</h1>

					<p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
						Scan any medicine barcode or prescription to instantly translate
						complex medical jargon into clear, actionable body effects, dosage
						schedules, and side effect warnings.
					</p>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
						<Link
							href="/register"
							className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-clinical-500 hover:bg-clinical-600 text-white font-semibold rounded-2xl shadow-lg shadow-clinical-500/25 active:scale-95 transition-all text-sm"
						>
							Start Scanning Free
							<ArrowRight className="w-4 h-4" />
						</Link>
						<Link
							href="/login"
							className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-2xl border border-slate-200 active:scale-95 transition-all text-sm"
						>
							Explore Dashboard
						</Link>
					</div>
				</section>

				{/* Bento Grid Feature Highlights */}
				<section className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* Tile 1: Instant Barcode Scanner */}
					<div className="md:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
						<div className="space-y-4">
							<div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
								<ScanLine className="w-6 h-6" />
							</div>
							<h3 className="text-2xl font-bold text-slate-900">
								Point, Scan & Decode
							</h3>
							<p className="text-slate-600 text-sm leading-relaxed max-w-md">
								Scan UPC barcodes or drug package codes. Our engine checks
								official FDA databases and RxNorm registries in milliseconds to
								fetch accurate pharmacological profiles.
							</p>
						</div>

						<div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4 text-xs font-mono text-slate-500">
							<span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
							<span>
								barcode: 030045044904 → FDA Database hit → Summarizing with
								Gemini AI...
							</span>
						</div>
					</div>

					{/* Tile 2: Plain English Summaries */}
					<div className="bg-gradient-to-br from-clinical-500 to-clinical-700 text-white rounded-3xl p-8 shadow-lg shadow-clinical-500/15 flex flex-col justify-between">
						<div className="space-y-4">
							<div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center">
								<Sparkles className="w-6 h-6" />
							</div>
							<h3 className="text-xl font-bold">Zero Medical Jargon</h3>
							<p className="text-clinical-100 text-sm leading-relaxed">
								No more reading 10-page dense leaflets. Get 5 key insights:
								purpose, body effect, treated conditions, side effects, and
								warnings.
							</p>
						</div>

						<div className="mt-6 pt-4 border-t border-white/20 text-xs text-clinical-100 flex items-center gap-2">
							<ShieldCheck className="w-4 h-4 text-white" /> Verified against
							official openFDA labels
						</div>
					</div>

					{/* Tile 3: Dose Schedules & Reminders */}
					<div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
						<div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
							<Clock className="w-6 h-6" />
						</div>
						<h3 className="text-xl font-bold text-slate-900">
							Smart Timing & Streak Tracker
						</h3>
						<p className="text-slate-600 text-sm leading-relaxed">
							Set custom dose schedules with morning/evening triggers. Keep high
							adherence streaks with one-tap status logs.
						</p>
					</div>

					{/* Tile 4: Clinical Safety Alerts */}
					<div className="md:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
						<div className="space-y-3">
							<div className="inline-flex items-center gap-2 text-rose-600 bg-rose-50 px-3 py-1 rounded-lg text-xs font-semibold">
								<HeartPulse className="w-4 h-4" /> Real-time Alert System
							</div>
							<h3 className="text-xl font-bold text-slate-900">
								Safety First: Overdue & Conflict Alerts
							</h3>
							<p className="text-slate-600 text-sm leading-relaxed max-w-lg">
								Never miss critical medication timings. Recovers missed
								schedules with automated status badges and safety prompts.
							</p>
						</div>

						<div className="w-full sm:w-48 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
							<div className="flex items-center justify-between text-xs">
								<span className="font-semibold text-slate-700">
									Adherence Score
								</span>
								<span className="text-emerald-600 font-bold">96%</span>
							</div>
							<div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
								<div className="bg-emerald-500 h-full w-[96%]" />
							</div>
							<p className="text-[10px] text-slate-400 text-right">
								12-day active streak
							</p>
						</div>
					</div>
				</section>

				{/* Value List Banner */}
				<section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
					<div className="space-y-2 text-center md:text-left">
						<h3 className="text-2xl font-bold text-slate-900">
							Ready to simplify your medicine intake?
						</h3>
						<p className="text-sm text-slate-500">
							Free to use, privacy-focused, and built with clinical clarity.
						</p>
					</div>

					<Link
						href="/register"
						className="px-6 py-3.5 bg-clinical-500 hover:bg-clinical-600 text-white font-semibold rounded-2xl shadow-md shadow-clinical-500/20 active:scale-95 transition-all text-sm whitespace-nowrap"
					>
						Create Your Cabinet Now
					</Link>
				</section>
			</main>

			{/* Minimal Footer */}
			<footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
				<p>
					© {new Date().getFullYear()} Hack The Medicine. Built for clear
					medical intelligence.
				</p>
			</footer>
		</div>
	);
}
