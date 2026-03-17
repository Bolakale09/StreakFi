import Link from "next/link";
import { ConsumerHero } from "@/components/landing/consumer-hero";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { FeatureSteps } from "@/components/landing/feature-steps";
import { SectionHeading } from "@/components/layout/section-heading";
import { MobileShell } from "@/components/layout/mobile-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { Chip } from "@/components/ui/chip";

export default function LandingPage() {
  return (
    <main className="pb-20 pt-5 sm:pt-8">
      <MobileShell className="space-y-14 lg:max-w-6xl">
        <header className="glass-card flex items-center justify-between rounded-full px-4 py-3 shadow-soft">
          <Link className="display-font text-2xl font-semibold tracking-tight" href="/">
            StreakFi
          </Link>
          <div className="flex items-center gap-3">
            <Chip className="hidden sm:inline-flex">Consumer loyalty on Solana</Chip>
            <ButtonLink
              className="min-h-10 rounded-full border border-ink/10 bg-white/72 px-4 text-ink shadow-none"
              href="/dashboard"
              variant="secondary"
            >
              Dashboard
            </ButtonLink>
          </div>
        </header>

        <ConsumerHero />

        <section className="space-y-5" id="features">
          <SectionHeading
            eyebrow="Why it works"
            title="A daily habit loop that feels natural."
            description="The product story stays simple: show up, keep your streak alive, earn rewards, and unlock more value over time."
          />
          <FeatureGrid />
        </section>

        <section className="space-y-5" id="how-it-works">
          <SectionHeading
            eyebrow="How it works"
            title="Three steps, one daily habit."
            description="From the first tap to the daily return, the flow stays clear, fast, and friendly."
          />
          <FeatureSteps />
        </section>

        <section className="rounded-[2rem] bg-ink px-6 py-8 text-white shadow-soft sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl space-y-2">
              <Chip className="border-white/10 bg-white/10 text-white">Ready for the demo</Chip>
              <h2 className="display-font text-3xl font-semibold leading-tight sm:text-4xl">
                Turn one wallet connection into a daily product habit.
              </h2>
              <p className="text-sm leading-6 text-white/70 sm:text-base">
                Connect, land in the dashboard, and make the product value obvious in seconds.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:w-auto sm:min-w-60">
              <ButtonLink
                className="min-h-12 border border-white/24 bg-white/88 text-ink shadow-none"
                href="#how-it-works"
                variant="secondary"
              >
                See how it works
              </ButtonLink>
            </div>
          </div>
        </section>
      </MobileShell>
    </main>
  );
}
