import { normalizeWalletAddress } from "@/lib/solana";
import { normalizeReferralCode, REFERRAL_BONUS_REWARD } from "@/lib/referrals";
import {
  DAILY_CHECK_IN_REWARD,
  getStreakMilestoneBonus,
  STREAK_BONUS_REWARD,
} from "@/lib/rewards";
import { calculateNextStreak, getTodayDateString } from "@/lib/streaks";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { getTokenGateStatus } from "@/lib/token-gating";

export type UserRow = {
  wallet_address: string;
  username: string | null;
  avatar_url: string | null;
  referral_code: string;
  referred_by_wallet_address: string | null;
  current_streak: number;
  longest_streak: number;
  total_check_ins: number;
  reward_balance: number;
  last_check_in_on: string | null;
  created_at: string;
  updated_at: string;
};

export type CheckInRow = {
  id: string;
  wallet_address: string;
  check_in_date: string;
  streak_count: number;
  reward_amount: number;
  created_at: string;
};

export type RewardRow = {
  id: string;
  wallet_address: string;
  amount: number;
  reward_type:
    | "daily_check_in"
    | "streak_milestone_bonus"
    | "referral_bonus"
    | "manual_bonus";
  reference_id: string | null;
  note: string | null;
  created_at: string;
};

export type ReferralRow = {
  id: string;
  referrer_wallet_address: string;
  referee_wallet_address: string | null;
  referral_code: string;
  status: "pending" | "completed";
  bonus_amount: number;
  created_at: string;
  completed_at: string | null;
};

export type UpsertUserProfileInput = {
  walletAddress: string;
  username?: string | null;
  avatarUrl?: string | null;
  referredByWalletAddress?: string | null;
};

export type CreateRewardInput = {
  walletAddress: string;
  amount: number;
  rewardType: RewardRow["reward_type"];
  note?: string | null;
  referenceId?: string | null;
};

export type CreateReferralInput = {
  referrerWalletAddress: string;
  referralCode: string;
  refereeWalletAddress?: string | null;
};

function requireSupabaseAdminClient() {
  const client = getSupabaseAdminClient();

  if (!client) {
    throw new Error(
      "Supabase admin client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return client;
}

function createReferralCode(walletAddress: string) {
  const prefix = walletAddress.slice(0, 4).toUpperCase();
  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();

  return `${prefix}-${suffix}`;
}

export async function getUserByWallet(walletAddress: string) {
  const supabase = requireSupabaseAdminClient();
  const normalizedWallet = normalizeWalletAddress(walletAddress);

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("wallet_address", normalizedWallet)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as UserRow | null) ?? null;
}

export async function getUserByReferralCode(referralCode: string) {
  const supabase = requireSupabaseAdminClient();
  const normalizedReferralCode = normalizeReferralCode(referralCode);

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("referral_code", normalizedReferralCode)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as UserRow | null) ?? null;
}

export async function upsertUserProfile(input: UpsertUserProfileInput) {
  const supabase = requireSupabaseAdminClient();
  const normalizedWallet = normalizeWalletAddress(input.walletAddress);
  const existingUser = await getUserByWallet(normalizedWallet);

  const payload = {
    wallet_address: normalizedWallet,
    username: input.username ?? existingUser?.username ?? null,
    avatar_url: input.avatarUrl ?? existingUser?.avatar_url ?? null,
    referral_code:
      existingUser?.referral_code ?? normalizeReferralCode(createReferralCode(normalizedWallet)),
    referred_by_wallet_address:
      input.referredByWalletAddress ?? existingUser?.referred_by_wallet_address ?? null,
  };

  const { data, error } = await supabase
    .from("users")
    .upsert(payload, { onConflict: "wallet_address" })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as UserRow;
}

export async function getOrCreateUserByWallet(walletAddress: string, referralCode?: string | null) {
  const normalizedWallet = normalizeWalletAddress(walletAddress);
  const existingUser = await getUserByWallet(normalizedWallet);

  if (existingUser) {
    return existingUser;
  }

  let referredByWalletAddress: string | null = null;
  let referrerReferralCode: string | null = null;

  if (referralCode) {
    const referrer = await getUserByReferralCode(referralCode);

    if (referrer && referrer.wallet_address !== normalizedWallet) {
      referredByWalletAddress = referrer.wallet_address;
      referrerReferralCode = referrer.referral_code;
    }
  }

  const createdUser = await upsertUserProfile({
    walletAddress: normalizedWallet,
    referredByWalletAddress,
  });

  if (referredByWalletAddress && referrerReferralCode) {
    const supabase = requireSupabaseAdminClient();
    const { error } = await supabase.from("referrals").insert({
      referrer_wallet_address: referredByWalletAddress,
      referee_wallet_address: normalizedWallet,
      referral_code: referrerReferralCode,
    });

    if (error && error.code !== "23505") {
      throw error;
    }
  }

  return createdUser;
}

export async function listCheckIns(walletAddress: string, limit = 30) {
  const supabase = requireSupabaseAdminClient();
  const normalizedWallet = normalizeWalletAddress(walletAddress);

  const { data, error } = await supabase
    .from("check_ins")
    .select("*")
    .eq("wallet_address", normalizedWallet)
    .order("check_in_date", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data as CheckInRow[]) ?? [];
}

export async function listRewards(walletAddress: string, limit = 20) {
  const supabase = requireSupabaseAdminClient();
  const normalizedWallet = normalizeWalletAddress(walletAddress);

  const { data, error } = await supabase
    .from("rewards")
    .select("*")
    .eq("wallet_address", normalizedWallet)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data as RewardRow[]) ?? [];
}

export async function addReward(input: CreateRewardInput) {
  const supabase = requireSupabaseAdminClient();
  const normalizedWallet = normalizeWalletAddress(input.walletAddress);

  const { data, error } = await supabase
    .from("rewards")
    .insert({
      wallet_address: normalizedWallet,
      amount: input.amount,
      reward_type: input.rewardType,
      note: input.note ?? null,
      reference_id: input.referenceId ?? null,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as RewardRow;
}

export async function listReferrals(walletAddress: string, limit = 20) {
  const supabase = requireSupabaseAdminClient();
  const normalizedWallet = normalizeWalletAddress(walletAddress);

  const { data, error } = await supabase
    .from("referrals")
    .select("*")
    .eq("referrer_wallet_address", normalizedWallet)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data as ReferralRow[]) ?? [];
}

export async function getPendingReferralForReferee(walletAddress: string) {
  const supabase = requireSupabaseAdminClient();
  const normalizedWallet = normalizeWalletAddress(walletAddress);

  const { data, error } = await supabase
    .from("referrals")
    .select("*")
    .eq("referee_wallet_address", normalizedWallet)
    .eq("status", "pending")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as ReferralRow | null) ?? null;
}

export async function createReferral(input: CreateReferralInput) {
  const supabase = requireSupabaseAdminClient();

  const { data, error } = await supabase
    .from("referrals")
    .insert({
      referrer_wallet_address: normalizeWalletAddress(input.referrerWalletAddress),
      referee_wallet_address: input.refereeWalletAddress
        ? normalizeWalletAddress(input.refereeWalletAddress)
        : null,
      referral_code: input.referralCode,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as ReferralRow;
}

export async function completeReferral(referralId: string, bonusAmount = REFERRAL_BONUS_REWARD) {
  const supabase = requireSupabaseAdminClient();
  const { data: existingReferral, error: existingReferralError } = await supabase
    .from("referrals")
    .select("*")
    .eq("id", referralId)
    .single();

  if (existingReferralError) {
    throw existingReferralError;
  }

  if ((existingReferral as ReferralRow).status === "completed") {
    return existingReferral as ReferralRow;
  }

  const { data: referral, error: referralError } = await supabase
    .from("referrals")
    .update({
      status: "completed",
      bonus_amount: bonusAmount,
      completed_at: new Date().toISOString(),
    })
    .eq("id", referralId)
    .select("*")
    .single();

  if (referralError) {
    throw referralError;
  }

  const typedReferral = referral as ReferralRow;
  const referrer = await getOrCreateUserByWallet(typedReferral.referrer_wallet_address);

  const { error: userError } = await supabase
    .from("users")
    .update({
      reward_balance: referrer.reward_balance + bonusAmount,
    })
    .eq("wallet_address", typedReferral.referrer_wallet_address);

  if (userError) {
    throw userError;
  }

  await addReward({
    walletAddress: typedReferral.referrer_wallet_address,
    amount: bonusAmount,
    rewardType: "referral_bonus",
    note: "Referral bonus",
    referenceId: typedReferral.id,
  });

  return typedReferral;
}

export async function recordDailyCheckIn(
  walletAddress: string,
  rewardAmount = DAILY_CHECK_IN_REWARD,
  referralCode?: string | null,
) {
  const supabase = requireSupabaseAdminClient();
  const user = await getOrCreateUserByWallet(walletAddress, referralCode);
  const today = getTodayDateString();
  const normalizedWallet = normalizeWalletAddress(walletAddress);

  const { data: existingCheckIn, error: existingCheckInError } = await supabase
    .from("check_ins")
    .select("*")
    .eq("wallet_address", normalizedWallet)
    .eq("check_in_date", today)
    .maybeSingle();

  if (existingCheckInError) {
    throw existingCheckInError;
  }

  if (existingCheckIn) {
    return {
      alreadyCheckedIn: true,
      checkIn: existingCheckIn as CheckInRow,
      rewards: [],
      milestoneBonusAwarded: 0,
      totalRewardAwarded: 0,
      streakIncreased: false,
      user,
    };
  }

  const nextStreak = calculateNextStreak(user.last_check_in_on, user.current_streak, today);
  const streakIncreased = nextStreak > user.current_streak;
  const milestoneBonusAmount = getStreakMilestoneBonus(nextStreak);
  const totalRewardAwarded = rewardAmount + milestoneBonusAmount;
  const updatedUserPayload = {
    current_streak: nextStreak,
    longest_streak: Math.max(user.longest_streak, nextStreak),
    total_check_ins: user.total_check_ins + 1,
    reward_balance: user.reward_balance + totalRewardAwarded,
    last_check_in_on: today,
  };

  const { data: checkIn, error: checkInError } = await supabase
    .from("check_ins")
    .insert({
      wallet_address: normalizedWallet,
      check_in_date: today,
      streak_count: nextStreak,
      reward_amount: totalRewardAwarded,
    })
    .select("*")
    .single();

  if (checkInError) {
    if (checkInError.code === "23505") {
      const { data: duplicateCheckIn, error: duplicateCheckInError } = await supabase
        .from("check_ins")
        .select("*")
        .eq("wallet_address", normalizedWallet)
        .eq("check_in_date", today)
        .single();

      if (duplicateCheckInError) {
        throw duplicateCheckInError;
      }

      return {
        alreadyCheckedIn: true,
        checkIn: duplicateCheckIn as CheckInRow,
        rewards: [],
        milestoneBonusAwarded: 0,
        totalRewardAwarded: 0,
        streakIncreased: false,
        user,
      };
    }

    throw checkInError;
  }

  const rewards = [
    await addReward({
      walletAddress: normalizedWallet,
      amount: rewardAmount,
      rewardType: "daily_check_in",
      note: "Daily check-in reward",
      referenceId: (checkIn as CheckInRow).id,
    }),
  ];

  if (milestoneBonusAmount > 0) {
    rewards.push(
      await addReward({
        walletAddress: normalizedWallet,
        amount: milestoneBonusAmount,
        rewardType: "streak_milestone_bonus",
        note: `${STREAK_BONUS_REWARD}-point streak milestone bonus`,
        referenceId: (checkIn as CheckInRow).id,
      }),
    );
  }

  const { data: updatedUser, error: updatedUserError } = await supabase
    .from("users")
    .update(updatedUserPayload)
    .eq("wallet_address", normalizedWallet)
    .select("*")
    .single();

  if (updatedUserError) {
    throw updatedUserError;
  }

  let referralBonusAwarded = 0;

  if (user.total_check_ins === 0 && user.referred_by_wallet_address) {
    const pendingReferral = await getPendingReferralForReferee(normalizedWallet);

    if (pendingReferral) {
      await completeReferral(pendingReferral.id, REFERRAL_BONUS_REWARD);
      referralBonusAwarded = REFERRAL_BONUS_REWARD;
    }
  }

  return {
    alreadyCheckedIn: false,
    checkIn: checkIn as CheckInRow,
    rewards,
    milestoneBonusAwarded: milestoneBonusAmount,
    referralBonusAwarded,
    totalRewardAwarded,
    streakIncreased,
    user: updatedUser as UserRow,
  };
}

export async function getDashboardSnapshot(walletAddress: string, referralCode?: string | null) {
  const user = await getOrCreateUserByWallet(walletAddress, referralCode);
  const [checkInsResult, rewardsResult, referralsResult, tokenGateResult] = await Promise.allSettled([
    listCheckIns(walletAddress, 14),
    listRewards(walletAddress, 10),
    listReferrals(walletAddress, 10),
    getTokenGateStatus(walletAddress),
  ]);

  return {
    user,
    checkIns: checkInsResult.status === "fulfilled" ? checkInsResult.value : [],
    rewards: rewardsResult.status === "fulfilled" ? rewardsResult.value : [],
    referrals: referralsResult.status === "fulfilled" ? referralsResult.value : [],
    tokenGate:
      tokenGateResult.status === "fulfilled"
        ? tokenGateResult.value
        : {
            isConfigured: false,
            isEligible: false,
            currentBalance: 0,
            threshold: 25,
            tokenSymbol: "STREAK",
            mintAddress: null,
            statusLabel: "Perks locked",
            helperText: "Token holdings could not be verified right now.",
          },
  };
}
