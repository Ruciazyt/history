import { describe, expect, it } from 'vitest';
import { computeMinZoomToFillViewport, MAP_MIN_ZOOM_FLOOR } from '@/lib/history/constants/map';

describe('computeMinZoomToFillViewport', () => {
  it('returns floor for narrow widths', () => {
    expect(computeMinZoomToFillViewport(800)).toBe(MAP_MIN_ZOOM_FLOOR);
  });

  it('scales up for wide viewports', () => {
    expect(computeMinZoomToFillViewport(1920)).toBe(MAP_MIN_ZOOM_FLOOR);
    expect(computeMinZoomToFillViewport(8192)).toBe(5);
  });
});
