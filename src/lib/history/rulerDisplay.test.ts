import { describe, it, expect } from 'vitest';
import {
  getRulerDisplayName,
  getRulerFullDisplay,
  hasEraName,
  isDynastyBlock,
  getRulerYearRange,
  formatRulerYears,
  getEraPolities,
  type Ruler,
} from './rulerDisplay';
import type { Era } from './types';

// Mock i18n translation function
const t = (key: string): string => {
  const translations: Record<string, string> = {
    // 谥号 + 名字格式
    'ruler.qinshihuang': '秦始皇（嬴政）',
    'ruler.hangaozu': '汉高祖（刘邦）',
    'ruler.hanwudi': '汉武帝（刘彻）',
    'ruler.zhou-wu': '周武王',
    'ruler.zhou-cheng': '周成王',
    'ruler.zhou-gonghe': '共和行政',
    'ruler.ws-qin-huiwen': '秦惠文王',
    'ruler.ws-qin-zhaoxiang': '秦昭襄王',
    // 年号
    'wc-zhou-wu': '武王',
    'wc-zhou-cheng': '成王',
    'wc-zhou-gonghe': '共和',
    'wc-cn-han-wen': '文皇帝',
    'wc-cn-han-jing': '景皇帝',
    'wc-cn-han-zhao': '昭帝',
  };
  return translations[key] || key;
};

const mockRulers: Ruler[] = [
  {
    id: 'zhou-wu',
    eraId: 'wz-western-zhou',
    nameKey: 'ruler.zhou-wu',
    eraNameKey: 'wc-zhou-wu',
    startYear: -1046,
    endYear: -1043,
  },
  {
    id: 'zhou-cheng',
    eraId: 'wz-western-zhou',
    nameKey: 'ruler.zhou-cheng',
    eraNameKey: 'wc-zhou-cheng',
    startYear: -1042,
    endYear: -1021,
  },
  {
    id: 'qinshihuang',
    eraId: 'qin',
    nameKey: 'ruler.qinshihuang',
    eraNameKey: undefined,
    startYear: -247,
    endYear: -210,
    isDynastyBlock: true,
  },
  {
    id: 'hangaozu',
    eraId: 'han',
    nameKey: 'ruler.hangaozu',
    eraNameKey: 'wc-cn-han-wen',
    startYear: -202,
    endYear: -195,
  },
  {
    id: 'hanwudi',
    eraId: 'han',
    nameKey: 'ruler.hanwudi',
    startYear: -141,
    endYear: -87,
  },
  {
    id: 'zhou-gonghe',
    eraId: 'wz-western-zhou',
    nameKey: 'ruler.zhou-gonghe',
    eraNameKey: 'wc-zhou-gonghe',
    startYear: -841,
    endYear: -828,
  },
];

const mockEras: Era[] = [
  {
    id: 'wz-western-zhou',
    nameKey: 'era.westernZhou',
    startYear: -1046,
    endYear: -771,
    isParallelPolities: false,
  },
  {
    id: 'period-warring-states',
    nameKey: 'era.warringStates',
    startYear: -475,
    endYear: -221,
    isParallelPolities: true,
    polities: [
      { id: 'ws-qin', nameKey: 'polity.qin' },
      { id: 'ws-chu', nameKey: 'polity.chu' },
      { id: 'ws-qi', nameKey: 'polity.qi' },
    ],
  },
];

describe('rulerDisplay', () => {
  describe('getRulerDisplayName', () => {
    it('should return translated ruler name', () => {
      const ruler = mockRulers[0]; // zhou-wu
      expect(getRulerDisplayName(ruler, t)).toBe('周武王');
    });

    it('should handle ruler with eraName (年号)', () => {
      const ruler = mockRulers[0]; // zhou-wu with eraName
      expect(getRulerDisplayName(ruler, t)).toBe('周武王');
    });

    it('should handle ruler without eraName', () => {
      const ruler = mockRulers[4]; // hanwudi without eraName
      expect(getRulerDisplayName(ruler, t)).toBe('汉武帝（刘彻）');
    });

    it('should handle dynasty block', () => {
      const ruler = mockRulers[2]; // qinshihuang as dynasty block
      const displayName = getRulerDisplayName(ruler, t);
      expect(displayName).toBeDefined();
    });
  });

  describe('getRulerFullDisplay', () => {
    it('should return full display with name and eraName', () => {
      const ruler = mockRulers[0]; // zhou-wu
      const fullDisplay = getRulerFullDisplay(ruler, t);
      expect(fullDisplay).toContain('周武王');
    });

    it('should handle ruler without eraName gracefully', () => {
      const ruler = mockRulers[4]; // hanwudi
      const fullDisplay = getRulerFullDisplay(ruler, t);
      expect(fullDisplay).toBeDefined();
      expect(typeof fullDisplay).toBe('string');
    });
  });

  describe('hasEraName', () => {
    it('should return true when ruler has eraName', () => {
      const ruler = mockRulers[0]; // zhou-wu has eraNameKey
      expect(hasEraName(ruler)).toBe(true);
    });

    it('should return false when ruler does not have eraName', () => {
      const ruler = mockRulers[4]; // hanwudi has no eraNameKey
      expect(hasEraName(ruler)).toBe(false);
    });

    it('should return false for undefined eraNameKey', () => {
      const ruler: Ruler = {
        id: 'test',
        eraId: 'test',
        nameKey: 'ruler.test',
        startYear: 0,
        endYear: 0,
      };
      expect(hasEraName(ruler)).toBe(false);
    });
  });

  describe('isDynastyBlock', () => {
    it('should return true for dynasty block rulers', () => {
      const ruler = mockRulers[2]; // qinshihuang isDynastyBlock
      expect(isDynastyBlock(ruler)).toBe(true);
    });

    it('should return false for regular rulers', () => {
      const ruler = mockRulers[0];
      expect(isDynastyBlock(ruler)).toBe(false);
    });

    it('should return false when isDynastyBlock is undefined', () => {
      const ruler: Ruler = {
        id: 'test',
        eraId: 'test',
        nameKey: 'ruler.test',
        startYear: 0,
        endYear: 0,
      };
      expect(isDynastyBlock(ruler)).toBe(false);
    });
  });

  describe('getRulerYearRange', () => {
    it('should return correct year range', () => {
      const ruler = mockRulers[0]; // zhou-wu: -1046 to -1043
      const range = getRulerYearRange(ruler);
      expect(range.start).toBe(-1046);
      expect(range.end).toBe(-1043);
    });

    it('should calculate duration correctly', () => {
      const ruler = mockRulers[0]; // zhou-wu: -1046 to -1043 = 3 years
      const range = getRulerYearRange(ruler);
      expect(range.duration).toBe(3);
    });
  });

  describe('formatRulerYears', () => {
    it('should format years with BCE correctly', () => {
      const ruler = mockRulers[0]; // -1046 to -1043
      expect(formatRulerYears(ruler)).toBe('1046 BCE – 1043 BCE');
    });

    it('should handle positive years (CE)', () => {
      const ruler: Ruler = {
        id: 'test',
        eraId: 'test',
        nameKey: 'ruler.test',
        startYear: 1,
        endYear: 10,
      };
      expect(formatRulerYears(ruler)).toBe('1 CE – 10 CE');
    });

    it('should handle single year reign', () => {
      const ruler: Ruler = {
        id: 'test',
        eraId: 'test',
        nameKey: 'ruler.test',
        startYear: -100,
        endYear: -100,
      };
      expect(formatRulerYears(ruler)).toBe('100 BCE');
    });
  });

  describe('Era with Parallel Polities', () => {
    it('should identify parallel polities era', () => {
      const era = mockEras[1]; // warring-states
      expect(era.isParallelPolities).toBe(true);
    });

    it('should return polities for parallel era', () => {
      const era = mockEras[1];
      expect(era.polities).toBeDefined();
      expect(era.polities?.length).toBe(3);
    });

    it('should return empty polities for non-parallel era', () => {
      const era = mockEras[0]; // western-zhou
      expect(era.isParallelPolities).toBe(false);
      expect(era.polities).toBeUndefined();
    });
  });

  describe('Ruler with Polity', () => {
    it('should identify ruler polity', () => {
      const rulerWithPolity: Ruler = {
        id: 'ws-qin-huiwen',
        eraId: 'period-warring-states',
        polityId: 'ws-qin',
        nameKey: 'ruler.ws-qin-huiwen',
        startYear: -337,
        endYear: -311,
      };
      expect(rulerWithPolity.polityId).toBe('ws-qin');
    });
  });

  describe('Internationalization (i18n)', () => {
  const i18nTranslations: Record<string, Record<string, string>> = {
    zh: {
      'ruler.zhou-wu': '周武王',
      'ruler.hangaozu': '汉高祖（刘邦）',
      'ruler.qinshihuang': '秦始皇（嬴政）',
      'era.westernZhou': '西周',
      'era.warringStates': '战国',
      'polity.qin': '秦',
      'polity.chu': '楚',
      'polity.qi': '齐',
    },
    en: {
      'ruler.zhou-wu': 'King Wu of Zhou',
      'ruler.hangaozu': 'Emperor Gaozu of Han (Liu Bang)',
      'ruler.qinshihuang': 'Qin Shi Huang (Ying Zheng)',
      'era.westernZhou': 'Western Zhou',
      'era.warringStates': 'Warring States',
      'polity.qin': 'Qin',
      'polity.chu': 'Chu',
      'polity.qi': 'Qi',
    },
    ja: {
      'ruler.zhou-wu': '周武王',
      'ruler.hangaozu': '漢高祖（劉邦）',
      'ruler.qinshihuang': '秦始皇（嬴政）',
      'era.westernZhou': '西周',
      'era.warringStates': '戦国時代',
      'polity.qin': '秦',
      'polity.chu': '楚',
      'polity.qi': '齊',
    },
  };

  const mockT = (locale: string) => (key: string) => i18nTranslations[locale]?.[key] || key;

  describe('Chinese (zh) translations', () => {
    const t = mockT('zh');

    it('should translate ruler name to Chinese', () => {
      const ruler = mockRulers[0];
      expect(getRulerDisplayName(ruler, t)).toBe('周武王');
    });

    it('should translate era name to Chinese', () => {
      const era = mockEras[0];
      expect(t(era.nameKey)).toBe('西周');
    });

    it('should translate polity names to Chinese', () => {
      const era = mockEras[1];
      const polities = getEraPolities(era);
      expect(t(polities[0].nameKey)).toBe('秦');
      expect(t(polities[1].nameKey)).toBe('楚');
      expect(t(polities[2].nameKey)).toBe('齐');
    });
  });

  describe('English (en) translations', () => {
    const t = mockT('en');

    it('should translate ruler name to English', () => {
      const ruler = mockRulers[0];
      expect(getRulerDisplayName(ruler, t)).toBe('King Wu of Zhou');
    });

    it('should translate era name to English', () => {
      const era = mockEras[0];
      expect(t(era.nameKey)).toBe('Western Zhou');
    });
  });

  describe('Japanese (ja) translations', () => {
    const t = mockT('ja');

    it('should translate ruler name to Japanese', () => {
      const ruler = mockRulers[0];
      expect(getRulerDisplayName(ruler, t)).toBe('周武王');
    });

    it('should translate era name to Japanese', () => {
      const era = mockEras[1];
      expect(t(era.nameKey)).toBe('戦国時代');
    });
  });

  describe('Missing translation handling', () => {
    it('should return key when translation is missing', () => {
      const missingKey = 'nonexistent.key';
      const t = (key: string) => i18nTranslations['zh']?.[key] || key;

      const ruler: Ruler = {
        id: 'missing',
        eraId: 'test',
        nameKey: missingKey,
        startYear: 0,
        endYear: 0,
      };

      expect(getRulerDisplayName(ruler, t)).toBe(missingKey);
    });
  });
});

  describe('Edge Cases', () => {
    it('should handle minimal ruler data', () => {
      const minimalRuler: Ruler = {
        id: 'test',
        eraId: 'test',
        nameKey: 'ruler.test',
        startYear: 0,
        endYear: 0,
      };
      expect(getRulerDisplayName(minimalRuler, t)).toBe('ruler.test');
      expect(getRulerYearRange(minimalRuler).duration).toBe(0);
    });

    it('should handle negative year range', () => {
      const ruler = mockRulers[0];
      expect(ruler.startYear).toBeLessThan(0);
      expect(ruler.endYear).toBeLessThan(0);
    });
  });
});
