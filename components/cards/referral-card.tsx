"use client";

import { useState } from "react";
import { BaseCard } from "@/components/cards/base-card";
import { buildReferralUrl } from "@/lib/referrals";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { MetricPill } from "@/components/ui/metric-pill";
import type { ReferralData } from "@/lib/types";

type ReferralCardProps = {
  data: ReferralData;
};

export function ReferralCard({ data }: ReferralCardProps) {
  const [copied, setCopied] = useState(false);
  const referralUrl = buildReferralUrl(data.code);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Unable to copy referral link", error);
    }
  };

  const handleShare = async () => {
    if (!navigator.share) {
      await handleCopy();
      return;
    }

    try {
      await navigator.share({
        title: "Join me on StreakFi",
        text: "Use my link to start your first streak on StreakFi.",
        url: referralUrl,
      });
    } catch (error) {
      console.error("Unable to share referral link", error);
    }
  };

  return (
    <BaseCard className="space-y-4 bg-gradient-to-br from-white/92 via-blush/50 to-white/82">
      <div className="space-y-2">
        <Chip className="bg-white/75">Referrals</Chip>
        <div>
          <h3 className="text-xl font-semibold text-ink">Invite friends</h3>
          <p className="mt-1 text-sm leading-6 text-ink/70">{data.caption}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-dashed border-ink/15 bg-white/70 px-4 py-3">
        <p className="text-xs uppercase tracking-[0.24em] text-ink/45">Invite code</p>
        <p className="mt-2 text-lg font-semibold text-ink">{data.code}</p>
        <p className="mt-2 text-sm leading-6 text-ink/60">{data.hint}</p>
        <p className="mt-3 truncate text-sm text-ink/50">{buildReferralUrl(data.code)}</p>
      </div>

      {copied ? (
        <div className="rounded-3xl bg-mint/75 px-4 py-3 text-sm font-medium text-ink">
          Invite link copied. Share it anywhere to bring a friend in fast.
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <MetricPill label="Joined" value={data.joinedCount} />
        <MetricPill label="Pending bonus" value={data.pendingBonus} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button className="min-h-14 text-base" onClick={handleCopy} variant="secondary">
          {copied ? "Copied link" : "Copy invite link"}
        </Button>
        <Button className="min-h-14 text-base" onClick={handleShare}>
          {data.shareLabel}
        </Button>
      </div>
    </BaseCard>
  );
}
