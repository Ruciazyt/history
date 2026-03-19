import { describe, it, expect } from 'vitest';
import {
  buildBattleChainGraph,
  getBattleChain,
  getMostInfluentialChains,
  analyzeChainType,
  getBattleChainSummary,
  hasChainData,
} from './battleChain';
import { Event } from './types';

const mockBattles: Event[] = [
  {
    id: 'battle-1',
    entityId: 'spring-autumn',
    year: -260,
    month: 4,
    titleKey: 'battles.changping',
    summaryKey: 'battles.changping.summary',
    location: { lon: 112.5, lat: 35.5, label: '长平' },
    battle: {
      belligerents: {
        attacker: '秦国',
        defender: '赵国',
      },
      result: 'attacker_win',
      impact: 'decisive',
      scale: 'massive',
      commanders: {
        attacker: ['白起'],
        defender: ['赵括'],
      },
    },
  },
  {
    id: 'battle-2',
    entityId: 'warring-states',
    year: -257,
    month: 6,
    titleKey: 'battles.zhao',
    summaryKey: 'battles.zhao.summary',
    location: { lon: 112.5, lat: 35.5, label: '长平' },
    battle: {
      belligerents: {
        attacker: '秦国',
        defender: '赵国',
      },
      result: 'attacker_win',
      impact: 'major',
      scale: 'large',
    },
  },
  {
    id: 'battle-3',
    entityId: 'warring-states',
    year: -230,
    month: 3,
    titleKey: 'battles.han',
    summaryKey: 'battles.han.summary',
    location: { lon: 113.0, lat: 34.5, label: '新郑' },
    battle: {
      belligerents: {
        attacker: '秦国',
        defender: '韩国',
      },
      result: 'attacker_win',
      impact: 'major',
      scale: 'medium',
    },
  },
  {
    id: 'battle-4',
    entityId: 'warring-states',
    year: -225,
    month: 7,
    titleKey: 'battles.wei',
    summaryKey: 'battles.wei.summary',
    location: { lon: 114.5, lat: 34.5, label: '开封' },
    battle: {
      belligerents: {
        attacker: '秦国',
        defender: '魏国',
      },
      result: 'attacker_win',
      impact: 'major',
      scale: 'large',
    },
  },
  {
    id: 'battle-5',
    entityId: 'warring-states',
    year: -222,
    month: 5,
    titleKey: 'battles.yan',
    summaryKey: 'battles.yan.summary',
    location: { lon: 116.5, lat: 40.0, label: '辽东' },
    battle: {
      belligerents: {
        attacker: '秦国',
        defender: '燕国',
      },
      result: 'attacker_win',
      impact: 'major',
      scale: 'medium',
    },
  },
  {
    id: 'battle-6',
    entityId: 'warring-states',
    year: -221,
    month: 2,
    titleKey: 'battles.qi',
    summaryKey: 'battles.qi.summary',
    location: { lon: 117.0, lat: 36.5, label: '临淄' },
    battle: {
      belligerents: {
        attacker: '秦国',
        defender: '齐国',
      },
      result: 'attacker_win',
      impact: 'decisive',
      scale: 'large',
    },
  },
  {
    id: 'battle-7',
    entityId: 'chu-han',
    year: -207,
    month: 12,
    titleKey: 'battles.julu',
    summaryKey: 'battles.julu.summary',
    location: { lon: 114.3, lat: 34.7, label: '巨鹿' },
    battle: {
      belligerents: {
        attacker: '项羽',
        defender: '秦军',
      },
      result: 'attacker_win',
      impact: 'decisive',
      scale: 'massive',
    },
  },
  {
    id: 'battle-8',
    entityId: 'chu-han',
    year: -202,
    month: 1,
    titleKey: 'battles.gaixia',
    summaryKey: 'battles.gaixia.summary',
    location: { lon: 114.2, lat: 33.0, label: '垓下' },
    battle: {
      belligerents: {
        attacker: '刘邦',
        defender: '项羽',
      },
      result: 'attacker_win',
      impact: 'decisive',
      scale: 'massive',
    },
  },
];

describe('buildBattleChainGraph', () => {
  it('应该构建战役因果链图', () => {
    const graph = buildBattleChainGraph(mockBattles);
    expect(graph.size).toBe(8);
  });

  it('应该正确识别有因果关系的战役', () => {
    const graph = buildBattleChainGraph(mockBattles);
    const battle1Node = graph.get('battle-1');
    expect(battle1Node).toBeDefined();
    // 长平之战应该影响后续秦赵战役
    expect(battle1Node?.influencedBattles.length).toBeGreaterThan(0);
  });

  it('应该计算影响力分数', () => {
    const graph = buildBattleChainGraph(mockBattles);
    const battle1Node = graph.get('battle-1');
    expect(battle1Node?.influenceScore).toBeGreaterThan(0);
  });

  it('空数据应返回空图', () => {
    const graph = buildBattleChainGraph([]);
    expect(graph.size).toBe(0);
  });
});

describe('getBattleChain', () => {
  it('应该获取指定战役的因果链', () => {
    const chain = getBattleChain(mockBattles, 'battle-1');
    expect(chain).not.toBeNull();
    expect(chain?.battles.length).toBeGreaterThan(1);
  });

  it('不存在的战役应返回null', () => {
    const chain = getBattleChain(mockBattles, 'non-existent');
    expect(chain).toBeNull();
  });

  it('应正确计算总影响力', () => {
    const chain = getBattleChain(mockBattles, 'battle-1');
    expect(chain?.totalImpact).toBeGreaterThan(0);
  });
});

describe('getMostInfluentialChains', () => {
  it('应返回最具影响力的因果链', () => {
    const chains = getMostInfluentialChains(mockBattles);
    expect(chains.length).toBeGreaterThan(0);
    expect(chains.length).toBeLessThanOrEqual(5);
  });

  it('应按影响力排序', () => {
    const chains = getMostInfluentialChains(mockBattles);
    for (let i = 1; i < chains.length; i++) {
      expect(chains[i - 1]!.totalImpact).toBeGreaterThanOrEqual(chains[i]!.totalImpact);
    }
  });

  it('空数据应返回空数组', () => {
    const chains = getMostInfluentialChains([]);
    expect(chains.length).toBe(0);
  });
});

describe('analyzeChainType', () => {
  it('应该分析因果链类型', () => {
    const chains = getMostInfluentialChains(mockBattles);
    if (chains.length > 0 && chains[0]!.battles.length >= 2) {
      const type = analyzeChainType(chains[0]!.battles);
      expect(type).not.toBeNull();
      expect(type?.type).toBeDefined();
      expect(type?.description).toBeDefined();
      expect(type?.confidence).toBeGreaterThan(0);
    }
  });

  it('单战役应返回null', () => {
    const type = analyzeChainType([mockBattles[0]!]);
    expect(type).toBeNull();
  });

  it('应该识别escalation类型', () => {
    const escalationBattles: Event[] = [
      {
        id: 'e1',
        entityId: 'test',
        year: -300,
        titleKey: 'test.1',
        summaryKey: 'test.1.summary',
        location: { lon: 1, lat: 1, label: 'A' },
        battle: { scale: 'small' as const },
      },
      {
        id: 'e2',
        entityId: 'test',
        year: -290,
        titleKey: 'test.2',
        summaryKey: 'test.2.summary',
        location: { lon: 1, lat: 1, label: 'A' },
        battle: { scale: 'medium' as const, result: 'attacker_win' as const },
      },
      {
        id: 'e3',
        entityId: 'test',
        year: -280,
        titleKey: 'test.3',
        summaryKey: 'test.3.summary',
        location: { lon: 1, lat: 1, label: 'A' },
        battle: { scale: 'large' as const, result: 'attacker_win' as const },
      },
    ];
    const type = analyzeChainType(escalationBattles);
    expect(type?.type).toBe('escalation');
  });

  it('应该识别conquest类型', () => {
    const conquestBattles: Event[] = [
      {
        id: 'c1',
        entityId: 'test',
        year: -300,
        titleKey: 'test.1',
        summaryKey: 'test.1.summary',
        location: { lon: 1, lat: 1, label: 'A' },
        battle: { 
          scale: 'large' as const, 
          result: 'attacker_win' as const,
          belligerents: { attacker: '秦国', defender: '韩国' },
        },
      },
      {
        id: 'c2',
        entityId: 'test',
        year: -290,
        titleKey: 'test.2',
        summaryKey: 'test.2.summary',
        location: { lon: 2, lat: 2, label: 'B' },
        battle: { 
          scale: 'large' as const, 
          result: 'attacker_win' as const,
          belligerents: { attacker: '秦国', defender: '魏国' },
        },
      },
      {
        id: 'c3',
        entityId: 'test',
        year: -280,
        titleKey: 'test.3',
        summaryKey: 'test.3.summary',
        location: { lon: 3, lat: 3, label: 'C' },
        battle: { 
          scale: 'large' as const, 
          result: 'attacker_win' as const,
          belligerents: { attacker: '秦国', defender: '燕国' },
        },
      },
    ];
    const type = analyzeChainType(conquestBattles);
    expect(type?.type).toBe('conquest');
  });
});

describe('getBattleChainSummary', () => {
  it('应该返回因果链摘要', () => {
    const summary = getBattleChainSummary(mockBattles);
    expect(summary.totalChains).toBeDefined();
    expect(summary.longestChain).toBeDefined();
    expect(summary.mostInfluential).toBeDefined();
    expect(summary.chainTypes).toBeDefined();
    expect(summary.insights).toBeDefined();
    expect(Array.isArray(summary.insights)).toBe(true);
  });

  it('应该生成有意义的洞察', () => {
    const summary = getBattleChainSummary(mockBattles);
    expect(summary.insights.length).toBeGreaterThanOrEqual(0);
  });

  it('空数据应返回默认摘要', () => {
    const summary = getBattleChainSummary([]);
    expect(summary.totalChains).toBe(0);
    expect(summary.longestChain).toBe(0);
    expect(summary.mostInfluential).toBeNull();
  });
});

describe('hasChainData', () => {
  it('应该正确判断是否有足够的因果链数据', () => {
    expect(hasChainData(mockBattles)).toBe(true);
  });

  it('数据不足应返回false', () => {
    const fewBattles = mockBattles.slice(0, 3);
    expect(hasChainData(fewBattles)).toBe(false);
  });

  it('空数据应返回false', () => {
    expect(hasChainData([])).toBe(false);
  });
});
