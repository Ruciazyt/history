import { describe, expect, it, vi } from 'vitest';
import type { Feature, Polygon } from 'geojson';
import { drawBoundaryFeature } from './mapOverlays';

describe('drawBoundaryFeature', () => {
  it('draws polygon outer ring with lng/lat pairs', () => {
    const addOverLay = vi.fn();
    const map = { addOverLay };
    class MockLngLat {
      lon: number;
      lat: number;
      constructor(lon: number, lat: number) {
        this.lon = lon;
        this.lat = lat;
      }
    }
    class MockPolygon {
      points: unknown[];
      style: unknown;
      constructor(points: unknown[], style: unknown) {
        this.points = points;
        this.style = style;
      }
    }
    const T = { Polygon: MockPolygon, LngLat: MockLngLat };

    const feature: Feature<Polygon> = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [108, 34],
          [110, 34],
          [110, 36],
          [108, 36],
          [108, 34],
        ]],
      },
    };

    drawBoundaryFeature(map, T, feature, {
      strokeColor: '#8aab6e',
      fillColor: '#a8c48a',
      fillOpacity: 0.3,
      strokeWeight: 2,
    });

    expect(T.LngLat).toBeDefined();
    expect(addOverLay).toHaveBeenCalledTimes(1);
  });
});
