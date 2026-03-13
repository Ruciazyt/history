/**
 * 战役将领损失分析测试
 */

import { describe, it, expect } from 'vitest';
import {
  getLossTypeLabel,
  getSeverityLabel,
  getUniqueLossTypes,
  hasLossData,
  getLossTypeStats,
  getAllLossTypeStats,
  getLossBySide,
  getBattlesWithLosses,
  getBattlesByLossType,
  getBattlesWithKeyCommanderLoss,
  getLossResultCorrelation,
  getMostLossesBattles,
  getKilledInActionStats,
  getCapturedStats,
  getCommanderLossInsights,
  getLossSummary,
} from './battleCommanderLoss';
import type { Event } from './types';

// Mock event with commander losses
const createMockEvent = (overrides: Partial<Event['battle']> = {}): Event => ({
  id: 'test-event',
  entityId: 'test-era',
  year: -260,
  titleKey: 'battle.test',
  summaryKey: 'summary.test',
  battle: {
    result: 'attacker_win',
    commandersLoss: [],
    ...overrides,
  },
} as Event);

describe('battleCommanderLoss', () => {
  describe('getLossTypeLabel', () => {
    it('should return correct Chinese labels', () => {
      expect(getLossTypeLabel('killed-in-action')).toBe('阵亡');
      expect(getLossTypeLabel('captured')).toBe('被俘');
      expect(getLossTypeLabel('defected')).toBe('倒戈');
      expect(getLossTypeLabel('deserted')).toBe('逃亡');
      expect(getLossTypeLabel('executed')).toBe('被处决');
      expect(getLossTypeLabel('wounded-died')).toBe('受伤不治');
      expect(getLossTypeLabel('suicide')).toBe('自杀');
      expect(getLossTypeLabel('unknown')).toBe('未知');
    });
  });

  describe('getSeverityLabel', () => {
    it('should return correct severity labels', () => {
      expect(getSeverityLabel('critical')).toBe('重大损失');
      expect(getSeverityLabel('major')).toBe('较大损失');
      expect(getSeverityLabel('minor')).toBe('轻微损失');
      expect(getSeverityLabel('unknown')).toBe('未知');
    });
  });

  describe('getUniqueLossTypes', () => {
    it('should return unique loss types', () => {
      const events: Event[] = [
        createMockEvent({
          commandersLoss: [
            { name: 'General A', type: 'killed-in-action', side: 'defender' },
          ],
        }),
        createMockEvent({
          commandersLoss: [
            { name: 'General B', type: 'captured', side: 'defender' },
          ],
        }),
        createMockEvent({
          commandersLoss: [
            { name: 'General C', type: 'killed-in-action', side: 'attacker' },
          ],
        }),
      ];

      const types = getUniqueLossTypes(events);
      expect(types).toContain('killed-in-action');
      expect(types).toContain('captured');
      expect(types.length).toBe(2);
    });

    it('should exclude unknown types', () => {
      const events: Event[] = [
        createMockEvent({
          commandersLoss: [
            { name: 'General A', type: 'unknown', side: 'defender' },
          ],
        }),
      ];

      const types = getUniqueLossTypes(events);
      expect(types).not.toContain('unknown');
      expect(types.length).toBe(0);
    });
  });

  describe('hasLossData', () => {
    it('should return true when events have loss data', () => {
      const events: Event[] = [
        createMockEvent({
          commandersLoss: [
            { name: 'General A', type: 'killed-in-action', side: 'defender' },
          ],
        }),
      ];

      expect(hasLossData(events)).toBe(true);
    });

    it('should return false when no events have loss data', () => {
      const events: Event[] = [
        createMockEvent({ commandersLoss: [] }),
      ];

      expect(hasLossData(events)).toBe(false);
    });

    it('should return false when events have no commandersLoss field', () => {
      const events: Event[] = [
        { id: 'test', entityId: 'era', year: -100, titleKey: 'test', summaryKey: 'test', battle: {} } as Event,
      ];

      expect(hasLossData(events)).toBe(false);
    });
  });

  describe('getLossTypeStats', () => {
    it('should calculate correct stats for specific loss type', () => {
      const events: Event[] = [
        createMockEvent({
          result: 'attacker_win',
          commandersLoss: [
            { name: 'General A', type: 'killed-in-action', side: 'defender' },
          ],
        }),
        createMockEvent({
          result: 'defender_win',
          commandersLoss: [
            { name: 'General B', type: 'killed-in-action', side: 'attacker' },
          ],
        }),
        createMockEvent({
          result: 'attacker_win',
          commandersLoss: [
            { name: 'General C', type: 'captured', side: 'defender' },
          ],
        }),
      ];

      const stats = getLossTypeStats(events, 'killed-in-action');
      expect(stats.type).toBe('killed-in-action');
      expect(stats.count).toBe(2);
      expect(stats.victoryCount).toBe(1);
      expect(stats.defeatCount).toBe(1);
    });
  });

  describe('getAllLossTypeStats', () => {
    it('should return stats for all loss types', () => {
      const events: Event[] = [
        createMockEvent({
          commandersLoss: [
            { name: 'General A', type: 'killed-in-action', side: 'defender' },
            { name: 'General B', type: 'captured', side: 'defender' },
          ],
        }),
      ];

      const stats = getAllLossTypeStats(events);
      expect(stats.length).toBe(2);
    });
  });

  describe('getLossBySide', () => {
    it('should calculate losses by side', () => {
      const events: Event[] = [
        createMockEvent({
          commandersLoss: [
            { name: 'General A', type: 'killed-in-action', side: 'attacker' },
            { name: 'General B', type: 'captured', side: 'defender', isKeyCommander: true },
          ],
        }),
      ];

      const sideStats = getLossBySide(events);
      const attacker = sideStats.find(s => s.side === 'attacker');
      const defender = sideStats.find(s => s.side === 'defender');

      expect(attacker?.totalLosses).toBe(1);
      expect(attacker?.keyCommanderLosses).toBe(0);
      expect(defender?.totalLosses).toBe(1);
      expect(defender?.keyCommanderLosses).toBe(1);
    });
  });

  describe('getBattlesWithLosses', () => {
    it('should return only battles with losses', () => {
      const events: Event[] = [
        createMockEvent({ commandersLoss: [] }),
        createMockEvent({
          commandersLoss: [
            { name: 'General A', type: 'killed-in-action', side: 'defender' },
          ],
        }),
        createMockEvent({ commandersLoss: [] }),
      ];

      const battles = getBattlesWithLosses(events);
      expect(battles.length).toBe(1);
    });
  });

  describe('getBattlesByLossType', () => {
    it('should filter battles by loss type', () => {
      const events: Event[] = [
        createMockEvent({
          commandersLoss: [
            { name: 'General A', type: 'killed-in-action', side: 'defender' },
          ],
        }),
        createMockEvent({
          commandersLoss: [
            { name: 'General B', type: 'captured', side: 'defender' },
          ],
        }),
      ];

      const battles = getBattlesByLossType(events, 'killed-in-action');
      expect(battles.length).toBe(1);
    });
  });

  describe('getBattlesWithKeyCommanderLoss', () => {
    it('should return battles with key commander losses', () => {
      const events: Event[] = [
        createMockEvent({
          commandersLoss: [
            { name: 'General A', type: 'killed-in-action', side: 'defender', isKeyCommander: true },
          ],
        }),
        createMockEvent({
          commandersLoss: [
            { name: 'General B', type: 'captured', side: 'defender', isKeyCommander: false },
          ],
        }),
      ];

      const battles = getBattlesWithKeyCommanderLoss(events);
      expect(battles.length).toBe(1);
    });
  });

  describe('getLossResultCorrelation', () => {
    it('should calculate correlation between losses and results', () => {
      const events: Event[] = [
        createMockEvent({
          result: 'attacker_win',
          commandersLoss: [
            { name: 'General A', type: 'killed-in-action', side: 'defender' },
          ],
        }),
        createMockEvent({
          result: 'defender_win',
          commandersLoss: [
            { name: 'General B', type: 'killed-in-action', side: 'attacker' },
          ],
        }),
        createMockEvent({
          result: 'attacker_win',
          commandersLoss: [
            { name: 'General C', type: 'killed-in-action', side: 'attacker', isKeyCommander: true },
          ],
        }),
      ];

      const correlation = getLossResultCorrelation(events);
      expect(correlation.totalBattlesWithLoss).toBe(3);
      expect(correlation.defenderLossVictory).toBe(1); // defender lost, attacker won
      expect(correlation.attackerLossDefeat).toBe(1); // attacker lost, defender won
      expect(correlation.keyLossVictory).toBe(1);
    });
  });

  describe('getMostLossesBattles', () => {
    it('should return battles with most losses', () => {
      const events: Event[] = [
        createMockEvent({
          id: 'battle-many',
          titleKey: 'battle.many',
          commandersLoss: [
            { name: 'A', type: 'killed-in-action', side: 'defender' },
            { name: 'B', type: 'captured', side: 'defender' },
            { name: 'C', type: 'defected', side: 'defender' },
          ],
        }),
        createMockEvent({
          id: 'battle-few',
          titleKey: 'battle.few',
          commandersLoss: [
            { name: 'D', type: 'killed-in-action', side: 'defender' },
          ],
        }),
      ];

      const battles = getMostLossesBattles(events, 2);
      // First check the count, then verify it contains the right event
      expect(battles[0].lossCount).toBe(3);
      expect(battles[1].lossCount).toBe(1);
    });
  });

  describe('getKilledInActionStats', () => {
    it('should calculate killed in action stats', () => {
      const events: Event[] = [
        createMockEvent({
          result: 'attacker_win',
          commandersLoss: [
            { name: 'General A', type: 'killed-in-action', side: 'defender' },
            { name: 'General B', type: 'killed-in-action', side: 'attacker' },
            { name: 'General C', type: 'captured', side: 'defender' },
          ],
        }),
      ];

      const stats = getKilledInActionStats(events);
      expect(stats.total).toBe(2);
      expect(stats.defenderKilled).toBe(1);
      expect(stats.attackerKilled).toBe(1);
    });
  });

  describe('getCapturedStats', () => {
    it('should calculate captured stats', () => {
      const events: Event[] = [
        createMockEvent({
          commandersLoss: [
            { name: 'General A', type: 'captured', side: 'defender' },
            { name: 'General B', type: 'captured', side: 'defender' },
          ],
        }),
      ];

      const stats = getCapturedStats(events);
      expect(stats.total).toBe(2);
      expect(stats.defenderCaptured).toBe(2);
    });
  });

  describe('getCommanderLossInsights', () => {
    it('should generate insights', () => {
      const events: Event[] = [
        createMockEvent({
          result: 'attacker_win',
          commandersLoss: [
            { name: 'General A', type: 'killed-in-action', side: 'defender', isKeyCommander: true },
          ],
        }),
      ];

      const insights = getCommanderLossInsights(events);
      expect(insights.length).toBeGreaterThan(0);
    });

    it('should return default message when no data', () => {
      const events: Event[] = [
        createMockEvent({ commandersLoss: [] }),
      ];

      const insights = getCommanderLossInsights(events);
      expect(insights).toContain('暂无将领损失数据');
    });
  });

  describe('getLossSummary', () => {
    it('should return complete summary', () => {
      const events: Event[] = [
        createMockEvent({
          commandersLoss: [
            { name: 'General A', type: 'killed-in-action', side: 'defender', isKeyCommander: true },
          ],
        }),
      ];

      const summary = getLossSummary(events);
      expect(summary.hasData).toBe(true);
      expect(summary.totalLosses).toBe(1);
      expect(summary.keyCommanderLosses).toBe(1);
      expect(summary.statsByType.length).toBe(1);
      expect(summary.insights.length).toBeGreaterThan(0);
    });

    it('should return default values when no data', () => {
      const events: Event[] = [
        createMockEvent({ commandersLoss: [] }),
      ];

      const summary = getLossSummary(events);
      expect(summary.hasData).toBe(false);
      expect(summary.totalLosses).toBe(0);
      expect(summary.insights).toContain('暂无将领损失数据');
    });
  });
});
