import { BaseCard } from "@/components/cards/base-card";
import { Chip } from "@/components/ui/chip";

type CurrentStreakCardProps = {
  currentStreak: string;
  bestStreak: string;
  streakGoal: string;
};

function getStreakProgressPercent(currentStreak: string) {
  const streakValue = Number.parseInt(currentStreak, 10);

  if (!Number.isFinite(streakValue) || streakValue <= 0) {
    return 0;
  }

  const interval = 7;
  const remainder = streakValue % interval;
  const completedSteps = remainder === 0 ? interval : remainder;

  return Math.min(100, Math.round((completedSteps / interval) * 100));
}

export function CurrentStreakCard({
  currentStreak,
  bestStreak,
  streakGoal,
}: CurrentStreakCardProps) {
  const streakProgressPercent = getStreakProgressPercent(currentStreak);

  return (
    <BaseCard className="space-y-5 overflow-hidden bg-gradient-to-br from-ink via-[#18375d] to-[#214870] text-white">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Chip className="border-white/14 bg-white/14 text-white">Current streak</Chip>
          <div>
            <h2 className="display-font text-5xl font-semibold leading-none sm:text-6xl">
              {currentStreak} days
            </h2>
            <p className="mt-2 max-w-xs text-sm leading-6 text-white/82 sm:text-base">
              Small daily actions are adding up. One quick check-in keeps the momentum going.
            </p>
          </div>
        </div>
        <div className="rounded-[1.6rem] bg-white/14 px-4 py-4 text-right">
          <p className="text-xs uppercase tracking-[0.22em] text-white/72">Best streak</p>
          <p className="mt-2 text-xl font-semibold">{bestStreak}</p>
        </div>
      </div>

      <div className="rounded-[1.8rem] bg-white/14 p-4 backdrop-blur">
        <div className="flex items-center justify-between text-sm text-white/82">
          <span>Next streak milestone</span>
          <span>{streakGoal}</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-white/16">
          <div
            className="h-2 rounded-full bg-coral transition-all"
            style={{ width: `${streakProgressPercent}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-white/82">
          Keep showing up daily to stack rewards and unlock bigger moments.
        </p>
      </div>
    </BaseCard>
  );
}
