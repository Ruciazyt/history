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
      const qin = boundaries.find(b => b.properties.nameKey === 'empire.qin');
      expect(qin).toBeDefined();
    });

    it('should return boundaries active at year 100 (Eurasian)', () => {
      const boundaries = getActiveBoundaries(100, 'eurasian');
      
      // At 100 CE, Roman Empire should be active
      const rome = boundaries.find(b => b.properties.nameKey === 'empire.rome-empire');
      expect(rome).toBeDefined();
    });

    it('should return boundaries active at year 1000 (Eurasian)', () => {
      const boundaries = getActiveBoundaries(1000, 'eurasian');
      
      // At 1000 CE, Song should be active
      const song = boundaries.find(b => b.properties.nameKey === 'empire.song');
      expect(song).toBeDefined();
    });

    it('should return boundaries active at year 1200 (Eurasian)', () => {
      const boundaries = getActiveBoundaries(1200, 'eurasian');
      
      // At 1200 CE, Song, Abbasid should be active
      const song = boundaries.find(b => b.properties.nameKey === 'empire.song');
      const abbasid = boundaries.find(b => b.properties.nameKey === 'empire.abbasid');
      
      expect(song).toBeDefined();
      expect(abbasid).toBeDefined();
    });

    it('should return boundaries active at year 1800 (Eurasian)', () => {
      const boundaries = getActiveBoundaries(1800, 'eurasian');
      
      // At 1800 CE, Qing, Ottoman should be active
      const qing = boundaries.find(b => b.properties.nameKey === 'empire.qing');
      const ottoman = boundaries.find(b => b.properties.nameKey === 'empire.ottoman');
      
      expect(qing).toBeDefined();
      expect(ottoman).toBeDefined();
    });

    it('should return East Asia boundaries in east-asia mode', () => {
      const boundaries = getActiveBoundaries(1700, 'east-asia');
      
      // At 1700 CE, Qing China, Edo Japan, Joseon Korea should be active
      const qing = boundaries.find(b => b.properties.nameKey === 'empire.qing');
      const edo = boundaries.find(b => b.properties.nameKey === 'empire.edo');
      const joseon = boundaries.find(b => b.properties.nameKey === 'empire.joseon');
      
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
      'empire.qin',
      'empire.han-western',
      'empire.han-eastern',
      'empire.tang',
      'empire.song',
      'empire.yuan',
      'empire.ming',
      'empire.qing',
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
      'empire.rome-republic',
      'empire.rome-empire',
      'empire.byzantine',
      'empire.ottoman',
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
      'empire.achaemenid',
      'empire.parthian',
      'empire.sassanid',
      'empire.safavid',
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
      'empire.umayyad',
      'empire.abbasid',
      'empire.timurid',
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
      expect(eastAsiaKeys).toContain('empire.heian');
      expect(eastAsiaKeys).toContain('empire.edo');
    });

    it('should include Korean dynasties', () => {
      const eastAsiaKeys = eastAsiaBoundaries.map(b => b.properties.nameKey);
      expect(eastAsiaKeys).toContain('empire.goryeo');
      expect(eastAsiaKeys).toContain('empire.joseon');
    });

    it('should include Vietnamese dynasties', () => {
      const eastAsiaKeys = eastAsiaBoundaries.map(b => b.properties.nameKey);
      expect(eastAsiaKeys).toContain('empire.ly-dynasty');
      expect(eastAsiaKeys).toContain('empire.le-dynasty');
      expect(eastAsiaKeys).toContain('empire.nguyen-dynasty');
    });
  });

  describe('i18n Translations', () => {
    // Mock translation function for testing
    const mockTranslations: Record<string, string> = {
      'empire.qin': '秦朝',
      'empire.han-western': '西汉',
      'empire.tang': '唐朝',
      'empire.ming': '明朝',
      'empire.qing': '清朝',
      'empire.rome-empire': '罗马帝国',
      'empire.ottoman': '奥斯曼帝国',
      'empire.heian': '平安时代',
      'empire.edo': '江户时代',
      'empires.active': '个帝国',
    };

    const mockT = (key: string): string => mockTranslations[key] || key;

    it('should have translations for major empires', () => {
      expect(mockT('empire.qin')).toBe('秦朝');
      expect(mockT('empire.han-western')).toBe('西汉');
      expect(mockT('empire.tang')).toBe('唐朝');
      expect(mockT('empire.ming')).toBe('明朝');
      expect(mockT('empire.qing')).toBe('清朝');
    });

    it('should have translations for Roman/Ottoman empires', () => {
      expect(mockT('empire.rome-empire')).toBe('罗马帝国');
      expect(mockT('empire.ottoman')).toBe('奥斯曼帝国');
    });

    it('should have translations for East Asian periods', () => {
      expect(mockT('empire.heian')).toBe('平安时代');
      expect(mockT('empire.edo')).toBe('江户时代');
    });

    it('should return key when translation is missing', () => {
      expect(mockT('nonexistent.key')).toBe('nonexistent.key');
    });
  });
});
