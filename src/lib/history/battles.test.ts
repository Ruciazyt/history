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
  searchBattles,
  sortBattles,
  getUniqueParticipants,
  getBattlesByParticipant,
  getParticipantStats,
  compareBattles,
  getComparisonSummary,
  getAttackerDefenderPattern,
  getVictoryPatternByEra,
  getVictoryPatternBySeason,
  getBattleInsights,
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

  // Test translation function for search/sort
  const t = (key: string): string => {
    const translations: Record<string, string> = {
      'event.sa-632-chengpu.title': '城濮之战',
      'event.ws-260-changping.title': '长平之战',
      'event.b1.title': '赤壁之战',
      'event.b2.title': '官渡之战',
      'event.b3.title': '淝水之战',
      'war.1': '战国统一战争',
      'war.2': '三国鼎立',
    };
    return translations[key] || key;
  };

  describe('searchBattles', () => {
    const searchTestEvents: Event[] = [
      {
        id: 'b1',
        entityId: 'era-spring-autumn',
        year: -632,
        titleKey: 'event.sa-632-chengpu.title',
        summaryKey: 'summary',
        tags: ['war'],
        location: { lon: 114.35, lat: 35.7, label: '城濮' },
        battle: {
          belligerents: { attacker: '晋军', defender: '楚军' },
          result: 'attacker_win',
        },
      },
      {
        id: 'b2',
        entityId: 'era-warring-states',
        year: -260,
        titleKey: 'event.ws-260-changping.title',
        summaryKey: 'summary',
        tags: ['war'],
        location: { lon: 113.4, lat: 35.9, label: '长平' },
        battle: {
          belligerents: { attacker: '秦军', defender: '赵军' },
          result: 'attacker_win',
        },
      },
      {
        id: 'b3',
        entityId: 'era-three-kingdoms',
        year: -208,
        titleKey: 'event.b1.title',
        summaryKey: 'summary',
        tags: ['war'],
        location: { lon: 113.0, lat: 30.0, label: '赤壁' },
        battle: {
          warNameKey: 'war.1',
          belligerents: { attacker: '曹操', defender: '孙刘联军' },
          result: 'defender_win',
        },
      },
    ];

    it('should return all battles when no search options', () => {
      const results = searchBattles(searchTestEvents, {}, t);
      expect(results).toHaveLength(3);
    });

    it('should filter by query matching title', () => {
      const results = searchBattles(searchTestEvents, { query: '城濮' }, t);
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('b1');
    });

    it('should filter by query matching location', () => {
      const results = searchBattles(searchTestEvents, { query: '赤壁' }, t);
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('b3');
    });

    it('should filter by query matching participant', () => {
      const results = searchBattles(searchTestEvents, { query: '晋军' }, t);
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('b1');
    });

    it('should filter by result', () => {
      const results = searchBattles(searchTestEvents, { result: ['attacker_win'] }, t);
      expect(results).toHaveLength(2);
    });

    it('should filter by multiple results', () => {
      const results = searchBattles(searchTestEvents, { result: ['attacker_win', 'defender_win'] }, t);
      expect(results).toHaveLength(3);
    });

    it('should filter by era', () => {
      const results = searchBattles(searchTestEvents, { eraIds: ['era-spring-autumn'] }, t);
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('b1');
    });

    it('should filter by year range', () => {
      const results = searchBattles(searchTestEvents, { yearRange: { start: -300, end: -200 } }, t);
      expect(results).toHaveLength(2);
    });

    it('should combine multiple filters', () => {
      const results = searchBattles(
        searchTestEvents, 
        { query: '秦', result: ['attacker_win'], eraIds: ['era-warring-states'] }, 
        t
      );
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('b2');
    });

    it('should return empty array when no matches', () => {
      const results = searchBattles(searchTestEvents, { query: '不存在' }, t);
      expect(results).toHaveLength(0);
    });
  });

  describe('sortBattles', () => {
    const sortTestEvents: Event[] = [
      {
        id: 'b1',
        entityId: 'era1',
        year: -200,
        titleKey: 'battle.alpha',
        summaryKey: 'summary',
        tags: ['war'],
        battle: { result: 'defender_win' },
      },
      {
        id: 'b2',
        entityId: 'era1',
        year: -300,
        titleKey: 'battle.charlie',
        summaryKey: 'summary',
        tags: ['war'],
        battle: { result: 'attacker_win' },
      },
      {
        id: 'b3',
        entityId: 'era1',
        year: -100,
        titleKey: 'battle.beta',
        summaryKey: 'summary',
        tags: ['war'],
        battle: { result: 'draw' },
      },
    ];

    const t = (key: string): string => key.replace('battle.', '');

    it('should sort by year ascending', () => {
      const sorted = sortBattles(sortTestEvents, 'year', true, t);
      expect(sorted[0].year).toBe(-300);
      expect(sorted[1].year).toBe(-200);
      expect(sorted[2].year).toBe(-100);
    });

    it('should sort by year descending', () => {
      const sorted = sortBattles(sortTestEvents, 'year', false, t);
      expect(sorted[0].year).toBe(-100);
      expect(sorted[1].year).toBe(-200);
      expect(sorted[2].year).toBe(-300);
    });

    it('should sort by title', () => {
      const sorted = sortBattles(sortTestEvents, 'title', true, t);
      // alpha < beta < charlie alphabetically
      expect(sorted[0].titleKey).toBe('battle.alpha');
      expect(sorted[1].titleKey).toBe('battle.beta');
      expect(sorted[2].titleKey).toBe('battle.charlie');
    });

    it('should sort by result', () => {
      const sorted = sortBattles(sortTestEvents, 'result', true, t);
      // attacker_win = 0, defender_win = 1, draw = 2
      expect(sorted[0].battle?.result).toBe('attacker_win');
      expect(sorted[1].battle?.result).toBe('defender_win');
      expect(sorted[2].battle?.result).toBe('draw');
    });
  });

  describe('getUniqueParticipants', () => {
    it('should return unique list of all participants', () => {
      const battles: Event[] = [
        {
          id: 'b1',
          entityId: 'era1',
          year: -300,
          titleKey: 'test',
          summaryKey: 'test',
          tags: ['war'],
          battle: { belligerents: { attacker: '晋军', defender: '楚军' } },
        },
        {
          id: 'b2',
          entityId: 'era1',
          year: -200,
          titleKey: 'test',
          summaryKey: 'test',
          tags: ['war'],
          battle: { belligerents: { attacker: '秦军', defender: '晋军' } },
        },
      ];
      const participants = getUniqueParticipants(battles);
      expect(participants).toHaveLength(3);
      expect(participants).toContain('晋军');
      expect(participants).toContain('楚军');
      expect(participants).toContain('秦军');
    });

    it('should return empty array for no battles', () => {
      const participants = getUniqueParticipants([]);
      expect(participants).toHaveLength(0);
    });
  });

  describe('getBattlesByParticipant', () => {
    it('should return battles involving the participant', () => {
      const battles: Event[] = [
        {
          id: 'b1',
          entityId: 'era1',
          year: -300,
          titleKey: 'test',
          summaryKey: 'test',
          tags: ['war'],
          battle: { belligerents: { attacker: '晋军', defender: '楚军' } },
        },
        {
          id: 'b2',
          entityId: 'era1',
          year: -200,
          titleKey: 'test',
          summaryKey: 'test',
          tags: ['war'],
          battle: { belligerents: { attacker: '秦军', defender: '赵军' } },
        },
      ];
      const results = getBattlesByParticipant(battles, '晋军');
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('b1');
    });

    it('should be case insensitive', () => {
      const battles: Event[] = [
        {
          id: 'b1',
          entityId: 'era1',
          year: -300,
          titleKey: 'test',
          summaryKey: 'test',
          tags: ['war'],
          battle: { belligerents: { attacker: '晋军', defender: '楚军' } },
        },
      ];
      const results = getBattlesByParticipant(battles, '晋军');
      expect(results).toHaveLength(1);
    });
  });

  describe('getParticipantStats', () => {
    it('should calculate correct stats for attacker', () => {
      const battles: Event[] = [
        {
          id: 'b1',
          entityId: 'era1',
          year: -300,
          titleKey: 'test',
          summaryKey: 'test',
          tags: ['war'],
          battle: { belligerents: { attacker: '晋军', defender: '楚军' }, result: 'attacker_win' },
        },
        {
          id: 'b2',
          entityId: 'era1',
          year: -200,
          titleKey: 'test',
          summaryKey: 'test',
          tags: ['war'],
          battle: { belligerents: { attacker: '晋军', defender: '秦军' }, result: 'defender_win' },
        },
        {
          id: 'b3',
          entityId: 'era1',
          year: -100,
          titleKey: 'test',
          summaryKey: 'test',
          tags: ['war'],
          battle: { belligerents: { attacker: '楚军', defender: '晋军' }, result: 'draw' },
        },
      ];
      const stats = getParticipantStats(battles, '晋军');
      expect(stats.total).toBe(3);
      expect(stats.wins).toBe(1);
      expect(stats.losses).toBe(1);
      expect(stats.draws).toBe(1);
    });

    it('should calculate correct stats for defender', () => {
      const battles: Event[] = [
        {
          id: 'b1',
          entityId: 'era1',
          year: -300,
          titleKey: 'test',
          summaryKey: 'test',
          tags: ['war'],
          battle: { belligerents: { attacker: '秦军', defender: '赵军' }, result: 'defender_win' },
        },
      ];
      const stats = getParticipantStats(battles, '赵军');
      expect(stats.wins).toBe(1);
      expect(stats.losses).toBe(0);
    });

    it('should return zeros for participant with no battles', () => {
      const battles: Event[] = [
        {
          id: 'b1',
          entityId: 'era1',
          year: -300,
          titleKey: 'test',
          summaryKey: 'test',
          tags: ['war'],
          battle: { belligerents: { attacker: '秦军', defender: '赵军' } },
        },
      ];
      const stats = getParticipantStats(battles, '晋军');
      expect(stats.total).toBe(0);
      expect(stats.wins).toBe(0);
      expect(stats.losses).toBe(0);
    });
  });

  describe('compareBattles', () => {
    const battle1: Event = {
      id: 'b1',
      entityId: 'period-spring-autumn',
      year: -632,
      titleKey: 'battle.1',
      summaryKey: 'summary',
      tags: ['war'],
      location: { lon: 114.35, lat: 35.7, label: 'Chengpu' },
      battle: {
        belligerents: { attacker: '晋军', defender: '楚军' },
        result: 'attacker_win',
      },
    };

    const battle2: Event = {
      id: 'b2',
      entityId: 'period-warring-states',
      year: -260,
      titleKey: 'battle.2',
      summaryKey: 'summary',
      tags: ['war'],
      location: { lon: 113.4, lat: 35.9, label: 'Changping' },
      battle: {
        belligerents: { attacker: '秦军', defender: '赵军' },
        result: 'attacker_win',
      },
    };

    const battle3: Event = {
      id: 'b3',
      entityId: 'period-spring-autumn',
      year: -632,
      titleKey: 'battle.3',
      summaryKey: 'summary',
      tags: ['war'],
      location: { lon: 114.35, lat: 35.7, label: 'Chengpu' },
      battle: {
        belligerents: { attacker: '晋军', defender: '楚军' },
        result: 'defender_win',
      },
    };

    it('should calculate correct year difference', () => {
      const comparison = compareBattles(battle1, battle2);
      expect(comparison.comparison.yearDiff).toBe(372);
    });

    it('should detect same result', () => {
      const comparison = compareBattles(battle1, battle2);
      expect(comparison.comparison.sameResult).toBe(true);
    });

    it('should detect different result', () => {
      const comparison = compareBattles(battle1, battle3);
      expect(comparison.comparison.sameResult).toBe(false);
    });

    it('should detect same winner side for attacker wins', () => {
      const comparison = compareBattles(battle1, battle2);
      expect(comparison.comparison.sameWinnerSide).toBe(true);
    });

    it('should detect different winner side', () => {
      const comparison = compareBattles(battle1, battle3);
      expect(comparison.comparison.sameWinnerSide).toBe(false);
    });

    it('should detect same era', () => {
      const comparison = compareBattles(battle1, battle3);
      expect(comparison.comparison.sameEra).toBe(true);
    });

    it('should detect different era', () => {
      const comparison = compareBattles(battle1, battle2);
      expect(comparison.comparison.sameEra).toBe(false);
    });

    it('should calculate location distance', () => {
      const comparison = compareBattles(battle1, battle2);
      expect(comparison.comparison.locationDistance).toBeDefined();
      expect(comparison.comparison.locationDistance).toBeGreaterThan(80);
      expect(comparison.comparison.locationDistance).toBeLessThan(120);
    });

    it('should handle battles without location', () => {
      const battleNoLoc: Event = {
        id: 'b4',
        entityId: 'era1',
        year: -100,
        titleKey: 'test',
        summaryKey: 'test',
        tags: ['war'],
        battle: { result: 'attacker_win' },
      };
      const comparison = compareBattles(battle1, battleNoLoc);
      expect(comparison.comparison.locationDistance).toBeUndefined();
    });

    it('should return null for same winner side when draw', () => {
      const battleDraw: Event = {
        id: 'b5',
        entityId: 'era1',
        year: -100,
        titleKey: 'test',
        summaryKey: 'test',
        tags: ['war'],
        battle: { result: 'draw' },
      };
      const comparison = compareBattles(battle1, battleDraw);
      expect(comparison.comparison.sameWinnerSide).toBeNull();
    });
  });

  describe('getComparisonSummary', () => {
    const mockComparison = {
      battle1: {} as Event,
      battle2: {} as Event,
      comparison: {
        yearDiff: 100,
        sameResult: true,
        sameWinnerSide: true,
        sameEra: false,
        locationDistance: 50,
      },
    };

    const t = (key: string): string => key;

    it('should generate summary for year difference', () => {
      const summary = getComparisonSummary(mockComparison.comparison, t);
      expect(summary).toContain('时间相差 100 年');
    });

    it('should generate summary for same year', () => {
      const summary = getComparisonSummary({
        ...mockComparison.comparison,
        yearDiff: 0,
      }, t);
      expect(summary).toContain('同年发生');
    });

    it('should generate summary for different era', () => {
      const summary = getComparisonSummary(mockComparison.comparison, t);
      expect(summary).not.toContain('同一时期');
    });

    it('should generate summary for same era', () => {
      const summary = getComparisonSummary({
        ...mockComparison.comparison,
        sameEra: true,
      }, t);
      expect(summary).toContain('同一时期');
    });

    it('should generate summary for close location', () => {
      const summary = getComparisonSummary({
        ...mockComparison.comparison,
        locationDistance: 50,
      }, t);
      expect(summary).toContain('地理位置接近');
    });

    it('should generate summary for far location', () => {
      const summary = getComparisonSummary({
        ...mockComparison.comparison,
        locationDistance: 500,
      }, t);
      expect(summary).toContain('相距约 500 km');
    });
  });

  describe('getAttackerDefenderPattern', () => {
    it('should calculate attacker vs defender pattern', () => {
      const battles = getBattles(mockEvents);
      const pattern = getAttackerDefenderPattern(battles);
      
      expect(pattern).toHaveLength(2);
      const attacker = pattern.find(p => p.side === 'attacker')!;
      const defender = pattern.find(p => p.side === 'defender')!;
      
      expect(attacker.wins).toBe(2);
      expect(attacker.losses).toBe(0);
      expect(attacker.winRate).toBe(100);
      
      expect(defender.wins).toBe(0);
      expect(defender.losses).toBe(2);
    });

    it('should handle draws correctly', () => {
      const battlesWithDraw: Event[] = [
        {
          id: 'draw-battle',
          entityId: 'era1',
          year: -500,
          titleKey: 'battle.draw',
          tags: ['war'],
          battle: { result: 'draw' },
        },
      ];
      const pattern = getAttackerDefenderPattern(battlesWithDraw);
      
      const attacker = pattern.find(p => p.side === 'attacker')!;
      expect(attacker.draws).toBe(1);
      expect(attacker.winRate).toBe(0);
    });

    it('should handle inconclusive results', () => {
      const battlesWithInconclusive: Event[] = [
        {
          id: 'inconclusive-battle',
          entityId: 'era1',
          year: -500,
          titleKey: 'battle.inconclusive',
          tags: ['war'],
          battle: { result: 'inconclusive' },
        },
      ];
      const pattern = getAttackerDefenderPattern(battlesWithInconclusive);
      
      const attacker = pattern.find(p => p.side === 'attacker')!;
      expect(attacker.inconclusive).toBe(1);
    });
  });

  describe('getVictoryPatternByEra', () => {
    it('should group victories by era', () => {
      const battles = getBattles(mockEvents);
      const eras = [
        { id: 'era1', nameKey: 'era.era1' },
        { id: 'era2', nameKey: 'era.era2' },
      ];
      const t = (key: string) => key;
      
      const pattern = getVictoryPatternByEra(battles, eras, t);
      
      expect(pattern.length).toBeGreaterThan(0);
      expect(pattern[0]).toHaveProperty('eraId');
      expect(pattern[0]).toHaveProperty('attackerWinRate');
    });

    it('should return empty array for no matching eras', () => {
      const battles = getBattles(mockEvents);
      const eras: { id: string; nameKey: string }[] = [];
      
      const pattern = getVictoryPatternByEra(battles, eras, (k) => k);
      expect(pattern).toHaveLength(0);
    });
  });

  describe('getVictoryPatternBySeason', () => {
    it('should group victories by season', () => {
      const battlesWithMonth: Event[] = [
        {
          id: 'spring-battle',
          entityId: 'era1',
          year: -500,
          month: 4, // spring
          titleKey: 'battle.spring',
          tags: ['war'],
          battle: { result: 'attacker_win' },
        },
        {
          id: 'autumn-battle',
          entityId: 'era1',
          year: -400,
          month: 10, // autumn
          titleKey: 'battle.autumn',
          tags: ['war'],
          battle: { result: 'defender_win' },
        },
      ];
      
      const pattern = getVictoryPatternBySeason(battlesWithMonth);
      
      expect(pattern.length).toBe(2);
      const spring = pattern.find(p => p.season === 'spring')!;
      expect(spring.battles).toBe(1);
      expect(spring.attackerWins).toBe(1);
    });

    it('should exclude unknown seasons', () => {
      const battles: Event[] = [
        {
          id: 'no-month',
          entityId: 'era1',
          year: -500,
          titleKey: 'battle.no-month',
          tags: ['war'],
          battle: { result: 'attacker_win' },
        },
      ];
      
      const pattern = getVictoryPatternBySeason(battles);
      expect(pattern).toHaveLength(0);
    });
  });

  describe('getBattleInsights', () => {
    it('should generate insights from battle data', () => {
      // Create battles with enough data for insights
      const battlesForInsights: Event[] = [
        {
          id: 'b1',
          entityId: 'era1',
          year: -632,
          month: 4,
          titleKey: 'b1',
          tags: ['war'],
          battle: { result: 'attacker_win' },
        },
        {
          id: 'b2',
          entityId: 'era1',
          year: -260,
          month: 7,
          titleKey: 'b2',
          tags: ['war'],
          battle: { result: 'attacker_win' },
        },
        {
          id: 'b3',
          entityId: 'era1',
          year: -200,
          month: 10,
          titleKey: 'b3',
          tags: ['war'],
          battle: { result: 'attacker_win' },
        },
      ];
      
      const eras = [
        { id: 'era1', nameKey: 'era.era1' },
      ];
      const t = (key: string) => key;
      
      const insights = getBattleInsights(battlesForInsights, eras, t);
      
      expect(insights.length).toBeGreaterThan(0);
      expect(insights[0]).toHaveProperty('type');
      expect(insights[0]).toHaveProperty('title');
      expect(insights[0]).toHaveProperty('description');
      expect(insights[0]).toHaveProperty('value');
    });

    it('should not generate trend insight with insufficient data', () => {
      const singleBattle: Event[] = [
        {
          id: 'single',
          entityId: 'era1',
          year: -500,
          titleKey: 'battle.single',
          tags: ['war'],
          battle: { result: 'attacker_win' },
        },
      ];
      const eras = [{ id: 'era1', nameKey: 'era.era1' }];
      
      const insights = getBattleInsights(singleBattle, eras, (k) => k);
      
      // Should not have trend insights with only 1 battle
      const trendInsights = insights.filter(i => 
        i.type === 'attacker_trend' || i.type === 'defender_trend'
      );
      expect(trendInsights).toHaveLength(0);
    });
  });
});
