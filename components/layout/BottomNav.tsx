"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Pill, QrCode, Bell, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-slate-200 px-4 py-2 sm:hidden">
      <div className="flex items-center justify-around relative max-w-md mx-auto">
        <Link href="/dashboard" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard' ? 'text-clinical-600' : 'text-slate-500'}`}>
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        <Link href="/medications" className={`flex flex-col items-center gap-1 ${pathname === '/medications' ? 'text-clinical-600' : 'text-slate-500'}`}>
          <Pill className="w-5 h-5" />
          <span className="text-[10px] font-medium">Meds</span>
        </Link>

        {/* Floating Action Button for Scanner */}
        <div className="relative -top-5">
          <Link href="/scan" className="flex items-center justify-center w-14 h-14 bg-clinical-600 text-white rounded-full shadow-lg shadow-clinical-500/40 ring-4 ring-white active:scale-95 transition-transform">
            <QrCode className="w-7 h-7" />
          </Link>
        </div>

        <Link href="/alerts" className={`flex flex-col items-center gap-1 ${pathname === '/alerts' ? 'text-clinical-600' : 'text-slate-500'}`}>
          <Bell className="w-5 h-5" />
          <span className="text-[10px] font-medium">Alerts</span>
        </Link>

        <Link href="/profile" className={`flex flex-col items-center gap-1 ${pathname === '/profile' ? 'text-clinical-600' : 'text-slate-500'}`}>
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </div>
    </div>
  );
}