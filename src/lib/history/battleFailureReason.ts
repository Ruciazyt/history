import type { Event } from './types';
import { getBattles } from './battles';

/** 战役失败原因类型 */
export type FailureReasonType =
  | 'strategic-mistake'      // 战略失误
  | 'tactical-error'        // 战术错误
  | 'command-confusion'     // 指挥混乱
  | 'logistics-failure'     // 后勤失败
  | 'insufficient-troops'   // 兵力不足
  | 'terrain-disadvantage'  // 地形不利
  | 'weather-factor'        // 天气因素
  | 'morale-collapse'       // 士气崩溃
  | 'intelligence-failure'  // 情报失误
  | 'betrayal'              // 内部背叛
  | 'overextension'        // 战线过长
  | 'fatigue'               // 疲劳作战
  | 'supply-shortage'       // 补给不足
  | 'communication-breakdown' // 通信中断
  | 'defection'             // 临阵倒戈
  | 'reconnaissance-error'  // 侦察失误
  | 'overconfidence'        // 轻敌冒进
  | 'delayed-reinforcement' // 援军迟到
  | 'unknown';              // 未知

/** 失败原因严重程度 */
export type FailureSeverity = 'critical' | 'major' | 'minor' | 'unknown';

/** 失败方阵营 */
export type FailureSide = 'attacker' | 'defender' | 'both' | 'unknown';

/** 战役失败原因数据 */
export type BattleFailureReason = {
  /** 失败原因类型 */
  type: FailureReasonType;
  /** 原因描述 */
  description: string;
  /** 失败的阵营 */
  side: FailureSide;
  /** 严重程度 */
  severity?: FailureSeverity;
  /** 涉及的关键人物（可选） */
  keyPerson?: string;
  /** 备注 */
  notes?: string;
};

/**
 * 获取失败原因类型的中文标签
 */
export function getFailureReasonLabel(type: FailureReasonType): string {
  const labels: Record<FailureReasonType, string> = {
    'strategic-mistake': '战略失误',
    'tactical-error': '战术错误',
    'command-confusion': '指挥混乱',
    'logistics-failure': '后勤失败',
    'insufficient-troops': '兵力不足',
    'terrain-disadvantage': '地形不利',
    'weather-factor': '天气因素',
    'morale-collapse': '士气崩溃',
    'intelligence-failure': '情报失误',
    'betrayal': '内部背叛',
    'overextension': '战线过长',
    'fatigue': '疲劳作战',
    'supply-shortage': '补给不足',
    'communication-breakdown': '通信中断',
    'defection': '临阵倒戈',
    'reconnaissance-error': '侦察失误',
    'overconfidence': '轻敌冒进',
    'delayed-reinforcement': '援军迟到',
    'unknown': '未知'
  };
  return labels[type] || '未知';
}

/**
 * 获取失败严重程度的中文标签
 */
export function getFailureSeverityLabel(severity: FailureSeverity): string {
  const labels: Record<FailureSeverity, string> = {
    'critical': '致命',
    'major': '重大',
    'minor': '轻微',
    'unknown': '未知'
  };
  return labels[severity] || '未知';
}

/**
 * 获取失败阵营的中文标签
 */
export function getFailureSideLabel(side: FailureSide): string {
  const labels: Record<FailureSide, string> = {
    'attacker': '进攻方',
    'defender': '防守方',
    'both': '双方',
    'unknown': '未知'
  };
  return labels[side] || '未知';
}

/**
 * 检查是否有失败原因数据
 */
export function hasFailureReasonData(events: Event[]): boolean {
  const failureReasonsMap = extractFailureReasons(events);
  return failureReasonsMap.size > 0;
}

/**
 * 获取有失败原因数据的战役
 */
export function getBattlesWithFailureReasonData(events: Event[]): Event[] {
  const failureReasonsMap = extractFailureReasons(events);
  const battles = getBattles(events);
  return battles.filter(b => failureReasonsMap.has(b.id) && failureReasonsMap.get(b.id)!.length > 0);
}

/**
 * 从战役中提取失败原因数据
 * 基于战役的其他数据推断可能的失败原因
 */
export function extractFailureReasons(events: Event[]): Map<string, BattleFailureReason[]> {
  const failureReasonsMap = new Map<string, BattleFailureReason[]>();
  
  const battles = getBattles(events);
  
  for (const battle of battles) {
    const reasons: BattleFailureReason[] = [];
    const result = battle.battle?.result;
    
    // 从战役转折点推断失败原因
    if (battle.battle?.turningPoints) {
      for (const tp of battle.battle.turningPoints) {
        if (tp.type === 'commander-death' && (tp.impact === 'negative' || !tp.impact)) {
          reasons.push({
            type: 'command-confusion',
            description: `指挥官阵亡导致指挥中断: ${tp.description}`,
            side: result === 'attacker_win' ? 'defender' : result === 'defender_win' ? 'attacker' : 'unknown',
            severity: 'critical',
            notes: '从转折点推断'
          });
        }
        if (tp.type === 'flank-collapse') {
          reasons.push({
            type: 'tactical-error',
            description: `侧翼崩溃: ${tp.description}`,
            side: result === 'attacker_win' ? 'defender' : result === 'defender_win' ? 'attacker' : 'unknown',
            severity: 'major',
            notes: '从转折点推断'
          });
        }
        if (tp.type === 'morale-collapse') {
          reasons.push({
            type: 'morale-collapse',
            description: `士气崩溃: ${tp.description}`,
            side: result === 'attacker_win' ? 'defender' : result === 'defender_win' ? 'attacker' : 'unknown',
            severity: 'critical',
            notes: '从转折点推断'
          });
        }
        if (tp.type === 'supply-disruption') {
          reasons.push({
            type: 'supply-shortage',
            description: `补给中断: ${tp.description}`,
            side: result === 'attacker_win' ? 'defender' : result === 'defender_win' ? 'attacker' : 'unknown',
            severity: 'major',
            notes: '从转折点推断'
          });
        }
        if (tp.type === 'defection') {
          reasons.push({
            type: 'defection',
            description: `临阵倒戈: ${tp.description}`,
            side: result === 'attacker_win' ? 'defender' : result === 'defender_win' ? 'attacker' : 'unknown',
            severity: 'critical',
            notes: '从转折点推断'
          });
        }
        if (tp.type === 'strategic-mistake') {
          reasons.push({
            type: 'strategic-mistake',
            description: `战略失误: ${tp.description}`,
            side: result === 'attacker_win' ? 'defender' : result === 'defender_win' ? 'attacker' : 'unknown',
            severity: 'critical',
            notes: '从转折点推断'
          });
        }
        if (tp.type === 'trap-triggered') {
          reasons.push({
            type: 'reconnaissance-error',
            description: `中计/侦察失误: ${tp.description}`,
            side: result === 'attacker_win' ? 'defender' : result === 'defender_win' ? 'attacker' : 'unknown',
            severity: 'major',
            notes: '从转折点推断'
          });
        }
      }
    }
    
    // 从情报活动推断失败原因
    if (battle.battle?.intelligence) {
      for (const intel of battle.battle.intelligence) {
        if (intel.result === 'failure' && intel.side !== 'attacker') {
          reasons.push({
            type: 'intelligence-failure',
            description: `情报失败: ${intel.description}`,
            side: intel.side === 'defender' ? 'defender' : 'unknown',
            severity: 'major',
            notes: '从情报活动推断'
          });
        }
        if (intel.type === 'deception' && intel.result === 'success') {
          reasons.push({
            type: 'reconnaissance-error',
            description: `中了对方欺诈之计: ${intel.description}`,
            side: intel.side === 'attacker' ? 'defender' : intel.side === 'defender' ? 'attacker' : 'unknown',
            severity: 'major',
            notes: '从情报活动推断'
          });
        }
      }
    }
    
    // 从军力对比推断失败原因
    if (battle.battle?.forceComparison) {
      const { attacker, defender, advantage } = battle.battle.forceComparison;
      
      if (result === 'defender_win' && advantage === 'attacker' && attacker && defender) {
        // 进攻方军力优势但输了，可能是其他原因
        if (attacker.strength > defender.strength * 2) {
          reasons.push({
            type: 'overconfidence',
            description: '轻敌冒进，军力优势却遭遇失败',
            side: 'attacker',
            severity: 'major',
            notes: '从军力对比推断'
          });
        }
      }
      
      if (result === 'attacker_win' && advantage === 'defender' && attacker && defender) {
        // 防守方军力优势但输了
        reasons.push({
          type: 'tactical-error',
          description: '拥有军力优势但战术失误导致失败',
          side: 'defender',
          severity: 'major',
          notes: '从军力对比推断'
        });
      }
    }
    
    // 从持续时间推断失败原因
    if (battle.battle?.duration && battle.battle.duration > 30) {
      if (result === 'attacker_win') {
        reasons.push({
          type: 'fatigue',
          description: '防守方持久战导致疲劳过度',
          side: 'defender',
          severity: 'major',
          notes: '从战役持续时间推断'
        });
      }
    }
    
    // 从投降数据分析失败原因
    if (battle.battle?.surrender) {
      for (const surr of battle.battle.surrender) {
        if (surr.impact === 'decisive') {
          reasons.push({
            type: 'morale-collapse',
            description: `大规模投降导致失败: ${surr.description}`,
            side: surr.side,
            severity: 'critical',
            notes: '从投降数据推断'
          });
        }
      }
    }
    
    // 从指挥官损失推断失败原因
    if (battle.battle?.commandersLoss) {
      for (const loss of battle.battle.commandersLoss) {
        if (loss.isKeyCommander && loss.severity === 'critical') {
          reasons.push({
            type: 'command-confusion',
            description: `关键将领损失: ${loss.name}`,
            side: loss.side,
            severity: 'critical',
            keyPerson: loss.name,
            notes: '从将领损失推断'
          });
        }
      }
    }
    
    // 从天气数据分析失败原因
    if (battle.battle?.weather && battle.battle.weather.length > 0) {
      const badWeather = battle.battle.weather.filter(w => 
        ['rainy', 'stormy', 'foggy', 'snowy', 'windy'].includes(w)
      );
      if (badWeather.length > 0 && result) {
        const losingSide = result === 'attacker_win' ? 'attacker' : result === 'defender_win' ? 'defender' : 'unknown';
        if (losingSide !== 'unknown') {
          reasons.push({
            type: 'weather-factor',
            description: `恶劣天气影响: ${badWeather.join(', ')}`,
            side: losingSide,
            severity: 'minor',
            notes: '从天气数据推断'
          });
        }
      }
    }
    
    if (reasons.length > 0) {
      failureReasonsMap.set(battle.id, reasons);
    }
  }
  
  return failureReasonsMap;
}

/**
 * 获取特定失败原因类型的统计
 */
export function getFailureReasonTypeStats(
  events: Event[],
  reasonType: FailureReasonType
): { count: number; critical: number; major: number; minor: number } {
  const failureReasonsMap = extractFailureReasons(events);
  
  let count = 0;
  let critical = 0;
  let major = 0;
  let minor = 0;
  
  for (const reasons of failureReasonsMap.values()) {
    for (const reason of reasons) {
      if (reason.type === reasonType) {
        count++;
        if (reason.severity === 'critical') critical++;
        else if (reason.severity === 'major') major++;
        else if (reason.severity === 'minor') minor++;
      }
    }
  }
  
  return { count, critical, major, minor };
}

/**
 * 获取所有失败原因类型的统计
 */
export function getAllFailureReasonTypeStats(
  events: Event[]
): { type: FailureReasonType; label: string; count: number; critical: number; major: number; minor: number }[] {
  const reasonTypes: FailureReasonType[] = [
    'strategic-mistake', 'tactical-error', 'command-confusion',
    'logistics-failure', 'insufficient-troops', 'terrain-disadvantage',
    'weather-factor', 'morale-collapse', 'intelligence-failure',
    'betrayal', 'overextension', 'fatigue', 'supply-shortage',
    'communication-breakdown', 'defection', 'reconnaissance-error',
    'overconfidence', 'delayed-reinforcement'
  ];
  
  return reasonTypes.map(type => {
    const stats = getFailureReasonTypeStats(events, type);
    return {
      type,
      label: getFailureReasonLabel(type),
      ...stats
    };
  }).filter(s => s.count > 0).sort((a, b) => b.count - a.count);
}

/**
 * 按失败阵营统计
 */
export function getFailureBySideStats(
  events: Event[]
): { side: FailureSide; label: string; count: number }[] {
  const failureReasonsMap = extractFailureReasons(events);
  
  const stats: Record<FailureSide, number> = {
    attacker: 0,
    defender: 0,
    both: 0,
    unknown: 0
  };
  
  for (const reasons of failureReasonsMap.values()) {
    for (const reason of reasons) {
      stats[reason.side]++;
    }
  }
  
  return Object.entries(stats).map(([side, count]) => ({
    side: side as FailureSide,
    label: getFailureSideLabel(side as FailureSide),
    count
  })).filter(s => s.count > 0).sort((a, b) => b.count - a.count);
}

/**
 * 获取最常见的失败原因
 */
export function getMostCommonFailureReasons(
  events: Event[],
  limit: number = 5
): { type: FailureReasonType; label: string; count: number }[] {
  const allStats = getAllFailureReasonTypeStats(events);
  return allStats.slice(0, limit).map(s => ({
    type: s.type,
    label: s.label,
    count: s.count
  }));
}

/**
 * 获取最致命的失败原因（按严重程度）
 */
export function getMostCriticalFailureReasons(
  events: Event[],
  limit: number = 5
): { type: FailureReasonType; label: string; criticalCount: number }[] {
  const failureReasonsMap = extractFailureReasons(events);
  
  const criticalCounts: Record<FailureReasonType, number> = {} as any;
  
  for (const reasons of failureReasonsMap.values()) {
    for (const reason of reasons) {
      if (reason.severity === 'critical') {
        criticalCounts[reason.type] = (criticalCounts[reason.type] || 0) + 1;
      }
    }
  }
  
  return Object.entries(criticalCounts)
    .map(([type, count]) => ({
      type: type as FailureReasonType,
      label: getFailureReasonLabel(type as FailureReasonType),
      criticalCount: count
    }))
    .sort((a, b) => b.criticalCount - a.criticalCount)
    .slice(0, limit);
}

/**
 * 获取涉及失败原因最多的战役
 */
export function getBattlesWithMostFailureReasons(
  events: Event[],
  limit: number = 5
): { battle: Event; reasonCount: number }[] {
  const failureReasonsMap = extractFailureReasons(events);
  
  const battlesWithReasons: { battle: Event; reasonCount: number }[] = [];
  
  const battles = getBattles(events);
  for (const battle of battles) {
    const reasons = failureReasonsMap.get(battle.id);
    if (reasons && reasons.length > 0) {
      battlesWithReasons.push({
        battle,
        reasonCount: reasons.length
      });
    }
  }
  
  return battlesWithReasons
    .sort((a, b) => b.reasonCount - a.reasonCount)
    .slice(0, limit);
}

/**
 * 分析失败原因与胜负的关联
 */
export function getFailureReasonOutcomeCorrelation(
  events: Event[]
): { reason: string; attackerFailures: number; defenderFailures: number }[] {
  const failureReasonsMap = extractFailureReasons(events);
  
  const reasonStats: Record<string, { attacker: number; defender: number }> = {};
  
  for (const [battleId, reasons] of failureReasonsMap.entries()) {
    const battle = getBattles(events).find(b => b.id === battleId);
    if (!battle) continue;
    
    const result = battle.battle?.result;
    
    for (const reason of reasons) {
      const label = getFailureReasonLabel(reason.type);
      
      if (!reasonStats[label]) {
        reasonStats[label] = { attacker: 0, defender: 0 };
      }
      
      // 失败方承担失败原因
      const failureSide = reason.side === 'both' ? 
        (result === 'attacker_win' ? 'defender' : result === 'defender_win' ? 'attacker' : null) :
        reason.side;
      
      if (failureSide === 'attacker' || (failureSide === null && result === 'defender_win')) {
        reasonStats[label].attacker++;
      } else if (failureSide === 'defender' || (failureSide === null && result === 'attacker_win')) {
        reasonStats[label].defender++;
      }
    }
  }
  
  return Object.entries(reasonStats).map(([reason, stats]) => ({
    reason,
    attackerFailures: stats.attacker,
    defenderFailures: stats.defender
  })).sort((a, b) => (b.attackerFailures + b.defenderFailures) - (a.attackerFailures + a.attackerFailures));
}

/**
 * 获取失败原因分析的历史洞察
 */
export function getFailureReasonInsights(events: Event[]): string[] {
  const insights: string[] = [];
  
  const failureReasonsMap = extractFailureReasons(events);
  const totalReasons = Array.from(failureReasonsMap.values()).reduce((sum, arr) => sum + arr.length, 0);
  
  if (totalReasons === 0) {
    insights.push('暂无失败原因分析数据');
    return insights;
  }
  
  insights.push(`共分析出 ${totalReasons} 条战役失败原因`);
  
  // 最常见的原因
  const commonReasons = getMostCommonFailureReasons(events, 3);
  if (commonReasons.length > 0) {
    const topReason = commonReasons[0];
    insights.push(`最常见的失败原因是「${topReason.label}」，共出现 ${topReason.count} 次`);
  }
  
  // 最致命的原因
  const criticalReasons = getMostCriticalFailureReasons(events, 3);
  if (criticalReasons.length > 0) {
    const topCritical = criticalReasons[0];
    insights.push(`最致命的失败原因是「${topCritical.label}」，共 ${topCritical.criticalCount} 次导致致命后果`);
  }
  
  // 阵营分析
  const sideStats = getFailureBySideStats(events);
  if (sideStats.length > 0) {
    const attackerStats = sideStats.find(s => s.side === 'attacker');
    const defenderStats = sideStats.find(s => s.side === 'defender');
    if (attackerStats && defenderStats) {
      if (attackerStats.count > defenderStats.count) {
        insights.push('进攻方更容易因失误导致失败');
      } else if (defenderStats.count > attackerStats.count) {
        insights.push('防守方更容易因失误导致失败');
      }
    }
  }
  
  // 典型案例
  const battlesWithMostReasons = getBattlesWithMostFailureReasons(events, 1);
  if (battlesWithMostReasons.length > 0) {
    const top = battlesWithMostReasons[0];
    const battleTitle = top.battle.titleKey || top.battle.id;
    insights.push(`《${battleTitle}》涉及最多失败原因（${top.reasonCount}个），是研究战役失败的典型案例`);
  }
  
  return insights;
}

/**
 * 获取完整的失败原因分析摘要
 */
export function getFailureReasonSummary(events: Event[]) {
  const failureReasonsMap = extractFailureReasons(events);
  const battles = getBattles(events);
  
  return {
    overview: {
      totalBattles: battles.length,
      battlesWithFailureAnalysis: failureReasonsMap.size,
      totalReasons: Array.from(failureReasonsMap.values()).reduce((sum, arr) => sum + arr.length, 0)
    },
    reasonTypeStats: getAllFailureReasonTypeStats(events),
    sideStats: getFailureBySideStats(events),
    mostCommonReasons: getMostCommonFailureReasons(events, 5),
    mostCriticalReasons: getMostCriticalFailureReasons(events, 5),
    battlesWithMostReasons: getBattlesWithMostFailureReasons(events, 5).map(b => ({
      battle: b.battle,
      reasonCount: b.reasonCount
    })),
    correlation: getFailureReasonOutcomeCorrelation(events),
    insights: getFailureReasonInsights(events)
  };
}
