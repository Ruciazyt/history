import { describe, it, expect } from 'vitest';
import { 
  getBattles, 
  getBattleResultLabel, 
  sortBattlesByYear,
  getBattlesByYearRange,
  getBattleParties,
  isBattleComplete,
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
});
