import { DashboardLoading } from "@/components/dashboard/dashboard-loading";
import { MobileShell } from "@/components/layout/mobile-shell";

export default function DashboardLoadingPage() {
  return (
    <main className="pb-20 pt-6">
      <MobileShell className="space-y-6 lg:max-w-5xl">
        <DashboardLoading />
      </MobileShell>
    </main>
  );
}
