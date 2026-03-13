import { describe, it, expect } from 'vitest';
import type { Event } from './types';
import {
  getHeritageTypeLabel,
  getSignificanceLabel,
  getUniqueHeritageTypes,
  hasHeritageData,
  getHeritageTypeStats,
  getAllHeritageTypeStats,
  getBattlesByHeritageType,
  getMostCommonHeritageTypes,
  getBattlesWithHeritage,
  getSignificantHeritageBattles,
  getBattlesWithLiteraryHeritage,
  getBattlesWithIdioms,
  getBattlesWithFilmTV,
  getBattlesWithMuseums,
  getHeritageSignificanceDistribution,
  getBattlesWithMostHeritage,
  getHeritageResultCorrelation,
  getHeritageInsights,
  getHeritageSummary,
} from './battleHeritage';

// 创建测试用的战役数据
const createMockBattle = (heritage?: Event['battle']['heritage']): Event => ({
  id: 'battle-1',
  entityId: 'era-1',
  year: -260,
  titleKey: 'test.battle',
  summaryKey: 'test.summary',
  tags: ['war'],
  battle: {
    belligerents: {
      attacker: '秦',
      defender: '赵',
    },
    result: 'attacker_win',
    heritage,
  },
});

const battles: Event[] = [
  {
    id: 'battle-1',
    entityId: 'era-1',
    year: -260,
    titleKey: 'test.battle',
    summaryKey: 'test.summary',
    tags: ['war'],
    battle: {
      belligerents: {
        attacker: '秦',
        defender: '赵',
      },
      result: 'attacker_win',
      heritage: [
        {
          type: 'idiom-proverb',
          name: '纸上谈兵',
          description: '出自长平之战',
          significance: 'national',
        },
        {
          type: 'memorial',
          name: '长平之战纪念馆',
          location: '山西高平',
          significance: 'regional',
        },
      ],
    },
  },
  {
    id: 'battle-2',
    entityId: 'era-1',
    year: -342,
    titleKey: 'test.battle2',
    summaryKey: 'test.summary2',
    tags: ['war'],
    battle: {
      belligerents: {
        attacker: '齐',
        defender: '魏',
      },
      result: 'attacker_win',
      heritage: [
        {
          type: 'idiom-proverb',
          name: '围魏救赵',
          description: '出自桂陵之战',
          significance: 'national',
        },
        {
          type: 'literary-work',
          name: '孙膑兵法',
          description: '记载桂陵之战',
          significance: 'national',
        },
      ],
    },
  },
  {
    id: 'battle-3',
    entityId: 'era-1',
    year: -632,
    titleKey: 'test.battle3',
    summaryKey: 'test.summary3',
    tags: ['war'],
    battle: {
      belligerents: {
        attacker: '晋',
        defender: '楚',
      },
      result: 'defender_win',
      heritage: [
        {
          type: 'museum',
          name: '城濮之战博物馆',
          location: '山东鄄城',
          significance: 'local',
        },
      ],
    },
  },
  // 没有遗产数据的战役
  {
    id: 'battle-4',
    entityId: 'era-1',
    year: -100,
    titleKey: 'test.battle4',
    summaryKey: 'test.summary4',
    tags: ['war'],
    battle: {
      belligerents: {
        attacker: '汉',
        defender: '匈奴',
      },
      result: 'attacker_win',
    },
  },
];

describe('battleHeritage', () => {
  describe('getHeritageTypeLabel', () => {
    it('should return correct Chinese label for memorial', () => {
      expect(getHeritageTypeLabel('memorial')).toBe('纪念碑/纪念馆');
    });

    it('should return correct Chinese label for museum', () => {
      expect(getHeritageTypeLabel('museum')).toBe('博物馆');
    });

    it('should return correct Chinese label for idiom-proverb', () => {
      expect(getHeritageTypeLabel('idiom-proverb')).toBe('成语/谚语');
    });

    it('should return 未知 for unknown type', () => {
      expect(getHeritageTypeLabel('unknown')).toBe('未知');
    });
  });

  describe('getSignificanceLabel', () => {
    it('should return correct Chinese label for world significance', () => {
      expect(getSignificanceLabel('world')).toBe('世界级');
    });

    it('should return correct Chinese label for national significance', () => {
      expect(getSignificanceLabel('national')).toBe('国家级');
    });

    it('should return correct Chinese label for regional significance', () => {
      expect(getSignificanceLabel('regional')).toBe('省级');
    });

    it('should return correct Chinese label for local significance', () => {
      expect(getSignificanceLabel('local')).toBe('地方级');
    });
  });

  describe('getUniqueHeritageTypes', () => {
    it('should return all unique heritage types', () => {
      const types = getUniqueHeritageTypes(battles);
      expect(types).toContain('idiom-proverb');
      expect(types).toContain('memorial');
      expect(types).toContain('museum');
      expect(types).toContain('literary-work');
    });

    it('should return empty array when no heritage data', () => {
      const battlesNoHeritage = battles.slice(3);
      const types = getUniqueHeritageTypes(battlesNoHeritage);
      expect(types).toHaveLength(0);
    });
  });

  describe('hasHeritageData', () => {
    it('should return true when battles have heritage data', () => {
      expect(hasHeritageData(battles)).toBe(true);
    });

    it('should return false when no battles have heritage data', () => {
      const battlesNoHeritage = battles.slice(3);
      expect(hasHeritageData(battlesNoHeritage)).toBe(false);
    });
  });

  describe('getHeritageTypeStats', () => {
    it('should return correct stats for idiom-proverb type', () => {
      const stats = getHeritageTypeStats(battles, 'idiom-proverb');
      expect(stats.count).toBe(2);
      expect(stats.battles).toHaveLength(2);
    });

    it('should return empty stats for non-existent type', () => {
      const stats = getHeritageTypeStats(battles, 'festival');
      expect(stats.count).toBe(0);
      expect(stats.battles).toHaveLength(0);
    });
  });

  describe('getAllHeritageTypeStats', () => {
    it('should return stats for all heritage types', () => {
      const allStats = getAllHeritageTypeStats(battles);
      expect(allStats.length).toBeGreaterThan(0);
      expect(allStats.some((s) => s.type === 'idiom-proverb')).toBe(true);
    });
  });

  describe('getBattlesByHeritageType', () => {
    it('should filter battles by heritage type', () => {
      const idiomBattles = getBattlesByHeritageType(battles, 'idiom-proverb');
      expect(idiomBattles).toHaveLength(2);
    });

    it('should return empty array for non-existent type', () => {
      const filmBattles = getBattlesByHeritageType(battles, 'film-tv');
      expect(filmBattles).toHaveLength(0);
    });
  });

  describe('getMostCommonHeritageTypes', () => {
    it('should return most common heritage types sorted by count', () => {
      const commonTypes = getMostCommonHeritageTypes(battles, 5);
      expect(commonTypes[0].count).toBeGreaterThanOrEqual(commonTypes[1].count);
    });

    it('should respect limit parameter', () => {
      const commonTypes = getMostCommonHeritageTypes(battles, 2);
      expect(commonTypes).toHaveLength(2);
    });
  });

  describe('getBattlesWithHeritage', () => {
    it('should return battles that have heritage data', () => {
      const battlesWithHeritage = getBattlesWithHeritage(battles);
      expect(battlesWithHeritage).toHaveLength(3);
    });
  });

  describe('getSignificantHeritageBattles', () => {
    it('should return battles with national significance', () => {
      const nationalBattles = getSignificantHeritageBattles(battles, 'national');
      expect(nationalBattles.length).toBeGreaterThan(0);
    });

    it('should return battles with local significance', () => {
      const localBattles = getSignificantHeritageBattles(battles, 'local');
      expect(localBattles.length).toBeGreaterThan(0);
    });
  });

  describe('getBattlesWithLiteraryHeritage', () => {
    it('should return battles with literary works', () => {
      const literaryBattles = getBattlesWithLiteraryHeritage(battles);
      expect(literaryBattles.length).toBe(1);
    });
  });

  describe('getBattlesWithIdioms', () => {
    it('should return battles with idiom data', () => {
      const idiomBattles = getBattlesWithIdioms(battles);
      expect(idiomBattles.length).toBe(2);
    });
  });

  describe('getBattlesWithFilmTV', () => {
    it('should return battles with film/TV adaptations', () => {
      const filmBattles = getBattlesWithFilmTV(battles);
      expect(filmBattles.length).toBe(0);
    });
  });

  describe('getBattlesWithMuseums', () => {
    it('should return battles with museums or memorials', () => {
      const museumBattles = getBattlesWithMuseums(battles);
      expect(museumBattles.length).toBeGreaterThan(0);
    });
  });

  describe('getHeritageSignificanceDistribution', () => {
    it('should return significance distribution', () => {
      const distribution = getHeritageSignificanceDistribution(battles);
      expect(distribution.some((d) => d.significance === 'national')).toBe(true);
      expect(distribution.some((d) => d.significance === 'regional')).toBe(true);
      expect(distribution.some((d) => d.significance === 'local')).toBe(true);
    });
  });

  describe('getBattlesWithMostHeritage', () => {
    it('should return battles sorted by heritage count', () => {
      const mostHeritage = getBattlesWithMostHeritage(battles, 5);
      expect(mostHeritage[0].count).toBeGreaterThanOrEqual(mostHeritage[1].count);
    });

    it('should respect limit parameter', () => {
      const mostHeritage = getBattlesWithMostHeritage(battles, 2);
      expect(mostHeritage).toHaveLength(2);
    });
  });

  describe('getHeritageResultCorrelation', () => {
    it('should return correlation between heritage and battle result', () => {
      const correlation = getHeritageResultCorrelation(battles);
      expect(correlation.length).toBeGreaterThan(0);
      
      const attackerWin = correlation.find((c) => c.result === 'attacker_win');
      expect(attackerWin).toBeDefined();
      expect(attackerWin!.battlesWithHeritage).toBeGreaterThan(0);
    });
  });

  describe('getHeritageInsights', () => {
    it('should generate insights when heritage data exists', () => {
      const insights = getHeritageInsights(battles);
      expect(insights.length).toBeGreaterThan(0);
    });

    it('should return message when no heritage data', () => {
      const battlesNoHeritage = battles.slice(3);
      const insights = getHeritageInsights(battlesNoHeritage);
      expect(insights).toContain('暂无战役遗产数据');
    });
  });

  describe('getHeritageSummary', () => {
    it('should return comprehensive summary', () => {
      const summary = getHeritageSummary(battles);
      
      expect(summary.totalHeritage).toBeGreaterThan(0);
      expect(summary.battlesWithHeritage).toBeGreaterThan(0);
      expect(summary.heritageTypes).toBeGreaterThan(0);
      expect(summary.mostCommonTypes.length).toBeGreaterThan(0);
      expect(summary.significanceDistribution.length).toBeGreaterThan(0);
      expect(summary.battlesWithMostHeritage.length).toBeGreaterThan(0);
      expect(summary.insights.length).toBeGreaterThan(0);
    });
  });
});
