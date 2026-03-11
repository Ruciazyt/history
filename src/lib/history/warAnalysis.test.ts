import { describe, it, expect } from 'vitest';
import {
  getBattleTypeLabel,
  getWarName,
  groupBattlesIntoWars,
  getWarStats,
  getAllWarsWithStats,
  getMostActiveWarPeriods,
  getLongestWars,
  getWarsByEra,
  hasWarData,
  getNamedWars,
  getWarOutcomePatterns,
  getWarInsights,
} from './warAnalysis';
import type { Event, BattleType } from './types';

const mockBattles: Event[] = [
  {
    id: 'battle-1',
    entityId: 'qin',
    year: -230,
    titleKey: 'battle1',
    summaryKey: 'summary1',
    tags: ['war'],
    battle: {
      result: 'attacker_win',
      warNameKey: 'war-unification',
      battleType: 'unification',
      belligerents: { attacker: '秦', defender: '赵' },
    },
  },
  {
    id: 'battle-2',
    entityId: 'qin',
    year: -228,
    titleKey: 'battle2',
    summaryKey: 'summary2',
    tags: ['war'],
    battle: {
      result: 'attacker_win',
      warNameKey: 'war-unification',
      battleType: 'unification',
      belligerents: { attacker: '秦', defender: '魏' },
    },
  },
  {
    id: 'battle-3',
    entityId: 'qin',
    year: -225,
    titleKey: 'battle3',
    summaryKey: 'summary3',
    tags: ['war'],
    battle: {
      result: 'defender_win',
      battleType: 'conquest',
      belligerents: { attacker: '秦', defender: '齐' },
    },
  },
  {
    id: 'battle-4',
    entityId: 'han',
    year: -207,
    titleKey: 'battle4',
    summaryKey: 'summary4',
    tags: ['war'],
    battle: {
      result: 'attacker_win',
      battleType: 'defense',
      belligerents: { attacker: '刘邦', defender: '项羽' },
    },
  },
  {
    id: 'battle-5',
    entityId: 'han',
    year: -202,
    titleKey: 'battle5',
    summaryKey: 'summary5',
    tags: ['war'],
    battle: {
      result: 'attacker_win',
      battleType: 'defense',
      belligerents: { attacker: '刘邦', defender: '项羽' },
    },
  },
  {
    id: 'battle-6',
    entityId: 'han',
    year: -200,
    titleKey: 'battle6',
    summaryKey: 'summary6',
    tags: ['war'],
    battle: {
      result: 'draw',
      battleType: 'defense',
      belligerents: { attacker: '匈奴', defender: '汉' },
    },
  },
];

describe('warAnalysis', () => {
  describe('getBattleTypeLabel', () => {
    it('should return correct label for battle types', () => {
      expect(getBattleTypeLabel('founding')).toBe('开国之战');
      expect(getBattleTypeLabel('unification')).toBe('统一战争');
      expect(getBattleTypeLabel('conquest')).toBe('征服战');
      expect(getBattleTypeLabel('defense')).toBe('防御战');
      expect(getBattleTypeLabel('rebellion')).toBe('叛乱/起义');
      expect(getBattleTypeLabel('civil-war')).toBe('内战');
      expect(getBattleTypeLabel('frontier')).toBe('边疆战役');
      expect(getBattleTypeLabel('invasion')).toBe('入侵/外敌');
      expect(getBattleTypeLabel('unknown')).toBe('未知');
    });

    it('should return 未知 for undefined type', () => {
      expect(getBattleTypeLabel(undefined)).toBe('未知');
    });
  });

  describe('getWarName', () => {
    it('should return war name from warNameKey when t is provided', () => {
      const battle = mockBattles[0];
      const t = (key: string) => key;
      expect(getWarName(battle, t)).toBe('war-unification');
    });

    it('should return entityId as fallback', () => {
      const battle = mockBattles[2];
      const t = (key: string) => key;
      expect(getWarName(battle, t)).toBe('qin');
    });
  });

  describe('groupBattlesIntoWars', () => {
    it('should group battles with same warNameKey together', () => {
      const wars = groupBattlesIntoWars(mockBattles);
      const unificationWar = wars.find(w => w.nameKey === 'war-unification');
      expect(unificationWar).toBeDefined();
      expect(unificationWar?.battles.length).toBe(2);
    });

    it('should group battles by era and close years', () => {
      const wars = groupBattlesIntoWars(mockBattles);
      const hanWars = wars.filter(w => w.battles.some(b => b.entityId === 'han'));
      expect(hanWars.length).toBeGreaterThan(0);
    });

    it('should sort wars by start year', () => {
      const wars = groupBattlesIntoWars(mockBattles);
      for (let i = 1; i < wars.length; i++) {
        expect(wars[i].startYear).toBeGreaterThanOrEqual(wars[i - 1].startYear);
      }
    });
  });

  describe('getWarStats', () => {
    it('should calculate correct stats for a war', () => {
      const wars = groupBattlesIntoWars(mockBattles);
      const unificationWar = wars.find(w => w.nameKey === 'war-unification');
      expect(unificationWar).toBeDefined();
      
      const stats = getWarStats(unificationWar!);
      expect(stats.warName).toBe('war-unification');
      expect(stats.battleCount).toBe(2);
      expect(stats.attackerWins).toBe(2);
      expect(stats.defenderWins).toBe(0);
      expect(stats.duration).toBe(2);
    });
  });

  describe('getAllWarsWithStats', () => {
    it('should return stats for all wars', () => {
      const allStats = getAllWarsWithStats(mockBattles);
      expect(allStats.length).toBeGreaterThan(0);
      expect(allStats.every(s => s.battleCount > 0)).toBe(true);
    });
  });

  describe('getMostActiveWarPeriods', () => {
    it('should return top N most active wars', () => {
      const activeWars = getMostActiveWarPeriods(mockBattles, 3);
      expect(activeWars.length).toBeLessThanOrEqual(3);
      if (activeWars.length > 1) {
        expect(activeWars[0].battleCount).toBeGreaterThanOrEqual(activeWars[1].battleCount);
      }
    });

    it('should return empty array for empty input', () => {
      const activeWars = getMostActiveWarPeriods([], 5);
      expect(activeWars).toEqual([]);
    });
  });

  describe('getLongestWars', () => {
    it('should return top N longest wars', () => {
      const longestWars = getLongestWars(mockBattles, 3);
      expect(longestWars.length).toBeLessThanOrEqual(3);
    });
  });

  describe('getWarsByEra', () => {
    it('should group wars by era', () => {
      const eras = [
        { id: 'qin', nameKey: '秦' },
        { id: 'han', nameKey: '汉' },
      ];
      const t = (key: string) => key;
      const eraActivity = getWarsByEra(mockBattles, eras, t);
      
      const qinActivity = eraActivity.find(e => e.eraId === 'qin');
      const hanActivity = eraActivity.find(e => e.eraId === 'han');
      
      expect(qinActivity).toBeDefined();
      expect(hanActivity).toBeDefined();
      expect(qinActivity!.warCount).toBeGreaterThan(0);
      expect(hanActivity!.warCount).toBeGreaterThan(0);
    });
  });

  describe('hasWarData', () => {
    it('should return true when battles have warNameKey', () => {
      expect(hasWarData(mockBattles)).toBe(true);
    });

    it('should return false for battles without warNameKey', () => {
      const battlesWithoutWarName: Event[] = [
        {
          id: 'b1',
          entityId: 'qin',
          year: -230,
          titleKey: 'b1',
          summaryKey: 's1',
          tags: ['war'],
          battle: {
            result: 'attacker_win',
            battleType: 'conquest',
          },
        },
      ];
      expect(hasWarData(battlesWithoutWarName)).toBe(false);
    });
  });

  describe('getNamedWars', () => {
    it('should return only wars with explicit names', () => {
      const namedWars = getNamedWars(mockBattles);
      expect(namedWars.every(w => !!w.nameKey)).toBe(true);
    });
  });

  describe('getWarOutcomePatterns', () => {
    it('should analyze war outcome patterns', () => {
      const patterns = getWarOutcomePatterns(mockBattles);
      
      expect(patterns).toHaveProperty('offensiveWarsWon');
      expect(patterns).toHaveProperty('defensiveWarsWon');
      expect(patterns).toHaveProperty('inconclusive');
      expect(patterns).toHaveProperty('avgBattlesPerWar');
      expect(patterns.avgBattlesPerWar).toBeGreaterThan(0);
    });
  });

  describe('getWarInsights', () => {
    it('should generate insights for battles', () => {
      const insights = getWarInsights(mockBattles);
      expect(insights.length).toBeGreaterThan(0);
      expect(insights.every(i => typeof i === 'string')).toBe(true);
    });

    it('should return default message for empty input', () => {
      const insights = getWarInsights([]);
      expect(insights).toEqual(['暂无战争数据']);
    });
  });
});
