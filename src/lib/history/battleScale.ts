/**
 * 战役规模分析模块
 * 分析战役规模与胜负、类型、指挥官等的关联
 */

import { Event, BattleScale, BattleType, BattleImpact } from './types';

/** 规模级别定义 */
export const SCALE_LEVELS: BattleScale[] = ['massive', 'large', 'medium', 'small', 'unknown'];

/** 规模级别名称 */
export function getScaleName(scale: BattleScale): string {
  const names: Record<BattleScale, string> = {
    massive: '超大规模',
    large: '大规模',
    medium: '中等规模',
    small: '小规模',
    unknown: '规模未知',
  };
  return names[scale] || scale;
}

/** 获取战役规模 */
export function getBattleScale(battle: Event): BattleScale {
  return battle.battle?.scale || 'unknown';
}

/** 规模统计类型 */
export interface ScaleStats {
  scale: BattleScale;
  total: number;
  wins: number;
  losses: number;
  draws: number;
  inconclusive: number;
  winRate: number;
}

/** 规模分布类型 */
export interface ScaleDistribution {
  scale: BattleScale;
  count: number;
  percentage: number;
}

/** 规模与胜负关联类型 */
export interface ScaleOutcomeCorrelation {
  scale: BattleScale;
  attackerWins: number;
  defenderWins: number;
  draws: number;
  total: number;
  attackerWinRate: number;
}

/** 规模与类型关联类型 */
export interface ScaleTypeCorrelation {
  scale: BattleScale;
  battleType: BattleType;
  count: number;
  percentage: number;
}

/** 规模与影响力关联类型 */
export interface ScaleImpactCorrelation {
  scale: BattleScale;
  impact: BattleImpact;
  count: number;
  percentage: number;
}

/** 规模洞察类型 */
export interface ScaleInsight {
  type: 'scale_distribution' | 'scale_outcome' | 'scale_type' | 'scale_impact' | 'scale_dominance';
  title: string;
  description: string;
  data?: unknown;
}

/**
 * 获取有规模数据的战役
 */
export function getBattlesWithScale(events: Event[]): Event[] {
  return events.filter(e => e.battle?.scale && e.battle.scale !== 'unknown');
}

/**
 * 获取唯一规模级别
 */
export function getUniqueScales(battles: Event[]): BattleScale[] {
  const scales = new Set<BattleScale>();
  battles.forEach(battle => {
    const scale = getBattleScale(battle);
    if (scale !== 'unknown') {
      scales.add(scale);
    }
  });
  return Array.from(scales);
}

/**
 * 获取规模统计
 */
export function getScaleStats(battles: Event[], scale: BattleScale): ScaleStats | null {
  const filtered = battles.filter(b => getBattleScale(b) === scale);
  if (filtered.length === 0) return null;

  let wins = 0, losses = 0, draws = 0, inconclusive = 0;
  filtered.forEach(battle => {
    const result = battle.battle?.result;
    if (result === 'attacker_win') wins++;
    else if (result === 'defender_win') losses++;
    else if (result === 'draw') draws++;
    else inconclusive++;
  });

  const total = filtered.length;
  const decided = wins + losses;
  const winRate = decided > 0 ? (wins / decided) * 100 : 0;

  return {
    scale,
    total,
    wins,
    losses,
    draws,
    inconclusive,
    winRate: Math.round(winRate * 10) / 10,
  };
}

/**
 * 获取所有规模统计
 */
export function getAllScalesStats(battles: Event[]): ScaleStats[] {
  const scales = getUniqueScales(battles);
  const stats: ScaleStats[] = [];
  
  scales.forEach(scale => {
    const s = getScaleStats(battles, scale);
    if (s) stats.push(s);
  });

  // 按total排序
  return stats.sort((a, b) => b.total - a.total);
}

/**
 * 获取规模分布
 */
export function getScaleDistribution(battles: Event[]): ScaleDistribution[] {
  const validBattles = battles.filter(b => {
    const scale = getBattleScale(b);
    return scale !== 'unknown';
  });

  const total = validBattles.length;
  if (total === 0) return [];

  const counts = new Map<BattleScale, number>();
  validBattles.forEach(battle => {
    const scale = getBattleScale(battle);
    counts.set(scale, (counts.get(scale) || 0) + 1);
  });

  const distribution: ScaleDistribution[] = [];
  SCALE_LEVELS.forEach(scale => {
    const count = counts.get(scale) || 0;
    if (count > 0) {
      distribution.push({
        scale,
        count,
        percentage: Math.round((count / total) * 1000) / 10,
      });
    }
  });

  return distribution.sort((a, b) => b.count - a.count);
}

/**
 * 获取最常见规模
 */
export function getMostCommonScale(battles: Event[]): ScaleDistribution | null {
  const distribution = getScaleDistribution(battles);
  return distribution.length > 0 ? (distribution[0] ?? null) : null;
}

/**
 * 获取规模与胜负关联分析
 */
export function getScaleOutcomeCorrelation(battles: Event[]): ScaleOutcomeCorrelation[] {
  const validBattles = battles.filter(b => {
    const scale = getBattleScale(b);
    return scale !== 'unknown' && b.battle?.result;
  });

  const correlationMap = new Map<BattleScale, ScaleOutcomeCorrelation>();

  validBattles.forEach(battle => {
    const scale = getBattleScale(battle);
    const result = battle.battle?.result;
    
    let current = correlationMap.get(scale);
    if (!current) {
      current = {
        scale,
        attackerWins: 0,
        defenderWins: 0,
        draws: 0,
        total: 0,
        attackerWinRate: 0,
      };
      correlationMap.set(scale, current);
    }

    current.total++;
    if (result === 'attacker_win') current.attackerWins++;
    else if (result === 'defender_win') current.defenderWins++;
    else if (result === 'draw') current.draws++;
  });

  const correlations: ScaleOutcomeCorrelation[] = [];
  correlationMap.forEach(corr => {
    const decided = corr.attackerWins + corr.defenderWins;
    corr.attackerWinRate = decided > 0 
      ? Math.round((corr.attackerWins / decided) * 1000) / 10 
      : 0;
    correlations.push(corr);
  });

  return correlations.sort((a, b) => b.total - a.total);
}

/**
 * 获取规模与类型关联分析
 */
export function getScaleTypeCorrelation(battles: Event[]): ScaleTypeCorrelation[] {
  const validBattles = battles.filter(b => {
    const scale = getBattleScale(b);
    return scale !== 'unknown' && b.battle?.battleType;
  });

  const correlationMap = new Map<string, ScaleTypeCorrelation>();
  const scaleTypeCounts = new Map<string, number>();

  validBattles.forEach(battle => {
    const scale = getBattleScale(battle);
    const battleType = battle.battle?.battleType as BattleType;
    if (!battleType) return;

    const key = `${scale}-${battleType}`;
    const current = correlationMap.get(key);
    if (current) {
      current.count++;
    } else {
      correlationMap.set(key, {
        scale,
        battleType,
        count: 1,
        percentage: 0,
      });
    }

    // 统计每个规模的总数
    const scaleTotal = scaleTypeCounts.get(scale) || 0;
    scaleTypeCounts.set(scale, scaleTotal + 1);
  });

  const correlations: ScaleTypeCorrelation[] = [];
  correlationMap.forEach(corr => {
    const scaleTotal = scaleTypeCounts.get(corr.scale) || 1;
    corr.percentage = Math.round((corr.count / scaleTotal) * 1000) / 10;
    correlations.push(corr);
  });

  return correlations.sort((a, b) => b.count - a.count);
}

/**
 * 获取规模与影响力关联分析
 */
export function getScaleImpactCorrelation(battles: Event[]): ScaleImpactCorrelation[] {
  const validBattles = battles.filter(b => {
    const scale = getBattleScale(b);
    return scale !== 'unknown' && b.battle?.impact;
  });

  const correlationMap = new Map<string, ScaleImpactCorrelation>();
  const scaleCounts = new Map<BattleScale, number>();

  validBattles.forEach(battle => {
    const scale = getBattleScale(battle);
    const impact = battle.battle?.impact as BattleImpact;
    if (!impact) return;

    const key = `${scale}-${impact}`;
    const current = correlationMap.get(key);
    if (current) {
      current.count++;
    } else {
      correlationMap.set(key, {
        scale,
        impact,
        count: 1,
        percentage: 0,
      });
    }

    const scaleTotal = scaleCounts.get(scale) || 0;
    scaleCounts.set(scale, scaleTotal + 1);
  });

  const correlations: ScaleImpactCorrelation[] = [];
  correlationMap.forEach(corr => {
    const scaleTotal = scaleCounts.get(corr.scale) || 1;
    corr.percentage = Math.round((corr.count / scaleTotal) * 1000) / 10;
    correlations.push(corr);
  });

  return correlations.sort((a, b) => b.count - a.count);
}

/**
 * 检查是否有规模数据
 */
export function hasScaleData(battles: Event[]): boolean {
  return battles.some(b => {
    const scale = getBattleScale(b);
    return scale !== 'unknown';
  });
}

/**
 * 获取规模与胜负洞察
 */
export function getScaleOutcomeInsight(battles: Event[]): ScaleInsight | null {
  const correlation = getScaleOutcomeCorrelation(battles);
  if (correlation.length === 0) return null;

  // 找出进攻方胜率最高和最低的规模
  let highestWinRate = correlation[0];
  let lowestWinRate = correlation[0];

  correlation.forEach(corr => {
    if (corr.total >= 2) { // 至少2场战役才统计
      if (corr.attackerWinRate > (highestWinRate?.attackerWinRate ?? 0)) {
        highestWinRate = corr;
      }
      if (lowestWinRate && corr.attackerWinRate < lowestWinRate.attackerWinRate) {
        lowestWinRate = corr;
      }
    }
  });

  if (!highestWinRate || !lowestWinRate || highestWinRate.scale === lowestWinRate.scale) return null;

  const highestScaleName = getScaleName(highestWinRate.scale);
  const lowestScaleName = getScaleName(lowestWinRate.scale);

  return {
    type: 'scale_outcome',
    title: '规模与胜负规律',
    description: `${highestScaleName}战役中进攻方胜率最高（${highestWinRate.attackerWinRate}%），而${lowestScaleName}战役中进攻方胜率最低（${lowestWinRate.attackerWinRate}%）。`,
    data: { highest: highestWinRate, lowest: lowestWinRate },
  };
}

/**
 * 获取规模分布洞察
 */
export function getScaleDistributionInsight(battles: Event[]): ScaleInsight | null {
  const distribution = getScaleDistribution(battles);
  if (distribution.length === 0) return null;

  const mostCommon = distribution[0];
  if (!mostCommon) return null;
  const mostCommonName = getScaleName(mostCommon.scale);

  return {
    type: 'scale_distribution',
    title: '战役规模分布',
    description: `在已知规模的战役中，${mostCommonName}战役最为常见，占${mostCommon.percentage}%（共${mostCommon.count}场）。`,
    data: distribution,
  };
}

/**
 * 获取规模与类型洞察
 */
export function getScaleTypeInsight(battles: Event[]): ScaleInsight | null {
  const correlation = getScaleTypeCorrelation(battles);
  if (correlation.length === 0) return null;

  // 找出最常见的规模-类型组合
  const top = correlation[0];
  if (!top) return null;

  const scaleName = getScaleName(top.scale);
  const typeNames: Record<BattleType, string> = {
    founding: '开国之战',
    unification: '统一战争',
    conquest: '征服战',
    defense: '防御战',
    rebellion: '叛乱/起义',
    'civil-war': '内战',
    frontier: '边疆战役',
    invasion: '入侵/外敌',
    unknown: '类型未知',
  };
  const typeName = typeNames[top.battleType] || top.battleType;

  return {
    type: 'scale_type',
    title: '规模与类型关联',
    description: `${scaleName}战役最常见于${typeName}类型，占该规模战役的${top.percentage}%。`,
    data: top,
  };
}

/**
 * 获取所有规模洞察
 */
export function getScaleInsights(battles: Event[]): ScaleInsight[] {
  const insights: ScaleInsight[] = [];

  const distInsight = getScaleDistributionInsight(battles);
  if (distInsight) insights.push(distInsight);

  const outcomeInsight = getScaleOutcomeInsight(battles);
  if (outcomeInsight) insights.push(outcomeInsight);

  const typeInsight = getScaleTypeInsight(battles);
  if (typeInsight) insights.push(typeInsight);

  return insights;
}
