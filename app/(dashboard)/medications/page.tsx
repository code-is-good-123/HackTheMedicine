"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MedicationCard from "@/components/dashboard/MedicationCard";
import { Pill, Plus, Search, Loader2 } from "lucide-react";

export default function MedicationsPage() {
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      const res = await fetch("/api/medications");
      if (res.ok) {
        const json = await res.json();
        setMedications(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load medications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/medications/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMedications((prev) => prev.filter((m) => m._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete medication:", err);
    }
  };

  const filteredMeds = medications.filter(
    (m) =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.brandName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 pb-24 sm:pb-12 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-900 shadow-[0_6px_0_0_#0f172a]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-clinical-100 border border-slate-900 text-clinical-900 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider">
              MY PRESCRIPTION CABINET
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Active Medications ({medications.length})
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500">
            Manage your prescriptions, view simplified AI medical explanations, and monitor dose logs.
          </p>
        </div>

        <Link
          href="/scan"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-slate-900 shadow-[0_3px_0_0_#0f172a] active:translate-y-0.5 active:shadow-none transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          ADD OR SCAN MEDICINE
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="relative max-w-md">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4 stroke-[2.5]" />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter medications by name or brand..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-slate-900 rounded-2xl text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[0_2px_0_0_#0f172a] text-xs"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-clinical-600" />
          <span className="text-xs font-bold">Loading your cabinet...</span>
        </div>
      ) : filteredMeds.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-slate-900 shadow-[0_4px_0_0_#0f172a] p-8 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 border-2 border-slate-900 flex items-center justify-center text-slate-400 mx-auto shadow-[0_2px_0_0_#0f172a]">
            <Pill className="w-8 h-8 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">
              {search ? "No matching medications" : "Your cabinet is currently empty"}
            </h3>
            <p className="text-xs text-slate-500 font-semibold max-w-sm mx-auto mt-1">
              {search
                ? `No medication matches "${search}". Try searching for another name.`
                : "Scan a barcode or enter your medicine name to add it to your daily routine."}
            </p>
          </div>
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 px-5 py-3 bg-clinical-500 hover:bg-clinical-400 text-white font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-slate-900 shadow-[0_3px_0_0_#0f172a] active:translate-y-0.5 active:shadow-none"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            SCAN FIRST MEDICINE
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMeds.map((med) => (
            <MedicationCard key={med._id} medication={med} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
