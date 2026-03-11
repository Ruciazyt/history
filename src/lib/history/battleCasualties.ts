import type { Event, BattleCasualties } from './types';
import { getBattles } from './battles';

/**
 * 获取有伤亡数据的战役
 */
export function getBattlesWithCasualties(events: Event[]): Event[] {
  const battles = getBattles(events);
  return battles.filter(b => b.battle?.casualties);
}

/**
 * 获取战役伤亡数据
 */
export function getBattleCasualties(battle: Event): BattleCasualties | undefined {
  return battle.battle?.casualties;
}

/**
 * 计算总伤亡人数（双方合计）
 */
export function getTotalCasualties(casualties?: BattleCasualties): number {
  if (!casualties) return 0;
  return (casualties.attacker || 0) + (casualties.defender || 0);
}

/**
 * 获取伤亡最惨重的战役
 */
export function getBloodiestBattles(events: Event[], limit = 10): Event[] {
  const battles = getBattlesWithCasualties(events);
  return battles
    .sort((a, b) => {
      const casualtiesA = getTotalCasualties(a.battle?.casualties);
      const casualtiesB = getTotalCasualties(b.battle?.casualties);
      return casualtiesB - casualtiesA;
    })
    .slice(0, limit);
}

/**
 * 伤亡统计类型
 */
export type CasualtyStats = {
  totalBattles: number;
  battlesWithCasualties: number;
  totalAttackerCasualties: number;
  totalDefenderCasualties: number;
  totalCasualties: number;
  averageCasualties: number;
  averageAttackerCasualties: number;
  averageDefenderCasualties: number;
  highestCasualtyBattle: Event | null;
  highestSingleSideCasualties: { battle: Event; side: 'attacker' | 'defender'; count: number } | null;
};

/**
 * 获取伤亡统计信息
 */
export function getCasualtyStats(events: Event[]): CasualtyStats {
  const battles = getBattlesWithCasualties(events);
  
  if (battles.length === 0) {
    return {
      totalBattles: getBattles(events).length,
      battlesWithCasualties: 0,
      totalAttackerCasualties: 0,
      totalDefenderCasualties: 0,
      totalCasualties: 0,
      averageCasualties: 0,
      averageAttackerCasualties: 0,
      averageDefenderCasualties: 0,
      highestCasualtyBattle: null,
      highestSingleSideCasualties: null,
    };
  }

  let totalAttackerCasualties = 0;
  let totalDefenderCasualties = 0;
  let highestCasualtyBattle: Event | null = null;
  let highestTotal = 0;
  let highestSingleSide: { battle: Event; side: 'attacker' | 'defender'; count: number } | null = null;

  battles.forEach(battle => {
    const casualties = battle.battle?.casualties;
    if (!casualties) return;

    const attackerCasualties = casualties.attacker || 0;
    const defenderCasualties = casualties.defender || 0;

    totalAttackerCasualties += attackerCasualties;
    totalDefenderCasualties += defenderCasualties;

    const total = attackerCasualties + defenderCasualties;
    if (total > highestTotal) {
      highestTotal = total;
      highestCasualtyBattle = battle;
    }

    if (attackerCasualties > (highestSingleSide?.count || 0)) {
      highestSingleSide = { battle, side: 'attacker', count: attackerCasualties };
    }
    if (defenderCasualties > (highestSingleSide?.count || 0)) {
      highestSingleSide = { battle, side: 'defender', count: defenderCasualties };
    }
  });

  const totalCasualties = totalAttackerCasualties + totalDefenderCasualties;

  return {
    totalBattles: getBattles(events).length,
    battlesWithCasualties: battles.length,
    totalAttackerCasualties,
    totalDefenderCasualties,
    totalCasualties,
    averageCasualties: totalCasualties / battles.length,
    averageAttackerCasualties: totalAttackerCasualties / battles.length,
    averageDefenderCasualties: totalDefenderCasualties / battles.length,
    highestCasualtyBattle,
    highestSingleSideCasualties: highestSingleSide,
  };
}

/**
 * 按朝代分析伤亡
 */
export type CasualtyByEra = {
  eraId: string;
  eraName: string;
  totalCasualties: number;
  battleCount: number;
  averageCasualties: number;
};

export function getCasualtiesByEra(events: Event[]): CasualtyByEra[] {
  const battles = getBattlesWithCasualties(events);
  const eraMap = new Map<string, { name: string; totalCasualties: number; battleCount: number }>();

  battles.forEach(battle => {
    const eraId = battle.entityId;
    const casualties = getTotalCasualties(battle.battle?.casualties);
    
    if (!eraMap.has(eraId)) {
      eraMap.set(eraId, { name: eraId, totalCasualties: 0, battleCount: 0 });
    }
    
    const era = eraMap.get(eraId)!;
    era.totalCasualties += casualties;
    era.battleCount += 1;
  });

  return Array.from(eraMap.entries()).map(([eraId, data]) => ({
    eraId,
    eraName: data.name,
    totalCasualties: data.totalCasualties,
    battleCount: data.battleCount,
    averageCasualties: data.battleCount > 0 ? data.totalCasualties / data.battleCount : 0,
  }));
}

/**
 * 按年份分析伤亡趋势
 */
export type CasualtyTrend = {
  year: number;
  totalCasualties: number;
  battleCount: number;
};

export function getCasualtyTrendByYear(events: Event[], startYear?: number, endYear?: number): CasualtyTrend[] {
  const battles = getBattlesWithCasualties(events);
  
  const yearMap = new Map<number, { totalCasualties: number; battleCount: number }>();

  battles.forEach(battle => {
    if (startYear && battle.year < startYear) return;
    if (endYear && battle.year > endYear) return;

    const casualties = getTotalCasualties(battle.battle?.casualties);
    
    if (!yearMap.has(battle.year)) {
      yearMap.set(battle.year, { totalCasualties: 0, battleCount: 0 });
    }
    
    const yearData = yearMap.get(battle.year)!;
    yearData.totalCasualties += casualties;
    yearData.battleCount += 1;
  });

  return Array.from(yearMap.entries())
    .map(([year, data]) => ({
      year,
      totalCasualties: data.totalCasualties,
      battleCount: data.battleCount,
    }))
    .sort((a, b) => a.year - b.year);
}

/**
 * 分析胜负与伤亡的关系
 */
export type OutcomeCasualtyAnalysis = {
  attackerWin: { avgAttackerCasualties: number; avgDefenderCasualties: number; count: number };
  defenderWin: { avgAttackerCasualties: number; avgDefenderCasualties: number; count: number };
  draw: { avgAttackerCasualties: number; avgDefenderCasualties: number; count: number };
};

export function getOutcomeCasualtyAnalysis(events: Event[]): OutcomeCasualtyAnalysis {
  const battles = getBattlesWithCasualties(events);

  const attackerWin = { totalAttacker: 0, totalDefender: 0, count: 0 };
  const defenderWin = { totalAttacker: 0, totalDefender: 0, count: 0 };
  const draw = { totalAttacker: 0, totalDefender: 0, count: 0 };

  battles.forEach(battle => {
    const casualties = battle.battle?.casualties;
    const result = battle.battle?.result;
    if (!casualties || !result) return;

    if (result === 'attacker_win') {
      attackerWin.totalAttacker += casualties.attacker || 0;
      attackerWin.totalDefender += casualties.defender || 0;
      attackerWin.count += 1;
    } else if (result === 'defender_win') {
      defenderWin.totalAttacker += casualties.attacker || 0;
      defenderWin.totalDefender += casualties.defender || 0;
      defenderWin.count += 1;
    } else if (result === 'draw') {
      draw.totalAttacker += casualties.attacker || 0;
      draw.totalDefender += casualties.defender || 0;
      draw.count += 1;
    }
  });

  return {
    attackerWin: {
      avgAttackerCasualties: attackerWin.count > 0 ? attackerWin.totalAttacker / attackerWin.count : 0,
      avgDefenderCasualties: attackerWin.count > 0 ? attackerWin.totalDefender / attackerWin.count : 0,
      count: attackerWin.count,
    },
    defenderWin: {
      avgAttackerCasualties: defenderWin.count > 0 ? defenderWin.totalAttacker / defenderWin.count : 0,
      avgDefenderCasualties: defenderWin.count > 0 ? defenderWin.totalDefender / defenderWin.count : 0,
      count: defenderWin.count,
    },
    draw: {
      avgAttackerCasualties: draw.count > 0 ? draw.totalAttacker / draw.count : 0,
      avgDefenderCasualties: draw.count > 0 ? draw.totalDefender / draw.count : 0,
      count: draw.count,
    },
  };
}

/**
 * 按规模分析伤亡
 */
export type CasualtyByScale = {
  scale: string;
  totalCasualties: number;
  battleCount: number;
  averageCasualties: number;
};

export function getCasualtiesByScale(events: Event[]): CasualtyByScale[] {
  const battles = getBattlesWithCasualties(events);
  const scaleMap = new Map<string, { totalCasualties: number; battleCount: number }>();

  const scaleOrder = ['massive', 'large', 'medium', 'small', 'unknown'];

  battles.forEach(battle => {
    const scale = battle.battle?.scale || 'unknown';
    const casualties = getTotalCasualties(battle.battle?.casualties);
    
    if (!scaleMap.has(scale)) {
      scaleMap.set(scale, { totalCasualties: 0, battleCount: 0 });
    }
    
    const scaleData = scaleMap.get(scale)!;
    scaleData.totalCasualties += casualties;
    scaleData.battleCount += 1;
  });

  return scaleOrder
    .filter(scale => scaleMap.has(scale))
    .map(scale => {
      const data = scaleMap.get(scale)!;
      return {
        scale,
        totalCasualties: data.totalCasualties,
        battleCount: data.battleCount,
        averageCasualties: data.battleCount > 0 ? data.totalCasualties / data.battleCount : 0,
      };
    });
}

/**
 * 获取伤亡可靠程度分布
 */
export type ReliabilityDistribution = {
  high: number;
  medium: number;
  low: number;
  unknown: number;
};

export function getReliabilityDistribution(events: Event[]): ReliabilityDistribution {
  const battles = getBattlesWithCasualties(events);
  
  const distribution: ReliabilityDistribution = {
    high: 0,
    medium: 0,
    low: 0,
    unknown: 0,
  };

  battles.forEach(battle => {
    const reliability = battle.battle?.casualties?.reliability;
    if (reliability) {
      distribution[reliability]++;
    } else {
      distribution.unknown++;
    }
  });

  return distribution;
}

/**
 * 生成伤亡相关历史洞察
 */
export function getCasualtyInsights(events: Event[]): string[] {
  const insights: string[] = [];
  const stats = getCasualtyStats(events);
  
  if (stats.battlesWithCasualties === 0) {
    return ['暂无伤亡数据'];
  }

  // 最高伤亡战役洞察
  if (stats.highestCasualtyBattle) {
    const battle = stats.highestCasualtyBattle;
    const casualties = getTotalCasualties(battle.battle?.casualties);
    const year = battle.year;
    const yearStr = year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
    insights.push(`历史上伤亡最惨重的战役是 ${yearStr} 年的战役，约 ${casualties.toLocaleString()} 人`);
  }

  // 胜负与伤亡洞察
  const outcomeAnalysis = getOutcomeCasualtyAnalysis(events);
  if (outcomeAnalysis.attackerWin.count > 0 && outcomeAnalysis.defenderWin.count > 0) {
    const attackerWinDefenderAvg = outcomeAnalysis.attackerWin.avgDefenderCasualties;
    const defenderWinAttackerAvg = outcomeAnalysis.defenderWin.avgAttackerCasualties;
    
    if (attackerWinDefenderAvg > defenderWinAttackerAvg * 1.5) {
      insights.push('进攻方胜利的战役中，防守方平均伤亡往往是进攻方胜利时进攻方伤亡的数倍，说明进攻胜利往往伴随着防守方的重大损失');
    }
  }

  // 规模与伤亡洞察
  const byScale = getCasualtiesByScale(events);
  const massiveBattles = byScale.find(s => s.scale === 'massive');
  if (massiveBattles && massiveBattles.battleCount > 0) {
    insights.push(`大规模战役（massive）平均伤亡约 ${Math.round(massiveBattles.averageCasualties).toLocaleString()} 人，是战争的主要消耗`);
  }

  // 朝代洞察
  const byEra = getCasualtiesByEra(events);
  if (byEra.length > 1) {
    const sortedEras = [...byEra].sort((a, b) => b.averageCasualties - a.averageCasualties);
    if (sortedEras[0].battleCount > 0) {
      insights.push(`${sortedEras[0].eraName} 时期的战役平均伤亡最高，达到约 ${Math.round(sortedEras[0].averageCasualties).toLocaleString()} 人`);
    }
  }

  return insights;
}

/**
 * 获取伤亡摘要
 */
export type CasualtySummary = {
  stats: CasualtyStats;
  bloodiestBattles: Event[];
  byEra: CasualtyByEra[];
  byScale: CasualtyByScale[];
  reliabilityDistribution: ReliabilityDistribution;
  outcomeAnalysis: OutcomeCasualtyAnalysis;
  insights: string[];
};

export function getCasualtySummary(events: Event[]): CasualtySummary {
  return {
    stats: getCasualtyStats(events),
    bloodiestBattles: getBloodiestBattles(events, 5),
    byEra: getCasualtiesByEra(events),
    byScale: getCasualtiesByScale(events),
    reliabilityDistribution: getReliabilityDistribution(events),
    outcomeAnalysis: getOutcomeCasualtyAnalysis(events),
    insights: getCasualtyInsights(events),
  };
}

/**
 * 检查是否有伤亡数据
 */
export function hasCasualtyData(events: Event[]): boolean {
  return getBattlesWithCasualties(events).length > 0;
}
