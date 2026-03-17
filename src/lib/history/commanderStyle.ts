import type { Event, BattleStrategy, BattleTerrain, BattleWeather, BattlePacing } from './types';
import { getBattles } from './battles';

/**
 * 指挥官战术风格类型
 */
export type CommanderStyle = 
  | 'aggressive'      // 进攻型
  | 'defensive'        // 防守型
  | 'flexible'         // 灵活型
  | 'strategic'        // 战略型
  | 'tactical'         // 战术型
  | 'unknown';         // 未知

/**
 * 指挥官战术风格统计
 */
export type CommanderStyleStats = {
  commander: string;
  /** 进攻型战术数量 */
  aggressiveCount: number;
  /** 防守型战术数量 */
  defensiveCount: number;
  /** 使用的战术总数 */
  totalBattles: number;
  /** 胜利次数 */
  victories: number;
  /** 失败次数 */
  defeats: number;
  /** 平局次数 */
  draws: number;
  /** 胜率 */
  winRate: number;
  /** 主导风格 */
  dominantStyle: CommanderStyle;
  /** 常用地形 */
  preferredTerrain: string[];
  /** 常用天气 */
  preferredWeather: string[];
};

/**
 * 指挥官战役参与记录
 */
export type CommanderBattleRecord = {
  commander: string;
  battle: Event;
  side: 'attacker' | 'defender';
  result: 'win' | 'defeat' | 'draw' | 'unknown';
  strategies: BattleStrategy[];
  terrain: BattleTerrain[];
  weather: BattleWeather[];
  pacing: BattlePacing | undefined;
};

/**
 * 获取指挥官战术风格标签
 */
export function getCommanderStyleLabel(style: CommanderStyle): string {
  const labels: Record<CommanderStyle, string> = {
    aggressive: '进攻型',
    defensive: '防守型',
    flexible: '灵活型',
    strategic: '战略型',
    tactical: '战术型',
    unknown: '未知',
  };
  return labels[style] || '未知';
}

/**
 * 判断是否为进攻型战术
 */
function isAggressiveStrategy(strategy: BattleStrategy): boolean {
  const aggressiveStrategies: BattleStrategy[] = [
    'offensive', 'ambush', 'fire', 'encirclement', 'pincer'
  ];
  return aggressiveStrategies.includes(strategy);
}

/**
 * 判断是否为防守型战术
 */
function isDefensiveStrategy(strategy: BattleStrategy): boolean {
  const defensiveStrategies: BattleStrategy[] = [
    'defensive', 'siege', 'guerrilla'
  ];
  return defensiveStrategies.includes(strategy);
}

/**
 * 判断是否为灵活型战术
 */
function isFlexibleStrategy(strategy: BattleStrategy): boolean {
  const flexibleStrategies: BattleStrategy[] = [
    'feigned-retreat', 'alliance', 'water'
  ];
  return flexibleStrategies.includes(strategy);
}

/**
 * 分析单场战役中某指挥官使用的战术风格
 */
export function analyzeCommanderBattleStyle(
  commander: string,
  battle: Event
): CommanderStyle {
  const commanders = battle.battle?.commanders;
  if (!commanders) return 'unknown';
  
  const strategies = battle.battle?.strategy || [];
  
  // 确定指挥官在哪一方
  const isAttackerCommander = commanders.attacker?.includes(commander);
  const isDefenderCommander = commanders.defender?.includes(commander);
  
  if (!isAttackerCommander && !isDefenderCommander) {
    return 'unknown';
  }
  
  // 统计各种风格战术的数量
  let aggressiveCount = 0;
  let defensiveCount = 0;
  let flexibleCount = 0;
  
  for (const strategy of strategies) {
    if (isAggressiveStrategy(strategy)) aggressiveCount++;
    else if (isDefensiveStrategy(strategy)) defensiveCount++;
    else if (isFlexibleStrategy(strategy)) flexibleCount++;
  }
  
  // 判断主导风格
  if (aggressiveCount > defensiveCount && aggressiveCount > flexibleCount) {
    return 'aggressive';
  } else if (defensiveCount > aggressiveCount && defensiveCount > flexibleCount) {
    return 'defensive';
  } else if (flexibleCount > 0) {
    return 'flexible';
  } else if (strategies.length > 2) {
    return 'strategic';
  } else if (strategies.length > 0) {
    return 'tactical';
  }
  
  return 'unknown';
}

/**
 * 获取所有战役指挥官列表（去重）
 */
export function getAllCommanders(events: Event[]): string[] {
  const battles = getBattles(events);
  const commanderSet = new Set<string>();
  
  for (const battle of battles) {
    const commanders = battle.battle?.commanders;
    if (!commanders) continue;
    
    commanders.attacker?.forEach(c => commanderSet.add(c));
    commanders.defender?.forEach(c => commanderSet.add(c));
  }
  
  return Array.from(commanderSet).sort();
}

/**
 * 获取有指挥官数据的战役
 */
export function getBattlesWithCommanders(events: Event[]): Event[] {
  const battles = getBattles(events);
  return battles.filter(b => b.battle?.commanders);
}

/**
 * 获取某指挥官参与的所有战役
 */
export function getCommanderBattles(
  events: Event[],
  commander: string
): CommanderBattleRecord[] {
  const battles = getBattlesWithCommanders(events);
  const records: CommanderBattleRecord[] = [];
  
  for (const battle of battles) {
    const commanders = battle.battle?.commanders;
    if (!commanders) continue;
    
    const isAttackerCommander = commanders.attacker?.includes(commander);
    const isDefenderCommander = commanders.defender?.includes(commander);
    
    if (!isAttackerCommander && !isDefenderCommander) continue;
    
    let result: 'win' | 'defeat' | 'draw' | 'unknown' = 'unknown';
    const battleResult = battle.battle?.result;
    if (battleResult === 'attacker_win') {
      result = isAttackerCommander ? 'win' : 'defeat';
    } else if (battleResult === 'defender_win') {
      result = isDefenderCommander ? 'win' : 'defeat';
    } else if (battleResult === 'draw') {
      result = 'draw';
    }
    
    records.push({
      commander,
      battle,
      side: isAttackerCommander ? 'attacker' : 'defender',
      result,
      strategies: battle.battle?.strategy || [],
      terrain: battle.battle?.terrain || [],
      weather: battle.battle?.weather || [],
      pacing: battle.battle?.pacing,
    });
  }
  
  return records;
}

/**
 * 获取某指挥官的风格统计
 */
export function getCommanderStyleStats(
  events: Event[],
  commander: string
): CommanderStyleStats | null {
  const records = getCommanderBattles(events, commander);
  
  if (records.length === 0) return null;
  
  let aggressiveCount = 0;
  let defensiveCount = 0;
  let flexibleCount = 0;
  let victories = 0;
  let defeats = 0;
  let draws = 0;
  const terrainSet = new Set<string>();
  const weatherSet = new Set<string>();
  
  for (const record of records) {
    // 统计战术风格
    for (const strategy of record.strategies) {
      if (isAggressiveStrategy(strategy)) aggressiveCount++;
      else if (isDefensiveStrategy(strategy)) defensiveCount++;
      else if (isFlexibleStrategy(strategy)) flexibleCount++;
    }
    
    // 统计胜负
    if (record.result === 'win') victories++;
    else if (record.result === 'defeat') defeats++;
    else if (record.result === 'draw') draws++;
    
    // 收集地形
    for (const t of record.terrain) {
      terrainSet.add(t);
    }
    
    // 收集天气
    for (const w of record.weather) {
      weatherSet.add(w);
    }
  }
  
  // 确定主导风格
  let dominantStyle: CommanderStyle = 'unknown';
  if (aggressiveCount > defensiveCount && aggressiveCount > flexibleCount) {
    dominantStyle = 'aggressive';
  } else if (defensiveCount > aggressiveCount && defensiveCount > flexibleCount) {
    dominantStyle = 'defensive';
  } else if (flexibleCount > 0) {
    dominantStyle = 'flexible';
  } else if (records.length >= 3) {
    dominantStyle = 'strategic';
  } else if (records.length > 0) {
    dominantStyle = 'tactical';
  }
  
  const totalBattles = records.length;
  const winRate = totalBattles > 0 ? Math.round((victories / totalBattles) * 100) : 0;
  
  return {
    commander,
    aggressiveCount,
    defensiveCount,
    totalBattles,
    victories,
    defeats,
    draws,
    winRate,
    dominantStyle,
    preferredTerrain: Array.from(terrainSet),
    preferredWeather: Array.from(weatherSet),
  };
}

/**
 * 获取所有指挥官的风格统计
 */
export function getAllCommandersStyleStats(
  events: Event[]
): CommanderStyleStats[] {
  const commanders = getAllCommanders(events);
  const stats: CommanderStyleStats[] = [];
  
  for (const commander of commanders) {
    const commanderStats = getCommanderStyleStats(events, commander);
    if (commanderStats) {
      stats.push(commanderStats);
    }
  }
  
  return stats;
}

/**
 * 获取某风格的指挥官列表
 */
export function getCommandersByStyle(
  events: Event[],
  style: CommanderStyle
): CommanderStyleStats[] {
  const allStats = getAllCommandersStyleStats(events);
  return allStats.filter(s => s.dominantStyle === style);
}

/**
 * 获取最成功的指挥官（按胜率排序）
 */
export function getTopCommandersByWinRate(
  events: Event[],
  minBattles = 1
): CommanderStyleStats[] {
  const allStats = getAllCommandersStyleStats(events);
  return allStats
    .filter(s => s.totalBattles >= minBattles)
    .sort((a, b) => b.winRate - a.winRate);
}

/**
 * 获取最活跃的指挥官（按战役数量排序）
 */
export function getMostActiveCommanders(
  events: Event[],
  limit = 10
): CommanderStyleStats[] {
  const allStats = getAllCommandersStyleStats(events);
  return allStats
    .sort((a, b) => b.totalBattles - a.totalBattles)
    .slice(0, limit);
}

/**
 * 指挥官类型分布统计
 */
export type StyleDistribution = {
  style: CommanderStyle;
  label: string;
  count: number;
  percentage: number;
};

/**
 * 获取指挥官风格分布
 */
export function getStyleDistribution(events: Event[]): StyleDistribution[] {
  const allStats = getAllCommandersStyleStats(events);
  const total = allStats.length;
  
  const styleCount = new Map<CommanderStyle, number>();
  
  for (const stats of allStats) {
    const style = stats.dominantStyle;
    styleCount.set(style, (styleCount.get(style) || 0) + 1);
  }
  
  const distributions: StyleDistribution[] = [];
  const styleLabels: Record<CommanderStyle, string> = {
    aggressive: '进攻型',
    defensive: '防守型',
    flexible: '灵活型',
    strategic: '战略型',
    tactical: '战术型',
    unknown: '未知',
  };
  
  for (const [style, count] of styleCount) {
    distributions.push({
      style,
      label: styleLabels[style] || '未知',
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    });
  }
  
  return distributions.sort((a, b) => b.count - a.count);
}

/**
 * 风格胜率对比
 */
export type StyleWinRateComparison = {
  style: CommanderStyle;
  label: string;
  totalBattles: number;
  victories: number;
  defeats: number;
  draws: number;
  winRate: number;
};

/**
 * 获取各风格胜率对比
 */
export function getStyleWinRateComparison(events: Event[]): StyleWinRateComparison[] {
  const allStats = getAllCommandersStyleStats(events);
  
  const styleStats = new Map<CommanderStyle, {
    totalBattles: number;
    victories: number;
    defeats: number;
    draws: number;
  }>();
  
  for (const stats of allStats) {
    const style = stats.dominantStyle;
    const existing = styleStats.get(style) || { totalBattles: 0, victories: 0, defeats: 0, draws: 0 };
    existing.totalBattles += stats.totalBattles;
    existing.victories += stats.victories;
    existing.defeats += stats.defeats;
    existing.draws += stats.draws;
    styleStats.set(style, existing);
  }
  
  const styleLabels: Record<CommanderStyle, string> = {
    aggressive: '进攻型',
    defensive: '防守型',
    flexible: '灵活型',
    strategic: '战略型',
    tactical: '战术型',
    unknown: '未知',
  };
  
  const comparisons: StyleWinRateComparison[] = [];
  
  for (const [style, data] of styleStats) {
    comparisons.push({
      style,
      label: styleLabels[style] || '未知',
      totalBattles: data.totalBattles,
      victories: data.victories,
      defeats: data.defeats,
      draws: data.draws,
      winRate: data.totalBattles > 0 ? Math.round((data.victories / data.totalBattles) * 100) : 0,
    });
  }
  
  return comparisons.sort((a, b) => b.winRate - a.winRate);
}

/**
 * 检查是否有足够的指挥官数据
 */
export function hasCommanderStyleData(events: Event[]): boolean {
  return getAllCommanders(events).length > 0;
}

/**
 * 指挥官洞察类型
 */
export type CommanderStyleInsight = {
  type: 'style-dominance' | 'most-successful-style' | 'active-commander' | 'style-advantage';
  title: string;
  description: string;
};

/**
 * 生成指挥官风格分析洞察
 */
export function getCommanderStyleInsights(events: Event[]): CommanderStyleInsight[] {
  const insights: CommanderStyleInsight[] = [];
  
  // 检查是否有数据
  if (!hasCommanderStyleData(events)) {
    return insights;
  }
  
  // 风格分布
  const distribution = getStyleDistribution(events);
  if (distribution.length > 0) {
    const dominant = distribution[0];
    insights.push({
      type: 'style-dominance',
      title: '指挥官风格分布',
      description: `${dominant.label}指挥官占比最高，达${dominant.percentage}%，共${dominant.count}位。`,
    });
  }
  
  // 最成功的风格
  const winRateComparison = getStyleWinRateComparison(events);
  if (winRateComparison.length > 0 && winRateComparison[0].totalBattles >= 3) {
    const topStyle = winRateComparison[0];
    insights.push({
      type: 'most-successful-style',
      title: '最成功风格',
      description: `${topStyle.label}指挥官胜率最高，达${topStyle.winRate}%（${topStyle.victories}胜${topStyle.defeats}负）。`,
    });
  }
  
  // 最活跃的指挥官
  const activeCommanders = getMostActiveCommanders(events, 3);
  if (activeCommanders.length > 0) {
    const top = activeCommanders[0];
    insights.push({
      type: 'active-commander',
      title: '最活跃指挥官',
      description: `${top.commander}参与战役最多，共${top.totalBattles}场，胜率${top.winRate}%，风格为${getCommanderStyleLabel(top.dominantStyle)}。`,
    });
  }
  
  return insights;
}

/**
 * 指挥官摘要类型
 */
export type CommanderStyleSummary = {
  totalCommanders: number;
  totalBattles: number;
  distribution: StyleDistribution[];
  styleWinRates: StyleWinRateComparison[];
  topCommanders: CommanderStyleStats[];
  insights: CommanderStyleInsight[];
};

/**
 * 获取指挥官风格分析完整摘要
 */
export function getCommanderStyleSummary(events: Event[]): CommanderStyleSummary {
  const allStats = getAllCommandersStyleStats(events);
  const totalBattles = allStats.reduce((sum, s) => sum + s.totalBattles, 0);
  
  return {
    totalCommanders: allStats.length,
    totalBattles,
    distribution: getStyleDistribution(events),
    styleWinRates: getStyleWinRateComparison(events),
    topCommanders: getTopCommandersByWinRate(events, 1).slice(0, 10),
    insights: getCommanderStyleInsights(events),
  };
}
