import { describe, it, expect } from 'vitest';
import type { Event } from './types';
import {
  getTerrainLabel,
  getUniqueTerrains,
  hasTerrainData,
  getTerrainStats,
  getAllTerrainStats,
  getBattlesByTerrain,
  getMostCommonTerrains,
  getMostEffectiveTerrainsForAttackers,
  getMostEffectiveTerrainsForDefenders,
  getTerrainAdvantage,
  getTerrainInsights,
  getTerrainDistributionByEra,
  getTerrainSummary,
} from './battleTerrain';

// Mock events for testing
const mockEvents: Event[] = [
  {
    id: 'battle1',
    entityId: 'spring-autumn',
    year: -632,
    titleKey: 'battle.chengpu',
    summaryKey: 'battle.chengpu.desc',
    tags: ['war'],
    location: { lon: 117.2, lat: 33.9, label: '城濮' },
    battle: {
      belligerents: { attacker: '晋国', defender: '楚国' },
      result: 'attacker_win',
      terrain: ['plains', 'hills'],
    },
  },
  {
    id: 'battle2',
    entityId: 'warring-states',
    year: -341,
    titleKey: 'battle.maling',
    summaryKey: 'battle.maling.desc',
    tags: ['war'],
    location: { lon: 117.0, lat: 34.4, label: '马陵' },
    battle: {
      belligerents: { attacker: '齐国', defender: '魏国' },
      result: 'attacker_win',
      terrain: ['forest'],
    },
  },
  {
    id: 'battle3',
    entityId: 'warring-states',
    year: -260,
    titleKey: 'battle.changping',
    summaryKey: 'battle.changping.desc',
    tags: ['war'],
    location: { lon: 113.0, lat: 37.5, label: '长平' },
    battle: {
      belligerents: { attacker: '秦国', defender: '赵国' },
      result: 'attacker_win',
      terrain: ['mountains', 'hills'],
    },
  },
  {
    id: 'battle4',
    entityId: 'warring-states',
    year: -223,
    titleKey: 'battle.yangxia',
    summaryKey: 'battle.yangxia.desc',
    tags: ['war'],
    location: { lon: 118.7, lat: 31.9, label: '杨夏' },
    battle: {
      belligerents: { attacker: '秦国', defender: '楚国' },
      result: 'attacker_win',
      terrain: ['water', 'plains'],
    },
  },
  {
    id: 'battle5',
    entityId: 'chuhang',
    year: -208,
    titleKey: 'battle Julu',
    summaryKey: 'battle.julu.desc',
    tags: ['war'],
    location: { lon: 114.8, lat: 37.2, label: '巨鹿' },
    battle: {
      belligerents: { attacker: '项羽', defender: '秦军' },
      result: 'attacker_win',
      terrain: ['plains'],
    },
  },
  {
    id: 'battle6',
    entityId: 'chuhang',
    year: -203,
    titleKey: 'battle.gaixia',
    summaryKey: 'battle.gaixia.desc',
    tags: ['war'],
    location: { lon: 118.5, lat: 32.1, label: '垓下' },
    battle: {
      belligerents: { attacker: '刘邦', defender: '项羽' },
      result: 'attacker_win',
      terrain: ['plains', 'hills'],
    },
  },
  {
    id: 'battle7',
    entityId: 'han',
    year: -200,
    titleKey: 'battle.baiang',
    summaryKey: 'battle.baiang.desc',
    tags: ['war'],
    location: { lon: 112.5, lat: 34.0, label: '白登山' },
    battle: {
      belligerents: { attacker: '匈奴', defender: '汉军' },
      result: 'defender_win',
      terrain: ['mountains'],
    },
  },
  {
    id: 'battle8',
    entityId: 'three-kingdoms',
    year: -208,
    titleKey: 'battle.chibi',
    summaryKey: 'battle.chibi.desc',
    tags: ['war'],
    location: { lon: 113.1, lat: 30.2, label: '赤壁' },
    battle: {
      belligerents: { attacker: '曹操', defender: '孙刘联军' },
      result: 'defender_win',
      terrain: ['water'],
    },
  },
  {
    id: 'battle9',
    entityId: 'three-kingdoms',
    year: -222,
    titleKey: 'battle.yiling',
    summaryKey: 'battle.yiling.desc',
    tags: ['war'],
    location: { lon: 111.3, lat: 30.8, label: '夷陵' },
    battle: {
      belligerents: { attacker: '陆逊', defender: '刘备' },
      result: 'attacker_win',
      terrain: ['mountains', 'forest'],
    },
  },
  {
    id: 'battle10',
    entityId: 'jin',
    year: 383,
    titleKey: 'battle.feishui',
    summaryKey: 'battle.feishui.desc',
    tags: ['war'],
    location: { lon: 118.4, lat: 31.4, label: '淝水' },
    battle: {
      belligerents: { attacker: '晋军', defender: '秦军' },
      result: 'defender_win',
      terrain: ['water', 'plains'],
    },
  },
  // Battle with no terrain data
  {
    id: 'battle11',
    entityId: 'sui',
    year: -617,
    titleKey: 'battle.luoyang',
    summaryKey: 'battle.luoyang.desc',
    tags: ['war'],
    location: { lon: 112.4, lat: 34.6, label: '洛阳' },
    battle: {
      belligerents: { attacker: '李密', defender: '王世充' },
      result: 'inconclusive',
    },
  },
];

describe('battleTerrain', () => {
  describe('getTerrainLabel', () => {
    it('should return correct Chinese labels', () => {
      expect(getTerrainLabel('plains')).toBe('平原');
      expect(getTerrainLabel('mountains')).toBe('山地');
      expect(getTerrainLabel('water')).toBe('水域');
      expect(getTerrainLabel('forest')).toBe('森林');
      expect(getTerrainLabel('hills')).toBe('丘陵');
    });

    it('should return empty string for undefined', () => {
      expect(getTerrainLabel(undefined)).toBe('');
    });
  });

  describe('getUniqueTerrains', () => {
    it('should return unique terrains sorted', () => {
      const terrains = getUniqueTerrains(mockEvents);
      expect(terrains).toContain('plains');
      expect(terrains).toContain('mountains');
      expect(terrains).toContain('water');
      expect(terrains).toContain('forest');
      expect(terrains).toContain('hills');
    });

    it('should return empty array when no battles have terrain', () => {
      const events: Event[] = [];
      expect(getUniqueTerrains(events)).toEqual([]);
    });
  });

  describe('hasTerrainData', () => {
    it('should return true when battles have terrain data', () => {
      expect(hasTerrainData(mockEvents)).toBe(true);
    });

    it('should return false when no battles have terrain data', () => {
      const events: Event[] = [];
      expect(hasTerrainData(events)).toBe(false);
    });
  });

  describe('getTerrainStats', () => {
    it('should calculate correct stats for plains', () => {
      const stats = getTerrainStats(mockEvents, 'plains');
      expect(stats.terrain).toBe('plains');
      expect(stats.label).toBe('平原');
      expect(stats.totalBattles).toBe(5); // battle1, battle5, battle6, battle10 + battle with plains in battle4
      expect(stats.attackerWins).toBe(4); // battle1, battle5, battle6, battle4
      expect(stats.defenderWins).toBe(1); // battle10
    });

    it('should calculate correct stats for water battles', () => {
      const stats = getTerrainStats(mockEvents, 'water');
      expect(stats.totalBattles).toBe(3); // battle4, battle8, battle10
      expect(stats.attackerWins).toBe(1); // battle4
      expect(stats.defenderWins).toBe(2); // battle8, battle10
    });

    it('should calculate correct win rates', () => {
      const stats = getTerrainStats(mockEvents, 'plains');
      // 4 attacker wins, 1 defender win = 5 decided
      expect(stats.attackerWinRate).toBe(80);
      expect(stats.defenderWinRate).toBe(20);
    });
  });

  describe('getAllTerrainStats', () => {
    it('should return stats for all terrains', () => {
      const stats = getAllTerrainStats(mockEvents);
      expect(stats.length).toBeGreaterThan(0);
      expect(stats.every(s => s.totalBattles > 0)).toBe(true);
    });
  });

  describe('getBattlesByTerrain', () => {
    it('should return battles filtered by terrain', () => {
      const waterBattles = getBattlesByTerrain(mockEvents, 'water');
      expect(waterBattles.length).toBe(3);
      expect(waterBattles.every(b => b.battle?.terrain?.includes('water'))).toBe(true);
    });
  });

  describe('getMostCommonTerrains', () => {
    it('should return top terrains by battle count', () => {
      const mostCommon = getMostCommonTerrains(mockEvents, 5);
      expect(mostCommon.length).toBeLessThanOrEqual(5);
      expect(mostCommon[0].totalBattles).toBeGreaterThanOrEqual(mostCommon[1].totalBattles);
    });
  });

  describe('getMostEffectiveTerrainsForAttackers', () => {
    it('should return terrains sorted by attacker win rate', () => {
      const effective = getMostEffectiveTerrainsForAttackers(mockEvents, 2);
      if (effective.length > 1) {
        expect(effective[0].attackerWinRate).toBeGreaterThanOrEqual(effective[1].attackerWinRate);
      }
    });

    it('should filter out terrains with less than minBattles', () => {
      const effective = getMostEffectiveTerrainsForAttackers(mockEvents, 10);
      expect(effective.every(s => s.totalBattles >= 10)).toBe(true);
    });
  });

  describe('getMostEffectiveTerrainsForDefenders', () => {
    it('should return terrains sorted by defender win rate', () => {
      const effective = getMostEffectiveTerrainsForDefenders(mockEvents, 2);
      if (effective.length > 1) {
        expect(effective[0].defenderWinRate).toBeGreaterThanOrEqual(effective[1].defenderWinRate);
      }
    });
  });

  describe('getTerrainAdvantage', () => {
    it('should analyze terrain advantage correctly', () => {
      const advantages = getTerrainAdvantage(mockEvents, 2);
      expect(advantages.length).toBeGreaterThan(0);
      
      // Check that each advantage has correct type
      advantages.forEach(a => {
        expect(['attacker', 'defender', 'balanced']).toContain(a.advantage);
      });
    });

    it('should filter out terrains with less than minBattles', () => {
      const advantages = getTerrainAdvantage(mockEvents, 10);
      expect(advantages.every(a => a.totalBattles >= 10)).toBe(true);
    });
  });

  describe('getTerrainInsights', () => {
    it('should generate insights when data exists', () => {
      const insights = getTerrainInsights(mockEvents);
      expect(insights.length).toBeGreaterThan(0);
      expect(insights[0]).not.toBe('暂无地形相关数据');
    });

    it('should return default message when no data', () => {
      const events: Event[] = [];
      const insights = getTerrainInsights(events);
      expect(insights).toEqual(['暂无地形相关数据']);
    });
  });

  describe('getTerrainDistributionByEra', () => {
    it('should return terrain distribution for specific era', () => {
      const distribution = getTerrainDistributionByEra(mockEvents, 'warring-states');
      expect(distribution.length).toBeGreaterThan(0);
      distribution.forEach(d => {
        expect(d.eraId).toBe('warring-states');
      });
    });

    it('should return empty array for era with no battles', () => {
      const distribution = getTerrainDistributionByEra(mockEvents, 'unknown-era');
      expect(distribution).toEqual([]);
    });
  });

  describe('getTerrainSummary', () => {
    it('should return complete summary', () => {
      const summary = getTerrainSummary(mockEvents);
      
      expect(summary.hasTerrainData).toBe(true);
      expect(summary.uniqueTerrains).toBeGreaterThan(0);
      expect(summary.totalBattlesWithTerrain).toBeGreaterThan(0);
      expect(summary.terrainStats.length).toBeGreaterThan(0);
      expect(summary.mostCommonTerrains.length).toBeGreaterThan(0);
      expect(summary.terrainAdvantage.length).toBeGreaterThan(0);
      expect(summary.insights.length).toBeGreaterThan(0);
    });

    it('should return correct structure for empty data', () => {
      const events: Event[] = [];
      const summary = getTerrainSummary(events);
      
      expect(summary.hasTerrainData).toBe(false);
      expect(summary.uniqueTerrains).toBe(0);
      expect(summary.totalBattlesWithTerrain).toBe(0);
      expect(summary.terrainStats).toEqual([]);
      expect(summary.mostCommonTerrains).toEqual([]);
      expect(summary.terrainAdvantage).toEqual([]);
      expect(summary.insights).toEqual(['暂无地形相关数据']);
    });
  });
});
