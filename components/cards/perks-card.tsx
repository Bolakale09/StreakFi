import { BaseCard } from "@/components/cards/base-card";
import { Chip } from "@/components/ui/chip";
import type { PerkItem, PerksData } from "@/lib/types";

type PerksCardProps = {
  data: PerksData;
};

function PerkRow({ perk }: { perk: PerkItem }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-3xl bg-white/75 px-4 py-3">
      <div>
        <p className="font-medium text-ink">{perk.title}</p>
        <p className="mt-1 text-sm text-ink/65">{perk.description}</p>
      </div>
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          perk.unlocked ? "bg-mint text-ink" : "bg-ink/10 text-ink/45"
        }`}
      >
        {perk.unlocked ? "Unlocked" : perk.requirement}
      </span>
    </div>
  );
}

export function PerksCard({ data }: PerksCardProps) {
  return (
    <BaseCard className="space-y-4 bg-gradient-to-br from-white/92 via-white/78 to-sand">
      <div className="space-y-2">
        <Chip className="bg-ink text-white">Token-gated perks</Chip>
        <div>
          <h3 className="text-xl font-semibold text-ink">{data.title}</h3>
          <p className="mt-1 text-sm leading-6 text-ink/70">{data.caption}</p>
        </div>
      </div>

      <div
        className={`rounded-[1.75rem] px-4 py-4 shadow-soft ${
          data.statusTone === "unlocked"
            ? "bg-gradient-to-br from-mint via-mint/80 to-white"
            : "bg-gradient-to-br from-ink to-ink/90 text-white"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p
              className={`text-xs uppercase tracking-[0.24em] ${
                data.statusTone === "unlocked" ? "text-ink/55" : "text-white/55"
              }`}
            >
              {data.statusLabel}
            </p>
            <p className="mt-2 text-2xl font-semibold">{data.balanceLabel}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              data.statusTone === "unlocked"
                ? "bg-white/80 text-ink"
                : "bg-white/10 text-white/80"
            }`}
          >
            {data.thresholdLabel}
          </span>
        </div>

        <div className="mt-4 h-2 rounded-full bg-white/20">
          <div
            className={`h-full rounded-full ${
              data.statusTone === "unlocked" ? "bg-ink" : "bg-mint"
            }`}
            style={{ width: `${data.progressPercent}%` }}
          />
        </div>

        <div
          className={`mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between ${
            data.statusTone === "unlocked" ? "text-ink/70" : "text-white/70"
          }`}
        >
          <p>{data.helperText}</p>
          <p className="font-medium">{data.mintLabel}</p>
        </div>
      </div>

      <div className="space-y-3">
        {data.items.map((perk) => (
          <PerkRow key={perk.title} perk={perk} />
        ))}
      </div>
    </BaseCard>
  );
}
