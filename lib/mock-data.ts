import type { DashboardData } from "@/lib/types";

const baseDashboardData = {
  username: "Maya",
  currentStreak: "12",
  bestStreak: "18 days",
  streakGoal: "3 more days for your next streak bonus",
  rewards: {
    balance: "240",
    caption: "Your streak and invite activity are already stacking up.",
    weeklyEarned: "+42 pts",
    nextCashout: "2 days to +25 bonus",
    todayEarned: "+12 pts",
    history: [
      {
        id: "reward-1",
        label: "Daily check-in",
        amount: "+10",
        note: "Today",
      },
      {
        id: "reward-2",
        label: "7-day streak bonus",
        amount: "+25",
        note: "Yesterday",
      },
      {
        id: "reward-3",
        label: "Referral bonus",
        amount: "+25",
        note: "3 days ago",
      },
    ],
  },
  referrals: {
    caption: "Share your code and earn a boost when friends complete their first streak.",
    code: "MAYA-7Q4",
    sharePath: "/?ref=MAYA-7Q4",
    joinedCount: "4 friends",
    pendingBonus: "80 pts",
    shareLabel: "Share my code",
    hint: "Friends get started faster when the invite is simple and clear.",
  },
  perks: {
    title: "Perks that feel worth opening the app for",
    caption: "Extra access and reward boosts can sit on top of the same simple flow.",
    statusLabel: "Perks unlocked",
    statusTone: "unlocked",
    balanceLabel: "42 STREAK",
    thresholdLabel: "Hold 25 STREAK",
    helperText: "This wallet already clears the perk threshold, so premium access is live.",
    mintLabel: "Mint 9x7AbC...4LmNqP",
    progressPercent: 100,
    items: [
      {
        title: "Priority reward drop",
        description: "Early access to limited campaigns and bonus streak boosts.",
        unlocked: true,
        requirement: "Hold 25 STREAK",
      },
      {
        title: "Private partner offers",
        description: "Member-only perks from creator or brand collaborations.",
        unlocked: true,
        requirement: "Hold 25 STREAK",
      },
      {
        title: "VIP referral multiplier",
        description: "Higher bonus cap for users who keep inviting quality referrals.",
        unlocked: true,
        requirement: "Hold 25 STREAK",
      },
    ],
  },
} satisfies Omit<DashboardData, "checkIn">;

export const dashboardMockStates: Record<"ready" | "checked-in", DashboardData> = {
  ready: {
    ...baseDashboardData,
    checkIn: {
      checkedIn: false,
      statusLabel: "Ready today",
      title: "Today’s check-in is waiting",
      description:
        "Keep the streak going with one quick tap. Come back tomorrow to keep the bonus moving.",
      streakCount: "12",
      nextRewardLabel: "3 more days for bonus drop",
      progressPercent: 74,
      ctaLabel: "Check in now",
      rewardToday: "+12 pts today",
      checkInWindow: "Check in before midnight",
    },
  },
  "checked-in": {
    ...baseDashboardData,
    checkIn: {
      checkedIn: true,
      statusLabel: "Done for today",
      title: "You checked in today",
      description:
        "Nice work. Your streak is safe and tomorrow’s check-in will keep the reward multiplier growing.",
      streakCount: "12",
      nextRewardLabel: "2 more days for bonus drop",
      progressPercent: 82,
      ctaLabel: "Checked in today",
      rewardToday: "+12 pts added",
      checkInWindow: "Next check-in opens tomorrow",
    },
  },
};

export const dashboardMockData = dashboardMockStates.ready;
