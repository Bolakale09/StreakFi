export type CheckInData = {
  checkedIn: boolean;
  statusLabel: string;
  title: string;
  description: string;
  streakCount: string;
  nextRewardLabel: string;
  progressPercent: number;
  ctaLabel: string;
  rewardToday: string;
  checkInWindow: string;
};

export type RewardData = {
  balance: string;
  caption: string;
  weeklyEarned: string;
  nextCashout: string;
  todayEarned: string;
  history: Array<{
    id: string;
    label: string;
    amount: string;
    note: string;
  }>;
};

export type ReferralData = {
  caption: string;
  code: string;
  sharePath: string;
  joinedCount: string;
  pendingBonus: string;
  shareLabel: string;
  hint: string;
};

export type PerkItem = {
  title: string;
  description: string;
  unlocked: boolean;
  requirement: string;
};

export type PerksData = {
  title: string;
  caption: string;
  statusLabel: string;
  statusTone: "locked" | "unlocked";
  balanceLabel: string;
  thresholdLabel: string;
  helperText: string;
  mintLabel: string;
  progressPercent: number;
  items: PerkItem[];
};

export type DashboardData = {
  username: string;
  currentStreak: string;
  bestStreak: string;
  streakGoal: string;
  checkIn: CheckInData;
  rewards: RewardData;
  referrals: ReferralData;
  perks: PerksData;
};
