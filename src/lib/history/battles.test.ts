import { describe, it, expect } from 'vitest';
import { 
  getBattles, 
  getBattleResultLabel, 
  sortBattlesByYear,
  getBattlesByYearRange,
  getBattleParties,
  isBattleComplete,
  separateBattlesAndEvents,
  getMappableEvents,
  getBattleStats,
  getBattleCountByEra,
  getEraColor,
  groupBattlesByWar,
} from './battles';
import type { Event } from './types';

describe('battles', () => {
  const mockEvents: Event[] = [
    {
      id: 'battle-1',
      entityId: 'era1',
      year: -632,
      titleKey: 'event.sa-632-chengpu.title',
      summaryKey: 'event.sa-632-chengpu.summary',
      tags: ['war'],
      location: { lon: 114.35, lat: 35.7, label: 'Chengpu' },
      battle: {
        belligerents: {
          attacker: '晋军',
          defender: '楚军',
        },
        result: 'attacker_win',
      },
    },
    {
      id: 'battle-2',
      entityId: 'era1',
      year: -260,
      titleKey: 'event.ws-260-changping.title',
      summaryKey: 'event.ws-260-changping.summary',
      tags: ['war'],
      location: { lon: 113.4, lat: 35.9, label: 'Changping' },
      battle: {
        belligerents: {
          attacker: '秦军',
          defender: '赵军',
        },
        result: 'attacker_win',
      },
    },
    {
      id: 'non-battle',
      entityId: 'era1',
      year: -500,
      titleKey: 'event.other.title',
      summaryKey: 'event.other.summary',
      tags: ['politics'],
    },
  ];

  describe('getBattles', () => {
    it('should filter events to only return battles', () => {
      const battles = getBattles(mockEvents);
      expect(battles).toHaveLength(2);
      expect(battles.every(b => b.tags?.includes('war'))).toBe(true);
    });

    it('should return empty array when no battles', () => {
      const eventsWithoutWar = mockEvents.filter(e => !e.tags?.includes('war'));
      const battles = getBattles(eventsWithoutWar);
      expect(battles).toHaveLength(0);
    });
  });

  describe('getBattleResultLabel', () => {
    it('should return correct label for attacker win', () => {
      expect(getBattleResultLabel({ result: 'attacker_win' })).toBe('进攻方胜利');
    });

    it('should return correct label for defender win', () => {
      expect(getBattleResultLabel({ result: 'defender_win' })).toBe('防守方胜利');
    });

    it('should return correct label for draw', () => {
      expect(getBattleResultLabel({ result: 'draw' })).toBe('平局');
    });

    it('should return empty string for undefined', () => {
      expect(getBattleResultLabel(undefined)).toBe('');
    });

    it('should return empty string for unknown result', () => {
      expect(getBattleResultLabel({ result: 'unknown' as any })).toBe('');
    });
  });

  describe('sortBattlesByYear', () => {
    it('should sort battles by year ascending', () => {
      const battles = getBattles(mockEvents);
      const sorted = sortBattlesByYear(battles, true);
      expect(sorted[0].year).toBe(-632);
      expect(sorted[1].year).toBe(-260);
    });

    it('should sort battles by year descending', () => {
      const battles = getBattles(mockEvents);
      const sorted = sortBattlesByYear(battles, false);
      expect(sorted[0].year).toBe(-260);
      expect(sorted[1].year).toBe(-632);
    });

    it('should not mutate original array', () => {
      const battles = getBattles(mockEvents);
      const originalFirst = battles[0];
      sortBattlesByYear(battles);
      expect(battles[0]).toBe(originalFirst);
    });
  });

  describe('getBattlesByYearRange', () => {
    it('should filter battles within year range', () => {
      const battles = getBattlesByYearRange(mockEvents, -700, -300);
      expect(battles).toHaveLength(1);
      expect(battles[0].id).toBe('battle-1');
    });

    it('should return empty array when no battles in range', () => {
      const battles = getBattlesByYearRange(mockEvents, 100, 200);
      expect(battles).toHaveLength(0);
    });
  });

  describe('getBattleParties', () => {
    it('should return attacker and defender', () => {
      const battle = mockEvents[0];
      const parties = getBattleParties(battle);
      expect(parties.attacker).toBe('晋军');
      expect(parties.defender).toBe('楚军');
    });

    it('should return undefined for missing parties', () => {
      const battle: Event = {
        id: 'test',
        entityId: 'era1',
        year: -500,
        titleKey: 'test',
        summaryKey: 'test',
        tags: ['war'],
      };
      const parties = getBattleParties(battle);
      expect(parties.attacker).toBeUndefined();
      expect(parties.defender).toBeUndefined();
    });
  });

  describe('isBattleComplete', () => {
    it('should return true for complete battle', () => {
      const battle = mockEvents[0];
      expect(isBattleComplete(battle)).toBe(true);
    });

    it('should return false when missing belligerents', () => {
      const battle: Event = {
        id: 'test',
        entityId: 'era1',
        year: -500,
        titleKey: 'test',
        summaryKey: 'test',
        tags: ['war'],
        location: { lon: 0, lat: 0, label: 'test' },
        battle: { result: 'attacker_win' },
      };
      expect(isBattleComplete(battle)).toBe(false);
    });

    it('should return false when missing result', () => {
      const battle: Event = {
        id: 'test',
        entityId: 'era1',
        year: -500,
        titleKey: 'test',
        summaryKey: 'test',
        tags: ['war'],
        location: { lon: 0, lat: 0, label: 'test' },
        battle: { belligerents: { attacker: 'A', defender: 'B' } },
      };
      expect(isBattleComplete(battle)).toBe(false);
    });

    it('should return false when missing location', () => {
      const battle: Event = {
        id: 'test',
        entityId: 'era1',
        year: -500,
        titleKey: 'test',
        summaryKey: 'test',
        tags: ['war'],
        battle: { 
          belligerents: { attacker: 'A', defender: 'B' },
          result: 'attacker_win',
        },
      };
      expect(isBattleComplete(battle)).toBe(false);
    });
  });

  describe('separateBattlesAndEvents', () => {
    it('should separate battles from normal events', () => {
      const { battles, normalEvents } = separateBattlesAndEvents(mockEvents);
      expect(battles).toHaveLength(2);
      expect(normalEvents).toHaveLength(1);
      expect(normalEvents[0].id).toBe('non-battle');
    });

    it('should return empty arrays when no events', () => {
      const { battles, normalEvents } = separateBattlesAndEvents([]);
      expect(battles).toHaveLength(0);
      expect(normalEvents).toHaveLength(0);
    });

    it('should handle events without tags', () => {
      const eventsWithNoTags: Event[] = [
        {
          id: 'no-tag',
          entityId: 'era1',
          year: -500,
          titleKey: 'test',
          summaryKey: 'test',
        },
      ];
      const { battles, normalEvents } = separateBattlesAndEvents(eventsWithNoTags);
      expect(battles).toHaveLength(0);
      expect(normalEvents).toHaveLength(1);
    });
  });

  describe('getMappableEvents', () => {
    it('should filter events with valid coordinates', () => {
      const mappable = getMappableEvents(mockEvents);
      // battle-1 and battle-2 have valid locations
      expect(mappable).toHaveLength(2);
    });

    it('should exclude events without location', () => {
      const mappable = getMappableEvents(mockEvents);
      expect(mappable.every((e) => e.location !== undefined)).toBe(true);
    });

    it('should exclude events with invalid coordinates', () => {
      const eventsWithInvalid: Event[] = [
        {
          id: 'invalid',
          entityId: 'era1',
          year: -500,
          titleKey: 'test',
          summaryKey: 'test',
          location: { lon: NaN, lat: 35, label: 'invalid' },
        },
      ];
      const mappable = getMappableEvents(eventsWithInvalid);
      expect(mappable).toHaveLength(0);
    });
  });

  describe('getBattleStats', () => {
    it('should calculate correct battle statistics', () => {
      const battles = getBattles(mockEvents);
      const stats = getBattleStats(battles);
      expect(stats.total).toBe(2);
      expect(stats.attackerWins).toBe(2);
      expect(stats.defenderWins).toBe(0);
      expect(stats.draws).toBe(0);
      expect(stats.inconclusive).toBe(0);
      expect(stats.unknown).toBe(0);
    });

    it('should handle battles with various results', () => {
      const eventsWithResults: Event[] = [
        {
          id: 'b1',
          entityId: 'era1',
          year: -500,
          titleKey: 'test',
          summaryKey: 'test',
          tags: ['war'],
          battle: { result: 'attacker_win' },
        },
        {
          id: 'b2',
          entityId: 'era1',
          year: -400,
          titleKey: 'test',
          summaryKey: 'test',
          tags: ['war'],
          battle: { result: 'defender_win' },
        },
        {
          id: 'b3',
          entityId: 'era1',
          year: -300,
          titleKey: 'test',
          summaryKey: 'test',
          tags: ['war'],
          battle: { result: 'draw' },
        },
        {
          id: 'b4',
          entityId: 'era1',
          year: -200,
          titleKey: 'test',
          summaryKey: 'test',
          tags: ['war'],
          battle: { result: 'inconclusive' },
        },
        {
          id: 'b5',
          entityId: 'era1',
          year: -100,
          titleKey: 'test',
          summaryKey: 'test',
          tags: ['war'],
          battle: {},
        },
      ];
      const stats = getBattleStats(eventsWithResults);
      expect(stats.total).toBe(5);
      expect(stats.attackerWins).toBe(1);
      expect(stats.defenderWins).toBe(1);
      expect(stats.draws).toBe(1);
      expect(stats.inconclusive).toBe(1);
      expect(stats.unknown).toBe(1);
    });

    it('should return zeros for empty array', () => {
      const stats = getBattleStats([]);
      expect(stats.total).toBe(0);
      expect(stats.attackerWins).toBe(0);
      expect(stats.defenderWins).toBe(0);
    });
  });

  describe('getBattleCountByEra', () => {
    it('should count battles by era correctly', () => {
      const battles = getBattles(mockEvents);
      const eras = [
        { id: 'era1', nameKey: 'era.springAutumn' },
        { id: 'era2', nameKey: 'era.warringStates' },
      ];
      const t = (key: string) => {
        const names: Record<string, string> = {
          'era.springAutumn': '春秋',
          'era.warringStates': '战国',
        };
        return names[key] || key;
      };
      
      const counts = getBattleCountByEra(battles, eras, t);
      expect(counts).toHaveLength(1);
      expect(counts[0].eraName).toBe('春秋');
      expect(counts[0].count).toBe(2);
    });

    it('should return empty array when no battles', () => {
      const counts = getBattleCountByEra([], [], () => '');
      expect(counts).toHaveLength(0);
    });

    it('should sort by count descending', () => {
      const battles: Event[] = [
        {
          id: 'b1',
          entityId: 'era1',
          year: -500,
          titleKey: 'test',
          summaryKey: 'test',
          tags: ['war'],
        },
        {
          id: 'b2',
          entityId: 'era1',
          year: -400,
          titleKey: 'test',
          summaryKey: 'test',
          tags: ['war'],
        },
        {
          id: 'b3',
          entityId: 'era2',
          year: -300,
          titleKey: 'test',
          summaryKey: 'test',
          tags: ['war'],
        },
      ];
      const eras = [
        { id: 'era1', nameKey: 'era.1' },
        { id: 'era2', nameKey: 'era.2' },
      ];
      const counts = getBattleCountByEra(battles, eras, (k) => k);
      expect(counts[0].count).toBe(2);
      expect(counts[1].count).toBe(1);
    });
  });

  describe('getEraColor', () => {
    it('should return correct color for spring-autumn era', () => {
      expect(getEraColor('period-spring-autumn')).toBe('#3b82f6');
    });

    it('should return correct color for warring-states era', () => {
      expect(getEraColor('period-warring-states')).toBe('#a855f7');
    });

    it('should return correct color for Qin era', () => {
      expect(getEraColor('qin')).toBe('#52525b');
    });

    it('should return correct color for Han era', () => {
      expect(getEraColor('han')).toBe('#dc2626');
    });

    it('should return default color for unknown era', () => {
      expect(getEraColor('unknown-era')).toBe('#6b7280');
    });
  });

  describe('groupBattlesByWar', () => {
    it('should group battles by war name', () => {
      const battles: Event[] = [
        {
          id: 'b1',
          entityId: 'era1',
          year: -300,
          titleKey: 'war1.battle1',
          summaryKey: 'summary',
          tags: ['war'],
          battle: { warNameKey: 'war.1', belligerents: { attacker: 'A', defender: 'B' }, result: 'attacker_win' },
        },
        {
          id: 'b2',
          entityId: 'era1',
          year: -290,
          titleKey: 'war1.battle2',
          summaryKey: 'summary',
          tags: ['war'],
          battle: { warNameKey: 'war.1', belligerents: { attacker: 'A', defender: 'C' }, result: 'defender_win' },
        },
        {
          id: 'b3',
          entityId: 'era1',
          year: -200,
          titleKey: 'war2.battle1',
          summaryKey: 'summary',
          tags: ['war'],
          battle: { warNameKey: 'war.2', belligerents: { attacker: 'D', defender: 'E' }, result: 'draw' },
        },
      ];
      
      const groups = groupBattlesByWar(battles);
      expect(groups).toHaveLength(2);
      expect(groups[0].warName).toBe('war.1');
      expect(groups[0].battles).toHaveLength(2);
      expect(groups[1].warName).toBe('war.2');
      expect(groups[1].battles).toHaveLength(1);
    });

    it('should group battles without war name as independent', () => {
      const battles: Event[] = [
        {
          id: 'b1',
          entityId: 'era1',
          year: -300,
          titleKey: 'battle1',
          summaryKey: 'summary',
          tags: ['war'],
          battle: { belligerents: { attacker: 'A', defender: 'B' }, result: 'attacker_win' },
        },
        {
          id: 'b2',
          entityId: 'era1',
          year: -200,
          titleKey: 'battle2',
          summaryKey: 'summary',
          tags: ['war'],
          battle: { warNameKey: 'some.war', belligerents: { attacker: 'C', defender: 'D' }, result: 'defender_win' },
        },
      ];
      
      const groups = groupBattlesByWar(battles);
      expect(groups).toHaveLength(2);
      // First should be the independent battle (sorted by year)
      expect(groups[0].battles[0].year).toBe(-300);
      expect(groups[1].battles[0].year).toBe(-200);
    });

    it('should sort battles within war by year', () => {
      const battles: Event[] = [
        {
          id: 'b1',
          entityId: 'era1',
          year: -200,
          titleKey: 'war.battle2',
          summaryKey: 'summary',
          tags: ['war'],
          battle: { warNameKey: 'war', belligerents: { attacker: 'A', defender: 'B' } },
        },
        {
          id: 'b2',
          entityId: 'era1',
          year: -300,
          titleKey: 'war.battle1',
          summaryKey: 'summary',
          tags: ['war'],
          battle: { warNameKey: 'war', belligerents: { attacker: 'C', defender: 'D' } },
        },
      ];
      
      const groups = groupBattlesByWar(battles);
      expect(groups[0].battles[0].year).toBe(-300);
      expect(groups[0].battles[1].year).toBe(-200);
    });

    it('should return empty array for empty input', () => {
      const groups = groupBattlesByWar([]);
      expect(groups).toHaveLength(0);
    });
  });
});
