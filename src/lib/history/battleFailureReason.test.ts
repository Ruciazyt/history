import { describe, it, expect } from 'vitest';
import {
  getFailureReasonLabel,
  getFailureSeverityLabel,
  getFailureSideLabel,
  hasFailureReasonData,
  getBattlesWithFailureReasonData,
  extractFailureReasons,
  getFailureReasonTypeStats,
  getAllFailureReasonTypeStats,
  getFailureBySideStats,
  getMostCommonFailureReasons,
  getMostCriticalFailureReasons,
  getBattlesWithMostFailureReasons,
  getFailureReasonOutcomeCorrelation,
  getFailureReasonInsights,
  getFailureReasonSummary
} from './battleFailureReason';
import type { Event } from './types';

// 测试数据
const mockEvents: Event[] = [
  {
    id: 'battle-1',
    entityId: 'spring-autumn',
    year: -260,
    titleKey: '长平之战',
    summaryKey: 'summary',
    tags: ['war'],
    battle: {
      result: 'attacker_win',
      turningPoints: [
        {
          type: 'commander-death',
          description: '赵括率军突围时被秦军射杀',
          party: 'defender',
          impact: 'negative'
        },
        {
          type: 'flank-collapse',
          description: '秦军两面夹击，赵军侧翼崩溃',
          party: 'defender',
          impact: 'negative'
        },
        {
          type: 'supply-disruption',
          description: '赵军断粮四十六天',
          party: 'defender',
          impact: 'negative'
        }
      ],
      intelligence: [
        {
          type: 'deception',
          description: '秦军秘密换将，引诱赵括出击',
          side: 'attacker',
          result: 'success',
          benefit: 'attacker'
        }
      ],
      surrender: [
        {
          type: 'mass-surrender',
          description: '四十五万赵军投降后被秦军坑杀',
          side: 'defender',
          severity: 'massive',
          impact: 'decisive'
        }
      ],
      commandersLoss: [
        {
          name: '赵括',
          type: 'killed-in-action',
          side: 'defender',
          severity: 'critical',
          isKeyCommander: true,
          phase: '突围阶段'
        }
      ],
      weather: ['hot']
    }
  },
  {
    id: 'battle-2',
    entityId: 'warring-states',
    year: -341,
    titleKey: '马陵之战',
    summaryKey: 'summary',
    tags: ['war'],
    battle: {
      result: 'attacker_win',
      turningPoints: [
        {
          type: 'ambush-triggered',
          description: '齐军伏击触发，魏军大乱',
          party: 'defender',
          impact: 'negative'
        },
        {
          type: 'commander-death',
          description: '庞涓自杀身亡',
          party: 'defender',
          impact: 'negative'
        }
      ],
      intelligence: [
        {
          type: 'reconnaissance',
          description: '齐军侦察魏军动向',
          side: 'attacker',
          result: 'success'
        }
      ]
    }
  },
  {
    id: 'battle-3',
    entityId: 'warring-states',
    year: -632,
    titleKey: '城濮之战',
    summaryKey: 'summary',
    tags: ['war'],
    battle: {
      result: 'attacker_win',
      turningPoints: [
        {
          type: 'flank-collapse',
          description: '楚军右翼被击溃',
          party: 'defender',
          impact: 'negative'
        },
        {
          type: 'strategic-mistake',
          description: '楚军轻敌冒进，中了诱敌深入之计',
          party: 'defender',
          impact: 'negative'
        }
      ],
      moraleFactors: [
        {
          type: 'morale-crisis',
          description: '楚军得知后退，士气大跌',
          side: 'defender',
          impact: 'negative',
          severity: 'major'
        }
      ]
    }
  },
  {
    id: 'battle-4',
    entityId: 'warring-states',
    year: -506,
    titleKey: '柏举之战',
    summaryKey: 'summary',
    tags: ['war'],
    battle: {
      result: 'attacker_win',
      turningPoints: [
        {
          type: 'defection',
          description: '楚将父子倒戈',
          party: 'defender',
          impact: 'negative'
        }
      ],
      intelligence: [
        {
          type: 'espionage',
          description: '吴军使用反间计',
          side: 'attacker',
          result: 'success',
          benefit: 'attacker'
        }
      ]
    }
  },
  {
    id: 'battle-5',
    entityId: 'shang',
    year: -1046,
    titleKey: '牧野之战',
    summaryKey: 'summary',
    tags: ['war'],
    battle: {
      result: 'attacker_win',
      forceComparison: {
        attacker: { strength: 450000 },
        defender: { strength: 700000 },
        advantage: 'defender',
        difference: '防守方军力更强'
      }
    }
  }
];

describe('battleFailureReason', () => {
  describe('getFailureReasonLabel', () => {
    it('should return correct label for each reason type', () => {
      expect(getFailureReasonLabel('strategic-mistake')).toBe('战略失误');
      expect(getFailureReasonLabel('tactical-error')).toBe('战术错误');
      expect(getFailureReasonLabel('command-confusion')).toBe('指挥混乱');
      expect(getFailureReasonLabel('morale-collapse')).toBe('士气崩溃');
      expect(getFailureReasonLabel('supply-shortage')).toBe('补给不足');
      expect(getFailureReasonLabel('unknown')).toBe('未知');
    });

    it('should return 未知 for unknown type', () => {
      expect(getFailureReasonLabel('invalid' as any)).toBe('未知');
    });
  });

  describe('getFailureSeverityLabel', () => {
    it('should return correct label for each severity', () => {
      expect(getFailureSeverityLabel('critical')).toBe('致命');
      expect(getFailureSeverityLabel('major')).toBe('重大');
      expect(getFailureSeverityLabel('minor')).toBe('轻微');
      expect(getFailureSeverityLabel('unknown')).toBe('未知');
    });
  });

  describe('getFailureSideLabel', () => {
    it('should return correct label for each side', () => {
      expect(getFailureSideLabel('attacker')).toBe('进攻方');
      expect(getFailureSideLabel('defender')).toBe('防守方');
      expect(getFailureSideLabel('both')).toBe('双方');
      expect(getFailureSideLabel('unknown')).toBe('未知');
    });
  });

  describe('hasFailureReasonData', () => {
    it('should return true when there is failure reason data', () => {
      expect(hasFailureReasonData(mockEvents)).toBe(true);
    });

    it('should return false for empty events', () => {
      expect(hasFailureReasonData([])).toBe(false);
    });
  });

  describe('getBattlesWithFailureReasonData', () => {
    it('should return battles with failure reason data', () => {
      const battles = getBattlesWithFailureReasonData(mockEvents);
      expect(battles.length).toBeGreaterThan(0);
    });
  });

  describe('extractFailureReasons', () => {
    it('should extract failure reasons from turning points', () => {
      const reasonsMap = extractFailureReasons(mockEvents);
      
      // 长平之战应该有多个失败原因
      const battle1Reasons = reasonsMap.get('battle-1');
      expect(battle1Reasons).toBeDefined();
      expect(battle1Reasons!.length).toBeGreaterThan(0);
    });

    it('should extract commander death reasons', () => {
      const reasonsMap = extractFailureReasons(mockEvents);
      const battle1Reasons = reasonsMap.get('battle-1');
      
      const hasCommanderDeath = battle1Reasons?.some(r => r.type === 'command-confusion');
      expect(hasCommanderDeath).toBe(true);
    });

    it('should extract morale collapse reasons', () => {
      const reasonsMap = extractFailureReasons(mockEvents);
      
      // 城濮之战应该有机失败原因
      const battle3Reasons = reasonsMap.get('battle-3');
      expect(battle3Reasons).toBeDefined();
    });

    it('should extract defection reasons', () => {
      const reasonsMap = extractFailureReasons(mockEvents);
      
      // 柏举之战应该有倒戈
      const battle4Reasons = reasonsMap.get('battle-4');
      const hasDefection = battle4Reasons?.some(r => r.type === 'defection');
      expect(hasDefection).toBe(true);
    });
  });

  describe('getFailureReasonTypeStats', () => {
    it('should get stats for specific reason type', () => {
      const stats = getFailureReasonTypeStats(mockEvents, 'command-confusion');
      expect(stats.count).toBeGreaterThanOrEqual(0);
    });

    it('should return zero for non-existent type', () => {
      const stats = getFailureReasonTypeStats(mockEvents, 'terrain-disadvantage');
      expect(stats.count).toBe(0);
    });
  });

  describe('getAllFailureReasonTypeStats', () => {
    it('should return all reason type stats sorted by count', () => {
      const stats = getAllFailureReasonTypeStats(mockEvents);
      expect(Array.isArray(stats)).toBe(true);
      
      // 应该按count降序排列
      for (let i = 1; i < stats.length; i++) {
        expect(stats[i - 1].count).toBeGreaterThanOrEqual(stats[i].count);
      }
    });

    it('should include label for each type', () => {
      const stats = getAllFailureReasonTypeStats(mockEvents);
      stats.forEach(s => {
        expect(s.label).toBeDefined();
        expect(s.label.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getFailureBySideStats', () => {
    it('should return stats by side', () => {
      const stats = getFailureBySideStats(mockEvents);
      expect(stats.length).toBeGreaterThan(0);
      
      // 由于测试数据都是 attacker_win，失败原因主要是 defender
      const defenderStats = stats.find(s => s.side === 'defender');
      
      expect(defenderStats).toBeDefined();
    });
  });

  describe('getMostCommonFailureReasons', () => {
    it('should return top N most common reasons', () => {
      const reasons = getMostCommonFailureReasons(mockEvents, 3);
      expect(reasons.length).toBeLessThanOrEqual(3);
    });

    it('should include type and label', () => {
      const reasons = getMostCommonFailureReasons(mockEvents, 1);
      if (reasons.length > 0) {
        expect(reasons[0].type).toBeDefined();
        expect(reasons[0].label).toBeDefined();
        expect(reasons[0].count).toBeGreaterThan(0);
      }
    });
  });

  describe('getMostCriticalFailureReasons', () => {
    it('should return most critical reasons', () => {
      const reasons = getMostCriticalFailureReasons(mockEvents, 5);
      expect(Array.isArray(reasons)).toBe(true);
    });
  });

  describe('getBattlesWithMostFailureReasons', () => {
    it('should return battles with most failure reasons', () => {
      const battles = getBattlesWithMostFailureReasons(mockEvents, 3);
      expect(Array.isArray(battles)).toBe(true);
      
      battles.forEach(b => {
        expect(b.battle).toBeDefined();
        expect(b.reasonCount).toBeGreaterThan(0);
      });
    });

    it('should be sorted by reason count descending', () => {
      const battles = getBattlesWithMostFailureReasons(mockEvents, 5);
      for (let i = 1; i < battles.length; i++) {
        expect(battles[i - 1].reasonCount).toBeGreaterThanOrEqual(battles[i].reasonCount);
      }
    });
  });

  describe('getFailureReasonOutcomeCorrelation', () => {
    it('should return correlation data', () => {
      const correlation = getFailureReasonOutcomeCorrelation(mockEvents);
      expect(Array.isArray(correlation)).toBe(true);
    });
  });

  describe('getFailureReasonInsights', () => {
    it('should generate insights', () => {
      const insights = getFailureReasonInsights(mockEvents);
      expect(Array.isArray(insights)).toBe(true);
      expect(insights.length).toBeGreaterThan(0);
    });

    it('should mention most common reason', () => {
      const insights = getFailureReasonInsights(mockEvents);
      const hasReasonInsight = insights.some(i => i.includes('原因') || i.includes('失败'));
      expect(hasReasonInsight).toBe(true);
    });

    it('should handle empty events', () => {
      const insights = getFailureReasonInsights([]);
      expect(insights).toContain('暂无失败原因分析数据');
    });
  });

  describe('getFailureReasonSummary', () => {
    it('should return complete summary', () => {
      const summary = getFailureReasonSummary(mockEvents);
      
      expect(summary.overview).toBeDefined();
      expect(summary.overview.totalBattles).toBeDefined();
      expect(summary.overview.battlesWithFailureAnalysis).toBeDefined();
      expect(summary.overview.totalReasons).toBeDefined();
      
      expect(Array.isArray(summary.reasonTypeStats)).toBe(true);
      expect(Array.isArray(summary.sideStats)).toBe(true);
      expect(Array.isArray(summary.mostCommonReasons)).toBe(true);
      expect(Array.isArray(summary.mostCriticalReasons)).toBe(true);
      expect(Array.isArray(summary.battlesWithMostReasons)).toBe(true);
      expect(Array.isArray(summary.correlation)).toBe(true);
      expect(Array.isArray(summary.insights)).toBe(true);
    });

    it('should have valid overview counts', () => {
      const summary = getFailureReasonSummary(mockEvents);
      
      expect(summary.overview.totalBattles).toBe(mockEvents.length);
      expect(summary.overview.battlesWithFailureAnalysis).toBeGreaterThan(0);
      expect(summary.overview.totalReasons).toBeGreaterThan(0);
    });
  });
});
