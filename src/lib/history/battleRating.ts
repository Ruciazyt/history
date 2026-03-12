/**
 * 战役综合评分模块
 * 基于多个维度为战役生成综合评分和排名
 */

import { Event, BattleImpact, BattleScale, BattleDurationCategory } from './types';

/** 综合评分维度权重配置 */
export interface RatingWeights {
  scale: number;        // 规模权重
  impact: number;       // 影响力权重
  duration: number;    // 持续时间权重
  casualties: number;  // 伤亡权重
  turningPoints: number; // 转折点权重
  strategic: number;    // 战略重要性权重
}

/** 默认权重配置 */
export const DEFAULT_WEIGHTS: RatingWeights = {
  scale: 0.20,
  impact: 0.25,
  duration: 0.10,
  casualties: 0.15,
  turningPoints: 0.15,
  strategic: 0.15,
};

/** 单个战役评分详情 */
export interface BattleRatingDetail {
  battle: Event;
  /** 综合评分 (0-100) */
  overallScore: number;
  /** 各维度评分 */
  dimensionScores: {
    scale: number;       // 0-100
    impact: number;      // 0-100
    duration: number;    // 0-100
    casualties: number; // 0-100
    turningPoints: number; // 0-100
    strategic: number;   // 0-100
  };
  /** 综合等级 */
  rating: 'S' | 'A' | 'B' | 'C' | 'D' | 'unknown';
  /** 排名 */
  rank: number;
  /** 评分亮点 */
  highlights: string[];
  /** 评分弱点 */
  weaknesses: string[];
}

/** 排名摘要 */
export interface RatingSummary {
  totalBattles: number;
  topBattles: BattleRatingDetail[];
  averageScore: number;
  scoreDistribution: {
    S: number;
    A: number;
    B: number;
    C: number;
    D: number;
  };
  ratingInsights: string[];
}

/** 规模分数映射 */
const SCORE_MAP: Record<BattleScale, number> = {
  massive: 100,
  large: 75,
  medium: 50,
  small: 25,
  unknown: 0,
};

/** 影响力分数映射 */
const IMPACT_SCORE_MAP: Record<BattleImpact, number> = {
  decisive: 100,
  major: 70,
  minor: 40,
  unknown: 0,
};

/** 持续时间分类分数映射 */
const DURATION_SCORE_MAP: Record<BattleDurationCategory, number> = {
  protracted: 100,   // 持久战往往规模较大
  extended: 75,
  medium: 50,
  short: 25,
  daily: 15,
  unknown: 0,
};

/**
 * 获取战役规模分数
 */
function getScaleScore(battle: Event): number {
  const scale = battle.battle?.scale || 'unknown';
  return SCORE_MAP[scale] || 0;
}

/**
 * 获取战役影响力分数
 */
function getImpactScore(battle: Event): number {
  const impact = battle.battle?.impact || 'unknown';
  return IMPACT_SCORE_MAP[impact] || 0;
}

/**
 * 获取战役持续时间分数
 */
function getDurationScore(battle: Event): number {
  const duration = battle.battle?.duration;
  if (!duration) return 0;
  
  // 超过30天为持久战
  if (duration >= 30) return DURATION_SCORE_MAP.protracted;
  if (duration >= 8) return DURATION_SCORE_MAP.extended;
  if (duration >= 4) return DURATION_SCORE_MAP.medium;
  if (duration >= 1) return DURATION_SCORE_MAP.short;
  return DURATION_SCORE_MAP.daily;
}

/**
 * 获取战役伤亡分数
 * 基于伤亡人数规模估算
 */
function getCasualtiesScore(battle: Event): number {
  const casualties = battle.battle?.casualties;
  if (!casualties) return 0;
  
  const attacker = casualties.attacker || 0;
  const defender = casualties.defender || 0;
  const total = attacker + defender;
  
  // 伤亡人数分级
  if (total >= 200000) return 100;  // 20万+
  if (total >= 100000) return 85;   // 10万+
  if (total >= 50000) return 70;    // 5万+
  if (total >= 20000) return 55;    // 2万+
  if (total >= 10000) return 40;    // 1万+
  if (total >= 5000) return 25;     // 5000+
  if (total > 0) return 10;          // 有伤亡但较少
  return 0;
}

/**
 * 获取转折点分数
 * 转折点越多，说明战役越复杂越激烈
 */
function getTurningPointsScore(battle: Event): number {
  const turningPoints = battle.battle?.turningPoints;
  if (!turningPoints || turningPoints.length === 0) return 0;
  
  const count = turningPoints.length;
  if (count >= 5) return 100;
  if (count >= 4) return 80;
  if (count >= 3) return 60;
  if (count >= 2) return 40;
  return 20;
}

/**
 * 获取战略重要性分数
 * 基于战役类型、是否有指挥官、是否有联盟等因素综合判断
 */
function getStrategicScore(battle: Event): number {
  // 首先检查是否有战役数据
  if (!battle.battle) return 0;
  
  let score = 0;
  
  // 战役类型分数
  const battleType = battle.battle?.battleType;
  if (battleType === 'unification' || battleType === 'founding') {
    score += 40;  // 统一/开国之战最重要
  } else if (battleType === 'conquest' || battleType === 'civil-war') {
    score += 30;
  } else if (battleType === 'invasion' || battleType === 'defense') {
    score += 25;
  } else if (battleType === 'rebellion' || battleType === 'frontier') {
    score += 15;
  } else {
    score += 10;
  }
  
  // 指挥官分数
  const commanders = battle.battle?.commanders;
  if (commanders?.attacker?.length || commanders?.defender?.length) {
    score += 20;  // 有指挥官的战役更有战略意义
  }
  
  // 联盟分数
  if (battle.battle?.alliance) {
    score += 15;  // 涉及联盟的战役更有战略意义
  }
  
  // 后果分数
  const aftermath = battle.battle?.aftermath;
  if (aftermath && aftermath.length > 0) {
    score += 15;
    // 有重大后果的额外加分
    const hasMajor = aftermath.some(a => a.severity === 'massive' || a.severity === 'significant');
    if (hasMajor) score += 10;
  }
  
  return Math.min(score, 100);
}

/**
 * 计算单场战役的综合评分
 */
export function calculateBattleRating(
  battle: Event,
  weights: RatingWeights = DEFAULT_WEIGHTS
): BattleRatingDetail {
  const dimensionScores = {
    scale: getScaleScore(battle),
    impact: getImpactScore(battle),
    duration: getDurationScore(battle),
    casualties: getCasualtiesScore(battle),
    turningPoints: getTurningPointsScore(battle),
    strategic: getStrategicScore(battle),
  };
  
  // 计算加权总分
  const overallScore = Math.round(
    dimensionScores.scale * weights.scale +
    dimensionScores.impact * weights.impact +
    dimensionScores.duration * weights.duration +
    dimensionScores.casualties * weights.casualties +
    dimensionScores.turningPoints * weights.turningPoints +
    dimensionScores.strategic * weights.strategic
  );
  
  // 确定等级
  let rating: 'S' | 'A' | 'B' | 'C' | 'D' | 'unknown';
  if (overallScore >= 90) rating = 'S';
  else if (overallScore >= 75) rating = 'A';
  else if (overallScore >= 60) rating = 'B';
  else if (overallScore >= 40) rating = 'C';
  else if (overallScore > 0) rating = 'D';
  else rating = 'unknown';
  
  // 生成亮点和弱点
  const highlights: string[] = [];
  const weaknesses: string[] = [];
  
  if (dimensionScores.scale >= 75) highlights.push('规模宏大');
  else if (dimensionScores.scale < 25 && dimensionScores.scale > 0) weaknesses.push('规模较小');
  
  if (dimensionScores.impact >= 70) highlights.push('影响深远');
  else if (dimensionScores.impact < 40 && dimensionScores.impact > 0) weaknesses.push('影响有限');
  
  if (dimensionScores.turningPoints >= 60) highlights.push('过程跌宕');
  if (dimensionScores.casualties >= 70) highlights.push('伤亡惨烈');
  if (dimensionScores.duration >= 75) highlights.push('旷日持久');
  if (dimensionScores.strategic >= 60) highlights.push('战略意义重大');
  
  if (dimensionScores.turningPoints === 0) weaknesses.push('缺乏转折点');
  if (dimensionScores.casualties === 0) weaknesses.push('伤亡数据缺失');
  if (dimensionScores.duration === 0) weaknesses.push('持续时间未知');
  
  return {
    battle,
    overallScore,
    dimensionScores,
    rating,
    rank: 0,
    highlights,
    weaknesses,
  };
}

/**
 * 为所有战役计算评分并排名
 */
export function calculateAllRatings(
  battles: Event[],
  weights: RatingWeights = DEFAULT_WEIGHTS
): BattleRatingDetail[] {
  const ratings = battles
    .filter(b => b.battle)  // 只处理战役
    .map(b => calculateBattleRating(b, weights));
  
  // 按分数降序排序并设置排名
  ratings.sort((a, b) => b.overallScore - a.overallScore);
  ratings.forEach((r, i) => {
    r.rank = i + 1;
  });
  
  return ratings;
}

/**
 * 获取排名前N的战役
 */
export function getTopRatedBattles(
  battles: Event[],
  n: number = 10,
  weights: RatingWeights = DEFAULT_WEIGHTS
): BattleRatingDetail[] {
  const ratings = calculateAllRatings(battles, weights);
  return ratings.slice(0, n);
}

/**
 * 获取特定等级的战役
 */
export function getBattlesByRating(
  battles: Event[],
  rating: 'S' | 'A' | 'B' | 'C' | 'D',
  weights: RatingWeights = DEFAULT_WEIGHTS
): BattleRatingDetail[] {
  const ratings = calculateAllRatings(battles, weights);
  return ratings.filter(r => r.rating === rating);
}

/**
 * 获取战役评分摘要
 */
export function getRatingSummary(
  battles: Event[],
  weights: RatingWeights = DEFAULT_WEIGHTS
): RatingSummary {
  const ratings = calculateAllRatings(battles, weights);
  
  if (ratings.length === 0) {
    return {
      totalBattles: 0,
      topBattles: [],
      averageScore: 0,
      scoreDistribution: { S: 0, A: 0, B: 0, C: 0, D: 0 },
      ratingInsights: [],
    };
  }
  
  // 计算平均分
  const totalScore = ratings.reduce((sum, r) => sum + r.overallScore, 0);
  const averageScore = Math.round(totalScore / ratings.length);
  
  // 分数分布
  const distribution = {
    S: ratings.filter(r => r.rating === 'S').length,
    A: ratings.filter(r => r.rating === 'A').length,
    B: ratings.filter(r => r.rating === 'B').length,
    C: ratings.filter(r => r.rating === 'C').length,
    D: ratings.filter(r => r.rating === 'D').length,
  };
  
  // 生成洞察
  const insights: string[] = [];
  
  if (distribution.S > 0) {
    const sBattles = ratings.filter(r => r.rating === 'S');
    insights.push(`共有 ${distribution.S} 场S级战役，最著名的是${sBattles[0].battle.titleKey}（评分${sBattles[0].overallScore}）`);
  }
  
  if (distribution.A > 0) {
    insights.push(`A 级战役共 ${distribution.A} 场，这些战役在历史上具有重大意义`);
  }
  
  if (averageScore >= 60) {
    insights.push(`整体战役平均评分为${averageScore}分，整体水平较高`);
  } else if (averageScore >= 40) {
    insights.push(`整体战役平均评分为${averageScore}分，处于中等水平`);
  } else {
    insights.push(`整体战役平均评分为${averageScore}分，部分战役数据待完善`);
  }
  
  // 找出最强项和最弱项
  const dimensionAvgs = {
    scale: ratings.reduce((sum, r) => sum + r.dimensionScores.scale, 0) / ratings.length,
    impact: ratings.reduce((sum, r) => sum + r.dimensionScores.impact, 0) / ratings.length,
    duration: ratings.reduce((sum, r) => sum + r.dimensionScores.duration, 0) / ratings.length,
    casualties: ratings.reduce((sum, r) => sum + r.dimensionScores.casualties, 0) / ratings.length,
    turningPoints: ratings.reduce((sum, r) => sum + r.dimensionScores.turningPoints, 0) / ratings.length,
    strategic: ratings.reduce((sum, r) => sum + r.dimensionScores.strategic, 0) / ratings.length,
  };
  
  const sortedDims = Object.entries(dimensionAvgs).sort((a, b) => b[1] - a[1]);
  const strongest = sortedDims[0];
  const weakest = sortedDims[sortedDims.length - 1];
  
  const dimNames: Record<string, string> = {
    scale: '规模',
    impact: '影响力',
    duration: '持续时间',
    casualties: '伤亡数据',
    turningPoints: '转折点',
    strategic: '战略意义',
  };
  
  insights.push(`数据最完善的维度是${dimNames[strongest[0]]}（平均${Math.round(strongest[1])}分），最需完善的是${dimNames[weakest[0]]}（平均${Math.round(weakest[1])}分）`);
  
  return {
    totalBattles: ratings.length,
    topBattles: ratings.slice(0, 10),
    averageScore,
    scoreDistribution: distribution,
    ratingInsights: insights,
  };
}

/**
 * 对比两场战役的评分
 */
export function compareBattleRatings(
  battle1: Event,
  battle2: Event,
  weights: RatingWeights = DEFAULT_WEIGHTS
): {
  winner: BattleRatingDetail | null;
  comparison: {
    dimension: string;
    score1: number;
    score2: number;
    winner: 1 | 2 | 0;
  }[];
} {
  const rating1 = calculateBattleRating(battle1, weights);
  const rating2 = calculateBattleRating(battle2, weights);
  
  const dimensionNames: Record<string, string> = {
    scale: '规模',
    impact: '影响力',
    duration: '持续时间',
    casualties: '伤亡',
    turningPoints: '转折点',
    strategic: '战略意义',
  };
  
  const comparison = Object.keys(rating1.dimensionScores).map(key => {
    const score1 = rating1.dimensionScores[key as keyof typeof rating1.dimensionScores];
    const score2 = rating2.dimensionScores[key as keyof typeof rating2.dimensionScores];
    let winner: 1 | 2 | 0 = 0;
    if (score1 > score2) winner = 1;
    else if (score2 > score1) winner = 2;
    
    return {
      dimension: dimensionNames[key] || key,
      score1,
      score2,
      winner,
    };
  });
  
  return {
    winner: rating1.overallScore > rating2.overallScore ? rating1 : 
            rating2.overallScore > rating1.overallScore ? rating2 : null,
    comparison,
  };
}

/**
 * 检查是否有足够的评分数据
 */
export function hasRatingData(battles: Event[]): boolean {
  return battles.some(b => b.battle && (
    b.battle.scale ||
    b.battle.impact ||
    b.battle.duration ||
    b.battle.casualties ||
    b.battle.turningPoints ||
    b.battle.battleType ||
    b.battle.commanders
  ));
}
