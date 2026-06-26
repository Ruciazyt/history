import { describe, expect, it } from 'vitest';

import { getChgisBoundariesForOpenEras, getChgisBoundariesForYear } from '@/lib/history/chgis/boundaries';

import { getChgisEraColors } from '@/lib/history/chgis/colors';

import {

  CHGIS_MIN_YEAR,

  getChgisSnapshot,

  getNearestChgisSnapshot,

  hasChgisSnapshots,

  shouldUseChgisForYear,

} from '@/lib/history/chgis/resolver';



const TEST_ERAS = [

  { id: 'qin', startYear: -221, endYear: -206 },

  { id: 'han-western', startYear: -202, endYear: 8 },

  { id: 'tang', startYear: 618, endYear: 907 },

] as const;



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

  it('returns features for covered years with one shared color', () => {

    const layers = getChgisBoundariesForYear(-221);

    expect(layers.length).toBeGreaterThan(1);

    expect(new Set(layers.map((layer) => layer.fillColor)).size).toBe(1);

  });



  it('returns empty before CHGIS coverage', () => {

    expect(getChgisBoundariesForYear(-350)).toEqual([]);

  });



  it('filters features outside their begYr/endYr', () => {

    const at618 = getChgisBoundariesForYear(618);

    const at907 = getChgisBoundariesForYear(907);

    expect(at618.length).toBeGreaterThan(0);

    expect(at907.length).toBeGreaterThan(0);

    expect(at618.length).not.toBe(at907.length);

  });

});



describe('getChgisBoundariesForOpenEras', () => {

  it('uses one color per era and distinct colors across eras', () => {

    const layers = getChgisBoundariesForOpenEras(

      new Set(['qin', 'han-western']),

      TEST_ERAS,

      -200

    );

    const qin = layers.filter((layer) => layer.id.startsWith('qin-'));

    const han = layers.filter((layer) => layer.id.startsWith('han-western-'));



    expect(qin.length).toBeGreaterThan(0);

    expect(han.length).toBeGreaterThan(0);

    expect(new Set(qin.map((layer) => layer.fillColor)).size).toBe(1);

    expect(new Set(han.map((layer) => layer.fillColor)).size).toBe(1);

    expect(qin[0]?.fillColor).not.toBe(han[0]?.fillColor);

  });



  it('skips eras without CHGIS coverage', () => {

    const layers = getChgisBoundariesForOpenEras(

      new Set(['period-warring-states', 'qin']),

      [{ id: 'period-warring-states', startYear: -475, endYear: -221 }, ...TEST_ERAS],

      -300

    );

    expect(layers.every((layer) => layer.id.startsWith('qin-'))).toBe(true);

  });

});



describe('getChgisEraColors', () => {

  it('is stable for the same era id', () => {

    expect(getChgisEraColors('tang')).toEqual(getChgisEraColors('tang'));

  });



  it('assigns distinct fill colors for different eras', () => {

    expect(getChgisEraColors('qin').fillColor).not.toBe(getChgisEraColors('han-western').fillColor);

  });

});


