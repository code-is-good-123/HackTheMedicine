"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, Loader2, ArrowRight, AlertTriangle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7FB] px-4 py-12 selection:bg-clinical-500 selection:text-white">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border-2 border-slate-900 shadow-[0_6px_0_0_#0f172a]">

        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block group">
            <div className="w-14 h-14 rounded-2xl bg-clinical-50 border-2 border-slate-900 p-2 flex items-center justify-center shadow-[0_3px_0_0_#0f172a] group-hover:translate-y-0.5 group-hover:shadow-[0_1px_0_0_#0f172a] transition-all mx-auto">
              <Image
                src="/logo.png"
                alt="Hack The Medicine Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
          </Link>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Welcome back!
          </h2>
          <p className="text-xs font-bold text-slate-500">
            Log in to manage your medication cabinet and track daily doses.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-100 border-2 border-slate-900 text-rose-900 px-4 py-3 rounded-2xl text-xs font-bold shadow-[0_3px_0_0_#0f172a] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 stroke-[2.5]" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5 stroke-[2.5]" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-900 rounded-2xl text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-400 shadow-[0_2px_0_0_#0f172a] transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5 stroke-[2.5]" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-900 rounded-2xl text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-400 shadow-[0_2px_0_0_#0f172a] transition-all text-sm"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-slate-900 shadow-[0_4px_0_0_#0f172a] active:translate-y-1 active:shadow-none transition-all disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  LOGGING IN...
                </>
              ) : (
                <>
                  SIGN IN
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs font-bold text-slate-500 pt-3 border-t-2 border-slate-100">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-black text-clinical-600 hover:text-clinical-700 underline decoration-2 underline-offset-4"
          >
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
}
