import { describe, it, expect } from 'vitest';
import type { Event } from './types';
import {
  getBattlesWithTurningPoints,
  hasTurningPointData,
  getTurningPointTypeStats,
  getMostCommonTurningPointTypes,
  getTurningPointsByParty,
  getTurningPointImpactStats,
  getBattlesByTurningPointType,
  getTurningPointOutcomeCorrelation,
  getBattlesWithMostTurningPoints,
  getTurningPointInsights,
  getTurningPointSummary,
} from './battleTurningPoints';

const createMockBattle = (overrides: Partial<Event['battle']> = {}): Event => ({
  id: 'test-battle',
  entityId: 'test-era',
  year: -260,
  titleKey: 'battle.title',
  summaryKey: 'battle.summary',
  tags: ['war'],
  battle: {
    belligerents: {
      attacker: '秦',
      defender: '赵',
    },
    result: 'attacker_win',
    turningPoints: [],
    ...overrides,
  },
});

const mockEvents: Event[] = [
  {
    id: 'battle-1',
    entityId: 'qin',
    year: -260,
    titleKey: 'battle.changping',
    summaryKey: 'battle.changping.desc',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '秦', defender: '赵' },
      result: 'attacker_win',
      turningPoints: [
        {
          type: 'commander-death',
          description: '赵括突围被杀',
          party: 'defender',
          impact: 'negative',
        },
        {
          type: 'flank-collapse',
          description: '秦军两侧夹击',
          party: 'attacker',
          impact: 'positive',
        },
      ],
    },
  },
  {
    id: 'battle-2',
    entityId: 'qin',
    year: -207,
    titleKey: 'battle.juliu',
    summaryKey: 'battle.juliu.desc',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '项羽', defender: '秦军' },
      result: 'attacker_win',
      turningPoints: [
        {
          type: 'reinforcement-arrival',
          description: '楚军援军到达',
          party: 'attacker',
          impact: 'positive',
        },
      ],
    },
  },
  {
    id: 'battle-3',
    entityId: 'han',
    year: -202,
    titleKey: 'battle.gaixia',
    summaryKey: 'battle.gaixia.desc',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '刘邦', defender: '项羽' },
      result: 'attacker_win',
      turningPoints: [
        {
          type: 'defection',
          description: '项王部将倒戈',
          party: 'defender',
          impact: 'negative',
        },
        {
          type: 'strategic-mistake',
          description: '项羽拒绝渡江',
          party: 'defender',
          impact: 'negative',
        },
      ],
    },
  },
  {
    id: 'battle-4',
    entityId: 'qin',
    year: -227,
    titleKey: 'battle.yangling',
    summaryKey: 'battle.yangling.desc',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '秦', defender: '赵' },
      result: 'attacker_win',
      // No turning points
    },
  },
  {
    id: 'event-1',
    entityId: 'zhou',
    year: -1046,
    titleKey: 'event.zhou',
    summaryKey: 'event.zhou.desc',
    tags: [],
    // Not a battle
  },
];

describe('battleTurningPoints', () => {
  describe('getBattlesWithTurningPoints', () => {
    it('should return battles with turning points', () => {
      const result = getBattlesWithTurningPoints(mockEvents);
      expect(result.length).toBe(3);
    });

    it('should return empty array when no battles have turning points', () => {
      const eventsWithoutTurningPoints: Event[] = [
        createMockBattle({ turningPoints: undefined }),
      ];
      const result = getBattlesWithTurningPoints(eventsWithoutTurningPoints);
      expect(result.length).toBe(0);
    });
  });

  describe('hasTurningPointData', () => {
    it('should return true when there is turning point data', () => {
      expect(hasTurningPointData(mockEvents)).toBe(true);
    });

    it('should return false when there is no turning point data', () => {
      const eventsWithoutTurningPoints: Event[] = [
        createMockBattle({ turningPoints: undefined }),
        createMockBattle({ turningPoints: [] }),
      ];
      expect(hasTurningPointData(eventsWithoutTurningPoints)).toBe(false);
    });
  });

  describe('getTurningPointTypeStats', () => {
    it('should return correct type statistics', () => {
      const stats = getTurningPointTypeStats(mockEvents);
      expect(stats['commander-death']).toBe(1);
      expect(stats['flank-collapse']).toBe(1);
      expect(stats['reinforcement-arrival']).toBe(1);
      expect(stats['defection']).toBe(1);
      expect(stats['strategic-mistake']).toBe(1);
    });

    it('should return zero for types without data', () => {
      const stats = getTurningPointTypeStats(mockEvents);
      expect(stats['ambush-triggered']).toBe(0);
      expect(stats['weather-change']).toBe(0);
    });
  });

  describe('getMostCommonTurningPointTypes', () => {
    it('should return types sorted by count', () => {
      const result = getMostCommonTurningPointTypes(mockEvents);
      expect(result[0].count).toBeGreaterThanOrEqual(result[1].count);
    });

    it('should return empty array when no data', () => {
      const eventsWithoutData: Event[] = [
        createMockBattle({ turningPoints: undefined }),
      ];
      const result = getMostCommonTurningPointTypes(eventsWithoutData);
      expect(result.length).toBe(0);
    });
  });

  describe('getTurningPointsByParty', () => {
    it('should return party statistics', () => {
      const stats = getTurningPointsByParty(mockEvents);
      expect(stats.attacker).toBe(2);
      expect(stats.defender).toBe(3);
      expect(stats.both).toBe(0);
    });
  });

  describe('getTurningPointImpactStats', () => {
    it('should return impact statistics', () => {
      const stats = getTurningPointImpactStats(mockEvents);
      // 5 total turning points: 3 negative, 2 positive
      expect(stats.negative).toBe(3);
      expect(stats.positive).toBe(2);
    });
  });

  describe('getBattlesByTurningPointType', () => {
    it('should return battles with specific turning point type', () => {
      const result = getBattlesByTurningPointType(mockEvents, 'commander-death');
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('battle-1');
    });

    it('should return empty array for type with no battles', () => {
      const result = getBattlesByTurningPointType(mockEvents, 'ambush-triggered');
      expect(result.length).toBe(0);
    });
  });

  describe('getTurningPointOutcomeCorrelation', () => {
    it('should return correlation data', () => {
      const correlations = getTurningPointOutcomeCorrelation(mockEvents);
      expect(correlations.length).toBeGreaterThan(0);
      
      const commanderDeath = correlations.find(c => c.type === 'commander-death');
      expect(commanderDeath).toBeDefined();
      if (commanderDeath) {
        expect(commanderDeath.total).toBe(1);
        expect(commanderDeath.attackerWins).toBe(1); // Qin won
      }
    });
  });

  describe('getBattlesWithMostTurningPoints', () => {
    it('should return battles sorted by turning point count', () => {
      const result = getBattlesWithMostTurningPoints(mockEvents);
      expect(result.length).toBe(3);
      expect(result[0].count).toBeGreaterThanOrEqual(result[1].count);
    });

    it('should respect limit parameter', () => {
      const result = getBattlesWithMostTurningPoints(mockEvents, 2);
      expect(result.length).toBe(2);
    });
  });

  describe('getTurningPointInsights', () => {
    it('should return insights array', () => {
      const insights = getTurningPointInsights(mockEvents);
      expect(insights.length).toBeGreaterThan(0);
      expect(insights[0]).toBeTypeOf('string');
    });

    it('should return default message when no data', () => {
      const eventsWithoutData: Event[] = [
        createMockBattle({ turningPoints: undefined }),
      ];
      const insights = getTurningPointInsights(eventsWithoutData);
      expect(insights).toEqual(['暂无转折点数据']);
    });
  });

  describe('getTurningPointSummary', () => {
    it('should return complete summary', () => {
      const summary = getTurningPointSummary(mockEvents);
      
      expect(summary.totalBattles).toBe(5);
      expect(summary.battlesWithTurningPoints).toBe(3);
      expect(summary.totalTurningPoints).toBe(5);
      expect(summary.typeStats).toBeDefined();
      expect(summary.partyStats).toBeDefined();
      expect(summary.impactStats).toBeDefined();
      expect(summary.topTypes.length).toBeGreaterThan(0);
      expect(summary.topBattles.length).toBe(3);
      expect(summary.insights.length).toBeGreaterThan(0);
    });
  });
});
