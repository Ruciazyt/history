import { describe, it, expect } from 'vitest';
import {
  getUniqueCommanders,
  getBattlesByCommander,
  getCommanderStats,
  getAllCommandersStats,
  getTopCommanders,
  getMostExperiencedCommanders,
  getCommanderInsights,
  hasCommanderData,
} from './battles';
import type { Event } from './types';

const mockBattles: Event[] = [
  {
    id: 'battle-1',
    entityId: 'period-warring-states',
    year: -260,
    titleKey: 'battle.changping',
    summaryKey: 'battle.changping.summary',
    tags: ['war'],
    location: { lon: 113.0, lat: 35.5, label: '长平' },
    battle: {
      belligerents: {
        attacker: '秦军',
        defender: '赵军',
      },
      result: 'attacker_win',
      commanders: {
        attacker: ['白起'],
        defender: ['赵括'],
      },
    },
  },
  {
    id: 'battle-2',
    entityId: 'period-warring-states',
    year: -341,
    titleKey: 'battle.maling',
    summaryKey: 'battle.maling.summary',
    tags: ['war'],
    location: { lon: 117.0, lat: 34.5, label: '马陵' },
    battle: {
      belligerents: {
        attacker: '齐军',
        defender: '魏军',
      },
      result: 'attacker_win',
      commanders: {
        attacker: ['孙膑', '田忌'],
        defender: ['庞涓'],
      },
    },
  },
  {
    id: 'battle-3',
    entityId: 'period-spring-autumn',
    year: -506,
    titleKey: 'battle.boju',
    summaryKey: 'battle.boju.summary',
    tags: ['war'],
    location: { lon: 114.3, lat: 30.59, label: '柏举' },
    battle: {
      belligerents: {
        attacker: '吴军',
        defender: '楚军',
      },
      result: 'attacker_win',
      commanders: {
        attacker: ['孙武', '伍子胥'],
        defender: ['囊瓦'],
      },
    },
  },
  {
    id: 'battle-4',
    entityId: 'wz-western-zhou',
    year: -1046,
    titleKey: 'battle.muye',
    summaryKey: 'battle.muye.summary',
    tags: ['war'],
    location: { lon: 114.7, lat: 34.8, label: '牧野' },
    battle: {
      belligerents: {
        attacker: '周军',
        defender: '商军',
      },
      result: 'attacker_win',
      commanders: {
        attacker: ['姬发', '姜子牙'],
        defender: ['帝辛'],
      },
    },
  },
  // Battle without commanders
  {
    id: 'battle-5',
    entityId: 'period-warring-states',
    year: -278,
    titleKey: 'battle.ying',
    summaryKey: 'battle.ying.summary',
    tags: ['war'],
    location: { lon: 112.5, lat: 29.0, label: '郢' },
    battle: {
      belligerents: {
        attacker: '秦军',
        defender: '楚军',
      },
      result: 'attacker_win',
    },
  },
];

describe('Commander Analysis', () => {
  describe('getUniqueCommanders', () => {
    it('should return all unique commanders', () => {
      const commanders = getUniqueCommanders(mockBattles);
      expect(commanders).toContain('白起');
      expect(commanders).toContain('孙膑');
      expect(commanders).toContain('田忌');
      expect(commanders).toContain('庞涓');
      expect(commanders).toContain('孙武');
      expect(commanders).toContain('伍子胥');
      expect(commanders).toContain('姬发');
      expect(commanders).toContain('姜子牙');
      expect(commanders).toContain('赵括');
      expect(commanders).toContain('囊瓦');
      expect(commanders).toContain('帝辛');
      expect(commanders.length).toBe(11);
    });

    it('should return empty array when no battles have commanders', () => {
      const battlesWithoutCommanders = mockBattles.filter(b => !b.battle?.commanders);
      const commanders = getUniqueCommanders(battlesWithoutCommanders);
      expect(commanders).toHaveLength(0);
    });
  });

  describe('getBattlesByCommander', () => {
    it('should find battles for a specific commander', () => {
      const battles = getBattlesByCommander(mockBattles, '白起');
      expect(battles).toHaveLength(1);
      expect(battles[0].battle.id).toBe('battle-1');
      expect(battles[0].side).toBe('attacker');
    });

    it('should be case insensitive for names', () => {
      // Add a battle with English/lowercase commander for testing
      const battlesWithEnglishCommander: Event[] = [
        {
          id: 'battle-test',
          entityId: 'test',
          year: -100,
          titleKey: 'battle.test',
          summaryKey: 'battle.test.summary',
          tags: ['war'],
          battle: {
            belligerents: { attacker: 'A', defender: 'B' },
            result: 'attacker_win',
            commanders: { attacker: ['General Lee'], defender: [] },
          },
        },
      ];
      const battles1 = getBattlesByCommander(battlesWithEnglishCommander, 'General Lee');
      const battles2 = getBattlesByCommander(battlesWithEnglishCommander, 'general lee');
      expect(battles1.length).toBe(battles2.length);
    });

    it('should find commanders on defender side', () => {
      const battles = getBattlesByCommander(mockBattles, '庞涓');
      expect(battles).toHaveLength(1);
      expect(battles[0].side).toBe('defender');
    });
  });

  describe('getCommanderStats', () => {
    it('should calculate correct stats for commander', () => {
      const stats = getCommanderStats(mockBattles, '白起');
      expect(stats.name).toBe('白起');
      expect(stats.totalBattles).toBe(1);
      expect(stats.wins).toBe(1);
      expect(stats.losses).toBe(0);
      expect(stats.winRate).toBe(100);
      expect(stats.side).toBe('attacker');
    });

    it('should track first and last battle years', () => {
      const stats = getCommanderStats(mockBattles, '白起');
      expect(stats.firstBattleYear).toBe(-260);
      expect(stats.lastBattleYear).toBe(-260);
    });
  });

  describe('getAllCommandersStats', () => {
    it('should return stats for all commanders', () => {
      const allStats = getAllCommandersStats(mockBattles);
      expect(allStats.length).toBeGreaterThan(0);
      expect(allStats.every(s => s.totalBattles > 0)).toBe(true);
    });
  });

  describe('getTopCommanders', () => {
    it('should limit results to specified limit', () => {
      const top = getTopCommanders(mockBattles, 3);
      expect(top.length).toBeLessThanOrEqual(3);
    });
  });

  describe('getMostExperiencedCommanders', () => {
    it('should return commanders sorted by battle count', () => {
      const experienced = getMostExperiencedCommanders(mockBattles);
      for (let i = 1; i < experienced.length; i++) {
        expect(
          experienced[i - 1].totalBattles >= experienced[i].totalBattles
        ).toBe(true);
      }
    });
  });

  describe('getCommanderInsights', () => {
    it('should return insights for commanders', () => {
      const insights = getCommanderInsights(mockBattles);
      expect(Array.isArray(insights)).toBe(true);
    });

    it('should return empty array when no commanders', () => {
      const battlesWithoutCommanders = mockBattles.filter(b => !b.battle?.commanders);
      const insights = getCommanderInsights(battlesWithoutCommanders);
      expect(insights).toHaveLength(0);
    });
  });

  describe('hasCommanderData', () => {
    it('should return true when battles have commanders', () => {
      expect(hasCommanderData(mockBattles)).toBe(true);
    });

    it('should return false when no battles have commanders', () => {
      const battlesWithoutCommanders = mockBattles.filter(b => !b.battle?.commanders);
      expect(hasCommanderData(battlesWithoutCommanders)).toBe(false);
    });

    it('should return false for empty array', () => {
      expect(hasCommanderData([])).toBe(false);
    });
  });
});
