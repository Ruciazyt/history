import type { ChgisFeature } from '@/lib/history/chgis/types';
import type { BoundaryFeature } from '@/lib/history/mapOverlays';
import { CHGIS_DEFAULT_BOUNDARY_COLORS, getChgisEraColors } from '@/lib/history/chgis/colors';
import { getNearestChgisSnapshot, shouldUseChgisForYear } from '@/lib/history/chgis/resolver';
import { clamp } from '@/lib/history/utils';

export type ChgisBoundaryLayer = {
  id: string;
  feature: BoundaryFeature;
  nameCh: string;
  strokeColor: string;
  fillColor: string;
  fillOpacity: number;
};

type EraBoundaryInput = {
  id: string;
  startYear: number;
  endYear: number;
};

function isFeatureActiveAtYear(feature: ChgisFeature, year: number): boolean {
  const { begYr, endYr } = feature.properties;
  return begYr <= year && year <= endYr;
}

function collectSnapshotLayers(
  eraId: string,
  year: number,
  colors: { fillColor: string; strokeColor: string },
  maxDelta: number
): ChgisBoundaryLayer[] {
  if (!shouldUseChgisForYear(year)) return [];

  const snapshot = getNearestChgisSnapshot(year, maxDelta);
  if (!snapshot) return [];

  const seen = new Set<string>();
  const result: ChgisBoundaryLayer[] = [];

  for (const feature of snapshot.features) {
    if (!isFeatureActiveAtYear(feature, year)) continue;

    const featureKey = String(feature.id ?? feature.properties.sysId);
    if (seen.has(featureKey)) continue;
    seen.add(featureKey);

    result.push({
      id: `${eraId}-chgis-${featureKey}`,
      feature,
      nameCh: feature.properties.nameCh,
      strokeColor: colors.strokeColor,
      fillColor: colors.fillColor,
      fillOpacity: 0.26,
    });
  }

  return result;
}

/** 侧栏展开的各朝代叠加显示；同朝代内统一颜色，不同朝代颜色区分 */
export function getChgisBoundariesForOpenEras(
  openEraIds: Iterable<string>,
  eras: readonly EraBoundaryInput[],
  year: number,
  maxDelta = 80
): ChgisBoundaryLayer[] {
  const eraById = new Map(eras.map((era) => [era.id, era]));
  const result: ChgisBoundaryLayer[] = [];

  for (const eraId of openEraIds) {
    const era = eraById.get(eraId);
    if (!era) continue;

    const eraYear = clamp(year, era.startYear, era.endYear);
    const colors = getChgisEraColors(eraId);
    result.push(...collectSnapshotLayers(eraId, eraYear, colors, maxDelta));
  }

  return result;
}

/** 按年份返回 CHGIS 疆域（单色，无朝代上下文时使用） */
export function getChgisBoundariesForYear(year: number, maxDelta = 80): ChgisBoundaryLayer[] {
  return collectSnapshotLayers('year', year, CHGIS_DEFAULT_BOUNDARY_COLORS, maxDelta);
}
