import { describe, it, expect } from 'vitest';
import {
  getBattleImpactInsights,
  getImpactDistribution,
  getMostCommonImpact,
  getDecisiveBattlesWithCommanders,
  getImpactResultCorrelation,
} from './battles';
import type { Event } from './types';

const mockBattles: Event[] = [
  {
    id: 'battle-1',
    entityId: 'period-warring-states',
    year: -260,
    month: 4,
    titleKey: 'battle.changping',
    summaryKey: 'battle.changping.summary',
    tags: ['war'],
    location: { lon: 113.0, lat: 35.5, label: '长平' },
    battle: {
      belligerents: {
        attacker: '秦军',
        defender: '赵军',
      },
      result: 'attacker_win',
      impact: 'decisive',
      battleType: 'conquest',
      commanders: {
        attacker: ['白起'],
        defender: ['赵括'],
      },
    },
  },
  {
    id: 'battle-2',
    entityId: 'period-warring-states',
    year: -341,
    month: 9,
    titleKey: 'battle.maling',
    summaryKey: 'battle.maling.summary',
    tags: ['war'],
    location: { lon: 117.0, lat: 34.5, label: '马陵' },
    battle: {
      belligerents: {
        attacker: '齐军',
        defender: '魏军',
      },
      result: 'attacker_win',
      impact: 'major',
      battleType: 'conquest',
      commanders: {
        attacker: ['孙膑'],
        defender: ['庞涓'],
      },
    },
  },
  {
    id: 'battle-3',
    entityId: 'period-warring-states',
    year: -270,
    month: 2,
    titleKey: 'battle.ying',
    summaryKey: 'battle.ying.summary',
    tags: ['war'],
    location: { lon: 112.5, lat: 31.5, label: '郢' },
    battle: {
      belligerents: {
        attacker: '秦军',
        defender: '楚军',
      },
      result: 'attacker_win',
      impact: 'major',
      battleType: 'conquest',
    },
  },
  {
    id: 'battle-4',
    entityId: 'wz-western-zhou',
    year: -1046,
    month: 1,
    titleKey: 'battle.muye',
    summaryKey: 'battle.muye.summary',
    tags: ['war'],
    location: { lon: 114.7, lat: 34.8, label: '牧野' },
    battle: {
      belligerents: {
        attacker: '周军',
        defender: '商军',
      },
      result: 'attacker_win',
      impact: 'decisive',
      battleType: 'founding',
      commanders: {
        attacker: ['姬发'],
        defender: ['帝辛'],
      },
    },
  },
  {
    id: 'battle-5',
    entityId: 'period-warring-states',
    year: -257,
    month: 7,
    titleKey: 'battle.ping',
    summaryKey: 'battle.ping.summary',
    tags: ['war'],
    location: { lon: 114.0, lat: 36.1, label: '平阳' },
    battle: {
      belligerents: {
        attacker: '秦军',
        defender: '赵军',
      },
      result: 'defender_win',
      impact: 'decisive',
      battleType: 'defense',
    },
  },
  {
    id: 'battle-6',
    entityId: 'han',
    year: -200,
    month: 12,
    titleKey: 'battle.gaixia',
    summaryKey: 'battle.gaixia.summary',
    tags: ['war'],
    location: { lon: 114.3, lat: 32.5, label: '垓下' },
    battle: {
      belligerents: {
        attacker: '汉军',
        defender: '楚军',
      },
      result: 'attacker_win',
      impact: 'decisive',
      battleType: 'unification',
      commanders: {
        attacker: ['韩信'],
        defender: ['项羽'],
      },
    },
  },
];

describe('Battle Impact Analysis', () => {
  describe('getBattleImpactInsights', () => {
    it('should generate insights for battle impacts', () => {
      const insights = getBattleImpactInsights(mockBattles);
      expect(insights).toBeDefined();
      expect(Array.isArray(insights)).toBe(true);
    });

    it('should return empty array for battles without impact data', () => {
      const battlesWithoutImpact: Event[] = [
        {
          id: 'b1',
          entityId: 'test',
          year: -100,
          titleKey: 'test',
          summaryKey: 'test',
          tags: ['war'],
          battle: {
            result: 'attacker_win',
          },
        },
      ];
      const insights = getBattleImpactInsights(battlesWithoutImpact);
      expect(insights).toEqual([]);
    });

    it('should include confidence levels in insights', () => {
      const insights = getBattleImpactInsights(mockBattles);
      for (const insight of insights) {
        expect(['high', 'medium', 'low']).toContain(insight.confidence);
      }
    });
  });

  describe('getImpactDistribution', () => {
    it('should return distribution with percentages', () => {
      const distribution = getImpactDistribution(mockBattles);
      expect(distribution).toBeDefined();
      expect(distribution.length).toBeGreaterThan(0);
      
      for (const item of distribution) {
        expect(item).toHaveProperty('impact');
        expect(item).toHaveProperty('count');
        expect(item).toHaveProperty('percentage');
        expect(item.percentage).toBeGreaterThanOrEqual(0);
        expect(item.percentage).toBeLessThanOrEqual(100);
      }
    });

    it('should sum to approximately 100%', () => {
      const distribution = getImpactDistribution(mockBattles);
      const totalPercentage = distribution.reduce((sum, item) => sum + item.percentage, 0);
      expect(totalPercentage).toBeGreaterThan(90); // Allow for rounding
      expect(totalPercentage).toBeLessThanOrEqual(100);
    });
  });

  describe('getMostCommonImpact', () => {
    it('should return the most common impact level', () => {
      const mostCommon = getMostCommonImpact(mockBattles);
      expect(mostCommon).toBeDefined();
      expect(mostCommon).not.toBeNull();
      expect(mostCommon?.impact).toBeDefined();
    });

    it('should return null for empty battles array', () => {
      const mostCommon = getMostCommonImpact([]);
      expect(mostCommon).toBeNull();
    });
  });

  describe('getDecisiveBattlesWithCommanders', () => {
    it('should return only decisive battles with commanders', () => {
      const result = getDecisiveBattlesWithCommanders(mockBattles);
      expect(result).toBeDefined();
      
      for (const battle of result) {
        expect(battle.battle?.impact).toBe('decisive');
        expect(
          battle.battle?.commanders?.attacker?.length || 
          battle.battle?.commanders?.defender?.length || 0
        ).toBeGreaterThan(0);
      }
    });

    it('should exclude battles without commanders even if decisive', () => {
      const result = getDecisiveBattlesWithCommanders(mockBattles);
      const idsWithCommanders = result.map(b => b.id);
      expect(idsWithCommanders).not.toContain('battle-3'); // No commanders
    });
  });

  describe('getImpactResultCorrelation', () => {
    it('should return correlation data for each impact level', () => {
      const correlation = getImpactResultCorrelation(mockBattles);
      expect(correlation).toBeDefined();
      expect(Array.isArray(correlation)).toBe(true);
    });

    it('should include win rate classification', () => {
      const correlation = getImpactResultCorrelation(mockBattles);
      
      for (const item of correlation) {
        expect(['attacker', 'defender', 'equal']).toContain(item.winRate);
      }
    });

    it('should correctly count wins for each impact', () => {
      const correlation = getImpactResultCorrelation(mockBattles);
      
      // Find decisive battles: battle-1 (attacker_win), battle-4 (attacker_win), battle-5 (defender_win), battle-6 (attacker_win)
      const decisive = correlation.find(c => c.impact === 'decisive');
      expect(decisive).toBeDefined();
      expect(decisive?.attackerWins).toBe(3);
      expect(decisive?.defenderWins).toBe(1);
    });
  });
});
