/**
 * 战役俘虏/囚犯分析测试
 */

import { describe, it, expect, vi } from 'vitest';
import type { Event } from './types';
import {
  getPrisonerTypeLabel,
  getPrisonerTreatmentLabel,
  getPrisonerSideLabel,
  getPrisonerSeverityLabel,
  hasPrisonerData,
  getUniquePrisonerTypes,
  getPrisonerTypeStats,
  getAllPrisonerTypeStats,
  getPrisonerBySide,
  getMassivePrisonerBattles,
  getCommanderCapturedBattles,
  getExecutedPrisonerBattles,
  getIntegratedPrisonerBattles,
  getDecisivePrisonerImpactBattles,
  getTreatmentStats,
  getPrisonerResultCorrelation,
  getHighestPrisonerCountBattles,
  getPrisonerInsights,
  getPrisonerSummary,
} from './battlePrisoner';

// Mock 战役数据
const mockBattles: Event[] = [
  {
    id: 'battle-1',
    entityId: 'spring-autumn',
    year: -260,
    titleKey: 'battle.changping',
    summaryKey: 'battle.changping.summary',
    battle: {
      result: 'attacker_win',
      prisoners: [
        {
          type: 'captured-soldiers',
          description: '四十万赵军投降后被秦军坑杀',
          side: 'defender',
          number: 450000,
          treatment: 'executed',
          severity: 'massive',
          impact: 'decisive',
        },
        {
          type: 'captured-commanders',
          description: '赵括突围不成被杀',
          side: 'defender',
          number: 1,
          treatment: 'executed',
          severity: 'significant',
          impact: 'decisive',
        },
      ],
    },
  },
  {
    id: 'battle-2',
    entityId: 'warring-states',
    year: -341,
    titleKey: 'battle.maling',
    summaryKey: 'battle.maling.summary',
    battle: {
      result: 'attacker_win',
      prisoners: [
        {
          type: 'captured-soldiers',
          description: '魏军被俘',
          side: 'defender',
          number: 8000,
          treatment: 'integrated',
          severity: 'significant',
          impact: 'significant',
        },
      ],
    },
  },
  {
    id: 'battle-3',
    entityId: 'warring-states',
    year: -506,
    titleKey: 'battle.baiju',
    summaryKey: 'battle.baiju.summary',
    battle: {
      result: 'attacker_win',
      prisoners: [
        {
          type: 'captured-soldiers',
          description: '吴军俘获楚军',
          side: 'defender',
          number: 20000,
          treatment: 'released',
          severity: 'significant',
          impact: 'minor',
        },
      ],
    },
  },
  {
    id: 'battle-4',
    entityId: 'spring-autumn',
    year: -632,
    titleKey: 'battle.chengpu',
    summaryKey: 'battle.chengpu.summary',
    battle: {
      result: 'attacker_win',
      prisoners: [
        {
          type: 'captured-commanders',
          description: '楚将子玉被俘',
          side: 'defender',
          number: 1,
          treatment: 'ransomed',
          severity: 'moderate',
          impact: 'significant',
        },
      ],
    },
  },
  {
    id: 'battle-5',
    entityId: 'shang',
    year: -1046,
    titleKey: 'battle.muye',
    summaryKey: 'battle.muye.summary',
    battle: {
      result: 'attacker_win',
    },
  },
];

describe('battlePrisoner', () => {
  describe('getPrisonerTypeLabel', () => {
    it('should return correct label for captured-soldiers', () => {
      expect(getPrisonerTypeLabel('captured-soldiers')).toBe('被俘士兵');
    });

    it('should return correct label for captured-commanders', () => {
      expect(getPrisonerTypeLabel('captured-commanders')).toBe('被俘指挥官');
    });

    it('should return correct label for civilians', () => {
      expect(getPrisonerTypeLabel('civilians')).toBe('平民');
    });

    it('should return correct label for unknown', () => {
      expect(getPrisonerTypeLabel('unknown')).toBe('未知');
    });
  });

  describe('getPrisonerTreatmentLabel', () => {
    it('should return correct label for executed', () => {
      expect(getPrisonerTreatmentLabel('executed')).toBe('处死');
    });

    it('should return correct label for integrated', () => {
      expect(getPrisonerTreatmentLabel('integrated')).toBe('收编');
    });

    it('should return correct label for released', () => {
      expect(getPrisonerTreatmentLabel('released')).toBe('释放');
    });
  });

  describe('getPrisonerSideLabel', () => {
    it('should return correct label for attacker', () => {
      expect(getPrisonerSideLabel('attacker')).toBe('进攻方');
    });

    it('should return correct label for defender', () => {
      expect(getPrisonerSideLabel('defender')).toBe('防守方');
    });
  });

  describe('getPrisonerSeverityLabel', () => {
    it('should return correct label for massive', () => {
      expect(getPrisonerSeverityLabel('massive')).toBe('大规模');
    });

    it('should return correct label for significant', () => {
      expect(getPrisonerSeverityLabel('significant')).toBe('重大');
    });
  });

  describe('hasPrisonerData', () => {
    it('should return true when there is prisoner data', () => {
      expect(hasPrisonerData(mockBattles)).toBe(true);
    });

    it('should return false when there is no prisoner data', () => {
      expect(hasPrisonerData([mockBattles[4]])).toBe(false);
    });
  });

  describe('getUniquePrisonerTypes', () => {
    it('should return unique prisoner types', () => {
      const result = getUniquePrisonerTypes(mockBattles);
      expect(result).toContain('captured-soldiers');
      expect(result).toContain('captured-commanders');
    });
  });

  describe('getPrisonerTypeStats', () => {
    it('should return stats for captured-soldiers', () => {
      const result = getPrisonerTypeStats(mockBattles, 'captured-soldiers');
      expect(result.count).toBe(3);
      expect(result.battles).toContain('battle-1');
      expect(result.battles).toContain('battle-2');
      expect(result.battles).toContain('battle-3');
    });

    it('should return stats for captured-commanders', () => {
      const result = getPrisonerTypeStats(mockBattles, 'captured-commanders');
      expect(result.count).toBe(2);
      expect(result.battles).toContain('battle-1');
      expect(result.battles).toContain('battle-4');
    });
  });

  describe('getAllPrisonerTypeStats', () => {
    it('should return all prisoner type stats', () => {
      const result = getAllPrisonerTypeStats(mockBattles);
      expect(result.length).toBeGreaterThan(0);
      expect(result.find(r => r.type === 'captured-soldiers')?.count).toBe(3);
    });
  });

  describe('getPrisonerBySide', () => {
    it('should return prisoner stats by side', () => {
      const result = getPrisonerBySide(mockBattles);
      const defenderStats = result.find(r => r.side === 'defender');
      expect(defenderStats?.total).toBe(4);
    });
  });

  describe('getMassivePrisonerBattles', () => {
    it('should return battles with massive prisoners', () => {
      const result = getMassivePrisonerBattles(mockBattles);
      expect(result.length).toBe(2); // battle-1 (450000) and battle-3 (20000)
      expect(result[0].id).toBe('battle-1');
    });
  });

  describe('getCommanderCapturedBattles', () => {
    it('should return battles with commanders captured', () => {
      const result = getCommanderCapturedBattles(mockBattles);
      expect(result.length).toBe(2);
      expect(result.map(b => b.id)).toContain('battle-1');
      expect(result.map(b => b.id)).toContain('battle-4');
    });
  });

  describe('getExecutedPrisonerBattles', () => {
    it('should return battles with executed prisoners', () => {
      const result = getExecutedPrisonerBattles(mockBattles);
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('battle-1');
    });
  });

  describe('getIntegratedPrisonerBattles', () => {
    it('should return battles with integrated prisoners', () => {
      const result = getIntegratedPrisonerBattles(mockBattles);
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('battle-2');
    });
  });

  describe('getDecisivePrisonerImpactBattles', () => {
    it('should return battles with decisive prisoner impact', () => {
      const result = getDecisivePrisonerImpactBattles(mockBattles);
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('battle-1');
    });
  });

  describe('getTreatmentStats', () => {
    it('should return treatment statistics', () => {
      const result = getTreatmentStats(mockBattles);
      expect(result.length).toBeGreaterThan(0);
      const executed = result.find(r => r.treatment === 'executed');
      expect(executed?.count).toBe(1);
    });
  });

  describe('getPrisonerResultCorrelation', () => {
    it('should return correlation between prisoners and results', () => {
      const result = getPrisonerResultCorrelation(mockBattles);
      // 4 battles have defender prisoners and attacker_win result
      expect(result.defenderCapturedWin).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getHighestPrisonerCountBattles', () => {
    it('should return battles with highest prisoner counts', () => {
      const result = getHighestPrisonerCountBattles(mockBattles);
      expect(result.length).toBe(4);
      expect(result[0].battleId).toBe('battle-1');
      expect(result[0].total).toBe(450001);
    });
  });

  describe('getPrisonerInsights', () => {
    it('should return prisoner insights', () => {
      const result = getPrisonerInsights(mockBattles);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toContain('4');
    });
  });

  describe('getPrisonerSummary', () => {
    it('should return complete prisoner summary', () => {
      const result = getPrisonerSummary(mockBattles);
      expect(result.totalBattles).toBe(4);
      expect(result.totalPrisoners).toBe(478002);
      expect(result.prisonerTypes).toBe(2);
      expect(result.executedBattles).toBe(1);
      expect(result.integratedBattles).toBe(1);
      expect(result.insights.length).toBeGreaterThan(0);
    });
  });
});
