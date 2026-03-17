import { Chip } from "@/components/ui/chip";

const previewItems = [
  { label: "Streak", value: "12 days", tone: "bg-coral text-white" },
  { label: "Reward balance", value: "240 pts", tone: "bg-white text-ink" },
  { label: "Referral bonus", value: "3 pending", tone: "bg-mint text-ink" },
];

export function PreviewStack() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-ink px-5 py-6 text-white shadow-soft">
      <div className="absolute inset-x-6 top-0 h-24 rounded-full bg-coral/30 blur-3xl" />
      <div className="relative space-y-5">
        <div className="space-y-2">
          <Chip className="border-white/10 bg-white/10 text-white">Dashboard preview</Chip>
          <h2 className="display-font text-3xl font-semibold leading-tight">
            Polished enough for demos, simple enough for a 2-day sprint.
          </h2>
        </div>

        <div className="space-y-3">
          {previewItems.map((item) => (
            <div
              className="flex items-center justify-between rounded-3xl bg-white/10 px-4 py-4 backdrop-blur"
              key={item.label}
            >
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/55">{item.label}</p>
                <p className="mt-2 text-lg font-semibold">{item.value}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.tone}`}>
                Live mock
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
