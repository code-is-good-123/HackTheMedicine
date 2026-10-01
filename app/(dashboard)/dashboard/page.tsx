"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BentoCard from "@/components/ui/BentoCard";
import TodayDosesGrid from "@/components/dashboard/TodayDosesGrid";
import AlertBanner from "@/components/dashboard/AlertBanner";
import PushNotificationManager from "@/components/dashboard/PushNotificationManager";
import MedicationCard from "@/components/dashboard/MedicationCard";
import Modal from "@/components/ui/Modal";
import StepByStepAddMedicine from "@/components/scanner/StepByStepAddMedicine";
import { Pill, Plus, ArrowRight, Clock, Calendar } from "lucide-react";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    loadMeds();
  }, []);

  const loadMeds = () => {
    fetch("/api/medications")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((json) => setMedications(json.data || []))
      .catch((err) => console.warn("Failed to fetch meds:", err))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/medications/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMedications((prev) => prev.filter((m) => m._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete med:", err);
    }
  };

  const todayDateString = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const userName = session?.user?.name || "Patient";

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6 pb-24 sm:pb-12 font-sans selection:bg-clinical-500 selection:text-white">
      {/* Dynamic Overdue Alert Banner (Only appears when an overdue dose exists) */}
      <AlertBanner />

      {/* Top Greeting & Action Header */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-slate-900 shadow-[0_4px_0_0_#0f172a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-clinical-100 border border-slate-900 text-clinical-900 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3 stroke-[2.5]" />
              {todayDateString}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Welcome, {userName}
          </h1>
          <p className="text-xs font-bold text-slate-500">
            Track daily doses, check verified FDA leaflets, and receive timely alerts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Subtle compact push notification toggle */}
          <PushNotificationManager variant="compact" />

          {/* Primary Add Medicine CTA */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-slate-900 shadow-[0_3px_0_0_#0f172a] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            ADD MEDICINE
          </button>
        </div>
      </div>

      {/* Main 2-Column Clean Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Schedule (7 cols on lg) */}
        <BentoCard className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl shadow-[0_4px_0_0_#0f172a] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-clinical-600 stroke-[2.5]" />
                <h2 className="text-lg font-black text-slate-900">
                  Today&apos;s Doses
                </h2>
              </div>
              <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-800 border border-slate-900 px-2 py-0.5 rounded-md">
                SCHEDULE
              </span>
            </div>

            <TodayDosesGrid />
          </div>
        </BentoCard>

        {/* Right Column: Active Cabinet (5 cols on lg) */}
        <BentoCard className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl shadow-[0_4px_0_0_#0f172a] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-clinical-600 stroke-[2.5]" />
              <h2 className="text-lg font-black text-slate-900">
                Prescription Cabinet
              </h2>
            </div>
            <Link
              href="/medications"
              className="text-xs font-black text-clinical-600 hover:text-clinical-700 inline-flex items-center gap-1 group"
            >
              All ({medications.length})
              <ArrowRight className="w-3.5 h-3.5 stroke-[3] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs font-bold text-slate-400">
              Loading cabinet from database...
            </div>
          ) : medications.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-5 space-y-3">
              <Pill className="w-8 h-8 text-slate-400 mx-auto" />
              <div>
                <p className="text-sm font-black text-slate-800">Cabinet is Empty</p>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Scan a barcode or enter a medicine name to add it to your daily routine.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-clinical-500 hover:bg-clinical-400 text-white font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add Medicine
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {medications.slice(0, 3).map((med) => (
                <MedicationCard key={med._id} medication={med} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </BentoCard>
      </div>

      {/* Step-by-Step Add Medicine Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Medicine"
      >
        <StepByStepAddMedicine
          onComplete={() => {
            setIsAddModalOpen(false);
            loadMeds();
          }}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
