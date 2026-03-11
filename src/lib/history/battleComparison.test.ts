import { describe, it, expect } from 'vitest';
import {
  compareBattleDimension,
  compareBattles,
  getBattleSimilarity,
  findSimilarBattles,
  getBattleComparisonInsights,
  getBattleComparisonSummary,
  hasCommanderComparisonData,
} from './battleComparison';
import type { Event } from './types';

const createMockBattle = (overrides: Partial<Event> = {}): Event => ({
  id: 'test-battle',
  entityId: 'spring-autumn',
  year: -260,
  month: 7,
  titleKey: 'battles.mupai',
  summaryKey: 'battles.mupai.summary',
  tags: ['war'],
  location: { lon: 113.5, lat: 35.5, label: '长平' },
  battle: {
    belligerents: {
      attacker: '秦国',
      defender: '赵国',
    },
    result: 'attacker_win',
    battleType: 'conquest',
    scale: 'massive',
    impact: 'decisive',
    commanders: {
      attacker: ['白起'],
      defender: ['赵括'],
    },
  },
  ...overrides,
});

describe('battleComparison', () => {
  describe('compareBattleDimension', () => {
    it('should compare year dimension', () => {
      const battle1 = createMockBattle({ year: -260 });
      const battle2 = createMockBattle({ year: -260 });
      
      const result = compareBattleDimension(battle1, battle2, 'year');
      
      expect(result.isMatch).toBe(true);
      expect(result.similarity).toBe(1);
    });

    it('should calculate year similarity correctly', () => {
      const battle1 = createMockBattle({ year: -260 });
      const battle2 = createMockBattle({ year: -230 });
      
      const result = compareBattleDimension(battle1, battle2, 'year');
      
      expect(result.isMatch).toBe(false);
      expect(result.similarity).toBeGreaterThan(0);
      expect(result.similarity).toBeLessThan(1);
    });

    it('should compare season dimension', () => {
      const battle1 = createMockBattle({ month: 7 }); // summer
      const battle2 = createMockBattle({ month: 7 }); // summer
      
      const result = compareBattleDimension(battle1, battle2, 'season');
      
      expect(result.isMatch).toBe(true);
      expect(result.similarity).toBe(1);
    });

    it('should detect different seasons', () => {
      const battle1 = createMockBattle({ month: 7 }); // summer
      const battle2 = createMockBattle({ month: 1 }); // winter
      
      const result = compareBattleDimension(battle1, battle2, 'season');
      
      expect(result.isMatch).toBe(false);
      expect(result.similarity).toBe(0);
    });

    it('should compare result dimension', () => {
      const battle1 = createMockBattle({
        battle: { result: 'attacker_win', belligerents: { attacker: 'A', defender: 'B' } }
      });
      const battle2 = createMockBattle({
        battle: { result: 'attacker_win', belligerents: { attacker: 'C', defender: 'D' } }
      });
      
      const result = compareBattleDimension(battle1, battle2, 'result');
      
      expect(result.isMatch).toBe(true);
      expect(result.similarity).toBe(1);
    });

    it('should detect different results', () => {
      const battle1 = createMockBattle({
        battle: { result: 'attacker_win', belligerents: { attacker: 'A', defender: 'B' } }
      });
      const battle2 = createMockBattle({
        battle: { result: 'defender_win', belligerents: { attacker: 'C', defender: 'D' } }
      });
      
      const result = compareBattleDimension(battle1, battle2, 'result');
      
      expect(result.isMatch).toBe(false);
      expect(result.similarity).toBe(0);
    });

    it('should compare type dimension', () => {
      const battle1 = createMockBattle({
        battle: { battleType: 'conquest', belligerents: { attacker: 'A', defender: 'B' } }
      });
      const battle2 = createMockBattle({
        battle: { battleType: 'conquest', belligerents: { attacker: 'C', defender: 'D' } }
      });
      
      const result = compareBattleDimension(battle1, battle2, 'type');
      
      expect(result.isMatch).toBe(true);
      expect(result.similarity).toBe(1);
    });

    it('should compare scale dimension', () => {
      const battle1 = createMockBattle({
        battle: { scale: 'massive', belligerents: { attacker: 'A', defender: 'B' } }
      });
      const battle2 = createMockBattle({
        battle: { scale: 'large', belligerents: { attacker: 'C', defender: 'D' } }
      });
      
      const result = compareBattleDimension(battle1, battle2, 'scale');
      
      expect(result.isMatch).toBe(false);
      expect(result.similarity).toBe(0);
    });

    it('should compare impact dimension', () => {
      const battle1 = createMockBattle({
        battle: { impact: 'decisive', belligerents: { attacker: 'A', defender: 'B' } }
      });
      const battle2 = createMockBattle({
        battle: { impact: 'decisive', belligerents: { attacker: 'C', defender: 'D' } }
      });
      
      const result = compareBattleDimension(battle1, battle2, 'impact');
      
      expect(result.isMatch).toBe(true);
      expect(result.similarity).toBe(1);
    });

    it('should compare commanders dimension', () => {
      const battle1 = createMockBattle({
        battle: {
          commanders: { attacker: ['白起', '王龁'], defender: ['赵括'] },
          belligerents: { attacker: 'A', defender: 'B' }
        }
      });
      const battle2 = createMockBattle({
        battle: {
          commanders: { attacker: ['白起'], defender: ['赵括', '廉颇'] },
          belligerents: { attacker: 'C', defender: 'D' }
        }
      });
      
      const result = compareBattleDimension(battle1, battle2, 'commanders');
      
      expect(result.similarity).toBeGreaterThan(0);
      expect(result.isMatch).toBe(true);
    });

    it('should handle missing commanders', () => {
      const battle1 = createMockBattle({
        battle: {
          commanders: { attacker: ['白起'], defender: [] },
          belligerents: { attacker: 'A', defender: 'B' }
        }
      });
      const battle2 = createMockBattle({
        battle: {
          commanders: { attacker: [], defender: [] },
          belligerents: { attacker: 'C', defender: 'D' }
        }
      });
      
      const result = compareBattleDimension(battle1, battle2, 'commanders');
      
      expect(result.similarity).toBe(0);
      expect(result.isMatch).toBe(false);
    });

    it('should compare region dimension', () => {
      const battle1 = createMockBattle({
        location: { lon: 113.5, lat: 35.5, label: '长平' }
      });
      const battle2 = createMockBattle({
        location: { lon: 115.0, lat: 36.0, label: '邯郸' }
      });
      
      const result = compareBattleDimension(battle1, battle2, 'region');
      
      expect(result.isMatch).toBe(true);
      expect(result.similarity).toBe(1);
    });
  });

  describe('compareBattles', () => {
    it('should compare multiple dimensions', () => {
      const battle1 = createMockBattle({ year: -260, month: 7 });
      const battle2 = createMockBattle({ year: -260, month: 7 });
      
      const results = compareBattles(battle1, battle2);
      
      expect(results.length).toBe(9); // default 9 dimensions
    });

    it('should use custom dimensions', () => {
      const battle1 = createMockBattle({ year: -260 });
      const battle2 = createMockBattle({ year: -230 });
      
      const results = compareBattles(battle1, battle2, ['year', 'result']);
      
      expect(results.length).toBe(2);
    });
  });

  describe('getBattleSimilarity', () => {
    it('should return 1 for identical battles', () => {
      const battle1 = createMockBattle();
      const battle2 = createMockBattle();
      
      const similarity = getBattleSimilarity(battle1, battle2);
      
      expect(similarity).toBe(1);
    });

    it('should return lower similarity for different battles', () => {
      const battle1 = createMockBattle({
        year: -260,
        month: 7,
        battle: { result: 'attacker_win', battleType: 'conquest', scale: 'massive', impact: 'decisive', belligerents: { attacker: '秦', defender: '赵' } }
      });
      const battle2 = createMockBattle({
        year: -202,
        month: 12,
        battle: { result: 'defender_win', battleType: 'defense', scale: 'large', impact: 'major', belligerents: { attacker: '项羽', defender: '刘邦' } }
      });
      
      const similarity = getBattleSimilarity(battle1, battle2);
      
      expect(similarity).toBeLessThan(1);
      expect(similarity).toBeGreaterThan(0);
    });
  });

  describe('findSimilarBattles', () => {
    it('should find similar battles', () => {
      const battles = [
        createMockBattle({ id: 'b1', year: -260, titleKey: 'battles.changping' }),
        createMockBattle({ id: 'b2', year: -257, titleKey: 'battles.feiji' }),
        createMockBattle({ id: 'b3', year: -202, titleKey: 'battles.gaixia' }),
        createMockBattle({ id: 'b4', year: -100, titleKey: 'battles.tian Shan' }),
      ];
      const target = createMockBattle({ id: 'target', year: -259 });
      
      const similar = findSimilarBattles(target, battles, 2);
      
      expect(similar.length).toBe(2);
      expect(similar[0].battle.id).toBe('b1'); // Most similar
    });

    it('should exclude target battle from results', () => {
      const battles = [
        createMockBattle({ id: 'b1', year: -260 }),
        createMockBattle({ id: 'b2', year: -257 }),
      ];
      const target = createMockBattle({ id: 'b1', year: -260 });
      
      const similar = findSimilarBattles(target, battles);
      
      expect(similar.some(s => s.battle.id === 'b1')).toBe(false);
    });
  });

  describe('getBattleComparisonInsights', () => {
    it('should generate insights for similar battles', () => {
      const battle1 = createMockBattle({
        year: -260,
        month: 7,
        battle: { result: 'attacker_win', battleType: 'conquest', scale: 'massive', impact: 'decisive', belligerents: { attacker: '秦', defender: '赵' } }
      });
      const battle2 = createMockBattle({
        year: -260,
        month: 7,
        battle: { result: 'attacker_win', battleType: 'conquest', scale: 'large', impact: 'major', belligerents: { attacker: '秦', defender: '魏' } }
      });
      
      const insights = getBattleComparisonInsights(battle1, battle2);
      
      expect(insights.length).toBeGreaterThan(0);
      expect(insights.some(i => i.includes('相同点'))).toBe(true);
    });

    it('should include time difference insight', () => {
      const battle1 = createMockBattle({ year: -260 });
      const battle2 = createMockBattle({ year: -230 });
      
      const insights = getBattleComparisonInsights(battle1, battle2);
      
      expect(insights.some(i => i.includes('相差'))).toBe(true);
    });
  });

  describe('getBattleComparisonSummary', () => {
    it('should return comparison summary', () => {
      const battle1 = createMockBattle({ id: 'b1', year: -260, titleKey: 'battles.changping' });
      const battle2 = createMockBattle({ id: 'b2', year: -230, titleKey: 'battles.feiji' });
      
      const summary = getBattleComparisonSummary(battle1, battle2);
      
      expect(summary.battle1Title).toBe('battles.changping');
      expect(summary.battle2Title).toBe('battles.feiji');
      expect(summary.battle1Year).toBe(-260);
      expect(summary.battle2Year).toBe(-230);
      expect(summary.yearDiff).toBe(30);
      expect(summary.similarity).toBeGreaterThan(0);
      expect(summary.similarity).toBeLessThan(1);
      expect(summary.totalDimensions).toBe(9);
    });
  });

  describe('hasCommanderComparisonData', () => {
    it('should return true when battles have commanders', () => {
      const battles = [
        createMockBattle({ battle: { commanders: { attacker: ['白起'], defender: [] }, belligerents: { attacker: 'A', defender: 'B' } } }),
      ];
      
      expect(hasCommanderComparisonData(battles)).toBe(true);
    });

    it('should return false when no battles have commanders', () => {
      const battles = [
        createMockBattle({ battle: { commanders: undefined, belligerents: { attacker: 'A', defender: 'B' } } }),
      ];
      
      expect(hasCommanderComparisonData(battles)).toBe(false);
    });
  });
});
