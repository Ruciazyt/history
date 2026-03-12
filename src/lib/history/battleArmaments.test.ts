import { describe, it, expect } from 'vitest';
import {
  getArmamentTypeLabel,
  getUniqueArmamentTypes,
  hasArmamentData,
  getArmamentTypeStats,
  getAllArmamentTypeStats,
  getBattlesByArmamentType,
  getMostCommonArmamentTypes,
  getArmamentOutcomeCorrelation,
  getArmamentSideAnalysis,
  getArmamentStrategyCorrelation,
  getArmamentInsights,
  getArmamentSummary,
} from './battleArmaments';
import { Event } from './types';

const mockEvents: Event[] = [
  {
    id: '1',
    entityId: 'spring-autumn',
    year: -632,
    titleKey: 'battle.chengpu',
    summaryKey: 'summary.chengpu',
    battle: {
      result: 'attacker_win',
      armaments: [
        { type: 'chariot', side: 'attacker', isPrimary: true, count: 700 },
        { type: 'infantry', side: 'attacker', count: 2000 },
        { type: 'cavalry', side: 'attacker', count: 500 },
        { type: 'spear', side: 'both', count: 3000 },
        { type: 'shield', side: 'both' },
      ],
      strategy: ['defensive', 'alliance'],
    },
  },
  {
    id: '2',
    entityId: 'warring-states',
    year: -260,
    titleKey: 'battle.changping',
    summaryKey: 'summary.changping',
    battle: {
      result: 'attacker_win',
      armaments: [
        { type: 'cavalry', side: 'attacker', isPrimary: true, count: 10000 },
        { type: 'infantry', side: 'attacker', count: 50000 },
        { type: 'spear', side: 'attacker', count: 60000 },
        { type: 'bow', side: 'attacker', count: 20000 },
        { type: 'sword', side: 'defender', count: 10000 },
        { type: 'halberd', side: 'defender', count: 30000 },
      ],
      strategy: ['encirclement', 'offensive'],
    },
  },
  {
    id: '3',
    entityId: 'warring-states',
    year: -341,
    titleKey: 'battle.maling',
    summaryKey: 'summary.maling',
    battle: {
      result: 'attacker_win',
      armaments: [
        { type: 'chariot', side: 'attacker', isPrimary: true, count: 500 },
        { type: 'infantry', side: 'attacker', count: 8000 },
        { type: 'cavalry', side: 'attacker', count: 300 },
        { type: 'spear', side: 'both', count: 10000 },
        { type: 'bow', side: 'attacker', count: 2000 },
        { type: 'dagger-axe', side: 'defender' },
      ],
      strategy: ['ambush', 'feigned-retreat'],
    },
  },
  {
    id: '4',
    entityId: 'warring-states',
    year: -506,
    titleKey: 'battle.boju',
    summaryKey: 'summary.boju',
    battle: {
      result: 'attacker_win',
      armaments: [
        { type: 'chariot', side: 'attacker', count: 3000 },
        { type: 'cavalry', side: 'attacker', isPrimary: true, count: 6000 },
        { type: 'infantry', side: 'attacker', count: 30000 },
        { type: 'spear', side: 'attacker', count: 35000 },
        { type: 'halberd', side: 'defender', count: 20000 },
        { type: 'shield', side: 'defender' },
      ],
      strategy: ['offensive', 'pincer'],
    },
  },
  {
    id: '5',
    entityId: 'shang',
    year: -1046,
    titleKey: 'battle.muye',
    summaryKey: 'summary.muye',
    battle: {
      result: 'attacker_win',
      armaments: [
        { type: 'chariot', side: 'attacker', isPrimary: true, count: 300 },
        { type: 'infantry', side: 'attacker', count: 45000 },
        { type: 'sword', side: 'attacker', count: 10000 },
        { type: 'spear', side: 'attacker', count: 20000 },
        { type: 'dagger-axe', side: 'defender', count: 15000 },
      ],
      strategy: ['ambush', 'offensive'],
    },
  },
  {
    id: '6',
    entityId: 'warring-states',
    year: -257,
    titleKey: 'battle.yique',
    summaryKey: 'summary.yique',
    battle: {
      result: 'attacker_win',
      armaments: [
        { type: 'cavalry', side: 'attacker', isPrimary: true, count: 5000 },
        { type: 'infantry', side: 'attacker', count: 40000 },
        { type: 'chariot', side: 'attacker', count: 800 },
        { type: 'crossbow', side: 'attacker', count: 10000 },
      ],
    },
  },
];

describe('battleArmaments', () => {
  describe('getArmamentTypeLabel', () => {
    it('should return correct Chinese labels', () => {
      expect(getArmamentTypeLabel('sword')).toBe('剑');
      expect(getArmamentTypeLabel('spear')).toBe('矛/枪');
      expect(getArmamentTypeLabel('dagger-axe')).toBe('戈');
      expect(getArmamentTypeLabel('halberd')).toBe('戟');
      expect(getArmamentTypeLabel('bow')).toBe('弓');
      expect(getArmamentTypeLabel('crossbow')).toBe('弩');
      expect(getArmamentTypeLabel('chariot')).toBe('战车');
      expect(getArmamentTypeLabel('cavalry')).toBe('骑兵');
      expect(getArmamentTypeLabel('infantry')).toBe('步兵');
      expect(getArmamentTypeLabel('navy')).toBe('水军');
      expect(getArmamentTypeLabel('unknown')).toBe('未知');
    });
  });

  describe('getUniqueArmamentTypes', () => {
    it('should return all unique armament types', () => {
      const types = getUniqueArmamentTypes(mockEvents);
      expect(types).toContain('chariot');
      expect(types).toContain('cavalry');
      expect(types).toContain('infantry');
      expect(types).toContain('spear');
      expect(types).toContain('bow');
      expect(types).toContain('sword');
      expect(types).toContain('halberd');
      expect(types).toContain('dagger-axe');
      expect(types).toContain('shield');
      expect(types).toContain('crossbow');
    });

    it('should return empty array for events without armaments', () => {
      const events: Event[] = [
        { id: '1', entityId: 'test', year: 0, titleKey: 't', summaryKey: 's' },
      ];
      const types = getUniqueArmamentTypes(events);
      expect(types).toEqual([]);
    });
  });

  describe('hasArmamentData', () => {
    it('should return true when armaments exist', () => {
      expect(hasArmamentData(mockEvents)).toBe(true);
    });

    it('should return false when no armaments exist', () => {
      const events: Event[] = [
        { id: '1', entityId: 'test', year: 0, titleKey: 't', summaryKey: 's' },
      ];
      expect(hasArmamentData(events)).toBe(false);
    });
  });

  describe('getArmamentTypeStats', () => {
    it('should get correct stats for chariot', () => {
      const stats = getArmamentTypeStats(mockEvents, 'chariot');
      expect(stats.count).toBe(5);
      expect(stats.battles).toContain('battle.chengpu');
      expect(stats.battles).toContain('battle.maling');
      expect(stats.battles).toContain('battle.boju');
      expect(stats.sides).toContain('attacker');
    });

    it('should get correct stats for cavalry', () => {
      const stats = getArmamentTypeStats(mockEvents, 'cavalry');
      expect(stats.count).toBe(5);
    });

    it('should return empty stats for non-existent type', () => {
      const stats = getArmamentTypeStats(mockEvents, 'navy');
      expect(stats.count).toBe(0);
      expect(stats.battles).toEqual([]);
    });
  });

  describe('getAllArmamentTypeStats', () => {
    it('should return stats for all armament types', () => {
      const stats = getAllArmamentTypeStats(mockEvents);
      expect(stats.length).toBeGreaterThan(0);
      
      const chariotStats = stats.find(s => s.type === 'chariot');
      expect(chariotStats).toBeDefined();
      expect(chariotStats!.count).toBe(5);
    });
  });

  describe('getBattlesByArmamentType', () => {
    it('should return battles filtered by armament type', () => {
      const results = getBattlesByArmamentType(mockEvents, 'cavalry');
      expect(results.length).toBe(5);
      expect(results[0].armament.type).toBe('cavalry');
      expect(results[0].event.titleKey).toBe('battle.chengpu');
    });
  });

  describe('getMostCommonArmamentTypes', () => {
    it('should return top most common armament types', () => {
      const mostCommon = getMostCommonArmamentTypes(mockEvents, 3);
      expect(mostCommon.length).toBeLessThanOrEqual(3);
      expect(mostCommon[0].count).toBeGreaterThanOrEqual(mostCommon[1].count);
    });

    it('should exclude unknown type from ranking', () => {
      const mostCommon = getMostCommonArmamentTypes(mockEvents, 5);
      const unknown = mostCommon.find(m => m.type === 'unknown');
      expect(unknown).toBeUndefined();
    });
  });

  describe('getArmamentOutcomeCorrelation', () => {
    it('should calculate correct correlation between armaments and outcomes', () => {
      const correlations = getArmamentOutcomeCorrelation(mockEvents);
      
      const chariotCorr = correlations.find(c => c.armamentType === 'chariot');
      expect(chariotCorr).toBeDefined();
      expect(chariotCorr!.total).toBe(5);
      expect(chariotCorr!.attackerWin).toBe(5); // all attacker_win in mock
    });

    it('should calculate correct win rates', () => {
      const correlations = getArmamentOutcomeCorrelation(mockEvents);
      
      const correlationsWithData = correlations.filter(c => c.total > 0);
      correlationsWithData.forEach(corr => {
        const expectedRate = (corr.attackerWin / corr.total) * 100;
        expect(corr.attackerWinRate).toBeCloseTo(expectedRate, 1);
      });
    });
  });

  describe('getArmamentSideAnalysis', () => {
    it('should analyze attacker vs defender armament usage', () => {
      const analysis = getArmamentSideAnalysis(mockEvents);
      
      const cavalry = analysis.find(a => a.armamentType === 'cavalry');
      expect(cavalry).toBeDefined();
      expect(cavalry!.attacker).toBeGreaterThan(0);
    });

    it('should count primary armaments', () => {
      const analysis = getArmamentSideAnalysis(mockEvents);
      
      const cavalry = analysis.find(a => a.armamentType === 'cavalry');
      expect(cavalry!.primary).toBeGreaterThan(0);
    });
  });

  describe('getArmamentStrategyCorrelation', () => {
    it('should correlate armaments with strategies', () => {
      const correlations = getArmamentStrategyCorrelation(mockEvents);
      expect(correlations.length).toBeGreaterThan(0);
    });

    it('should return correct format', () => {
      const correlations = getArmamentStrategyCorrelation(mockEvents);
      
      if (correlations.length > 0) {
        expect(correlations[0]).toHaveProperty('armament');
        expect(correlations[0]).toHaveProperty('strategy');
        expect(correlations[0]).toHaveProperty('count');
        expect(correlations[0]).toHaveProperty('armamentLabel');
        expect(correlations[0]).toHaveProperty('strategyLabel');
      }
    });
  });

  describe('getArmamentInsights', () => {
    it('should generate insights when data exists', () => {
      const insights = getArmamentInsights(mockEvents);
      expect(insights.length).toBeGreaterThan(0);
      expect(typeof insights[0]).toBe('string');
    });

    it('should mention most common armaments', () => {
      const insights = getArmamentInsights(mockEvents);
      const text = insights.join('');
      expect(text).toMatch(/兵器|战车|骑兵|弓|矛|步兵/);
    });
  });

  describe('getArmamentSummary', () => {
    it('should return complete summary', () => {
      const summary = getArmamentSummary(mockEvents);
      
      expect(summary.hasData).toBe(true);
      expect(summary.uniqueTypes).toBeGreaterThan(0);
      expect(summary.totalUsage).toBeGreaterThan(0);
      expect(summary.mostCommon).toBeDefined();
      expect(summary.correlations).toBeDefined();
      expect(summary.sideAnalysis).toBeDefined();
      expect(summary.insights).toBeDefined();
    });

    it('should include most common armaments', () => {
      const summary = getArmamentSummary(mockEvents);
      expect(summary.mostCommon.length).toBeGreaterThan(0);
      expect(summary.mostCommon[0].count).toBeGreaterThanOrEqual(summary.mostCommon[1].count);
    });
  });

  describe('edge cases', () => {
    it('should handle empty events array', () => {
      const events: Event[] = [];
      expect(hasArmamentData(events)).toBe(false);
      expect(getUniqueArmamentTypes(events)).toEqual([]);
      expect(getArmamentSummary(events).hasData).toBe(false);
    });

    it('should handle events with empty armaments array', () => {
      const events: Event[] = [
        { id: '1', entityId: 'test', year: 0, titleKey: 't', summaryKey: 's', battle: { armaments: [] } },
      ];
      expect(hasArmamentData(events)).toBe(false);
    });

    it('should handle missing battle data', () => {
      const events: Event[] = [
        { id: '1', entityId: 'test', year: 0, titleKey: 't', summaryKey: 's' },
      ];
      const stats = getArmamentTypeStats(events, 'sword');
      expect(stats.count).toBe(0);
    });
  });
});
