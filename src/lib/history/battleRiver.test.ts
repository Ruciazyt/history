import { describe, it, expect } from 'vitest';
import {
  getRiverOperationTypeLabel,
  getRiverOperationResultLabel,
  getRiverPositionLabel,
  getUniqueRiverOperationTypes,
  hasRiverOperationData,
  getRiverOperationStats,
  getAllRiverOperationStats,
  getBattlesWithRiverOperations,
  getBattlesByRiverOperationType,
  getBattlesByRiverOperationResult,
  getMostCommonRiverOperationTypes,
  getMostEffectiveRiverOperationTypes,
  getRiverOutcomeCorrelation,
  getRiverPositionAnalysis,
  getDecisiveRiverOperationBattles,
  getBattlesWithWaterTerrain,
  getRiverSideAnalysis,
  getRiverOperationInsights,
  getRiverOperationSummary,
} from './battleRiver';

describe('battleRiver', () => {
  // Mock events with river operations data
  const mockEvents = [
    {
      id: 'battle-1',
      entityId: 'spring-autumn',
      year: -260,
      titleKey: 'battle.changping',
      summaryKey: 'battle.changping.desc',
      tags: ['war'],
      tags: ['war'],
      battle: {
        belligerents: { attacker: '秦', defender: '赵' },
        result: 'attacker_win' as const,
        terrain: ['plains', 'mountains'] as any[],
        riverOperations: [
          {
            type: 'river-crossing' as const,
            description: '秦军渡过丹水',
            riverName: '丹水',
            side: 'attacker' as const,
            result: 'success' as const,
            position: 'upstream' as const,
            decisive: true,
          },
        ],
      },
    },
    {
      id: 'battle-2',
      entityId: 'warring-states',
      year: -341,
      titleKey: 'battle.maling',
      summaryKey: 'battle.maling.desc',
      tags: ['war'],
      battle: {
        belligerents: { attacker: '齐', defender: '魏' },
        result: 'attacker_win' as const,
        terrain: ['plains'] as any[],
        riverOperations: [
          {
            type: 'river-ambush' as const,
            description: '马陵河谷伏击',
            riverName: '马陵河',
            side: 'attacker' as const,
            result: 'success' as const,
            position: 'downstream' as const,
          },
        ],
      },
    },
    {
      id: 'battle-3',
      entityId: 'warring-states',
      year: -632,
      titleKey: 'battle.chengpu',
      summaryKey: 'battle.chengpu.desc',
      tags: ['war'],
      battle: {
        belligerents: { attacker: '晋', defender: '楚' },
        result: 'attacker_win' as const,
        terrain: ['plains'] as any[],
        riverOperations: [
          {
            type: 'ford-crossing' as const,
            description: '晋军涉水渡河',
            riverName: '黄河',
            side: 'attacker' as const,
            result: 'success' as const,
            position: 'midstream' as const,
          },
        ],
      },
    },
    {
      id: 'battle-4',
      entityId: 'three-kingdoms',
      year: -208,
      titleKey: 'battle.red cliffs',
      summaryKey: 'battle.red cliffs.desc',
      tags: ['war'],
      battle: {
        belligerents: { attacker: '曹操', defender: '孙刘联军' },
        result: 'defender_win' as const,
        terrain: ['water', 'riverbank'] as any[],
        riverOperations: [
          {
            type: 'naval-battle' as const,
            description: '赤壁水战',
            riverName: '长江',
            side: 'attacker' as const,
            result: 'failure' as const,
            position: 'downstream' as const,
            decisive: true,
          },
        ],
      },
    },
    {
      id: 'battle-5',
      entityId: 'han',
      year: -202,
      titleKey: 'battle.gaixia',
      summaryKey: 'battle.gaixia.desc',
      tags: ['war'],
      battle: {
        belligerents: { attacker: '刘邦', defender: '项羽' },
        result: 'attacker_win' as const,
        terrain: ['pass', 'mountains'] as any[],
        riverOperations: [
          {
            type: 'river-crossing' as const,
            description: '汉军渡河追击',
            riverName: '泗水',
            side: 'attacker' as const,
            result: 'success' as const,
            position: 'upstream' as const,
          },
        ],
      },
    },
    {
      id: 'battle-6',
      entityId: 'han',
      year: -154,
      titleKey: 'battle.tribal',
      summaryKey: 'battle.tribal.desc',
      tags: ['war'],
      battle: {
        belligerents: { attacker: '汉', defender: '吴' },
        result: 'attacker_win' as const,
        terrain: ['water'] as any[],
        riverOperations: [
          {
            type: 'pontoon-bridge' as const,
            description: '搭建浮桥渡河',
            side: 'attacker' as const,
            result: 'partial' as const,
            position: 'riverbank' as const,
          },
        ],
      },
    },
    // Battle without river operations
    {
      id: 'battle-7',
      entityId: 'warring-states',
      year: -270,
      titleKey: 'battle.yique',
      summaryKey: 'battle.yique.desc',
      tags: ['war'],
      battle: {
        belligerents: { attacker: '秦', defender: '赵' },
        result: 'defender_win' as const,
        terrain: ['plains'] as any[],
      },
    },
  ] as any;

  describe('getRiverOperationTypeLabel', () => {
    it('should return correct label for river-crossing', () => {
      expect(getRiverOperationTypeLabel('river-crossing')).toBe('渡河作战');
    });

    it('should return correct label for pontoon-bridge', () => {
      expect(getRiverOperationTypeLabel('pontoon-bridge')).toBe('浮桥渡河');
    });

    it('should return correct label for naval-battle', () => {
      expect(getRiverOperationTypeLabel('naval-battle')).toBe('水战/海战');
    });

    it('should return correct label for unknown type', () => {
      expect(getRiverOperationTypeLabel('unknown' as any)).toBe('未知');
    });
  });

  describe('getRiverOperationResultLabel', () => {
    it('should return correct label for success', () => {
      expect(getRiverOperationResultLabel('success')).toBe('成功');
    });

    it('should return correct label for failure', () => {
      expect(getRiverOperationResultLabel('failure')).toBe('失败');
    });

    it('should return correct label for delayed', () => {
      expect(getRiverOperationResultLabel('delayed')).toBe('延误');
    });
  });

  describe('getRiverPositionLabel', () => {
    it('should return correct label for upstream', () => {
      expect(getRiverPositionLabel('upstream')).toBe('上游（占据优势）');
    });

    it('should return correct label for downstream', () => {
      expect(getRiverPositionLabel('downstream')).toBe('下游');
    });

    it('should return correct label for riverbank', () => {
      expect(getRiverPositionLabel('riverbank')).toBe('河岸');
    });
  });

  describe('getUniqueRiverOperationTypes', () => {
    it('should return unique river operation types', () => {
      const types = getUniqueRiverOperationTypes(mockEvents);
      expect(types).toContain('river-crossing');
      expect(types).toContain('river-ambush');
      expect(types).toContain('ford-crossing');
      expect(types).toContain('naval-battle');
      expect(types).toContain('pontoon-bridge');
    });

    it('should return sorted array', () => {
      const types = getUniqueRiverOperationTypes(mockEvents);
      expect(types).toEqual([...types].sort());
    });
  });

  describe('hasRiverOperationData', () => {
    it('should return true when battles have river operations', () => {
      expect(hasRiverOperationData(mockEvents)).toBe(true);
    });

    it('should return false when no battles have river operations', () => {
      const eventsWithoutRiver = mockEvents.slice(-1); // battle-7 has no river ops
      expect(hasRiverOperationData(eventsWithoutRiver as any)).toBe(false);
    });
  });

  describe('getRiverOperationStats', () => {
    it('should return stats for specific river operation type', () => {
      const stats = getRiverOperationStats(mockEvents, 'river-crossing');
      expect(stats.type).toBe('river-crossing');
      expect(stats.label).toBe('渡河作战');
      expect(stats.totalOperations).toBe(2); // battle-1, battle-5
      expect(stats.successCount).toBe(2);
      expect(stats.failureCount).toBe(0);
      expect(stats.successRate).toBe(100);
    });

    it('should return correct attacker/defender side counts', () => {
      const stats = getRiverOperationStats(mockEvents, 'river-crossing');
      expect(stats.attackerSide).toBe(2);
      expect(stats.defenderSide).toBe(0);
      expect(stats.bothSides).toBe(0);
    });
  });

  describe('getAllRiverOperationStats', () => {
    it('should return stats for all river operation types', () => {
      const stats = getAllRiverOperationStats(mockEvents);
      expect(stats.length).toBeGreaterThan(0);
      expect(stats.every(s => s.type && s.label && s.totalOperations >= 0)).toBe(true);
    });
  });

  describe('getBattlesWithRiverOperations', () => {
    it('should return battles with river operations', () => {
      const battles = getBattlesWithRiverOperations(mockEvents);
      expect(battles.length).toBeGreaterThanOrEqual(5); // battles 1-5
    });
  });

  describe('getBattlesByRiverOperationType', () => {
    it('should filter battles by river operation type', () => {
      const battles = getBattlesByRiverOperationType(mockEvents, 'river-crossing');
      expect(battles.length).toBe(2); // battle-1, battle-5
    });

    it('should return empty array for non-existent type', () => {
      const battles = getBattlesByRiverOperationType(mockEvents, 'coastal-landing' as any);
      expect(battles.length).toBe(0);
    });
  });

  describe('getBattlesByRiverOperationResult', () => {
    it('should filter battles by result', () => {
      const successBattles = getBattlesByRiverOperationResult(mockEvents, 'success');
      expect(successBattles.length).toBe(4); // battles 1,2,3,5
      
      const failureBattles = getBattlesByRiverOperationResult(mockEvents, 'failure');
      expect(failureBattles.length).toBe(1); // battle-4
      
      const partialBattles = getBattlesByRiverOperationResult(mockEvents, 'partial');
      expect(partialBattles.length).toBe(1); // battle-6
    });
  });

  describe('getMostCommonRiverOperationTypes', () => {
    it('should return most common types sorted by count', () => {
      const types = getMostCommonRiverOperationTypes(mockEvents, 5);
      expect(types[0].totalOperations).toBeGreaterThanOrEqual(types[1].totalOperations);
    });

    it('should respect limit parameter', () => {
      const types = getMostCommonRiverOperationTypes(mockEvents, 2);
      expect(types.length).toBeLessThanOrEqual(2);
    });
  });

  describe('getMostEffectiveRiverOperationTypes', () => {
    it('should return types sorted by success rate', () => {
      const types = getMostEffectiveRiverOperationTypes(mockEvents, 1);
      expect(types.length).toBeGreaterThan(0);
      if (types.length > 1) {
        expect(types[0].successRate).toBeGreaterThanOrEqual(types[1].successRate);
      }
    });

    it('should respect minOperations parameter', () => {
      const types = getMostEffectiveRiverOperationTypes(mockEvents, 10);
      expect(types.every(t => t.totalOperations >= 10)).toBe(true);
    });
  });

  describe('getRiverOutcomeCorrelation', () => {
    it('should return correlation data', () => {
      const correlation = getRiverOutcomeCorrelation(mockEvents);
      expect(correlation.riverSuccess).toBeDefined();
      expect(correlation.riverFailure).toBeDefined();
      expect(correlation.riverPartial).toBeDefined();
    });

    it('should correctly count successes leading to wins', () => {
      const correlation = getRiverOutcomeCorrelation(mockEvents);
      // River success in battles 1,2,3,5 all resulted in attacker wins (battle-6 has partial result)
      expect(correlation.riverSuccess.attackerWin).toBe(4);
    });
  });

  describe('getRiverPositionAnalysis', () => {
    it('should return position analysis', () => {
      const analysis = getRiverPositionAnalysis(mockEvents);
      expect(analysis.upstream).toBeDefined();
      expect(analysis.downstream).toBeDefined();
      expect(analysis.midstream).toBeDefined();
      expect(analysis.riverbank).toBeDefined();
    });

    it('should correctly count positions', () => {
      const analysis = getRiverPositionAnalysis(mockEvents);
      // battles with positions: 1(upstream), 2(downstream), 3(midstream), 4(downstream), 5(upstream), 6(riverbank)
      expect(analysis.upstream.total).toBe(2); // battles 1,5
      expect(analysis.downstream.total).toBe(2); // battles 2,4
      expect(analysis.midstream.total).toBe(1); // battle-3
      expect(analysis.riverbank.total).toBe(1); // battle-6
    });
  });

  describe('getDecisiveRiverOperationBattles', () => {
    it('should return battles with decisive river operations', () => {
      const battles = getDecisiveRiverOperationBattles(mockEvents);
      expect(battles.length).toBe(2); // battle-1, battle-4
    });
  });

  describe('getBattlesWithWaterTerrain', () => {
    it('should return battles with water terrain', () => {
      const battles = getBattlesWithWaterTerrain(mockEvents);
      // battles with 'water' terrain
      expect(battles.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('getRiverSideAnalysis', () => {
    it('should return side analysis', () => {
      const analysis = getRiverSideAnalysis(mockEvents);
      expect(analysis.totalBattles).toBeGreaterThanOrEqual(5);
      expect(analysis.attackerOperations).toBeGreaterThanOrEqual(5);
      expect(analysis.defenderOperations).toBe(0);
    });

    it('should calculate win rates correctly', () => {
      const analysis = getRiverSideAnalysis(mockEvents);
      expect(analysis.attackerWinRateWithRiver).toBeCloseTo(83.33, 1); // 5/6 attacker wins (battle-4 was defender win)
    });
  });

  describe('getRiverOperationInsights', () => {
    it('should return array of insights', () => {
      const insights = getRiverOperationInsights(mockEvents);
      expect(Array.isArray(insights)).toBe(true);
      expect(insights.length).toBeGreaterThan(0);
    });

    it('should return default message when no data', () => {
      const insights = getRiverOperationInsights([]);
      expect(insights).toContain('暂无渡河/水战相关数据');
    });
  });

  describe('getRiverOperationSummary', () => {
    it('should return complete summary', () => {
      const summary = getRiverOperationSummary(mockEvents);
      expect(summary.hasRiverOperationData).toBe(true);
      expect(summary.uniqueTypes).toBeGreaterThan(0);
      expect(summary.totalOperations).toBeGreaterThanOrEqual(5);
      expect(summary.riverOperationStats).toBeDefined();
      expect(summary.mostCommonTypes).toBeDefined();
      expect(summary.mostEffectiveTypes).toBeDefined();
      expect(summary.sideAnalysis).toBeDefined();
      expect(summary.positionAnalysis).toBeDefined();
      expect(summary.outcomeCorrelation).toBeDefined();
      expect(summary.insights).toBeDefined();
    });
  });
});
