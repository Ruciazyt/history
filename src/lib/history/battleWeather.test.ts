import { describe, it, expect } from 'vitest';
import type { Event } from './types';
import {
  getWeatherLabel,
  getWeatherStats,
  getAllWeatherStats,
  getMostCommonWeather,
  getKnownWeatherCount,
  getBattlesByWeather,
  getWeatherOutcomeCorrelation,
  getWeatherAttackerDefenderAnalysis,
  getWeatherInsights,
  getWeatherSummary,
  hasWeatherData,
} from './battleWeather';

const createMockBattle = (overrides: Partial<Event['battle']> = {}): Event => ({
  id: 'battle-1',
  entityId: 'era-1',
  year: -260,
  titleKey: 'test.battle',
  summaryKey: 'test.summary',
  tags: ['war'],
  location: { lon: 116.4, lat: 39.9, label: '长平' },
  battle: {
    belligerents: { attacker: '秦', defender: '赵' },
    result: 'attacker_win',
    ...overrides,
  },
});

describe('battleWeather', () => {
  describe('getWeatherLabel', () => {
    it('should return correct Chinese label for each weather type', () => {
      expect(getWeatherLabel('clear')).toBe('晴天');
      expect(getWeatherLabel('rainy')).toBe('雨天');
      expect(getWeatherLabel('snowy')).toBe('雪天');
      expect(getWeatherLabel('windy')).toBe('大风');
      expect(getWeatherLabel('foggy')).toBe('雾天');
      expect(getWeatherLabel('stormy')).toBe('暴风雨');
      expect(getWeatherLabel('cloudy')).toBe('多云');
      expect(getWeatherLabel('hot')).toBe('炎热');
      expect(getWeatherLabel('cold')).toBe('寒冷');
      expect(getWeatherLabel('unknown')).toBe('未知');
    });

    it('should return empty string for undefined', () => {
      expect(getWeatherLabel(undefined)).toBe('');
    });
  });

  describe('getWeatherStats', () => {
    it('should return correct weather stats', () => {
      const events: Event[] = [
        createMockBattle({ weather: ['clear'] }),
        createMockBattle({ weather: ['rainy', 'windy'] }),
        createMockBattle({ weather: undefined }),
      ];
      
      const stats = getWeatherStats(events);
      expect(stats.get('clear')).toBe(1);
      expect(stats.get('rainy')).toBe(1);
      expect(stats.get('windy')).toBe(1);
      expect(stats.get('unknown')).toBe(1);
    });

    it('should return empty map for empty array', () => {
      const stats = getWeatherStats([]);
      expect(stats.size).toBe(0);
    });
  });

  describe('getAllWeatherStats', () => {
    it('should return all weather types with counts', () => {
      const events: Event[] = [
        createMockBattle({ weather: ['clear'] }),
        createMockBattle({ weather: ['rainy'] }),
      ];
      
      const stats = getAllWeatherStats(events);
      expect(stats.clear).toBe(1);
      expect(stats.rainy).toBe(1);
      expect(stats.snowy).toBe(0);
      expect(stats.unknown).toBe(0);
    });
  });

  describe('getMostCommonWeather', () => {
    it('should return the most common weather', () => {
      const events: Event[] = [
        createMockBattle({ weather: ['clear'] }),
        createMockBattle({ weather: ['clear'] }),
        createMockBattle({ weather: ['rainy'] }),
      ];
      
      const result = getMostCommonWeather(events);
      expect(result?.weather).toBe('clear');
      expect(result?.count).toBe(2);
    });

    it('should return null for empty array', () => {
      const result = getMostCommonWeather([]);
      expect(result).toBeNull();
    });
  });

  describe('getKnownWeatherCount', () => {
    it('should return count of battles with known weather', () => {
      const events: Event[] = [
        createMockBattle({ weather: ['clear'] }),
        createMockBattle({ weather: ['unknown'] }),
        createMockBattle({ weather: undefined }),
      ];
      
      expect(getKnownWeatherCount(events)).toBe(1);
    });
  });

  describe('getBattlesByWeather', () => {
    it('should filter battles by weather type', () => {
      const events: Event[] = [
        createMockBattle({ weather: ['clear'] }),
        createMockBattle({ weather: ['rainy'] }),
        createMockBattle({ weather: ['clear'] }),
      ];
      
      const clearBattles = getBattlesByWeather(events, 'clear');
      expect(clearBattles.length).toBe(2);
    });
  });

  describe('getWeatherOutcomeCorrelation', () => {
    it('should calculate correct correlation between weather and outcome', () => {
      const events: Event[] = [
        createMockBattle({ weather: ['clear'], result: 'attacker_win' }),
        createMockBattle({ weather: ['clear'], result: 'attacker_win' }),
        createMockBattle({ weather: ['rainy'], result: 'defender_win' }),
      ];
      
      const correlation = getWeatherOutcomeCorrelation(events);
      
      const clearData = correlation.get('clear');
      expect(clearData?.attackerWin).toBe(2);
      expect(clearData?.defenderWin).toBe(0);
      
      const rainyData = correlation.get('rainy');
      expect(rainyData?.attackerWin).toBe(0);
      expect(rainyData?.defenderWin).toBe(1);
    });
  });

  describe('getWeatherAttackerDefenderAnalysis', () => {
    it('should calculate win rates for each weather', () => {
      const events: Event[] = [
        createMockBattle({ weather: ['clear'], result: 'attacker_win' }),
        createMockBattle({ weather: ['clear'], result: 'attacker_win' }),
        createMockBattle({ weather: ['clear'], result: 'defender_win' }),
        createMockBattle({ weather: ['rainy'], result: 'defender_win' }),
        createMockBattle({ weather: ['rainy'], result: 'defender_win' }),
      ];
      
      const analysis = getWeatherAttackerDefenderAnalysis(events);
      
      // clear: 2 attacker wins, 1 defender win = 67% attacker, 33% defender
      expect(analysis.clear.attackerWinRate).toBe(67);
      expect(analysis.clear.defenderWinRate).toBe(33);
      
      // rainy: 0 attacker wins, 2 defender wins = 0% attacker, 100% defender
      expect(analysis.rainy.attackerWinRate).toBe(0);
      expect(analysis.rainy.defenderWinRate).toBe(100);
    });
  });

  describe('getWeatherInsights', () => {
    it('should generate insights when data is available', () => {
      const events: Event[] = [
        createMockBattle({ weather: ['clear'], result: 'attacker_win' }),
        createMockBattle({ weather: ['clear'], result: 'attacker_win' }),
        createMockBattle({ weather: ['rainy'], result: 'defender_win' }),
      ];
      
      const insights = getWeatherInsights(events);
      expect(insights.length).toBeGreaterThan(0);
      expect(insights[0]).toContain('晴天');
    });

    it('should return message when no data available', () => {
      const events: Event[] = [
        createMockBattle({ weather: undefined, result: 'attacker_win' }),
      ];
      
      const insights = getWeatherInsights(events);
      expect(insights).toContain('目前没有足够的天气数据进行分析');
    });
  });

  describe('getWeatherSummary', () => {
    it('should return complete summary', () => {
      const events: Event[] = [
        createMockBattle({ weather: ['clear'], result: 'attacker_win' }),
        createMockBattle({ weather: ['rainy'], result: 'defender_win' }),
      ];
      
      const summary = getWeatherSummary(events);
      
      expect(summary.totalBattles).toBe(2);
      expect(summary.knownWeatherCount).toBe(2);
      expect(summary.coverage).toBe(100);
      expect(summary.stats.clear).toBe(1);
      expect(summary.stats.rainy).toBe(1);
      expect(summary.insights.length).toBeGreaterThan(0);
    });
  });

  describe('hasWeatherData', () => {
    it('should return true when battles have weather data', () => {
      const events: Event[] = [
        createMockBattle({ weather: ['clear'] }),
      ];
      expect(hasWeatherData(events)).toBe(true);
    });

    it('should return false when no battles have weather data', () => {
      const events: Event[] = [
        createMockBattle({ weather: undefined }),
      ];
      expect(hasWeatherData(events)).toBe(false);
    });

    it('should return false when weather is unknown', () => {
      const events: Event[] = [
        createMockBattle({ weather: ['unknown'] }),
      ];
      expect(hasWeatherData(events)).toBe(false);
    });
  });
});
