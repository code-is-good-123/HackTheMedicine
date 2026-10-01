"use client";

import { useEffect, useState, useCallback } from "react";
import { Check, Clock, Pill, Loader2 } from "lucide-react";

interface ScheduleDose {
  scheduleId: string;
  medicationId: string;
  medicationName: string;
  time: string;
  dosage: string;
  status: "taken" | "pending" | "skipped";
}

export default function TodayDosesGrid() {
  const [doses, setDoses] = useState<ScheduleDose[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingTime, setUpdatingTime] = useState<string | null>(null);

  const loadDoses = useCallback(async () => {
    try {
      const todayStr = new Date().toISOString().split("T")[0];
      const [schedRes, logRes] = await Promise.all([
        fetch("/api/schedules"),
        fetch(`/api/schedules/log?date=${todayStr}`),
      ]);

      const schedJson = schedRes.ok ? await schedRes.json() : { data: [] };
      const logJson = logRes.ok ? await logRes.json() : { data: [] };

      const schedules = schedJson.data || [];
      const logs = logJson.data || [];

      const list: ScheduleDose[] = [];

      for (const s of schedules) {
        const medName = s.medicationId?.name || "Medication";
        const medId = s.medicationId?._id || s.medicationId;

        for (const d of s.doses || []) {
          const logEntry = logs.find(
            (l: any) =>
              (l.scheduleId === s._id || l.scheduleId?._id === s._id) &&
              l.scheduledTime === d.time
          );

          list.push({
            scheduleId: s._id,
            medicationId: medId,
            medicationName: medName,
            time: d.time,
            dosage: d.dosage,
            status: logEntry ? logEntry.status : "pending",
          });
        }
      }

      // Sort chronologically
      list.sort((a, b) => a.time.localeCompare(b.time));
      setDoses(list);
    } catch (err) {
      console.warn("Failed to load today's doses:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDoses();
  }, [loadDoses]);

  const handleToggleTake = async (dose: ScheduleDose) => {
    const key = `${dose.scheduleId}_${dose.time}`;
    setUpdatingTime(key);
    const newStatus = dose.status === "taken" ? "pending" : "taken";

    try {
      const res = await fetch("/api/schedules/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduleId: dose.scheduleId,
          medicationId: dose.medicationId,
          scheduledTime: dose.time,
          dosage: dose.dosage,
          status: newStatus,
        }),
      });

      if (res.ok) {
        setDoses((prev) =>
          prev.map((d) =>
            d.scheduleId === dose.scheduleId && d.time === dose.time
              ? { ...d, status: newStatus }
              : d
          )
        );
      }
    } catch (err) {
      console.error("Failed to toggle dose:", err);
    } finally {
      setUpdatingTime(null);
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-clinical-600" />
        <span className="text-xs font-bold">Loading dose schedule...</span>
      </div>
    );
  }

  if (doses.length === 0) {
    return (
      <div className="text-center py-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-4">
        <Pill className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-sm font-bold text-slate-700">No doses scheduled for today</p>
        <p className="text-xs text-slate-500 mt-0.5">Scan or add a medication to configure daily alerts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {doses.map((dose) => {
        const isTaken = dose.status === "taken";
        const key = `${dose.scheduleId}_${dose.time}`;
        const isUpdating = updatingTime === key;

        return (
          <div
            key={key}
            className={`p-3 sm:p-3.5 rounded-2xl border-2 border-slate-900 shadow-[0_3px_0_0_#0f172a] flex flex-col xs:flex-row xs:items-center justify-between gap-3 transition-all ${
              isTaken ? "bg-slate-100 opacity-80" : "bg-white"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-10 h-10 rounded-xl border-2 border-slate-900 flex items-center justify-center font-black text-xs shrink-0 ${
                  isTaken ? "bg-slate-200 text-slate-600" : "bg-clinical-100 text-clinical-900"
                }`}
              >
                <Clock className="w-4 h-4 stroke-[2.5]" />
              </div>

              <div className="min-w-0 overflow-hidden">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-slate-900">{dose.time}</span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 truncate">
                    {dose.dosage}
                  </span>
                </div>
                <h4
                  className={`text-sm font-black text-slate-900 truncate mt-0.5 ${
                    isTaken ? "line-through text-slate-500" : ""
                  }`}
                >
                  {dose.medicationName}
                </h4>
              </div>
            </div>

            <button
              onClick={() => handleToggleTake(dose)}
              disabled={isUpdating}
              className={`w-full xs:w-auto shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border-2 border-slate-900 font-black text-xs uppercase tracking-wider shadow-[0_2px_0_0_#0f172a] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer ${
                isTaken
                  ? "bg-slate-300 hover:bg-slate-400 text-slate-800"
                  : "bg-emerald-400 hover:bg-emerald-300 text-slate-900"
              }`}
            >
              {isUpdating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className={`w-3.5 h-3.5 stroke-[3] ${isTaken ? "text-slate-800" : ""}`} />
              )}
              {isTaken ? "TAKEN" : "MARK TAKEN"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
