import type { Event } from './types';

/**
 * 历史典籍类型
 */
export type LiteratureType = 
  | 'shiji'           // 史记
  | 'zizhitongjian'   // 资治通鉴
  | 'zuozhuan'        // 左传
  | 'guoyu'           // 国语
  | 'chunqiu'         // 春秋
  | 'shangshu'        // 尚书
  | 'zhoushu'         // 周书
  | 'hanshu'          // 汉书
  | 'houhanshu'       // 后汉书
  | 'sanguozhi'       // 三国志
  | 'jinshu'          // 晋书
  | 'liangshu'        // 梁书
  | 'beishi'          // 北史
  | 'nanshi'          // 南史
  | 'tongzhi'         // 通志
  | 'tongkao'         // 通考
  | 'other';          // 其他

/**
 * 典籍记载信息
 */
export type BattleLiterature = {
  /** 典籍名称/类型 */
  source: LiteratureType;
  /** 具体章节/卷 */
  chapter?: string;
  /** 记载的简要描述 */
  description?: string;
  /** 记载可信度评估 */
  reliability?: 'high' | 'medium' | 'low';
  /** 记载特点 */
  characteristics?: string[];
};

/**
 * 获取典籍中文名称
 */
export function getLiteratureName(type: LiteratureType): string {
  const names: Record<LiteratureType, string> = {
    shiji: '《史记》',
    zizhitongjian: '《资治通鉴》',
    zuozhuan: '《左传》',
    guoyu: '《国语》',
    chunqiu: '《春秋》',
    shangshu: '《尚书》',
    zhoushu: '《周书》',
    hanshu: '《汉书》',
    houhanshu: '《后汉书》',
    sanguozhi: '《三国志》',
    jinshu: '《晋书》',
    liangshu: '《梁书》',
    beishi: '《北史》',
    nanshi: '《南史》',
    tongzhi: '《通志》',
    tongkao: '《通考》',
    other: '其他典籍',
  };
  return names[type] || '未知典籍';
}

/**
 * 获取可信度标签
 */
export function getReliabilityLabel(reliability?: 'high' | 'medium' | 'low'): string {
  if (!reliability) return '未知';
  const labels = {
    high: '高可信度',
    medium: '中等可信度',
    low: '低可信度',
  };
  return labels[reliability] || '未知';
}

/**
 * 检查是否有典籍数据
 */
export function hasLiteratureData(events: Event[]): boolean {
  return events.some(e => 
    e.battle?.literature && e.battle.literature.length > 0
  );
}

/**
 * 获取所有唯一典籍类型
 */
export function getUniqueLiteratureTypes(events: Event[]): LiteratureType[] {
  const types = new Set<LiteratureType>();
  events.forEach(e => {
    if (e.battle?.literature) {
      e.battle.literature.forEach(lit => types.add(lit.source));
    }
  });
  return Array.from(types);
}

/**
 * 获取典籍类型统计
 */
export function getLiteratureTypeStats(
  events: Event[], 
  source: LiteratureType
): number {
  return events.filter(e => 
    e.battle?.literature?.some(l => l.source === source)
  ).length;
}

/**
 * 获取所有典籍类型统计
 */
export function getAllLiteratureTypeStats(events: Event[]): Record<LiteratureType, number> {
  const stats: Record<string, number> = {};
  const uniqueTypes = getUniqueLiteratureTypes(events);
  
  uniqueTypes.forEach(type => {
    stats[type] = getLiteratureTypeStats(events, type);
  });
  
  return stats as Record<LiteratureType, number>;
}

/**
 * 按典籍类型筛选战役
 */
export function getBattlesByLiterature(
  events: Event[], 
  source: LiteratureType
): Event[] {
  return events.filter(e => 
    e.battle?.literature?.some(l => l.source === source)
  );
}

/**
 * 获取最常见典籍类型
 */
export function getMostCommonLiteratureTypes(
  events: Event[], 
  limit = 5
): Array<{ type: LiteratureType; count: number }> {
  const stats = getAllLiteratureTypeStats(events);
  return Object.entries(stats)
    .map(([type, count]) => ({ type: type as LiteratureType, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * 获取战役的典籍记载
 */
export function getBattleLiterature(battle: Event): BattleLiterature[] {
  return battle.battle?.literature || [];
}

/**
 * 获取有典籍记载的战役数量
 */
export function getBattlesWithLiteratureCount(events: Event[]): number {
  return events.filter(e => 
    e.battle?.literature && e.battle.literature.length > 0
  ).length;
}

/**
 * 获取高可信度记载的战役数量
 */
export function getHighReliabilityBattlesCount(events: Event[]): number {
  return events.filter(e => 
    e.battle?.literature?.some(l => l.reliability === 'high')
  ).length;
}

/**
 * 获取战役典籍来源多样性
 */
export function getLiteratureDiversity(battle: Event): number {
  return battle.battle?.literature?.length || 0;
}

/**
 * 获取典籍记载特点统计
 */
export function getCharacteristicsStats(events: Event[]): Record<string, number> {
  const stats: Record<string, number> = {};
  
  events.forEach(e => {
    if (e.battle?.literature) {
      e.battle.literature.forEach(lit => {
        lit.characteristics?.forEach(char => {
          stats[char] = (stats[char] || 0) + 1;
        });
      });
    }
  });
  
  return stats;
}

/**
 * 获取最常见的记载特点
 */
export function getMostCommonCharacteristics(
  events: Event[], 
  limit = 5
): Array<{ characteristic: string; count: number }> {
  const stats = getCharacteristicsStats(events);
  return Object.entries(stats)
    .map(([char, count]) => ({ characteristic: char, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * 按可信度统计典籍记载
 */
export function getReliabilityDistribution(
  events: Event[]
): Record<'high' | 'medium' | 'low', number> {
  const distribution = { high: 0, medium: 0, low: 0 };
  
  events.forEach(e => {
    if (e.battle?.literature) {
      e.battle.literature.forEach(lit => {
        if (lit.reliability) {
          distribution[lit.reliability]++;
        }
      });
    }
  });
  
  return distribution;
}

/**
 * 获取可信度最高的战役
 */
export function getMostReliableBattles(
  events: Event[], 
  limit = 10
): Event[] {
  return events
    .filter(e => e.battle?.literature?.some(l => l.reliability === 'high'))
    .sort((a, b) => (b.battle?.literature?.length || 0) - (a.battle?.literature?.length || 0))
    .slice(0, limit);
}

/**
 * 典籍记载与战役结果关联分析
 */
export function getLiteratureOutcomeCorrelation(
  events: Event[]
): Record<string, { total: number; attacker_win: number; defender_win: number; draw: number }> {
  const correlation: Record<string, { total: number; attacker_win: number; defender_win: number; draw: number }> = {};
  
  events.forEach(e => {
    if (e.battle?.literature && e.battle.literature.length > 0 && e.battle.result) {
      e.battle.literature.forEach(lit => {
        if (!correlation[lit.source]) {
          correlation[lit.source] = { total: 0, attacker_win: 0, defender_win: 0, draw: 0 };
        }
        correlation[lit.source].total++;
        const result = e.battle?.result;
        if (result === 'attacker_win') {
          correlation[lit.source].attacker_win++;
        } else if (result === 'defender_win') {
          correlation[lit.source].defender_win++;
        } else if (result === 'draw') {
          correlation[lit.source].draw++;
        }
      });
    }
  });
  
  return correlation;
}

/**
 * 获取典籍分析摘要
 */
export function getLiteratureSummary(events: Event[]) {
  const battlesWithLiterature = getBattlesWithLiteratureCount(events);
  const totalBattles = events.filter(e => e.tags?.includes('war')).length;
  const coverage = totalBattles > 0 ? (battlesWithLiterature / totalBattles * 100).toFixed(1) : '0';
  const mostCommon = getMostCommonLiteratureTypes(events, 3);
  const mostCommonCharacteristics = getMostCommonCharacteristics(events, 3);
  const reliabilityDist = getReliabilityDistribution(events);
  
  return {
    totalBattles,
    battlesWithLiterature,
    coverage: `${coverage}%`,
    literatureTypes: getUniqueLiteratureTypes(events).length,
    mostCommonLiterature: mostCommon.map(m => ({
      name: getLiteratureName(m.type),
      count: m.count,
    })),
    mostCommonCharacteristics: mostCommonCharacteristics.map(c => ({
      characteristic: c.characteristic,
      count: c.count,
    })),
    reliabilityDistribution: {
      high: reliabilityDist.high,
      medium: reliabilityDist.medium,
      low: reliabilityDist.low,
    },
  };
}

/**
 * 生成典籍分析洞察
 */
export function getLiteratureInsights(events: Event[]): string[] {
  const insights: string[] = [];
  const summary = getLiteratureSummary(events);
  
  if (summary.battlesWithLiterature === 0) {
    insights.push('暂无典籍记载数据');
    return insights;
  }
  
  // 覆盖率洞察
  if (parseFloat(summary.coverage) > 50) {
    insights.push(`超过${summary.coverage}的战役有典籍记载，历史研究价值较高`);
  } else if (parseFloat(summary.coverage) > 20) {
    insights.push(`约${summary.coverage}的战役有典籍记载，仍有大量战役缺乏文献支持`);
  } else {
    insights.push('典籍记载覆盖率较低，需更多考古和文献研究补充');
  }
  
  // 最常用典籍
  if (summary.mostCommonLiterature.length > 0) {
    const top = summary.mostCommonLiterature[0];
    insights.push(`《${top.name.replace(/《|》/g, '')}》是记载战役最多的史书`);
  }
  
  // 可信度分析
  const { high, medium, low } = summary.reliabilityDistribution;
  if (high > medium && high > low) {
    insights.push('高可信度记载占多数，历史真实性较强');
  } else if (low > high) {
    insights.push('存在较多低可信度记载，需谨慎参考');
  }
  
  // 记载特点分析
  if (summary.mostCommonCharacteristics.length > 0) {
    const topChar = summary.mostCommonCharacteristics[0];
    insights.push(`战役记载普遍侧重于${topChar.characteristic}的描述`);
  }
  
  return insights;
}
