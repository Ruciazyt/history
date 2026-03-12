import { describe, it, expect } from 'vitest';
import {
  getCauseTypeLabel,
  getSeverityLabel,
  getUniqueCauseTypes,
  hasCauseData,
  getCauseTypeStats,
  getAllCauseTypeStats,
  getBattlesByCauseType,
  getMostCommonCauseTypes,
  getCauseSeverityDistribution,
  getBattlesWithMostCauses,
  getCauseResultCorrelation,
  getDefensiveVsOffensiveStats,
  getCauseInsights,
  getCauseSummary,
} from './battleCause';
import { Event } from './types';

// 创建测试用的战役数据
const mockEvents: Event[] = [
  {
    id: 'battle-1',
    entityId: 'qin',
    year: -260,
    titleKey: 'battle.changping',
    summaryKey: 'summary.changping',
    battle: {
      result: 'attacker_win',
      causes: [
        {
          type: 'territorial-dispute',
          description: '秦赵两国争夺上党地区',
          parties: ['秦国', '赵国'],
          severity: 'critical',
          duration: 5,
        },
        {
          type: 'revenge',
          description: '秦国报复赵国',
          parties: ['秦国', '赵国'],
          severity: 'major',
        },
      ],
    },
  },
  {
    id: 'battle-2',
    entityId: 'qi',
    year: -341,
    titleKey: 'battle.maling',
    summaryKey: 'summary.maling',
    battle: {
      result: 'attacker_win',
      causes: [
        {
          type: 'revenge',
          description: '齐国报复魏国',
          parties: ['齐国', '魏国'],
          severity: 'major',
          duration: 3,
        },
      ],
    },
  },
  {
    id: 'battle-3',
    entityId: 'chu',
    year: -506,
    titleKey: 'battle.boju',
    summaryKey: 'summary.boju',
    battle: {
      result: 'attacker_win',
      causes: [
        {
          type: 'territorial-dispute',
          description: '吴楚争夺江淮地区',
          parties: ['吴国', '楚国'],
          severity: 'major',
        },
      ],
    },
  },
  {
    id: 'battle-4',
    entityId: 'wei',
    year: -343,
    titleKey: 'battle.chengpu',
    summaryKey: 'summary.chengpu',
    battle: {
      result: 'attacker_win',
      causes: [
        {
          type: 'alliance-obligation',
          description: '晋国履行联盟义务',
          parties: ['晋国', '楚国'],
          severity: 'minor',
        },
      ],
    },
  },
  {
    id: 'battle-5',
    entityId: 'zhou',
    year: -1046,
    titleKey: 'battle.moye',
    summaryKey: 'summary.moye',
    battle: {
      result: 'attacker_win',
      causes: [
        {
          type: 'dynastic-conflict',
          description: '周朝更替',
          parties: ['周', '商'],
          severity: 'critical',
        },
        {
          type: 'defensive-war',
          description: '周武王自卫反击',
          parties: ['周', '商'],
          severity: 'major',
        },
      ],
    },
  },
  {
    id: 'battle-6',
    entityId: 'qin',
    year: -230,
    titleKey: 'battle.zhao',
    summaryKey: 'summary.zhao',
    battle: {
      result: 'attacker_win',
      causes: [
        {
          type: 'expansionism',
          description: '秦国统一六国战略',
          parties: ['秦国', '赵国'],
          severity: 'critical',
        },
      ],
    },
  },
  // 没有原因数据的战役
  {
    id: 'battle-7',
    entityId: 'han',
    year: -260,
    titleKey: 'battle.han',
    summaryKey: 'summary.han',
    battle: {
      result: 'defender_win',
    },
  },
];

describe('battleCause', () => {
  describe('getCauseTypeLabel', () => {
    it('should return correct Chinese label for territorial-dispute', () => {
      expect(getCauseTypeLabel('territorial-dispute')).toBe('领土争端');
    });

    it('should return correct Chinese label for revenge', () => {
      expect(getCauseTypeLabel('revenge')).toBe('复仇');
    });

    it('should return correct Chinese label for defensive-war', () => {
      expect(getCauseTypeLabel('defensive-war')).toBe('自卫战争');
    });

    it('should return 未知 for unknown type', () => {
      expect(getCauseTypeLabel('unknown' as any)).toBe('未知');
    });
  });

  describe('getSeverityLabel', () => {
    it('should return correct Chinese label for critical', () => {
      expect(getSeverityLabel('critical')).toBe('决定性');
    });

    it('should return correct Chinese label for major', () => {
      expect(getSeverityLabel('major')).toBe('重大');
    });

    it('should return correct Chinese label for minor', () => {
      expect(getSeverityLabel('minor')).toBe('轻微');
    });
  });

  describe('getUniqueCauseTypes', () => {
    it('should return all unique cause types', () => {
      const types = getUniqueCauseTypes(mockEvents);
      expect(types).toContain('territorial-dispute');
      expect(types).toContain('revenge');
      expect(types).toContain('alliance-obligation');
      expect(types).toContain('dynastic-conflict');
      expect(types).toContain('expansionism');
    });
  });

  describe('hasCauseData', () => {
    it('should return true when events have cause data', () => {
      expect(hasCauseData(mockEvents)).toBe(true);
    });

    it('should return false when no events have cause data', () => {
      const eventsWithoutCauses: Event[] = [
        { id: 'b1', entityId: 'e1', year: -100, titleKey: 't', summaryKey: 's', battle: {} },
      ];
      expect(hasCauseData(eventsWithoutCauses)).toBe(false);
    });
  });

  describe('getCauseTypeStats', () => {
    it('should return correct stats for territorial-dispute', () => {
      const stats = getCauseTypeStats(mockEvents, 'territorial-dispute');
      expect(stats.count).toBe(2);
      expect(stats.battles).toContain('battle.changping');
      expect(stats.battles).toContain('battle.boju');
    });

    it('should return correct stats for revenge', () => {
      const stats = getCauseTypeStats(mockEvents, 'revenge');
      expect(stats.count).toBe(2);
      expect(stats.battles).toContain('battle.changping');
      expect(stats.battles).toContain('battle.maling');
    });

    it('should return empty stats for non-existent type', () => {
      const stats = getCauseTypeStats(mockEvents, 'rebellion');
      expect(stats.count).toBe(0);
      expect(stats.battles).toHaveLength(0);
    });
  });

  describe('getAllCauseTypeStats', () => {
    it('should return all cause types with counts', () => {
      const stats = getAllCauseTypeStats(mockEvents);
      const territorial = stats.find(s => s.type === 'territorial-dispute');
      expect(territorial?.count).toBe(2);
    });

    it('should return sorted by count descending', () => {
      const stats = getAllCauseTypeStats(mockEvents);
      for (let i = 1; i < stats.length; i++) {
        expect(stats[i - 1].count).toBeGreaterThanOrEqual(stats[i].count);
      }
    });
  });

  describe('getBattlesByCauseType', () => {
    it('should return battles with specified cause type', () => {
      const results = getBattlesByCauseType(mockEvents, 'revenge');
      expect(results.length).toBe(2);
      expect(results[0].cause.type).toBe('revenge');
    });
  });

  describe('getMostCommonCauseTypes', () => {
    it('should return top cause types', () => {
      const mostCommon = getMostCommonCauseTypes(mockEvents, 3);
      expect(mostCommon.length).toBeGreaterThan(0);
      expect(mostCommon[0].count).toBeGreaterThanOrEqual(mostCommon[1].count);
    });
  });

  describe('getCauseSeverityDistribution', () => {
    it('should return correct severity distribution', () => {
      const dist = getCauseSeverityDistribution(mockEvents);
      expect(dist.critical).toBe(3);
      expect(dist.major).toBe(4);
      expect(dist.minor).toBe(1);
    });
  });

  describe('getBattlesWithMostCauses', () => {
    it('should return battles sorted by cause count', () => {
      const battles = getBattlesWithMostCauses(mockEvents, 3);
      expect(battles[0].causeCount).toBeGreaterThanOrEqual(battles[1].causeCount);
    });
  });

  describe('getCauseResultCorrelation', () => {
    it('should return correlation data', () => {
      const correlation = getCauseResultCorrelation(mockEvents);
      const territorial = correlation.find(c => c.causeType === 'territorial-dispute');
      expect(territorial?.attackerWin).toBe(2);
    });
  });

  describe('getDefensiveVsOffensiveStats', () => {
    it('should return defensive and offensive stats', () => {
      const stats = getDefensiveVsOffensiveStats(mockEvents);
      expect(stats.defensive.total).toBe(1); // only defensive-war
      expect(stats.offensive.total).toBeGreaterThan(0);
    });
  });

  describe('getCauseInsights', () => {
    it('should return insights array', () => {
      const insights = getCauseInsights(mockEvents);
      expect(insights.length).toBeGreaterThan(0);
      expect(insights[0]).toBeTypeOf('string');
    });

    it('should return default message when no data', () => {
      const events: Event[] = [
        { id: 'b1', entityId: 'e1', year: -100, titleKey: 't', summaryKey: 's', battle: {} },
      ];
      const insights = getCauseInsights(events);
      expect(insights).toEqual(['暂无战役原因数据']);
    });
  });

  describe('getCauseSummary', () => {
    it('should return complete summary', () => {
      const summary = getCauseSummary(mockEvents);
      expect(summary.totalCauses).toBeGreaterThan(0);
      expect(summary.uniqueTypes).toBeGreaterThan(0);
      expect(summary.hasData).toBe(true);
      expect(summary.mostCommon.length).toBeGreaterThan(0);
      expect(summary.severityDistribution).toBeDefined();
      expect(summary.defensiveVsOffensive).toBeDefined();
      expect(summary.insights.length).toBeGreaterThan(0);
    });
  });
});
