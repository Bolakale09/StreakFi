import { Suspense } from "react";
import Link from "next/link";
import { DashboardLoading } from "@/components/dashboard/dashboard-loading";
import { DashboardScreen } from "@/components/dashboard/dashboard-screen";
import { MobileShell } from "@/components/layout/mobile-shell";
import { Chip } from "@/components/ui/chip";

export default function DashboardPage() {
  return (
    <main className="pb-20 pt-6">
      <MobileShell className="space-y-6 lg:max-w-5xl">
        <header className="glass-card flex items-center justify-between rounded-full px-4 py-3 shadow-soft">
          <Link className="display-font text-2xl font-semibold tracking-tight" href="/">
            StreakFi
          </Link>
          <Chip>Daily home</Chip>
        </header>
        <Suspense fallback={<DashboardLoading />}>
          <DashboardScreen />
        </Suspense>
      </MobileShell>
    </main>
  );
}
