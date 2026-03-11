import type { Event, BattleType, BattleImpact, BattleScale } from './types';

/**
 * 战役对比分析模块
 * 提供战役之间的对比功能，分析相似度和差异
 */

export type ComparisonDimension = 
  | 'year'
  | 'season'
  | 'region'
  | 'parties'
  | 'result'
  | 'type'
  | 'scale'
  | 'impact'
  | 'commanders';

export type BattleComparisonResult = {
  dimension: ComparisonDimension;
  battle1: string;
  battle2: string;
  isMatch: boolean;
  similarity: number; // 0-1
};

/**
 * 季节枚举
 */
type Season = 'spring' | 'summer' | 'autumn' | 'winter' | 'unknown';

/**
 * 从月份获取季节
 */
function getSeason(month?: number): Season {
  if (!month) return 'unknown';
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

/**
 * 提取战役所在区域（基于经纬度大致判断）
 */
function getRegion(location?: Event['location']): string {
  if (!location) return 'unknown';
  const { lon, lat } = location;
  
  // 中原地区
  if (lon >= 110 && lon <= 122 && lat >= 30 && lat <= 42) {
    return 'central-plains';
  }
  // 江东地区
  if (lon >= 118 && lon <= 122 && lat >= 28 && lat <= 33) {
    return 'jiangdong';
  }
  // 北方地区
  if (lon >= 110 && lon <= 125 && lat >= 38 && lat <= 45) {
    return 'north';
  }
  // 南方地区
  if (lon >= 105 && lon <= 122 && lat >= 20 && lat <= 30) {
    return 'south';
  }
  // 西北地区
  if (lon >= 75 && lon <= 110 && lat >= 35 && lat <= 48) {
    return 'northwest';
  }
  // 西南地区
  if (lon >= 97 && lon <= 108 && lat >= 20 && lat <= 30) {
    return 'southwest';
  }
  return 'other';
}

/**
 * 比较两个战役的指定维度
 */
export function compareBattleDimension(
  battle1: Event,
  battle2: Event,
  dimension: ComparisonDimension
): BattleComparisonResult {
  let battle1Value: string;
  let battle2Value: string;
  let isMatch = false;
  let similarity = 0;

  switch (dimension) {
    case 'year':
      battle1Value = battle1.year.toString();
      battle2Value = battle2.year.toString();
      // 计算年份差异的相似度
      const yearDiff = Math.abs(battle1.year - battle2.year);
      if (yearDiff === 0) {
        isMatch = true;
        similarity = 1;
      } else if (yearDiff <= 50) {
        similarity = 0.8;
      } else if (yearDiff <= 100) {
        similarity = 0.5;
      } else if (yearDiff <= 200) {
        similarity = 0.3;
      } else {
        similarity = 0;
      }
      break;

    case 'season':
      battle1Value = getSeason(battle1.month) || 'unknown';
      battle2Value = getSeason(battle2.month) || 'unknown';
      isMatch = battle1Value === battle2Value;
      similarity = isMatch ? 1 : 0;
      break;

    case 'region':
      battle1Value = getRegion(battle1.location);
      battle2Value = getRegion(battle2.location);
      isMatch = battle1Value === battle2Value;
      similarity = isMatch ? 1 : 0;
      break;

    case 'parties':
      const parties1 = [
        battle1.battle?.belligerents?.attacker,
        battle1.battle?.belligerents?.defender,
      ].filter(Boolean) as string[];
      const parties2 = [
        battle2.battle?.belligerents?.attacker,
        battle2.battle?.belligerents?.defender,
      ].filter(Boolean) as string[];
      
      // 计算 parties 相似度
      const common1 = parties1.filter(p => parties2.some(p2 => p.includes(p2) || p2.includes(p)));
      const common2 = parties2.filter(p => parties1.some(p1 => p.includes(p1) || p1.includes(p)));
      
      if (common1.length > 0 || common2.length > 0) {
        const totalUnique = new Set([...parties1, ...parties2]).size;
        similarity = (common1.length + common2.length) / (2 * totalUnique);
        isMatch = similarity >= 0.5;
      } else {
        similarity = 0;
        isMatch = false;
      }
      
      battle1Value = parties1.join(' vs ');
      battle2Value = parties2.join(' vs ');
      break;

    case 'result':
      battle1Value = battle1.battle?.result || 'unknown';
      battle2Value = battle2.battle?.result || 'unknown';
      isMatch = battle1Value === battle2Value;
      similarity = isMatch ? 1 : 0;
      break;

    case 'type':
      battle1Value = battle1.battle?.battleType || 'unknown';
      battle2Value = battle2.battle?.battleType || 'unknown';
      isMatch = battle1Value === battle2Value;
      similarity = isMatch ? 1 : 0;
      break;

    case 'scale':
      battle1Value = battle1.battle?.scale || 'unknown';
      battle2Value = battle2.battle?.scale || 'unknown';
      isMatch = battle1Value === battle2Value;
      similarity = isMatch ? 1 : 0;
      break;

    case 'impact':
      battle1Value = battle1.battle?.impact || 'unknown';
      battle2Value = battle2.battle?.impact || 'unknown';
      isMatch = battle1Value === battle2Value;
      similarity = isMatch ? 1 : 0;
      break;

    case 'commanders':
      const commanders1 = [
        ...(battle1.battle?.commanders?.attacker || []),
        ...(battle1.battle?.commanders?.defender || []),
      ];
      const commanders2 = [
        ...(battle2.battle?.commanders?.attacker || []),
        ...(battle2.battle?.commanders?.defender || []),
      ];
      
      if (commanders1.length > 0 && commanders2.length > 0) {
        const common = commanders1.filter(c => 
          commanders2.some(c2 => c.includes(c2) || c2.includes(c))
        );
        const totalUnique = new Set([...commanders1, ...commanders2]).size;
        similarity = common.length / totalUnique;
        isMatch = similarity >= 0.3;
      } else {
        similarity = 0;
        isMatch = false;
      }
      
      battle1Value = commanders1.join(', ') || 'unknown';
      battle2Value = commanders2.join(', ') || 'unknown';
      break;

    default:
      battle1Value = 'unknown';
      battle2Value = 'unknown';
  }

  return {
    dimension,
    battle1: battle1Value,
    battle2: battle2Value,
    isMatch,
    similarity,
  };
}

/**
 * 对比两个战役的多个维度
 */
export function compareBattles(
  battle1: Event,
  battle2: Event,
  dimensions?: ComparisonDimension[]
): BattleComparisonResult[] {
  const defaultDimensions: ComparisonDimension[] = [
    'year',
    'season',
    'region',
    'parties',
    'result',
    'type',
    'scale',
    'impact',
    'commanders',
  ];
  
  const dims = dimensions || defaultDimensions;
  return dims.map(d => compareBattleDimension(battle1, battle2, d));
}

/**
 * 计算两个战役的整体相似度
 */
export function getBattleSimilarity(battle1: Event, battle2: Event): number {
  const comparisons = compareBattles(battle1, battle2);
  const totalSimilarity = comparisons.reduce((sum, c) => sum + c.similarity, 0);
  return totalSimilarity / comparisons.length;
}

/**
 * 获取最相似的战役
 */
export function findSimilarBattles(
  targetBattle: Event,
  allBattles: Event[],
  limit = 5
): Array<{ battle: Event; similarity: number }> {
  const results = allBattles
    .filter(b => b.id !== targetBattle.id)
    .map(battle => ({
      battle,
      similarity: getBattleSimilarity(targetBattle, battle),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
  
  return results;
}

/**
 * 生成对比洞察
 */
export function getBattleComparisonInsights(
  battle1: Event,
  battle2: Event
): string[] {
  const insights: string[] = [];
  const comparisons = compareBattles(battle1, battle2);
  
  // 查找匹配的维度
  const matchingDims = comparisons.filter(c => c.isMatch);
  const differentDims = comparisons.filter(c => !c.isMatch);
  
  // 相似点
  if (matchingDims.length > 0) {
    const dimLabels: Record<ComparisonDimension, string> = {
      year: '年代',
      season: '季节',
      region: '地域',
      parties: '参战方',
      result: '结果',
      type: '类型',
      scale: '规模',
      impact: '影响力',
      commanders: '指挥官',
    };
    
    const matchLabels = matchingDims.map(c => dimLabels[c.dimension]);
    insights.push(`两场战役的相同点：${matchLabels.join('、')}`);
  }
  
  // 时间差异
  const yearComparison = comparisons.find(c => c.dimension === 'year');
  if (yearComparison) {
    const yearDiff = Math.abs(battle1.year - battle2.year);
    if (yearDiff > 0) {
      const earlier = battle1.year < battle2.year ? battle1.titleKey : battle2.titleKey;
      insights.push(`时间相差约 ${yearDiff} 年`);
    }
  }
  
  // 结果对比
  const resultComparison = comparisons.find(c => c.dimension === 'result');
  if (resultComparison && !resultComparison.isMatch) {
    const labels: Record<string, string> = {
      attacker_win: '进攻方胜利',
      defender_win: '防守方胜利',
      draw: '平局',
      inconclusive: '胜负未明',
      unknown: '未知',
    };
    insights.push(`${labels[resultComparison.battle1]} vs ${labels[resultComparison.battle2]}`);
  }
  
  // 规模对比
  const scaleComparison = comparisons.find(c => c.dimension === 'scale');
  if (scaleComparison && !scaleComparison.isMatch) {
    insights.push(`规模：${scaleComparison.battle1} vs ${scaleComparison.battle2}`);
  }
  
  // 整体相似度
  const overallSimilarity = getBattleSimilarity(battle1, battle2);
  if (overallSimilarity >= 0.7) {
    insights.push('整体相似度较高');
  } else if (overallSimilarity >= 0.4) {
    insights.push('整体相似度中等');
  } else {
    insights.push('整体差异较大');
  }
  
  return insights;
}

/**
 * 获取两个战役的基本对比信息
 */
export function getBattleComparisonSummary(
  battle1: Event,
  battle2: Event
): {
  battle1Title: string;
  battle2Title: string;
  battle1Year: number;
  battle2Year: number;
  yearDiff: number;
  similarity: number;
  matchingDimensions: number;
  totalDimensions: number;
} {
  const comparisons = compareBattles(battle1, battle2);
  const matchingCount = comparisons.filter(c => c.isMatch).length;
  
  return {
    battle1Title: battle1.titleKey,
    battle2Title: battle2.titleKey,
    battle1Year: battle1.year,
    battle2Year: battle2.year,
    yearDiff: Math.abs(battle1.year - battle2.year),
    similarity: getBattleSimilarity(battle1, battle2),
    matchingDimensions: matchingCount,
    totalDimensions: comparisons.length,
  };
}

/**
 * 检查是否有指挥官数据
 */
export function hasCommanderComparisonData(battles: Event[]): boolean {
  return battles.some(b => 
    b.battle?.commanders?.attacker?.length || 
    b.battle?.commanders?.defender?.length
  );
}
