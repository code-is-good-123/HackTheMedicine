import React from "react";

interface AlertBadgeProps {
  type?: "danger" | "warning" | "success" | "info";
  children: React.ReactNode;
  className?: string;
}

export default function AlertBadge({
  type = "info",
  children,
  className = "",
}: AlertBadgeProps) {
  const styles = {
    danger: "bg-rose-100 text-rose-800 border-rose-900",
    warning: "bg-amber-100 text-amber-900 border-amber-900",
    success: "bg-emerald-100 text-emerald-900 border-emerald-900",
    info: "bg-sky-100 text-sky-900 border-sky-900",
  }[type];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-[10px] font-black uppercase tracking-wider ${styles} ${className}`}
    >
      {children}
    </span>
  );
}
