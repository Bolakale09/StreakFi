import { dashboardMockData } from "@/lib/mock-data";
import { buildReferralPath } from "@/lib/referrals";
import { buildRewardHistory, getNextStreakBonusLabel } from "@/lib/rewards";
import { getTodayDateString, hasCheckedInToday } from "@/lib/streaks";
import { formatTokenAmount, getMintLabel, type TokenGateStatus } from "@/lib/token-gating";
import type {
  CheckInRow,
  ReferralRow,
  RewardRow,
  UserRow,
} from "@/lib/supabase/mvp-data";
import type { DashboardData } from "@/lib/types";
import { shortenAddress } from "@/lib/solana";

type DashboardSnapshot = {
  user: UserRow;
  checkIns: CheckInRow[];
  rewards: RewardRow[];
  referrals: ReferralRow[];
  tokenGate: TokenGateStatus;
};

export type CheckInFeedback = {
  title: string;
  description: string;
  tone: "success" | "duplicate";
};

function formatPoints(value: number) {
  return `${value}`;
}

function sumRewardsWithinDays(rewards: RewardRow[], days: number, today: string) {
  const todayDate = new Date(`${today}T00:00:00.000Z`).getTime();
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return rewards.reduce((total, reward) => {
    const rewardDateString = reward.created_at.slice(0, 10);
    const rewardDate = new Date(`${rewardDateString}T00:00:00.000Z`).getTime();
    const dayDiff = Math.round((todayDate - rewardDate) / millisecondsPerDay);

    return dayDiff >= 0 && dayDiff < days ? total + reward.amount : total;
  }, 0);
}

function getNextBonusLabel(currentStreak: number) {
  return getNextStreakBonusLabel(currentStreak);
}

function getProgressPercent(currentStreak: number) {
  const bonusWindow = 7;
  const remainder = currentStreak % bonusWindow;
  const steps = remainder === 0 && currentStreak > 0 ? bonusWindow : remainder;

  return Math.max(12, Math.round((steps / bonusWindow) * 100));
}

function getReferralSummary(referrals: ReferralRow[]) {
  const completed = referrals.filter((referral) => referral.status === "completed").length;
  const pending = referrals.filter((referral) => referral.status === "pending").length;

  return {
    completed,
    pending,
  };
}

function getPerksProgressPercent(currentBalance: number, threshold: number) {
  if (threshold <= 0) {
    return 100;
  }

  return Math.max(8, Math.min(100, Math.round((currentBalance / threshold) * 100)));
}

export function buildDashboardViewModel(snapshot: DashboardSnapshot): DashboardData {
  const today = getTodayDateString();
  const checkedInToday = hasCheckedInToday(snapshot.user.last_check_in_on);
  const todayRewards = snapshot.rewards.filter(
    (reward) => reward.created_at.slice(0, 10) === today,
  );
  const todayRewardTotal = todayRewards.reduce((sum, reward) => sum + reward.amount, 0);
  const weeklyRewardTotal = sumRewardsWithinDays(snapshot.rewards, 7, today);
  const referralSummary = getReferralSummary(snapshot.referrals);
  const rewardHistory = buildRewardHistory(snapshot.rewards);
  const requirementLabel = `Hold ${formatTokenAmount(snapshot.tokenGate.threshold)} ${snapshot.tokenGate.tokenSymbol}`;
  const perksUnlocked = snapshot.tokenGate.isEligible;

  return {
    username: snapshot.user.username || shortenAddress(snapshot.user.wallet_address, 5),
    currentStreak: `${snapshot.user.current_streak}`,
    bestStreak: `${snapshot.user.longest_streak} days`,
    streakGoal:
      snapshot.user.current_streak > 0
        ? getNextBonusLabel(snapshot.user.current_streak)
        : "Start your first streak today",
    checkIn: {
      checkedIn: checkedInToday,
      statusLabel: checkedInToday ? "Checked in today" : "Ready today",
      title: checkedInToday ? "You are all set for today" : "Today's check-in is waiting",
      description: checkedInToday
        ? "Nice work. Come back tomorrow to keep your streak moving."
        : "One quick tap keeps the streak alive and adds today's reward.",
      streakCount: `${snapshot.user.current_streak}`,
      nextRewardLabel:
        snapshot.user.current_streak > 0
          ? getNextBonusLabel(snapshot.user.current_streak)
          : "7 days to your first bonus drop",
      progressPercent: getProgressPercent(snapshot.user.current_streak),
      ctaLabel: checkedInToday ? "Checked in today" : "Check in now",
      rewardToday: todayRewardTotal > 0 ? `+${todayRewardTotal} pts today` : "+10 pts today",
      checkInWindow: checkedInToday ? "Next check-in opens tomorrow" : "Check in before midnight UTC",
    },
    rewards: {
      balance: formatPoints(snapshot.user.reward_balance),
      caption: "Your daily points stack up now and can map cleanly to token rewards later.",
      weeklyEarned: `+${weeklyRewardTotal} pts`,
      nextCashout: getNextStreakBonusLabel(snapshot.user.current_streak),
      todayEarned: todayRewardTotal > 0 ? `+${todayRewardTotal} pts` : "+0 pts",
      history: rewardHistory,
    },
    referrals: {
      caption: "Share your code and earn a boost when friends complete their first check-in.",
      code: snapshot.user.referral_code,
      sharePath: buildReferralPath(snapshot.user.referral_code),
      joinedCount: `${referralSummary.completed} joined`,
      pendingBonus: `${referralSummary.pending * 25} pts`,
      shareLabel: "Share my code",
      hint: "Keep invites simple so new users can get into the streak fast.",
    },
    perks: {
      title: perksUnlocked ? "Premium perks are live" : "Unlock premium perks",
      caption: perksUnlocked
        ? "Holding the project token turns on premium access without changing the simple daily flow."
        : "A small token balance can unlock premium access while keeping the core app easy to use.",
      statusLabel: snapshot.tokenGate.statusLabel,
      statusTone: perksUnlocked ? "unlocked" : "locked",
      balanceLabel: `${formatTokenAmount(snapshot.tokenGate.currentBalance)} ${snapshot.tokenGate.tokenSymbol}`,
      thresholdLabel: requirementLabel,
      helperText: snapshot.tokenGate.helperText,
      mintLabel: `Mint ${getMintLabel(snapshot.tokenGate.mintAddress)}`,
      progressPercent: getPerksProgressPercent(
        snapshot.tokenGate.currentBalance,
        snapshot.tokenGate.threshold,
      ),
      items: dashboardMockData.perks.items.map((perk) => ({
        ...perk,
        unlocked: perksUnlocked,
        requirement: requirementLabel,
      })),
    },
  };
}

export function buildCheckInFeedback({
  alreadyCheckedIn,
  streakIncreased,
  currentStreak,
  totalRewardAwarded,
  milestoneBonusAwarded,
}: {
  alreadyCheckedIn: boolean;
  streakIncreased: boolean;
  currentStreak: number;
  totalRewardAwarded: number;
  milestoneBonusAwarded: number;
}): CheckInFeedback {
  if (alreadyCheckedIn) {
    return {
      tone: "duplicate",
      title: "Already checked in today",
      description: "Your streak is safe. Come back tomorrow for the next check-in.",
    };
  }

  if (streakIncreased) {
    if (milestoneBonusAwarded > 0) {
      return {
        tone: "success",
        title: `Streak ${currentStreak} unlocked a bonus`,
        description: `You earned +${totalRewardAwarded} points today, including a +${milestoneBonusAwarded} streak bonus.`,
      };
    }

    return {
      tone: "success",
      title: `Streak increased to ${currentStreak}`,
      description: `Today's +${totalRewardAwarded} points were added and your streak kept moving.`,
    };
  }

  return {
    tone: "success",
    title: "Check-in saved",
    description: `Today's +${totalRewardAwarded} points were added to your balance.`,
  };
}
