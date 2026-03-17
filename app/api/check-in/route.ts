import { NextResponse } from "next/server";
import { buildCheckInFeedback, buildDashboardViewModel } from "@/lib/dashboard-view";
import { buildWalletPreviewDashboard } from "@/lib/dashboard-preview";
import { getErrorMessage } from "@/lib/errors";
import { normalizeWalletAddress } from "@/lib/solana";
import { normalizeReferralCode } from "@/lib/referrals";
import { getDashboardSnapshot, recordDailyCheckIn } from "@/lib/supabase/mvp-data";
import { getTokenGateStatus } from "@/lib/token-gating";

type CheckInRequestBody = {
  walletAddress?: string;
  referralCode?: string | null;
};

export async function POST(request: Request) {
  let normalizedWalletAddress = "";

  try {
    const body = (await request.json()) as CheckInRequestBody;

    if (!body.walletAddress) {
      return NextResponse.json({ error: "walletAddress is required" }, { status: 400 });
    }

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
    let dashboard;

    try {
      const snapshot = await getDashboardSnapshot(normalizedWalletAddress, normalizedReferralCode);
      dashboard = buildDashboardViewModel(snapshot);
    } catch {
      dashboard = buildDashboardViewModel({
        user: checkInResult.user,
        checkIns: [checkInResult.checkIn],
        rewards: checkInResult.rewards,
        referrals: [],
        tokenGate: await getTokenGateStatus(normalizedWalletAddress),
      });
    }

    return NextResponse.json({
      dashboard,
      feedback: buildCheckInFeedback({
        alreadyCheckedIn: checkInResult.alreadyCheckedIn,
        currentStreak: checkInResult.user.current_streak,
        milestoneBonusAwarded: checkInResult.milestoneBonusAwarded,
        streakIncreased: checkInResult.streakIncreased,
        totalRewardAwarded: checkInResult.totalRewardAwarded,
      }),
    });
  } catch (error) {
    const message = getErrorMessage(error, "Unable to record check-in");

    return NextResponse.json(
      { error: message, dashboard: buildWalletPreviewDashboard(normalizedWalletAddress ?? "") },
      { status: 500 },
    );
  }
}
