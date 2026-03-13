import { describe, it, expect } from 'vitest';
import {
  getBreakthroughTypeLabel,
  getBreakthroughResultLabel,
  getSeverityLabel,
  hasBreakthroughData,
  getUniqueBreakthroughTypes,
  getBattlesWithBreakthrough,
  getBreakthroughTypeStats,
  getAllBreakthroughTypeStats,
  getBreakthroughBySide,
  getBreakthroughResultStats,
  getDecisiveBreakthroughBattles,
  getMostBreakthroughBattles,
  getBattlesByBreakthroughType,
  getBreakthroughOutcomeCorrelation,
  getMostSuccessfulBreakthroughTypes,
  getBreakthroughInsights,
  getBreakthroughSummary,
} from './battleBreakthrough';
import type { Event, BreakthroughType, BreakthroughResult } from './types';

const mockEvents: Event[] = [
  {
    id: 'battle-1',
    entityId: 'period-warring-states',
    year: -260,
    titleKey: 'battle.changping',
    summaryKey: 'summary.changping',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '秦', defender: '赵' },
      result: 'attacker_win',
      breakthrough: [
        {
          type: 'encirclement-breakout',
          description: '秦军包围赵军主力',
          side: 'attacker',
          result: 'success',
          severity: 'decisive',
          decisive: true,
          phase: '第二阶段',
        },
        {
          type: 'pursuit-victory',
          description: '秦军追击撤退的赵军',
          side: 'attacker',
          result: 'success',
          severity: 'significant',
        },
      ],
    },
  },
  {
    id: 'battle-2',
    entityId: 'period-warring-states',
    year: -342,
    titleKey: 'battle.maling',
    summaryKey: 'summary.maling',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '齐', defender: '魏' },
      result: 'attacker_win',
      breakthrough: [
        {
          type: 'feigned-retreat',
          description: '齐军佯败诱敌深入',
          side: 'attacker',
          result: 'success',
          severity: 'decisive',
          decisive: true,
        },
        {
          type: 'ambush-breakout',
          description: '魏军进入伏击圈',
          side: 'defender',
          result: 'failure',
          severity: 'decisive',
        },
      ],
    },
  },
  {
    id: 'battle-3',
    entityId: 'period-warring-states',
    year: -632,
    titleKey: 'battle.chengpu',
    summaryKey: 'summary.chengpu',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '晋', defender: '楚' },
      result: 'attacker_win',
      breakthrough: [
        {
          type: 'flanking-breakthrough',
          description: '晋军侧翼攻击楚军',
          side: 'attacker',
          result: 'success',
          severity: 'decisive',
          decisive: true,
        },
      ],
    },
  },
  {
    id: 'battle-4',
    entityId: 'period-spring-autumn',
    year: -1046,
    titleKey: 'battle.moye',
    summaryKey: 'summary.moye',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '周', defender: '商' },
      result: 'attacker_win',
      breakthrough: [
        {
          type: 'frontal-breakthrough',
          description: '周军正面突破商军阵线',
          side: 'attacker',
          result: 'success',
        },
      ],
    },
  },
  {
    id: 'battle-5',
    entityId: 'period-warring-states',
    year: -506,
    titleKey: 'battle.boju',
    summaryKey: 'summary.boju',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '吴', defender: '楚' },
      result: 'attacker_win',
      breakthrough: [
        {
          type: 'tactical-retreat',
          description: '楚军战术撤退',
          side: 'defender',
          result: 'failure',
        },
      ],
    },
  },
  {
    id: 'normal-event',
    entityId: 'period-warring-states',
    year: -300,
    titleKey: 'event.found',
    summaryKey: 'summary.found',
    tags: [],
  },
];

describe('battleBreakthrough', () => {
  describe('getBreakthroughTypeLabel', () => {
    it('should return correct Chinese label for each type', () => {
      expect(getBreakthroughTypeLabel('frontal-breakthrough')).toBe('正面突破');
      expect(getBreakthroughTypeLabel('flanking-breakthrough')).toBe('侧翼突破');
      expect(getBreakthroughTypeLabel('center-breakthrough')).toBe('中央突破');
      expect(getBreakthroughTypeLabel('encirclement-breakout')).toBe('突围/突围战');
      expect(getBreakthroughTypeLabel('pursuit-victory')).toBe('追击胜利');
      expect(getBreakthroughTypeLabel('defensive-stand')).toBe('防守坚守');
      expect(getBreakthroughTypeLabel('tactical-retreat')).toBe('战术撤退');
      expect(getBreakthroughTypeLabel('feigned-retreat')).toBe('佯败/诱敌');
      expect(getBreakthroughTypeLabel('counterattack')).toBe('反击');
      expect(getBreakthroughTypeLabel('ambush-breakout')).toBe('伏击突围');
      expect(getBreakthroughTypeLabel('siege-breakout')).toBe('围城突围');
      expect(getBreakthroughTypeLabel('unknown')).toBe('未知');
    });
  });

  describe('getBreakthroughResultLabel', () => {
    it('should return correct Chinese label for each result', () => {
      expect(getBreakthroughResultLabel('success')).toBe('成功');
      expect(getBreakthroughResultLabel('failure')).toBe('失败');
      expect(getBreakthroughResultLabel('partial')).toBe('部分成功');
      expect(getBreakthroughResultLabel('inconclusive')).toBe('未明');
      expect(getBreakthroughResultLabel('unknown')).toBe('未知');
    });
  });

  describe('getSeverityLabel', () => {
    it('should return correct Chinese label for each severity', () => {
      expect(getSeverityLabel('decisive')).toBe('决定性');
      expect(getSeverityLabel('significant')).toBe('重大');
      expect(getSeverityLabel('minor')).toBe('轻微');
      expect(getSeverityLabel('unknown')).toBe('未知');
      expect(getSeverityLabel(undefined)).toBe('未知');
    });
  });

  describe('hasBreakthroughData', () => {
    it('should return true when events have breakthrough data', () => {
      expect(hasBreakthroughData(mockEvents)).toBe(true);
    });

    it('should return false when no events have breakthrough data', () => {
      const eventsWithoutBreakthrough: Event[] = [
        {
          id: 'battle-no-breakthrough',
          entityId: 'period-warring-states',
          year: -300,
          titleKey: 'battle.simple',
          summaryKey: 'summary.simple',
          tags: ['war'],
          battle: {
            belligerents: { attacker: 'A', defender: 'B' },
            result: 'attacker_win',
          },
        },
      ];
      expect(hasBreakthroughData(eventsWithoutBreakthrough)).toBe(false);
    });
  });

  describe('getUniqueBreakthroughTypes', () => {
    it('should return all unique breakthrough types', () => {
      const types = getUniqueBreakthroughTypes(mockEvents);
      expect(types).toContain('encirclement-breakout');
      expect(types).toContain('pursuit-victory');
      expect(types).toContain('feigned-retreat');
      expect(types).toContain('ambush-breakout');
      expect(types).toContain('flanking-breakthrough');
      expect(types).toContain('frontal-breakthrough');
      expect(types).toContain('tactical-retreat');
      expect(types.length).toBeGreaterThanOrEqual(7);
    });
  });

  describe('getBattlesWithBreakthrough', () => {
    it('should return only battles with breakthrough data', () => {
      const battles = getBattlesWithBreakthrough(mockEvents);
      expect(battles.length).toBe(5);
      expect(battles.some(b => b.id === 'normal-event')).toBe(false);
    });
  });

  describe('getBreakthroughTypeStats', () => {
    it('should return correct stats for encirclement-breakout', () => {
      const stats = getBreakthroughTypeStats(mockEvents, 'encirclement-breakout');
      expect(stats.type).toBe('encirclement-breakout');
      expect(stats.label).toBe('突围/突围战');
      expect(stats.count).toBe(1);
      expect(stats.successCount).toBe(1);
      expect(stats.failureCount).toBe(0);
      expect(stats.successRate).toBe(100);
    });

    it('should return correct stats for feigned-retreat', () => {
      const stats = getBreakthroughTypeStats(mockEvents, 'feigned-retreat');
      expect(stats.count).toBe(1);
      expect(stats.successCount).toBe(1);
      expect(stats.failureCount).toBe(0);
    });

    it('should return correct stats for ambush-breakout', () => {
      const stats = getBreakthroughTypeStats(mockEvents, 'ambush-breakout');
      expect(stats.count).toBe(1);
      expect(stats.successCount).toBe(0);
      expect(stats.failureCount).toBe(1);
      expect(stats.successRate).toBe(0);
    });
  });

  describe('getAllBreakthroughTypeStats', () => {
    it('should return stats for all unique types', () => {
      const allStats = getAllBreakthroughTypeStats(mockEvents);
      expect(allStats.length).toBeGreaterThanOrEqual(7);
      expect(allStats.every(s => s.count > 0)).toBe(true);
    });
  });

  describe('getBreakthroughBySide', () => {
    it('should return stats grouped by side', () => {
      const sideStats = getBreakthroughBySide(mockEvents);
      expect(sideStats.length).toBeGreaterThanOrEqual(2);
      
      const attacker = sideStats.find(s => s.side === 'attacker');
      expect(attacker).toBeDefined();
      expect(attacker!.count).toBeGreaterThan(0);
    });
  });

  describe('getBreakthroughResultStats', () => {
    it('should return correct result distribution', () => {
      const resultStats = getBreakthroughResultStats(mockEvents);
      expect(resultStats.length).toBeGreaterThanOrEqual(2);
      
      const success = resultStats.find(s => s.result === 'success');
      expect(success).toBeDefined();
      expect(success!.count).toBeGreaterThan(0);
    });
  });

  describe('getDecisiveBreakthroughBattles', () => {
    it('should return battles with decisive breakthrough', () => {
      const decisive = getDecisiveBreakthroughBattles(mockEvents, 10);
      expect(decisive.length).toBeGreaterThanOrEqual(3);
      expect(decisive.every(b => b.battle?.breakthrough?.some(bp => bp.decisive === true))).toBe(true);
    });
  });

  describe('getMostBreakthroughBattles', () => {
    it('should return battles sorted by breakthrough count', () => {
      const sorted = getMostBreakthroughBattles(mockEvents, 10);
      expect(sorted[0].battle?.breakthrough?.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('getBattlesByBreakthroughType', () => {
    it('should filter battles by breakthrough type', () => {
      const battles = getBattlesByBreakthroughType(mockEvents, 'encirclement-breakout');
      expect(battles.length).toBe(1);
      expect(battles[0].id).toBe('battle-1');
    });
  });

  describe('getBreakthroughOutcomeCorrelation', () => {
    it('should return correlation data', () => {
      const correlations = getBreakthroughOutcomeCorrelation(mockEvents);
      expect(correlations.length).toBeGreaterThan(0);
    });
  });

  describe('getMostSuccessfulBreakthroughTypes', () => {
    it('should return types with highest success rate', () => {
      const successful = getMostSuccessfulBreakthroughTypes(mockEvents, 1);
      expect(successful.length).toBeGreaterThan(0);
      expect(successful[0].successRate).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getBreakthroughInsights', () => {
    it('should generate insights', () => {
      const insights = getBreakthroughInsights(mockEvents);
      expect(insights.length).toBeGreaterThan(0);
      expect(insights.every(i => typeof i === 'string')).toBe(true);
    });

    it('should return default message when no data', () => {
      const eventsWithoutData: Event[] = [
        {
          id: 'battle-no-data',
          entityId: 'period-warring-states',
          year: -300,
          titleKey: 'battle.simple',
          summaryKey: 'summary.simple',
          tags: ['war'],
          battle: {
            belligerents: { attacker: 'A', defender: 'B' },
            result: 'attacker_win',
          },
        },
      ];
      const insights = getBreakthroughInsights(eventsWithoutData);
      expect(insights).toContain('暂无突破/追击数据');
    });
  });

  describe('getBreakthroughSummary', () => {
    it('should return complete summary', () => {
      const summary = getBreakthroughSummary(mockEvents);
      
      expect(summary.totalBattlesWithBreakthrough).toBe(5);
      expect(summary.totalBreakthroughEvents).toBe(7);
      expect(summary.typeStats.length).toBeGreaterThan(0);
      expect(summary.sideStats.length).toBeGreaterThan(0);
      expect(summary.resultStats.length).toBeGreaterThan(0);
      expect(summary.decisiveBattles.length).toBeGreaterThan(0);
      expect(summary.insights.length).toBeGreaterThan(0);
    });
  });
});
