export function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallback;
}

export function getUserFacingDataErrorMessage(message: string) {
  if (
    message.includes("Could not find the table 'public.users'") ||
    message.includes("Could not find the table 'public.check_ins'") ||
    message.includes("Could not find the table 'public.rewards'") ||
    message.includes("Could not find the table 'public.referrals'")
  ) {
    return "Supabase schema is not set up yet. Run the migration in supabase/migrations/20260317170000_streakfi_mvp.sql, then refresh.";
  }

  if (message.includes("fetch failed")) {
    return "Could not sync with Supabase right now. Your network, project status, or API credentials may need another check.";
  }

  return message;
}
