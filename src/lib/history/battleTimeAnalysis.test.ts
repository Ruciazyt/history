/**
 * 战役时间分布分析测试
 */

import { describe, it, expect } from 'vitest';
import {
  getBattleCentury,
  getCenturyLabel,
  getBattleEraGroup,
  getEraGroupLabel,
  getCenturyDistribution,
  getEraDistribution,
  getPeakPeriods,
  getEraTypeCorrelation,
  getTimeDistributionInsights,
  getTimeDistributionSummary,
  type CenturyDistribution,
  type EraDistribution,
  type PeakPeriod,
  type TimeInsight,
} from './battleTimeAnalysis';
import { Event } from './types';

const mockBattles: Event[] = [
  {
    id: 'battle-1',
    entityId: 'wz-western-zhou',
    year: -1046,
    titleKey: 'battle.1',
    summaryKey: 'summary.1',
    battle: {
      belligerents: { attacker: '周', defender: '商' },
      result: 'attacker_win',
      battleType: 'founding',
    },
  },
  {
    id: 'battle-2',
    entityId: 'period-spring-autumn',
    year: -632,
    titleKey: 'battle.2',
    summaryKey: 'summary.2',
    battle: {
      belligerents: { attacker: '晋', defender: '楚' },
      result: 'attacker_win',
      battleType: 'defense',
    },
  },
  {
    id: 'battle-3',
    entityId: 'period-warring-states',
    year: -260,
    titleKey: 'battle.3',
    summaryKey: 'summary.3',
    battle: {
      belligerents: { attacker: '秦', defender: '赵' },
      result: 'attacker_win',
      battleType: 'conquest',
    },
  },
  {
    id: 'battle-4',
    entityId: 'imperial',
    year: -207,
    titleKey: 'battle.4',
    summaryKey: 'summary.4',
    battle: {
      belligerents: { attacker: '刘邦', defender: '项羽' },
      result: 'attacker_win',
      battleType: 'civil-war',
    },
  },
  {
    id: 'battle-5',
    entityId: 'imperial',
    year: 200,
    titleKey: 'battle.5',
    summaryKey: 'summary.5',
    battle: {
      belligerents: { attacker: '曹操', defender: '袁绍' },
      result: 'attacker_win',
      battleType: 'civil-war',
    },
  },
  {
    id: 'battle-6',
    entityId: 'medieval',
    year: 383,
    titleKey: 'battle.6',
    summaryKey: 'summary.6',
    battle: {
      belligerents: { attacker: '晋', defender: '秦' },
      result: 'defender_win',
      battleType: 'defense',
    },
  },
  {
    id: 'battle-7',
    entityId: 'early-modern',
    year: 1200,
    titleKey: 'battle.7',
    summaryKey: 'summary.7',
    battle: {
      belligerents: { attacker: '蒙古', defender: '金' },
      result: 'attacker_win',
      battleType: 'invasion',
    },
  },
  {
    id: 'battle-8',
    entityId: 'modern',
    year: 1644,
    titleKey: 'battle.8',
    summaryKey: 'summary.8',
    battle: {
      belligerents: { attacker: '清', defender: '明' },
      result: 'attacker_win',
      battleType: 'conquest',
    },
  },
];

describe('battleTimeAnalysis', () => {
  describe('getBattleCentury', () => {
    it('should return correct century for BCE years', () => {
      expect(getBattleCentury({ ...mockBattles[0], year: -1046 })).toBe(-11);
      expect(getBattleCentury({ ...mockBattles[0], year: -100 })).toBe(-1);
      expect(getBattleCentury({ ...mockBattles[0], year: -200 })).toBe(-2);
    });

    it('should return correct century for CE years', () => {
      expect(getBattleCentury({ ...mockBattles[4], year: 200 })).toBe(2);
      expect(getBattleCentury({ ...mockBattles[6], year: 1200 })).toBe(12);
      expect(getBattleCentury({ ...mockBattles[7], year: 1644 })).toBe(17);
    });
  });

  describe('getCenturyLabel', () => {
    it('should return correct labels for BCE centuries', () => {
      expect(getCenturyLabel(-11)).toBe('公元前11世纪');
      expect(getCenturyLabel(-3)).toBe('公元前3世纪');
      expect(getCenturyLabel(-1)).toBe('公元前1世纪');
    });

    it('should return correct labels for CE centuries', () => {
      expect(getCenturyLabel(2)).toBe('公元2世纪');
      expect(getCenturyLabel(12)).toBe('公元12世纪');
      expect(getCenturyLabel(17)).toBe('公元17世纪');
    });

    it('should return unknown for invalid century', () => {
      expect(getCenturyLabel(0)).toBe('未知');
    });
  });

  describe('getBattleEraGroup', () => {
    it('should classify ancient era correctly', () => {
      expect(getBattleEraGroup({ ...mockBattles[0], year: -1000 })).toBe('ancient');
      expect(getBattleEraGroup({ ...mockBattles[0], year: -800 })).toBe('ancient');
    });

    it('should classify spring-autumn era correctly', () => {
      expect(getBattleEraGroup({ ...mockBattles[1], year: -770 })).toBe('spring-autumn');
      expect(getBattleEraGroup({ ...mockBattles[1], year: -500 })).toBe('spring-autumn');
    });

    it('should classify warring-states era correctly', () => {
      expect(getBattleEraGroup({ ...mockBattles[2], year: -476 })).toBe('warring-states');
      expect(getBattleEraGroup({ ...mockBattles[2], year: -300 })).toBe('warring-states');
    });

    it('should classify imperial era correctly', () => {
      expect(getBattleEraGroup({ ...mockBattles[3], year: -221 })).toBe('imperial');
      expect(getBattleEraGroup({ ...mockBattles[4], year: 100 })).toBe('imperial');
    });

    it('should classify medieval era correctly', () => {
      const medievalBattle = { ...mockBattles[0], year: 300 };
      expect(getBattleEraGroup(medievalBattle)).toBe('medieval');
    });

    it('should classify early-modern era correctly', () => {
      const earlyModernBattle = { ...mockBattles[0], year: 600 };
      expect(getBattleEraGroup(earlyModernBattle)).toBe('early-modern');
    });

    it('should classify modern era correctly', () => {
      expect(getBattleEraGroup({ ...mockBattles[7], year: 1400 })).toBe('modern');
      expect(getBattleEraGroup({ ...mockBattles[7], year: 1644 })).toBe('modern');
    });
  });

  describe('getEraGroupLabel', () => {
    it('should return correct labels', () => {
      expect(getEraGroupLabel('ancient')).toBe('上古时期');
      expect(getEraGroupLabel('spring-autumn')).toBe('春秋时期');
      expect(getEraGroupLabel('warring-states')).toBe('战国时期');
      expect(getEraGroupLabel('imperial')).toBe('秦汉帝国时期');
      expect(getEraGroupLabel('medieval')).toBe('魏晋南北朝');
      expect(getEraGroupLabel('early-modern')).toBe('隋唐宋元');
      expect(getEraGroupLabel('modern')).toBe('明清时期');
    });
  });

  describe('getCenturyDistribution', () => {
    it('should return correct distribution', () => {
      const dist = getCenturyDistribution(mockBattles);
      expect(dist.length).toBeGreaterThan(0);
      expect(dist[0].count).toBeGreaterThan(0);
      expect(dist[0].percentage).toBeGreaterThan(0);
    });

    it('should calculate percentages correctly', () => {
      const dist = getCenturyDistribution(mockBattles);
      const total = dist.reduce((sum, d) => sum + d.count, 0);
      expect(total).toBe(8);
    });

    it('should track attacker/defender wins', () => {
      const dist = getCenturyDistribution(mockBattles);
      const century11 = dist.find(d => d.century === -11);
      expect(century11?.attackerWins).toBe(1);
    });
  });

  describe('getEraDistribution', () => {
    it('should return correct distribution', () => {
      const dist = getEraDistribution(mockBattles);
      expect(dist.length).toBeGreaterThan(0);
    });

    it('should have correct labels', () => {
      const dist = getEraDistribution(mockBattles);
      dist.forEach(d => {
        expect(d.label).toBeTruthy();
      });
    });
  });

  describe('getPeakPeriods', () => {
    it('should return peak periods sorted by count', () => {
      const peaks = getPeakPeriods(mockBattles, 3);
      expect(peaks.length).toBeLessThanOrEqual(3);
      if (peaks.length > 1) {
        expect(peaks[0].count).toBeGreaterThanOrEqual(peaks[1].count);
      }
    });

    it('should have correct descriptions', () => {
      const peaks = getPeakPeriods(mockBattles);
      peaks.forEach(p => {
        expect(p.description).toBeTruthy();
      });
    });
  });

  describe('getEraTypeCorrelation', () => {
    it('should return correlation data', () => {
      const corr = getEraTypeCorrelation(mockBattles);
      expect(corr.length).toBeGreaterThan(0);
    });

    it('should have era and battleType', () => {
      const corr = getEraTypeCorrelation(mockBattles);
      corr.forEach(c => {
        expect(c.era).toBeTruthy();
        expect(c.battleType).toBeTruthy();
        expect(c.count).toBeGreaterThan(0);
      });
    });
  });

  describe('getTimeDistributionInsights', () => {
    it('should return insights array', () => {
      const insights = getTimeDistributionInsights(mockBattles);
      expect(Array.isArray(insights)).toBe(true);
    });

    it('should have valid insight structure', () => {
      const insights = getTimeDistributionInsights(mockBattles);
      insights.forEach(insight => {
        expect(insight.type).toBeTruthy();
        expect(insight.title).toBeTruthy();
        expect(insight.description).toBeTruthy();
      });
    });
  });

  describe('getTimeDistributionSummary', () => {
    it('should return complete summary', () => {
      const summary = getTimeDistributionSummary(mockBattles);
      
      expect(summary.totalBattles).toBe(8);
      expect(summary.centuryDistribution).toBeDefined();
      expect(summary.eraDistribution).toBeDefined();
      expect(summary.peakPeriods).toBeDefined();
      expect(summary.insights).toBeDefined();
    });

    it('should have correct total count', () => {
      const summary = getTimeDistributionSummary(mockBattles);
      expect(summary.totalBattles).toBe(mockBattles.length);
    });
  });
});
