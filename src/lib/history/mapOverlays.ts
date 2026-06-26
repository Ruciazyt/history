import type { Feature, MultiPolygon, Polygon } from 'geojson';

export type BoundaryFeature = Feature<Polygon | MultiPolygon>;

export type BoundaryDrawStyle = {
  strokeColor: string;
  fillColor: string;
  fillOpacity: number;
  strokeWeight: number;
};

/** 在天地图上绘制 GeoJSON 疆域 polygon */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function drawBoundaryFeature(map: any, T: any, feature: BoundaryFeature, style: BoundaryDrawStyle) {
  const drawRing = (ring: number[][]) => {
    if (!ring || ring.length < 3) return;
    const points = ring
      .filter((c) => c.length >= 2 && Number.isFinite(c[0]) && Number.isFinite(c[1]))
      .map((c) => new T.LngLat(c[0], c[1]));
    if (points.length < 3) return;

    map.addOverLay(
      new T.Polygon(points, {
        strokeColor: style.strokeColor,
        strokeWeight: style.strokeWeight,
        fillColor: style.fillColor,
        fillOpacity: style.fillOpacity,
      })
    );
  };

  const { type, coordinates } = feature.geometry;
  if (type === 'Polygon') {
    for (const ring of coordinates) drawRing(ring);
    return;
  }
  if (type === 'MultiPolygon') {
    for (const polygon of coordinates) {
      for (const ring of polygon) drawRing(ring);
    }
  }
}
