"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Pill, QrCode, BellRing, Settings } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Home",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Cabinet",
      href: "/medications",
      icon: Pill,
    },
    {
      label: "Scan",
      href: "/scan",
      icon: QrCode,
      isAction: true,
    },
    {
      label: "Alerts",
      href: "/dashboard#alerts",
      icon: BellRing,
    },
    {
      label: "Account",
      href: "/profile",
      icon: Settings,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-slate-900 px-3 py-1.5 sm:hidden shadow-[0_-3px_0_0_#0f172a] pb-safe"
    >
      <div className="flex items-center justify-around relative max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <div key={item.href} className="relative -top-4">
                <Link
                  href={item.href}
                  className="flex items-center justify-center w-13 h-13 bg-clinical-500 hover:bg-clinical-400 text-white rounded-2xl border-2 border-slate-900 shadow-[0_4px_0_0_#0f172a] active:translate-y-1 active:shadow-none transition-all"
                  aria-label="Scan Medicine"
                >
                  <QrCode className="w-6 h-6 stroke-[2.5]" />
                </Link>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? "text-clinical-600 font-black scale-105"
                  : "text-slate-500 hover:text-slate-900 font-bold"
              }`}
            >
              <Icon className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px] uppercase tracking-wider mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
