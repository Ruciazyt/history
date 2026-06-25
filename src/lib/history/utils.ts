/**
 * Format a year number to a human-readable string.
 * Supports both English (BCE/CE) and Chinese (公元前/公元) formats.
 * @param year - Negative numbers are BCE, positive are CE. Year 0 is treated as 1 CE
 *   (historically there is no "year 0" — the calendar transitions directly from
 *   1 BCE to 1 CE; mapping 0 → 1 CE avoids displaying the non-existent "公元0年").
 * @param locale - 'en' for BCE/CE, 'zh' or 'ja' for 公元前/公元. Defaults to 'en'.
 */
export function formatYear(year: number, locale: string = 'en'): string {
  // Year 0 does not exist historically; map it to 1 CE
  const displayYear = year === 0 ? 1 : year;
  if (displayYear < 0) {
    const abs = Math.abs(displayYear);
    return locale === 'zh' || locale === 'ja' ? `公元前${abs}年` : `${abs} BCE`;
  }
  return locale === 'zh' || locale === 'ja' ? `公元${displayYear}年` : `${displayYear} CE`;
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Check if a pathname matches a given route path.
 * Handles trailing slashes and locale prefixes.
 * @param pathname - The full pathname from usePathname()
 * @param locale - The current locale
 * @param path - The route path to match (e.g. '/timeline', '/battles')
 */
export function matchPath(pathname: string, locale: string, path: string): boolean {
  // Strip trailing slash for comparison
  const clean = (s: string) => s.replace(/\/$/, '');
  return clean(pathname) === `/${locale}${path}`;
}
