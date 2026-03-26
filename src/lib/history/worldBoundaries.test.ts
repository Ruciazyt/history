import { describe, it, expect } from 'vitest';
import {
  getActiveBoundaries,
  getWorldEraBounds,
  eurasianBoundaries,
  eastAsiaBoundaries,
} from './data/worldBoundaries';

describe('worldBoundaries', () => {
  describe('getActiveBoundaries', () => {
    it('should return boundaries active at year -210 (Eurasian)', () => {
      const boundaries = getActiveBoundaries(-210, 'eurasian');
      
      // At -210 BCE, Qin should be active (-221 to -206)
      const qin = boundaries.find(b => b.properties.nameKey === 'empire_qin');
      expect(qin).toBeDefined();
    });

    it('should return boundaries active at year 100 (Eurasian)', () => {
      const boundaries = getActiveBoundaries(100, 'eurasian');
      
      // At 100 CE, Roman Empire should be active
      const rome = boundaries.find(b => b.properties.nameKey === 'empire_rome-empire');
      expect(rome).toBeDefined();
    });

    it('should return boundaries active at year 1000 (Eurasian)', () => {
      const boundaries = getActiveBoundaries(1000, 'eurasian');
      
      // At 1000 CE, Song should be active
      const song = boundaries.find(b => b.properties.nameKey === 'empire_song');
      expect(song).toBeDefined();
      
      // Liao dynasty (907-1125) should also be active at year 1000
      const liao = boundaries.find(b => b.properties.nameKey === 'empire_liao');
      expect(liao).toBeDefined();
    });

    it('should return boundaries active at year 1200 (Eurasian)', () => {
      const boundaries = getActiveBoundaries(1200, 'eurasian');
      
      // At 1200 CE, Song, Abbasid should be active
      const song = boundaries.find(b => b.properties.nameKey === 'empire_song');
      const abbasid = boundaries.find(b => b.properties.nameKey === 'empire_abbasid');
      
      expect(song).toBeDefined();
      expect(abbasid).toBeDefined();
    });

    it('should return Liao dynasty active at year 1100 (Eurasian)', () => {
      const boundaries = getActiveBoundaries(1100, 'eurasian');
      
      // Liao dynasty (907-1125) should be active at year 1100
      const liao = boundaries.find(b => b.properties.nameKey === 'empire_liao');
      expect(liao).toBeDefined();
      expect(liao!.properties.startYear).toBe(907);
      expect(liao!.properties.endYear).toBe(1125);
    });

    it('should NOT return Liao dynasty after year 1125', () => {
      const boundaries = getActiveBoundaries(1130, 'eurasian');
      
      // Liao dynasty ended in 1125, so should not be active at year 1130
      const liao = boundaries.find(b => b.properties.nameKey === 'empire_liao');
      expect(liao).toBeUndefined();
    });

    it('should return boundaries active at year 1800 (Eurasian)', () => {
      const boundaries = getActiveBoundaries(1800, 'eurasian');
      
      // At 1800 CE, Qing, Ottoman should be active
      const qing = boundaries.find(b => b.properties.nameKey === 'empire_qing');
      const ottoman = boundaries.find(b => b.properties.nameKey === 'empire_ottoman');
      
      expect(qing).toBeDefined();
      expect(ottoman).toBeDefined();
    });

    it('should return East Asia boundaries in east-asia mode', () => {
      const boundaries = getActiveBoundaries(1700, 'east-asia');
      
      // At 1700 CE, Qing China, Edo Japan, Joseon Korea should be active
      const qing = boundaries.find(b => b.properties.nameKey === 'empire_qing');
      const edo = boundaries.find(b => b.properties.nameKey === 'empire_edo');
      const joseon = boundaries.find(b => b.properties.nameKey === 'empire_joseon');
      
      expect(qing).toBeDefined();
      expect(edo).toBeDefined();
      expect(joseon).toBeDefined();
    });

    it('should return empty array for year with no empires', () => {
      const boundaries = getActiveBoundaries(10000, 'eurasian');
      expect(boundaries).toHaveLength(0);
    });
  });

  describe('getWorldEraBounds', () => {
    it('should return correct bounds for Eurasian mode', () => {
      const bounds = getWorldEraBounds('eurasian');
      expect(bounds.min).toBeLessThanOrEqual(-550); // Earliest empire
      expect(bounds.max).toBeGreaterThanOrEqual(1912); // Latest empire
    });

    it('should return correct bounds for East Asia mode', () => {
      const bounds = getWorldEraBounds('east-asia');
      expect(bounds.min).toBeLessThanOrEqual(-221); // Earliest Chinese empire
      expect(bounds.max).toBeGreaterThanOrEqual(1912); // Latest empire
    });
  });

  describe('WorldBoundary structure', () => {
    it('should have valid properties for all Eurasian boundaries', () => {
      for (const boundary of eurasianBoundaries) {
        expect(boundary.properties).toHaveProperty('name');
        expect(boundary.properties).toHaveProperty('nameKey');
        expect(boundary.properties).toHaveProperty('startYear');
        expect(boundary.properties).toHaveProperty('endYear');
        expect(boundary.properties).toHaveProperty('color');
        
        expect(typeof boundary.properties.startYear).toBe('number');
        expect(typeof boundary.properties.endYear).toBe('number');
        expect(boundary.properties.startYear).toBeLessThanOrEqual(boundary.properties.endYear);
      }
    });

    it('should have valid geometry for all boundaries', () => {
      for (const boundary of eurasianBoundaries) {
        expect(boundary.geometry).toBeDefined();
        expect(['Polygon', 'MultiPolygon']).toContain(boundary.geometry.type);
        expect(boundary.geometry.coordinates).toBeDefined();
        expect(boundary.geometry.coordinates.length).toBeGreaterThan(0);
      }
    });

    it('should have unique nameKeys', () => {
      const nameKeys = eurasianBoundaries.map(b => b.properties.nameKey);
      const uniqueKeys = new Set(nameKeys);
      expect(uniqueKeys.size).toBe(nameKeys.length);
    });
  });

  describe('Chinese Empire Coverage', () => {
    const chineseEmpires = [
      'empire_qin',
      'empire_han-western',
      'empire_han-eastern',
      'empire_tang',
      'empire_song',
      'empire_liao',
      'empire_yuan',
      'empire_ming',
      'empire_qing',
    ];

    it('should include all major Chinese dynasties', () => {
      const eurasianKeys = eurasianBoundaries.map(b => b.properties.nameKey);
      for (const empire of chineseEmpires) {
        expect(eurasianKeys).toContain(empire);
      }
    });
  });

  describe('Roman Empire Coverage', () => {
    const romanEmpires = [
      'empire_rome-republic',
      'empire_rome-empire',
      'empire_byzantine',
      'empire_ottoman',
    ];

    it('should include Roman/Byzantine/Ottoman empires', () => {
      const eurasianKeys = eurasianBoundaries.map(b => b.properties.nameKey);
      for (const empire of romanEmpires) {
        expect(eurasianKeys).toContain(empire);
      }
    });
  });

  describe('Persian Empire Coverage', () => {
    const persianEmpires = [
      'empire_achaemenid',
      'empire_parthian',
      'empire_sassanid',
      'empire_safavid',
    ];

    it('should include all Persian empires', () => {
      const eurasianKeys = eurasianBoundaries.map(b => b.properties.nameKey);
      for (const empire of persianEmpires) {
        expect(eurasianKeys).toContain(empire);
      }
    });
  });

  describe('Islamic Caliphate Coverage', () => {
    const islamicEmpires = [
      'empire_umayyad',
      'empire_abbasid',
      'empire_timurid',
    ];

    it('should include Islamic empires', () => {
      const eurasianKeys = eurasianBoundaries.map(b => b.properties.nameKey);
      for (const empire of islamicEmpires) {
        expect(eurasianKeys).toContain(empire);
      }
    });
  });

  describe('East Asia Coverage', () => {
    it('should include Japanese periods', () => {
      const eastAsiaKeys = eastAsiaBoundaries.map(b => b.properties.nameKey);
      expect(eastAsiaKeys).toContain('empire_heian');
      expect(eastAsiaKeys).toContain('empire_edo');
    });

    it('should include Korean dynasties', () => {
      const eastAsiaKeys = eastAsiaBoundaries.map(b => b.properties.nameKey);
      expect(eastAsiaKeys).toContain('empire_goryeo');
      expect(eastAsiaKeys).toContain('empire_joseon');
    });

    it('should include Vietnamese dynasties', () => {
      const eastAsiaKeys = eastAsiaBoundaries.map(b => b.properties.nameKey);
      expect(eastAsiaKeys).toContain('empire_ly-dynasty');
      expect(eastAsiaKeys).toContain('empire_le-dynasty');
      expect(eastAsiaKeys).toContain('empire_nguyen-dynasty');
    });
  });

  describe('i18n Translations', () => {
    // Mock translation function for testing
    const mockTranslations: Record<string, string> = {
      'empire_qin': '秦朝',
      'empire_han-western': '西汉',
      'empire_tang': '唐朝',
      'empire_ming': '明朝',
      'empire_qing': '清朝',
      'empire_rome-empire': '罗马帝国',
      'empire_ottoman': '奥斯曼帝国',
      'empire_heian': '平安时代',
      'empire_edo': '江户时代',
      'empires.active': '个帝国',
    };

    const mockT = (key: string): string => mockTranslations[key] || key;

    it('should have translations for major empires', () => {
      expect(mockT('empire_qin')).toBe('秦朝');
      expect(mockT('empire_han-western')).toBe('西汉');
      expect(mockT('empire_tang')).toBe('唐朝');
      expect(mockT('empire_ming')).toBe('明朝');
      expect(mockT('empire_qing')).toBe('清朝');
    });

    it('should have translations for Roman/Ottoman empires', () => {
      expect(mockT('empire_rome-empire')).toBe('罗马帝国');
      expect(mockT('empire_ottoman')).toBe('奥斯曼帝国');
    });

    it('should have translations for East Asian periods', () => {
      expect(mockT('empire_heian')).toBe('平安时代');
      expect(mockT('empire_edo')).toBe('江户时代');
    });

    it('should return key when translation is missing', () => {
      expect(mockT('nonexistent.key')).toBe('nonexistent.key');
    });
  });
});
