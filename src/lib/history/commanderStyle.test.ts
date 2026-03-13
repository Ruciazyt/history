import { describe, it, expect } from 'vitest';
import {
  getCommanderStyleLabel,
  analyzeCommanderBattleStyle,
  getAllCommanders,
  getBattlesWithCommanders,
  getCommanderBattles,
  getCommanderStyleStats,
  getAllCommandersStyleStats,
  getCommandersByStyle,
  getTopCommandersByWinRate,
  getMostActiveCommanders,
  getStyleDistribution,
  getStyleWinRateComparison,
  hasCommanderStyleData,
  getCommanderStyleInsights,
  getCommanderStyleSummary,
} from './commanderStyle';
import type { Event } from './types';

const mockEvents: Event[] = [
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
        attacker: ['白起', '王龁'],
        defender: ['赵括'],
      },
      strategy: ['encirclement', 'offensive'],
      terrain: ['plains', 'hills'],
      weather: ['clear'],
      impact: 'decisive',
      scale: 'massive',
      battleType: 'conquest',
    },
  },
  {
    id: 'battle-2',
    entityId: 'period-warring-states',
    year: -342,
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
      strategy: ['ambush', 'feigned-retreat'],
      terrain: ['mountains', 'forest'],
      weather: ['foggy'],
      impact: 'decisive',
      scale: 'large',
      battleType: 'conquest',
    },
  },
  {
    id: 'battle-3',
    entityId: 'period-spring-autumn',
    year: -632,
    titleKey: 'battle.chengpu',
    summaryKey: 'battle.chengpu.summary',
    tags: ['war'],
    location: { lon: 117.5, lat: 31.5, label: '城濮' },
    battle: {
      belligerents: {
        attacker: '晋军',
        defender: '楚军',
      },
      result: 'attacker_win',
      commanders: {
        attacker: ['晋文公', '先轸'],
        defender: ['楚成王', '子玉'],
      },
      strategy: ['defensive', 'alliance'],
      terrain: ['plains'],
      weather: ['clear'],
      impact: 'major',
      scale: 'large',
      battleType: 'conquest',
    },
  },
  {
    id: 'battle-4',
    entityId: 'period-warring-states',
    year: -506,
    titleKey: 'battle.boju',
    summaryKey: 'battle.boju.summary',
    tags: ['war'],
    location: { lon: 114.5, lat: 31.0, label: '柏举' },
    battle: {
      belligerents: {
        attacker: '吴军',
        defender: '楚军',
      },
      result: 'attacker_win',
      commanders: {
        attacker: ['孙武', '伍子胥'],
        defender: ['囊瓦', '史皇'],
      },
      strategy: ['offensive', 'pincer'],
      terrain: ['plains', 'hills'],
      weather: ['clear'],
      impact: 'decisive',
      scale: 'large',
      battleType: 'conquest',
    },
  },
  {
    id: 'battle-5',
    entityId: 'period-shang',
    year: -1046,
    titleKey: 'battle.muye',
    summaryKey: 'battle.muye.summary',
    tags: ['war'],
    location: { lon: 113.5, lat: 35.0, label: '牧野' },
    battle: {
      belligerents: {
        attacker: '周军',
        defender: '商军',
      },
      result: 'attacker_win',
      commanders: {
        attacker: ['周武王', '姜子牙'],
        defender: ['纣王'],
      },
      strategy: ['offensive', 'ambush'],
      terrain: ['plains'],
      weather: ['clear'],
      impact: 'decisive',
      scale: 'massive',
      battleType: 'founding',
    },
  },
];

describe('commanderStyle', () => {
  describe('getCommanderStyleLabel', () => {
    it('should return correct label for each style', () => {
      expect(getCommanderStyleLabel('aggressive')).toBe('进攻型');
      expect(getCommanderStyleLabel('defensive')).toBe('防守型');
      expect(getCommanderStyleLabel('flexible')).toBe('灵活型');
      expect(getCommanderStyleLabel('strategic')).toBe('战略型');
      expect(getCommanderStyleLabel('tactical')).toBe('战术型');
      expect(getCommanderStyleLabel('unknown')).toBe('未知');
    });
  });

  describe('getAllCommanders', () => {
    it('should return all unique commanders', () => {
      const commanders = getAllCommanders(mockEvents);
      expect(commanders.length).toBeGreaterThan(0);
      expect(commanders).toContain('孙膑');
      expect(commanders).toContain('庞涓');
      expect(commanders).toContain('白起');
    });

    it('should return sorted array', () => {
      const commanders = getAllCommanders(mockEvents);
      const sorted = [...commanders].sort();
      expect(commanders).toEqual(sorted);
    });
  });

  describe('getBattlesWithCommanders', () => {
    it('should return battles with commander data', () => {
      const battles = getBattlesWithCommanders(mockEvents);
      expect(battles.length).toBe(5);
      battles.forEach(battle => {
        expect(battle.battle?.commanders).toBeDefined();
      });
    });
  });

  describe('getCommanderBattles', () => {
    it('should return battles for specific commander', () => {
      const records = getCommanderBattles(mockEvents, '孙膑');
      expect(records.length).toBe(1);
      records.forEach(record => {
        expect(
          record.battle.battle?.commanders?.attacker?.includes('孙膑') ||
          record.battle.battle?.commanders?.defender?.includes('孙膑')
        ).toBe(true);
      });
    });

    it('should return empty array for unknown commander', () => {
      const records = getCommanderBattles(mockEvents, '未知指挥官');
      expect(records.length).toBe(0);
    });
  });

  describe('getCommanderStyleStats', () => {
    it('should return stats for commander with battles', () => {
      const stats = getCommanderStyleStats(mockEvents, '孙膑');
      expect(stats).not.toBeNull();
      if (stats) {
        expect(stats.commander).toBe('孙膑');
        expect(stats.totalBattles).toBe(1);
        expect(stats.victories + stats.defeats + stats.draws).toBe(stats.totalBattles);
        expect(stats.winRate).toBeGreaterThanOrEqual(0);
        expect(stats.winRate).toBeLessThanOrEqual(100);
      }
    });

    it('should return null for unknown commander', () => {
      const stats = getCommanderStyleStats(mockEvents, '未知指挥官');
      expect(stats).toBeNull();
    });

    it('should calculate correct win rate', () => {
      const stats = getCommanderStyleStats(mockEvents, '孙膑');
      if (stats && stats.totalBattles > 0) {
        const expectedWinRate = Math.round((stats.victories / stats.totalBattles) * 100);
        expect(stats.winRate).toBe(expectedWinRate);
      }
    });
  });

  describe('getAllCommandersStyleStats', () => {
    it('should return stats for all commanders', () => {
      const allStats = getAllCommandersStyleStats(mockEvents);
      expect(allStats.length).toBeGreaterThan(0);
      allStats.forEach(stats => {
        expect(stats.commander).toBeDefined();
        expect(stats.dominantStyle).toBeDefined();
      });
    });
  });

  describe('getCommandersByStyle', () => {
    it('should return commanders with specific style', () => {
      const flexibleCommanders = getCommandersByStyle(mockEvents, 'flexible');
      flexibleCommanders.forEach(stats => {
        expect(stats.dominantStyle).toBe('flexible');
      });
    });
  });

  describe('getTopCommandersByWinRate', () => {
    it('should return commanders sorted by win rate', () => {
      const topCommanders = getTopCommandersByWinRate(mockEvents, 1);
      expect(topCommanders.length).toBeGreaterThan(0);
      
      for (let i = 1; i < topCommanders.length; i++) {
        expect(topCommanders[i - 1].winRate).toBeGreaterThanOrEqual(topCommanders[i].winRate);
      }
    });

    it('should filter by minimum battles', () => {
      const topCommanders = getTopCommandersByWinRate(mockEvents, 2);
      topCommanders.forEach(stats => {
        expect(stats.totalBattles).toBeGreaterThanOrEqual(2);
      });
    });
  });

  describe('getMostActiveCommanders', () => {
    it('should return commanders sorted by battle count', () => {
      const activeCommanders = getMostActiveCommanders(mockEvents, 5);
      expect(activeCommanders.length).toBeLessThanOrEqual(5);
      
      for (let i = 1; i < activeCommanders.length; i++) {
        expect(activeCommanders[i - 1].totalBattles).toBeGreaterThanOrEqual(activeCommanders[i].totalBattles);
      }
    });

    it('should return all if limit is larger than total', () => {
      const allStats = getAllCommandersStyleStats(mockEvents);
      const activeCommanders = getMostActiveCommanders(mockEvents, 100);
      expect(activeCommanders.length).toBe(allStats.length);
    });
  });

  describe('getStyleDistribution', () => {
    it('should return style distribution', () => {
      const distribution = getStyleDistribution(mockEvents);
      expect(distribution.length).toBeGreaterThan(0);
      
      const total = distribution.reduce((sum, d) => sum + d.count, 0);
      expect(total).toBe(getAllCommandersStyleStats(mockEvents).length);
    });

    it('should have correct percentage', () => {
      const distribution = getStyleDistribution(mockEvents);
      distribution.forEach(d => {
        expect(d.percentage).toBeGreaterThanOrEqual(0);
        expect(d.percentage).toBeLessThanOrEqual(100);
      });
    });

    it('should be sorted by count', () => {
      const distribution = getStyleDistribution(mockEvents);
      for (let i = 1; i < distribution.length; i++) {
        expect(distribution[i - 1].count).toBeGreaterThanOrEqual(distribution[i].count);
      }
    });
  });

  describe('getStyleWinRateComparison', () => {
    it('should return win rate comparison for each style', () => {
      const comparison = getStyleWinRateComparison(mockEvents);
      expect(comparison.length).toBeGreaterThan(0);
      
      comparison.forEach(c => {
        expect(c.totalBattles).toBe(c.victories + c.defeats + c.draws);
        expect(c.winRate).toBeGreaterThanOrEqual(0);
        expect(c.winRate).toBeLessThanOrEqual(100);
      });
    });

    it('should be sorted by win rate', () => {
      const comparison = getStyleWinRateComparison(mockEvents);
      for (let i = 1; i < comparison.length; i++) {
        expect(comparison[i - 1].winRate).toBeGreaterThanOrEqual(comparison[i].winRate);
      }
    });
  });

  describe('hasCommanderStyleData', () => {
    it('should return true when commanders exist', () => {
      expect(hasCommanderStyleData(mockEvents)).toBe(true);
    });

    it('should return false for empty events', () => {
      expect(hasCommanderStyleData([])).toBe(false);
    });
  });

  describe('getCommanderStyleInsights', () => {
    it('should return insights when data exists', () => {
      const insights = getCommanderStyleInsights(mockEvents);
      expect(insights.length).toBeGreaterThan(0);
      
      insights.forEach(insight => {
        expect(insight.type).toBeDefined();
        expect(insight.title).toBeDefined();
        expect(insight.description).toBeDefined();
      });
    });

    it('should return empty array when no data', () => {
      const insights = getCommanderStyleInsights([]);
      expect(insights.length).toBe(0);
    });
  });

  describe('getCommanderStyleSummary', () => {
    it('should return complete summary', () => {
      const summary = getCommanderStyleSummary(mockEvents);
      
      expect(summary.totalCommanders).toBeGreaterThan(0);
      expect(summary.totalBattles).toBeGreaterThan(0);
      expect(summary.distribution.length).toBeGreaterThan(0);
      expect(summary.styleWinRates.length).toBeGreaterThan(0);
      expect(summary.topCommanders.length).toBeGreaterThan(0);
      expect(summary.insights.length).toBeGreaterThan(0);
    });

    it('should have consistent data', () => {
      const summary = getCommanderStyleSummary(mockEvents);
      
      // totalCommanders should match distribution sum
      const distSum = summary.distribution.reduce((sum, d) => sum + d.count, 0);
      expect(distSum).toBe(summary.totalCommanders);
    });
  });
});
