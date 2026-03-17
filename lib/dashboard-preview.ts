import { buildReferralPath, normalizeReferralCode } from "@/lib/referrals";
import { DAILY_CHECK_IN_REWARD, getNextStreakBonusLabel } from "@/lib/rewards";
import { shortenAddress } from "@/lib/solana";
import type { DashboardData } from "@/lib/types";

function createReferralCode(walletAddress: string) {
  const normalized = walletAddress.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  const prefix = normalized.slice(0, 4) || "STRK";
  const suffix = normalized.slice(-4) || "0000";

  return normalizeReferralCode(`${prefix}-${suffix}`);
}

export function buildWalletPreviewDashboard(walletAddress: string): DashboardData {
  const shortWallet = shortenAddress(walletAddress, 4);
  const referralCode = createReferralCode(walletAddress);
  const nextBonus = getNextStreakBonusLabel(0);

  return {
    username: shortWallet,
    currentStreak: "0",
    bestStreak: "0 days",
    streakGoal: "Start your first streak today",
    checkIn: {
      checkedIn: false,
      statusLabel: "Demo preview",
      title: "Your first check-in is ready",
      description:
        "This wallet is connected and ready. Your live streak home starts with the first check-in.",
      streakCount: "0",
      nextRewardLabel: nextBonus,
      progressPercent: 0,
      ctaLabel: "Check in now",
      rewardToday: `+${DAILY_CHECK_IN_REWARD} pts today`,
      checkInWindow: "Check in before midnight UTC",
    },
    rewards: {
      balance: "0",
      caption: "Your reward balance starts moving as soon as your first live check-in is saved.",
      weeklyEarned: "+0 pts",
      nextCashout: nextBonus,
      todayEarned: "+0 pts",
      history: [],
    },
    referrals: {
      caption: "Your wallet gets a referral code automatically once live data is available.",
      code: referralCode,
      sharePath: buildReferralPath(referralCode),
      joinedCount: "0 joined",
      pendingBonus: "0 pts",
      shareLabel: "Share my code",
      hint: "Invite links will start tracking as soon as live user data is saved.",
    },
    perks: {
      title: "Unlock premium perks",
      caption: "Connect token utility to the app without changing the daily product flow.",
      statusLabel: "Perks locked",
      statusTone: "locked",
      balanceLabel: "0 STREAK",
      thresholdLabel: "Hold 25 STREAK",
      helperText: "Perks unlock when this wallet meets the configured token threshold.",
      mintLabel: "Mint not configured",
      progressPercent: 0,
      items: [
        {
          title: "Priority reward drop",
          description: "Get early access to limited campaigns and bonus reward moments.",
          unlocked: false,
          requirement: "Hold 25 STREAK",
        },
        {
          title: "Private partner offers",
          description: "Unlock member-only perks from creator and partner campaigns.",
          unlocked: false,
          requirement: "Hold 25 STREAK",
        },
        {
          title: "VIP referral multiplier",
          description: "Access higher-value referral incentives as the product expands.",
          unlocked: false,
          requirement: "Hold 25 STREAK",
        },
      ],
    },
  };
}
