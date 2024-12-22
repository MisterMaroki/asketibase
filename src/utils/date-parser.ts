import Sherlock from 'sherlockjs';

export function parseNaturalDate(input: string): Date | null {
  try {
    const parsed = Sherlock.parse(input);
    return parsed.startDate || null;
  } catch {
    return null;
  }
}

export function formatDateRange(startDate: Date | null, endDate: Date | null): string {
  if (!startDate) return '';
  if (!endDate) return startDate.toLocaleDateString();
  return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
}
