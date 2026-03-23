export const DAY_MS = 24 * 60 * 60 * 1000;

export const parseLocalDate = (value: string): Date => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
};

export const addDays = (date: Date, days: number): Date => {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
};

export const formatDateLong = (date: Date): string =>
  date.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

export const formatDateShort = (date: Date): string =>
  date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

export interface DateDifferenceResult {
  days: number;
  weeks: number;
  months: number;
  years: number;
}

export const calculateDateDifference = (first: Date, second: Date): DateDifferenceResult => {
  const diffMs = Math.abs(second.getTime() - first.getTime());
  const days = Math.floor(diffMs / DAY_MS);
  const weeks = days / 7;
  const months = days / 30.4375;
  const years = days / 365.25;

  return {
    days,
    weeks,
    months,
    years
  };
};
