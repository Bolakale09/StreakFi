import { BaseCard } from "@/components/cards/base-card";
import { Chip } from "@/components/ui/chip";
import { MetricPill } from "@/components/ui/metric-pill";
import type { RewardData } from "@/lib/types";

type RewardBalanceCardProps = {
  data: RewardData;
};

export function RewardBalanceCard({ data }: RewardBalanceCardProps) {
  return (
    <BaseCard className="space-y-4 bg-gradient-to-br from-white/88 via-sky/72 to-mint/78">
      <div className="space-y-2">
        <Chip className="bg-white/70">Rewards</Chip>
        <div className="flex items-end justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-ink">Reward balance</h3>
            <p className="mt-1 text-sm leading-6 text-ink/70">{data.caption}</p>
          </div>
          <div className="text-right">
            <p className="display-font text-4xl leading-none text-ink">{data.balance}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.24em] text-ink/45">points</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white/75 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-ink/60">Today&apos;s reward</p>
            <p className="mt-1 text-sm text-ink/55">Every check-in adds to your running balance.</p>
          </div>
          <p className="text-lg font-semibold text-ink">{data.todayEarned}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <MetricPill label="This week" value={data.weeklyEarned} />
        <MetricPill label="Next bonus" value={data.nextCashout} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-ink">Recent rewards</p>
          <p className="text-xs uppercase tracking-[0.22em] text-ink/40">History</p>
        </div>

        {data.history.length > 0 ? (
          <div className="space-y-2">
            {data.history.map((item) => (
              <div
                className="rounded-3xl bg-white/75 px-4 py-3"
                key={item.id}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-ink">{item.label}</p>
                    <p className="mt-1 text-sm text-ink/60">{item.note}</p>
                  </div>
                  <p className="text-lg font-semibold text-ink">{item.amount}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white/75 px-4 py-4 text-sm text-ink/60">
            No rewards yet. Your first check-in will kick off the balance.
          </div>
        )}
      </div>
    </BaseCard>
  );
}
