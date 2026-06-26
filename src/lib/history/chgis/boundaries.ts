import type { BoundaryFeature } from '@/lib/history/mapOverlays';
import { getNearestChgisSnapshot, shouldUseChgisForYear } from '@/lib/history/chgis/resolver';

export type ChgisBoundaryLayer = {
  id: string;
  feature: BoundaryFeature;
};

/** 按年份返回 CHGIS 疆域图层；无覆盖或超出 maxDelta 时返回空数组 */
export function getChgisBoundariesForYear(year: number, maxDelta = 80): ChgisBoundaryLayer[] {
  if (!shouldUseChgisForYear(year)) return [];

  const snapshot = getNearestChgisSnapshot(year, maxDelta);
  if (!snapshot) return [];

  const seen = new Set<string>();
  const result: ChgisBoundaryLayer[] = [];

  for (const feature of snapshot.features) {
    const id = `chgis-${String(feature.id ?? feature.properties.sysId)}`;
    if (seen.has(id)) continue;
    seen.add(id);
    result.push({ id, feature });
  }

  return result;
}
