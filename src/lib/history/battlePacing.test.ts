import { describe, it, expect } from 'vitest';
import type { Event } from './types';
import {
  getPacingLabel,
  getTimeOfDayLabel,
  hasPacingData,
  hasTimeOfDayData,
  getPacingStats,
  getAllPacingStats,
  getTimeOfDayStats,
  getAllTimeOfDayStats,
  getBattlesByPacing,
  getBattlesByTimeOfDay,
  getSurpriseAnalysis,
  getPacingInsights,
  getTimeOfDayInsights,
  getPacingSummary,
} from './battlePacing';

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

describe('battlePacing', () => {
  describe('getPacingLabel', () => {
    it('should return correct Chinese label for each pacing type', () => {
      expect(getPacingLabel('surprise')).toBe('突袭战');
      expect(getPacingLabel('rapid')).toBe('快速决战');
      expect(getPacingLabel('extended')).toBe('持久战');
      expect(getPacingLabel('siege')).toBe('围城战');
      expect(getPacingLabel('unknown')).toBe('未知');
      expect(getPacingLabel(undefined)).toBe('');
    });
  });

  describe('getTimeOfDayLabel', () => {
    it('should return correct Chinese label for each time of day', () => {
      expect(getTimeOfDayLabel('dawn')).toBe('黎明');
      expect(getTimeOfDayLabel('morning')).toBe('上午');
      expect(getTimeOfDayLabel('afternoon')).toBe('下午');
      expect(getTimeOfDayLabel('evening')).toBe('傍晚');
      expect(getTimeOfDayLabel('night')).toBe('夜间');
      expect(getTimeOfDayLabel('unknown')).toBe('未知');
      expect(getTimeOfDayLabel(undefined)).toBe('');
    });
  });

  describe('hasPacingData', () => {
    it('should return true when battles have pacing data', () => {
      const events: Event[] = [
        createMockBattle({ pacing: 'surprise' }),
      ];
      expect(hasPacingData(events)).toBe(true);
    });

    it('should return false when no battles have pacing data', () => {
      const events: Event[] = [
        createMockBattle({ pacing: undefined }),
      ];
      expect(hasPacingData(events)).toBe(false);
    });

    it('should return false when pacing is unknown', () => {
      const events: Event[] = [
        createMockBattle({ pacing: 'unknown' }),
      ];
      expect(hasPacingData(events)).toBe(false);
    });
  });

  describe('hasTimeOfDayData', () => {
    it('should return true when battles have time of day data', () => {
      const events: Event[] = [
        createMockBattle({ timeOfDay: 'dawn' }),
      ];
      expect(hasTimeOfDayData(events)).toBe(true);
    });

    it('should return false when no battles have time of day data', () => {
      const events: Event[] = [
        createMockBattle({ timeOfDay: undefined }),
      ];
      expect(hasTimeOfDayData(events)).toBe(false);
    });
  });

  describe('getPacingStats', () => {
    it('should calculate correct stats for surprise battles', () => {
      const events: Event[] = [
        createMockBattle({ pacing: 'surprise', result: 'attacker_win' }),
        createMockBattle({ pacing: 'surprise', result: 'attacker_win' }),
        createMockBattle({ pacing: 'surprise', result: 'defender_win' }),
      ];
      const stats = getPacingStats(events, 'surprise');
      
      expect(stats.totalBattles).toBe(3);
      expect(stats.attackerWins).toBe(2);
      expect(stats.defenderWins).toBe(1);
      expect(stats.attackerWinRate).toBeCloseTo(0.667, 2);
      expect(stats.defenderWinRate).toBeCloseTo(0.333, 2);
    });

    it('should handle empty results', () => {
      const events: Event[] = [
        createMockBattle({ pacing: 'extended', result: 'inconclusive' }),
      ];
      const stats = getPacingStats(events, 'extended');
      
      expect(stats.totalBattles).toBe(1);
      expect(stats.attackerWins).toBe(0);
      expect(stats.defenderWins).toBe(0);
      expect(stats.draws).toBe(0);
      expect(stats.inconclusive).toBe(1);
    });
  });

  describe('getAllPacingStats', () => {
    it('should return stats for all pacing types with battles', () => {
      const events: Event[] = [
        createMockBattle({ pacing: 'surprise', result: 'attacker_win' }),
        createMockBattle({ pacing: 'rapid', result: 'defender_win' }),
        createMockBattle({ pacing: 'extended', result: 'attacker_win' }),
      ];
      const stats = getAllPacingStats(events);
      
      expect(stats.length).toBe(3);
      expect(stats.map(s => s.pacing)).toContain('surprise');
      expect(stats.map(s => s.pacing)).toContain('rapid');
      expect(stats.map(s => s.pacing)).toContain('extended');
    });

    it('should filter out types with no battles', () => {
      const events: Event[] = [
        createMockBattle({ pacing: 'surprise' }),
      ];
      const stats = getAllPacingStats(events);
      
      expect(stats.length).toBe(1);
      expect(stats[0].pacing).toBe('surprise');
    });
  });

  describe('getTimeOfDayStats', () => {
    it('should calculate correct stats for dawn battles', () => {
      const events: Event[] = [
        createMockBattle({ timeOfDay: 'dawn', result: 'attacker_win' }),
        createMockBattle({ timeOfDay: 'dawn', result: 'defender_win' }),
        createMockBattle({ timeOfDay: 'dawn', result: 'draw' }),
      ];
      const stats = getTimeOfDayStats(events, 'dawn');
      
      expect(stats.totalBattles).toBe(3);
      expect(stats.attackerWins).toBe(1);
      expect(stats.defenderWins).toBe(1);
      expect(stats.draws).toBe(1);
    });
  });

  describe('getAllTimeOfDayStats', () => {
    it('should return stats for all time of day types with battles', () => {
      const events: Event[] = [
        createMockBattle({ timeOfDay: 'dawn' }),
        createMockBattle({ timeOfDay: 'night' }),
        createMockBattle({ timeOfDay: 'morning' }),
      ];
      const stats = getAllTimeOfDayStats(events);
      
      expect(stats.length).toBe(3);
    });
  });

  describe('getBattlesByPacing', () => {
    it('should filter battles by pacing type', () => {
      const events: Event[] = [
        createMockBattle({ id: 'b1', pacing: 'surprise' }),
        createMockBattle({ id: 'b2', pacing: 'surprise' }),
        createMockBattle({ id: 'b3', pacing: 'extended' }),
      ];
      const surpriseBattles = getBattlesByPacing(events, 'surprise');
      
      expect(surpriseBattles.length).toBe(2);
      expect(surpriseBattles.every(b => b.battle?.pacing === 'surprise')).toBe(true);
    });
  });

  describe('getBattlesByTimeOfDay', () => {
    it('should filter battles by time of day', () => {
      const events: Event[] = [
        createMockBattle({ id: 'b1', timeOfDay: 'night' }),
        createMockBattle({ id: 'b2', timeOfDay: 'dawn' }),
        createMockBattle({ id: 'b3', timeOfDay: 'night' }),
      ];
      const nightBattles = getBattlesByTimeOfDay(events, 'night');
      
      expect(nightBattles.length).toBe(2);
      expect(nightBattles.every(b => b.battle?.timeOfDay === 'night')).toBe(true);
    });
  });

  describe('getSurpriseAnalysis', () => {
    it('should analyze surprise battle effectiveness', () => {
      const events: Event[] = [
        createMockBattle({ pacing: 'surprise', result: 'attacker_win' }),
        createMockBattle({ pacing: 'surprise', result: 'attacker_win' }),
        createMockBattle({ pacing: 'surprise', result: 'defender_win' }),
        createMockBattle({ pacing: 'rapid', result: 'attacker_win' }),
      ];
      const analysis = getSurpriseAnalysis(events);
      
      expect(analysis.totalSurpriseBattles).toBe(3);
      expect(analysis.surpriseAttackerWins).toBe(2);
      expect(analysis.surpriseDefenderWins).toBe(1);
      expect(analysis.surpriseAttackerWinRate).toBeCloseTo(0.667, 2);
    });

    it('should handle no surprise battles', () => {
      const events: Event[] = [
        createMockBattle({ pacing: 'extended' }),
      ];
      const analysis = getSurpriseAnalysis(events);
      
      expect(analysis.totalSurpriseBattles).toBe(0);
      expect(analysis.surpriseAttackerWinRate).toBe(0);
    });
  });

  describe('getPacingInsights', () => {
    it('should generate insights when data available', () => {
      const events: Event[] = [
        createMockBattle({ pacing: 'surprise', result: 'attacker_win' }),
        createMockBattle({ pacing: 'surprise', result: 'attacker_win' }),
        createMockBattle({ pacing: 'extended', result: 'defender_win' }),
      ];
      const insights = getPacingInsights(events);
      
      expect(insights.length).toBeGreaterThan(0);
      expect(insights[0]).toContain('突袭战');
    });

    it('should return empty array when no pacing data', () => {
      const events: Event[] = [
        createMockBattle({ pacing: undefined }),
      ];
      const insights = getPacingInsights(events);
      
      expect(insights).toEqual([]);
    });
  });

  describe('getTimeOfDayInsights', () => {
    it('should generate insights when data available', () => {
      const events: Event[] = [
        createMockBattle({ timeOfDay: 'dawn', result: 'attacker_win' }),
        createMockBattle({ timeOfDay: 'night', result: 'attacker_win' }),
      ];
      const insights = getTimeOfDayInsights(events);
      
      expect(insights.length).toBeGreaterThan(0);
    });
  });

  describe('getPacingSummary', () => {
    it('should return complete summary', () => {
      const events: Event[] = [
        createMockBattle({ 
          pacing: 'surprise', 
          timeOfDay: 'dawn',
          result: 'attacker_win' 
        }),
        createMockBattle({ pacing: 'extended' }),
      ];
      const summary = getPacingSummary(events);
      
      expect(summary.hasPacingData).toBe(true);
      expect(summary.hasTimeOfDayData).toBe(true);
      expect(summary.pacingStats.length).toBeGreaterThan(0);
      expect(summary.timeOfDayStats.length).toBeGreaterThan(0);
      expect(summary.pacingInsights.length).toBeGreaterThan(0);
      expect(summary.surpriseAnalysis.totalSurpriseBattles).toBe(1);
    });
  });
});
