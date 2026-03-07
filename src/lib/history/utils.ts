export function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
