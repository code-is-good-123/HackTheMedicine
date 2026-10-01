"use client";

import { useEffect, useState, useCallback, useSyncExternalStore } from "react";
import { Bell, BellRing, Check, Volume2 } from "lucide-react";

function getNotificationPermission(): NotificationPermission {
  if (typeof window !== "undefined" && "Notification" in window) {
    return Notification.permission;
  }
  return "default";
}

function subscribeToPermission(callback: () => void) {
  window.addEventListener("focus", callback);
  return () => window.removeEventListener("focus", callback);
}

interface PushNotificationManagerProps {
  variant?: "banner" | "compact";
}

export default function PushNotificationManager({
  variant = "banner",
}: PushNotificationManagerProps) {
  const permission = useSyncExternalStore(
    subscribeToPermission,
    getNotificationPermission,
    () => "default" as NotificationPermission
  );
  const [testSent, setTestSent] = useState(false);
  const isSupported = typeof window !== "undefined" && "Notification" in window;

  const playChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // Audio fallback
    }
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) return;
    try {
      const result = await Notification.requestPermission();
      if (result === "granted") {
        fetch("/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: "web_push_granted_" + Date.now() }),
        }).catch(console.warn);

        new Notification("🔔 Medicine Reminders Activated!", {
          body: "You will receive real-time push alerts when it is time to take your medication.",
          icon: "/logo.png",
        });
        playChime();
      }
    } catch (err) {
      console.warn("Notification permission request error:", err);
    }
  };

  const sendTestNotification = async () => {
    if (permission !== "granted") {
      await requestPermission();
      return;
    }

    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test" }),
      });
      const data = await res.json();
      const notif = data.notification;

      if (notif && "Notification" in window) {
        new Notification(notif.title, {
          body: notif.body,
          icon: notif.icon,
          badge: notif.badge,
          tag: notif.tag,
        });
        playChime();
        setTestSent(true);
        setTimeout(() => setTestSent(false), 3000);
      }
    } catch (err) {
      console.error("Failed to send test push notification:", err);
    }
  };

  // Background interval: poll for overdue/due doses and alert
  useEffect(() => {
    if (permission !== "granted") return;

    const checkInterval = setInterval(async () => {
      try {
        const res = await fetch("/api/notifications");
        if (!res.ok) return;
        const json = await res.json();
        const alerts = json.data?.alerts || [];

        alerts.forEach((alert: { id: string; medicationName: string; dosage: string; time: string }) => {
          const notifiedKey = `notif_fired_${alert.id}`;
          if (!sessionStorage.getItem(notifiedKey)) {
            new Notification(`⚠️ Dose Alert: ${alert.medicationName}`, {
              body: `Your dose (${alert.dosage}) was scheduled for ${alert.time}. Log it in your cabinet.`,
              icon: "/logo.png",
              tag: alert.id,
            });
            playChime();
            sessionStorage.setItem(notifiedKey, "1");
          }
        });
      } catch {
        // Ignore background poll errors
      }
    }, 45000);

    return () => clearInterval(checkInterval);
  }, [permission, playChime]);

  if (!isSupported) return null;

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2">
        {permission !== "granted" ? (
          <button
            onClick={requestPermission}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            title="Enable browser notifications"
          >
            <Bell className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">ENABLE ALERTS</span>
          </button>
        ) : (
          <button
            onClick={sendTestNotification}
            disabled={testSent}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-800 font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer disabled:opacity-70"
            title="Test push notification"
          >
            {testSent ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                <span className="text-emerald-700">TEST SENT!</span>
              </>
            ) : (
              <>
                <BellRing className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                <span className="hidden sm:inline">ALERTS ACTIVE</span>
              </>
            )}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-3xl border-2 border-slate-900 shadow-[0_4px_0_0_#0f172a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-2xl border-2 border-slate-900 flex items-center justify-center shrink-0 shadow-[0_2px_0_0_#0f172a] ${
            permission === "granted"
              ? "bg-emerald-100 text-emerald-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {permission === "granted" ? (
            <BellRing className="w-5 h-5 stroke-[2.5]" />
          ) : (
            <Bell className="w-5 h-5 stroke-[2.5]" />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-slate-900 ${
                permission === "granted"
                  ? "bg-emerald-100 text-emerald-900"
                  : "bg-amber-100 text-amber-900"
              }`}
            >
              {permission === "granted" ? "PUSH NOTIFICATIONS ACTIVE" : "NOTIFICATIONS DISABLED"}
            </span>
          </div>
          <h4 className="text-xs sm:text-sm font-black text-slate-900 mt-0.5">
            {permission === "granted"
              ? "Receiving real-time dosage reminders on this device"
              : "Enable browser push notifications to never miss a scheduled dose"}
          </h4>
        </div>
      </div>

      <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
        {permission !== "granted" ? (
          <button
            onClick={requestPermission}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4 stroke-[2.5]" />
            ENABLE NOTIFICATIONS
          </button>
        ) : (
          <button
            onClick={sendTestNotification}
            disabled={testSent}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer disabled:opacity-70"
          >
            {testSent ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                NOTIFICATION SENT!
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                TEST PUSH ALERT
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
