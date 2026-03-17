"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { buildWalletPreviewDashboard } from "@/lib/dashboard-preview";
import { dashboardMockData } from "@/lib/mock-data";
import {
  normalizeReferralCode,
  readStoredReferralCode,
  REFERRAL_QUERY_PARAM,
} from "@/lib/referrals";
import type { DashboardData } from "@/lib/types";
import { ButtonLink } from "@/components/ui/button-link";
import { Chip } from "@/components/ui/chip";
import { WalletConnectionControls } from "@/components/wallet/wallet-connection-controls";

type DashboardApiResponse = {
  dashboard: DashboardData;
  error?: string;
};

function getLandingReferralCode() {
  if (typeof window === "undefined") {
    return null;
  }

  const queryReferralCode = new URLSearchParams(window.location.search).get(REFERRAL_QUERY_PARAM);

  if (queryReferralCode) {
    return normalizeReferralCode(queryReferralCode);
  }

  return readStoredReferralCode();
}

export function ConsumerHero() {
  const { connected, publicKey } = useWallet();
  const [dashboard, setDashboard] = useState<DashboardData>(dashboardMockData);
  const [isLoading, setIsLoading] = useState(false);

  const walletAddress = publicKey?.toBase58() ?? null;

  useEffect(() => {
    if (!connected || !walletAddress) {
      setDashboard(dashboardMockData);
      setIsLoading(false);
      return;
    }

    let ignore = false;
    const activeWalletAddress = walletAddress;
    const referralCode = getLandingReferralCode();
    const referralQuery = referralCode ? `&ref=${encodeURIComponent(referralCode)}` : "";
    setDashboard(buildWalletPreviewDashboard(activeWalletAddress));
    setIsLoading(true);

    async function loadHeroPreview() {
      try {
        const response = await fetch(
          `/api/dashboard?walletAddress=${encodeURIComponent(activeWalletAddress)}${referralQuery}`,
          {
            cache: "no-store",
          },
        );
        const data = (await response.json()) as DashboardApiResponse;

        if (ignore) {
          return;
        }

        if (response.ok && data.dashboard) {
          setDashboard(data.dashboard);
        }
      } catch {
        // Keep the wallet-based preview state when live sync is unavailable.
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadHeroPreview();

    return () => {
      ignore = true;
    };
  }, [connected, walletAddress]);

  const primaryPerk = dashboard.perks.items[0];
  const walletChipLabel = !connected
    ? "Preview"
    : isLoading
      ? "Syncing"
      : dashboard.checkIn.checkedIn
        ? "Checked in"
        : "Wallet on";

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-ink px-5 py-6 text-white shadow-soft sm:px-8 sm:py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(181,240,219,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,124,91,0.24),transparent_30%)]" />
      <div className="absolute -right-14 top-10 h-44 w-44 rounded-full bg-coral/20 blur-3xl" />
      <div className="absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-mint/20 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="space-y-4">
            <Chip className="border-white/10 bg-white/10 text-white">
              Daily streaks made simple
            </Chip>
            <div className="space-y-3">
              <h1 className="display-font text-5xl font-semibold leading-[0.94] sm:text-6xl">
                Turn one quick check-in into a habit users want to keep.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
                StreakFi helps people show up daily, earn rewards, invite friends, and unlock perks
                without ever feeling like they&apos;re using a crypto dashboard.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <WalletConnectionControls
              className="sm:flex-row"
              primaryClassName="min-h-14 bg-white text-base text-ink"
              secondaryClassName="border border-white/20 bg-white/88 text-base text-ink"
            />
            <ButtonLink
              className="min-h-14 border border-white/20 bg-white/88 text-base text-ink sm:w-fit"
              href="/dashboard"
              variant="secondary"
            >
              Open Dashboard
            </ButtonLink>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.6rem] border border-white/14 bg-white/14 px-4 py-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.22em] text-white/62">Check in</p>
              <p className="mt-2 text-sm leading-6 text-white/90">One clear action every day.</p>
            </div>
            <div className="rounded-[1.6rem] border border-white/14 bg-white/14 px-4 py-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.22em] text-white/62">Earn more</p>
              <p className="mt-2 text-sm leading-6 text-white/90">
                Rewards grow with momentum.
              </p>
            </div>
            <div className="rounded-[1.6rem] border border-white/14 bg-white/14 px-4 py-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.22em] text-white/62">Unlock perks</p>
              <p className="mt-2 text-sm leading-6 text-white/90">Keep the app feeling alive.</p>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <div className="relative mx-auto max-w-[22rem]">
            <div className="absolute inset-0 translate-y-4 rounded-[2.4rem] bg-coral/30 blur-2xl" />
            <div className="relative rounded-[2.4rem] border border-white/10 bg-white/95 p-4 text-ink shadow-[0_30px_60px_rgba(0,0,0,0.22)]">
              <div className="flex items-center justify-between rounded-[1.6rem] bg-ink px-4 py-4 text-white">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/55">Current streak</p>
                  <p className="display-font mt-2 text-5xl leading-none">
                    {dashboard.currentStreak}
                  </p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                  {walletChipLabel}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-[1.6rem] bg-blush/60 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-ink">{dashboard.checkIn.title}</p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        dashboard.checkIn.checkedIn
                          ? "bg-mint text-ink"
                          : "bg-coral text-white"
                      }`}
                    >
                      {dashboard.checkIn.statusLabel}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-ink/70">
                    {dashboard.checkIn.description}
                  </p>
                  <div className="mt-3 h-2 rounded-full bg-ink/10">
                    <div
                      className={`h-2 rounded-full ${
                        dashboard.checkIn.checkedIn ? "bg-mint" : "bg-coral"
                      }`}
                      style={{ width: `${dashboard.checkIn.progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.4rem] bg-sky/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-ink/45">Rewards</p>
                    <p className="mt-2 text-2xl font-semibold text-ink">
                      {dashboard.rewards.balance} pts
                    </p>
                  </div>
                  <div className="rounded-[1.4rem] bg-mint/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-ink/45">Referrals</p>
                    <p className="mt-2 text-2xl font-semibold text-ink">
                      {dashboard.referrals.joinedCount}
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.6rem] border border-ink/8 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-ink">{dashboard.perks.statusLabel}</p>
                      <p className="mt-1 text-sm text-ink/60">
                        {primaryPerk ? primaryPerk.title : dashboard.perks.thresholdLabel}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        dashboard.perks.statusTone === "unlocked"
                          ? "bg-mint text-ink"
                          : "bg-ink/10 text-ink/55"
                      }`}
                    >
                      {dashboard.perks.statusTone === "unlocked" ? "Active" : "Locked"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
