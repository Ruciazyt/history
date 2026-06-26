import { describe, expect, it } from 'vitest';
import { getChgisBoundariesForYear } from '@/lib/history/chgis/boundaries';
import {
  CHGIS_MIN_YEAR,
  getChgisSnapshot,
  getNearestChgisSnapshot,
  hasChgisSnapshots,
  shouldUseChgisForYear,
} from '@/lib/history/chgis/resolver';

describe('chgis resolver', () => {
  it('has built snapshots', () => {
    expect(hasChgisSnapshots()).toBe(true);
  });

  it('returns exact snapshot for -221', () => {
    const snap = getChgisSnapshot(-221);
    expect(snap).not.toBeNull();
    expect(snap?.properties.year).toBe(-221);
    expect(snap?.features.length).toBeGreaterThan(0);
  });

  it('picks nearest snapshot within delta', () => {
    expect(getNearestChgisSnapshot(-218)?.properties.year).toBe(-221);
    expect(getNearestChgisSnapshot(600)?.properties.year).toBe(618);
  });

  it('returns null when too far from any snapshot', () => {
    expect(getNearestChgisSnapshot(-400, 50)).toBeNull();
  });

  it('shouldUseChgisForYear respects min year', () => {
    expect(CHGIS_MIN_YEAR).toBe(-224);
    expect(shouldUseChgisForYear(-350)).toBe(false);
    expect(shouldUseChgisForYear(-221)).toBe(true);
  });
});

describe('getChgisBoundariesForYear', () => {
  it('returns features for covered years', () => {
    const layers = getChgisBoundariesForYear(-221);
    expect(layers.length).toBeGreaterThan(0);
    expect(layers[0]?.id.startsWith('chgis-')).toBe(true);
  });

  it('returns empty before CHGIS coverage', () => {
    expect(getChgisBoundariesForYear(-350)).toEqual([]);
  });
});
