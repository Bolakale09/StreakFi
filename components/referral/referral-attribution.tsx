"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { REFERRAL_QUERY_PARAM, storeReferralCode } from "@/lib/referrals";

export function ReferralAttribution() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get(REFERRAL_QUERY_PARAM);

  useEffect(() => {
    if (!referralCode) {
      return;
    }

    storeReferralCode(referralCode);
  }, [referralCode]);

  return null;
}
