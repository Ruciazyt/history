import { describe, it, expect } from 'vitest';
import {
  getDurationCategoryLabel,
  daysToDurationCategory,
  hasDurationData,
  getBattlesWithDurationData,
  getDurationStats,
  getAllDurationStats,
  getBattlesByDurationCategory,
  getQuickVictoryStats,
  getProtractedWarStats,
  getDurationOutcomeCorrelation,
  getLongestBattles,
  getShortestBattles,
  getDurationSummary,
  getDurationInsights,
} from './battleDuration';
import type { Event } from './types';

const mockEvents: Event[] = [
  {
    id: 'battle1',
    entityId: 'spring-autumn',
    year: -1046,
    month: 2,
    titleKey: 'battles.mupye',
    summaryKey: 'battles.mupye.desc',
    tags: ['war'],
    battle: {
      duration: 1,
      result: 'attacker_win',
      belligerents: { attacker: '周', defender: '商' },
    },
  },
  {
    id: 'battle2',
    entityId: 'warring-states',
    year: -260,
    titleKey: 'battles.changping',
    summaryKey: 'battles.changping.desc',
    tags: ['war'],
    battle: {
      duration: 5,
      result: 'attacker_win',
      belligerents: { attacker: '秦', defender: '赵' },
    },
  },
  {
    id: 'battle3',
    entityId: 'warring-states',
    year: -342,
    titleKey: 'battles.maling',
    summaryKey: 'battles.maling.desc',
    tags: ['war'],
    battle: {
      duration: 2,
      result: 'defender_win',
      belligerents: { attacker: '齐', defender: '魏' },
    },
  },
  {
    id: 'battle4',
    entityId: 'warring-states',
    year: -506,
    titleKey: 'battles.baiju',
    summaryKey: 'battles.baiju.desc',
    tags: ['war'],
    battle: {
      duration: 45,
      result: 'attacker_win',
      belligerents: { attacker: '吴', defender: '楚' },
    },
  },
  {
    id: 'battle5',
    entityId: 'spring-autumn',
    year: -632,
    titleKey: 'battles.chengpu',
    summaryKey: 'battles.chengpu.desc',
    tags: ['war'],
    battle: {
      duration: 3,
      result: 'attacker_win',
      belligerents: { attacker: '晋', defender: '楚' },
    },
  },
  {
    id: 'battle6',
    entityId: 'warring-states',
    year: -257,
    titleKey: 'battles.changping',
    summaryKey: 'battles.changping.desc',
    tags: ['war'],
    battle: {
      // 无duration数据
      result: 'defender_win',
      belligerents: { attacker: '秦', defender: '赵' },
    },
  },
  // 非战役事件
  {
    id: 'event1',
    entityId: 'zhou',
    year: -841,
    titleKey: 'events.gonghe',
    summaryKey: 'events.gonghe.desc',
  },
];

describe('battleDuration', () => {
  describe('getDurationCategoryLabel', () => {
    it('should return correct label for each category', () => {
      expect(getDurationCategoryLabel('daily')).toBe('一日之战');
      expect(getDurationCategoryLabel('short')).toBe('短期战役(1-3天)');
      expect(getDurationCategoryLabel('medium')).toBe('中期战役(4-7天)');
      expect(getDurationCategoryLabel('extended')).toBe('持久战役(8-30天)');
      expect(getDurationCategoryLabel('protracted')).toBe('超长战役(30天以上)');
      expect(getDurationCategoryLabel('unknown')).toBe('未知');
    });

    it('should return empty string for undefined', () => {
      expect(getDurationCategoryLabel(undefined)).toBe('');
    });
  });

  describe('daysToDurationCategory', () => {
    it('should categorize correctly', () => {
      expect(daysToDurationCategory(0)).toBe('daily');
      expect(daysToDurationCategory(1)).toBe('daily');
      expect(daysToDurationCategory(2)).toBe('short');
      expect(daysToDurationCategory(3)).toBe('short');
      expect(daysToDurationCategory(4)).toBe('medium');
      expect(daysToDurationCategory(7)).toBe('medium');
      expect(daysToDurationCategory(8)).toBe('extended');
      expect(daysToDurationCategory(30)).toBe('extended');
      expect(daysToDurationCategory(31)).toBe('protracted');
      expect(daysToDurationCategory(100)).toBe('protracted');
    });

    it('should return unknown for undefined', () => {
      expect(daysToDurationCategory(undefined)).toBe('unknown');
      expect(daysToDurationCategory(null as unknown as number)).toBe('unknown');
    });
  });

  describe('hasDurationData', () => {
    it('should return true if any battle has duration', () => {
      expect(hasDurationData(mockEvents)).toBe(true);
    });

    it('should return false if no battle has duration', () => {
      const eventsWithoutDuration: Event[] = [
        {
          id: 'battle1',
          entityId: 'warring-states',
          year: -260,
          titleKey: 'battles.test',
          summaryKey: 'battles.test.desc',
          tags: ['war'],
          battle: { result: 'attacker_win' },
        },
      ];
      expect(hasDurationData(eventsWithoutDuration)).toBe(false);
    });
  });

  describe('getBattlesWithDurationData', () => {
    it('should return only battles with duration', () => {
      const result = getBattlesWithDurationData(mockEvents);
      expect(result.length).toBe(5);
    });
  });

  describe('getDurationStats', () => {
    it('should calculate stats for daily battles', () => {
      const stats = getDurationStats(mockEvents, 'daily');
      expect(stats.category).toBe('daily');
      expect(stats.totalBattles).toBe(1);
      expect(stats.attackerWins).toBe(1);
      expect(stats.defenderWins).toBe(0);
      expect(stats.avgDuration).toBe(1);
    });

    it('should calculate stats for short battles', () => {
      const stats = getDurationStats(mockEvents, 'short');
      expect(stats.totalBattles).toBe(2);
      expect(stats.minDuration).toBe(2);
      expect(stats.maxDuration).toBe(3);
    });

    it('should calculate stats for protracted battles', () => {
      const stats = getDurationStats(mockEvents, 'protracted');
      expect(stats.totalBattles).toBe(1);
      expect(stats.avgDuration).toBe(45);
    });
  });

  describe('getAllDurationStats', () => {
    it('should return stats for all categories', () => {
      const allStats = getAllDurationStats(mockEvents);
      expect(allStats.length).toBe(5);
      expect(allStats.find(s => s.category === 'daily')?.totalBattles).toBe(1);
      expect(allStats.find(s => s.category === 'protracted')?.totalBattles).toBe(1);
    });
  });

  describe('getBattlesByDurationCategory', () => {
    it('should filter battles by duration category', () => {
      const protractedBattles = getBattlesByDurationCategory(mockEvents, 'protracted');
      expect(protractedBattles.length).toBe(1);
      expect(protractedBattles[0].battle?.duration).toBe(45);
    });
  });

  describe('getQuickVictoryStats', () => {
    it('should return stats for quick victories (daily)', () => {
      const stats = getQuickVictoryStats(mockEvents);
      expect(stats.category).toBe('daily');
      expect(stats.totalBattles).toBe(1);
    });
  });

  describe('getProtractedWarStats', () => {
    it('should return stats for protracted wars', () => {
      const stats = getProtractedWarStats(mockEvents);
      expect(stats.category).toBe('protracted');
      expect(stats.totalBattles).toBe(1);
    });
  });

  describe('getDurationOutcomeCorrelation', () => {
    it('should calculate outcome correlation by duration', () => {
      const correlation = getDurationOutcomeCorrelation(mockEvents);
      expect(correlation.length).toBeGreaterThan(0);
      
      const daily = correlation.find(c => c.category === 'daily');
      expect(daily?.attackerWinRate).toBe(100);
    });
  });

  describe('getLongestBattles', () => {
    it('should return longest battles sorted by duration', () => {
      const longest = getLongestBattles(mockEvents, 3);
      expect(longest.length).toBe(3);
      expect(longest[0].battle?.duration).toBe(45);
    });
  });

  describe('getShortestBattles', () => {
    it('should return shortest battles sorted by duration', () => {
      const shortest = getShortestBattles(mockEvents, 3);
      expect(shortest.length).toBe(3);
      expect(shortest[0].battle?.duration).toBe(1);
    });
  });

  describe('getDurationSummary', () => {
    it('should return comprehensive summary', () => {
      const summary = getDurationSummary(mockEvents);
      
      expect(summary.hasData).toBe(true);
      expect(summary.totalBattlesWithDuration).toBe(5);
      expect(summary.averageDuration).toBeGreaterThan(0);
      expect(summary.shortestBattle).not.toBeNull();
      expect(summary.longestBattle).not.toBeNull();
      expect(summary.correlation.length).toBeGreaterThan(0);
    });

    it('should handle empty data', () => {
      const summary = getDurationSummary([]);
      expect(summary.hasData).toBe(false);
      expect(summary.totalBattlesWithDuration).toBe(0);
    });
  });

  describe('getDurationInsights', () => {
    it('should generate insights from duration data', () => {
      const insights = getDurationInsights(mockEvents);
      expect(insights.length).toBeGreaterThan(0);
      expect(insights.some(i => i.includes('日') || i.includes('天'))).toBe(true);
    });

    it('should handle no data case', () => {
      const insights = getDurationInsights([]);
      expect(insights).toContain('暂无战役持续时间数据');
    });
  });
});
