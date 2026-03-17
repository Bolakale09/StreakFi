import { Chip } from "@/components/ui/chip";

const features = [
  {
    title: "Daily streak rewards",
    description:
      "Make daily return behavior feel easy, visible, and worth keeping up with.",
    accent: "from-coral/20 via-white/80 to-blush/80",
    eyebrow: "Show up daily",
    preview: (
      <div className="space-y-3 rounded-[1.75rem] bg-white/75 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-ink">Today&apos;s check-in</p>
          <span className="rounded-full bg-coral px-3 py-1 text-xs font-semibold text-white">
            Ready
          </span>
        </div>
        <div className="h-2 rounded-full bg-ink/10">
          <div className="h-2 w-1/2 rounded-full bg-coral" />
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-ink px-4 py-3 text-white">
          <span className="text-sm text-white/70">Current streak</span>
          <span className="display-font text-3xl leading-none">5</span>
        </div>
      </div>
    ),
  },
  {
    title: "Referral bonuses",
    description:
      "Turn happy users into growth with a share flow that feels simple and immediate.",
    accent: "from-sky/65 via-white/80 to-mint/80",
    eyebrow: "Grow organically",
    preview: (
      <div className="space-y-3 rounded-[1.75rem] bg-white/75 p-4">
        <div className="rounded-2xl border border-dashed border-ink/15 bg-white px-4 py-3">
          <p className="text-xs uppercase tracking-[0.22em] text-ink/45">Personal invite</p>
          <p className="mt-2 text-lg font-semibold text-ink">FRUX-GNPN</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white px-3 py-3">
            <p className="text-xs text-ink/45">Friends joined</p>
            <p className="mt-2 text-lg font-semibold text-ink">2</p>
          </div>
          <div className="rounded-2xl bg-white px-3 py-3">
            <p className="text-xs text-ink/45">Bonus waiting</p>
            <p className="mt-2 text-lg font-semibold text-ink">25 pts</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Token-gated perks",
    description:
      "Hold STREAK to unlock bonus drops, partner perks, and higher streak rewards.",
    accent: "from-white/85 via-sand to-blush/55",
    eyebrow: "Unlock extras",
    preview: (
      <div className="space-y-3 rounded-[1.75rem] bg-white/75 p-4">
        <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-ink">Priority drop</p>
            <p className="mt-1 text-xs text-ink/55">Unlocked</p>
          </div>
          <span className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-ink">
            Active
          </span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-ink">Partner perks</p>
            <p className="mt-1 text-xs text-ink/55">Hold 25 STREAK</p>
          </div>
          <span className="rounded-full bg-ink/10 px-3 py-1 text-xs font-semibold text-ink/50">
            Locked
          </span>
        </div>
        <p className="text-sm leading-6 text-ink/60">
          STREAK ownership changes the product experience directly, not just the wallet balance.
        </p>
      </div>
    ),
  },
];

export function FeatureGrid() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {features.map((feature) => (
        <article
          className={`glass-card overflow-hidden rounded-[2rem] bg-gradient-to-br p-5 shadow-soft ${feature.accent}`}
          key={feature.title}
        >
          <div className="flex h-full flex-col justify-between gap-5">
            <div className="space-y-3">
              <Chip className="bg-white/80">{feature.eyebrow}</Chip>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold leading-tight text-ink">{feature.title}</h3>
                <p className="text-sm leading-6 text-ink/70 sm:text-base">{feature.description}</p>
              </div>
            </div>
            {feature.preview}
          </div>
        </article>
      ))}
    </div>
  );
}
