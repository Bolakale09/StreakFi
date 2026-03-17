"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  REFERRAL_QUERY_PARAM,
  normalizeReferralCode,
  readStoredReferralCode,
} from "@/lib/referrals";

export function useReferralCode() {
  const searchParams = useSearchParams();
  const [storedReferralCode, setStoredReferralCode] = useState<string | null>(null);
  const queryReferralCode = searchParams.get(REFERRAL_QUERY_PARAM);

  useEffect(() => {
    setStoredReferralCode(readStoredReferralCode());
  }, [queryReferralCode]);

  return useMemo(() => {
    if (queryReferralCode) {
      return normalizeReferralCode(queryReferralCode);
    }

    return storedReferralCode;
  }, [queryReferralCode, storedReferralCode]);
}
