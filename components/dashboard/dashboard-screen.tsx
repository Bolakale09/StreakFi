"use client";

import { useEffect, useState, useTransition } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { CurrentStreakCard } from "@/components/cards/current-streak-card";
import { DailyCheckInCard } from "@/components/cards/daily-check-in-card";
import { PerksCard } from "@/components/cards/perks-card";
import { ReferralCard } from "@/components/cards/referral-card";
import { RewardBalanceCard } from "@/components/cards/reward-balance-card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardLoading } from "@/components/dashboard/dashboard-loading";
import { useReferralCode } from "@/components/referral/use-referral-code";
import { SectionHeading } from "@/components/layout/section-heading";
import { Chip } from "@/components/ui/chip";
import { dashboardMockData } from "@/lib/mock-data";
import type { CheckInFeedback } from "@/lib/dashboard-view";
import type { DashboardData } from "@/lib/types";

async function readResponseJson<T>(response: Response) {
  return (await response.json()) as T;
}

type DashboardApiResponse = {
  dashboard: DashboardData;
  error?: string;
};

type CheckInApiResponse = {
  dashboard: DashboardData;
  feedback: CheckInFeedback;
  error?: string;
};

export function DashboardScreen() {
  const [dashboard, setDashboard] = useState<DashboardData>(dashboardMockData);
  const [feedback, setFeedback] = useState<CheckInFeedback | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedLiveDashboard, setHasLoadedLiveDashboard] = useState(false);
  const [isCheckingIn, startCheckInTransition] = useTransition();
  const { connected, publicKey } = useWallet();
  const referralCode = useReferralCode();

  const walletAddress = publicKey?.toBase58() ?? null;

  useEffect(() => {
    if (!connected || !walletAddress) {
      setDashboard(dashboardMockData);
      setFeedback(null);
      setErrorMessage(null);
      setHasLoadedLiveDashboard(false);
      return;
    }

    let ignore = false;
    const activeWalletAddress = walletAddress;

    async function loadDashboard() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await fetch(
          `/api/dashboard?walletAddress=${encodeURIComponent(activeWalletAddress)}${
            referralCode ? `&ref=${encodeURIComponent(referralCode)}` : ""
          }`,
          {
            cache: "no-store",
          },
        );
        const data = await readResponseJson<DashboardApiResponse>(response);

        if (ignore) {
          return;
        }

        if (!response.ok) {
          setErrorMessage(data.error || "Unable to load dashboard.");
          return;
        }

        setDashboard(data.dashboard);
        setHasLoadedLiveDashboard(true);
      } catch {
        if (!ignore) {
          setErrorMessage("Unable to load dashboard right now.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      ignore = true;
    };
  }, [connected, referralCode, walletAddress]);

  const handleCheckIn = () => {
    if (!walletAddress || isCheckingIn) {
      return;
    }

    setErrorMessage(null);

    startCheckInTransition(async () => {
      try {
        const response = await fetch("/api/check-in", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            referralCode,
            walletAddress,
          }),
        });
        const data = await readResponseJson<CheckInApiResponse>(response);

        if (!response.ok) {
          setErrorMessage(data.error || "Unable to complete today's check-in.");
          return;
        }

        setDashboard(data.dashboard);
        setFeedback(data.feedback);
        setHasLoadedLiveDashboard(true);
      } catch {
        setErrorMessage("Unable to complete today's check-in.");
      }
    });
  };

  const showInitialLoading = connected && isLoading && !hasLoadedLiveDashboard;
  const actionHint = !connected
    ? "Connect your wallet to make this your live daily check-in."
    : isLoading
      ? "Refreshing your streak, rewards, and perks..."
      : dashboard.checkIn.checkedIn
        ? "Nice work. Tomorrow's check-in will keep the streak moving."
        : "One quick tap keeps today's streak moving.";

  if (showInitialLoading) {
    return <DashboardLoading />;
  }

  return (
    <section className="space-y-4">
      <DashboardHeader
        checkedInToday={dashboard.checkIn.checkedIn}
        connected={connected}
        username={dashboard.username}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeading
          eyebrow="Today"
          title="Your daily home screen"
          description={
            connected
              ? "Your streak, rewards, referrals, and perks all stay in one calm place."
              : "Preview the full flow now, then connect your wallet when you're ready to make it live."
          }
        />
        <Chip>{connected ? (isLoading ? "Syncing live data" : "Live wallet data") : "Preview mode"}</Chip>
      </div>

      {!connected ? (
        <div className="glass-card rounded-[1.75rem] bg-white/80 px-4 py-4 shadow-soft">
          <p className="font-semibold text-ink">Preview mode is on</p>
          <p className="mt-1 text-sm leading-6 text-ink/70">
            The dashboard is showing polished mock data so the full product story is easy to demo
            before a wallet connects.
          </p>
        </div>
      ) : null}

      {connected && isLoading && hasLoadedLiveDashboard ? (
        <div className="glass-card rounded-[1.75rem] bg-white/80 px-4 py-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-coral" />
            <div>
              <p className="font-semibold text-ink">Refreshing your dashboard</p>
              <p className="mt-1 text-sm leading-6 text-ink/70">
                Pulling the latest streak, reward, referral, and perk state for this wallet.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {feedback ? (
        <div
          className={`glass-card rounded-[1.75rem] px-4 py-4 shadow-soft ${
            feedback.tone === "success" ? "bg-mint/80" : "bg-blush/70"
          }`}
        >
          <p className="font-semibold text-ink">{feedback.title}</p>
          <p className="mt-1 text-sm leading-6 text-ink/70">{feedback.description}</p>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="glass-card rounded-[1.75rem] bg-blush/70 px-4 py-4 shadow-soft">
          <p className="font-semibold text-ink">Check-in unavailable</p>
          <p className="mt-1 text-sm leading-6 text-ink/70">{errorMessage}</p>
        </div>
      ) : null}

      <div className="grid gap-4">
        <CurrentStreakCard
          bestStreak={dashboard.bestStreak}
          currentStreak={dashboard.currentStreak}
          streakGoal={dashboard.streakGoal}
        />
        <DailyCheckInCard
          actionHint={actionHint}
          data={dashboard.checkIn}
          disabled={!connected || isLoading}
          feedback={feedback}
          isSubmitting={isCheckingIn}
          onCheckIn={handleCheckIn}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <RewardBalanceCard data={dashboard.rewards} />
          <ReferralCard data={dashboard.referrals} />
        </div>
        <PerksCard data={dashboard.perks} />
      </div>
    </section>
  );
}
