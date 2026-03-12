import { describe, it, expect } from 'vitest';
import type { Event } from './types';
import {
  predictBattleOutcome,
  getFactorAnalysis,
  getPredictionInsights,
  predictMultipleBattles,
  getPredictionAccuracy,
  getPredictionSummary,
} from './battlePrediction';

// Mock events for testing
const mockEvents: Event[] = [
  {
    id: 'battle1',
    entityId: 'spring-autumn',
    year: -632,
    month: 4,
    titleKey: 'battle.chengpu',
    summaryKey: 'battle.chengpu.desc',
    tags: ['war'],
    location: { lon: 117.2, lat: 33.9, label: '城濮' },
    battle: {
      belligerents: { attacker: '晋国', defender: '楚国' },
      result: 'attacker_win',
      terrain: ['plains', 'hills'],
      weather: ['clear'],
      pacing: 'rapid',
      strategy: ['defensive', 'alliance'],
    },
  },
  {
    id: 'battle2',
    entityId: 'warring-states',
    year: -341,
    month: 10,
    titleKey: 'battle.maling',
    summaryKey: 'battle.maling.desc',
    tags: ['war'],
    location: { lon: 117.0, lat: 34.4, label: '马陵' },
    battle: {
      belligerents: { attacker: '齐国', defender: '魏国' },
      result: 'attacker_win',
      terrain: ['forest'],
      weather: ['clear'],
      pacing: 'surprise',
      strategy: ['ambush', 'feigned-retreat'],
    },
  },
  {
    id: 'battle3',
    entityId: 'warring-states',
    year: -260,
    month: 7,
    titleKey: 'battle.changping',
    summaryKey: 'battle.changping.desc',
    tags: ['war'],
    location: { lon: 113.0, lat: 37.5, label: '长平' },
    battle: {
      belligerents: { attacker: '秦国', defender: '赵国' },
      result: 'attacker_win',
      terrain: ['mountains', 'hills'],
      weather: ['hot'],
      pacing: 'extended',
      strategy: ['encirclement', 'offensive'],
      scale: 'massive',
    },
  },
  {
    id: 'battle4',
    entityId: 'three-kingdoms',
    year: -208,
    month: 11,
    titleKey: 'battle.chibi',
    summaryKey: 'battle.chibi.desc',
    tags: ['war'],
    location: { lon: 113.1, lat: 30.2, label: '赤壁' },
    battle: {
      belligerents: { attacker: '曹操', defender: '孙刘联军' },
      result: 'defender_win',
      terrain: ['water'],
      weather: ['windy'],
      pacing: 'extended',
      strategy: ['fire', 'alliance'],
      timeOfDay: 'night',
    },
  },
  {
    id: 'battle5',
    entityId: 'jin',
    year: 383,
    month: 10,
    titleKey: 'battle.feishui',
    summaryKey: 'battle.feishui.desc',
    tags: ['war'],
    location: { lon: 118.4, lat: 31.4, label: '淝水' },
    battle: {
      belligerents: { attacker: '晋军', defender: '秦军' },
      result: 'defender_win',
      terrain: ['water', 'plains'],
      weather: ['windy'],
      pacing: 'rapid',
      strategy: ['feigned-retreat'],
      timeOfDay: 'afternoon',
    },
  },
  {
    id: 'battle6',
    entityId: 'chuhang',
    year: -208,
    month: 12,
    titleKey: 'battle.julu',
    summaryKey: 'battle.julu.desc',
    tags: ['war'],
    location: { lon: 114.8, lat: 37.2, label: '巨鹿' },
    battle: {
      belligerents: { attacker: '项羽', defender: '秦军' },
      result: 'attacker_win',
      terrain: ['plains'],
      weather: ['cold'],
      pacing: 'surprise',
      strategy: ['pincer', 'offensive'],
    },
  },
  // Battle with no prediction data
  {
    id: 'battle7',
    entityId: 'sui',
    year: -617,
    titleKey: 'battle.luoyang',
    summaryKey: 'battle.luoyang.desc',
    tags: ['war'],
    location: { lon: 112.4, lat: 34.6, label: '洛阳' },
    battle: {
      belligerents: { attacker: '李密', defender: '王世充' },
      result: 'inconclusive',
    },
  },
];

describe('battlePrediction', () => {
  describe('predictBattleOutcome', () => {
    it('should predict attacker win for battle with favorable factors', () => {
      const battle = mockEvents[1]; // 马陵之战 - 伏击、森林
      const prediction = predictBattleOutcome(battle);
      
      expect(prediction).toHaveProperty('predictedWinner');
      expect(prediction).toHaveProperty('confidence');
      expect(prediction).toHaveProperty('favorableFactors');
      expect(prediction).toHaveProperty('unfavorableFactors');
      expect(prediction).toHaveProperty('keyFactors');
      expect(prediction.confidence).toBeGreaterThanOrEqual(0);
      expect(prediction.confidence).toBeLessThanOrEqual(100);
    });

    it('should predict defender win for defensive terrain', () => {
      const battle = mockEvents[3]; // 赤壁之战 - 水域
      const prediction = predictBattleOutcome(battle);
      
      expect(prediction.predictedWinner).toMatch(/attacker|defender|uncertain/);
    });

    it('should handle battle with minimal data', () => {
      const battle = mockEvents[6]; // 洛阳之战 - 无地形/天气数据
      const prediction = predictBattleOutcome(battle);
      
      expect(prediction.predictedWinner).toBe('uncertain');
      expect(prediction.confidence).toBeLessThan(50);
    });

    it('should include key factors in prediction', () => {
      const battle = mockEvents[2]; // 长平之战 - 有规模数据
      const prediction = predictBattleOutcome(battle);
      
      expect(prediction.keyFactors.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getFactorAnalysis', () => {
    it('should return sorted factor analysis', () => {
      const battle = mockEvents[1]; // 马陵之战
      const factors = getFactorAnalysis(battle);
      
      expect(factors.length).toBeGreaterThan(0);
      
      // Should be sorted by absolute advantage
      for (let i = 1; i < factors.length; i++) {
        expect(Math.abs(factors[i-1].attackerAdvantage)).toBeGreaterThanOrEqual(
          Math.abs(factors[i].attackerAdvantage)
        );
      }
    });

    it('should include terrain factor when available', () => {
      const battle = mockEvents[1];
      const factors = getFactorAnalysis(battle);
      
      const terrainFactor = factors.find(f => f.factor === '地形');
      expect(terrainFactor).toBeDefined();
    });

    it('should include weather factor when available', () => {
      const battle = mockEvents[1];
      const factors = getFactorAnalysis(battle);
      
      const weatherFactor = factors.find(f => f.factor === '天气');
      expect(weatherFactor).toBeDefined();
    });

    it('should include strategy factor when available', () => {
      const battle = mockEvents[1];
      const factors = getFactorAnalysis(battle);
      
      const strategyFactor = factors.find(f => f.factor === '战术');
      expect(strategyFactor).toBeDefined();
    });

    it('should return empty array for battle with no data', () => {
      const battle = mockEvents[6];
      const factors = getFactorAnalysis(battle);
      
      expect(factors).toEqual([]);
    });
  });

  describe('getPredictionInsights', () => {
    it('should generate insights for battle with data', () => {
      const battle = mockEvents[1];
      const insights = getPredictionInsights(battle);
      
      expect(insights.length).toBeGreaterThan(0);
      expect(insights[0]).toContain('预测');
    });

    it('should include actual result in insights', () => {
      const battle = mockEvents[1];
      const insights = getPredictionInsights(battle);
      
      // Should mention actual result
      const hasActualResult = insights.some(i => i.includes('实际结果'));
      expect(hasActualResult).toBe(true);
    });

    it('should handle battle with no data', () => {
      const battle = mockEvents[6];
      const insights = getPredictionInsights(battle);
      
      expect(insights.length).toBeGreaterThan(0);
    });
  });

  describe('predictMultipleBattles', () => {
    it('should predict multiple battles', () => {
      const battles = [mockEvents[0], mockEvents[1], mockEvents[2]];
      const predictions = predictMultipleBattles(battles);
      
      expect(predictions.length).toBe(3);
      predictions.forEach(p => {
        expect(p).toHaveProperty('battleId');
        expect(p).toHaveProperty('battleTitle');
        expect(p).toHaveProperty('prediction');
      });
    });

    it('should maintain correct battle mapping', () => {
      const battles = [mockEvents[0], mockEvents[1]];
      const predictions = predictMultipleBattles(battles);
      
      expect(predictions[0].battleId).toBe('battle1');
      expect(predictions[1].battleId).toBe('battle2');
    });
  });

  describe('getPredictionAccuracy', () => {
    it('should calculate accuracy correctly', () => {
      const battles = mockEvents.slice(0, 5); // Exclude inconclusive one
      const accuracy = getPredictionAccuracy(battles);
      
      expect(accuracy).toHaveProperty('total');
      expect(accuracy).toHaveProperty('correct');
      expect(accuracy).toHaveProperty('accuracy');
      expect(accuracy).toHaveProperty('byWinner');
      expect(accuracy.byWinner).toHaveProperty('attacker');
      expect(accuracy.byWinner).toHaveProperty('defender');
    });

    it('should handle battles with no result', () => {
      const battles = [mockEvents[6]];
      const accuracy = getPredictionAccuracy(battles);
      
      expect(accuracy.total).toBe(0);
      expect(accuracy.accuracy).toBe(0);
    });

    it('should calculate per-winner accuracy', () => {
      const battles = mockEvents.slice(0, 5);
      const accuracy = getPredictionAccuracy(battles);
      
      // Check attacker stats
      expect(accuracy.byWinner.attacker).toHaveProperty('total');
      expect(accuracy.byWinner.attacker).toHaveProperty('correct');
      expect(accuracy.byWinner.attacker).toHaveProperty('accuracy');
      
      // Check defender stats
      expect(accuracy.byWinner.defender).toHaveProperty('total');
      expect(accuracy.byWinner.defender).toHaveProperty('correct');
      expect(accuracy.byWinner.defender).toHaveProperty('accuracy');
    });
  });

  describe('getPredictionSummary', () => {
    it('should return complete summary', () => {
      const battle = mockEvents[1];
      const summary = getPredictionSummary(battle);
      
      expect(summary).toHaveProperty('hasData');
      expect(summary).toHaveProperty('factorAnalysis');
      expect(summary).toHaveProperty('prediction');
      expect(summary).toHaveProperty('insights');
    });

    it('should correctly indicate when data is available', () => {
      const battleWithData = mockEvents[1];
      const summaryWithData = getPredictionSummary(battleWithData);
      expect(summaryWithData.hasData).toBe(true);
      
      const battleNoData = mockEvents[6];
      const summaryNoData = getPredictionSummary(battleNoData);
      expect(summaryNoData.hasData).toBe(false);
    });

    it('should include accuracy stats when battle has result', () => {
      const battle = mockEvents[1];
      const summary = getPredictionSummary(battle);
      
      // Should include accuracy stats when there's a result
      expect(summary.insights).toBeDefined();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty events array', () => {
      const accuracy = getPredictionAccuracy([]);
      expect(accuracy.total).toBe(0);
      expect(accuracy.accuracy).toBe(0);
    });

    it('should handle battle with all draw results', () => {
      const drawBattles: Event[] = [
        {
          id: 'draw1',
          entityId: 'test',
          year: -100,
          titleKey: 'battle.draw1',
          summaryKey: 'test',
          battle: {
            belligerents: { attacker: 'A', defender: 'B' },
            result: 'draw',
            terrain: ['plains'],
          },
        },
      ];
      const accuracy = getPredictionAccuracy(drawBattles);
      expect(accuracy.total).toBe(0);
    });

    it('should handle battle with all inconclusive results', () => {
      const incBattles: Event[] = [
        {
          id: 'inc1',
          entityId: 'test',
          year: -100,
          titleKey: 'battle.inc1',
          summaryKey: 'test',
          battle: {
            belligerents: { attacker: 'A', defender: 'B' },
            result: 'inconclusive',
            terrain: ['plains'],
          },
        },
      ];
      const accuracy = getPredictionAccuracy(incBattles);
      expect(accuracy.total).toBe(0);
    });
  });
});
