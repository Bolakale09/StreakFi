import type { RewardRow } from "@/lib/supabase/mvp-data";

export const DAILY_CHECK_IN_REWARD = 10;
export const STREAK_BONUS_INTERVAL = 7;
export const STREAK_BONUS_REWARD = 25;

export type RewardSummaryItem = {
  id: string;
  label: string;
  amount: string;
  note: string;
};

export function getStreakMilestoneBonus(streakCount: number) {
  return streakCount > 0 && streakCount % STREAK_BONUS_INTERVAL === 0 ? STREAK_BONUS_REWARD : 0;
}

export function getNextStreakBonusLabel(currentStreak: number) {
  const remainder = currentStreak % STREAK_BONUS_INTERVAL;
  const daysLeft =
    currentStreak > 0 && remainder === 0 ? STREAK_BONUS_INTERVAL : STREAK_BONUS_INTERVAL - remainder;

  return `${daysLeft} day${daysLeft === 1 ? "" : "s"} to +${STREAK_BONUS_REWARD} bonus`;
}

function getRewardLabel(rewardType: RewardRow["reward_type"]) {
  switch (rewardType) {
    case "daily_check_in":
      return "Daily check-in";
    case "streak_milestone_bonus":
      return "7-day streak bonus";
    case "referral_bonus":
      return "Referral bonus";
    default:
      return "Bonus reward";
  }
}

function formatRelativeDate(dateValue: string) {
  const rewardDate = new Date(dateValue);
  const today = new Date();
  const utcReward = Date.UTC(
    rewardDate.getUTCFullYear(),
    rewardDate.getUTCMonth(),
    rewardDate.getUTCDate(),
  );
  const utcToday = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const dayDiff = Math.round((utcToday - utcReward) / (24 * 60 * 60 * 1000));

  if (dayDiff <= 0) {
    return "Today";
  }

  if (dayDiff === 1) {
    return "Yesterday";
  }

  return `${dayDiff} days ago`;
}

export function buildRewardHistory(rewards: RewardRow[], limit = 4): RewardSummaryItem[] {
  return rewards.slice(0, limit).map((reward) => ({
    id: reward.id,
    label: getRewardLabel(reward.reward_type),
    amount: `+${reward.amount}`,
    note: reward.note
      ? `${formatRelativeDate(reward.created_at)} · ${reward.note}`
      : formatRelativeDate(reward.created_at),
  }));
}
