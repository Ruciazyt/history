import { describe, it, expect } from 'vitest';
import {
  getAftermathTypeLabel,
  getSeverityLabel,
  getScopeLabel,
  getUniqueAftermathTypes,
  hasAftermathData,
  getAftermathTypeStats,
  getAllAftermathTypeStats,
  getBattlesByAftermathType,
  getMostCommonAftermathTypes,
  getMostSevereAftermathBattles,
  getLongTermAftermathBattles,
  getAftermathSeverityDistribution,
  getAftermathScopeDistribution,
  getAftermathResultCorrelation,
  getAftermathInsights,
  getAftermathSummary,
} from './battleAftermath';
import type { Event } from './types';

const mockEvents: Event[] = [
  {
    id: 'battle-1',
    entityId: 'period-warring-states',
    year: -260,
    titleKey: 'battles.changping',
    summaryKey: 'battles.changping.desc',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '秦', defender: '赵' },
      result: 'attacker_win',
      aftermath: [
        {
          type: 'military-weakening',
          description: '赵国元气大伤',
          affectedParties: ['赵国'],
          severity: 'massive',
          scope: 'regional',
          isLongTerm: true,
          duration: 50,
        },
        {
          type: 'territorial-change',
          description: '赵国失去上党地区',
          affectedParties: ['秦国', '赵国'],
          severity: 'significant',
          scope: 'regional',
        },
      ],
    },
  },
  {
    id: 'battle-2',
    entityId: 'period-warring-states',
    year: -342,
    titleKey: 'battles.maling',
    summaryKey: 'battles.maling.desc',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '齐', defender: '魏' },
      result: 'attacker_win',
      aftermath: [
        {
          type: 'military-weakening',
          description: '魏国衰落',
          affectedParties: ['魏国'],
          severity: 'significant',
          scope: 'regional',
          isLongTerm: true,
          duration: 30,
        },
      ],
    },
  },
  {
    id: 'battle-3',
    entityId: 'qin',
    year: -230,
    titleKey: 'battles.fanjin',
    summaryKey: 'battles.fanjin.desc',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '秦', defender: '韩' },
      result: 'attacker_win',
      aftermath: [
        {
          type: 'territorial-change',
          description: '韩国灭亡',
          affectedParties: ['秦国', '韩国'],
          severity: 'massive',
          scope: 'continental',
          isLongTerm: true,
        },
        {
          type: 'political-upheaval',
          description: '统一进程加快',
          affectedParties: ['秦国'],
          severity: 'massive',
          scope: 'continental',
        },
      ],
    },
  },
  {
    id: 'battle-4',
    entityId: 'han',
    year: -202,
    titleKey: 'battles.gaixia',
    summaryKey: 'battles.gaixia.desc',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '汉', defender: '楚' },
      result: 'attacker_win',
      aftermath: [
        {
          type: 'unification',
          description: '汉朝统一天下',
          affectedParties: ['汉', '楚'],
          severity: 'massive',
          scope: 'continental',
          isLongTerm: true,
          duration: 400,
        },
        {
          type: 'dynastic-change',
          description: '楚汉战争结束，汉朝建立',
          affectedParties: ['汉', '楚'],
          severity: 'massive',
          scope: 'continental',
          isLongTerm: true,
        },
      ],
    },
  },
  {
    id: 'battle-5',
    entityId: 'period-warring-states',
    year: -307,
    titleKey: 'battles.yique',
    summaryKey: 'battles.yique.desc',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '秦', defender: '魏' },
      result: 'defender_win',
      aftermath: [
        {
          type: 'territorial-change',
          description: '秦军受阻',
          affectedParties: ['秦国', '魏国'],
          severity: 'moderate',
          scope: 'local',
        },
      ],
    },
  },
  {
    id: 'non-battle-event',
    entityId: 'period-warring-states',
    year: -300,
    titleKey: 'events.some-event',
    summaryKey: 'events.some-event.desc',
    tags: ['political'],
  },
];

describe('battleAftermath', () => {
  describe('getAftermathTypeLabel', () => {
    it('should return correct label for territorial-change', () => {
      expect(getAftermathTypeLabel('territorial-change')).toBe('领土变化');
    });

    it('should return correct label for political-upheaval', () => {
      expect(getAftermathTypeLabel('political-upheaval')).toBe('政治动荡');
    });

    it('should return correct label for dynastic-change', () => {
      expect(getAftermathTypeLabel('dynastic-change')).toBe('朝代更替');
    });

    it('should return correct label for unification', () => {
      expect(getAftermathTypeLabel('unification')).toBe('统一');
    });

    it('should return empty string for undefined', () => {
      expect(getAftermathTypeLabel(undefined)).toBe('');
    });

    it('should return correct label for fragmentation', () => {
      expect(getAftermathTypeLabel('fragmentation')).toBe('分裂');
    });
  });

  describe('getSeverityLabel', () => {
    it('should return correct label for massive', () => {
      expect(getSeverityLabel('massive')).toBe('巨大');
    });

    it('should return correct label for significant', () => {
      expect(getSeverityLabel('significant')).toBe('重大');
    });

    it('should return empty string for undefined', () => {
      expect(getSeverityLabel(undefined)).toBe('');
    });
  });

  describe('getScopeLabel', () => {
    it('should return correct label for continental', () => {
      expect(getScopeLabel('continental')).toBe('全国');
    });

    it('should return correct label for regional', () => {
      expect(getScopeLabel('regional')).toBe('区域性');
    });

    it('should return empty string for undefined', () => {
      expect(getScopeLabel(undefined)).toBe('');
    });
  });

  describe('getUniqueAftermathTypes', () => {
    it('should return all unique aftermath types', () => {
      const types = getUniqueAftermathTypes(mockEvents);
      expect(types).toContain('military-weakening');
      expect(types).toContain('territorial-change');
      expect(types).toContain('political-upheaval');
      expect(types).toContain('unification');
      expect(types).toContain('dynastic-change');
    });

    it('should return sorted array', () => {
      const types = getUniqueAftermathTypes(mockEvents);
      expect(types).toEqual([...types].sort());
    });
  });

  describe('hasAftermathData', () => {
    it('should return true when battles have aftermath data', () => {
      expect(hasAftermathData(mockEvents)).toBe(true);
    });

    it('should return false when no battles have aftermath', () => {
      const eventsWithoutAftermath: Event[] = [
        {
          id: 'battle-no-aftermath',
          entityId: 'period-warring-states',
          year: -300,
          titleKey: 'battles.test',
          summaryKey: 'battles.test.desc',
          tags: ['war'],
          battle: {
            belligerents: { attacker: '秦', defender: '楚' },
            result: 'attacker_win',
          },
        },
      ];
      expect(hasAftermathData(eventsWithoutAftermath)).toBe(false);
    });
  });

  describe('getAftermathTypeStats', () => {
    it('should get correct stats for military-weakening', () => {
      const stats = getAftermathTypeStats(mockEvents, 'military-weakening');
      expect(stats.type).toBe('military-weakening');
      expect(stats.label).toBe('军事衰弱');
      expect(stats.count).toBe(2);
      expect(stats.longTermCount).toBe(2);
      expect(stats.severityBreakdown.massive).toBe(1);
      expect(stats.severityBreakdown.significant).toBe(1);
    });

    it('should get correct stats for territorial-change', () => {
      const stats = getAftermathTypeStats(mockEvents, 'territorial-change');
      expect(stats.type).toBe('territorial-change');
      expect(stats.count).toBe(3);
      expect(stats.averageDuration).toBeUndefined(); // Only 1 has duration
    });
  });

  describe('getAllAftermathTypeStats', () => {
    it('should return stats for all types', () => {
      const allStats = getAllAftermathTypeStats(mockEvents);
      expect(allStats.length).toBe(5);
      expect(allStats.some(s => s.type === 'military-weakening')).toBe(true);
      expect(allStats.some(s => s.type === 'territorial-change')).toBe(true);
    });
  });

  describe('getBattlesByAftermathType', () => {
    it('should return battles with specified aftermath type', () => {
      const battles = getBattlesByAftermathType(mockEvents, 'military-weakening');
      expect(battles.length).toBe(2);
    });

    it('should return battles with unification aftermath', () => {
      const battles = getBattlesByAftermathType(mockEvents, 'unification');
      expect(battles.length).toBe(1);
      expect(battles[0].id).toBe('battle-4');
    });
  });

  describe('getMostCommonAftermathTypes', () => {
    it('should return top N most common types', () => {
      const topTypes = getMostCommonAftermathTypes(mockEvents, 3);
      expect(topTypes.length).toBe(3);
      expect(topTypes[0].count).toBeGreaterThanOrEqual(topTypes[1].count);
    });
  });

  describe('getMostSevereAftermathBattles', () => {
    it('should return battles with massive or significant severity', () => {
      const severe = getMostSevereAftermathBattles(mockEvents, 'significant');
      expect(severe.length).toBe(4);
    });
  });

  describe('getLongTermAftermathBattles', () => {
    it('should return battles with long-term aftermath', () => {
      const longTerm = getLongTermAftermathBattles(mockEvents);
      expect(longTerm.length).toBe(4);
    });
  });

  describe('getAftermathSeverityDistribution', () => {
    it('should return severity distribution', () => {
      const dist = getAftermathSeverityDistribution(mockEvents);
      expect(dist.length).toBe(5);
      const massive = dist.find(d => d.severity === 'massive');
      expect(massive?.count).toBe(5);
    });
  });

  describe('getAftermathScopeDistribution', () => {
    it('should return scope distribution', () => {
      const dist = getAftermathScopeDistribution(mockEvents);
      expect(dist.length).toBe(4);
      const continental = dist.find(d => d.scope === 'continental');
      expect(continental?.count).toBe(4);
    });
  });

  describe('getAftermathResultCorrelation', () => {
    it('should return correlation between aftermath and result', () => {
      const corr = getAftermathResultCorrelation(mockEvents);
      expect(corr.length).toBe(5);
      const unification = corr.find(c => c.aftermathType === 'unification');
      expect(unification?.attackerWinRate).toBe(100);
    });
  });

  describe('getAftermathInsights', () => {
    it('should generate insights', () => {
      const insights = getAftermathInsights(mockEvents);
      expect(insights.length).toBeGreaterThan(0);
      expect(insights[0]).toContain('常见');
    });

    it('should return default message when no data', () => {
      const events: Event[] = [
        {
          id: 'battle-no-data',
          entityId: 'period-warring-states',
          year: -300,
          titleKey: 'battles.test',
          summaryKey: 'battles.test.desc',
          tags: ['war'],
          battle: {
            belligerents: { attacker: '秦', defender: '楚' },
            result: 'attacker_win',
          },
        },
      ];
      const insights = getAftermathInsights(events);
      expect(insights).toEqual(['暂无战役后果相关数据']);
    });
  });

  describe('getAftermathSummary', () => {
    it('should return complete summary', () => {
      const summary = getAftermathSummary(mockEvents);
      expect(summary.hasAftermathData).toBe(true);
      expect(summary.uniqueAftermathTypes).toBe(5);
      expect(summary.totalBattlesWithAftermath).toBe(5);
      expect(summary.totalAftermathRecords).toBe(8);
      expect(summary.longTermAftermathCount).toBe(5);
      expect(summary.typeStats.length).toBe(5);
      expect(summary.insights.length).toBeGreaterThan(0);
    });
  });
});
