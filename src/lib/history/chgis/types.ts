import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';

export type ChgisFeatureProperties = {
  sysId: number;
  nameCh: string;
  namePy: string;
  begYr: number;
  endYr: number;
  levRank: string;
};

export type ChgisFeature = Feature<Polygon | MultiPolygon, ChgisFeatureProperties>;

export type ChgisSnapshotMeta = {
  source: string;
  year: number;
  featureCount: number;
};

export type ChgisSnapshot = FeatureCollection<Polygon | MultiPolygon, ChgisFeatureProperties> & {
  properties: ChgisSnapshotMeta;
};
