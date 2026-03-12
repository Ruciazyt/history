import type { BattleDurationCategory, Event } from './types';
import { getBattles } from './battles';

/**
 * 获取战役持续时间分类标签（中文）
 */
export function getDurationCategoryLabel(category?: BattleDurationCategory): string {
  if (!category) return '';
  const labels: Record<string, string> = {
    daily: '一日之战',
    short: '短期战役(1-3天)',
    medium: '中期战役(4-7天)',
    extended: '持久战役(8-30天)',
    protracted: '超长战役(30天以上)',
    unknown: '未知',
  };
  return labels[category] || '';
}

/**
 * 将天数转换为持续时间分类
 */
export function daysToDurationCategory(days?: number): BattleDurationCategory {
  if (days === undefined || days === null) return 'unknown';
  if (days <= 1) return 'daily';
  if (days <= 3) return 'short';
  if (days <= 7) return 'medium';
  if (days <= 30) return 'extended';
  return 'protracted';
}

/**
 * 检查是否有战役持续时间数据
 */
export function hasDurationData(events: Event[]): boolean {
  const battles = getBattles(events);
  return battles.some(b => b.battle?.duration !== undefined && b.battle.duration !== null);
}

/**
 * 获取有持续时间数据的战役
 */
export function getBattlesWithDurationData(events: Event[]): Event[] {
  const battles = getBattles(events);
  return battles.filter(b => b.battle?.duration !== undefined && b.battle.duration !== null);
}

/**
 * 持续时间统计类型
 */
export type DurationStats = {
  category: BattleDurationCategory;
  label: string;
  totalBattles: number;
  attackerWins: number;
  defenderWins: number;
  draws: number;
  inconclusive: number;
  attackerWinRate: number;
  defenderWinRate: number;
  avgDuration: number;
  minDuration: number;
  maxDuration: number;
};

/**
 * 获取特定持续时间分类的战役统计
 */
export function getDurationStats(events: Event[], category: BattleDurationCategory): DurationStats {
  const battles = getBattles(events);
  const filteredBattles = battles.filter(b => 
    b.battle?.duration !== undefined && 
    daysToDurationCategory(b.battle.duration) === category
  );
  
  let attackerWins = 0;
  let defenderWins = 0;
  let draws = 0;
  let inconclusive = 0;
  let totalDuration = 0;
  let minDuration = Infinity;
  let maxDuration = 0;
  
  for (const battle of filteredBattles) {
    const duration = battle.battle?.duration;
    if (duration !== undefined && duration !== null) {
      totalDuration += duration;
      if (duration < minDuration) minDuration = duration;
      if (duration > maxDuration) maxDuration = duration;
    }
    
    const result = battle.battle?.result;
    if (result === 'attacker_win') attackerWins++;
    else if (result === 'defender_win') defenderWins++;
    else if (result === 'draw') draws++;
    else if (result === 'inconclusive') inconclusive++;
  }
  
  const total = filteredBattles.length;
  const avgDuration = total > 0 ? Math.round(totalDuration / total) : 0;
  
  return {
    category,
    label: getDurationCategoryLabel(category),
    totalBattles: total,
    attackerWins,
    defenderWins,
    draws,
    inconclusive,
    attackerWinRate: total > 0 ? (attackerWins / total) * 100 : 0,
    defenderWinRate: total > 0 ? (defenderWins / total) * 100 : 0,
    avgDuration: avgDuration || 0,
    minDuration: minDuration === Infinity ? 0 : minDuration,
    maxDuration: maxDuration === 0 ? 0 : maxDuration,
  };
}

/**
 * 获取所有持续时间分类的统计
 */
export function getAllDurationStats(events: Event[]): DurationStats[] {
  const categories: BattleDurationCategory[] = ['daily', 'short', 'medium', 'extended', 'protracted'];
  return categories.map(cat => getDurationStats(events, cat));
}

/**
 * 按持续时间分类筛选战役
 */
export function getBattlesByDurationCategory(events: Event[], category: BattleDurationCategory): Event[] {
  const battles = getBattles(events);
  return battles.filter(b => 
    b.battle?.duration !== undefined && 
    daysToDurationCategory(b.battle.duration) === category
  );
}

/**
 * 快速决战统计（1天以内）
 */
export function getQuickVictoryStats(events: Event[]): DurationStats {
  return getDurationStats(events, 'daily');
}

/**
 * 持久战统计（30天以上）
 */
export function getProtractedWarStats(events: Event[]): DurationStats {
  return getDurationStats(events, 'protracted');
}

/**
 * 战役持续时间与胜负关联分析
 */
export function getDurationOutcomeCorrelation(events: Event[]): {
  category: BattleDurationCategory;
  label: string;
  totalBattles: number;
  attackerWinRate: number;
  defenderWinRate: number;
}[] {
  const categories: BattleDurationCategory[] = ['daily', 'short', 'medium', 'extended', 'protracted'];
  
  return categories.map(cat => {
    const stats = getDurationStats(events, cat);
    return {
      category: cat,
      label: getDurationCategoryLabel(cat),
      totalBattles: stats.totalBattles,
      attackerWinRate: stats.attackerWinRate,
      defenderWinRate: stats.defenderWinRate,
    };
  }).filter(item => item.totalBattles > 0);
}

/**
 * 获取最长的战役
 */
export function getLongestBattles(events: Event[], limit = 10): Event[] {
  const battles = getBattlesWithDurationData(events);
  return battles
    .filter(b => b.battle?.duration !== undefined)
    .sort((a, b) => (b.battle?.duration || 0) - (a.battle?.duration || 0))
    .slice(0, limit);
}

/**
 * 获取最短的战役
 */
export function getShortestBattles(events: Event[], limit = 10): Event[] {
  const battles = getBattlesWithDurationData(events);
  return battles
    .filter(b => b.battle?.duration !== undefined)
    .sort((a, b) => (a.battle?.duration || 0) - (b.battle?.duration || 0))
    .slice(0, limit);
}

/**
 * 获取战役持续时间摘要
 */
export function getDurationSummary(events: Event[]): {
  hasData: boolean;
  totalBattlesWithDuration: number;
  averageDuration: number;
  medianDuration: number;
  shortestBattle: { name: string; duration: number } | null;
  longestBattle: { name: string; duration: number } | null;
  quickVictoryStats: DurationStats;
  protractedWarStats: DurationStats;
  correlation: ReturnType<typeof getDurationOutcomeCorrelation>;
} {
  const battles = getBattlesWithDurationData(events);
  const hasData = battles.length > 0;
  
  if (!hasData) {
    return {
      hasData: false,
      totalBattlesWithDuration: 0,
      averageDuration: 0,
      medianDuration: 0,
      shortestBattle: null,
      longestBattle: null,
      quickVictoryStats: getDurationStats(events, 'daily'),
      protractedWarStats: getDurationStats(events, 'protracted'),
      correlation: [],
    };
  }
  
  const durations = battles
    .map(b => b.battle?.duration)
    .filter((d): d is number => d !== undefined && d !== null)
    .sort((a, b) => a - b);
  
  const averageDuration = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);
  const medianDuration = durations.length > 0 
    ? durations[Math.floor(durations.length / 2)] 
    : 0;
  
  const shortest = getShortestBattles(events, 1)[0];
  const longest = getLongestBattles(events, 1)[0];
  
  return {
    hasData,
    totalBattlesWithDuration: battles.length,
    averageDuration,
    medianDuration,
    shortestBattle: shortest ? { 
      name: shortest.titleKey, 
      duration: shortest.battle?.duration || 0 
    } : null,
    longestBattle: longest ? { 
      name: longest.titleKey, 
      duration: longest.battle?.duration || 0 
    } : null,
    quickVictoryStats: getQuickVictoryStats(events),
    protractedWarStats: getProtractedWarStats(events),
    correlation: getDurationOutcomeCorrelation(events),
  };
}

/**
 * 生成战役持续时间分析洞察
 */
export function getDurationInsights(events: Event[]): string[] {
  const summary = getDurationSummary(events);
  const insights: string[] = [];
  
  if (!summary.hasData) {
    insights.push('暂无战役持续时间数据');
    return insights;
  }
  
  // 分析快速决战胜负率
  const quickStats = summary.quickVictoryStats;
  if (quickStats.totalBattles > 0) {
    if (quickStats.attackerWinRate > quickStats.defenderWinRate) {
      insights.push(`一日之战中，进攻方胜率(${quickStats.attackerWinRate.toFixed(1)}%)高于防守方(${quickStats.defenderWinRate.toFixed(1)}%)，快速突袭往往能打对手一个措手不及`);
    } else {
      insights.push(`在一日之战中，防守方展现出更强的抵抗力，胜率达${quickStats.defenderWinRate.toFixed(1)}%`);
    }
  }
  
  // 分析持久战胜负率
  const protractedStats = summary.protractedWarStats;
  if (protractedStats.totalBattles > 0) {
    if (protractedStats.attackerWinRate > protractedStats.defenderWinRate) {
      insights.push(`持久战(30天以上)中进攻方胜率更高(${protractedStats.attackerWinRate.toFixed(1)}%)，显示持续进攻能力的重要性`);
    } else {
      insights.push(`持久战往往对防守方更有利，防守方胜率达${protractedStats.defenderWinRate.toFixed(1)}%`);
    }
  }
  
  // 分析平均持续时间
  if (summary.averageDuration > 0) {
    if (summary.averageDuration <= 3) {
      insights.push(`历史战役平均持续时间较短(约${summary.averageDuration}天)，说明古代战争往往追求速战速决`);
    } else if (summary.averageDuration <= 7) {
      insights.push(`历史战役平均持续时间适中(约${summary.averageDuration}天)，展现了一定的战略纵深`);
    } else {
      insights.push(`历史战役平均持续时间较长(约${summary.averageDuration}天)，反映了战争的复杂性和持久性`);
    }
  }
  
  // 最长和最短战役
  if (summary.longestBattle) {
    insights.push(`持续时间最长的战役是${summary.longestBattle.name}，长达${summary.longestBattle.duration}天`);
  }
  
  if (summary.shortestBattle && summary.shortestBattle.duration > 0) {
    insights.push(`最短的战役${summary.shortestBattle.name}仅持续${summary.shortestBattle.duration}天，体现了突袭战的威力`);
  }
  
  // 持续时间与胜负趋势分析
  const correlation = summary.correlation;
  if (correlation.length >= 2) {
    const daily = correlation.find(c => c.category === 'daily');
    const protracted = correlation.find(c => c.category === 'protracted');
    
    if (daily && protracted && daily.totalBattles > 0 && protracted.totalBattles > 0) {
      if (daily.attackerWinRate > protracted.attackerWinRate) {
        insights.push('短战役对进攻方更有利，而持久战则更加考验双方的综合实力');
      }
    }
  }
  
  return insights;
}
