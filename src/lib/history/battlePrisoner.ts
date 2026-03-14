/**
 * 战役俘虏/囚犯分析模块
 * 分析战役中的俘虏、囚犯情况
 */

import type { Event, BattlePrisoner, PrisonerType, PrisonerTreatment, PrisonerSide, PrisonerSeverity } from './types';

/**
 * 获取俘虏类型的中文标签
 */
export function getPrisonerTypeLabel(type: PrisonerType): string {
  const labels: Record<PrisonerType, string> = {
    'captured-soldiers': '被俘士兵',
    'captured-commanders': '被俘指挥官',
    'civilians': '平民',
    'hostages': '人质',
    'refugees': '难民',
    unknown: '未知',
  };
  return labels[type] || '未知';
}

/**
 * 获取俘虏待遇的中文标签
 */
export function getPrisonerTreatmentLabel(treatment: PrisonerTreatment): string {
  const labels: Record<PrisonerTreatment, string> = {
    executed: '处死',
    enslaved: '奴役',
    released: '释放',
    ransomed: '赎还',
    integrated: '收编',
    imprisoned: '囚禁',
    exiled: '流放',
    negotiated: '谈判解决',
    unknown: '未知',
  };
  return labels[treatment] || '未知';
}

/**
 * 获取俘虏阵营的中文标签
 */
export function getPrisonerSideLabel(side: PrisonerSide): string {
  const labels: Record<PrisonerSide, string> = {
    attacker: '进攻方',
    defender: '防守方',
    unknown: '未知',
  };
  return labels[side] || '未知';
}

/**
 * 获取严重程度的中文标签
 */
export function getPrisonerSeverityLabel(severity: PrisonerSeverity): string {
  const labels: Record<PrisonerSeverity, string> = {
    massive: '大规模',
    significant: '重大',
    moderate: '中等',
    minor: '轻微',
    unknown: '未知',
  };
  return labels[severity] || '未知';
}

/**
 * 检查是否有俘虏数据
 */
export function hasPrisonerData(events: Event[]): boolean {
  return events.some(battle => battle.battle?.prisoners && battle.battle.prisoners.length > 0);
}

/**
 * 获取所有唯一的俘虏类型
 */
export function getUniquePrisonerTypes(events: Event[]): PrisonerType[] {
  const types = new Set<PrisonerType>();
  
  events.forEach(battle => {
    battle.battle?.prisoners?.forEach(prisoner => {
      types.add(prisoner.type);
    });
  });
  
  return Array.from(types);
}

/**
 * 获取特定俘虏类型的统计信息
 */
export function getPrisonerTypeStats(events: Event[], type: PrisonerType): { count: number; battles: string[] } {
  const result: string[] = [];
  
  events.forEach(battle => {
    const prisoners = battle.battle?.prisoners?.filter(p => p.type === type);
    if (prisoners && prisoners.length > 0) {
      result.push(battle.id);
    }
  });
  
  return { count: result.length, battles: result };
}

/**
 * 获取所有俘虏类型的统计信息
 */
export function getAllPrisonerTypeStats(events: Event[]): Array<{ type: PrisonerType; count: number; battles: string[] }> {
  const types: PrisonerType[] = ['captured-soldiers', 'captured-commanders', 'civilians', 'hostages', 'refugees', 'unknown'];
  
  return types.map(type => ({
    type,
    ...getPrisonerTypeStats(events, type),
  })).filter(item => item.count > 0);
}

/**
 * 按阵营统计俘虏
 */
export function getPrisonerBySide(events: Event[]): Array<{ side: PrisonerSide; total: number; battles: string[] }> {
  const sides: PrisonerSide[] = ['attacker', 'defender', 'unknown'];
  
  return sides.map(side => {
    const result: string[] = [];
    
    events.forEach(battle => {
      const prisoners = battle.battle?.prisoners?.filter(p => p.side === side);
      if (prisoners && prisoners.length > 0) {
        result.push(battle.id);
      }
    });
    
    return { side, total: result.length, battles: result };
  }).filter(item => item.total > 0);
}

/**
 * 获取有大规模俘虏的战役
 */
export function getMassivePrisonerBattles(events: Event[]): Event[] {
  return events.filter(battle => 
    battle.battle?.prisoners?.some(p => p.severity === 'massive' || (p.number && p.number > 10000))
  );
}

/**
 * 获取有指挥官被俘的战役
 */
export function getCommanderCapturedBattles(events: Event[]): Event[] {
  return events.filter(battle => 
    battle.battle?.prisoners?.some(p => p.type === 'captured-commanders')
  );
}

/**
 * 获取俘虏被处死的战役（用于分析残酷程度）
 */
export function getExecutedPrisonerBattles(events: Event[]): Event[] {
  return events.filter(battle => 
    battle.battle?.prisoners?.some(p => p.treatment === 'executed')
  );
}

/**
 * 获取俘虏被收编的战役（用于分析军事传统）
 */
export function getIntegratedPrisonerBattles(events: Event[]): Event[] {
  return events.filter(battle => 
    battle.battle?.prisoners?.some(p => p.treatment === 'integrated')
  );
}

/**
 * 获取决定性俘虏影响的战役
 */
export function getDecisivePrisonerImpactBattles(events: Event[]): Event[] {
  return events.filter(battle => 
    battle.battle?.prisoners?.some(p => p.impact === 'decisive')
  );
}

/**
 * 按俘虏待遇统计
 */
export function getTreatmentStats(events: Event[]): Array<{ treatment: PrisonerTreatment; count: number; battles: string[] }> {
  const treatments: PrisonerTreatment[] = ['executed', 'enslaved', 'released', 'ransomed', 'integrated', 'imprisoned', 'exiled', 'negotiated', 'unknown'];
  
  return treatments.map(treatment => {
    const result: string[] = [];
    
    events.forEach(battle => {
      const prisoners = battle.battle?.prisoners?.filter(p => p.treatment === treatment);
      if (prisoners && prisoners.length > 0) {
        result.push(battle.id);
      }
    });
    
    return { treatment, count: result.length, battles: result };
  }).filter(item => item.count > 0);
}

/**
 * 分析俘虏与战役结果的关联
 */
export function getPrisonerResultCorrelation(events: Event[]): {
  attackerCapturedWin: number;
  attackerCapturedLose: number;
  defenderCapturedWin: number;
  defenderCapturedLose: number;
} {
  let attackerCapturedWin = 0;
  let attackerCapturedLose = 0;
  let defenderCapturedWin = 0;
  let defenderCapturedLose = 0;
  
  events.forEach(battle => {
    const prisoners = battle.battle?.prisoners;
    if (!prisoners || prisoners.length === 0) return;
    
    const result = battle.battle?.result;
    const hasAttackerPrisoners = prisoners.some(p => p.side === 'attacker');
    const hasDefenderPrisoners = prisoners.some(p => p.side === 'defender');
    
    if (hasAttackerPrisoners) {
      if (result === 'attacker_win') attackerCapturedWin++;
      else if (result === 'defender_win') attackerCapturedLose++;
    }
    
    if (hasDefenderPrisoners) {
      if (result === 'defender_win') defenderCapturedWin++;
      else if (result === 'attacker_win') defenderCapturedLose++;
    }
  });
  
  return {
    attackerCapturedWin,
    attackerCapturedLose,
    defenderCapturedWin,
    defenderCapturedLose,
  };
}

/**
 * 获取被俘人数最多的战役
 */
export function getHighestPrisonerCountBattles(events: Event[], limit: number = 5): Array<{ battleId: string; total: number }> {
  const result: Array<{ battleId: string; total: number }> = [];
  
  events.forEach(battle => {
    const prisoners = battle.battle?.prisoners;
    if (!prisoners || prisoners.length === 0) return;
    
    const total = prisoners.reduce((sum, p) => sum + (p.number || 0), 0);
    if (total > 0) {
      result.push({ battleId: battle.id, total });
    }
  });
  
  return result
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

/**
 * 生成俘虏分析历史洞察
 */
export function getPrisonerInsights(events: Event[]): string[] {
  const insights: string[] = [];
  const battlesWithPrisoners = events.filter(b => b.battle?.prisoners && b.battle.prisoners.length > 0);
  
  if (battlesWithPrisoners.length === 0) {
    return ['暂无俘虏数据'];
  }
  
  // 统计分析
  const executed = battlesWithPrisoners.filter(b => b.battle?.prisoners?.some(p => p.treatment === 'executed'));
  const integrated = battlesWithPrisoners.filter(b => b.battle?.prisoners?.some(p => p.treatment === 'integrated'));
  const massive = battlesWithPrisoners.filter(b => b.battle?.prisoners?.some(p => p.severity === 'massive' || (p.number && p.number > 10000)));
  const commanders = battlesWithPrisoners.filter(b => b.battle?.prisoners?.some(p => p.type === 'captured-commanders'));
  
  // 洞察1: 俘虏总览
  insights.push(`共有 ${battlesWithPrisoners.length} 场战役有俘虏记录`);
  
  // 洞察2: 残酷程度
  if (executed.length > 0) {
    const percentage = Math.round((executed.length / battlesWithPrisoners.length) * 100);
    insights.push(`${percentage}% 的俘虏战役存在处死俘虏的情况，显示出古代战争的残酷性`);
  }
  
  // 洞察3: 收编传统
  if (integrated.length > 0) {
    const percentage = Math.round((integrated.length / battlesWithPrisoners.length) * 100);
    insights.push(`${percentage}% 的战役选择收编俘虏，显示古代军事对人力资源的重视`);
  }
  
  // 洞察4: 大规模俘虏
  if (massive.length > 0) {
    const percentage = Math.round((massive.length / battlesWithPrisoners.length) * 100);
    insights.push(`${percentage}% 的战役出现大规模俘虏（万人以上），通常对战局产生决定性影响`);
  }
  
  // 洞察5: 指挥官被俘
  if (commanders.length > 0) {
    insights.push(`${commanders.length} 场战役有指挥官被俘，往往成为战役转折点`);
  }
  
  // 洞察6: 俘虏与胜负关联
  const correlation = getPrisonerResultCorrelation(events);
  const attackerTotal = correlation.attackerCapturedWin + correlation.attackerCapturedLose;
  const defenderTotal = correlation.defenderCapturedWin + correlation.defenderCapturedLose;
  
  if (attackerTotal > 0) {
    const winRate = Math.round((correlation.attackerCapturedWin / attackerTotal) * 100);
    insights.push(`进攻方被俘时，进攻方胜利率为 ${winRate}%`);
  }
  
  if (defenderTotal > 0) {
    const winRate = Math.round((correlation.defenderCapturedWin / defenderTotal) * 100);
    insights.push(`防守方被俘时，防守方胜利率为 ${winRate}%`);
  }
  
  // 洞察7: 最常见待遇
  const treatmentStats = getTreatmentStats(events);
  if (treatmentStats.length > 0) {
    const sorted = treatmentStats.sort((a, b) => b.count - a.count);
    const mostCommon = sorted[0];
    insights.push(`最常见的俘虏待遇是「${getPrisonerTreatmentLabel(mostCommon.treatment)}」，出现在 ${mostCommon.count} 场战役中`);
  }
  
  return insights;
}

/**
 * 获取俘虏分析完整摘要
 */
export function getPrisonerSummary(events: Event[]): {
  totalBattles: number;
  totalPrisoners: number;
  prisonerTypes: number;
  uniqueTreatments: number;
  massiveBattles: number;
  commanderCapturedBattles: number;
  executedBattles: number;
  integratedBattles: number;
  decisiveImpactBattles: number;
  correlation: ReturnType<typeof getPrisonerResultCorrelation>;
  topPrisonerBattles: ReturnType<typeof getHighestPrisonerCountBattles>;
  insights: string[];
} {
  const battlesWithPrisoners = events.filter(b => b.battle?.prisoners && b.battle.prisoners.length > 0);
  
  // 计算总俘虏数
  let totalPrisoners = 0;
  battlesWithPrisoners.forEach(battle => {
    battle.battle?.prisoners?.forEach(p => {
      totalPrisoners += p.number || 0;
    });
  });
  
  // 统计待遇类型数
  const treatments = new Set<PrisonerTreatment>();
  battlesWithPrisoners.forEach(battle => {
    battle.battle?.prisoners?.forEach(p => {
      if (p.treatment) treatments.add(p.treatment);
    });
  });
  
  return {
    totalBattles: battlesWithPrisoners.length,
    totalPrisoners,
    prisonerTypes: getUniquePrisonerTypes(events).length,
    uniqueTreatments: treatments.size,
    massiveBattles: getMassivePrisonerBattles(events).length,
    commanderCapturedBattles: getCommanderCapturedBattles(events).length,
    executedBattles: getExecutedPrisonerBattles(events).length,
    integratedBattles: getIntegratedPrisonerBattles(events).length,
    decisiveImpactBattles: getDecisivePrisonerImpactBattles(events).length,
    correlation: getPrisonerResultCorrelation(events),
    topPrisonerBattles: getHighestPrisonerCountBattles(events),
    insights: getPrisonerInsights(events),
  };
}
