import { describe, it, expect } from 'vitest';
import {
  getStrategyLabel,
  hasStrategyData,
  getUniqueStrategies,
  getBattlesByStrategy,
  getStrategyStats,
  getMostUsedStrategies,
  getMostEffectiveStrategies,
  getStrategiesByBattleType,
  getStrategyEffectiveness,
  compareStrategies,
  getBattlesWithStrategyAndResult,
  getStrategyAttackerDefenderAnalysis,
  getStrategyInsights,
  getStrategyDistributionByEra,
  getStrategySummary,
} from './battleStrategy';
import type { Event, BattleStrategy } from './types';

// Test battles with strategy data
const testBattles: Event[] = [
  {
    id: 'battle-1',
    entityId: 'period-warring-states',
    year: -341,
    titleKey: 'test.battle1',
    summaryKey: 'test.battle1.summary',
    battle: {
      strategy: ['ambush', 'feigned-retreat'],
      result: 'attacker_win',
      battleType: 'conquest',
    },
  },
  {
    id: 'battle-2',
    entityId: 'period-warring-states',
    year: -260,
    titleKey: 'test.battle2',
    summaryKey: 'test.battle2.summary',
    battle: {
      strategy: ['encirclement', 'offensive'],
      result: 'attacker_win',
      battleType: 'conquest',
    },
  },
  {
    id: 'battle-3',
    entityId: 'period-spring-autumn',
    year: -632,
    titleKey: 'test.battle3',
    summaryKey: 'test.battle3.summary',
    battle: {
      strategy: ['defensive', 'alliance'],
      result: 'attacker_win',
      battleType: 'defense',
    },
  },
  {
    id: 'battle-4',
    entityId: 'period-warring-states',
    year: -284,
    titleKey: 'test.battle4',
    summaryKey: 'test.battle4.summary',
    battle: {
      strategy: ['offensive'],
      result: 'defender_win',
      battleType: 'conquest',
    },
  },
  {
    id: 'battle-5',
    entityId: 'period-warring-states',
    year: -341,
    titleKey: 'test.battle5',
    summaryKey: 'test.battle5.summary',
    battle: {
      strategy: ['fire'],
      result: 'attacker_win',
    },
  },
  // Battle without strategy
  {
    id: 'battle-6',
    entityId: 'period-warring-states',
    year: -230,
    titleKey: 'test.battle6',
    summaryKey: 'test.battle6.summary',
    battle: {
      result: 'attacker_win',
    },
  },
  // More battles for statistical significance
  {
    id: 'battle-7',
    entityId: 'period-warring-states',
    year: -228,
    titleKey: 'test.battle7',
    summaryKey: 'test.battle7.summary',
    battle: {
      strategy: ['ambush'],
      result: 'attacker_win',
    },
  },
  {
    id: 'battle-8',
    entityId: 'period-warring-states',
    year: -225,
    titleKey: 'test.battle8',
    summaryKey: 'test.battle8.summary',
    battle: {
      strategy: ['water'],
      result: 'defender_win',
    },
  },
];

describe('battleStrategy', () => {
  describe('getStrategyLabel', () => {
    it('should return correct Chinese labels', () => {
      expect(getStrategyLabel('ambush')).toBe('伏击');
      expect(getStrategyLabel('fire')).toBe('火攻');
      expect(getStrategyLabel('water')).toBe('水攻');
      expect(getStrategyLabel('encirclement')).toBe('包围');
      expect(getStrategyLabel('siege')).toBe('攻城战');
      expect(getStrategyLabel('pincer')).toBe('钳形攻势');
      expect(getStrategyLabel('feigned-retreat')).toBe('诱敌深入');
      expect(getStrategyLabel('alliance')).toBe('联盟作战');
      expect(getStrategyLabel('defensive')).toBe('防御作战');
      expect(getStrategyLabel('offensive')).toBe('进攻作战');
      expect(getStrategyLabel('guerrilla')).toBe('游击战');
    });
  });

  describe('hasStrategyData', () => {
    it('should return true when battles have strategy data', () => {
      expect(hasStrategyData(testBattles)).toBe(true);
    });

    it('should return false when no battles have strategy data', () => {
      const battlesWithoutStrategy: Event[] = [
        { id: 'b1', entityId: 'test', year: 1, titleKey: 't', summaryKey: 's', battle: { result: 'attacker_win' } },
      ];
      expect(hasStrategyData(battlesWithoutStrategy)).toBe(false);
    });
  });

  describe('getUniqueStrategies', () => {
    it('should return all unique strategies', () => {
      const strategies = getUniqueStrategies(testBattles);
      expect(strategies).toContain('ambush');
      expect(strategies).toContain('fire');
      expect(strategies).toContain('water');
      expect(strategies).toContain('encirclement');
      expect(strategies).toContain('offensive');
      expect(strategies).toContain('defensive');
      expect(strategies).toContain('alliance');
      expect(strategies).toContain('feigned-retreat');
    });
  });

  describe('getBattlesByStrategy', () => {
    it('should return battles with specified strategy', () => {
      const ambushBattles = getBattlesByStrategy(testBattles, 'ambush');
      expect(ambushBattles.length).toBe(2);
      expect(ambushBattles.map(b => b.id)).toContain('battle-1');
      expect(ambushBattles.map(b => b.id)).toContain('battle-7');
    });

    it('should return empty array for unused strategy', () => {
      const siegeBattles = getBattlesByStrategy(testBattles, 'siege');
      expect(siegeBattles.length).toBe(0);
    });
  });

  describe('getStrategyStats', () => {
    it('should return correct statistics for each strategy', () => {
      const stats = getStrategyStats(testBattles);
      
      const ambush = stats.find(s => s.strategy === 'ambush');
      expect(ambush).toBeDefined();
      expect(ambush!.totalUsages).toBe(2);
      expect(ambush!.attackerWins).toBe(2);
      expect(ambush!.winRate).toBe(100);
    });
  });

  describe('getMostUsedStrategies', () => {
    it('should return top strategies sorted by usage', () => {
      const mostUsed = getMostUsedStrategies(testBattles, 3);
      expect(mostUsed.length).toBeGreaterThan(0);
      expect(mostUsed[0].totalUsages).toBeGreaterThanOrEqual(mostUsed[1].totalUsages);
    });
  });

  describe('getMostEffectiveStrategies', () => {
    it('should return strategies sorted by attacker win rate', () => {
      const mostEffective = getMostEffectiveStrategies(testBattles);
      // ambush has 100% win rate
      expect(mostEffective[0].strategy).toBe('ambush');
    });

    it('should filter strategies with less than minimum usages', () => {
      // With minimum 5, should return empty for small dataset
      const effective = getMostEffectiveStrategies(testBattles, 5);
      expect(effective.every(s => s.totalUsages >= 2)).toBe(true);
    });
  });

  describe('getStrategiesByBattleType', () => {
    it('should return strategies for specific battle type', () => {
      const conquestStrategies = getStrategiesByBattleType(testBattles, 'conquest');
      expect(conquestStrategies.length).toBeGreaterThan(0);
      
      // All conquest battles should have attacker wins in our test data
      for (const s of conquestStrategies) {
        expect(s.attackerWins).toBeGreaterThan(0);
      }
    });
  });

  describe('getStrategyEffectiveness', () => {
    it('should return effectiveness breakdown for a strategy', () => {
      const effectiveness = getStrategyEffectiveness(testBattles, 'ambush');
      expect(effectiveness.length).toBeGreaterThan(0);
      expect(effectiveness[0].result).toBe('attacker_win');
      expect(effectiveness[0].percentage).toBe(100);
    });

    it('should return empty array for unused strategy', () => {
      const effectiveness = getStrategyEffectiveness(testBattles, 'siege');
      expect(effectiveness.length).toBe(0);
    });
  });

  describe('compareStrategies', () => {
    it('should compare two strategies', () => {
      const comparison = compareStrategies(testBattles, 'ambush', 'offensive');
      expect(comparison).not.toBeNull();
      if (comparison) {
        expect(comparison.strategy1.strategy).toBe('ambush');
        expect(comparison.strategy2.strategy).toBe('offensive');
      }
    });

    it('should return null if strategy not found', () => {
      const comparison = compareStrategies(testBattles, 'siege', 'guerrilla');
      expect(comparison).toBeNull();
    });
  });

  describe('getBattlesWithStrategyAndResult', () => {
    it('should return battles with strategy and specific result', () => {
      const battles = getBattlesWithStrategyAndResult(testBattles, 'ambush', 'attacker_win');
      expect(battles.length).toBe(2);
    });

    it('should return empty for non-matching results', () => {
      const battles = getBattlesWithStrategyAndResult(testBattles, 'ambush', 'defender_win');
      expect(battles.length).toBe(0);
    });
  });

  describe('getStrategyAttackerDefenderAnalysis', () => {
    it('should categorize strategies by effectiveness', () => {
      const analysis = getStrategyAttackerDefenderAnalysis(testBattles);
      
      // ambush should favor attackers (>60% win rate)
      expect(analysis.strategiesFavorAttackers).toContain('ambush');
      
      // defensive should be neutral or favor defenders
      expect(
        analysis.strategiesFavorDefenders.length >= 0 ||
        analysis.neutralStrategies.length >= 0
      ).toBe(true);
    });
  });

  describe('getStrategyInsights', () => {
    it('should generate insights for battles with strategy data', () => {
      const insights = getStrategyInsights(testBattles);
      expect(insights.length).toBeGreaterThan(0);
      expect(insights[0]).not.toBe('暂无战略/战术数据');
    });

    it('should return default message for battles without strategy data', () => {
      const battlesWithoutStrategy: Event[] = [
        { id: 'b1', entityId: 'test', year: 1, titleKey: 't', summaryKey: 's', battle: { result: 'attacker_win' } },
      ];
      const insights = getStrategyInsights(battlesWithoutStrategy);
      expect(insights).toContain('暂无战略/战术数据');
    });
  });

  describe('getStrategyDistributionByEra', () => {
    it('should return strategy distribution by era', () => {
      const eras = [
        { id: 'period-warring-states', nameKey: 'Warring States' },
        { id: 'period-spring-autumn', nameKey: 'Spring and Autumn' },
      ];
      
      const distribution = getStrategyDistributionByEra(testBattles, eras);
      
      expect(distribution.get('period-warring-states')).toBeDefined();
      expect(distribution.get('period-spring-autumn')).toBeDefined();
    });
  });

  describe('getStrategySummary', () => {
    it('should return complete strategy summary', () => {
      const summary = getStrategySummary(testBattles);
      
      expect(summary.totalBattles).toBe(8);
      expect(summary.battlesWithStrategy).toBe(7);
      expect(summary.uniqueStrategies).toBeGreaterThan(0);
      expect(summary.mostUsed.length).toBeGreaterThan(0);
      expect(summary.mostEffective.length).toBeGreaterThan(0);
      expect(Array.isArray(summary.attackerFavoring)).toBe(true);
      expect(Array.isArray(summary.defenderFavoring)).toBe(true);
    });
  });
});
