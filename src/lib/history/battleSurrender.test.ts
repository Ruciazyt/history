/**
 * 战役投降/改编分析测试
 */

import { describe, it, expect } from 'vitest';
import {
  getSurrenderTypeLabel,
  getSurrenderSeverityLabel,
  getTreatmentLabel,
  getUniqueSurrenderTypes,
  hasSurrenderData,
  getSurrenderTypeStats,
  getAllSurrenderTypeStats,
  getSurrenderBySide,
  getBattlesWithSurrender,
  getBattlesBySurrenderType,
  getMassSurrenderBattles,
  getDefectionBattles,
  getDecisiveSurrenderBattles,
  getSurrenderResultCorrelation,
  getTreatmentStats,
  getDefectionImpact,
  getSurrenderInsights,
  getSurrenderSummary,
} from './battleSurrender';
import type { Event } from './types';

// Mock event with surrender data
const createMockEvent = (overrides: Partial<Event['battle']> = {}): Event => ({
  id: 'test-event',
  entityId: 'test-era',
  year: -260,
  titleKey: 'battle.test',
  summaryKey: 'summary.test',
  battle: {
    result: 'attacker_win',
    surrender: [],
    ...overrides,
  } as Event['battle'],
} as Event);

describe('battleSurrender', () => {
  describe('getSurrenderTypeLabel', () => {
    it('should return correct Chinese labels', () => {
      expect(getSurrenderTypeLabel('surrender')).toBe('投降');
      expect(getSurrenderTypeLabel('capitulation')).toBe('投降（正式）');
      expect(getSurrenderTypeLabel('defection')).toBe('倒戈');
      expect(getSurrenderTypeLabel('surrender-after-wound')).toBe('受伤投降');
      expect(getSurrenderTypeLabel('mass-surrender')).toBe('大规模投降');
      expect(getSurrenderTypeLabel('surrender-pursuit')).toBe('投降后追击');
      expect(getSurrenderTypeLabel('refused-surrender')).toBe('拒绝投降');
      expect(getSurrenderTypeLabel('negotiated-surrender')).toBe('谈判投降');
      expect(getSurrenderTypeLabel('unknown')).toBe('未知');
    });
  });

  describe('getSurrenderSeverityLabel', () => {
    it('should return correct Chinese labels', () => {
      expect(getSurrenderSeverityLabel('massive')).toBe('大规模');
      expect(getSurrenderSeverityLabel('significant')).toBe('重大');
      expect(getSurrenderSeverityLabel('moderate')).toBe('中等');
      expect(getSurrenderSeverityLabel('minor')).toBe('轻微');
      expect(getSurrenderSeverityLabel('unknown')).toBe('未知');
    });
  });

  describe('getTreatmentLabel', () => {
    it('should return correct Chinese labels', () => {
      expect(getTreatmentLabel('enslaved')).toBe('沦为奴隶');
      expect(getTreatmentLabel('integrated')).toBe('改编整合');
      expect(getTreatmentLabel('released')).toBe('释放');
      expect(getTreatmentLabel('executed')).toBe('处决');
      expect(getTreatmentLabel('unknown')).toBe('未知');
      expect(getTreatmentLabel(undefined)).toBe('未知');
    });
  });

  describe('getUniqueSurrenderTypes', () => {
    it('should return unique surrender types', () => {
      const events: Event[] = [
        createMockEvent({
          surrender: [
            { type: 'surrender', description: 'test', side: 'defender' },
            { type: 'defection', description: 'test', side: 'attacker' },
          ],
        }),
        createMockEvent({
          surrender: [
            { type: 'surrender', description: 'test', side: 'defender' },
          ],
        }),
      ];
      
      const types = getUniqueSurrenderTypes(events);
      expect(types).toContain('surrender');
      expect(types).toContain('defection');
      expect(types).toHaveLength(2);
    });

    it('should exclude unknown type', () => {
      const events: Event[] = [
        createMockEvent({
          surrender: [
            { type: 'surrender', description: 'test', side: 'defender' },
            { type: 'unknown', description: 'test', side: 'defender' },
          ],
        }),
      ];
      
      const types = getUniqueSurrenderTypes(events);
      expect(types).toContain('surrender');
      expect(types).not.toContain('unknown');
    });

    it('should return empty array for no surrender data', () => {
      const events: Event[] = [createMockEvent()];
      const types = getUniqueSurrenderTypes(events);
      expect(types).toHaveLength(0);
    });
  });

  describe('hasSurrenderData', () => {
    it('should return true when surrender data exists', () => {
      const events: Event[] = [
        createMockEvent({
          surrender: [
            { type: 'surrender', description: 'test', side: 'defender' },
          ],
        }),
      ];
      
      expect(hasSurrenderData(events)).toBe(true);
    });

    it('should return false when no surrender data', () => {
      const events: Event[] = [createMockEvent()];
      expect(hasSurrenderData(events)).toBe(false);
    });
  });

  describe('getSurrenderTypeStats', () => {
    it('should return stats for specific surrender type', () => {
      const events: Event[] = [
        {
          id: 'test-event-1',
          entityId: 'test-era',
          year: -260,
          titleKey: 'battle.test1',
          summaryKey: 'summary.test1',
          battle: {
            result: 'attacker_win',
            surrender: [{ type: 'surrender', description: 'test', side: 'defender' }],
          },
        },
        {
          id: 'test-event-2',
          entityId: 'test-era',
          year: -250,
          titleKey: 'battle.test2',
          summaryKey: 'summary.test2',
          battle: {
            result: 'defender_win',
            surrender: [{ type: 'surrender', description: 'test', side: 'attacker' }],
          },
        },
      ];
      
      const stats = getSurrenderTypeStats(events, 'surrender');
      expect(stats.type).toBe('surrender');
      expect(stats.count).toBe(2);
      expect(stats.battles).toHaveLength(2);
    });
  });

  describe('getAllSurrenderTypeStats', () => {
    it('should return stats for all surrender types', () => {
      const events: Event[] = [
        createMockEvent({
          surrender: [
            { type: 'surrender', description: 'test', side: 'defender' },
            { type: 'defection', description: 'test', side: 'attacker' },
          ],
        }),
      ];
      
      const stats = getAllSurrenderTypeStats(events);
      expect(stats).toHaveLength(2);
    });
  });

  describe('getSurrenderBySide', () => {
    it('should return surrender stats by side', () => {
      const events: Event[] = [
        createMockEvent({
          surrender: [
            { type: 'surrender', description: 'test', side: 'defender' },
            { type: 'defection', description: 'test', side: 'attacker' },
          ],
        }),
      ];
      
      const stats = getSurrenderBySide(events);
      const attackerStat = stats.find(s => s.side === 'attacker');
      const defenderStat = stats.find(s => s.side === 'defender');
      
      expect(attackerStat?.total).toBe(1);
      expect(defenderStat?.total).toBe(1);
    });
  });

  describe('getBattlesWithSurrender', () => {
    it('should return battles with surrender data', () => {
      const events: Event[] = [
        createMockEvent(),
        createMockEvent({
          id: 'test-2',
          surrender: [{ type: 'surrender', description: 'test', side: 'defender' }],
        }),
      ];
      
      const battles = getBattlesWithSurrender(events);
      expect(battles).toHaveLength(1);
    });
  });

  describe('getBattlesBySurrenderType', () => {
    it('should filter battles by surrender type', () => {
      const events: Event[] = [
        createMockEvent({
          surrender: [{ type: 'surrender', description: 'test', side: 'defender' }],
        }),
        createMockEvent({
          id: 'test-2',
          titleKey: 'battle.test2',
          battle: { result: 'attacker_win', surrender: [
            { type: 'defection', description: 'test', side: 'attacker' },
          ]},
        }),
      ];
      
      const battles = getBattlesBySurrenderType(events, 'surrender');
      expect(battles).toHaveLength(1);
    });
  });

  describe('getMassSurrenderBattles', () => {
    it('should return battles with mass surrender', () => {
      const events: Event[] = [
        createMockEvent({
          surrender: [{ type: 'mass-surrender', description: 'test', side: 'defender', severity: 'massive' }],
        }),
        createMockEvent({
          id: 'test-2',
          titleKey: 'battle.test2',
          battle: { result: 'attacker_win', surrender: [
            { type: 'surrender', description: 'test', side: 'defender' },
          ]},
        }),
      ];
      
      const battles = getMassSurrenderBattles(events);
      expect(battles).toHaveLength(1);
    });
  });

  describe('getDefectionBattles', () => {
    it('should return battles with defection', () => {
      const events: Event[] = [
        createMockEvent({
          surrender: [{ type: 'defection', description: 'test', side: 'attacker' }],
        }),
      ];
      
      const battles = getDefectionBattles(events);
      expect(battles).toHaveLength(1);
    });
  });

  describe('getDecisiveSurrenderBattles', () => {
    it('should return battles with decisive surrender impact', () => {
      const events: Event[] = [
        createMockEvent({
          surrender: [{ type: 'surrender', description: 'test', side: 'defender', impact: 'decisive' }],
        }),
        createMockEvent({
          id: 'test-2',
          titleKey: 'battle.test2',
          battle: { result: 'attacker_win', surrender: [
            { type: 'surrender', description: 'test', side: 'defender', impact: 'minor' },
          ]},
        }),
      ];
      
      const battles = getDecisiveSurrenderBattles(events);
      expect(battles).toHaveLength(1);
    });
  });

  describe('getSurrenderResultCorrelation', () => {
    it('should analyze surrender-result correlation', () => {
      const events: Event[] = [
        {
          id: 'test-event-1',
          entityId: 'test-era',
          year: -260,
          titleKey: 'battle.test1',
          summaryKey: 'summary.test1',
          battle: {
            result: 'attacker_win',
            surrender: [{ type: 'surrender', description: 'test', side: 'defender' }],
          },
        },
        {
          id: 'test-event-2',
          entityId: 'test-era',
          year: -250,
          titleKey: 'battle.test2',
          summaryKey: 'summary.test2',
          battle: {
            result: 'defender_win',
            surrender: [{ type: 'surrender', description: 'test', side: 'attacker' }],
          },
        },
      ];
      
      const correlation = getSurrenderResultCorrelation(events);
      expect(correlation.totalBattlesWithSurrender).toBe(2);
      // First battle: attacker wins, defender surrendered -> defenderSurrenderVictory = 1
      // Second battle: defender wins, attacker surrendered -> attackerSurrenderDefeat = 1
      expect(correlation.defenderSurrenderVictory).toBe(1);
      expect(correlation.attackerSurrenderDefeat).toBe(1);
    });
  });

  describe('getTreatmentStats', () => {
    it('should return treatment statistics', () => {
      const events: Event[] = [
        createMockEvent({
          surrender: [
            { type: 'surrender', description: 'test', side: 'defender', treatment: 'integrated' },
            { type: 'surrender', description: 'test', side: 'defender', treatment: 'integrated' },
          ],
        }),
        createMockEvent({
          id: 'test-2',
          titleKey: 'battle.test2',
          battle: { result: 'attacker_win', surrender: [
            { type: 'surrender', description: 'test', side: 'attacker', treatment: 'executed' },
          ]},
        }),
      ];
      
      const stats = getTreatmentStats(events);
      // Two events with different treatments
      expect(stats.length).toBeGreaterThanOrEqual(1);
      const integrated = stats.find(s => s.treatment === '改编整合');
      expect(integrated?.count).toBe(2);
    });
  });

  describe('getDefectionImpact', () => {
    it('should analyze defection impact', () => {
      const events: Event[] = [
        createMockEvent({
          surrender: [
            { type: 'defection', description: 'test', side: 'attacker', involvesKeyPerson: true },
          ],
        }),
      ];
      
      const impact = getDefectionImpact(events);
      expect(impact.totalDefections).toBe(1);
      expect(impact.keyPersonInvolved).toBe(1);
      expect(impact.defectorWins).toBe(1);
    });
  });

  describe('getSurrenderInsights', () => {
    it('should generate insights for surrender data', () => {
      const events: Event[] = [
        createMockEvent({
          surrender: [
            { type: 'surrender', description: 'test', side: 'defender', severity: 'massive' },
            { type: 'defection', description: 'test', side: 'attacker' },
          ],
        }),
        createMockEvent({
          id: 'test-2',
          titleKey: 'battle.test2',
          battle: { result: 'defender_win', surrender: [
            { type: 'surrender', description: 'test', side: 'attacker', treatment: 'integrated' },
          ]},
        }),
      ];
      
      const insights = getSurrenderInsights(events);
      expect(insights.length).toBeGreaterThan(0);
      expect(insights[0]).not.toBe('暂无投降/改编数据');
    });

    it('should return placeholder when no data', () => {
      const events: Event[] = [createMockEvent()];
      const insights = getSurrenderInsights(events);
      expect(insights).toEqual(['暂无投降/改编数据']);
    });
  });

  describe('getSurrenderSummary', () => {
    it('should return complete summary', () => {
      const events: Event[] = [
        createMockEvent({
          surrender: [
            { type: 'surrender', description: 'test', side: 'defender' },
          ],
        }),
      ];
      
      const summary = getSurrenderSummary(events);
      expect(summary.hasData).toBe(true);
      expect(summary.totalSurrenders).toBe(1);
      expect(summary.battlesWithSurrender).toBe(1);
      expect(summary.statsByType).toHaveLength(1);
      expect(summary.statsBySide).toHaveLength(1);
      expect(summary.insights.length).toBeGreaterThan(0);
    });

    it('should return empty summary when no data', () => {
      const events: Event[] = [createMockEvent()];
      const summary = getSurrenderSummary(events);
      expect(summary.hasData).toBe(false);
      expect(summary.totalSurrenders).toBe(0);
      expect(summary.insights).toEqual(['暂无投降/改编数据']);
    });
  });
});
