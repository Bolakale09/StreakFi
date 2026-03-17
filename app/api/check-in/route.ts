import { NextResponse } from "next/server";
import { buildCheckInFeedback, buildDashboardViewModel } from "@/lib/dashboard-view";
import { normalizeWalletAddress } from "@/lib/solana";
import { normalizeReferralCode } from "@/lib/referrals";
import { getDashboardSnapshot, recordDailyCheckIn } from "@/lib/supabase/mvp-data";

type CheckInRequestBody = {
  walletAddress?: string;
  referralCode?: string | null;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckInRequestBody;

    if (!body.walletAddress) {
      return NextResponse.json({ error: "walletAddress is required" }, { status: 400 });
    }

    let normalizedWalletAddress: string;

    try {
      normalizedWalletAddress = normalizeWalletAddress(body.walletAddress);
    } catch {
      return NextResponse.json({ error: "walletAddress is invalid" }, { status: 400 });
    }

    const normalizedReferralCode = body.referralCode
      ? normalizeReferralCode(body.referralCode)
      : null;
    const checkInResult = await recordDailyCheckIn(
      normalizedWalletAddress,
      undefined,
      normalizedReferralCode,
    );
    const snapshot = await getDashboardSnapshot(normalizedWalletAddress, normalizedReferralCode);

    return NextResponse.json({
      dashboard: buildDashboardViewModel(snapshot),
      feedback: buildCheckInFeedback({
        alreadyCheckedIn: checkInResult.alreadyCheckedIn,
        currentStreak: checkInResult.user.current_streak,
        milestoneBonusAwarded: checkInResult.milestoneBonusAwarded,
        streakIncreased: checkInResult.streakIncreased,
        totalRewardAwarded: checkInResult.totalRewardAwarded,
      }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to record check-in";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
