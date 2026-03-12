import { describe, it, expect } from 'vitest';
import {
  getLiteratureName,
  getReliabilityLabel,
  hasLiteratureData,
  getUniqueLiteratureTypes,
  getLiteratureTypeStats,
  getAllLiteratureTypeStats,
  getBattlesByLiterature,
  getMostCommonLiteratureTypes,
  getBattleLiterature,
  getBattlesWithLiteratureCount,
  getHighReliabilityBattlesCount,
  getLiteratureDiversity,
  getCharacteristicsStats,
  getMostCommonCharacteristics,
  getReliabilityDistribution,
  getMostReliableBattles,
  getLiteratureOutcomeCorrelation,
  getLiteratureSummary,
  getLiteratureInsights,
  type LiteratureType,
  type BattleLiterature,
} from './battleLiterature';

import type { Event } from './types';

const mockEvents: Event[] = [
  {
    id: 'battle-1',
    year: -260,
    tags: ['war'],
    title: '长平之战',
    battle: {
      result: 'attacker_win',
      literature: [
        {
          source: 'shiji',
          chapter: '赵世家',
          description: '秦赵长平之战详情',
          reliability: 'high',
          characteristics: ['详细描写', '军事分析'],
        },
        {
          source: 'zizhitongjian',
          chapter: '周纪',
          description: '秦赵长平之战',
          reliability: 'high',
          characteristics: ['编年体', '宏观视角'],
        },
      ],
    },
  },
  {
    id: 'battle-2',
    year: -340,
    tags: ['war'],
    title: '马陵之战',
    battle: {
      result: 'attacker_win',
      literature: [
        {
          source: 'shiji',
          chapter: '孙子吴起列传',
          description: '孙膑庞涓之战',
          reliability: 'high',
          characteristics: ['军事分析'],
        },
      ],
    },
  },
  {
    id: 'battle-3',
    year: -632,
    tags: ['war'],
    title: '城濮之战',
    battle: {
      result: 'attacker_win',
      literature: [
        {
          source: 'zuozhuan',
          chapter: '僖公二十八年',
          description: '晋楚城濮之战',
          reliability: 'high',
          characteristics: ['详细描写', '外交分析'],
        },
        {
          source: 'guoyu',
          description: '晋楚城濮之战',
          reliability: 'medium',
          characteristics: ['国别体'],
        },
      ],
    },
  },
  {
    id: 'battle-4',
    year: -1000,
    tags: ['war'],
    title: '牧野之战',
    battle: {
      result: 'attacker_win',
      literature: [
        {
          source: 'shangshu',
          chapter: '牧誓',
          description: '武王伐纣',
          reliability: 'high',
          characteristics: ['诏令原文'],
        },
      ],
    },
  },
  {
    id: 'battle-5',
    year: -506,
    tags: ['war'],
    title: '柏举之战',
    battle: {
      result: 'attacker_win',
      literature: [
        {
          source: 'zuozhuan',
          description: '吴楚柏举之战',
          reliability: 'medium',
          characteristics: ['详细描写'],
        },
      ],
    },
  },
  {
    id: 'non-battle',
    year: -300,
    tags: [],
    title: '非战役事件',
  },
];

describe('battleLiterature', () => {
  describe('getLiteratureName', () => {
    it('should return correct Chinese name for shiji', () => {
      expect(getLiteratureName('shiji')).toBe('《史记》');
    });

    it('should return correct Chinese name for zizhitongjian', () => {
      expect(getLiteratureName('zizhitongjian')).toBe('《资治通鉴》');
    });

    it('should return correct Chinese name for zuozhuan', () => {
      expect(getLiteratureName('zuozhuan')).toBe('《左传》');
    });

    it('should return correct Chinese name for guoyu', () => {
      expect(getLiteratureName('guoyu')).toBe('《国语》');
    });

    it('should return unknown for unknown type', () => {
      expect(getLiteratureName('other' as LiteratureType)).toBe('其他典籍');
    });
  });

  describe('getReliabilityLabel', () => {
    it('should return high reliability label', () => {
      expect(getReliabilityLabel('high')).toBe('高可信度');
    });

    it('should return medium reliability label', () => {
      expect(getReliabilityLabel('medium')).toBe('中等可信度');
    });

    it('should return low reliability label', () => {
      expect(getReliabilityLabel('low')).toBe('低可信度');
    });

    it('should return unknown for undefined', () => {
      expect(getReliabilityLabel(undefined)).toBe('未知');
    });
  });

  describe('hasLiteratureData', () => {
    it('should return true when events have literature', () => {
      expect(hasLiteratureData(mockEvents)).toBe(true);
    });

    it('should return false when no events have literature', () => {
      expect(hasLiteratureData([{ id: '1', year: 100, tags: [] }])).toBe(false);
    });
  });

  describe('getUniqueLiteratureTypes', () => {
    it('should return unique literature types', () => {
      const types = getUniqueLiteratureTypes(mockEvents);
      expect(types).toContain('shiji');
      expect(types).toContain('zizhitongjian');
      expect(types).toContain('zuozhuan');
      expect(types).toContain('guoyu');
      expect(types).toContain('shangshu');
    });
  });

  describe('getLiteratureTypeStats', () => {
    it('should return correct count for shiji', () => {
      expect(getLiteratureTypeStats(mockEvents, 'shiji')).toBe(2);
    });

    it('should return correct count for zuozhuan', () => {
      expect(getLiteratureTypeStats(mockEvents, 'zuozhuan')).toBe(2);
    });

    it('should return 0 for types not present', () => {
      expect(getLiteratureTypeStats(mockEvents, 'hanshu')).toBe(0);
    });
  });

  describe('getAllLiteratureTypeStats', () => {
    it('should return all literature type stats', () => {
      const stats = getAllLiteratureTypeStats(mockEvents);
      expect(stats.shiji).toBe(2);
      expect(stats.zuozhuan).toBe(2);
      expect(stats.zizhitongjian).toBe(1);
    });
  });

  describe('getBattlesByLiterature', () => {
    it('should filter battles by literature source', () => {
      const battles = getBattlesByLiterature(mockEvents, 'shiji');
      expect(battles.length).toBe(2);
      expect(battles.map(b => b.title)).toContain('长平之战');
      expect(battles.map(b => b.title)).toContain('马陵之战');
    });
  });

  describe('getMostCommonLiteratureTypes', () => {
    it('should return top literature types', () => {
      const top = getMostCommonLiteratureTypes(mockEvents, 3);
      expect(top.length).toBeGreaterThan(0);
      expect(top[0].count).toBeGreaterThanOrEqual(top[1].count);
    });
  });

  describe('getBattleLiterature', () => {
    it('should return literature for a specific battle', () => {
      const battle = mockEvents.find(e => e.title === '长平之战')!;
      const literature = getBattleLiterature(battle);
      expect(literature.length).toBe(2);
    });

    it('should return empty array for battle without literature', () => {
      const battle = mockEvents.find(e => e.title === '非战役事件')!;
      const literature = getBattleLiterature(battle);
      expect(literature.length).toBe(0);
    });
  });

  describe('getBattlesWithLiteratureCount', () => {
    it('should return count of battles with literature', () => {
      expect(getBattlesWithLiteratureCount(mockEvents)).toBe(5);
    });
  });

  describe('getHighReliabilityBattlesCount', () => {
    it('should return count of high reliability battles', () => {
      expect(getHighReliabilityBattlesCount(mockEvents)).toBe(4);
    });
  });

  describe('getLiteratureDiversity', () => {
    it('should return literature diversity for a battle', () => {
      const battle = mockEvents.find(e => e.title === '长平之战')!;
      expect(getLiteratureDiversity(battle)).toBe(2);
    });

    it('should return 0 for battle without literature', () => {
      const battle = mockEvents.find(e => e.title === '非战役事件')!;
      expect(getLiteratureDiversity(battle)).toBe(0);
    });
  });

  describe('getCharacteristicsStats', () => {
    it('should return characteristics statistics', () => {
      const stats = getCharacteristicsStats(mockEvents);
      expect(stats['详细描写']).toBeGreaterThan(0);
      expect(stats['军事分析']).toBe(2);
    });
  });

  describe('getMostCommonCharacteristics', () => {
    it('should return most common characteristics', () => {
      const top = getMostCommonCharacteristics(mockEvents, 3);
      expect(top.length).toBeGreaterThan(0);
    });
  });

  describe('getReliabilityDistribution', () => {
    it('should return reliability distribution', () => {
      const dist = getReliabilityDistribution(mockEvents);
      expect(dist.high).toBe(5);
      expect(dist.medium).toBe(2);
      expect(dist.low).toBe(0);
    });
  });

  describe('getMostReliableBattles', () => {
    it('should return most reliable battles', () => {
      const battles = getMostReliableBattles(mockEvents, 3);
      expect(battles.length).toBe(3);
    });
  });

  describe('getLiteratureOutcomeCorrelation', () => {
    it('should return literature outcome correlation', () => {
      const correlation = getLiteratureOutcomeCorrelation(mockEvents);
      expect(correlation.shiji).toBeDefined();
      expect(correlation.shiji.total).toBe(2);
    });
  });

  describe('getLiteratureSummary', () => {
    it('should return literature summary', () => {
      const summary = getLiteratureSummary(mockEvents);
      expect(summary.totalBattles).toBe(5);
      expect(summary.battlesWithLiterature).toBe(5);
      expect(summary.coverage).toBe('100.0%');
      expect(summary.literatureTypes).toBe(5);
    });
  });

  describe('getLiteratureInsights', () => {
    it('should return literature insights', () => {
      const insights = getLiteratureInsights(mockEvents);
      expect(insights.length).toBeGreaterThan(0);
      expect(insights[0]).toContain('战役有典籍记载');
    });

    it('should return no data message when no literature', () => {
      const insights = getLiteratureInsights([{ id: '1', year: 100, tags: [] }]);
      expect(insights).toContain('暂无典籍记载数据');
    });
  });
});
