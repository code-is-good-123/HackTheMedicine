import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col justify-between selection:bg-clinical-500 selection:text-white">
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <BottomNav />
    </div>
  );
}
