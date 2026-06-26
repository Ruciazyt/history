export type {
  ChgisFeature,
  ChgisFeatureProperties,
  ChgisSnapshot,
  ChgisSnapshotMeta,
} from '@/lib/history/chgis/types';

export {
  CHGIS_MIN_YEAR,
  getChgisSnapshot,
  getChgisYears,
  getNearestChgisSnapshot,
  hasChgisSnapshots,
  shouldUseChgisForYear,
} from '@/lib/history/chgis/resolver';

export { getChgisBoundariesForOpenEras, getChgisBoundariesForYear, type ChgisBoundaryLayer } from '@/lib/history/chgis/boundaries';
export { CHGIS_DEFAULT_BOUNDARY_COLORS, getChgisEraColors } from '@/lib/history/chgis/colors';
