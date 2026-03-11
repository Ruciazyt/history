/**
 * 战役时间分布分析模块
 * 分析战役在历史时间上的分布规律（世纪、朝代、时代）
 */

import { Event, BattleType, BattleImpact, BattleScale } from './types';

/** 世纪类型 */
export type Century = {
  century: number; // 正数表示公元世纪，负数表示公元前世纪
  label: string;
};

/** 时代类型 */
export type EraGroup = 'ancient' | 'spring-autumn' | 'warring-states' | 'imperial' | 'medieval' | 'early-modern' | 'modern';

/** 时代标签 */
export function getEraGroupLabel(era: EraGroup): string {
  const labels: Record<EraGroup, string> = {
    ancient: '上古时期',
    'spring-autumn': '春秋时期',
    'warring-states': '战国时期',
    imperial: '秦汉帝国时期',
    medieval: '魏晋南北朝',
    'early-modern': '隋唐宋元',
    modern: '明清时期',
  };
  return labels[era];
}

/** 获取战役所属世纪 */
export function getBattleCentury(battle: Event): number {
  const year = battle.year;
  if (year < 0) {
    // 公元前: -1 世纪 = 1-100 BCE
    return Math.floor((Math.abs(year) - 1) / 100) + 1;
  } else {
    // 公元后: 1 世纪 = 1-100 CE
    return Math.floor((year - 1) / 100) + 1;
  }
}

/** 获取世纪标签 */
export function getCenturyLabel(century: number): string {
  if (century <= 0) return '未知';
  if (century === 1) return '公元前1世纪';
  if (century < 0) return `公元前${Math.abs(century)}世纪`;
  return `公元${century}世纪`;
}

/** 获取战役所属时代组 */
export function getBattleEraGroup(battle: Event): EraGroup {
  const year = battle.year;
  
  if (year < -770) return 'ancient';
  if (year >= -770 && year < -476) return 'spring-autumn';
  if (year >= -476 && year < -221) return 'warring-states';
  if (year >= -221 && year < 220) return 'imperial';
  if (year >= 220 && year < 589) return 'medieval';
  if (year >= 589 && year < 1368) return 'early-modern';
  return 'modern';
}

/** 世纪分布类型 */
export interface CenturyDistribution {
  century: number;
  label: string;
  count: number;
  percentage: number;
  attackerWins: number;
  defenderWins: number;
}

/** 时代分布类型 */
export interface EraDistribution {
  era: EraGroup;
  label: string;
  count: number;
  percentage: number;
  attackerWins: number;
  defenderWins: number;
}

/** 战役高峰期类型 */
export interface PeakPeriod {
  century: number;
  label: string;
  count: number;
  description: string;
}

/** 时间洞察类型 */
export interface TimeInsight {
  type: 'century_distribution' | 'era_distribution' | 'peak_period' | 'century_outcome';
  title: string;
  description: string;
  data?: unknown;
}

/**
 * 获取世纪分布
 */
export function getCenturyDistribution(battles: Event[]): CenturyDistribution[] {
  const centuryCounts = new Map<number, { count: number; attackerWins: number; defenderWins: number }>();

  battles.forEach(battle => {
    const century = getBattleCentury(battle);
    const current = centuryCounts.get(century) || { count: 0, attackerWins: 0, defenderWins: 0 };
    current.count++;
    
    if (battle.battle?.result === 'attacker_win') current.attackerWins++;
    else if (battle.battle?.result === 'defender_win') current.defenderWins++;
    
    centuryCounts.set(century, current);
  });

  const total = battles.length;
  const distributions: CenturyDistribution[] = [];

  centuryCounts.forEach((value, century) => {
    distributions.push({
      century,
      label: getCenturyLabel(century),
      count: value.count,
      percentage: Math.round((value.count / total) * 1000) / 10,
      attackerWins: value.attackerWins,
      defenderWins: value.defenderWins,
    });
  });

  return distributions.sort((a, b) => b.count - a.count);
}

/**
 * 获取时代分布
 */
export function getEraDistribution(battles: Event[]): EraDistribution[] {
  const eraCounts = new Map<EraGroup, { count: number; attackerWins: number; defenderWins: number }>();

  battles.forEach(battle => {
    const era = getBattleEraGroup(battle);
    const current = eraCounts.get(era) || { count: 0, attackerWins: 0, defenderWins: 0 };
    current.count++;
    
    if (battle.battle?.result === 'attacker_win') current.attackerWins++;
    else if (battle.battle?.result === 'defender_win') current.defenderWins++;
    
    eraCounts.set(era, current);
  });

  const total = battles.length;
  const distributions: EraDistribution[] = [];
  const eraOrder: EraGroup[] = ['ancient', 'spring-autumn', 'warring-states', 'imperial', 'medieval', 'early-modern', 'modern'];

  eraOrder.forEach(era => {
    const value = eraCounts.get(era);
    if (value && value.count > 0) {
      distributions.push({
        era,
        label: getEraGroupLabel(era),
        count: value.count,
        percentage: Math.round((value.count / total) * 1000) / 10,
        attackerWins: value.attackerWins,
        defenderWins: value.defenderWins,
      });
    }
  });

  return distributions;
}

/**
 * 获取战役高峰期
 */
export function getPeakPeriods(battles: Event[], limit: number = 3): PeakPeriod[] {
  const distribution = getCenturyDistribution(battles);
  
  // 按战役数量排序，取前N个
  const sorted = [...distribution].sort((a, b) => b.count - a.count).slice(0, limit);
  
  return sorted.map(item => {
    let description = '';
    if (item.century <= 10) {
      description = `公元前${item.century}世纪是中国历史上战役最密集的时期之一`;
    } else if (item.century <= 20) {
      description = `公元${item.century}世纪见证了大量战役`;
    }
    
    return {
      century: item.century,
      label: item.label,
      count: item.count,
      description,
    };
  });
}

/**
 * 获取世纪与胜负关联
 */
export function getCenturyOutcomeCorrelation(battles: Event[]): CenturyDistribution[] {
  return getCenturyDistribution(battles);
}

/**
 * 获取时代与类型关联
 */
export function getEraTypeCorrelation(battles: Event[]): { era: EraGroup; eraLabel: string; battleType: BattleType; count: number }[] {
  const correlation: { era: EraGroup; eraLabel: string; battleType: BattleType; count: number }[] = [];
  const eraTypeCounts = new Map<string, number>();

  battles.forEach(battle => {
    const era = getBattleEraGroup(battle);
    const battleType = battle.battle?.battleType;
    if (!battleType) return;

    const key = `${era}-${battleType}`;
    const current = eraTypeCounts.get(key) || 0;
    eraTypeCounts.set(key, current + 1);
  });

  eraTypeCounts.forEach((count, key) => {
    const [eraStr, battleType] = key.split('-') as [EraGroup, BattleType];
    correlation.push({
      era: eraStr,
      eraLabel: getEraGroupLabel(eraStr),
      battleType,
      count,
    });
  });

  return correlation.sort((a, b) => b.count - a.count);
}

/**
 * 获取时间分布洞察
 */
export function getTimeDistributionInsights(battles: Event[]): TimeInsight[] {
  const insights: TimeInsight[] = [];
  
  // 世纪分布洞察
  const centuryDist = getCenturyDistribution(battles);
  if (centuryDist.length > 0) {
    const topCentury = centuryDist[0];
    insights.push({
      type: 'century_distribution',
      title: '战役世纪分布',
      description: `${topCentury.label}战役数量最多，共${topCentury.count}场，占总数的${topCentury.percentage}%。`,
      data: topCentury,
    });
  }

  // 时代分布洞察
  const eraDist = getEraDistribution(battles);
  if (eraDist.length > 0) {
    const topEra = eraDist[0];
    insights.push({
      type: 'era_distribution',
      title: '战役时代分布',
      description: `${topEra.label}时期战役最为频繁，共有${topEra.count}场战役记录。`,
      data: topEra,
    });
  }

  // 高峰期洞察
  const peaks = getPeakPeriods(battles, 1);
  if (peaks.length > 0) {
    const peak = peaks[0];
    insights.push({
      type: 'peak_period',
      title: '战役高峰期',
      description: `${peak.label}是中国历史上战役最高发的时期，共发生${peak.count}场战役。`,
      data: peak,
    });
  }

  return insights;
}

/**
 * 获取完整时间分布摘要
 */
export interface TimeDistributionSummary {
  totalBattles: number;
  centuryDistribution: CenturyDistribution[];
  eraDistribution: EraDistribution[];
  peakPeriods: PeakPeriod[];
  insights: TimeInsight[];
}

export function getTimeDistributionSummary(battles: Event[]): TimeDistributionSummary {
  return {
    totalBattles: battles.length,
    centuryDistribution: getCenturyDistribution(battles),
    eraDistribution: getEraDistribution(battles),
    peakPeriods: getPeakPeriods(battles, 3),
    insights: getTimeDistributionInsights(battles),
  };
}
