const steps = [
  {
    title: "Connect your wallet",
    description:
      "Start in one tap and drop people straight into a clean home screen with their streak front and center.",
  },
  {
    title: "Check in each day",
    description:
      "Keep the action simple. A quick daily check-in grows the streak and makes the next reward feel close.",
  },
  {
    title: "Unlock more over time",
    description:
      "As rewards build, referrals land, and perks open up, the app gives users more reasons to come back.",
  },
];

export function FeatureSteps() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {steps.map((step, index) => (
        <div
          className="glass-card flex gap-4 rounded-[1.8rem] p-5 shadow-soft"
          key={step.title}
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
            0{index + 1}
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-ink">{step.title}</h3>
            <p className="text-sm leading-6 text-ink/70 sm:text-base">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
