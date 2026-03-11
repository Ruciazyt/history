import { describe, it, expect } from 'vitest';
import {
  getAllFactions,
  getFactionBattles,
  getFactionStats,
  getAllFactionsStats,
  getTopFactions,
  getTopFactionsByWinRate,
  getMostAggressiveFactions,
  getMostDefensiveFactions,
  getFactionVsFaction,
  getTopRivalries,
  hasFactionData,
  getFactionInsights,
} from './battles';
import type { Event } from './types';

const mockBattles: Event[] = [
  {
    id: 'battle-1',
    entityId: 'test',
    year: -300,
    titleKey: 'battle.1',
    summaryKey: 'summary.1',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '秦军', defender: '楚军' },
      result: 'attacker_win',
    },
  },
  {
    id: 'battle-2',
    entityId: 'test',
    year: -290,
    titleKey: 'battle.2',
    summaryKey: 'summary.2',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '秦军', defender: '赵军' },
      result: 'attacker_win',
    },
  },
  {
    id: 'battle-3',
    entityId: 'test',
    year: -280,
    titleKey: 'battle.3',
    summaryKey: 'summary.3',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '楚军', defender: '秦军' },
      result: 'attacker_win',
    },
  },
  {
    id: 'battle-4',
    entityId: 'test',
    year: -260,
    titleKey: 'battle.4',
    summaryKey: 'summary.4',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '赵军', defender: '秦军' },
      result: 'defender_win',
    },
  },
  {
    id: 'battle-5',
    entityId: 'test',
    year: -250,
    titleKey: 'battle.5',
    summaryKey: 'summary.5',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '秦军', defender: '齐军' },
      result: 'draw',
    },
  },
  {
    id: 'battle-6',
    entityId: 'test',
    year: -240,
    titleKey: 'battle.6',
    summaryKey: 'summary.6',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '楚军', defender: '齐军' },
      result: 'defender_win',
    },
  },
];

describe('Faction Analysis', () => {
  describe('getAllFactions', () => {
    it('should return all unique factions', () => {
      const factions = getAllFactions(mockBattles);
      expect(factions).toContain('秦军');
      expect(factions).toContain('楚军');
      expect(factions).toContain('赵军');
      expect(factions).toContain('齐军');
    });

    it('should return sorted alphabetically', () => {
      const factions = getAllFactions(mockBattles);
      // Chinese characters sort by Unicode code point
      expect(factions).toEqual(['楚军', '秦军', '赵军', '齐军']);
    });

    it('should return empty array for empty input', () => {
      expect(getAllFactions([])).toEqual([]);
    });
  });

  describe('getFactionBattles', () => {
    it('should separate battles by faction role', () => {
      const qinBattles = getFactionBattles(mockBattles, '秦军');
      expect(qinBattles.asAttacker.length).toBe(3); // battle-1, battle-2, battle-5
      expect(qinBattles.asDefender.length).toBe(2); // battle-3, battle-4
    });

    it('should return empty arrays for unknown faction', () => {
      const unknown = getFactionBattles(mockBattles, '未知');
      expect(unknown.asAttacker).toEqual([]);
      expect(unknown.asDefender).toEqual([]);
    });
  });

  describe('getFactionStats', () => {
    it('should calculate correct stats for 秦军', () => {
      const stats = getFactionStats(mockBattles, '秦军');
      expect(stats).not.toBeNull();
      if (stats) {
        expect(stats.totalBattles).toBe(5);
        expect(stats.asAttacker).toBe(3);
        expect(stats.asDefender).toBe(2);
        expect(stats.wins).toBe(3);
        expect(stats.losses).toBe(1);
        expect(stats.draws).toBe(1);
      }
    });

    it('should calculate correct win rates', () => {
      const stats = getFactionStats(mockBattles, '秦军');
      expect(stats).not.toBeNull();
      if (stats) {
        // battle-1: 秦军 as attacker, result: attacker_win -> win
        // battle-2: 秦军 as attacker, result: attacker_win -> win
        // battle-3: 秦军 as defender, result: attacker_win -> loss
        // battle-4: 秦军 as defender, result: defender_win -> win
        // battle-5: 秦军 as attacker, result: draw -> draw
        // wins: 3, losses: 1, draws: 1
        // attacker win rate: 2/3 = 66.67%
        // defender win rate: 1/2 = 50%
        expect(stats.attackerWinRate).toBeCloseTo(66.67, 1);
        expect(stats.defenderWinRate).toBeCloseTo(50, 1);
      }
    });

    it('should return null for unknown faction', () => {
      expect(getFactionStats(mockBattles, '未知')).toBeNull();
    });

    it('should calculate year range correctly', () => {
      const stats = getFactionStats(mockBattles, '秦军');
      expect(stats).not.toBeNull();
      if (stats) {
        // battles: -300, -290, -280, -260, -250
        expect(stats.yearRange.start).toBe(-300);
        expect(stats.yearRange.end).toBe(-250);
      }
    });
  });

  describe('getAllFactionsStats', () => {
    it('should return stats for all factions sorted by total battles', () => {
      const allStats = getAllFactionsStats(mockBattles);
      expect(allStats.length).toBe(4);
      expect(allStats[0].name).toBe('秦军'); // Most battles
    });
  });

  describe('getTopFactions', () => {
    it('should return top N factions by battle count', () => {
      const top = getTopFactions(mockBattles, 2);
      expect(top.length).toBe(2);
      expect(top[0].name).toBe('秦军');
    });

    it('should handle limit greater than faction count', () => {
      const top = getTopFactions(mockBattles, 100);
      expect(top.length).toBe(4);
    });
  });

  describe('getTopFactionsByWinRate', () => {
    it('should filter out factions with less than 3 battles', () => {
      // 齐军 only has 2 battles, should be filtered out for win rate ranking
      const top = getTopFactionsByWinRate(mockBattles, 10);
      expect(top.every(f => f.totalBattles >= 3)).toBe(true);
    });
  });

  describe('getMostAggressiveFactions', () => {
    it('should return factions sorted by attacker win rate', () => {
      const aggressive = getMostAggressiveFactions(mockBattles, 10);
      expect(aggressive.length).toBeGreaterThan(0);
      expect(aggressive.every(f => f.asAttacker >= 3)).toBe(true);
    });
  });

  describe('getMostDefensiveFactions', () => {
    it('should return factions sorted by defender win rate', () => {
      const defensive = getMostDefensiveFactions(mockBattles, 10);
      // No faction has >= 3 defender battles in this mock data
      // Should return empty or filtered result
      expect(defensive.every(f => f.asDefender >= 3 || f.asDefender === 0)).toBe(true);
    });
  });

  describe('getFactionVsFaction', () => {
    it('should return head-to-head record between two factions', () => {
      const rivalry = getFactionVsFaction(mockBattles, '秦军', '楚军');
      expect(rivalry).not.toBeNull();
      if (rivalry) {
        // battle-1: 秦军 vs 楚军, result: attacker_win (秦军赢)
        // battle-3: 楚军 vs 秦军, result: attacker_win (楚军赢)
        expect(rivalry.battles.length).toBe(2);
        expect(rivalry.faction1Wins).toBe(1); // 秦军 wins 1
        expect(rivalry.faction2Wins).toBe(1); // 楚军 wins 1
        expect(rivalry.draws).toBe(0);
      }
    });

    it('should return null for factions that never fought', () => {
      const rivalry = getFactionVsFaction(mockBattles, '秦军', '燕军');
      expect(rivalry).toBeNull();
    });
  });

  describe('getTopRivalries', () => {
    it('should return top rivalries by battle count', () => {
      const rivalries = getTopRivalries(mockBattles, 5);
      expect(rivalries.length).toBeGreaterThan(0);
      // 秦军 vs 楚军 should be top (2 battles)
      expect(rivalries[0].battles.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('hasFactionData', () => {
    it('should return true when battles have faction data', () => {
      expect(hasFactionData(mockBattles)).toBe(true);
    });

    it('should return false for empty array', () => {
      expect(hasFactionData([])).toBe(false);
    });

    it('should return false for battles without faction data', () => {
      const battlesWithoutFactions: Event[] = [
        {
          id: 'no-faction',
          entityId: 'test',
          year: -100,
          titleKey: 'test',
          summaryKey: 'test',
          tags: ['war'],
          battle: {},
        },
      ];
      expect(hasFactionData(battlesWithoutFactions)).toBe(false);
    });
  });

  describe('getFactionInsights', () => {
    it('should generate insights about factions', () => {
      const insights = getFactionInsights(mockBattles);
      expect(insights.length).toBeGreaterThan(0);
    });

    it('should include most active faction insight', () => {
      const insights = getFactionInsights(mockBattles);
      const mostActiveInsight = insights.find(i => i.stat?.includes('场战役'));
      expect(mostActiveInsight).toBeDefined();
      if (mostActiveInsight) {
        expect(mostActiveInsight.faction).toBe('秦军');
      }
    });

    it('should return empty array for empty input', () => {
      expect(getFactionInsights([])).toEqual([]);
    });
  });
});
