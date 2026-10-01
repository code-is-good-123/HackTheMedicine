import BentoCard from "@/components/ui/BentoCard";
import TodayDosesGrid from "@/components/dashboard/TodayDosesGrid";
import AlertBanner from "@/components/dashboard/AlertBanner";
import StatsBento from "@/components/dashboard/StatsBento";
import QuickScanCTA from "@/components/dashboard/QuickScanCTA";

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 pb-24 sm:pb-6 font-sans">
      {/* Top Banner: Medication Alerts */}
      <AlertBanner />

      {/* Main Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Today's Dosage Tracker (Spans 2 cols) */}
        <BentoCard className="md:col-span-2 lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center justify-between">
            Today's Schedule
            <span className="text-xs bg-clinical-100 text-clinical-900 px-2 py-1 rounded-full font-semibold">3 Doses Left</span>
          </h2>
          <TodayDosesGrid />
        </BentoCard>

        {/* Quick Scan Action Tile */}
        <BentoCard className="bg-gradient-to-br from-clinical-600 to-clinical-900 text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <QuickScanCTA />
        </BentoCard>

        {/* Adherence & Streak Stats */}
        <BentoCard className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <StatsBento />
        </BentoCard>

        {/* Recently Added Medications */}
        <BentoCard className="md:col-span-3 lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-md font-bold text-slate-900 mb-2">My Active Medications</h3>
          {/* Active Medication List */}
        </BentoCard>
      </div>
    </div>
  );
}