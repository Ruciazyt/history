/**
 * 战役综合评分测试
 */

import { describe, it, expect } from 'vitest';
import {
  calculateBattleRating,
  calculateAllRatings,
  getTopRatedBattles,
  getBattlesByRating,
  getRatingSummary,
  compareBattleRatings,
  hasRatingData,
  DEFAULT_WEIGHTS,
} from './battleRating';
import { Event } from './types';

const mockBattle1: Event = {
  id: 'battle-1',
  entityId: 'spring-autumn',
  year: -260,
  titleKey: 'battle.changping',
  summaryKey: 'summary.changping',
  battle: {
    scale: 'massive',
    impact: 'decisive',
    duration: 30,
    casualties: {
      attacker: 100000,
      defender: 150000,
      attackerCasualtyType: 'killed',
      defenderCasualtyType: 'killed',
    },
    turningPoints: [
      { type: 'commander-death', description: '赵括阵亡', party: 'defender', impact: 'negative' },
      { type: 'encirclement', description: '秦军包围', party: 'attacker', impact: 'positive' },
    ],
    battleType: 'conquest',
    commanders: {
      attacker: ['白起'],
      defender: ['赵括'],
    },
  },
};

const mockBattle2: Event = {
  id: 'battle-2',
  entityId: 'warring-states',
  year: -341,
  titleKey: 'battle.maling',
  summaryKey: 'summary.maling',
  battle: {
    scale: 'large',
    impact: 'major',
    duration: 1,
    casualties: {
      attacker: 10000,
      defender: 30000,
    },
    turningPoints: [
      { type: 'ambush-triggered', description: '伏击触发', party: 'attacker', impact: 'positive' },
    ],
    battleType: 'conquest',
    commanders: {
      attacker: ['孙膑', '庞涓'],
      defender: ['庞涓'],
    },
  },
};

const mockBattle3: Event = {
  id: 'battle-3',
  entityId: 'spring-autumn',
  year: -632,
  titleKey: 'battle.chengpu',
  summaryKey: 'summary.chengpu',
  battle: {
    scale: 'medium',
    impact: 'major',
    duration: 1,
    battleType: 'defense',
    alliance: {
      id: 'alliance-1',
      type: 'cooperative',
      participants: [
        { name: '晋国', role: 'leader' },
        { name: '齐国', role: 'member' },
      ],
    },
  },
};

const mockBattle4: Event = {
  id: 'battle-4',
  entityId: 'spring-autumn',
  year: -1046,
  titleKey: 'battle.muye',
  summaryKey: 'summary.muye',
  battle: {
    // 没有任何评分数据
  },
};

const mockNonBattle: Event = {
  id: 'event-1',
  entityId: 'spring-autumn',
  year: -700,
  titleKey: 'event.coronation',
  summaryKey: 'summary.coronation',
};

describe('battleRating', () => {
  describe('calculateBattleRating', () => {
    it('should calculate rating for battle with full data', () => {
      const rating = calculateBattleRating(mockBattle1);
      
      expect(rating.overallScore).toBeGreaterThan(0);
      expect(rating.rating).toMatch(/^[SABCD]$/);
      expect(rating.dimensionScores.scale).toBe(100);
      expect(rating.dimensionScores.impact).toBe(100);
      expect(rating.highlights.length).toBeGreaterThan(0);
    });

    it('should calculate high score for decisive massive battle', () => {
      const rating = calculateBattleRating(mockBattle1);
      
      // 超大规模+决定性影响+持久战+多转折点应该得到高分
      expect(rating.overallScore).toBeGreaterThanOrEqual(70);
    });

    it('should return unknown rating for battle with minimal data', () => {
      // 没有任何评分数据的战役应该得0分
      const minimalBattle: Event = {
        id: 'battle-minimal',
        entityId: 'test',
        year: -100,
        titleKey: 'test',
        summaryKey: 'test',
      };
      const rating = calculateBattleRating(minimalBattle);
      
      expect(rating.rating).toBe('unknown');
      expect(rating.overallScore).toBe(0);
    });
  });

  describe('calculateAllRatings', () => {
    it('should calculate ratings for all battles', () => {
      const battles = [mockBattle1, mockBattle2, mockBattle3, mockBattle4, mockNonBattle];
      const ratings = calculateAllRatings(battles);
      
      // 应该只包含战役，不包含非战役事件
      expect(ratings.length).toBe(4);
    });

    it('should sort ratings by score descending', () => {
      const battles = [mockBattle1, mockBattle2, mockBattle3];
      const ratings = calculateAllRatings(battles);
      
      // 按分数降序
      for (let i = 1; i < ratings.length; i++) {
        expect(ratings[i - 1].overallScore).toBeGreaterThanOrEqual(ratings[i].overallScore);
      }
    });

    it('should assign correct ranks', () => {
      const battles = [mockBattle1, mockBattle2, mockBattle3];
      const ratings = calculateAllRatings(battles);
      
      expect(ratings[0].rank).toBe(1);
      expect(ratings[1].rank).toBe(2);
      expect(ratings[2].rank).toBe(3);
    });
  });

  describe('getTopRatedBattles', () => {
    it('should return top N battles', () => {
      const battles = [mockBattle1, mockBattle2, mockBattle3, mockBattle4];
      const top3 = getTopRatedBattles(battles, 3);
      
      expect(top3.length).toBe(3);
      expect(top3[0].rank).toBe(1);
    });

    it('should handle N larger than battle count', () => {
      const battles = [mockBattle1, mockBattle2];
      const top10 = getTopRatedBattles(battles, 10);
      
      expect(top10.length).toBe(2);
    });
  });

  describe('getBattlesByRating', () => {
    it('should filter battles by rating', () => {
      const battles = [mockBattle1, mockBattle2, mockBattle3, mockBattle4];
      const aRated = getBattlesByRating(battles, 'A');
      
      // 长平之战应该有较高的评分
      expect(aRated.length).toBeGreaterThan(0);
    });

    it('should return empty array if no matches', () => {
      const battles = [mockBattle4];
      const sRated = getBattlesByRating(battles, 'S');
      
      expect(sRated.length).toBe(0);
    });
  });

  describe('getRatingSummary', () => {
    it('should generate rating summary', () => {
      const battles = [mockBattle1, mockBattle2, mockBattle3];
      const summary = getRatingSummary(battles);
      
      expect(summary.totalBattles).toBe(3);
      expect(summary.averageScore).toBeGreaterThan(0);
      expect(summary.scoreDistribution).toBeDefined();
      expect(summary.ratingInsights.length).toBeGreaterThan(0);
    });

    it('should handle empty battle list', () => {
      const summary = getRatingSummary([]);
      
      expect(summary.totalBattles).toBe(0);
      expect(summary.topBattles.length).toBe(0);
    });

    it('should include top battles in summary', () => {
      const battles = [mockBattle1, mockBattle2, mockBattle3];
      const summary = getRatingSummary(battles);
      
      expect(summary.topBattles.length).toBeGreaterThan(0);
      expect(summary.topBattles[0].rank).toBe(1);
    });
  });

  describe('compareBattleRatings', () => {
    it('should compare two battles', () => {
      const comparison = compareBattleRatings(mockBattle1, mockBattle2);
      
      expect(comparison.comparison.length).toBe(6);
      expect(comparison.winner).not.toBeNull();
    });

    it('should handle draw (tie)', () => {
      const comparison = compareBattleRatings(mockBattle1, mockBattle1);
      
      expect(comparison.winner).toBeNull();
    });

    it('should show dimension comparison', () => {
      const comparison = compareBattleRatings(mockBattle1, mockBattle2);
      
      const scaleComparison = comparison.comparison.find(c => c.dimension === '规模');
      expect(scaleComparison).toBeDefined();
      // 长平之战规模更大
      expect(scaleComparison?.winner).toBe(1);
    });
  });

  describe('hasRatingData', () => {
    it('should return true if any battle has rating data', () => {
      const battles = [mockBattle1, mockNonBattle];
      
      expect(hasRatingData(battles)).toBe(true);
    });

    it('should return false if no battle has rating data', () => {
      const battles = [mockNonBattle];
      
      expect(hasRatingData(battles)).toBe(false);
    });
  });

  describe('DEFAULT_WEIGHTS', () => {
    it('should have valid weight values', () => {
      expect(DEFAULT_WEIGHTS.scale).toBeGreaterThan(0);
      expect(DEFAULT_WEIGHTS.impact).toBeGreaterThan(0);
      expect(DEFAULT_WEIGHTS.duration).toBeGreaterThan(0);
      expect(DEFAULT_WEIGHTS.casualties).toBeGreaterThan(0);
      expect(DEFAULT_WEIGHTS.turningPoints).toBeGreaterThan(0);
      expect(DEFAULT_WEIGHTS.strategic).toBeGreaterThan(0);
    });

    it('should have weights that sum to 1', () => {
      const sum = 
        DEFAULT_WEIGHTS.scale +
        DEFAULT_WEIGHTS.impact +
        DEFAULT_WEIGHTS.duration +
        DEFAULT_WEIGHTS.casualties +
        DEFAULT_WEIGHTS.turningPoints +
        DEFAULT_WEIGHTS.strategic;
      
      expect(sum).toBe(1);
    });
  });

  describe('dimension scoring', () => {
    it('should score massive scale as 100', () => {
      const rating = calculateBattleRating(mockBattle1);
      expect(rating.dimensionScores.scale).toBe(100);
    });

    it('should score decisive impact as 100', () => {
      const rating = calculateBattleRating(mockBattle1);
      expect(rating.dimensionScores.impact).toBe(100);
    });

    it('should score protracted duration high', () => {
      const rating = calculateBattleRating(mockBattle1);
      // 30天算持久战，得100分
      expect(rating.dimensionScores.duration).toBe(100);
    });

    it('should score multiple turning points higher', () => {
      const rating = calculateBattleRating(mockBattle1);
      // mockBattle1 有2个转折点
      expect(rating.dimensionScores.turningPoints).toBe(40);
    });

    it('should give strategic score for battle with alliance', () => {
      const rating = calculateBattleRating(mockBattle3);
      expect(rating.dimensionScores.strategic).toBeGreaterThan(0);
    });
  });
});
