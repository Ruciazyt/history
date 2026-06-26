import { chgisSnapshots, chgisYears } from '@/lib/history/data/chgis/snapshots';
import type { ChgisSnapshot } from '@/lib/history/chgis/types';

/** CHGIS 数据起始年（府级时间序列约前 224 年） */
export const CHGIS_MIN_YEAR = -224;

/** 是否已构建 CHGIS 快照数据 */
export function hasChgisSnapshots(): boolean {
  return chgisYears.length > 0;
}

/** 可用的 CHGIS 快照年份（升序） */
export function getChgisYears(): readonly number[] {
  return chgisYears;
}

/** 精确年份快照；无则 null */
export function getChgisSnapshot(year: number): ChgisSnapshot | null {
  return chgisSnapshots[year] ?? null;
}

/**
 * 选取距目标年最近的快照（需在 maxDelta 年内）。
 * 用于时间轴滑动时匹配预构建的代表年份层。
 */
export function getNearestChgisSnapshot(year: number, maxDelta = 80): ChgisSnapshot | null {
  const years: readonly number[] = chgisYears;

  let bestYear = years[0]!;
  let bestDist = Math.abs(year - bestYear);
  for (const y of years) {
    const dist = Math.abs(year - y);
    if (dist < bestDist) {
      bestDist = dist;
      bestYear = y;
    }
  }

  if (bestDist > maxDelta) return null;
  return getChgisSnapshot(bestYear);
}

/** 该年是否应优先使用 CHGIS（覆盖范围内且已有快照） */
export function shouldUseChgisForYear(year: number): boolean {
  if (year < CHGIS_MIN_YEAR) return false;
  return getNearestChgisSnapshot(year) != null;
}
