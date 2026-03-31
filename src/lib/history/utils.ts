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
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Group array items by a key function
 */
export function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Sort array by numeric key
 */
export function sortBy<T>(array: T[], keyFn: (item: T) => number, order: 'asc' | 'desc' = 'asc'): T[] {
  const sorted = [...array];
  sorted.sort((a, b) => {
    const diff = keyFn(a) - keyFn(b);
    return order === 'asc' ? diff : -diff;
  });
  return sorted;
}

/**
 * Remove duplicates from array by key
 */
export function uniqueBy<T>(array: T[], keyFn: (item: T) => string): T[] {
  const seen = new Set<string>();
  return array.filter(item => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Safely access nested object property
 */
export function get<T>(obj: unknown, path: string, defaultValue?: T): T | undefined {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined) return defaultValue;
    current = (current as Record<string, unknown>)[key];
  }
  return (current as T) ?? defaultValue;
}

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Generate a unique ID
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(item => deepClone(item)) as T;
  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * Pick only specified keys from object
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Omit specified keys from object
 */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

/**
 * Check if two arrays are equal
 */
export function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  return a.every((val, i) => val === b[i]);
}

/**
 * Convert number to ordinal string (1st, 2nd, 3rd, etc.)
 */
export function toOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'] as const;
  const v = n % 100;
  let suffix: string = s[0]; // default to 'th'
  // Numbers ending in 11, 12, 13 always use 'th'
  if (v >= 11 && v <= 13) {
    suffix = s[0];
  } else {
    // For other numbers, use v % 10 to determine suffix
    const idx = (v % 10);
    if (idx >= 1 && idx <= 3 && idx !== 0) {
      suffix = s[idx] ?? s[0];
    } else {
      suffix = s[0];
    }
  }
  return n + suffix;
}

/**
 * Calculate percentage
 */
export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Format number with Chinese units (万, 亿)
 */
export function formatNumberWithUnit(num: number): string {
  if (num >= 100000000) {
    return `${(num / 100000000).toFixed(1)}亿`;
  }
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`;
  }
  return num.toString();
}

/**
 * Parse year string to number (e.g., "前260" -> -260, "2024" -> 2024)
 */
export function parseYear(yearStr: string): number {
  const match = yearStr.match(/^(前)(\d+)$/);
  if (match && match[2]) {
    return -parseInt(match[2], 10);
  }
  return parseInt(yearStr, 10);
}

/**
 * Type guard: check if value is a valid Event
 */
export function isEvent(value: unknown): value is import('./types').Event {
  if (!value || typeof value !== 'object') return false;
  const event = value as Record<string, unknown>;
  return typeof event.id === 'string' && typeof event.year === 'number';
}

/**
 * Type guard: check if Event has battle data
 */
export function hasBattleData(event: import('./types').Event): event is import('./types').Event & { battle: NonNullable<import('./types').Event['battle']> } {
  return !!event.battle && !!event.battle.belligerents;
}

/**
 * Type guard: check if value is an array
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Type guard: check if value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Type guard: check if value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Type guard: check if value is a valid object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert camelCase to kebab-case
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Convert kebab-case to camelCase
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Debounce function execution
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function execution
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Create a range of numbers
 */
export function range(start: number, end: number, step: number = 1): number[] {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
}

/**
 * Calculate average of numbers
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

/**
 * Sum of numbers
 */
export function sum(numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

/**
 * Check if two objects are equal (shallow compare)
 */
export function shallowEqual(obj1: Record<string, unknown>, obj2: Record<string, unknown>): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  return keys1.every(key => obj1[key] === obj2[key]);
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
