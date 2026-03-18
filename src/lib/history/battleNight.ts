import type { BattleTimeOfDay, Event } from './types';
import { getBattles } from './battles';

/**
 * 夜间战役分析模块
 * 分析战役的时间段分布，特别关注夜战及其对战争结果的影响
 */

/**
 * 战役夜战类型细分
 */
export type NightBattleType =
  | 'full-night'       // 整夜战斗
  | 'night-raid'        // 夜袭
  | 'night-ambush'     // 夜间伏击
  | 'night-retreat'     // 夜间撤退/突围
  | 'night-approach'    // 夜间进军
  | 'dawn-battle'      // 黎明战斗
  | 'dusk-battle'      // 黄昏战斗
  | 'daytime'          // 白天战斗
  | 'unknown';

/**
 * 夜战结果
 */
export type NightBattleResult =
  | 'success'          // 夜袭成功
  | 'failure'          // 夜袭失败
  | 'partial-success'  // 部分成功
  | 'mixed'            // 有胜有败
  | 'unknown';

/**
 * 获取时间段的中文标签
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
 * 获取夜战类型的标签
 */
export function getNightBattleTypeLabel(type: NightBattleType): string {
  const labels: Record<NightBattleType, string> = {
    'full-night': '整夜战斗',
    'night-raid': '夜袭',
    'night-ambush': '夜间伏击',
    'night-retreat': '夜间撤退',
    'night-approach': '夜间进军',
    'dawn-battle': '黎明战斗',
    'dusk-battle': '黄昏战斗',
    'daytime': '白天战斗',
    'unknown': '未知',
  };
  return labels[type] || '';
}

/**
 * 判断是否为夜间战斗（夜间、黎明、黄昏）
 */
export function isNightBattle(timeOfDay?: BattleTimeOfDay): boolean {
  return timeOfDay === 'night' || timeOfDay === 'dawn' || timeOfDay === 'evening';
}

/**
 * 检查是否有夜战数据
 */
export function hasNightBattleData(events: Event[]): boolean {
  const battles = getBattles(events);
  return battles.some(b => b.battle?.timeOfDay && isNightBattle(b.battle.timeOfDay));
}

/**
 * 统计夜间战斗数量
 */
export function getNightBattleCount(events: Event[]): number {
  const battles = getBattles(events);
  return battles.filter(b => isNightBattle(b.battle?.timeOfDay)).length;
}

/**
 * 统计各时间段的战役数量
 */
export function getTimeOfDayDistribution(events: Event[]): Map<BattleTimeOfDay, number> {
  const battles = getBattles(events);
  const distribution = new Map<BattleTimeOfDay, number>();

  const timeTypes: BattleTimeOfDay[] = ['dawn', 'morning', 'afternoon', 'evening', 'night', 'unknown'];

  timeTypes.forEach(time => {
    distribution.set(time, 0);
  });

  battles.forEach(battle => {
    const timeOfDay = battle.battle?.timeOfDay || 'unknown';
    const count = distribution.get(timeOfDay) || 0;
    distribution.set(timeOfDay, count + 1);
  });

  return distribution;
}

/**
 * 夜间战斗统计类型
 */
export type NightBattleStats = {
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
export function getTimeOfDayStats(events: Event[], timeOfDay: BattleTimeOfDay): NightBattleStats {
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
 * 获取所有时间段的完整统计
 */
export function getAllTimeOfDayStats(events: Event[]): NightBattleStats[] {
  const timeTypes: BattleTimeOfDay[] = ['dawn', 'morning', 'afternoon', 'evening', 'night', 'unknown'];
  return timeTypes.map(time => getTimeOfDayStats(events, time));
}

/**
 * 按时间段筛选战役
 */
export function getBattlesByTimeOfDay(events: Event[], timeOfDay: BattleTimeOfDay): Event[] {
  const battles = getBattles(events);
  return battles.filter(b => b.battle?.timeOfDay === timeOfDay);
}

/**
 * 获取夜战（夜间、黎明、黄昏）的统计信息
 */
export function getNightOpsStats(events: Event[]): NightBattleStats {
  const battles = getBattles(events);
  const nightBattles = battles.filter(b => isNightBattle(b.battle?.timeOfDay));

  let attackerWins = 0;
  let defenderWins = 0;
  let draws = 0;
  let inconclusive = 0;

  for (const battle of nightBattles) {
    const result = battle.battle?.result;
    if (result === 'attacker_win') attackerWins++;
    else if (result === 'defender_win') defenderWins++;
    else if (result === 'draw') draws++;
    else inconclusive++;
  }

  const total = nightBattles.length;
  const attackerWinRate = total > 0 ? attackerWins / total : 0;
  const defenderWinRate = total > 0 ? defenderWins / total : 0;

  return {
    timeOfDay: 'night',
    label: '夜战/暗夜作战',
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
 * 获取夜间战斗的详细列表
 */
export function getNightBattles(events: Event[]): Event[] {
  const battles = getBattles(events);
  return battles.filter(b => isNightBattle(b.battle?.timeOfDay));
}

/**
 * 分析夜间战斗成功率
 */
export function getNightAttackSuccessRate(events: Event[]): {
  total: number;
  successful: number;
  failed: number;
  partial: number;
  successRate: number;
} {
  const nightBattles = getNightBattles(events);

  // 夜袭成功的定义：进攻方在夜间战斗中获胜
  let successful = 0;
  let failed = 0;
  let partial = 0;

  nightBattles.forEach(battle => {
    const result = battle.battle?.result;
    const timeOfDay = battle.battle?.timeOfDay;

    // 对于夜袭，进攻方通常主动出击
    if (timeOfDay === 'night' || timeOfDay === 'dawn' || timeOfDay === 'evening') {
      if (result === 'attacker_win') successful++;
      else if (result === 'defender_win') failed++;
      else partial++;
    }
  });

  const total = successful + failed + partial;
  const successRate = total > 0 ? successful / total : 0;

  return {
    total,
    successful,
    failed,
    partial,
    successRate,
  };
}

/**
 * 对比夜战与昼战的胜负概率
 */
export function compareNightDayResults(events: Event[]): {
  night: { attackerWinRate: number; defenderWinRate: number; total: number };
  day: { attackerWinRate: number; defenderWinRate: number; total: number };
  difference: { attackerWinRateDiff: number; defenderWinRateDiff: number };
} {
  const battles = getBattles(events);

  const nightBattles = battles.filter(b => isNightBattle(b.battle?.timeOfDay));
  const dayBattles = battles.filter(b => {
    const time = b.battle?.timeOfDay;
    return time === 'morning' || time === 'afternoon';
  });

  // 计算夜战胜负
  let nightAttackerWins = 0;
  let nightDefenderWins = 0;
  nightBattles.forEach(b => {
    if (b.battle?.result === 'attacker_win') nightAttackerWins++;
    else if (b.battle?.result === 'defender_win') nightDefenderWins++;
  });

  // 计算昼战胜负
  let dayAttackerWins = 0;
  let dayDefenderWins = 0;
  dayBattles.forEach(b => {
    if (b.battle?.result === 'attacker_win') dayAttackerWins++;
    else if (b.battle?.result === 'defender_win') dayDefenderWins++;
  });

  const nightTotal = nightBattles.length;
  const dayTotal = dayBattles.length;

  const nightAttackerWinRate = nightTotal > 0 ? nightAttackerWins / nightTotal : 0;
  const nightDefenderWinRate = nightTotal > 0 ? nightDefenderWins / nightTotal : 0;
  const dayAttackerWinRate = dayTotal > 0 ? dayAttackerWins / dayTotal : 0;
  const dayDefenderWinRate = dayTotal > 0 ? dayDefenderWins / dayTotal : 0;

  return {
    night: {
      attackerWinRate: nightAttackerWinRate,
      defenderWinRate: nightDefenderWinRate,
      total: nightTotal,
    },
    day: {
      attackerWinRate: dayAttackerWinRate,
      defenderWinRate: dayDefenderWinRate,
      total: dayTotal,
    },
    difference: {
      attackerWinRateDiff: nightAttackerWinRate - dayAttackerWinRate,
      defenderWinRateDiff: nightDefenderWinRate - dayDefenderWinRate,
    },
  };
}

/**
 * 生成时间段分析洞察
 */
export function getTimeOfDayInsights(events: Event[]): string[] {
  const insights: string[] = [];
  const battles = getBattles(events);

  // 统计各时间段
  const distribution = getTimeOfDayDistribution(events);
  const nightCount = (distribution.get('night') || 0) + (distribution.get('dawn') || 0) + (distribution.get('evening') || 0);

  // 白天战斗统计
  const dayCount = (distribution.get('morning') || 0) + (distribution.get('afternoon') || 0);
  const total = battles.length;

  if (total > 0) {
    const nightRatio = nightCount / total;
    const dayRatio = dayCount / total;
    void dayRatio; // Mark as intentionally unused
    
    if (nightRatio > 0.3) {
      insights.push('该时期夜间战斗较为频繁，体现了夜袭战术的广泛应用');
    } else if (nightRatio < 0.1) {
      insights.push('该时期以昼战为主，夜战相对较少');
    }

    // 分析胜负
    const nightStats = getNightOpsStats(events);
    if (nightStats.totalBattles > 0) {
      if (nightStats.attackerWinRate > 0.6) {
        insights.push('夜间战斗中有利于进攻方行动，突袭效果显著');
      } else if (nightStats.defenderWinRate > 0.6) {
        insights.push('夜间战斗中防守方往往占优，地利优势被放大');
      }
    }

    // 黎明战斗分析
    const dawnStats = getTimeOfDayStats(events, 'dawn');
    if (dawnStats.totalBattles > 0 && dawnStats.attackerWinRate > 0.5) {
      insights.push('黎明时分是发起进攻的黄金时间');
    }

    // 黄昏战斗分析
    const duskStats = getTimeOfDayStats(events, 'evening');
    if (duskStats.totalBattles > 0 && duskStats.defenderWinRate > 0.5) {
      insights.push('黄昏时段防守方利用暮色撤退或反击');
    }
  }

  if (insights.length === 0) {
    insights.push('各时间段战斗分布较为均衡');
  }

  return insights;
}

/**
 * 获取完整的时间段分析摘要
 */
export function getTimeOfDaySummary(events: Event[]): {
  distribution: Record<BattleTimeOfDay, number>;
  nightOps: NightBattleStats;
  comparison: ReturnType<typeof compareNightDayResults>;
  insights: string[];
} {
  const distribution = new Map<BattleTimeOfDay, number>();
  const timeTypes: BattleTimeOfDay[] = ['dawn', 'morning', 'afternoon', 'evening', 'night', 'unknown'];

  timeTypes.forEach(time => {
    distribution.set(time, 0);
  });

  getTimeOfDayDistribution(events).forEach((count, time) => {
    distribution.set(time, count);
  });

  const distRecord = {} as Record<BattleTimeOfDay, number>;
  distribution.forEach((count, time) => {
    distRecord[time] = count;
  });

  return {
    distribution: distRecord,
    nightOps: getNightOpsStats(events),
    comparison: compareNightDayResults(events),
    insights: getTimeOfDayInsights(events),
  };
}
