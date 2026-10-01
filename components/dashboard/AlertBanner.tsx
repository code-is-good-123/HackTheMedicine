"use client";

import { useState, useEffect, useCallback } from "react";
import { BellRing, AlertTriangle, Check, ShieldCheck } from "lucide-react";

interface AlertItem {
  id: string;
  type: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  time: string;
  overdueMinutes: number;
  message: string;
}

export default function AlertBanner() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingId, setLoggingId] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const json = await res.json();
        setAlerts(json.data?.alerts || []);
      }
    } catch {
      // Ignore network errors on background poll
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  const handleLogTaken = async (alert: AlertItem) => {
    setLoggingId(alert.id);
    try {
      const res = await fetch("/api/schedules/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicationId: alert.medicationId,
          scheduledTime: alert.time,
          dosage: alert.dosage,
          status: "taken",
        }),
      });
      if (res.ok) {
        setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
      }
    } catch (err) {
      console.error("Failed to log dose taken:", err);
    } finally {
      setLoggingId(null);
    }
  };

  if (loading) return null;

  if (alerts.length === 0) {
    return (
      <div className="bg-emerald-50 border-2 border-slate-900 rounded-3xl p-5 shadow-[0_4px_0_0_#0f172a] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 border-2 border-slate-900 flex items-center justify-center text-emerald-700 shadow-sm shrink-0">
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-200 border border-slate-900 text-emerald-950 px-2 py-0.5 rounded-md text-[10px] font-black uppercase">
                ALL ON TRACK
              </span>
              <h4 className="text-sm font-black text-slate-900">
                No Overdue Medications
              </h4>
            </div>
            <p className="text-xs font-bold text-slate-600 mt-0.5">
              Great job! Your dosage adherence is in good standing today.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-rose-50 border-2 border-slate-900 rounded-3xl p-5 shadow-[0_5px_0_0_#0f172a] space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-rose-100 border-2 border-slate-900 flex items-center justify-center text-rose-600 shadow-sm shrink-0">
          <BellRing className="w-5 h-5 stroke-[2.5]" animate-bounce />
        </div>
        <div>
          <span className="bg-rose-200 border border-slate-900 text-rose-950 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider">
            SAFETY ENGINE ALERT
          </span>
          <h3 className="text-lg font-black text-slate-900">
            Overdue Medication Detected
          </h3>
        </div>
      </div>

      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white rounded-2xl p-4 border-2 border-slate-900 shadow-[0_3px_0_0_#0f172a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-100 border-2 border-slate-900 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-rose-500 text-white px-2 py-0.5 rounded-md text-[10px] font-black uppercase">
                    OVERDUE ~{alert.overdueMinutes}M
                  </span>
                  <span className="text-xs font-black text-slate-900">
                    {alert.medicationName} ({alert.dosage})
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-500">
                  Scheduled for {alert.time}. Take with water as prescribed.
                </p>
              </div>
            </div>

            <button
              onClick={() => handleLogTaken(alert)}
              disabled={loggingId === alert.id}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              {loggingId === alert.id ? "LOGGING..." : "LOG AS TAKEN"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
