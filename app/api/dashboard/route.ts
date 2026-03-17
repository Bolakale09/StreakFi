import { NextResponse } from "next/server";
import { buildDashboardViewModel } from "@/lib/dashboard-view";
import { getErrorMessage } from "@/lib/errors";
import { normalizeWalletAddress } from "@/lib/solana";
import { normalizeReferralCode, REFERRAL_QUERY_PARAM } from "@/lib/referrals";
import { getDashboardSnapshot } from "@/lib/supabase/mvp-data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");
    const referralCode = searchParams.get(REFERRAL_QUERY_PARAM);

    if (!walletAddress) {
      return NextResponse.json({ error: "walletAddress is required" }, { status: 400 });
    }

    let normalizedWalletAddress: string;

    try {
      normalizedWalletAddress = normalizeWalletAddress(walletAddress);
    } catch {
      return NextResponse.json({ error: "walletAddress is invalid" }, { status: 400 });
    }

    const snapshot = await getDashboardSnapshot(
      normalizedWalletAddress,
      referralCode ? normalizeReferralCode(referralCode) : null,
    );

    return NextResponse.json({
      dashboard: buildDashboardViewModel(snapshot),
    });
  } catch (error) {
    const message = getErrorMessage(error, "Unable to load dashboard");

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
