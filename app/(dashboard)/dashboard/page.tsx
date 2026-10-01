"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BentoCard from "@/components/ui/BentoCard";
import TodayDosesGrid from "@/components/dashboard/TodayDosesGrid";
import AlertBanner from "@/components/dashboard/AlertBanner";
import PushNotificationManager from "@/components/dashboard/PushNotificationManager";
import StatsBento from "@/components/dashboard/StatsBento";
import QuickScanCTA from "@/components/dashboard/QuickScanCTA";
import MedicationCard from "@/components/dashboard/MedicationCard";
import Modal from "@/components/ui/Modal";
import StepByStepAddMedicine from "@/components/scanner/StepByStepAddMedicine";
import { Pill, Plus, ArrowRight, Sparkles } from "lucide-react";

export default function DashboardPage() {
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

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 pb-24 sm:pb-10 font-sans selection:bg-clinical-500 selection:text-white">
      {/* Top Banner: Medication Alerts */}
      <AlertBanner />

      {/* Push Notification Manager & Activator */}
      <PushNotificationManager />

      {/* Main Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Today's Dosage Tracker (Spans 2 cols) */}
        <BentoCard className="md:col-span-2 lg:col-span-2 bg-white p-6 sm:p-7 rounded-3xl shadow-[0_6px_0_0_#0f172a]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="bg-clinical-100 border border-slate-900 text-clinical-900 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider">
                DAILY SCHEDULE
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                Today&apos;s Doses
              </h2>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add Dose
            </button>
          </div>
          <TodayDosesGrid />
        </BentoCard>

        {/* Quick Scan Action Tile */}
        <BentoCard className="bg-gradient-to-br from-clinical-600 via-clinical-700 to-slate-900 text-white p-6 sm:p-7 rounded-3xl shadow-[0_6px_0_0_#0f172a] flex flex-col justify-between">
          <QuickScanCTA />
        </BentoCard>

        {/* Adherence & Streak Stats */}
        <BentoCard className="bg-white p-6 sm:p-7 rounded-3xl shadow-[0_6px_0_0_#0f172a]">
          <StatsBento />
        </BentoCard>

        {/* Recently Added Medications */}
        <BentoCard className="md:col-span-3 lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl shadow-[0_6px_0_0_#0f172a] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-clinical-50 border-2 border-slate-900 flex items-center justify-center text-clinical-600 shadow-[0_3px_0_0_#0f172a] shrink-0">
                <Pill className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="bg-emerald-100 border border-slate-900 text-emerald-950 px-2 py-0.5 rounded-md text-[10px] font-black uppercase">
                  CABINET INVENTORY
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Active Prescriptions ({medications.length})
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-slate-900 shadow-[0_4px_0_0_#0f172a] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 stroke-[2.5]" />
                ADD MEDICINE
              </button>

              <Link
                href="/medications"
                className="inline-flex items-center gap-1.5 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-slate-900 shadow-[0_4px_0_0_#0f172a] active:translate-y-1 active:shadow-none transition-all"
              >
                VIEW ALL <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs font-bold text-slate-400">
              Loading active medications...
            </div>
          ) : medications.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-300 p-6 space-y-3">
              <Pill className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-base font-black text-slate-800">Your cabinet is currently empty</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-semibold">
                Scan package barcodes or enter any medicine name to decode leaf-lets and track your doses.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-clinical-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-slate-900 shadow-[0_3px_0_0_#0f172a]"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> Add Your First Medicine
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {medications.slice(0, 3).map((med) => (
                <MedicationCard key={med._id} medication={med} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </BentoCard>
      </div>

      {/* Modal for Step-by-Step Add Medicine */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Medicine"
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
