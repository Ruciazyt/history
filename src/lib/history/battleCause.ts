/**
 * 战役原因分析模块
 * 分析战役爆发的原因和历史背景
 */

import { Event } from './types';

/** 战役原因类型 */
export type BattleCauseType =
  | 'territorial-dispute'    // 领土争端
  | 'political-rivalry'      // 政治 rivalry/权力斗争
  | 'revenge'                // 复仇
  | 'succession-dispute'     // 继承权争夺
  | 'economic-interest'      // 经济利益
  | 'ideological-conflict'   // 意识形态冲突
  | 'preemptive-attack'      // 先发制人攻击
  | 'defensive-war'          // 自卫战争
  | 'expansionism'           // 扩张主义
  | 'dynastic-conflict'      // 朝代冲突
  | 'tributary-dispute'      // 朝贡体系争议
  | 'border-incident'        // 边境冲突
  | 'alliance-obligation'    // 联盟义务
  | 'usurpation'             // 篡位/叛变
  | 'rebellion'              // 叛乱/起义
  | 'unknown';

/** 战役原因严重程度 */
export type CauseSeverity = 'critical' | 'major' | 'minor' | 'unknown';

/** 战役原因数据 */
export type BattleCause = {
  /** 原因类型 */
  type: BattleCauseType;
  /** 原因描述 */
  description: string;
  /** 涉及的势力/国家 */
  parties?: string[];
  /** 严重程度 */
  severity?: CauseSeverity;
  /** 持续时间（年）- 可选，表示该原因积累了多久 */
  duration?: number;
};

/** 获取战役原因类型的中文标签 */
export function getCauseTypeLabel(type: BattleCauseType): string {
  const labels: Record<BattleCauseType, string> = {
    'territorial-dispute': '领土争端',
    'political-rivalry': '政治 rivalry',
    'revenge': '复仇',
    'succession-dispute': '继承权争夺',
    'economic-interest': '经济利益',
    'ideological-conflict': '意识形态冲突',
    'preemptive-attack': '先发制人攻击',
    'defensive-war': '自卫战争',
    'expansionism': '扩张主义',
    'dynastic-conflict': '朝代冲突',
    'tributary-dispute': '朝贡体系争议',
    'border-incident': '边境冲突',
    'alliance-obligation': '联盟义务',
    'usurpation': '篡位/叛变',
    'rebellion': '叛乱/起义',
    'unknown': '未知',
  };
  return labels[type] || '未知';
}

/** 获取严重程度的中文标签 */
export function getSeverityLabel(severity: CauseSeverity): string {
  const labels: Record<CauseSeverity, string> = {
    'critical': '决定性',
    'major': '重大',
    'minor': '轻微',
    'unknown': '未知',
  };
  return labels[severity] || '未知';
}

/** 获取所有唯一的战役原因类型 */
export function getUniqueCauseTypes(events: Event[]): BattleCauseType[] {
  const types = new Set<BattleCauseType>();
  
  for (const event of events) {
    if (event.battle?.causes) {
      for (const cause of event.battle.causes) {
        types.add(cause.type);
      }
    }
  }
  
  return Array.from(types);
}

/** 检查是否有战役原因数据 */
export function hasCauseData(events: Event[]): boolean {
  return events.some(event => 
    event.battle?.causes && event.battle.causes.length > 0
  );
}

/** 获取特定类型原因的统计 */
export function getCauseTypeStats(
  events: Event[],
  causeType: BattleCauseType
): { count: number; battles: string[] } {
  const battles: string[] = [];
  
  for (const event of events) {
    if (event.battle?.causes) {
      for (const cause of event.battle.causes) {
        if (cause.type === causeType) {
          battles.push(event.titleKey);
          break;
        }
      }
    }
  }
  
  return { count: battles.length, battles };
}

/** 获取所有类型的原因统计 */
export function getAllCauseTypeStats(
  events: Event[]
): Array<{ type: BattleCauseType; count: number; label: string; battles: string[] }> {
  const stats: Array<{ type: BattleCauseType; count: number; label: string; battles: string[] }> = [];
  
  // 获取所有可能的原因类型
  const allTypes: BattleCauseType[] = [
    'territorial-dispute', 'political-rivalry', 'revenge', 'succession-dispute',
    'economic-interest', 'ideological-conflict', 'preemptive-attack', 'defensive-war',
    'expansionism', 'dynastic-conflict', 'tributary-dispute', 'border-incident',
    'alliance-obligation', 'usurpation', 'rebellion', 'unknown'
  ];
  
  for (const type of allTypes) {
    const result = getCauseTypeStats(events, type);
    stats.push({
      type,
      count: result.count,
      label: getCauseTypeLabel(type),
      battles: result.battles,
    });
  }
  
  return stats.sort((a, b) => b.count - a.count);
}

/** 按原因类型筛选战役 */
export function getBattlesByCauseType(
  events: Event[],
  causeType: BattleCauseType
): Array<{ event: Event; cause: BattleCause }> {
  const results: Array<{ event: Event; cause: BattleCause }> = [];
  
  for (const event of events) {
    if (event.battle?.causes) {
      for (const cause of event.battle.causes) {
        if (cause.type === causeType) {
          results.push({ event, cause });
        }
      }
    }
  }
  
  return results;
}

/** 获取最常见的原因类型 */
export function getMostCommonCauseTypes(
  events: Event[],
  limit: number = 5
): Array<{ type: BattleCauseType; count: number; label: string }> {
  const allStats = getAllCauseTypeStats(events);
  return allStats
    .filter(s => s.type !== 'unknown')
    .slice(0, limit)
    .map(s => ({
      type: s.type,
      count: s.count,
      label: s.label,
    }));
}

/** 分析原因的严重程度分布 */
export function getCauseSeverityDistribution(
  events: Event[]
): Record<CauseSeverity, number> {
  const distribution: Record<CauseSeverity, number> = {
    'critical': 0,
    'major': 0,
    'minor': 0,
    'unknown': 0,
  };
  
  for (const event of events) {
    if (event.battle?.causes) {
      for (const cause of event.battle.causes) {
        const severity = cause.severity || 'unknown';
        distribution[severity]++;
      }
    }
  }
  
  return distribution;
}

/** 获取涉及最多原因的战役 */
export function getBattlesWithMostCauses(
  events: Event[],
  limit: number = 10
): Array<{ event: Event; causeCount: number }> {
  const results: Array<{ event: Event; causeCount: number }> = [];
  
  for (const event of events) {
    if (event.battle?.causes && event.battle.causes.length > 0) {
      results.push({
        event,
        causeCount: event.battle.causes.length,
      });
    }
  }
  
  return results
    .sort((a, b) => b.causeCount - a.causeCount)
    .slice(0, limit);
}

/** 分析原因与战役结果的关联 */
export function getCauseResultCorrelation(
  events: Event[]
): Array<{ causeType: BattleCauseType; attackerWin: number; defenderWin: number; draw: number; label: string }> {
  const correlation: Record<BattleCauseType, { attackerWin: number; defenderWin: number; draw: number }> = {} as any;
  
  // 初始化
  const causeTypes: BattleCauseType[] = [
    'territorial-dispute', 'political-rivalry', 'revenge', 'succession-dispute',
    'economic-interest', 'ideological-conflict', 'preemptive-attack', 'defensive-war',
    'expansionism', 'dynastic-conflict', 'tributary-dispute', 'border-incident',
    'alliance-obligation', 'usurpation', 'rebellion', 'unknown'
  ];
  
  for (const type of causeTypes) {
    correlation[type] = { attackerWin: 0, defenderWin: 0, draw: 0 };
  }
  
  // 统计
  for (const event of events) {
    if (!event.battle?.causes || !event.battle.result) continue;
    
    const result = event.battle.result;
    for (const cause of event.battle.causes) {
      if (result === 'attacker_win') {
        correlation[cause.type].attackerWin++;
      } else if (result === 'defender_win') {
        correlation[cause.type].defenderWin++;
      } else if (result === 'draw') {
        correlation[cause.type].draw++;
      }
    }
  }
  
  return causeTypes.map(type => ({
    causeType: type,
    ...correlation[type],
    label: getCauseTypeLabel(type),
  })).filter(c => c.attackerWin + c.defenderWin + c.draw > 0);
}

/** 分析防御性战争 vs 进攻性战争的胜率 */
export function getDefensiveVsOffensiveStats(
  events: Event[]
): { defensive: { wins: number; total: number }; offensive: { wins: number; total: number } } {
  let defensiveWins = 0;
  let defensiveTotal = 0;
  let offensiveWins = 0;
  let offensiveTotal = 0;
  
  for (const event of events) {
    if (!event.battle?.causes) continue;
    
    const hasDefensive = event.battle.causes.some(c => c.type === 'defensive-war');
    const hasOffensive = event.battle.causes.some(c => 
      c.type === 'expansionism' || 
      c.type === 'preemptive-attack' || 
      c.type === 'territorial-dispute' ||
      c.type === 'political-rivalry' ||
      c.type === 'revenge' ||
      c.type === 'dynastic-conflict' ||
      c.type === 'usurpation'
    );
    
    if (hasDefensive) {
      defensiveTotal++;
      if (event.battle.result === 'defender_win') {
        defensiveWins++;
      }
    }
    
    if (hasOffensive) {
      offensiveTotal++;
      if (event.battle.result === 'attacker_win') {
        offensiveWins++;
      }
    }
  }
  
  return {
    defensive: { wins: defensiveWins, total: defensiveTotal },
    offensive: { wins: offensiveWins, total: offensiveTotal },
  };
}

/** 生成战役原因分析洞察 */
export function getCauseInsights(events: Event[]): string[] {
  const insights: string[] = [];
  
  if (!hasCauseData(events)) {
    return ['暂无战役原因数据'];
  }
  
  const mostCommon = getMostCommonCauseTypes(events, 3);
  if (mostCommon.length > 0) {
    insights.push(`最常见的战役原因是${mostCommon.map(c => c.label).join('、')}。`);
  }
  
  const severityDist = getCauseSeverityDistribution(events);
  const totalCauses = severityDist.critical + severityDist.major + severityDist.minor;
  if (totalCauses > 0 && severityDist.critical > 0) {
    const criticalPercent = Math.round((severityDist.critical / totalCauses) * 100);
    insights.push(`${criticalPercent}%的战役具有决定性原因(territorial-dispute、revenge等关键因素驱动)。`);
  }
  
  const defensiveOffensive = getDefensiveVsOffensiveStats(events);
  if (defensiveOffensive.defensive.total > 0) {
    const defensiveWinRate = Math.round((defensiveOffensive.defensive.wins / defensiveOffensive.defensive.total) * 100);
    insights.push(`防御方胜利的战役中，自卫战争占比${defensiveWinRate}%胜率。`);
  }
  
  if (defensiveOffensive.offensive.total > 0) {
    const offensiveWinRate = Math.round((defensiveOffensive.offensive.wins / defensiveOffensive.offensive.total) * 100);
    insights.push(`进攻性战争(扩张、复仇等)的进攻方胜率为${offensiveWinRate}%。`);
  }
  
  // 复仇战役的胜率
  const revengeStats = getCauseTypeStats(events, 'revenge');
  if (revengeStats.count > 0) {
    let revengeWins = 0;
    for (const event of events) {
      if (event.battle?.causes) {
        const hasRevenge = event.battle.causes.some(c => c.type === 'revenge');
        if (hasRevenge && event.battle.result === 'attacker_win') {
          revengeWins++;
        }
      }
    }
    const revengeWinRate = Math.round((revengeWins / revengeStats.count) * 100);
    insights.push(`以复仇为名的战役胜率为${revengeWinRate}%，历史证明复仇往往是战争的导火索。`);
  }
  
  // 继承权争夺
  const successionStats = getCauseTypeStats(events, 'succession-dispute');
  if (successionStats.count > 2) {
    insights.push(`继承权争夺是${successionStats.count}场战役的导火索，这反映了古代权力交接的残酷性。`);
  }
  
  return insights;
}

/** 获取战役原因摘要 */
export function getCauseSummary(events: Event[]): {
  totalCauses: number;
  uniqueTypes: number;
  hasData: boolean;
  mostCommon: Array<{ type: BattleCauseType; count: number; label: string }>;
  severityDistribution: Record<CauseSeverity, number>;
  defensiveVsOffensive: { defensive: { wins: number; total: number }; offensive: { wins: number; total: number } };
  insights: string[];
} {
  const allStats = getAllCauseTypeStats(events);
  const totalCauses = allStats.reduce((sum, s) => sum + s.count, 0);
  const uniqueTypes = allStats.filter(s => s.count > 0).length;
  
  return {
    totalCauses,
    uniqueTypes,
    hasData: hasCauseData(events),
    mostCommon: getMostCommonCauseTypes(events, 5),
    severityDistribution: getCauseSeverityDistribution(events),
    defensiveVsOffensive: getDefensiveVsOffensiveStats(events),
    insights: getCauseInsights(events),
  };
}
