"use client";

import { BaseCard } from "@/components/cards/base-card";
import type { CheckInFeedback } from "@/lib/dashboard-view";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import type { CheckInData } from "@/lib/types";

type DailyCheckInCardProps = {
  data: CheckInData;
  onCheckIn?: () => void;
  isSubmitting?: boolean;
  disabled?: boolean;
  feedback?: CheckInFeedback | null;
  actionHint?: string;
};

export function DailyCheckInCard({
  data,
  onCheckIn,
  isSubmitting = false,
  disabled = false,
  feedback = null,
  actionHint,
}: DailyCheckInCardProps) {
  const isActionDisabled = disabled || data.checkedIn || !onCheckIn;

  return (
    <BaseCard className="space-y-5 bg-gradient-to-br from-white/92 via-white/80 to-blush/75">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <Chip className={data.checkedIn ? "bg-mint text-ink" : "bg-coral/10 text-coral"}>
            {data.statusLabel}
          </Chip>
          <div>
            <h3 className="text-2xl font-semibold leading-tight text-ink">{data.title}</h3>
            <p className="mt-1 text-sm leading-6 text-ink/70 sm:text-base">{data.description}</p>
          </div>
        </div>
        <div
          className={`rounded-3xl px-4 py-3 text-center ${
            data.checkedIn ? "bg-mint text-ink" : "bg-ink text-white"
          }`}
        >
          <p
            className={`text-xs uppercase tracking-[0.24em] ${
              data.checkedIn ? "text-ink/55" : "text-white/70"
            }`}
          >
            Streak
          </p>
          <p className="display-font text-3xl leading-none">{data.streakCount}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl bg-white/75 p-4">
          <div className="flex items-center justify-between text-sm text-ink/65">
            <span>Next reward unlock</span>
            <span>{data.nextRewardLabel}</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-ink/10">
            <div
              className={`h-2 rounded-full transition-all ${
                data.checkedIn ? "bg-mint" : "bg-coral"
              }`}
              style={{ width: `${data.progressPercent}%` }}
            />
          </div>
        </div>

        <div className="rounded-3xl bg-white/75 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-ink/45">Today</p>
          <p className="mt-2 text-lg font-semibold text-ink">{data.rewardToday}</p>
          <p className="mt-2 text-sm leading-6 text-ink/60">{data.checkInWindow}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          className="min-h-14 flex-1 text-base"
          disabled={isActionDisabled || isSubmitting}
          onClick={onCheckIn}
        >
          {isSubmitting ? "Saving today's check-in..." : data.ctaLabel}
        </Button>
        <div className="rounded-2xl bg-white/75 px-4 py-4 text-sm text-ink/65 sm:min-w-48">
          {actionHint ||
            (data.checkedIn
              ? "Come back tomorrow for your next check-in."
              : "One tap keeps the streak alive.")}
        </div>
      </div>

      {feedback ? (
        <div
          className={`rounded-3xl px-4 py-4 ${
            feedback.tone === "success" ? "bg-mint/75" : "bg-white/75"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
                feedback.tone === "success" ? "bg-white/70 text-ink" : "bg-ink/5 text-ink"
              }`}
            >
              {feedback.tone === "success" ? "✓" : "i"}
            </div>
            <div>
              <p className="font-semibold text-ink">{feedback.title}</p>
              <p className="mt-1 text-sm leading-6 text-ink/70">{feedback.description}</p>
            </div>
          </div>
        </div>
      ) : null}
    </BaseCard>
  );
}
