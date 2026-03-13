/**
 * 战役后勤/补给分析测试
 */

import { describe, it, expect } from 'vitest';
import {
  getLogisticsTypeLabel,
  getSupplySourceLabel,
  getSupplyStatusLabel,
  hasLogisticsData,
  getUniqueLogisticsTypes,
  getLogisticsTypeStats,
  getAllLogisticsTypeStats,
  getLogisticsBySide,
  getBattlesWithLogistics,
  getBattlesByLogisticsType,
  getBattlesWithMostLogistics,
  getDecisiveLogisticsBattles,
  getLogisticsResultCorrelation,
  getSupplySourceAnalysis,
  getSupplyStatusAnalysis,
  getLogisticsInsights,
  getLogisticsSummary
} from './battleLogistics';
import type { Event } from './types';

// 测试数据
const mockEvents: Event[] = [
  {
    id: 'battle-1',
    entityId: 'qin',
    year: -260,
    titleKey: 'battle.changping',
    summaryKey: 'summary.changping',
    battle: {
      belligerents: { attacker: '秦国', defender: '赵国' },
      result: 'attacker_win',
      logistics: [
        {
          type: 'food-provision',
          description: '秦军断赵粮道',
          side: 'defender',
          source: 'home-base',
          status: 'cut-off',
          decisive: true
        },
        {
          type: 'supply-line',
          description: '秦军保障补给线',
          side: 'attacker',
          source: 'home-base',
          status: 'adequate'
        }
      ]
    }
  },
  {
    id: 'battle-2',
    entityId: 'qi',
    year: -341,
    titleKey: 'battle.maling',
    summaryKey: 'summary.maling',
    battle: {
      belligerents: { attacker: '齐国', defender: '魏国' },
      result: 'attacker_win',
      logistics: [
        {
          type: 'reinforcement',
          description: '齐国援军到达',
          side: 'attacker',
          source: 'allied-support',
          status: 'adequate'
        }
      ]
    }
  },
  {
    id: 'battle-3',
    entityId: 'chu',
    year: -506,
    titleKey: 'battle.boju',
    summaryKey: 'summary.boju',
    battle: {
      belligerents: { attacker: '吴国', defender: '楚国' },
      result: 'attacker_win',
      logistics: [
        {
          type: 'food-provision',
          description: '吴军粮草不足',
          side: 'attacker',
          status: 'strained'
        },
        {
          type: 'supply-line',
          description: '吴军远征补给困难',
          side: 'attacker',
          source: 'strategic-reserve',
          status: 'depleted'
        }
      ]
    }
  },
  {
    id: 'battle-4',
    entityId: 'jin',
    year: -632,
    titleKey: 'battle.chengpu',
    summaryKey: 'summary.chengpu',
    battle: {
      belligerents: { attacker: '晋国', defender: '楚国' },
      result: 'attacker_win',
      logistics: [
        {
          type: 'food-provision',
          description: '晋军假道伐虢',
          side: 'attacker',
          source: 'conquered-territory',
          status: 'adequate'
        }
      ]
    }
  },
  {
    id: 'battle-5',
    entityId: 'shang',
    year: -1046,
    titleKey: 'battle.moye',
    summaryKey: 'summary.moye',
    battle: {
      belligerents: { attacker: '周国', defender: '商国' },
      result: 'attacker_win',
      logistics: [] // 无后勤数据
    }
  }
];

describe('battleLogistics', () => {
  describe('getLogisticsTypeLabel', () => {
    it('should return correct label for food-provision', () => {
      expect(getLogisticsTypeLabel('food-provision')).toBe('粮草供应');
    });

    it('should return correct label for supply-line', () => {
      expect(getLogisticsTypeLabel('supply-line')).toBe('补给线');
    });

    it('should return correct label for reinforcement', () => {
      expect(getLogisticsTypeLabel('reinforcement')).toBe('援军/兵力补给');
    });

    it('should return 未知 for unknown type', () => {
      expect(getLogisticsTypeLabel('unknown' as any)).toBe('未知');
    });
  });

  describe('getSupplySourceLabel', () => {
    it('should return correct label for home-base', () => {
      expect(getSupplySourceLabel('home-base')).toBe('本土供应');
    });

    it('should return correct label for allied-support', () => {
      expect(getSupplySourceLabel('allied-support')).toBe('盟友支援');
    });

    it('should return correct label for conquered-territory', () => {
      expect(getSupplySourceLabel('conquered-territory')).toBe('征伐当地');
    });
  });

  describe('getSupplyStatusLabel', () => {
    it('should return correct label for adequate', () => {
      expect(getSupplyStatusLabel('adequate')).toBe('充足');
    });

    it('should return correct label for cut-off', () => {
      expect(getSupplyStatusLabel('cut-off')).toBe('切断');
    });

    it('should return correct label for depleted', () => {
      expect(getSupplyStatusLabel('depleted')).toBe('枯竭');
    });
  });

  describe('hasLogisticsData', () => {
    it('should return true when events have logistics data', () => {
      expect(hasLogisticsData(mockEvents)).toBe(true);
    });

    it('should return false when no events have logistics data', () => {
      const emptyEvents: Event[] = [
        {
          id: 'battle-empty',
          entityId: 'test',
          year: -100,
          titleKey: 'battle.test',
          summaryKey: 'summary.test',
          battle: {}
        }
      ];
      expect(hasLogisticsData(emptyEvents)).toBe(false);
    });
  });

  describe('getUniqueLogisticsTypes', () => {
    it('should return unique logistics types', () => {
      const types = getUniqueLogisticsTypes(mockEvents);
      expect(types).toContain('food-provision');
      expect(types).toContain('supply-line');
      expect(types).toContain('reinforcement');
    });
  });

  describe('getLogisticsTypeStats', () => {
    it('should return correct stats for food-provision', () => {
      const stats = getLogisticsTypeStats(mockEvents, 'food-provision');
      expect(stats.count).toBe(3); // battle-1, battle-3, battle-4
      expect(stats.decisive).toBe(1); // battle-1
    });

    it('should return correct stats for supply-line', () => {
      const stats = getLogisticsTypeStats(mockEvents, 'supply-line');
      expect(stats.count).toBe(2); // battle-1, battle-3
    });
  });

  describe('getAllLogisticsTypeStats', () => {
    it('should return stats for all types', () => {
      const stats = getAllLogisticsTypeStats(mockEvents);
      const foodProvision = stats.find(s => s.type === 'food-provision');
      expect(foodProvision?.count).toBe(3);
    });
  });

  describe('getLogisticsBySide', () => {
    it('should return correct side distribution', () => {
      const stats = getLogisticsBySide(mockEvents);
      expect(stats.attacker).toBe(5);
      expect(stats.defender).toBe(1);
      expect(stats.both).toBe(0);
    });
  });

  describe('getBattlesWithLogistics', () => {
    it('should return only battles with logistics data', () => {
      const battles = getBattlesWithLogistics(mockEvents);
      expect(battles.length).toBe(4);
    });
  });

  describe('getBattlesByLogisticsType', () => {
    it('should filter battles by logistics type', () => {
      const battles = getBattlesByLogisticsType(mockEvents, 'food-provision');
      expect(battles.length).toBe(3);
    });
  });

  describe('getBattlesWithMostLogistics', () => {
    it('should return top battles by logistics count', () => {
      const battles = getBattlesWithMostLogistics(mockEvents, 3);
      expect(battles[0].count).toBe(2); // battle-3
      expect(battles[1].count).toBe(2); // battle-1
    });
  });

  describe('getDecisiveLogisticsBattles', () => {
    it('should return battles with decisive logistics', () => {
      const battles = getDecisiveLogisticsBattles(mockEvents);
      expect(battles.length).toBe(1);
      expect(battles[0].id).toBe('battle-1');
    });
  });

  describe('getLogisticsResultCorrelation', () => {
    it('should return correct correlation data', () => {
      const correlation = getLogisticsResultCorrelation(mockEvents);
      expect(correlation.attacker.win).toBeGreaterThan(0);
    });
  });

  describe('getSupplySourceAnalysis', () => {
    it('should analyze supply sources', () => {
      const analysis = getSupplySourceAnalysis(mockEvents);
      expect(analysis.length).toBeGreaterThan(0);
      expect(analysis[0].label).toBeTruthy();
    });
  });

  describe('getSupplyStatusAnalysis', () => {
    it('should analyze supply status', () => {
      const analysis = getSupplyStatusAnalysis(mockEvents);
      expect(analysis.length).toBeGreaterThan(0);
      const cutOff = analysis.find(a => a.status === 'cut-off');
      expect(cutOff?.count).toBe(1);
    });
  });

  describe('getLogisticsInsights', () => {
    it('should generate insights', () => {
      const insights = getLogisticsInsights(mockEvents);
      expect(insights.length).toBeGreaterThan(0);
    });

    it('should return empty insight for no data', () => {
      const emptyEvents: Event[] = [
        {
          id: 'battle-empty',
          entityId: 'test',
          year: -100,
          titleKey: 'battle.test',
          summaryKey: 'summary.test',
          battle: {}
        }
      ];
      const insights = getLogisticsInsights(emptyEvents);
      expect(insights).toContain('暂无后勤/补给数据');
    });
  });

  describe('getLogisticsSummary', () => {
    it('should return complete summary', () => {
      const summary = getLogisticsSummary(mockEvents);
      expect(summary.totalBattles).toBe(5);
      expect(summary.battlesWithLogistics).toBe(4);
      expect(summary.coverage).toBe('80%');
      expect(summary.insights.length).toBeGreaterThan(0);
    });
  });
});
