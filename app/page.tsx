import Link from "next/link";
import { ConsumerHero } from "@/components/landing/consumer-hero";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { FeatureSteps } from "@/components/landing/feature-steps";
import { SectionHeading } from "@/components/layout/section-heading";
import { MobileShell } from "@/components/layout/mobile-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { Chip } from "@/components/ui/chip";
import { WalletConnectionControls } from "@/components/wallet/wallet-connection-controls";

export default function LandingPage() {
  return (
    <main className="pb-20 pt-5 sm:pt-8">
      <MobileShell className="space-y-14 lg:max-w-6xl">
        <header className="glass-card flex items-center justify-between rounded-full px-4 py-3 shadow-soft">
          <Link className="display-font text-2xl font-semibold tracking-tight" href="/">
            StreakFi
          </Link>
          <div className="flex items-center gap-3">
            <Chip className="hidden sm:inline-flex">Daily rewards on Solana</Chip>
            <WalletConnectionControls className="flex-row flex-wrap justify-end" />
          </div>
        </header>

        <ConsumerHero />

        <section className="space-y-5" id="features">
          <SectionHeading
            eyebrow="Why it works"
            title="A simple habit loop with rewards users can feel."
            description="StreakFi keeps the product story easy to understand: show up daily, earn a little more, and unlock more reasons to return."
          />
          <FeatureGrid />
        </section>

        <section className="space-y-5" id="how-it-works">
          <SectionHeading
            eyebrow="How it works"
            title="Three steps, one daily habit."
            description="The flow stays friendly from the first tap. No dashboards to learn, no jargon to decode."
          />
          <FeatureSteps />
        </section>

        <section className="rounded-[2rem] bg-ink px-6 py-8 text-white shadow-soft sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl space-y-2">
              <Chip className="border-white/10 bg-white/10 text-white">Ready for the demo</Chip>
              <h2 className="display-font text-3xl font-semibold leading-tight sm:text-4xl">
                Turn the first tap into a streak users want to keep.
              </h2>
              <p className="text-sm leading-6 text-white/70 sm:text-base">
                Connect the wallet, land in the app, and make the value obvious right away.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:w-auto sm:min-w-60">
              <WalletConnectionControls
                primaryClassName="min-h-12 bg-white text-ink"
                secondaryClassName="border border-white/12 bg-white/10 text-white"
              />
              <ButtonLink href="#how-it-works" variant="secondary">
                See how it works
              </ButtonLink>
            </div>
          </div>
        </section>
      </MobileShell>
    </main>
  );
}
