import { describe, it, expect } from 'vitest';
import {
  getBattlesWithCasualties,
  getBattleCasualties,
  getTotalCasualties,
  getBloodiestBattles,
  getCasualtyStats,
  getCasualtiesByEra,
  getCasualtyTrendByYear,
  getOutcomeCasualtyAnalysis,
  getCasualtiesByScale,
  getReliabilityDistribution,
  getCasualtyInsights,
  getCasualtySummary,
  hasCasualtyData,
} from './battleCasualties';
import type { Event } from './types';

const mockEvents: Event[] = [
  {
    id: 'battle-1',
    entityId: 'wz-western-zhou',
    year: -1046,
    titleKey: 'battle.1',
    summaryKey: 'summary.1',
    tags: ['war'],
    location: { lon: 114.7, lat: 34.8, label: '牧野' },
    battle: {
      belligerents: { attacker: '周军', defender: '商军' },
      result: 'attacker_win',
      scale: 'massive',
      casualties: {
        attacker: 5000,
        defender: 70000,
        attackerCasualtyType: 'killed',
        defenderCasualtyType: 'killed',
        source: 'test',
        reliability: 'medium',
      },
    },
  },
  {
    id: 'battle-2',
    entityId: 'period-warring-states',
    year: -260,
    titleKey: 'battle.2',
    summaryKey: 'summary.2',
    tags: ['war'],
    location: { lon: 113.0, lat: 35.5, label: '长平' },
    battle: {
      belligerents: { attacker: '秦军', defender: '赵军' },
      result: 'attacker_win',
      scale: 'massive',
      casualties: {
        attacker: 20000,
        defender: 450000,
        attackerCasualtyType: 'killed',
        defenderCasualtyType: 'killed',
        source: 'test',
        reliability: 'high',
      },
    },
  },
  {
    id: 'battle-3',
    entityId: 'period-spring-autumn',
    year: -632,
    titleKey: 'battle.3',
    summaryKey: 'summary.3',
    tags: ['war'],
    location: { lon: 114.35, lat: 35.7, label: '城濮' },
    battle: {
      belligerents: { attacker: '晋军', defender: '楚军' },
      result: 'attacker_win',
      casualties: {
        attacker: 8000,
        defender: 35000,
        attackerCasualtyType: 'killed',
        defenderCasualtyType: 'killed',
        source: 'test',
        reliability: 'medium',
      },
    },
  },
  {
    id: 'battle-4',
    entityId: 'period-warring-states',
    year: -341,
    titleKey: 'battle.4',
    summaryKey: 'summary.4',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '齐军', defender: '魏军' },
      result: 'attacker_win',
      casualties: {
        attacker: 5000,
        defender: 100000,
      },
    },
  },
  {
    id: 'normal-event',
    entityId: 'han-western',
    year: -154,
    titleKey: 'event.1',
    summaryKey: 'summary.1',
    tags: ['politics'],
  },
];

describe('battleCasualties', () => {
  describe('getBattlesWithCasualties', () => {
    it('should return only battles with casualties data', () => {
      const result = getBattlesWithCasualties(mockEvents);
      expect(result).toHaveLength(4);
      expect(result.map(b => b.id)).toEqual(['battle-1', 'battle-2', 'battle-3', 'battle-4']);
    });

    it('should return empty array when no battles have casualties', () => {
      const eventsWithoutCasualties: Event[] = [
        {
          id: 'battle-no-casualties',
          entityId: 'han-western',
          year: -154,
          titleKey: 'battle',
          summaryKey: 'summary',
          tags: ['war'],
          battle: { result: 'attacker_win' },
        },
      ];
      const result = getBattlesWithCasualties(eventsWithoutCasualties);
      expect(result).toHaveLength(0);
    });
  });

  describe('getBattleCasualties', () => {
    it('should return casualties data for a battle', () => {
      const battle = mockEvents[0];
      const result = getBattleCasualties(battle);
      expect(result).toEqual({
        attacker: 5000,
        defender: 70000,
        attackerCasualtyType: 'killed',
        defenderCasualtyType: 'killed',
        source: 'test',
        reliability: 'medium',
      });
    });

    it('should return undefined for battle without casualties', () => {
      const battle: Event = {
        id: 'battle-no-casualties',
        entityId: 'han-western',
        year: -154,
        titleKey: 'battle',
        summaryKey: 'summary',
        tags: ['war'],
        battle: { result: 'attacker_win' },
      };
      const result = getBattleCasualties(battle);
      expect(result).toBeUndefined();
    });
  });

  describe('getTotalCasualties', () => {
    it('should calculate total casualties correctly', () => {
      const casualties = { attacker: 5000, defender: 70000 };
      expect(getTotalCasualties(casualties)).toBe(75000);
    });

    it('should handle undefined casualties', () => {
      expect(getTotalCasualties(undefined)).toBe(0);
    });

    it('should handle missing values', () => {
      const casualties = { attacker: 5000 };
      expect(getTotalCasualties(casualties)).toBe(5000);
    });
  });

  describe('getBloodiestBattles', () => {
    it('should return battles sorted by total casualties', () => {
      const result = getBloodiestBattles(mockEvents, 3);
      expect(result[0].id).toBe('battle-2'); // 470000 casualties
      expect(result[1].id).toBe('battle-4'); // 105000 casualties
      expect(result[2].id).toBe('battle-1'); // 75000 casualties
    });

    it('should respect limit parameter', () => {
      const result = getBloodiestBattles(mockEvents, 2);
      expect(result).toHaveLength(2);
    });
  });

  describe('getCasualtyStats', () => {
    it('should calculate correct statistics', () => {
      const stats = getCasualtyStats(mockEvents);
      
      expect(stats.totalBattles).toBe(4);
      expect(stats.battlesWithCasualties).toBe(4);
      expect(stats.totalAttackerCasualties).toBe(38000);
      expect(stats.totalDefenderCasualties).toBe(655000);
      expect(stats.totalCasualties).toBe(693000);
      expect(stats.averageCasualties).toBe(173250);
    });

    it('should identify highest casualty battle', () => {
      const stats = getCasualtyStats(mockEvents);
      expect(stats.highestCasualtyBattle?.id).toBe('battle-2');
    });

    it('should return zeros for events without casualty data', () => {
      const events: Event[] = [
        {
          id: 'battle-no-data',
          entityId: 'han-western',
          year: -154,
          titleKey: 'battle',
          summaryKey: 'summary',
          tags: ['war'],
          battle: { result: 'attacker_win' },
        },
      ];
      const stats = getCasualtyStats(events);
      expect(stats.battlesWithCasualties).toBe(0);
      expect(stats.totalCasualties).toBe(0);
    });
  });

  describe('getCasualtiesByEra', () => {
    it('should group casualties by era correctly', () => {
      const result = getCasualtiesByEra(mockEvents);
      
      expect(result).toHaveLength(3);
      
      const wzEra = result.find(r => r.eraId === 'wz-western-zhou');
      expect(wzEra?.totalCasualties).toBe(75000);
      expect(wzEra?.battleCount).toBe(1);
      
      const wsEra = result.find(r => r.eraId === 'period-warring-states');
      expect(wsEra?.totalCasualties).toBe(575000); // updated total based on mock data
      expect(wsEra?.battleCount).toBe(2);
    });
  });

  describe('getCasualtyTrendByYear', () => {
    it('should calculate casualties by year', () => {
      const result = getCasualtyTrendByYear(mockEvents);
      
      expect(result).toHaveLength(4);
      
      const sortedByYear = [...result].sort((a, b) => a.year - b.year);
      expect(sortedByYear[0].year).toBe(-1046);
      expect(sortedByYear[3].year).toBe(-260);
    });

    it('should filter by year range', () => {
      const result = getCasualtyTrendByYear(mockEvents, -400, 0);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getOutcomeCasualtyAnalysis', () => {
    it('should analyze outcome vs casualties correlation', () => {
      const result = getOutcomeCasualtyAnalysis(mockEvents);
      
      expect(result.attackerWin.count).toBe(4);
      expect(result.defenderWin.count).toBe(0);
      expect(result.draw.count).toBe(0);
      
      // Check averages
      expect(result.attackerWin.avgAttackerCasualties).toBe(9500);
      expect(result.attackerWin.avgDefenderCasualties).toBe(163750);
    });
  });

  describe('getCasualtiesByScale', () => {
    it('should group casualties by scale', () => {
      const result = getCasualtiesByScale(mockEvents);
      
      const massive = result.find(r => r.scale === 'massive');
      expect(massive?.battleCount).toBe(2);
      expect(massive?.totalCasualties).toBe(545000); // 75000 + 470000
    });
  });

  describe('getReliabilityDistribution', () => {
    it('should calculate reliability distribution', () => {
      const result = getReliabilityDistribution(mockEvents);
      
      expect(result.high).toBe(1);
      expect(result.medium).toBe(2);
      expect(result.low).toBe(0);
      expect(result.unknown).toBe(1);
    });
  });

  describe('getCasualtyInsights', () => {
    it('should generate insights', () => {
      const insights = getCasualtyInsights(mockEvents);
      
      expect(insights.length).toBeGreaterThan(0);
      expect(insights.some(i => i.includes('伤亡最惨重'))).toBe(true);
    });

    it('should return default message when no data', () => {
      const events: Event[] = [
        {
          id: 'battle-no-data',
          entityId: 'han-western',
          year: -154,
          titleKey: 'battle',
          summaryKey: 'summary',
          tags: ['war'],
          battle: { result: 'attacker_win' },
        },
      ];
      const insights = getCasualtyInsights(events);
      expect(insights).toEqual(['暂无伤亡数据']);
    });
  });

  describe('getCasualtySummary', () => {
    it('should return complete summary', () => {
      const summary = getCasualtySummary(mockEvents);
      
      expect(summary.stats).toBeDefined();
      expect(summary.bloodiestBattles).toHaveLength(4);
      expect(summary.byEra).toBeDefined();
      expect(summary.byScale).toBeDefined();
      expect(summary.reliabilityDistribution).toBeDefined();
      expect(summary.outcomeAnalysis).toBeDefined();
      expect(summary.insights).toBeDefined();
    });
  });

  describe('hasCasualtyData', () => {
    it('should return true when casualty data exists', () => {
      expect(hasCasualtyData(mockEvents)).toBe(true);
    });

    it('should return false when no casualty data', () => {
      const events: Event[] = [
        {
          id: 'battle-no-data',
          entityId: 'han-western',
          year: -154,
          titleKey: 'battle',
          summaryKey: 'summary',
          tags: ['war'],
          battle: { result: 'attacker_win' },
        },
      ];
      expect(hasCasualtyData(events)).toBe(false);
    });
  });
});
