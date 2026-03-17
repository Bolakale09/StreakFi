export const REFERRAL_QUERY_PARAM = "ref";
export const REFERRAL_STORAGE_KEY = "streakfi-referral-code";
export const REFERRAL_BONUS_REWARD = 25;

export function normalizeReferralCode(value: string) {
  return value.trim().toUpperCase();
}

export function buildReferralPath(referralCode: string) {
  return `/?${REFERRAL_QUERY_PARAM}=${encodeURIComponent(normalizeReferralCode(referralCode))}`;
}

export function buildReferralUrl(referralCode: string, origin?: string) {
  const fallbackOrigin =
    origin ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

  return `${fallbackOrigin.replace(/\/$/, "")}${buildReferralPath(referralCode)}`;
}

export function readStoredReferralCode() {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(REFERRAL_STORAGE_KEY);

  return stored ? normalizeReferralCode(stored) : null;
}

export function storeReferralCode(referralCode: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(REFERRAL_STORAGE_KEY, normalizeReferralCode(referralCode));
}

export function clearStoredReferralCode() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(REFERRAL_STORAGE_KEY);
}
