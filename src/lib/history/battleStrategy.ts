import type { Event, BattleStrategy, BattleType } from './types';

// ============ Types ============

/** Strategy usage statistics */
export type StrategyStats = {
  strategy: BattleStrategy;
  totalUsages: number;
  attackerWins: number;
  defenderWins: number;
  draws: number;
  winRate: number; // percentage
};

/** Strategy effectiveness by result */
export type StrategyEffectiveness = {
  strategy: BattleStrategy;
  result: 'attacker_win' | 'defender_win' | 'draw' | 'inconclusive';
  count: number;
  percentage: number;
};

// ============ Helper Functions ============

/**
 * Get strategy label in Chinese
 */
export function getStrategyLabel(strategy: BattleStrategy): string {
  const labels: Record<BattleStrategy, string> = {
    ambush: '伏击',
    fire: '火攻',
    water: '水攻',
    encirclement: '包围',
    siege: '攻城战',
    pincer: '钳形攻势',
    'feigned-retreat': '诱敌深入',
    alliance: '联盟作战',
    defensive: '防御作战',
    offensive: '进攻作战',
    guerrilla: '游击战',
    unknown: '未知',
  };
  return labels[strategy] || '未知';
}

/**
 * Check if a battle has strategy data
 */
export function hasStrategyData(battles: Event[]): boolean {
  return battles.some(b => b.battle?.strategy && b.battle.strategy.length > 0);
}

/**
 * Get all unique strategies used in battles
 */
export function getUniqueStrategies(battles: Event[]): BattleStrategy[] {
  const strategies = new Set<BattleStrategy>();
  
  for (const battle of battles) {
    if (battle.battle?.strategy) {
      battle.battle.strategy.forEach(s => strategies.add(s));
    }
  }
  
  return Array.from(strategies).sort();
}

/**
 * Get battles that use a specific strategy
 */
export function getBattlesByStrategy(
  battles: Event[],
  strategy: BattleStrategy
): Event[] {
  return battles.filter(
    b => b.battle?.strategy && b.battle.strategy.includes(strategy)
  );
}

/**
 * Get strategy usage statistics
 */
export function getStrategyStats(battles: Event[]): StrategyStats[] {
  const statsMap = new Map<BattleStrategy, StrategyStats>();
  
  // Initialize all strategies
  const allStrategies: BattleStrategy[] = [
    'ambush', 'fire', 'water', 'encirclement', 'siege', 
    'pincer', 'feigned-retreat', 'alliance', 'defensive', 
    'offensive', 'guerrilla', 'unknown'
  ];
  
  for (const strategy of allStrategies) {
    statsMap.set(strategy, {
      strategy,
      totalUsages: 0,
      attackerWins: 0,
      defenderWins: 0,
      draws: 0,
      winRate: 0,
    });
  }
  
  // Count strategy usages
  for (const battle of battles) {
    if (!battle.battle?.strategy || battle.battle.strategy.length === 0) continue;
    
    for (const strategy of battle.battle.strategy) {
      const stats = statsMap.get(strategy);
      if (!stats) continue;
      
      stats.totalUsages++;
      
      switch (battle.battle.result) {
        case 'attacker_win':
          stats.attackerWins++;
          break;
        case 'defender_win':
          stats.defenderWins++;
          break;
        case 'draw':
          stats.draws++;
          break;
      }
    }
  }
  
  // Calculate win rates
  const statsArray = Array.from(statsMap.values())
    .filter(s => s.totalUsages > 0)
    .map(s => ({
      ...s,
      winRate: s.totalUsages > 0 
        ? Math.round((s.attackerWins / s.totalUsages) * 100) 
        : 0,
    }));
  
  return statsArray.sort((a, b) => b.totalUsages - a.totalUsages);
}

/**
 * Get most used strategies
 */
export function getMostUsedStrategies(battles: Event[], limit = 5): StrategyStats[] {
  const stats = getStrategyStats(battles);
  return stats
    .filter(s => s.totalUsages > 0)
    .slice(0, limit);
}

/**
 * Get most effective strategies (highest attacker win rate)
 */
export function getMostEffectiveStrategies(battles: Event[], limit = 5): StrategyStats[] {
  const stats = getStrategyStats(battles);
  return stats
    .filter(s => s.totalUsages >= 2) // At least 2 usages for significance
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, limit);
}

/**
 * Get strategies by battle type
 */
export function getStrategiesByBattleType(
  battles: Event[],
  battleType: BattleType
): StrategyStats[] {
  const filteredBattles = battles.filter(b => b.battle?.battleType === battleType);
  return getStrategyStats(filteredBattles).filter(s => s.totalUsages > 0);
}

/**
 * Analyze strategy effectiveness by result
 */
export function getStrategyEffectiveness(
  battles: Event[],
  strategy: BattleStrategy
): StrategyEffectiveness[] {
  const strategyBattles = getBattlesByStrategy(battles, strategy);
  const total = strategyBattles.length;
  
  if (total === 0) return [];
  
  const results: { attacker_win: number; defender_win: number; draw: number; inconclusive: number } = {
    attacker_win: 0,
    defender_win: 0,
    draw: 0,
    inconclusive: 0,
  };
  
  for (const battle of strategyBattles) {
    const battleResult = battle.battle?.result;
    if (battleResult === 'attacker_win') {
      results.attacker_win++;
    } else if (battleResult === 'defender_win') {
      results.defender_win++;
    } else if (battleResult === 'draw') {
      results.draw++;
    } else if (battleResult === 'inconclusive') {
      results.inconclusive++;
    }
  }
  
  return Object.entries(results)
    .filter(([, count]) => count > 0)
    .map(([result, count]) => ({
      strategy,
      result: result as 'attacker_win' | 'defender_win' | 'draw' | 'inconclusive',
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Compare two strategies effectiveness
 */
export function compareStrategies(
  battles: Event[],
  strategy1: BattleStrategy,
  strategy2: BattleStrategy
): {
  strategy1: StrategyStats;
  strategy2: StrategyStats;
  difference: number; // win rate difference
} | null {
  const stats = getStrategyStats(battles);
  const s1 = stats.find(s => s.strategy === strategy1);
  const s2 = stats.find(s => s.strategy === strategy2);
  
  if (!s1 || !s2) return null;
  
  return {
    strategy1: s1,
    strategy2: s2,
    difference: s1.winRate - s2.winRate,
  };
}

/**
 * Get battles where specific strategy led to victory
 */
export function getBattlesWithStrategyAndResult(
  battles: Event[],
  strategy: BattleStrategy,
  result: 'attacker_win' | 'defender_win' | 'draw'
): Event[] {
  return battles.filter(
    b => b.battle?.strategy?.includes(strategy) && b.battle?.result === result
  );
}

/**
 * Analyze which strategies work best for attackers vs defenders
 */
export function getStrategyAttackerDefenderAnalysis(
  battles: Event[]
): {
  strategiesFavorAttackers: BattleStrategy[];
  strategiesFavorDefenders: BattleStrategy[];
  neutralStrategies: BattleStrategy[];
} {
  const stats = getStrategyStats(battles);
  
  const strategiesFavorAttackers: BattleStrategy[] = [];
  const strategiesFavorDefenders: BattleStrategy[] = [];
  const neutralStrategies: BattleStrategy[] = [];
  
  for (const stat of stats) {
    if (stat.totalUsages < 2) continue;
    
    if (stat.winRate > 60) {
      strategiesFavorAttackers.push(stat.strategy);
    } else if (stat.winRate < 40) {
      strategiesFavorDefenders.push(stat.strategy);
    } else {
      neutralStrategies.push(stat.strategy);
    }
  }
  
  return {
    strategiesFavorAttackers,
    strategiesFavorDefenders,
    neutralStrategies,
  };
}

/**
 * Generate strategy-related historical insights
 */
export function getStrategyInsights(battles: Event[]): string[] {
  const insights: string[] = [];
  
  if (!hasStrategyData(battles)) {
    return ['暂无战略/战术数据'];
  }
  
  const mostUsed = getMostUsedStrategies(battles, 3);
  const mostEffective = getMostEffectiveStrategies(battles, 3);
  const analysis = getStrategyAttackerDefenderAnalysis(battles);
  
  // Most used strategies
  if (mostUsed.length > 0) {
    const strategyNames = mostUsed.map(s => getStrategyLabel(s.strategy)).join('、');
    insights.push(`最常用的战略战术是${strategyNames}，这些战术在历史上被反复使用`);
  }
  
  // Most effective strategies
  const topEffective = mostEffective[0];
  if (mostEffective.length > 0 && topEffective && topEffective.totalUsages >= 2) {
    insights.push(`${getStrategyLabel(topEffective.strategy)}战术的进攻方胜率最高，达到${topEffective.winRate}%`);
  }
  
  // Attacker-favoring strategies
  if (analysis.strategiesFavorAttackers.length > 0) {
    const names = analysis.strategiesFavorAttackers.map(s => getStrategyLabel(s)).join('、');
    insights.push(`以下战术有利于进攻方：${names}`);
  }
  
  // Defender-favoring strategies
  if (analysis.strategiesFavorDefenders.length > 0) {
    const names = analysis.strategiesFavorDefenders.map(s => getStrategyLabel(s)).join('、');
    insights.push(`以下战术有利于防守方：${names}`);
  }
  
  return insights;
}

/**
 * Get strategy distribution by era
 */
export function getStrategyDistributionByEra(
  battles: Event[],
  eras: { id: string; nameKey: string }[]
): Map<string, StrategyStats[]> {
  const distribution = new Map<string, StrategyStats[]>();
  
  for (const era of eras) {
    const eraBattles = battles.filter(b => b.entityId === era.id);
    const eraStats = getStrategyStats(eraBattles).filter(s => s.totalUsages > 0);
    
    if (eraStats.length > 0) {
      distribution.set(era.id, eraStats);
    }
  }
  
  return distribution;
}

/**
 * Get complete strategy summary
 */
export function getStrategySummary(battles: Event[]): {
  totalBattles: number;
  battlesWithStrategy: number;
  uniqueStrategies: number;
  mostUsed: StrategyStats[];
  mostEffective: StrategyStats[];
  attackerFavoring: BattleStrategy[];
  defenderFavoring: BattleStrategy[];
} {
  const battlesWithStrategy = battles.filter(
    b => b.battle?.strategy && b.battle.strategy.length > 0
  );
  
  return {
    totalBattles: battles.length,
    battlesWithStrategy: battlesWithStrategy.length,
    uniqueStrategies: getUniqueStrategies(battles).length,
    mostUsed: getMostUsedStrategies(battles, 5),
    mostEffective: getMostEffectiveStrategies(battles, 5),
    attackerFavoring: getStrategyAttackerDefenderAnalysis(battles).strategiesFavorAttackers,
    defenderFavoring: getStrategyAttackerDefenderAnalysis(battles).strategiesFavorDefenders,
  };
}
