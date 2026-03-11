import { describe, it, expect } from 'vitest';
import {
  getOutcomeCorrelationAnalysis,
  getVictoryFactorInsights,
  getKeyVictoryFactorsSummary,
  compareFactors,
} from './outcomeCorrelation';
import type { Event } from './types';

describe('outcomeCorrelation', () => {
  const mockBattles: Event[] = [
    // Spring battles - attacker wins more
    {
      id: 'battle-spring-1',
      entityId: 'period-spring-autumn',
      year: -632,
      month: 3,
      titleKey: 'event.632.chengpu.title',
      summaryKey: 'event.632.chengpu.summary',
      tags: ['war'],
      location: { lon: 114.35, lat: 35.7, label: 'Chengpu' },
      battle: {
        belligerents: { attacker: 'Jin', defender: 'Chu' },
        result: 'attacker_win',
        battleType: 'civil-war',
        impact: 'decisive',
      },
    },
    {
      id: 'battle-spring-2',
      entityId: 'period-spring-autumn',
      year: -506,
      month: 4,
      titleKey: 'event.506.baiju.title',
      summaryKey: 'event.506.baiju.summary',
      tags: ['war'],
      location: { lon: 119.5, lat: 31.5, label: 'Baiju' },
      battle: {
        belligerents: { attacker: 'Wu', defender: 'Chu' },
        result: 'attacker_win',
        battleType: 'conquest',
        impact: 'decisive',
      },
    },
    // Autumn battle - defender wins
    {
      id: 'battle-autumn-1',
      entityId: 'period-warring-states',
      year: -260,
      month: 9,
      titleKey: 'event.260.changping.title',
      summaryKey: 'event.260.changping.summary',
      tags: ['war'],
      location: { lon: 113.4, lat: 35.9, label: 'Changping' },
      battle: {
        belligerents: { attacker: 'Qin', defender: 'Zhao' },
        result: 'attacker_win',
        battleType: 'conquest',
        impact: 'decisive',
      },
    },
    // Winter battle - defender wins
    {
      id: 'battle-winter-1',
      entityId: 'han',
      year: -200,
      month: 12,
      titleKey: 'event.200.gaixia.title',
      summaryKey: 'event.200.gaixia.summary',
      tags: ['war'],
      location: { lon: 118.8, lat: 32.1, label: 'Gaixia' },
      battle: {
        belligerents: { attacker: 'Liu Bang', defender: 'Xiang Yu' },
        result: 'defender_win',
        battleType: 'civil-war',
        impact: 'decisive',
      },
    },
    // Region-based battles (Central Plains)
    {
      id: 'battle-cp-1',
      entityId: 'period-warring-states',
      year: -270,
      month: 5,
      titleKey: 'event.270.yique.title',
      summaryKey: 'event.270.yique.summary',
      tags: ['war'],
      location: { lon: 113.0, lat: 34.5, label: 'Yique' },
      battle: {
        belligerents: { attacker: 'Qin', defender: 'Zhao' },
        result: 'attacker_win',
        battleType: 'conquest',
        impact: 'major',
      },
    },
    // Another Central Plains battle - defender wins
    {
      id: 'battle-cp-2',
      entityId: 'period-warring-states',
      year: -257,
      month: 7,
      titleKey: 'event.257.changping.title',
      summaryKey: 'event.257.changping.summary',
      tags: ['war'],
      location: { lon: 113.4, lat: 35.9, label: 'Changping' },
      battle: {
        belligerents: { attacker: 'Qin', defender: 'Zhao' },
        result: 'defender_win',
        battleType: 'defense',
        impact: 'major',
      },
    },
    // Jiangdong region
    {
      id: 'battle-jd-1',
      entityId: 'period-three-kingdoms',
      year: -208,
      month: 11,
      titleKey: 'event.208.redcliff.title',
      summaryKey: 'event.208.redcliff.summary',
      tags: ['war'],
      location: { lon: 113.0, lat: 30.0, label: 'Red Cliffs' },
      battle: {
        belligerents: { attacker: 'Cao Cao', defender: 'Sun-Liu' },
        result: 'defender_win',
        battleType: 'defense',
        impact: 'decisive',
      },
    },
    // Battle type: conquest - attacker wins
    {
      id: 'battle-conquest-1',
      entityId: 'qin',
      year: -230,
      month: 6,
      titleKey: 'event.230.yitan.title',
      summaryKey: 'event.230.yitan.summary',
      tags: ['war'],
      location: { lon: 117.2, lat: 32.9, label: 'Yitan' },
      battle: {
        belligerents: { attacker: 'Qin', defender: 'Zhao' },
        result: 'attacker_win',
        battleType: 'conquest',
        impact: 'major',
      },
    },
    // Battle type: defense - defender wins more
    {
      id: 'battle-defense-1',
      entityId: 'song',
      year: 1140,
      month: 8,
      titleKey: 'event.1140.triangle.title',
      summaryKey: 'event.1140.triangle.summary',
      tags: ['war'],
      location: { lon: 119.3, lat: 29.5, label: 'Huang Tian' },
      battle: {
        belligerents: { attacker: 'Jin', defender: 'Song' },
        result: 'defender_win',
        battleType: 'defense',
        impact: 'major',
      },
    },
    // Impact: decisive battles
    {
      id: 'battle-decisive-1',
      entityId: 'han',
      year: -202,
      month: 1,
      titleKey: 'event.202.gaixia.title',
      summaryKey: 'event.202.gaixia.summary',
      tags: ['war'],
      location: { lon: 118.8, lat: 32.1, label: 'Gaixia' },
      battle: {
        belligerents: { attacker: 'Liu Bang', defender: 'Xiang Yu' },
        result: 'attacker_win',
        battleType: 'civil-war',
        impact: 'decisive',
      },
    },
  ];

  describe('getOutcomeCorrelationAnalysis', () => {
    it('should return correlation analysis with factors', () => {
      const result = getOutcomeCorrelationAnalysis(mockBattles);

      expect(result).toBeDefined();
      expect(result.factors).toBeDefined();
      expect(Array.isArray(result.factors)).toBe(true);
      expect(result.overallAttackerWinRate).toBeGreaterThan(0);
      expect(result.overallDefenderWinRate).toBeGreaterThan(0);
    });

    it('should calculate overall attacker/defender win rates correctly', () => {
      const result = getOutcomeCorrelationAnalysis(mockBattles);

      // In mock data: attacker wins 6, defender wins 4
      const total = result.overallAttackerWinRate + result.overallDefenderWinRate;
      expect(total).toBeCloseTo(100, 0);
    });

    it('should identify strongest attacker and defender factors', () => {
      const result = getOutcomeCorrelationAnalysis(mockBattles);

      if (result.strongestAttackerFactor) {
        expect(result.strongestAttackerFactor.correlation).toBe('attacker');
      }
      if (result.strongestDefenderFactor) {
        expect(result.strongestDefenderFactor.correlation).toBe('defender');
      }
    });

    it('should return empty factors for empty battles', () => {
      const result = getOutcomeCorrelationAnalysis([]);

      expect(result.factors).toHaveLength(0);
      expect(result.strongestAttackerFactor).toBeNull();
      expect(result.strongestDefenderFactor).toBeNull();
    });
  });

  describe('getVictoryFactorInsights', () => {
    it('should generate insights from correlation analysis', () => {
      const insights = getVictoryFactorInsights(mockBattles);

      expect(insights).toBeDefined();
      expect(Array.isArray(insights)).toBe(true);
    });

    it('should include confidence level for each insight', () => {
      const insights = getVictoryFactorInsights(mockBattles);

      for (const insight of insights) {
        expect(['high', 'medium', 'low']).toContain(insight.confidence);
      }
    });

    it('should include correlation type for each insight', () => {
      const insights = getVictoryFactorInsights(mockBattles);

      for (const insight of insights) {
        expect(['attacker', 'defender', 'neutral']).toContain(insight.correlation);
      }
    });

    it('should return empty for empty battles', () => {
      const insights = getVictoryFactorInsights([]);

      expect(insights).toHaveLength(0);
    });
  });

  describe('getKeyVictoryFactorsSummary', () => {
    it('should return summary array', () => {
      const summary = getKeyVictoryFactorsSummary(mockBattles);

      expect(summary).toBeDefined();
      expect(Array.isArray(summary)).toBe(true);
    });

    it('should return non-empty summary for valid battles', () => {
      const summary = getKeyVictoryFactorsSummary(mockBattles);

      expect(summary.length).toBeGreaterThan(0);
    });

    it('should return empty array for empty battles', () => {
      const summary = getKeyVictoryFactorsSummary([]);

      expect(summary).toHaveLength(0);
    });
  });

  describe('compareFactors', () => {
    it('should compare two season factors', () => {
      const result = compareFactors(
        mockBattles,
        'season',
        '春季',
        'season',
        '秋季'
      );

      expect(result).toBeDefined();
      expect(result.comparison).toBeDefined();
    });

    it('should handle missing factors gracefully', () => {
      const result = compareFactors(
        mockBattles,
        'season',
        '春季',
        'season',
        '不存在的季节'
      );

      expect(result.comparison).toContain('未找到');
    });

    it('should compare different factor types', () => {
      const result = compareFactors(
        mockBattles,
        'season',
        '春季',
        'region',
        '中原'
      );

      expect(result).toBeDefined();
    });
  });

  describe('Correlation Factor Structure', () => {
    it('should have valid factor structure', () => {
      const result = getOutcomeCorrelationAnalysis(mockBattles);

      for (const factor of result.factors) {
        expect(factor).toHaveProperty('factor');
        expect(factor).toHaveProperty('factorType');
        expect(['season', 'region', 'type', 'impact']).toContain(factor.factorType);
        expect(factor).toHaveProperty('total');
        expect(factor).toHaveProperty('attackerWinRate');
        expect(factor).toHaveProperty('defenderWinRate');
        expect(factor).toHaveProperty('correlation');
        expect(factor).toHaveProperty('strength');
      }
    });

    it('should have valid correlation values', () => {
      const result = getOutcomeCorrelationAnalysis(mockBattles);

      for (const factor of result.factors) {
        expect(['attacker', 'defender', 'neutral']).toContain(factor.correlation);
        expect(['strong', 'moderate', 'weak']).toContain(factor.strength);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle battles without month data', () => {
      const battlesWithoutMonth: Event[] = [
        {
          id: 'battle-no-month',
          entityId: 'han',
          year: -200,
          titleKey: 'event.test.title',
          summaryKey: 'event.test.summary',
          tags: ['war'],
          location: { lon: 114.0, lat: 35.0, label: 'Test' },
          battle: {
            belligerents: { attacker: 'A', defender: 'B' },
            result: 'attacker_win',
          },
        },
      ];

      const result = getOutcomeCorrelationAnalysis(battlesWithoutMonth);
      expect(result).toBeDefined();
    });

    it('should handle battles without location data', () => {
      const battlesWithoutLocation: Event[] = [
        {
          id: 'battle-no-loc',
          entityId: 'han',
          year: -200,
          titleKey: 'event.test.title',
          summaryKey: 'event.test.summary',
          tags: ['war'],
          battle: {
            belligerents: { attacker: 'A', defender: 'B' },
            result: 'attacker_win',
          },
        },
      ];

      const result = getOutcomeCorrelationAnalysis(battlesWithoutLocation);
      expect(result).toBeDefined();
    });

    it('should handle battles without battle type', () => {
      const battlesWithoutType: Event[] = [
        {
          id: 'battle-no-type',
          entityId: 'han',
          year: -200,
          titleKey: 'event.test.title',
          summaryKey: 'event.test.summary',
          tags: ['war'],
          location: { lon: 114.0, lat: 35.0, label: 'Test' },
          battle: {
            belligerents: { attacker: 'A', defender: 'B' },
            result: 'attacker_win',
          },
        },
      ];

      const result = getOutcomeCorrelationAnalysis(battlesWithoutType);
      expect(result).toBeDefined();
    });
  });
});
