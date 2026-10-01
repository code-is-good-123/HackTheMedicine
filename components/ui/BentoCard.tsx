import React from "react";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function BentoCard({ children, className = "" }: BentoCardProps) {
  return (
    <div
      className={`border-2 border-slate-900 rounded-3xl shadow-[0_4px_0_0_#0f172a] transition-all ${className}`}
    >
      {children}
    </div>
  );
}
