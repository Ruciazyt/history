/**
 * 战役规模分析测试
 */

import { describe, it, expect } from 'vitest';
import {
  getScaleName,
  getBattleScale,
  getBattlesWithScale,
  getUniqueScales,
  getScaleStats,
  getAllScalesStats,
  getScaleDistribution,
  getMostCommonScale,
  getScaleOutcomeCorrelation,
  getScaleTypeCorrelation,
  getScaleImpactCorrelation,
  hasScaleData,
  getScaleDistributionInsight,
  getScaleOutcomeInsight,
  getScaleTypeInsight,
  getScaleInsights,
} from './battleScale';
import { Event } from './types';

const mockBattles: Event[] = [
  {
    id: 'battle-1',
    entityId: 'era-1',
    year: -1000,
    titleKey: 'battle.1',
    summaryKey: 'battle.1.summary',
    battle: {
      scale: 'massive',
      result: 'attacker_win',
      battleType: 'founding',
      impact: 'decisive',
      belligerents: { attacker: 'A', defender: 'B' },
    },
  },
  {
    id: 'battle-2',
    entityId: 'era-1',
    year: -900,
    titleKey: 'battle.2',
    summaryKey: 'battle.2.summary',
    battle: {
      scale: 'large',
      result: 'defender_win',
      battleType: 'defense',
      impact: 'major',
      belligerents: { attacker: 'C', defender: 'D' },
    },
  },
  {
    id: 'battle-3',
    entityId: 'era-1',
    year: -800,
    titleKey: 'battle.3',
    summaryKey: 'battle.3.summary',
    battle: {
      scale: 'medium',
      result: 'attacker_win',
      battleType: 'conquest',
      impact: 'minor',
      belligerents: { attacker: 'E', defender: 'F' },
    },
  },
  {
    id: 'battle-4',
    entityId: 'era-1',
    year: -700,
    titleKey: 'battle.4',
    summaryKey: 'battle.4.summary',
    battle: {
      scale: 'small',
      result: 'draw',
      battleType: 'frontier',
      impact: 'minor',
      belligerents: { attacker: 'G', defender: 'H' },
    },
  },
  {
    id: 'battle-5',
    entityId: 'era-1',
    year: -600,
    titleKey: 'battle.5',
    summaryKey: 'battle.5.summary',
    battle: {
      scale: 'massive',
      result: 'attacker_win',
      battleType: 'founding',
      impact: 'decisive',
      belligerents: { attacker: 'I', defender: 'J' },
    },
  },
  {
    id: 'battle-6',
    entityId: 'era-1',
    year: -500,
    titleKey: 'battle.6',
    summaryKey: 'battle.6.summary',
    battle: {
      // 无规模数据
      result: 'defender_win',
      battleType: 'defense',
      impact: 'major',
      belligerents: { attacker: 'K', defender: 'L' },
    },
  },
  {
    id: 'battle-7',
    entityId: 'era-1',
    year: -400,
    titleKey: 'battle.7',
    summaryKey: 'battle.7.summary',
    battle: {
      scale: 'large',
      result: 'inconclusive',
      battleType: 'invasion',
      impact: 'unknown',
      belligerents: { attacker: 'M', defender: 'N' },
    },
  },
];

describe('battleScale', () => {
  describe('getScaleName', () => {
    it('should return correct scale names', () => {
      expect(getScaleName('massive')).toBe('超大规模');
      expect(getScaleName('large')).toBe('大规模');
      expect(getScaleName('medium')).toBe('中等规模');
      expect(getScaleName('small')).toBe('小规模');
      expect(getScaleName('unknown')).toBe('规模未知');
    });
  });

  describe('getBattleScale', () => {
    it('should return scale from battle', () => {
      expect(getBattleScale(mockBattles[0])).toBe('massive');
      expect(getBattleScale(mockBattles[1])).toBe('large');
      expect(getBattleScale(mockBattles[5])).toBe('unknown'); // 无scale字段
    });
  });

  describe('getBattlesWithScale', () => {
    it('should filter battles with scale data', () => {
      const result = getBattlesWithScale(mockBattles);
      expect(result.length).toBe(6);
    });
  });

  describe('getUniqueScales', () => {
    it('should return unique scales', () => {
      const scales = getUniqueScales(mockBattles);
      expect(scales).toContain('massive');
      expect(scales).toContain('large');
      expect(scales).toContain('medium');
      expect(scales).toContain('small');
      expect(scales).not.toContain('unknown');
    });
  });

  describe('getScaleStats', () => {
    it('should calculate stats for a scale', () => {
      const stats = getScaleStats(mockBattles, 'massive');
      expect(stats).not.toBeNull();
      expect(stats!.scale).toBe('massive');
      expect(stats!.total).toBe(2);
      expect(stats!.wins).toBe(2);
      expect(stats!.losses).toBe(0);
      expect(stats!.draws).toBe(0);
      expect(stats!.winRate).toBe(100);
    });

    it('should return null for unknown scale with no battles', () => {
      // 测试一个没有任何战役的规模
      const noBattleEvents: Event[] = [];
      const stats = getScaleStats(noBattleEvents, 'massive');
      expect(stats).toBeNull();
    });
  });

  describe('getAllScalesStats', () => {
    it('should return stats for all scales', () => {
      const stats = getAllScalesStats(mockBattles);
      expect(stats.length).toBe(4);
      expect(stats[0].scale).toBe('massive'); // 排序by total
    });
  });

  describe('getScaleDistribution', () => {
    it('should calculate distribution', () => {
      const dist = getScaleDistribution(mockBattles);
      expect(dist.length).toBe(4);
      expect(dist[0].scale).toBe('massive');
      expect(dist[0].count).toBe(2);
      expect(dist[0].percentage).toBeCloseTo(33.3, 1);
    });
  });

  describe('getMostCommonScale', () => {
    it('should return most common scale', () => {
      const mostCommon = getMostCommonScale(mockBattles);
      expect(mostCommon).not.toBeNull();
      expect(mostCommon!.scale).toBe('massive');
    });
  });

  describe('getScaleOutcomeCorrelation', () => {
    it('should calculate outcome correlation', () => {
      const correlation = getScaleOutcomeCorrelation(mockBattles);
      expect(correlation.length).toBeGreaterThan(0);
      
      const massiveCorr = correlation.find(c => c.scale === 'massive');
      expect(massiveCorr).not.toBeUndefined();
      expect(massiveCorr!.attackerWinRate).toBe(100);
    });
  });

  describe('getScaleTypeCorrelation', () => {
    it('should calculate type correlation', () => {
      const correlation = getScaleTypeCorrelation(mockBattles);
      expect(correlation.length).toBeGreaterThan(0);
    });
  });

  describe('getScaleImpactCorrelation', () => {
    it('should calculate impact correlation', () => {
      const correlation = getScaleImpactCorrelation(mockBattles);
      expect(correlation.length).toBeGreaterThan(0);
    });
  });

  describe('hasScaleData', () => {
    it('should return true when scale data exists', () => {
      expect(hasScaleData(mockBattles)).toBe(true);
    });

    it('should return false when no scale data', () => {
      const noScaleBattles: Event[] = [
        {
          id: 'battle-no-scale',
          entityId: 'era-1',
          year: -1000,
          titleKey: 'battle',
          summaryKey: 'battle.summary',
          battle: { result: 'attacker_win' },
        },
      ];
      expect(hasScaleData(noScaleBattles)).toBe(false);
    });
  });

  describe('getScaleDistributionInsight', () => {
    it('should generate distribution insight', () => {
      const insight = getScaleDistributionInsight(mockBattles);
      expect(insight).not.toBeNull();
      expect(insight!.type).toBe('scale_distribution');
      expect(insight!.title).toBe('战役规模分布');
    });
  });

  describe('getScaleOutcomeInsight', () => {
    it('should generate outcome insight', () => {
      const insight = getScaleOutcomeInsight(mockBattles);
      expect(insight).not.toBeNull();
      expect(insight!.type).toBe('scale_outcome');
    });
  });

  describe('getScaleInsights', () => {
    it('should generate all insights', () => {
      const insights = getScaleInsights(mockBattles);
      expect(insights.length).toBeGreaterThan(0);
    });
  });
});
