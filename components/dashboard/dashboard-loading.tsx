import { BaseCard } from "@/components/cards/base-card";

function SkeletonLine({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-full bg-ink/8 ${className}`} />;
}

export function DashboardLoading() {
  return (
    <section className="space-y-4">
      <BaseCard className="space-y-5 overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <SkeletonLine className="h-3 w-24" />
            <SkeletonLine className="h-10 w-40" />
          </div>
          <div className="h-12 w-12 animate-pulse rounded-full bg-ink/10" />
        </div>
        <div className="flex gap-2">
          <SkeletonLine className="h-8 w-32" />
          <SkeletonLine className="h-8 w-28" />
        </div>
        <SkeletonLine className="h-12 w-full rounded-2xl" />
      </BaseCard>

      <div className="grid gap-4">
        <BaseCard className="space-y-4 bg-gradient-to-br from-ink via-[#18375d] to-[#214870] text-white">
          <SkeletonLine className="h-6 w-24 bg-white/20" />
          <SkeletonLine className="h-14 w-44 bg-white/20" />
          <SkeletonLine className="h-4 w-full bg-white/15" />
          <SkeletonLine className="h-4 w-2/3 bg-white/15" />
        </BaseCard>

        <BaseCard className="space-y-4">
          <SkeletonLine className="h-6 w-28" />
          <SkeletonLine className="h-10 w-56" />
          <SkeletonLine className="h-4 w-full" />
          <div className="grid gap-3 sm:grid-cols-2">
            <SkeletonLine className="h-24 w-full rounded-3xl" />
            <SkeletonLine className="h-24 w-full rounded-3xl" />
          </div>
          <SkeletonLine className="h-14 w-full rounded-2xl" />
        </BaseCard>
      </div>
    </section>
  );
}
