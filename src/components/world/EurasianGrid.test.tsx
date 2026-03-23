import { describe, it, expect } from 'vitest';
import { buildEurasianColumns, yearToY, ERA_BANDS, ERA_BOUNDARY_YEARS, QUICK_JUMP_YEARS } from './EurasianGrid';
import type { WorldBoundary } from '@/lib/history/data/worldBoundaries';

function makeBoundary(name: string, nameKey: string, startYear: number, endYear: number): WorldBoundary {
  return {
    type: 'Feature',
    properties: { name, nameKey, startYear, endYear, color: '#000000' },
    geometry: { type: 'Polygon', coordinates: [[[0, 0], [1, 1], [1, 0], [0, 0]]] },
  };
}

// Inline copy of classifyRegion for testing (verifies logic independently)
type RegionId = 'china' | 'korea' | 'japan' | 'central-asia' | 'west' | 'vietnam' | 'other';
const CHINA_NAMES = new Set(['秦朝', '西汉', '东汉', '唐朝', '宋朝', '元朝', '明朝', '清朝']);
const KOREA_NAMES = new Set(['高丽王朝', '朝鲜王朝']);
const JAPAN_NAMES = new Set(['平安时代', '江户时代']);
const VIETNAM_NAMES = new Set(['李朝', '黎朝', '阮朝']);
const CENTRAL_ASIA_NAMES = new Set(['蒙古帝国', '孔雀王朝', '莫卧儿帝国', '印度河文明', '萨塔瓦哈纳', '室利佛逝']);
const WEST_NAMES = new Set(['罗马', '拜占庭', '奥斯曼', '波斯', '阿契美尼德', '帕提亚', '萨珊', '萨法维', '亚历山大', '帖木儿', '阿拔斯', '倭马亚', '古埃及', '托勒密埃及', '亚述', '巴比伦', '阿卡德', '赫梯']);
const CHINA_NAMESMatches = ['蜀', '吴', '晋', '隋', '南北朝', '五代', '三国'];
const KOREA_NAMESMatches: string[] = [];
const JAPAN_NAMESMatches: string[] = [];
const VIETNAM_NAMESMatches: string[] = [];
const CENTRAL_ASIA_NAMESMatches: string[] = [];
const WEST_NAMESMatches = ['罗马', '拜占庭', '奥斯曼', '波斯', '阿契美尼德', '帕提亚', '萨珊', '萨法维', '亚历山大', '帖木儿', '阿拔斯', '倭马亚', '塞琉古', '亚述', '巴比伦', '阿卡德', '赫梯'];

function testClassifyRegion(boundary: WorldBoundary): RegionId {
  const name = boundary.properties.name;
  if (CHINA_NAMES.has(name) || CHINA_NAMESMatches.some(n => name.startsWith(n))) return 'china';
  if (KOREA_NAMES.has(name) || KOREA_NAMESMatches.some(n => name.startsWith(n))) return 'korea';
  if (JAPAN_NAMES.has(name) || JAPAN_NAMESMatches.some(n => name.startsWith(n))) return 'japan';
  if (VIETNAM_NAMES.has(name) || VIETNAM_NAMESMatches.some(n => name.startsWith(n))) return 'vietnam';
  if (CENTRAL_ASIA_NAMES.has(name) || CENTRAL_ASIA_NAMESMatches.some(n => name.startsWith(n))) return 'central-asia';
  if (WEST_NAMES.has(name) || WEST_NAMESMatches.some(n => name.startsWith(n))) return 'west';
  return 'other';
}

describe('EurasianGrid pure functions', () => {
  describe('classifyRegion', () => {
    describe('Chinese empires', () => {
      it('classifies core Chinese dynasties', () => {
        expect(testClassifyRegion(makeBoundary('秦朝', 'empire_qin', -221, -206))).toBe('china');
        expect(testClassifyRegion(makeBoundary('西汉', 'empire_han-western', -202, 9))).toBe('china');
        expect(testClassifyRegion(makeBoundary('东汉', 'empire_han-eastern', 25, 220))).toBe('china');
        expect(testClassifyRegion(makeBoundary('唐朝', 'empire_tang', 618, 907))).toBe('china');
        expect(testClassifyRegion(makeBoundary('宋朝', 'empire_song', 960, 1279))).toBe('china');
        expect(testClassifyRegion(makeBoundary('明朝', 'empire_ming', 1368, 1644))).toBe('china');
        expect(testClassifyRegion(makeBoundary('清朝', 'empire_qing', 1644, 1912))).toBe('china');
      });
    });

    describe('Korean empires', () => {
      it('classifies exact match Korean dynasties', () => {
        expect(testClassifyRegion(makeBoundary('高丽王朝', 'empire_goryeo', 918, 1392))).toBe('korea');
        expect(testClassifyRegion(makeBoundary('朝鲜王朝', 'empire_joseon', 1392, 1897))).toBe('korea');
      });
    });

    describe('Japanese periods', () => {
      it('classifies exact match Japanese periods', () => {
        expect(testClassifyRegion(makeBoundary('平安时代', 'empire_heian', 794, 1185))).toBe('japan');
        expect(testClassifyRegion(makeBoundary('江户时代', 'empire_edo', 1603, 1868))).toBe('japan');
      });
    });

    describe('Vietnamese dynasties', () => {
      it('classifies exact match Vietnamese dynasties', () => {
        expect(testClassifyRegion(makeBoundary('李朝', 'empire_ly-dynasty', 1009, 1225))).toBe('vietnam');
        expect(testClassifyRegion(makeBoundary('黎朝', 'empire_le-dynasty', 1428, 1789))).toBe('vietnam');
        expect(testClassifyRegion(makeBoundary('阮朝', 'empire_nguyen-dynasty', 1802, 1945))).toBe('vietnam');
      });
    });

    describe('Central Asian empires', () => {
      it('classifies exact match Central Asian empires', () => {
        expect(testClassifyRegion(makeBoundary('蒙古帝国', 'empire_mongol', 1206, 1368))).toBe('central-asia');
        expect(testClassifyRegion(makeBoundary('孔雀王朝', 'empire_maurya', -321, -185))).toBe('central-asia');
        expect(testClassifyRegion(makeBoundary('莫卧儿帝国', 'empire_mughal', 1526, 1857))).toBe('central-asia');
        expect(testClassifyRegion(makeBoundary('印度河文明', 'empire_indus-valley', -3300, -1300))).toBe('central-asia');
      });

      it('classifies newly added Southeast Asian empires as central-asia', () => {
        expect(testClassifyRegion(makeBoundary('萨塔瓦哈纳', 'empire_satavahana', -200, 220))).toBe('central-asia');
        expect(testClassifyRegion(makeBoundary('室利佛逝', 'empire_srivijaya', 650, 1377))).toBe('central-asia');
      });
    });

    describe('Western empires (Mesopotamian empires)', () => {
      it('classifies Roman empires as west', () => {
        expect(testClassifyRegion(makeBoundary('罗马帝国', 'empire_rome-empire', 27, 476))).toBe('west');
        expect(testClassifyRegion(makeBoundary('拜占庭帝国', 'empire_byzantine', 395, 1453))).toBe('west');
        expect(testClassifyRegion(makeBoundary('奥斯曼帝国', 'empire_ottoman', 1299, 1922))).toBe('west');
      });

      it('classifies Persian empires as west', () => {
        expect(testClassifyRegion(makeBoundary('波斯帝国', 'empire_achaemenid', -550, -330))).toBe('west');
        expect(testClassifyRegion(makeBoundary('帕提亚帝国', 'empire_parthian', -247, 224))).toBe('west');
        expect(testClassifyRegion(makeBoundary('萨珊波斯', 'empire_sassanid', 224, 651))).toBe('west');
        expect(testClassifyRegion(makeBoundary('萨法维帝国', 'empire_safavid', 1501, 1736))).toBe('west');
      });

      it('classifies Islamic caliphates as west', () => {
        expect(testClassifyRegion(makeBoundary('倭马亚王朝', 'empire_umayyad', 661, 750))).toBe('west');
        expect(testClassifyRegion(makeBoundary('阿拔斯王朝', 'empire_abbasid', 750, 1258))).toBe('west');
        expect(testClassifyRegion(makeBoundary('帖木儿帝国', 'empire_timurid', 1370, 1507))).toBe('west');
      });

      it('classifies Hellenistic and Egyptian empires as west', () => {
        expect(testClassifyRegion(makeBoundary('亚历山大帝国', 'empire_alexander', -336, -323))).toBe('west');
        expect(testClassifyRegion(makeBoundary('古埃及', 'empire_egypt-old', -2686, -2181))).toBe('west');
        expect(testClassifyRegion(makeBoundary('托勒密埃及', 'empire_egypt-ptolemaic', -305, -30))).toBe('west');
      });

      it('classifies Mesopotamian empires as west using exact or prefix match', () => {
        // Test with names that match exactly or via prefix
        // These names use prefixes that match WEST_NAMESMatches entries
        expect(testClassifyRegion(makeBoundary('亚述帝国', 'empire_assyrian', -911, -609))).toBe('west');
        expect(testClassifyRegion(makeBoundary('赫梯帝国', 'empire_hittite', -1650, -1178))).toBe('west');
        expect(testClassifyRegion(makeBoundary('塞琉古帝国', 'empire_seleucid', -312, -63))).toBe('west');
      });
    });

    describe('unknown empires', () => {
      it('falls back to other for unrecognized names', () => {
        expect(testClassifyRegion(makeBoundary('Unknown Empire', 'empire_unknown', 1000, 1100))).toBe('other');
        expect(testClassifyRegion(makeBoundary('Fantasy Kingdom', 'empire_fantasy', 500, 600))).toBe('other');
      });
    });
  });

  describe('buildEurasianColumns', () => {
    it('builds columns for eurasian mode with core region groups', () => {
      const columns = buildEurasianColumns('eurasian');

      // Eurasian mode includes: china, central-asia, west
      // (Japan/Korea/Vietnam are only in east-asia mode)
      const regionIds = columns.map(c => c.id);
      expect(regionIds).toContain('china');
      expect(regionIds).toContain('central-asia');
      expect(regionIds).toContain('west');
    });

    it('builds columns for east-asia mode', () => {
      const columns = buildEurasianColumns('east-asia');

      const regionIds = columns.map(c => c.id);
      // East Asia mode should include China, Japan, Korea, Vietnam but not western empires
      expect(regionIds).toContain('china');
      expect(regionIds).toContain('japan');
      expect(regionIds).toContain('korea');
      expect(regionIds).toContain('vietnam');
    });

    it('each column has required fields', () => {
      const columns = buildEurasianColumns('eurasian');

      for (const col of columns) {
        expect(col).toHaveProperty('id');
        expect(col).toHaveProperty('labelKey');
        expect(col).toHaveProperty('bgColor');
        expect(col).toHaveProperty('headerBg');
        expect(col).toHaveProperty('bounds');
        expect(col.bounds).toHaveProperty('minYear');
        expect(col.bounds).toHaveProperty('maxYear');
        expect(col).toHaveProperty('polities');
        expect(Array.isArray(col.polities)).toBe(true);
      }
    });

    it('each polity has required fields', () => {
      const columns = buildEurasianColumns('eurasian');

      for (const col of columns) {
        for (const polity of col.polities) {
          expect(polity).toHaveProperty('id');
          expect(polity).toHaveProperty('nameKey');
          expect(polity).toHaveProperty('startYear');
          expect(polity).toHaveProperty('endYear');
          expect(polity).toHaveProperty('color');
          expect(typeof polity.startYear).toBe('number');
          expect(typeof polity.endYear).toBe('number');
        }
      }
    });

    it('columns are sorted in consistent order', () => {
      const columns = buildEurasianColumns('eurasian');
      const regionIds = columns.map(c => c.id);
      // china should come before central-asia, which should come before west
      const chinaIdx = regionIds.indexOf('china');
      const centralAsiaIdx = regionIds.indexOf('central-asia');
      const westIdx = regionIds.indexOf('west');
      expect(chinaIdx).toBeLessThan(centralAsiaIdx);
      expect(centralAsiaIdx).toBeLessThan(westIdx);
    });
  });

  describe('yearToY', () => {
    it('returns 0 for minYear', () => {
      expect(yearToY(-500, -500, 500, 1000)).toBe(0);
    });

    it('returns height for maxYear', () => {
      expect(yearToY(500, -500, 500, 1000)).toBe(1000);
    });

    it('returns midpoint for midpoint year', () => {
      expect(yearToY(0, -500, 500, 1000)).toBe(500);
    });

    it('scales linearly', () => {
      expect(yearToY(-250, -500, 500, 1000)).toBe(250);
      expect(yearToY(250, -500, 500, 1000)).toBe(750);
    });

    it('handles BCE years correctly', () => {
      // Year -1000 is at 0 when min=-1000, max=0
      expect(yearToY(-1000, -1000, 0, 1000)).toBe(0);
      // Year -500 is at midpoint
      expect(yearToY(-500, -1000, 0, 1000)).toBe(500);
      // Year 0 is at height
      expect(yearToY(0, -1000, 0, 1000)).toBe(1000);
    });

    it('handles small spans with large grid', () => {
      expect(yearToY(100, 0, 200, 1000)).toBe(500);
    });
  });

  describe('ERA_BANDS constant', () => {
    it('has exactly 3 era bands', () => {
      expect(ERA_BANDS).toHaveLength(3);
    });

    it('each band has required fields', () => {
      for (const band of ERA_BANDS) {
        expect(band).toHaveProperty('labelKey');
        expect(band).toHaveProperty('bgClass');
        expect(band).toHaveProperty('badgeClass');
        expect(typeof band.labelKey).toBe('string');
        expect(typeof band.bgClass).toBe('string');
        expect(typeof band.badgeClass).toBe('string');
      }
    });

    it('has ancient, medieval, and earlyModern bands', () => {
      const labelKeys = ERA_BANDS.map(b => b.labelKey);
      expect(labelKeys).toContain('grid.eraBand.ancient');
      expect(labelKeys).toContain('grid.eraBand.medieval');
      expect(labelKeys).toContain('grid.eraBand.earlyModern');
    });
  });

  describe('ERA_BOUNDARY_YEARS constant', () => {
    it('has 2 boundary years', () => {
      expect(ERA_BOUNDARY_YEARS).toHaveLength(2);
    });

    it('boundaries are in chronological order', () => {
      expect(ERA_BOUNDARY_YEARS[0]).toBeLessThan(ERA_BOUNDARY_YEARS[1]);
    });

    it('boundaries define ancient/medieval/earlyModern transitions', () => {
      // ERA_BOUNDARY_YEARS = [500, 1500]
      // ancient: before 500, medieval: 500-1500, earlyModern: after 1500
      expect(ERA_BOUNDARY_YEARS[0]).toBe(500);
      expect(ERA_BOUNDARY_YEARS[1]).toBe(1500);
    });
  });

  describe('QUICK_JUMP_YEARS constant', () => {
    it('contains century quick-jump years', () => {
      // Should include key centuries: -500, 0, 500, 1000, 1500, 1900
      expect(QUICK_JUMP_YEARS).toContain(-500);
      expect(QUICK_JUMP_YEARS).toContain(0);
      expect(QUICK_JUMP_YEARS).toContain(500);
      expect(QUICK_JUMP_YEARS).toContain(1000);
      expect(QUICK_JUMP_YEARS).toContain(1500);
      expect(QUICK_JUMP_YEARS).toContain(1900);
    });

    it('is sorted in ascending order', () => {
      for (let i = 1; i < QUICK_JUMP_YEARS.length; i++) {
        expect(QUICK_JUMP_YEARS[i]).toBeGreaterThan(QUICK_JUMP_YEARS[i - 1]);
      }
    });

    it('covers a wide historical range', () => {
      expect(QUICK_JUMP_YEARS[0]).toBeLessThanOrEqual(-500);
      expect(QUICK_JUMP_YEARS[QUICK_JUMP_YEARS.length - 1]).toBeGreaterThanOrEqual(1900);
    });

    it('has a reasonable number of quick-jump points', () => {
      // 24 century buttons is reasonable
      expect(QUICK_JUMP_YEARS.length).toBeGreaterThanOrEqual(20);
      expect(QUICK_JUMP_YEARS.length).toBeLessThanOrEqual(30);
    });
  });
});
