import { describe, it, expect } from 'vitest';
import {
  getSeasonFromMonth,
  getSeasonName,
  getBattleMonth,
  getBattleSeasonality,
  getMostActiveSeason,
  getSeasonalityInsight,
  type Event,
} from './battles';

describe('Battle Seasonality', () => {
  describe('getSeasonFromMonth', () => {
    it('should return spring for months 3-5', () => {
      expect(getSeasonFromMonth(3)).toBe('spring');
      expect(getSeasonFromMonth(4)).toBe('spring');
      expect(getSeasonFromMonth(5)).toBe('spring');
    });

    it('should return summer for months 6-8', () => {
      expect(getSeasonFromMonth(6)).toBe('summer');
      expect(getSeasonFromMonth(7)).toBe('summer');
      expect(getSeasonFromMonth(8)).toBe('summer');
    });

    it('should return autumn for months 9-11', () => {
      expect(getSeasonFromMonth(9)).toBe('autumn');
      expect(getSeasonFromMonth(10)).toBe('autumn');
      expect(getSeasonFromMonth(11)).toBe('autumn');
    });

    it('should return winter for months 12, 1, 2', () => {
      expect(getSeasonFromMonth(12)).toBe('winter');
      expect(getSeasonFromMonth(1)).toBe('winter');
      expect(getSeasonFromMonth(2)).toBe('winter');
    });

    it('should return unknown for invalid months', () => {
      expect(getSeasonFromMonth(0)).toBe('unknown');
      expect(getSeasonFromMonth(13)).toBe('unknown');
      expect(getSeasonFromMonth(-1)).toBe('unknown');
    });
  });

  describe('getSeasonName', () => {
    it('should return correct Chinese names', () => {
      expect(getSeasonName('spring')).toBe('春季');
      expect(getSeasonName('summer')).toBe('夏季');
      expect(getSeasonName('autumn')).toBe('秋季');
      expect(getSeasonName('winter')).toBe('冬季');
      expect(getSeasonName('unknown')).toBe('未知');
    });
  });

  describe('getBattleMonth', () => {
    it('should return month when available', () => {
      const battle: Event = {
        id: 'b1',
        entityId: 'era1',
        year: -632,
        titleKey: 'test',
        summaryKey: 'test',
        month: 3,
      };
      expect(getBattleMonth(battle)).toBe(3);
    });

    it('should return null when month not available', () => {
      const battle: Event = {
        id: 'b1',
        entityId: 'era1',
        year: -632,
        titleKey: 'test',
        summaryKey: 'test',
      };
      expect(getBattleMonth(battle)).toBeNull();
    });
  });

  describe('getBattleSeasonality', () => {
    const mockBattles: Event[] = [
      {
        id: 'b1',
        entityId: 'era1',
        year: -632,
        titleKey: 'test',
        summaryKey: 'test',
        tags: ['war'],
        month: 3, // spring
        battle: { result: 'attacker_win' },
      },
      {
        id: 'b2',
        entityId: 'era1',
        year: -260,
        titleKey: 'test',
        summaryKey: 'test',
        tags: ['war'],
        month: 4, // spring
        battle: { result: 'attacker_win' },
      },
      {
        id: 'b3',
        entityId: 'era1',
        year: -208,
        titleKey: 'test',
        summaryKey: 'test',
        tags: ['war'],
        month: 10, // autumn
        battle: { result: 'defender_win' },
      },
      {
        id: 'b4',
        entityId: 'era1',
        year: -100,
        titleKey: 'test',
        summaryKey: 'test',
        tags: ['war'],
        month: 7, // summer
        battle: { result: 'draw' },
      },
      {
        id: 'b5',
        entityId: 'era1',
        year: -50,
        titleKey: 'test',
        summaryKey: 'test',
        tags: ['war'],
        // no month
        battle: { result: 'attacker_win' },
      },
    ];

    it('should count battles by season', () => {
      const seasonality = getBattleSeasonality(mockBattles);
      
      const spring = seasonality.find(s => s.season === 'spring');
      const autumn = seasonality.find(s => s.season === 'autumn');
      const summer = seasonality.find(s => s.season === 'summer');
      const unknown = seasonality.find(s => s.season === 'unknown');
      
      expect(spring?.count).toBe(2);
      expect(autumn?.count).toBe(1);
      expect(summer?.count).toBe(1);
      expect(unknown?.count).toBe(1);
    });

    it('should calculate correct percentages', () => {
      const seasonality = getBattleSeasonality(mockBattles);
      
      const spring = seasonality.find(s => s.season === 'spring');
      const autumn = seasonality.find(s => s.season === 'autumn');
      
      // 4 battles with known season
      expect(spring?.percentage).toBe(50); // 2/4 * 100
      expect(autumn?.percentage).toBe(25); // 1/4 * 100
    });

    it('should return empty array for no battles', () => {
      const seasonality = getBattleSeasonality([]);
      expect(seasonality).toHaveLength(5); // All seasons still present
      expect(seasonality.every(s => s.count === 0)).toBe(true);
    });

    it('should sort by count descending', () => {
      const seasonality = getBattleSeasonality(mockBattles);
      
      // Unknown should be last
      expect(seasonality[seasonality.length - 1].season).toBe('unknown');
      
      // First should have highest count
      for (let i = 0; i < seasonality.length - 2; i++) {
        expect(seasonality[i].count).toBeGreaterThanOrEqual(seasonality[i + 1].count);
      }
    });
  });

  describe('getMostActiveSeason', () => {
    it('should return the season with most battles', () => {
      const battles: Event[] = [
        { id: 'b1', entityId: 'era1', year: -632, titleKey: 'test', summaryKey: 'test', tags: ['war'], month: 3 },
        { id: 'b2', entityId: 'era1', year: -260, titleKey: 'test', summaryKey: 'test', tags: ['war'], month: 10 },
        { id: 'b3', entityId: 'era1', year: -208, titleKey: 'test', summaryKey: 'test', tags: ['war'], month: 10 },
      ];
      
      const mostActive = getMostActiveSeason(battles);
      expect(mostActive?.season).toBe('autumn');
      expect(mostActive?.count).toBe(2);
    });

    it('should return null for no battles with known season', () => {
      const battles: Event[] = [
        { id: 'b1', entityId: 'era1', year: -632, titleKey: 'test', summaryKey: 'test', tags: ['war'] },
      ];
      
      const mostActive = getMostActiveSeason(battles);
      expect(mostActive).toBeNull();
    });
  });

  describe('getSeasonalityInsight', () => {
    it('should detect when battles follow ancient wisdom (spring/autumn preferred)', () => {
      const battles: Event[] = [
        { id: 'b1', entityId: 'era1', year: -632, titleKey: 'test', summaryKey: 'test', tags: ['war'], month: 3 },
        { id: 'b2', entityId: 'era1', year: -260, titleKey: 'test', summaryKey: 'test', tags: ['war'], month: 4 },
        { id: 'b3', entityId: 'era1', year: -208, titleKey: 'test', summaryKey: 'test', tags: ['war'], month: 10 },
        { id: 'b4', entityId: 'era1', year: -100, titleKey: 'test', summaryKey: 'test', tags: ['war'], month: 11 },
      ];
      
      const insight = getSeasonalityInsight(battles);
      expect(insight.followsWisdom).toBe(true);
      expect(insight.insight).toContain('符合');
    });

    it('should detect when battles violate ancient wisdom', () => {
      const battles: Event[] = [
        { id: 'b1', entityId: 'era1', year: -632, titleKey: 'test', summaryKey: 'test', tags: ['war'], month: 7 },
        { id: 'b2', entityId: 'era1', year: -260, titleKey: 'test', summaryKey: 'test', tags: ['war'], month: 7 },
        { id: 'b3', entityId: 'era1', year: -208, titleKey: 'test', summaryKey: 'test', tags: ['war'], month: 1 },
        { id: 'b4', entityId: 'era1', year: -100, titleKey: 'test', summaryKey: 'test', tags: ['war'], month: 2 },
      ];
      
      const insight = getSeasonalityInsight(battles);
      expect(insight.followsWisdom).toBe(false);
      expect(insight.insight).toContain('打破');
    });

    it('should return zero percentages for empty battles', () => {
      const insight = getSeasonalityInsight([]);
      expect(insight.summerPercentage).toBe(0);
      expect(insight.winterPercentage).toBe(0);
      expect(insight.autumnPercentage).toBe(0);
      expect(insight.springPercentage).toBe(0);
    });
  });
});
