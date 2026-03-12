import { describe, it, expect } from 'vitest';
import type { Event } from './types';
import {
  getIntelligenceTypeLabel,
  getIntelligenceResultLabel,
  getUniqueIntelligenceTypes,
  hasIntelligenceData,
  getIntelligenceStats,
  getAllIntelligenceStats,
  getBattlesWithIntelligence,
  getBattlesByIntelligenceType,
  getBattlesByIntelligenceResult,
  getIntelligenceOutcomeCorrelation,
  getMostEffectiveIntelligenceTypes,
  getMostCommonIntelligenceTypes,
  getIntelligenceSideAnalysis,
  getIntelligenceInsights,
  getIntelligenceSummary,
} from './battleIntelligence';

const mockEvents: Event[] = [
  {
    id: 'battle1',
    entityId: 'spring-autumn',
    year: -260,
    titleKey: 'battle.changping',
    summaryKey: 'summary.changping',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '秦', defender: '赵' },
      result: 'attacker_win',
      intelligence: [
        {
          type: 'espionage',
          description: '秦军使用反间计，使赵国换下廉颇',
          side: 'attacker',
          result: 'success',
          benefit: 'attacker',
        },
        {
          type: 'deception',
          description: '秦军假装撤退，引诱赵军追击',
          side: 'attacker',
          result: 'success',
          benefit: 'attacker',
        },
      ],
    },
  },
  {
    id: 'battle2',
    entityId: 'warring-states',
    year: -341,
    titleKey: 'battle.maling',
    summaryKey: 'summary.maling',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '齐', defender: '魏' },
      result: 'attacker_win',
      intelligence: [
        {
          type: 'deception',
          description: '齐军假装撤退，诱敌深入',
          side: 'attacker',
          result: 'success',
          benefit: 'attacker',
        },
      ],
    },
  },
  {
    id: 'battle3',
    entityId: 'warring-states',
    year: -632,
    titleKey: 'battle.chengpu',
    summaryKey: 'summary.chengpu',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '晋', defender: '楚' },
      result: 'attacker_win',
      intelligence: [
        {
          type: 'reconnaissance',
          description: '晋军侦察楚军动向',
          side: 'attacker',
          result: 'success',
          benefit: 'attacker',
        },
      ],
    },
  },
  {
    id: 'battle4',
    entityId: 'warring-states',
    year: -506,
    titleKey: 'battle.baiju',
    summaryKey: 'summary.baiju',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '吴', defender: '楚' },
      result: 'attacker_win',
      intelligence: [
        {
          type: 'infiltration',
          description: '吴军策反楚国内部',
          side: 'attacker',
          result: 'success',
          benefit: 'attacker',
        },
      ],
    },
  },
  {
    id: 'battle5',
    entityId: 'spring-autumn',
    year: -1046,
    titleKey: 'battle.moye',
    summaryKey: 'summary.moye',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '周', defender: '商' },
      result: 'attacker_win',
      intelligence: [
        {
          type: 'defection',
          description: '商军临阵倒戈',
          side: 'both',
          result: 'success',
          benefit: 'attacker',
        },
      ],
    },
  },
  {
    id: 'battle6',
    entityId: 'han',
    year: -207,
    titleKey: 'battle.gaixia',
    summaryKey: 'summary.gaixia',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '汉', defender: '楚' },
      result: 'attacker_win',
      intelligence: [
        {
          type: 'propaganda',
          description: '汉军心理战，动摇楚军士气',
          side: 'attacker',
          result: 'success',
          benefit: 'attacker',
        },
      ],
    },
  },
  {
    id: 'battle7',
    entityId: 'three-kingdoms',
    year: -208,
    titleKey: 'battle.red-cliffs',
    summaryKey: 'summary.red-cliffs',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '曹操', defender: '孙刘联军' },
      result: 'defender_win',
      intelligence: [
        {
          type: 'espionage',
          description: '周瑜使用反间计',
          side: 'defender',
          result: 'success',
          benefit: 'defender',
        },
        {
          type: 'deception',
          description: '黄盖诈降',
          side: 'defender',
          result: 'success',
          benefit: 'defender',
        },
      ],
    },
  },
  {
    id: 'battle8',
    entityId: 'three-kingdoms',
    year: -228,
    titleKey: 'battle.ditiang',
    summaryKey: 'summary.ditiang',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '蜀', defender: '魏' },
      result: 'defender_win',
      intelligence: [
        {
          type: 'deception',
          description: '诸葛亮使用空城计',
          side: 'defender',
          result: 'success',
          benefit: 'defender',
        },
      ],
    },
  },
  {
    id: 'battle9',
    entityId: 'warring-states',
    year: -260,
    titleKey: 'battle.changping2',
    summaryKey: 'summary.changping2',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '秦', defender: '赵' },
      result: 'attacker_win',
      intelligence: [
        {
          type: 'espionage',
          description: '间谍活动',
          side: 'attacker',
          result: 'failure',
        },
      ],
    },
  },
  {
    id: 'battle10',
    entityId: 'tang',
    year: -621,
    titleKey: 'battle.luoyang',
    summaryKey: 'summary.luoyang',
    tags: ['war'],
    battle: {
      belligerents: { attacker: '秦王', defender: '王世充' },
      result: 'attacker_win',
    },
  },
];

describe('battleIntelligence', () => {
  describe('getIntelligenceTypeLabel', () => {
    it('should return correct Chinese labels', () => {
      expect(getIntelligenceTypeLabel('espionage')).toBe('间谍活动');
      expect(getIntelligenceTypeLabel('infiltration')).toBe('渗透/内应');
      expect(getIntelligenceTypeLabel('deception')).toBe('欺诈/诱敌');
      expect(getIntelligenceTypeLabel('counter-intelligence')).toBe('反间谍');
      expect(getIntelligenceTypeLabel('reconnaissance')).toBe('侦察');
      expect(getIntelligenceTypeLabel('propaganda')).toBe('宣传/心理战');
      expect(getIntelligenceTypeLabel('defection')).toBe('倒戈/投诚');
      expect(getIntelligenceTypeLabel('sabotage')).toBe('破坏活动');
      expect(getIntelligenceTypeLabel('unknown')).toBe('未知');
    });

    it('should return empty string for unknown type', () => {
      expect(getIntelligenceTypeLabel('invalid' as any)).toBe('');
    });
  });

  describe('getIntelligenceResultLabel', () => {
    it('should return correct Chinese labels', () => {
      expect(getIntelligenceResultLabel('success')).toBe('成功');
      expect(getIntelligenceResultLabel('failure')).toBe('失败');
      expect(getIntelligenceResultLabel('partial')).toBe('部分成功');
      expect(getIntelligenceResultLabel('unknown')).toBe('未知');
    });
  });

  describe('getUniqueIntelligenceTypes', () => {
    it('should return unique intelligence types', () => {
      const types = getUniqueIntelligenceTypes(mockEvents);
      expect(types).toContain('espionage');
      expect(types).toContain('deception');
      expect(types).toContain('reconnaissance');
      expect(types).toContain('infiltration');
      expect(types).toContain('defection');
      expect(types).toContain('propaganda');
    });
  });

  describe('hasIntelligenceData', () => {
    it('should return true when intelligence data exists', () => {
      expect(hasIntelligenceData(mockEvents)).toBe(true);
    });

    it('should return false when no intelligence data', () => {
      const eventsNoIntel: Event[] = [
        {
          id: 'battle-no-intel',
          entityId: 'han',
          year: -200,
          titleKey: 'battle.test',
          summaryKey: 'summary.test',
          tags: ['war'],
          battle: {
            belligerents: { attacker: 'A', defender: 'B' },
            result: 'attacker_win',
          },
        },
      ];
      expect(hasIntelligenceData(eventsNoIntel)).toBe(false);
    });
  });

  describe('getIntelligenceStats', () => {
    it('should return correct stats for espionage', () => {
      const stats = getIntelligenceStats(mockEvents, 'espionage');
      expect(stats.type).toBe('espionage');
      expect(stats.label).toBe('间谍活动');
      expect(stats.totalOperations).toBe(3);
      expect(stats.successCount).toBe(2);
      expect(stats.failureCount).toBe(1);
    });

    it('should calculate success rate correctly', () => {
      const stats = getIntelligenceStats(mockEvents, 'espionage');
      // 2 success, 1 failure = 66.67%
      expect(stats.successRate).toBeCloseTo(66.67, 1);
    });
  });

  describe('getAllIntelligenceStats', () => {
    it('should return stats for all intelligence types', () => {
      const stats = getAllIntelligenceStats(mockEvents);
      expect(stats.length).toBeGreaterThan(0);
      expect(stats.every(s => s.totalOperations > 0)).toBe(true);
    });
  });

  describe('getBattlesWithIntelligence', () => {
    it('should return battles with intelligence data', () => {
      const battles = getBattlesWithIntelligence(mockEvents);
      expect(battles.length).toBe(9);
    });
  });

  describe('getBattlesByIntelligenceType', () => {
    it('should filter battles by intelligence type', () => {
      const battles = getBattlesByIntelligenceType(mockEvents, 'deception');
      expect(battles.length).toBe(4);
    });
  });

  describe('getBattlesByIntelligenceResult', () => {
    it('should filter battles by intelligence result', () => {
      const successBattles = getBattlesByIntelligenceResult(mockEvents, 'success');
      expect(successBattles.length).toBe(8);
      
      const failureBattles = getBattlesByIntelligenceResult(mockEvents, 'failure');
      expect(failureBattles.length).toBe(1);
    });
  });

  describe('getIntelligenceOutcomeCorrelation', () => {
    it('should calculate correlation between intelligence and outcome', () => {
      const correlation = getIntelligenceOutcomeCorrelation(mockEvents);
      
      // Intelligence success cases
      expect(correlation.intelligenceSuccess.attackerWin).toBeGreaterThan(0);
      expect(correlation.intelligenceSuccess.defenderWin).toBeGreaterThan(0);
    });
  });

  describe('getMostEffectiveIntelligenceTypes', () => {
    it('should return most effective intelligence types sorted by success rate', () => {
      const types = getMostEffectiveIntelligenceTypes(mockEvents, 2);
      if (types.length > 0) {
        expect(types[0].successRate).toBeGreaterThanOrEqual(types[1]?.successRate || 0);
      }
    });
  });

  describe('getMostCommonIntelligenceTypes', () => {
    it('should return most common intelligence types', () => {
      const types = getMostCommonIntelligenceTypes(mockEvents, 5);
      expect(types.length).toBeGreaterThan(0);
      expect(types[0].totalOperations).toBeGreaterThanOrEqual(types[1]?.totalOperations || 0);
    });
  });

  describe('getIntelligenceSideAnalysis', () => {
    it('should analyze which side uses intelligence more', () => {
      const analysis = getIntelligenceSideAnalysis(mockEvents);
      
      expect(analysis.totalOperations).toBeGreaterThan(0);
      expect(analysis.attackerOperations).toBeGreaterThan(0);
      expect(analysis.defenderOperations).toBeGreaterThan(0);
    });
  });

  describe('getIntelligenceInsights', () => {
    it('should generate historical insights', () => {
      const insights = getIntelligenceInsights(mockEvents);
      
      expect(Array.isArray(insights)).toBe(true);
      expect(insights.length).toBeGreaterThan(0);
      expect(insights.every(i => typeof i === 'string')).toBe(true);
    });

    it('should return default message when no data', () => {
      const eventsNoIntel: Event[] = [
        {
          id: 'battle-no-intel',
          entityId: 'han',
          year: -200,
          titleKey: 'battle.test',
          summaryKey: 'summary.test',
          tags: ['war'],
          battle: {
            belligerents: { attacker: 'A', defender: 'B' },
            result: 'attacker_win',
          },
        },
      ];
      
      const insights = getIntelligenceInsights(eventsNoIntel);
      expect(insights).toContain('暂无情报活动相关数据');
    });
  });

  describe('getIntelligenceSummary', () => {
    it('should return complete summary', () => {
      const summary = getIntelligenceSummary(mockEvents);
      
      expect(summary.hasIntelligenceData).toBe(true);
      expect(summary.uniqueTypes).toBeGreaterThan(0);
      expect(summary.totalOperations).toBeGreaterThan(0);
      expect(summary.intelligenceStats).toBeDefined();
      expect(summary.mostCommonTypes).toBeDefined();
      expect(summary.mostEffectiveTypes).toBeDefined();
      expect(summary.sideAnalysis).toBeDefined();
      expect(summary.outcomeCorrelation).toBeDefined();
      expect(summary.insights).toBeDefined();
    });
  });
});
