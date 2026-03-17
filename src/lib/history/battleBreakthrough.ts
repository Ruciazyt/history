import type { Event, BreakthroughType, BreakthroughResult } from './types';
import { getBattles } from './battles';

/**
 * 获取战役突破/追击类型中文标签
 */
export function getBreakthroughTypeLabel(type: BreakthroughType): string {
  const labels: Record<BreakthroughType, string> = {
    'frontal-breakthrough': '正面突破',
    'flanking-breakthrough': '侧翼突破',
    'center-breakthrough': '中央突破',
    'encirclement-breakout': '突围/突围战',
    'pursuit-victory': '追击胜利',
    'defensive-stand': '防守坚守',
    'tactical-retreat': '战术撤退',
    'feigned-retreat': '佯败/诱敌',
    'counterattack': '反击',
    'ambush-breakout': '伏击突围',
    'siege-breakout': '围城突围',
    'unknown': '未知',
  };
  return labels[type] || '未知';
}

/**
 * 获取突破/追击结果中文标签
 */
export function getBreakthroughResultLabel(result: BreakthroughResult): string {
  const labels: Record<BreakthroughResult, string> = {
    'success': '成功',
    'failure': '失败',
    'partial': '部分成功',
    'inconclusive': '未明',
    'unknown': '未知',
  };
  return labels[result] || '未知';
}

/**
 * 获取严重程度中文标签
 */
export function getSeverityLabel(severity?: 'decisive' | 'significant' | 'minor' | 'unknown'): string {
  if (!severity) return '未知';
  const labels: Record<string, string> = {
    'decisive': '决定性',
    'significant': '重大',
    'minor': '轻微',
    'unknown': '未知',
  };
  return labels[severity] || '未知';
}

/**
 * 检查是否有突破/追击数据
 */
export function hasBreakthroughData(events: Event[]): boolean {
  const battles = getBattles(events);
  return battles.some(b => b.battle?.breakthrough && b.battle.breakthrough.length > 0);
}

/**
 * 获取所有唯一突破/追击类型
 */
export function getUniqueBreakthroughTypes(events: Event[]): BreakthroughType[] {
  const battles = getBattles(events);
  const types = new Set<BreakthroughType>();
  
  battles.forEach(battle => {
    battle.battle?.breakthrough?.forEach(b => {
      types.add(b.type);
    });
  });

  return Array.from(types);
}

/**
 * 获取有突破/追击数据的战役
 */
export function getBattlesWithBreakthrough(events: Event[]): Event[] {
  const battles = getBattles(events);
  return battles.filter(b => b.battle?.breakthrough && b.battle.breakthrough.length > 0);
}

/**
 * 按突破/追击类型统计
 */
export type BreakthroughTypeStats = {
  type: BreakthroughType;
  label: string;
  count: number;
  successCount: number;
  failureCount: number;
  partialCount: number;
  successRate: number;
};

export function getBreakthroughTypeStats(events: Event[], type: BreakthroughType): BreakthroughTypeStats {
  const battles = getBattlesWithBreakthrough(events);
  
  let count = 0;
  let successCount = 0;
  let failureCount = 0;
  let partialCount = 0;

  battles.forEach(battle => {
    battle.battle?.breakthrough?.forEach(b => {
      if (b.type === type) {
        count++;
        if (b.result === 'success') successCount++;
        else if (b.result === 'failure') failureCount++;
        else if (b.result === 'partial') partialCount++;
      }
    });
  });

  return {
    type,
    label: getBreakthroughTypeLabel(type),
    count,
    successCount,
    failureCount,
    partialCount,
    successRate: count > 0 ? (successCount / count) * 100 : 0,
  };
}

/**
 * 获取所有突破/追击类型统计
 */
export function getAllBreakthroughTypeStats(events: Event[]): BreakthroughTypeStats[] {
  const uniqueTypes = getUniqueBreakthroughTypes(events);
  return uniqueTypes.map(type => getBreakthroughTypeStats(events, type));
}

/**
 * 按阵营统计突破/追击
 */
export type BreakthroughBySide = {
  side: string;
  count: number;
  successCount: number;
  failureCount: number;
  successRate: number;
};

export function getBreakthroughBySide(events: Event[]): BreakthroughBySide[] {
  const battles = getBattlesWithBreakthrough(events);
  const sideMap = new Map<string, { count: number; success: number; failure: number }>();

  battles.forEach(battle => {
    battle.battle?.breakthrough?.forEach(b => {
      const side = b.side || 'unknown';
      if (!sideMap.has(side)) {
        sideMap.set(side, { count: 0, success: 0, failure: 0 });
      }
      const data = sideMap.get(side)!;
      data.count++;
      if (b.result === 'success') data.success++;
      else if (b.result === 'failure') data.failure++;
    });
  });

  return Array.from(sideMap.entries()).map(([side, data]) => ({
    side,
    count: data.count,
    successCount: data.success,
    failureCount: data.failure,
    successRate: data.count > 0 ? (data.success / data.count) * 100 : 0,
  }));
}

/**
 * 按结果统计突破/追击
 */
export type BreakthroughResultStats = {
  result: BreakthroughResult;
  label: string;
  count: number;
  percentage: number;
};

export function getBreakthroughResultStats(events: Event[]): BreakthroughResultStats[] {
  const battles = getBattlesWithBreakthrough(events);
  const resultMap = new Map<BreakthroughResult, number>();

  battles.forEach(battle => {
    battle.battle?.breakthrough?.forEach(b => {
      const current = resultMap.get(b.result) || 0;
      resultMap.set(b.result, current + 1);
    });
  });

  const total = Array.from(resultMap.values()).reduce((a, b) => a + b, 0);

  const resultLabels: Record<BreakthroughResult, string> = {
    'success': '成功',
    'failure': '失败',
    'partial': '部分成功',
    'inconclusive': '未明',
    'unknown': '未知',
  };

  return Array.from(resultMap.entries()).map(([result, count]) => ({
    result,
    label: resultLabels[result] || '未知',
    count,
    percentage: total > 0 ? (count / total) * 100 : 0,
  }));
}

/**
 * 获取决定性突破/追击战役
 */
export function getDecisiveBreakthroughBattles(events: Event[], limit = 10): Event[] {
  const battles = getBattlesWithBreakthrough(events);
  
  return battles
    .filter(b => b.battle?.breakthrough?.some(bp => bp.decisive === true))
    .sort((a, b) => a.year - b.year)
    .slice(0, limit);
}

/**
 * 获取突破/追击次数最多的战役
 */
export function getMostBreakthroughBattles(events: Event[], limit = 10): Event[] {
  const battles = getBattlesWithBreakthrough(events);
  
  return battles
    .sort((a, b) => {
      const countA = a.battle?.breakthrough?.length || 0;
      const countB = b.battle?.breakthrough?.length || 0;
      return countB - countA;
    })
    .slice(0, limit);
}

/**
 * 按突破/追击类型筛选战役
 */
export function getBattlesByBreakthroughType(events: Event[], type: BreakthroughType): Event[] {
  const battles = getBattlesWithBreakthrough(events);
  return battles.filter(b => b.battle?.breakthrough?.some(bp => bp.type === type));
}

/**
 * 分析突破/追击与战役结果的关联
 */
export type BreakthroughOutcomeCorrelation = {
  breakthroughSide: string;
  battleResult: string;
  count: number;
};

export function getBreakthroughOutcomeCorrelation(events: Event[]): BreakthroughOutcomeCorrelation[] {
  const battles = getBattlesWithBreakthrough(events);
  const correlations: BreakthroughOutcomeCorrelation[] = [];

  battles.forEach(battle => {
    const result = battle.battle?.result || 'unknown';
    battle.battle?.breakthrough?.forEach(bp => {
      correlations.push({
        breakthroughSide: bp.side || 'unknown',
        battleResult: result,
        count: 1,
      });
    });
  });

  return correlations;
}

/**
 * 获取突破/追击成功率最高的类型
 */
export function getMostSuccessfulBreakthroughTypes(events: Event[], minCount = 2): BreakthroughTypeStats[] {
  const allStats = getAllBreakthroughTypeStats(events);
  return allStats
    .filter(s => s.count >= minCount)
    .sort((a, b) => b.successRate - a.successRate);
}

/**
 * 生成突破/追击分析历史洞察
 */
export function getBreakthroughInsights(events: Event[]): string[] {
  const insights: string[] = [];
  const battlesWithBreakthrough = getBattlesWithBreakthrough(events);
  
  if (battlesWithBreakthrough.length === 0) {
    return ['暂无突破/追击数据'];
  }

  // 总体统计
  const totalBreakthroughs = battlesWithBreakthrough.reduce(
    (sum, b) => sum + (b.battle?.breakthrough?.length || 0), 0
  );
  insights.push(`共有 ${battlesWithBreakthrough.length} 场战役记录了突破/追击/突围战术，涉及 ${totalBreakthroughs} 次相关事件`);

  // 最常见类型
  const allStats = getAllBreakthroughTypeStats(events);
  if (allStats.length > 0) {
    const mostCommon = allStats.sort((a, b) => b.count - a.count)[0];
    insights.push(`最常见的战术类型是「${mostCommon.label}」，出现了 ${mostCommon.count} 次`);
  }

  // 最成功的类型
  const mostSuccessful = getMostSuccessfulBreakthroughTypes(events, 1);
  if (mostSuccessful.length > 0) {
    const top = mostSuccessful[0];
    insights.push(`成功率最高的战术是「${top.label}」，成功率达 ${Math.round(top.successRate)}%`);
  }

  // 决定性突破分析
  const decisiveBattles = getDecisiveBreakthroughBattles(events, 5);
  if (decisiveBattles.length > 0) {
    const years = decisiveBattles.map(b => b.year).join('、');
    insights.push(`有 ${decisiveBattles.length} 场战役的关键突破成为决定性因素，包括公元前 ${years} 年的相关战役`);
  }

  // 阵营分析
  const bySide = getBreakthroughBySide(events);
  if (bySide.length > 0) {
    const attackerStats = bySide.find(s => s.side === 'attacker');
    const defenderStats = bySide.find(s => s.side === 'defender');
    if (attackerStats && defenderStats) {
      if (attackerStats.successRate > defenderStats.successRate + 10) {
        insights.push('进攻方在突破/追击战术中的成功率明显高于防守方');
      } else if (defenderStats.successRate > attackerStats.successRate + 10) {
        insights.push('防守方在突围/反击战术中的表现优于进攻方');
      }
    }
  }

  return insights;
}

/**
 * 获取突破/追击完整摘要
 */
export type BreakthroughSummary = {
  totalBattlesWithBreakthrough: number;
  totalBreakthroughEvents: number;
  typeStats: BreakthroughTypeStats[];
  sideStats: BreakthroughBySide[];
  resultStats: BreakthroughResultStats[];
  decisiveBattles: Event[];
  mostCommonType: BreakthroughTypeStats | null;
  mostSuccessfulType: BreakthroughTypeStats | null;
  insights: string[];
};

export function getBreakthroughSummary(events: Event[]): BreakthroughSummary {
  const battlesWithBreakthrough = getBattlesWithBreakthrough(events);
  const totalBreakthroughEvents = battlesWithBreakthrough.reduce(
    (sum, b) => sum + (b.battle?.breakthrough?.length || 0), 0
  );
  
  const typeStats = getAllBreakthroughTypeStats(events);
  const mostCommonType = typeStats.length > 0 
    ? typeStats.sort((a, b) => b.count - a.count)[0] 
    : null;
  const mostSuccessfulType = getMostSuccessfulBreakthroughTypes(events, 1)[0] || null;

  return {
    totalBattlesWithBreakthrough: battlesWithBreakthrough.length,
    totalBreakthroughEvents,
    typeStats,
    sideStats: getBreakthroughBySide(events),
    resultStats: getBreakthroughResultStats(events),
    decisiveBattles: getDecisiveBreakthroughBattles(events, 5),
    mostCommonType,
    mostSuccessfulType,
    insights: getBreakthroughInsights(events),
  };
}

export type { BreakthroughType, BreakthroughResult };
