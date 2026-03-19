import type { BattlePacing, BattleTimeOfDay, Event } from './types';
import { getBattles } from './battles';

/**
 * 获取战役节奏标签（中文）
 */
export function getPacingLabel(pacing?: BattlePacing): string {
  if (!pacing) return '';
  const labels: Record<string, string> = {
    surprise: '突袭战',
    rapid: '快速决战',
    extended: '持久战',
    siege: '围城战',
    unknown: '未知',
  };
  return labels[pacing] || '';
}

/**
 * 获取战役时间段标签（中文）
 */
export function getTimeOfDayLabel(timeOfDay?: BattleTimeOfDay): string {
  if (!timeOfDay) return '';
  const labels: Record<string, string> = {
    dawn: '黎明',
    morning: '上午',
    afternoon: '下午',
    evening: '傍晚',
    night: '夜间',
    unknown: '未知',
  };
  return labels[timeOfDay] || '';
}

/**
 * 检查是否有战役节奏数据
 */
export function hasPacingData(events: Event[]): boolean {
  const battles = getBattles(events);
  return battles.some(b => b.battle?.pacing && b.battle.pacing !== 'unknown');
}

/**
 * 检查是否有战役时间段数据
 */
export function hasTimeOfDayData(events: Event[]): boolean {
  const battles = getBattles(events);
  return battles.some(b => b.battle?.timeOfDay && b.battle.timeOfDay !== 'unknown');
}

/**
 * 战役节奏统计类型
 */
export type PacingStats = {
  pacing: BattlePacing;
  label: string;
  totalBattles: number;
  attackerWins: number;
  defenderWins: number;
  draws: number;
  inconclusive: number;
  attackerWinRate: number;
  defenderWinRate: number;
};

/**
 * 获取特定节奏的战役统计
 */
export function getPacingStats(events: Event[], pacing: BattlePacing): PacingStats {
  const battles = getBattles(events);
  const filteredBattles = battles.filter(b => b.battle?.pacing === pacing);
  
  let attackerWins = 0;
  let defenderWins = 0;
  let draws = 0;
  let inconclusive = 0;
  
  for (const battle of filteredBattles) {
    const result = battle.battle?.result;
    if (result === 'attacker_win') attackerWins++;
    else if (result === 'defender_win') defenderWins++;
    else if (result === 'draw') draws++;
    else inconclusive++;
  }
  
  const total = filteredBattles.length;
  const attackerWinRate = total > 0 ? attackerWins / total : 0;
  const defenderWinRate = total > 0 ? defenderWins / total : 0;
  
  return {
    pacing,
    label: getPacingLabel(pacing),
    totalBattles: total,
    attackerWins,
    defenderWins,
    draws,
    inconclusive,
    attackerWinRate,
    defenderWinRate,
  };
}

/**
 * 获取所有战役节奏统计
 */
export function getAllPacingStats(events: Event[]): PacingStats[] {
  const pacings: BattlePacing[] = ['surprise', 'rapid', 'extended', 'siege', 'unknown'];
  return pacings
    .map(pacing => getPacingStats(events, pacing))
    .filter(stats => stats.totalBattles > 0);
}

/**
 * 战役时间段统计类型
 */
export type TimeOfDayStats = {
  timeOfDay: BattleTimeOfDay;
  label: string;
  totalBattles: number;
  attackerWins: number;
  defenderWins: number;
  draws: number;
  inconclusive: number;
  attackerWinRate: number;
  defenderWinRate: number;
};

/**
 * 获取特定时间段的战役统计
 */
export function getTimeOfDayStats(events: Event[], timeOfDay: BattleTimeOfDay): TimeOfDayStats {
  const battles = getBattles(events);
  const filteredBattles = battles.filter(b => b.battle?.timeOfDay === timeOfDay);
  
  let attackerWins = 0;
  let defenderWins = 0;
  let draws = 0;
  let inconclusive = 0;
  
  for (const battle of filteredBattles) {
    const result = battle.battle?.result;
    if (result === 'attacker_win') attackerWins++;
    else if (result === 'defender_win') defenderWins++;
    else if (result === 'draw') draws++;
    else inconclusive++;
  }
  
  const total = filteredBattles.length;
  const attackerWinRate = total > 0 ? attackerWins / total : 0;
  const defenderWinRate = total > 0 ? defenderWins / total : 0;
  
  return {
    timeOfDay,
    label: getTimeOfDayLabel(timeOfDay),
    totalBattles: total,
    attackerWins,
    defenderWins,
    draws,
    inconclusive,
    attackerWinRate,
    defenderWinRate,
  };
}

/**
 * 获取所有战役时间段统计
 */
export function getAllTimeOfDayStats(events: Event[]): TimeOfDayStats[] {
  const times: BattleTimeOfDay[] = ['dawn', 'morning', 'afternoon', 'evening', 'night', 'unknown'];
  return times
    .map(time => getTimeOfDayStats(events, time))
    .filter(stats => stats.totalBattles > 0);
}

/**
 * 获取使用特定节奏的战役列表
 */
export function getBattlesByPacing(events: Event[], pacing: BattlePacing): Event[] {
  const battles = getBattles(events);
  return battles.filter(b => b.battle?.pacing === pacing);
}

/**
 * 获取在特定时间段发生的战役列表
 */
export function getBattlesByTimeOfDay(events: Event[], timeOfDay: BattleTimeOfDay): Event[] {
  const battles = getBattles(events);
  return battles.filter(b => b.battle?.timeOfDay === timeOfDay);
}

/**
 * 突袭战成功率分析
 */
export type SurpriseAnalysis = {
  totalSurpriseBattles: number;
  surpriseAttackerWins: number;
  surpriseDefenderWins: number;
  surpriseAttackerWinRate: number;
  surpriseDefenderWinRate: number;
  mostSuccessfulPacing: BattlePacing | null;
  mostSuccessfulPacingWinRate: number;
};

/**
 * 获取突袭战分析
 */
export function getSurpriseAnalysis(events: Event[]): SurpriseAnalysis {
  const surpriseBattles = getBattlesByPacing(events, 'surprise');
  
  let surpriseAttackerWins = 0;
  let surpriseDefenderWins = 0;
  
  for (const battle of surpriseBattles) {
    const result = battle.battle?.result;
    if (result === 'attacker_win') surpriseAttackerWins++;
    else if (result === 'defender_win') surpriseDefenderWins++;
  }
  
  const total = surpriseBattles.length;
  
  // 找出最成功的作战节奏
  const allStats = getAllPacingStats(events).filter(s => s.pacing !== 'unknown');
  let mostSuccessfulPacing: BattlePacing | null = null;
  let mostSuccessfulPacingWinRate = 0;
  
  for (const stat of allStats) {
    if (stat.totalBattles >= 2 && stat.attackerWinRate > mostSuccessfulPacingWinRate) {
      mostSuccessfulPacingWinRate = stat.attackerWinRate;
      mostSuccessfulPacing = stat.pacing;
    }
  }
  
  return {
    totalSurpriseBattles: total,
    surpriseAttackerWins,
    surpriseDefenderWins,
    surpriseAttackerWinRate: total > 0 ? surpriseAttackerWins / total : 0,
    surpriseDefenderWinRate: total > 0 ? surpriseDefenderWins / total : 0,
    mostSuccessfulPacing,
    mostSuccessfulPacingWinRate,
  };
}

/**
 * 生成战役节奏分析洞察
 */
export function getPacingInsights(events: Event[]): string[] {
  const insights: string[] = [];
  const allStats = getAllPacingStats(events).filter(s => s.pacing !== 'unknown');
  
  if (allStats.length === 0) return insights;
  
  // 找出最常见的作战节奏
  const sortedByCount = [...allStats].sort((a, b) => b.totalBattles - a.totalBattles);
  const mostCommon = sortedByCount[0];
  if (mostCommon) {
    insights.push(`最常见的作战节奏是${mostCommon.label}，共${mostCommon.totalBattles}场战役。`);
  }
  
  // 找出进攻方胜率最高的节奏
  const sortedByAttackerWin = [...allStats].sort((a, b) => b.attackerWinRate - a.attackerWinRate);
  const bestAttackerPacing = sortedByAttackerWin[0];
  if (bestAttackerPacing && bestAttackerPacing.totalBattles >= 2) {
    insights.push(`进攻方在${bestAttackerPacing.label}中胜率最高，达到${(bestAttackerPacing.attackerWinRate * 100).toFixed(1)}%。`);
  }
  
  // 找出防守方胜率最高的节奏
  const sortedByDefenderWin = [...allStats].sort((a, b) => b.defenderWinRate - a.defenderWinRate);
  const bestDefenderPacing = sortedByDefenderWin[0];
  if (bestDefenderPacing && bestDefenderPacing.totalBattles >= 2) {
    insights.push(`防守方在${bestDefenderPacing.label}中表现最好，胜率达${(bestDefenderPacing.defenderWinRate * 100).toFixed(1)}%。`);
  }
  
  // 突袭战分析
  const surpriseStats = allStats.find(s => s.pacing === 'surprise');
  if (surpriseStats && surpriseStats.totalBattles >= 1) {
    if (surpriseStats.attackerWinRate > 0.5) {
      insights.push(`突袭战中进攻方占据明显优势，胜率达${(surpriseStats.attackerWinRate * 100).toFixed(1)}%。`);
    } else if (surpriseStats.defenderWinRate > 0.5) {
      insights.push(`尽管是突袭战，防守方仍有较高胜率(${surpriseStats.defenderWinRate * 100}%)，说明防守方准备充分。`);
    }
  }
  
  // 持久战分析
  const extendedStats = allStats.find(s => s.pacing === 'extended');
  if (extendedStats && extendedStats.totalBattles >= 1) {
    if (extendedStats.defenderWinRate > extendedStats.attackerWinRate) {
      insights.push(`持久战中防守方更具优势，胜率(防守方${(extendedStats.defenderWinRate * 100).toFixed(1)}% vs 进攻方${(extendedStats.attackerWinRate * 100).toFixed(1)}%)。`);
    }
  }
  
  return insights;
}

/**
 * 生成战役时间段分析洞察
 */
export function getTimeOfDayInsights(events: Event[]): string[] {
  const insights: string[] = [];
  const allStats = getAllTimeOfDayStats(events).filter(s => s.timeOfDay !== 'unknown');
  
  if (allStats.length === 0) return insights;
  
  // 找出最常见的作战时间段
  const sortedByCount = [...allStats].sort((a, b) => b.totalBattles - a.totalBattles);
  const mostCommon = sortedByCount[0];
  if (mostCommon) {
    insights.push(`大多数战役发生在${mostCommon.label}，共${mostCommon.totalBattles}场。`);
  }
  
  // 进攻方最佳时间段
  const sortedByAttackerWin = [...allStats].sort((a, b) => b.attackerWinRate - a.attackerWinRate);
  const bestAttackerTime = sortedByAttackerWin[0];
  if (bestAttackerTime && bestAttackerTime.totalBattles >= 2) {
    insights.push(`进攻方在${bestAttackerTime.label}发起攻击时胜率最高，达${(bestAttackerTime.attackerWinRate * 100).toFixed(1)}%。`);
  }
  
  // 夜战分析
  const nightStats = allStats.find(s => s.timeOfDay === 'night');
  if (nightStats && nightStats.totalBattles >= 1) {
    if (nightStats.attackerWinRate > 0.5) {
      insights.push(`夜战中进攻方表现出色，胜率${(nightStats.attackerWinRate * 100).toFixed(1)}%，说明夜袭是有效的战术。`);
    }
  }
  
  // 黎明/傍晚分析
  const dawnStats = allStats.find(s => s.timeOfDay === 'dawn');
  const eveningStats = allStats.find(s => s.timeOfDay === 'evening');
  if ((dawnStats || eveningStats) && (dawnStats?.totalBattles ?? 0) + (eveningStats?.totalBattles ?? 0) >= 1) {
    insights.push('黎明和傍晚时分的光线变化常被利用于发起突袭。');
  }
  
  return insights;
}

/**
 * 战役节奏摘要
 */
export type PacingSummary = {
  hasPacingData: boolean;
  hasTimeOfDayData: boolean;
  pacingStats: PacingStats[];
  timeOfDayStats: TimeOfDayStats[];
  pacingInsights: string[];
  timeOfDayInsights: string[];
  surpriseAnalysis: SurpriseAnalysis;
};

/**
 * 获取战役节奏完整摘要
 */
export function getPacingSummary(events: Event[]): PacingSummary {
  return {
    hasPacingData: hasPacingData(events),
    hasTimeOfDayData: hasTimeOfDayData(events),
    pacingStats: getAllPacingStats(events),
    timeOfDayStats: getAllTimeOfDayStats(events),
    pacingInsights: getPacingInsights(events),
    timeOfDayInsights: getTimeOfDayInsights(events),
    surpriseAnalysis: getSurpriseAnalysis(events),
  };
}
