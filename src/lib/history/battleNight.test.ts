import { describe, it, expect } from 'vitest';
import type { Event, BattleTimeOfDay } from './types';
import {
  getTimeOfDayLabel,
  getNightBattleTypeLabel,
  isNightBattle,
  hasNightBattleData,
  getNightBattleCount,
  getTimeOfDayDistribution,
  getTimeOfDayStats,
  getAllTimeOfDayStats,
  getBattlesByTimeOfDay,
  getNightOpsStats,
  getNightBattles,
  getNightAttackSuccessRate,
  compareNightDayResults,
  getTimeOfDayInsights,
  getTimeOfDaySummary,
} from './battleNight';

const createMockBattle = (overrides: Partial<Event['battle']> = {}): Event => ({
  id: 'battle-1',
  entityId: 'era-1',
  year: -260,
  titleKey: 'test.battle',
  summaryKey: 'test.summary',
  tags: ['war'],
  location: { lon: 116.4, lat: 39.9, label: '长平' },
  battle: {
    belligerents: { attacker: '秦', defender: '赵' },
    result: 'attacker_win',
    ...overrides,
  },
});

describe('battleNight', () => {
  describe('getTimeOfDayLabel', () => {
    it('should return correct Chinese label for each time of day', () => {
      expect(getTimeOfDayLabel('dawn')).toBe('黎明');
      expect(getTimeOfDayLabel('morning')).toBe('上午');
      expect(getTimeOfDayLabel('afternoon')).toBe('下午');
      expect(getTimeOfDayLabel('evening')).toBe('傍晚');
      expect(getTimeOfDayLabel('night')).toBe('夜间');
      expect(getTimeOfDayLabel('unknown')).toBe('未知');
    });

    it('should return empty string for undefined', () => {
      expect(getTimeOfDayLabel(undefined)).toBe('');
    });
  });

  describe('getNightBattleTypeLabel', () => {
    it('should return correct Chinese label for night battle types', () => {
      expect(getNightBattleTypeLabel('full-night')).toBe('整夜战斗');
      expect(getNightBattleTypeLabel('night-raid')).toBe('夜袭');
      expect(getNightBattleTypeLabel('night-ambush')).toBe('夜间伏击');
      expect(getNightBattleTypeLabel('night-retreat')).toBe('夜间撤退');
      expect(getNightBattleTypeLabel('dawn-battle')).toBe('黎明战斗');
      expect(getNightBattleTypeLabel('dusk-battle')).toBe('黄昏战斗');
      expect(getNightBattleTypeLabel('daytime')).toBe('白天战斗');
    });
  });

  describe('isNightBattle', () => {
    it('should correctly identify night battle times', () => {
      expect(isNightBattle('night')).toBe(true);
      expect(isNightBattle('dawn')).toBe(true);
      expect(isNightBattle('evening')).toBe(true);
      expect(isNightBattle('morning')).toBe(false);
      expect(isNightBattle('afternoon')).toBe(false);
      expect(isNightBattle(undefined)).toBe(false);
    });
  });

  describe('hasNightBattleData', () => {
    it('should return true when there are night battles', () => {
      const events: Event[] = [
        createMockBattle({ timeOfDay: 'night' }),
        createMockBattle({ timeOfDay: 'morning' }),
      ];
      expect(hasNightBattleData(events)).toBe(true);
    });

    it('should return false when there are no night battles', () => {
      const events: Event[] = [
        createMockBattle({ timeOfDay: 'morning' }),
        createMockBattle({ timeOfDay: 'afternoon' }),
      ];
      expect(hasNightBattleData(events)).toBe(false);
    });

    it('should return false for empty array', () => {
      expect(hasNightBattleData([])).toBe(false);
    });
  });

  describe('getNightBattleCount', () => {
    it('should return correct night battle count', () => {
      const events: Event[] = [
        createMockBattle({ timeOfDay: 'night' }),
        createMockBattle({ timeOfDay: 'dawn' }),
        createMockBattle({ timeOfDay: 'evening' }),
        createMockBattle({ timeOfDay: 'morning' }),
      ];
      expect(getNightBattleCount(events)).toBe(3);
    });

    it('should return 0 for no night battles', () => {
      const events: Event[] = [
        createMockBattle({ timeOfDay: 'morning' }),
        createMockBattle({ timeOfDay: 'afternoon' }),
      ];
      expect(getNightBattleCount(events)).toBe(0);
    });
  });

  describe('getTimeOfDayDistribution', () => {
    it('should return correct distribution', () => {
      const events: Event[] = [
        createMockBattle({ timeOfDay: 'night' }),
        createMockBattle({ timeOfDay: 'night' }),
        createMockBattle({ timeOfDay: 'morning' }),
        createMockBattle({ timeOfDay: 'afternoon' }),
        createMockBattle({ timeOfDay: undefined }),
      ];

      const distribution = getTimeOfDayDistribution(events);
      expect(distribution.get('night')).toBe(2);
      expect(distribution.get('morning')).toBe(1);
      expect(distribution.get('afternoon')).toBe(1);
      expect(distribution.get('unknown')).toBe(1);
    });
  });

  describe('getTimeOfDayStats', () => {
    it('should return correct stats for night battles', () => {
      const events: Event[] = [
        createMockBattle({ timeOfDay: 'night', result: 'attacker_win' }),
        createMockBattle({ timeOfDay: 'night', result: 'attacker_win' }),
        createMockBattle({ timeOfDay: 'night', result: 'defender_win' }),
      ];

      const stats = getTimeOfDayStats(events, 'night');
      expect(stats.totalBattles).toBe(3);
      expect(stats.attackerWins).toBe(2);
      expect(stats.defenderWins).toBe(1);
      expect(stats.attackerWinRate).toBeCloseTo(2/3);
    });

    it('should return zero stats for non-existent time', () => {
      const events: Event[] = [
        createMockBattle({ timeOfDay: 'morning' }),
      ];

      const stats = getTimeOfDayStats(events, 'night');
      expect(stats.totalBattles).toBe(0);
      expect(stats.attackerWinRate).toBe(0);
    });
  });

  describe('getAllTimeOfDayStats', () => {
    it('should return stats for all time periods', () => {
      const events: Event[] = [
        createMockBattle({ timeOfDay: 'night' }),
        createMockBattle({ timeOfDay: 'morning' }),
      ];

      const allStats = getAllTimeOfDayStats(events);
      expect(allStats.length).toBe(6);
      expect(allStats.find(s => s.timeOfDay === 'night')?.totalBattles).toBe(1);
      expect(allStats.find(s => s.timeOfDay === 'morning')?.totalBattles).toBe(1);
    });
  });

  describe('getBattlesByTimeOfDay', () => {
    it('should filter battles by time of day', () => {
      const events: Event[] = [
        createMockBattle({ id: 'b1', timeOfDay: 'night' }),
        createMockBattle({ id: 'b2', timeOfDay: 'night' }),
        createMockBattle({ id: 'b3', timeOfDay: 'morning' }),
      ];

      const nightBattles = getBattlesByTimeOfDay(events, 'night');
      expect(nightBattles.length).toBe(2);
    });
  });

  describe('getNightOpsStats', () => {
    it('should return combined stats for night, dawn, and evening', () => {
      const events: Event[] = [
        createMockBattle({ timeOfDay: 'night', result: 'attacker_win' }),
        createMockBattle({ timeOfDay: 'dawn', result: 'attacker_win' }),
        createMockBattle({ timeOfDay: 'evening', result: 'defender_win' }),
        createMockBattle({ timeOfDay: 'morning' }),
      ];

      const stats = getNightOpsStats(events);
      expect(stats.totalBattles).toBe(3);
      expect(stats.attackerWins).toBe(2);
      expect(stats.defenderWins).toBe(1);
    });
  });

  describe('getNightBattles', () => {
    it('should return only night battles', () => {
      const events: Event[] = [
        createMockBattle({ timeOfDay: 'night' }),
        createMockBattle({ timeOfDay: 'dawn' }),
        createMockBattle({ timeOfDay: 'morning' }),
      ];

      const nightBattles = getNightBattles(events);
      expect(nightBattles.length).toBe(2);
    });
  });

  describe('getNightAttackSuccessRate', () => {
    it('should calculate correct success rate', () => {
      const events: Event[] = [
        createMockBattle({ timeOfDay: 'night', result: 'attacker_win' }),
        createMockBattle({ timeOfDay: 'night', result: 'attacker_win' }),
        createMockBattle({ timeOfDay: 'night', result: 'defender_win' }),
        createMockBattle({ timeOfDay: 'morning' }),
      ];

      const rate = getNightAttackSuccessRate(events);
      expect(rate.total).toBe(3);
      expect(rate.successful).toBe(2);
      expect(rate.failed).toBe(1);
      expect(rate.successRate).toBeCloseTo(2/3);
    });
  });

  describe('compareNightDayResults', () => {
    it('should compare night and day battle results', () => {
      const events: Event[] = [
        createMockBattle({ timeOfDay: 'night', result: 'attacker_win' }),
        createMockBattle({ timeOfDay: 'night', result: 'attacker_win' }),
        createMockBattle({ timeOfDay: 'night', result: 'defender_win' }),
        createMockBattle({ timeOfDay: 'morning', result: 'attacker_win' }),
        createMockBattle({ timeOfDay: 'afternoon', result: 'defender_win' }),
      ];

      const comparison = compareNightDayResults(events);
      expect(comparison.night.total).toBe(3);
      expect(comparison.night.attackerWinRate).toBeCloseTo(2/3);
      expect(comparison.day.total).toBe(2);
      expect(comparison.day.attackerWinRate).toBeCloseTo(1/2);
    });
  });

  describe('getTimeOfDayInsights', () => {
    it('should generate insights', () => {
      const events: Event[] = [
        createMockBattle({ timeOfDay: 'night', result: 'attacker_win' }),
        createMockBattle({ timeOfDay: 'night', result: 'attacker_win' }),
        createMockBattle({ timeOfDay: 'night', result: 'attacker_win' }),
        createMockBattle({ timeOfDay: 'morning', result: 'attacker_win' }),
      ];

      const insights = getTimeOfDayInsights(events);
      expect(insights.length).toBeGreaterThan(0);
      expect(insights.some(i => i.includes('夜'))).toBe(true);
    });
  });

  describe('getTimeOfDaySummary', () => {
    it('should return complete summary', () => {
      const events: Event[] = [
        createMockBattle({ timeOfDay: 'night', result: 'attacker_win' }),
        createMockBattle({ timeOfDay: 'morning' }),
      ];

      const summary = getTimeOfDaySummary(events);
      expect(summary.distribution).toBeDefined();
      expect(summary.nightOps).toBeDefined();
      expect(summary.comparison).toBeDefined();
      expect(summary.insights).toBeDefined();
      expect(summary.distribution.night).toBe(1);
      expect(summary.distribution.morning).toBe(1);
    });
  });
});
