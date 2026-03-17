type StreakSummary = {
  currentStreak: number;
  longestStreak: number;
};

function toUtcDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function differenceInDays(a: string, b: string) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return Math.round((toUtcDate(a).getTime() - toUtcDate(b).getTime()) / millisecondsPerDay);
}

export function getTodayDateString(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function isSameDateString(a: string | null, b: string | null) {
  return Boolean(a && b && a === b);
}

export function hasCheckedInToday(lastCheckInOn: string | null, date = new Date()) {
  return isSameDateString(lastCheckInOn, getTodayDateString(date));
}

export function calculateNextStreak(
  lastCheckInOn: string | null,
  currentStreak: number,
  nextCheckInOn: string,
) {
  if (!lastCheckInOn) {
    return 1;
  }

  const dayGap = differenceInDays(nextCheckInOn, lastCheckInOn);

  if (dayGap <= 0) {
    return currentStreak;
  }

  if (dayGap === 1) {
    return currentStreak + 1;
  }

  return 1;
}

export function calculateStreakSummary(checkInDates: string[]): StreakSummary {
  const uniqueSortedDates = [...new Set(checkInDates)].sort();

  if (uniqueSortedDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
    };
  }

  let longestStreak = 1;
  let runningStreak = 1;

  for (let index = 1; index < uniqueSortedDates.length; index += 1) {
    const previousDate = uniqueSortedDates[index - 1];
    const currentDate = uniqueSortedDates[index];

    if (differenceInDays(currentDate, previousDate) === 1) {
      runningStreak += 1;
      longestStreak = Math.max(longestStreak, runningStreak);
    } else {
      runningStreak = 1;
    }
  }

  let currentStreak = 1;

  for (let index = uniqueSortedDates.length - 1; index > 0; index -= 1) {
    const currentDate = uniqueSortedDates[index];
    const previousDate = uniqueSortedDates[index - 1];

    if (differenceInDays(currentDate, previousDate) === 1) {
      currentStreak += 1;
    } else {
      break;
    }
  }

  return {
    currentStreak,
    longestStreak,
  };
}
