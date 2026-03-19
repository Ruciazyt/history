import type { Event, BattleTurningPointType } from './types';

/**
 * 战役转折点分析模块
 * 分析战役中的关键转折点、意外事件和决定性因素
 */

/**
 * 获取有转折点数据的战役
 */
export function getBattlesWithTurningPoints(events: Event[]): Event[] {
  return events.filter(e => e.battle?.turningPoints && e.battle.turningPoints.length > 0);
}

/**
 * 检查是否有转折点数据
 */
export function hasTurningPointData(events: Event[]): boolean {
  return events.some(e => e.battle?.turningPoints && e.battle.turningPoints.length > 0);
}

/**
 * 获取所有战役的转折点类型统计
 */
export function getTurningPointTypeStats(events: Event[]): Record<BattleTurningPointType, number> {
  const stats: Record<BattleTurningPointType, number> = {
    'commander-death': 0,
    'commander-captured': 0,
    'flank-collapse': 0,
    'reinforcement-arrival': 0,
    'supply-disruption': 0,
    'weather-change': 0,
    'defection': 0,
    'strategic-mistake': 0,
    'fortification-breach': 0,
    'ambush-triggered': 0,
    'morale-collapse': 0,
    'trap-triggered': 0,
    'fire-attack': 0,
    'flood-attack': 0,
    'unknown': 0,
  };

  for (const event of events) {
    const turningPoints = event.battle?.turningPoints;
    if (turningPoints) {
      for (const tp of turningPoints) {
        if (tp.type && tp.type !== 'unknown') {
          stats[tp.type] = (stats[tp.type] || 0) + 1;
        }
      }
    }
  }

  return stats;
}

/**
 * 获取最常见的转折点类型
 */
export function getMostCommonTurningPointTypes(events: Event[]): { type: BattleTurningPointType; count: number }[] {
  const stats = getTurningPointTypeStats(events);
  return Object.entries(stats)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => ({ type: type as BattleTurningPointType, count }));
}

/**
 * 获取按阵营分类的转折点统计
 */
export function getTurningPointsByParty(events: Event[]): Record<string, number> {
  const stats: Record<string, number> = {
    attacker: 0,
    defender: 0,
    both: 0,
    unknown: 0,
  };

  for (const event of events) {
    const turningPoints = event.battle?.turningPoints;
    if (turningPoints) {
      for (const tp of turningPoints) {
        const party = tp.party || 'unknown';
        stats[party] = (stats[party] || 0) + 1;
      }
    }
  }

  return stats;
}

/**
 * 获取转折点影响分析（对哪方有利）
 */
export function getTurningPointImpactStats(events: Event[]): { positive: number; negative: number; neutral: number; unknown: number } {
  const stats = {
    positive: 0,
    negative: 0,
    neutral: 0,
    unknown: 0,
  };

  for (const event of events) {
    const turningPoints = event.battle?.turningPoints;
    if (turningPoints) {
      for (const tp of turningPoints) {
        const impact = tp.impact || 'unknown';
        stats[impact] = (stats[impact] || 0) + 1;
      }
    }
  }

  return stats;
}

/**
 * 获取特定转折点类型的所有战役
 */
export function getBattlesByTurningPointType(
  events: Event[],
  type: BattleTurningPointType
): Event[] {
  return events.filter(e => 
    e.battle?.turningPoints?.some(tp => tp.type === type)
  );
}

/**
 * 分析转折点与胜负的关联
 */
export function getTurningPointOutcomeCorrelation(events: Event[]): {
  type: BattleTurningPointType;
  attackerWins: number;
  defenderWins: number;
  total: number;
}[] {
  const battlesWithTurningPoints = getBattlesWithTurningPoints(events);
  const correlations: Map<BattleTurningPointType, { attacker: number; defender: number }> = new Map();

  for (const battle of battlesWithTurningPoints) {
    const turningPoints = battle.battle?.turningPoints;
    if (!turningPoints) continue;

    const result = battle.battle?.result;
    
    for (const tp of turningPoints) {
      if (tp.type === 'unknown') continue;
      
      const current = correlations.get(tp.type) || { attacker: 0, defender: 0 };
      
      if (result === 'attacker_win') {
        current.attacker++;
      } else if (result === 'defender_win') {
        current.defender++;
      }
      
      correlations.set(tp.type, current);
    }
  }

  return Array.from(correlations.entries())
    .map(([type, counts]) => ({
      type,
      attackerWins: counts.attacker,
      defenderWins: counts.defender,
      total: counts.attacker + counts.defender,
    }))
    .sort((a, b) => b.total - a.total);
}

/**
 * 获取转折点最多的战役
 */
export function getBattlesWithMostTurningPoints(
  events: Event[],
  limit = 5
): { battle: Event; count: number }[] {
  const battles = getBattlesWithTurningPoints(events);
  
  return battles
    .map(battle => ({
      battle,
      count: battle.battle?.turningPoints?.length || 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * 生成转折点相关历史洞察
 */
export function getTurningPointInsights(events: Event[]): string[] {
  const insights: string[] = [];
  
  if (!hasTurningPointData(events)) {
    return ['暂无转折点数据'];
  }

  // 分析最常见转折点类型
  const commonTypes = getMostCommonTurningPointTypes(events);
  if (commonTypes.length > 0) {
    const typeLabels: Record<string, string> = {
      'commander-death': '指挥官阵亡',
      'commander-captured': '指挥官被俘',
      'flank-collapse': '侧翼崩溃',
      'reinforcement-arrival': '援军到达',
      'supply-disruption': '补给中断',
      'weather-change': '天气突变',
      'defection': '倒戈背叛',
      'strategic-mistake': '战略失误',
      'fortification-breach': '防线突破',
      'ambush-triggered': '伏击触发',
      'morale-collapse': '士气崩溃',
      'trap-triggered': '陷阱触发',
      'fire-attack': '火攻成功',
      'flood-attack': '水攻成功',
    };
    
    const topType = commonTypes[0];
    if (topType) {
      insights.push(`最常见的转折点是"${typeLabels[topType.type] || topType.type}"，出现了${topType.count}次`);
    }
  }

  // 分析转折点与胜负的关联
  const correlations = getTurningPointOutcomeCorrelation(events);
  if (correlations.length > 0) {
    const typeLabels: Record<string, string> = {
      'commander-death': '指挥官阵亡',
      'commander-captured': '指挥官被俘',
      'flank-collapse': '侧翼崩溃',
      'reinforcement-arrival': '援军到达',
      'supply-disruption': '补给中断',
      'weather-change': '天气突变',
      'defection': '倒戈背叛',
      'strategic-mistake': '战略失误',
      'fortification-breach': '防线突破',
      'ambush-triggered': '伏击触发',
      'morale-collapse': '士气崩溃',
    };
    
    // 找出对进攻方最有利的转折点
    const attackerFavorable = correlations.filter(c => c.attackerWins > c.defenderWins * 1.5);
    if (attackerFavorable.length > 0) {
      const top = attackerFavorable[0];
      if (top) {
        insights.push(`"${typeLabels[top.type] || top.type}"类型的转折点对进攻方较为有利`);
      }
    }
    
    // 找出对防守方最有利的转折点
    const defenderFavorable = correlations.filter(c => c.defenderWins > c.attackerWins * 1.5);
    if (defenderFavorable.length > 0) {
      const top = defenderFavorable[0];
      if (top) {
        insights.push(`"${typeLabels[top.type] || top.type}"类型的转折点对防守方较为有利`);
      }
    }
  }

  // 分析转折点影响方向
  const impactStats = getTurningPointImpactStats(events);
  const totalKnown = impactStats.positive + impactStats.negative + impactStats.neutral;
  if (totalKnown > 0) {
    if (impactStats.positive > impactStats.negative * 1.5) {
      insights.push('多数转折点对其中一方产生了积极影响');
    }
  }

  return insights;
}

/**
 * 获取完整的转折点摘要
 */
export function getTurningPointSummary(events: Event[]): {
  totalBattles: number;
  battlesWithTurningPoints: number;
  totalTurningPoints: number;
  typeStats: Record<BattleTurningPointType, number>;
  partyStats: Record<string, number>;
  impactStats: Record<string, number>;
  topTypes: { type: BattleTurningPointType; count: number }[];
  topBattles: { battle: Event; count: number }[];
  insights: string[];
} {
  const battlesWithTurningPoints = getBattlesWithTurningPoints(events);
  const allTurningPoints = battlesWithTurningPoints.flatMap(e => e.battle?.turningPoints || []);
  
  return {
    totalBattles: events.length,
    battlesWithTurningPoints: battlesWithTurningPoints.length,
    totalTurningPoints: allTurningPoints.length,
    typeStats: getTurningPointTypeStats(events),
    partyStats: getTurningPointsByParty(events),
    impactStats: getTurningPointImpactStats(events),
    topTypes: getMostCommonTurningPointTypes(events),
    topBattles: getBattlesWithMostTurningPoints(events),
    insights: getTurningPointInsights(events),
  };
}

/**
 * 转折点类型标签映射
 */
export const turningPointTypeLabels: Record<BattleTurningPointType, string> = {
  'commander-death': '指挥官阵亡',
  'commander-captured': '指挥官被俘',
  'flank-collapse': '侧翼崩溃',
  'reinforcement-arrival': '援军到达',
  'supply-disruption': '补给中断',
  'weather-change': '天气突变',
  'defection': '倒戈/背叛',
  'strategic-mistake': '战略失误',
  'fortification-breach': '防线突破',
  'ambush-triggered': '伏击触发',
  'morale-collapse': '士气崩溃',
  'trap-triggered': '陷阱触发',
  'fire-attack': '火攻成功',
  'flood-attack': '水攻成功',
  'unknown': '未知',
};

/**
 * 转折点影响标签映射
 */
export const turningPointImpactLabels: Record<string, string> = {
  positive: '对某方有利',
  negative: '对某方不利',
  neutral: '中性',
  unknown: '未知',
};

/**
 * 转折点阵营标签映射
 */
export const turningPointPartyLabels: Record<string, string> = {
  attacker: '进攻方',
  defender: '防守方',
  both: '双方',
  unknown: '未知',
};
