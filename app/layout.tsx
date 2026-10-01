import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Hack The Medicine",
  description:
    "AI-Powered Smart Medicine Scanner & Tracker for dosage schedules, medication safety alerts, and clear medicine breakdowns.",
  openGraph: {
    title: "Hack The Medicine",
    description:
      "AI-Powered Smart Medicine Scanner & Tracker for dosage schedules, medication safety alerts, and clear medicine breakdowns.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
