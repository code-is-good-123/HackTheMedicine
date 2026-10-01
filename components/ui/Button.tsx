import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-black tracking-wider uppercase rounded-2xl border-2 border-slate-900 shadow-[0_4px_0_0_#0f172a] active:translate-y-1 active:shadow-none transition-all disabled:opacity-60 disabled:pointer-events-none cursor-pointer";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-[11px]",
    md: "px-5 py-3 text-xs",
    lg: "px-7 py-4 text-sm",
  }[size];

  const variantClasses = {
    primary: "bg-emerald-500 hover:bg-emerald-400 text-white",
    secondary: "bg-clinical-500 hover:bg-clinical-400 text-white",
    danger: "bg-rose-500 hover:bg-rose-400 text-white",
    outline: "bg-white hover:bg-slate-100 text-slate-900",
  }[variant];

  return (
    <button className={`${base} ${sizeClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </button>
  );
}
