/**
 * 战役通信/联络分析测试
 */

import { describe, it, expect } from 'vitest';
import type { Event } from './types';
import {
  getCommunicationTypeLabel,
  getCommunicationResultLabel,
  getCommunicationDirectionLabel,
  hasCommunicationData,
  getUniqueCommunicationTypes,
  getCommunicationTypeStats,
  getAllCommunicationTypeStats,
  getCommunicationBySide,
  getBattlesWithCommunication,
  getBattlesByCommunicationType,
  getMostCommunicationBattles,
  getCommunicationResultCorrelation,
  getCommunicationImpactAnalysis,
  getDecisiveCommunicationBattles,
  getInterceptedCommunicationBattles,
  getCommunicationInsights,
  getCommunicationSummary,
} from './battleCommunication';

// 测试数据
const mockEvents: Event[] = [
  {
    id: 'battle-1',
    entityId: 'spring-autumn',
    year: -260,
    titleKey: 'battles.changping',
    summaryKey: 'battles.changping.summary',
    battle: {
      belligerents: { attacker: '秦国', defender: '赵国' },
      result: 'attacker_win',
      communications: [
        {
          type: 'messenger',
          description: '赵括派使者向赵王请求援军',
          side: 'defender',
          result: 'success',
          direction: 'forward',
          impact: 'decisive',
        },
        {
          type: 'signal-fire',
          description: '秦军点燃烽火通知主力部队包围完成',
          side: 'attacker',
          result: 'success',
          impact: 'decisive',
          intercepted: false,
        },
      ],
    },
  },
  {
    id: 'battle-2',
    entityId: 'warring-states',
    year: -342,
    titleKey: 'battles.maling',
    summaryKey: 'battles.maling.summary',
    battle: {
      belligerents: { attacker: '齐国', defender: '魏国' },
      result: 'attacker_win',
      communications: [
        {
          type: 'flag',
          description: '齐军使用旗帜指挥撤退',
          side: 'attacker',
          result: 'success',
          impact: 'significant',
        },
        {
          type: 'messenger',
          description: '魏军信使被齐军截获',
          side: 'defender',
          result: 'intercepted',
          impact: 'decisive',
          intercepted: true,
        },
      ],
    },
  },
  {
    id: 'battle-3',
    entityId: 'spring-autumn',
    year: -632,
    titleKey: 'battles.chengpu',
    summaryKey: 'battles.chengpu.summary',
    battle: {
      belligerents: { attacker: '晋国', defender: '楚国' },
      result: 'attacker_win',
      communications: [
        {
          type: 'drum',
          description: '晋军击鼓进攻',
          side: 'attacker',
          result: 'success',
          impact: 'significant',
        },
        {
          type: 'horn',
          description: '楚军号角联络',
          side: 'defender',
          result: 'failure',
          impact: 'minor',
        },
      ],
    },
  },
  {
    id: 'battle-4',
    entityId: 'warring-states',
    year: -506,
    titleKey: 'battles.baiju',
    summaryKey: 'battles.baiju.summary',
    battle: {
      belligerents: { attacker: '吴国', defender: '楚国' },
      result: 'attacker_win',
      communications: [],
    },
  },
  {
    id: 'battle-5',
    entityId: ' Shang',
    year: -1046,
    titleKey: 'battles.muye',
    summaryKey: 'battles.muye.summary',
    battle: {
      belligerents: { attacker: '周国', defender: '商朝' },
      result: 'attacker_win',
      communications: [
        {
          type: 'signal-fire',
          description: '商军点燃烽火求援',
          side: 'defender',
          result: 'delayed',
          impact: 'significant',
        },
      ],
    },
  },
];

describe('battleCommunication', () => {
  describe('getCommunicationTypeLabel', () => {
    it('should return correct label for each communication type', () => {
      expect(getCommunicationTypeLabel('signal-fire')).toBe('烽火台/狼烟');
      expect(getCommunicationTypeLabel('drum')).toBe('鼓声联络');
      expect(getCommunicationTypeLabel('horn')).toBe('号角联络');
      expect(getCommunicationTypeLabel('flag')).toBe('战旗/旗帜信号');
      expect(getCommunicationTypeLabel('messenger')).toBe('信使/传令兵');
      expect(getCommunicationTypeLabel('unknown')).toBe('未知');
    });
  });

  describe('getCommunicationResultLabel', () => {
    it('should return correct label for each result type', () => {
      expect(getCommunicationResultLabel('success')).toBe('成功传达');
      expect(getCommunicationResultLabel('failure')).toBe('传达失败');
      expect(getCommunicationResultLabel('intercepted')).toBe('被截获');
      expect(getCommunicationResultLabel('delayed')).toBe('延迟传达');
      expect(getCommunicationResultLabel('unknown')).toBe('未知');
    });
  });

  describe('getCommunicationDirectionLabel', () => {
    it('should return correct label for each direction', () => {
      expect(getCommunicationDirectionLabel('forward')).toBe('前线→后方');
      expect(getCommunicationDirectionLabel('backward')).toBe('后方→前线');
      expect(getCommunicationDirectionLabel('lateral')).toBe('同级联络');
      expect(getCommunicationDirectionLabel('multi-directional')).toBe('多方向');
    });
  });

  describe('hasCommunicationData', () => {
    it('should return true when events have communications', () => {
      expect(hasCommunicationData(mockEvents)).toBe(true);
    });

    it('should return false when no events have communications', () => {
      const noCommEvents: Event[] = [
        { id: 'b1', entityId: 'e1', year: 100, titleKey: 't1', summaryKey: 's1', battle: {} },
      ];
      expect(hasCommunicationData(noCommEvents)).toBe(false);
    });
  });

  describe('getUniqueCommunicationTypes', () => {
    it('should return all unique communication types', () => {
      const types = getUniqueCommunicationTypes(mockEvents);
      expect(types).toContain('messenger');
      expect(types).toContain('signal-fire');
      expect(types).toContain('flag');
      expect(types).toContain('drum');
      expect(types).toContain('horn');
    });
  });

  describe('getCommunicationTypeStats', () => {
    it('should return correct stats for messenger type', () => {
      const stats = getCommunicationTypeStats(mockEvents, 'messenger');
      expect(stats.total).toBe(2);
      expect(stats.success).toBe(1);
      expect(stats.intercepted).toBe(1);
    });

    it('should return zero stats for non-existent type', () => {
      const stats = getCommunicationTypeStats(mockEvents, 'relay');
      expect(stats.total).toBe(0);
      expect(stats.success).toBe(0);
    });
  });

  describe('getAllCommunicationTypeStats', () => {
    it('should return stats for all communication types', () => {
      const allStats = getAllCommunicationTypeStats(mockEvents);
      expect(allStats.length).toBeGreaterThan(0);
      expect(allStats[0]).toHaveProperty('type');
      expect(allStats[0]).toHaveProperty('label');
      expect(allStats[0]).toHaveProperty('total');
    });
  });

  describe('getCommunicationBySide', () => {
    it('should return correct side distribution', () => {
      const stats = getCommunicationBySide(mockEvents);
      expect(stats.attacker).toBeGreaterThanOrEqual(0);
      expect(stats.defender).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getBattlesWithCommunication', () => {
    it('should return only battles with communications', () => {
      const battles = getBattlesWithCommunication(mockEvents);
      expect(battles.length).toBe(4);
      expect(battles.find(b => b.id === 'battle-4')).toBeUndefined();
    });
  });

  describe('getBattlesByCommunicationType', () => {
    it('should filter battles by communication type', () => {
      const battles = getBattlesByCommunicationType(mockEvents, 'signal-fire');
      expect(battles.length).toBe(2);
    });

    it('should return empty array for non-existent type', () => {
      const battles = getBattlesByCommunicationType(mockEvents, 'encrypted-message');
      expect(battles.length).toBe(0);
    });
  });

  describe('getMostCommunicationBattles', () => {
    it('should return battles sorted by communication count', () => {
      const battles = getMostCommunicationBattles(mockEvents, 3);
      expect(battles.length).toBe(3);
      expect(battles[0].count).toBeGreaterThanOrEqual(battles[1].count);
    });
  });

  describe('getCommunicationResultCorrelation', () => {
    it('should return correct result correlation by side', () => {
      const correlation = getCommunicationResultCorrelation(mockEvents);
      expect(correlation.attacker).toHaveProperty('success');
      expect(correlation.attacker).toHaveProperty('failure');
      expect(correlation.defender).toHaveProperty('success');
      expect(correlation.defender).toHaveProperty('failure');
    });
  });

  describe('getCommunicationImpactAnalysis', () => {
    it('should return impact distribution', () => {
      const impact = getCommunicationImpactAnalysis(mockEvents);
      expect(impact.decisive).toBeGreaterThan(0);
      expect(impact.significant).toBeGreaterThan(0);
    });
  });

  describe('getDecisiveCommunicationBattles', () => {
    it('should return battles with decisive communication impact', () => {
      const battles = getDecisiveCommunicationBattles(mockEvents);
      expect(battles.length).toBeGreaterThan(0);
    });
  });

  describe('getInterceptedCommunicationBattles', () => {
    it('should return battles with intercepted communications', () => {
      const battles = getInterceptedCommunicationBattles(mockEvents);
      expect(battles.length).toBe(1);
      expect(battles[0].id).toBe('battle-2');
    });
  });

  describe('getCommunicationInsights', () => {
    it('should generate insights from communication data', () => {
      const insights = getCommunicationInsights(mockEvents);
      expect(insights.length).toBeGreaterThan(0);
      expect(insights[0]).toBeTypeOf('string');
    });

    it('should return default message when no data', () => {
      const noDataEvents: Event[] = [
        { id: 'b1', entityId: 'e1', year: 100, titleKey: 't1', summaryKey: 's1', battle: {} },
      ];
      const insights = getCommunicationInsights(noDataEvents);
      expect(insights).toEqual(['暂无通信数据']);
    });
  });

  describe('getCommunicationSummary', () => {
    it('should return complete summary', () => {
      const summary = getCommunicationSummary(mockEvents);
      expect(summary.totalBattlesWithCommunication).toBe(4);
      expect(summary.uniqueCommunicationTypes).toBe(5);
      expect(summary.bySide).toHaveProperty('attacker');
      expect(summary.impactAnalysis).toHaveProperty('decisive');
      expect(summary.insights).toBeDefined();
      expect(summary.hasData).toBe(true);
    });

    it('should return hasData false when no communication data', () => {
      const noDataEvents: Event[] = [
        { id: 'b1', entityId: 'e1', year: 100, titleKey: 't1', summaryKey: 's1', battle: {} },
      ];
      const summary = getCommunicationSummary(noDataEvents);
      expect(summary.hasData).toBe(false);
    });
  });
});
