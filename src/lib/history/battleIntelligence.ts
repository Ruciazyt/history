import type { Event } from './types';
import { getBattles } from './battles';

/**
 * Battle intelligence operation types
 */
export type IntelligenceType =
  | 'espionage'      // 间谍活动/卧底
  | 'infiltration'   // 渗透/内应
  | 'deception'      // 欺诈/诱敌
  | 'counter-intelligence' // 反间谍
  | 'reconnaissance' // 侦察
  | 'propaganda'     // 宣传/心理战
  | 'defection'      // 倒戈/投诚
  | 'sabotage'       // 破坏活动
  | 'unknown';

/**
 * Intelligence operation result
 */
export type IntelligenceResult =
  | 'success'        // 成功
  | 'failure'        // 失败
  | 'partial'       // 部分成功
  | 'unknown';

/**
 * Battle intelligence data
 */
export type BattleIntelligence = {
  /** Intelligence operation type */
  type: IntelligenceType;
  /** Description of the intelligence operation */
  description: string;
  /** Which side conducted the operation */
  side: 'attacker' | 'defender' | 'both' | 'unknown';
  /** Result of the intelligence operation */
  result: IntelligenceResult;
  /** Who benefited from this operation */
  benefit?: 'attacker' | 'defender' | 'both' | 'unknown';
  /** Additional notes */
  notes?: string;
};

/**
 * Get Chinese label for intelligence type
 */
export function getIntelligenceTypeLabel(type: IntelligenceType): string {
  const labels: Record<string, string> = {
    espionage: '间谍活动',
    infiltration: '渗透/内应',
    deception: '欺诈/诱敌',
    'counter-intelligence': '反间谍',
    reconnaissance: '侦察',
    propaganda: '宣传/心理战',
    defection: '倒戈/投诚',
    sabotage: '破坏活动',
    unknown: '未知',
  };
  return labels[type] || '';
}

/**
 * Get Chinese label for intelligence result
 */
export function getIntelligenceResultLabel(result: IntelligenceResult): string {
  const labels: Record<string, string> = {
    success: '成功',
    failure: '失败',
    partial: '部分成功',
    unknown: '未知',
  };
  return labels[result] || '';
}

/**
 * Get all unique intelligence types from battles
 */
export function getUniqueIntelligenceTypes(events: Event[]): IntelligenceType[] {
  const battles = getBattles(events);
  const types = new Set<IntelligenceType>();
  
  for (const battle of battles) {
    const intel = battle.battle?.intelligence;
    if (intel) {
      intel.forEach(i => types.add(i.type));
    }
  }
  
  return Array.from(types).sort();
}

/**
 * Check if there is intelligence data available
 */
export function hasIntelligenceData(events: Event[]): boolean {
  const battles = getBattles(events);
  return battles.some(b => b.battle?.intelligence && b.battle.intelligence.length > 0);
}

/**
 * Intelligence statistics type
 */
export type IntelligenceStats = {
  type: IntelligenceType;
  label: string;
  totalOperations: number;
  successCount: number;
  failureCount: number;
  partialCount: number;
  unknownCount: number;
  successRate: number;
  attackerSide: number;
  defenderSide: number;
  bothSides: number;
};

/**
 * Get statistics for a specific intelligence type
 */
export function getIntelligenceStats(events: Event[], type: IntelligenceType): IntelligenceStats {
  const battles = getBattles(events);
  const operations = battles.flatMap(b => 
    (b.battle?.intelligence || []).filter(i => i.type === type)
  );
  
  let successCount = 0;
  let failureCount = 0;
  let partialCount = 0;
  let unknownCount = 0;
  let attackerSide = 0;
  let defenderSide = 0;
  let bothSides = 0;
  
  for (const op of operations) {
    switch (op.result) {
      case 'success':
        successCount++;
        break;
      case 'failure':
        failureCount++;
        break;
      case 'partial':
        partialCount++;
        break;
      default:
        unknownCount++;
    }
    
    switch (op.side) {
      case 'attacker':
        attackerSide++;
        break;
      case 'defender':
        defenderSide++;
        break;
      case 'both':
        bothSides++;
        break;
    }
  }
  
  const total = operations.length;
  const decided = successCount + failureCount;
  
  return {
    type,
    label: getIntelligenceTypeLabel(type),
    totalOperations: total,
    successCount,
    failureCount,
    partialCount,
    unknownCount,
    successRate: decided > 0 ? (successCount / decided) * 100 : 0,
    attackerSide,
    defenderSide,
    bothSides,
  };
}

/**
 * Get all intelligence type statistics
 */
export function getAllIntelligenceStats(events: Event[]): IntelligenceStats[] {
  const types = getUniqueIntelligenceTypes(events);
  return types.map(t => getIntelligenceStats(events, t));
}

/**
 * Get battles with intelligence operations
 */
export function getBattlesWithIntelligence(events: Event[]): Event[] {
  const battles = getBattles(events);
  return battles.filter(b => b.battle?.intelligence && b.battle.intelligence.length > 0);
}

/**
 * Get battles by intelligence type
 */
export function getBattlesByIntelligenceType(events: Event[], type: IntelligenceType): Event[] {
  const battles = getBattles(events);
  return battles.filter(b => 
    b.battle?.intelligence?.some(i => i.type === type)
  );
}

/**
 * Get battles by intelligence result
 */
export function getBattlesByIntelligenceResult(events: Event[], result: IntelligenceResult): Event[] {
  const battles = getBattles(events);
  return battles.filter(b => 
    b.battle?.intelligence?.some(i => i.result === result)
  );
}

/**
 * Intelligence outcome correlation type
 */
export type IntelligenceOutcomeCorrelation = {
  intelligenceSuccess: {
    attackerWin: number;
    defenderWin: number;
    draw: number;
  };
  intelligenceFailure: {
    attackerWin: number;
    defenderWin: number;
    draw: number;
  };
  intelligencePartial: {
    attackerWin: number;
    defenderWin: number;
    draw: number;
  };
};

/**
 * Analyze correlation between intelligence success and battle outcome
 */
export function getIntelligenceOutcomeCorrelation(events: Event[]): IntelligenceOutcomeCorrelation {
  const battles = getBattles(events);
  const intelBattles = battles.filter(b => b.battle?.intelligence && b.battle.intelligence.length > 0);
  
  const intelligenceSuccess = { attackerWin: 0, defenderWin: 0, draw: 0 };
  const intelligenceFailure = { attackerWin: 0, defenderWin: 0, draw: 0 };
  const intelligencePartial = { attackerWin: 0, defenderWin: 0, draw: 0 };
  
  for (const battle of intelBattles) {
    const hasSuccess = battle.battle?.intelligence?.some(i => i.result === 'success');
    const hasFailure = battle.battle?.intelligence?.some(i => i.result === 'failure');
    const hasPartial = battle.battle?.intelligence?.some(i => i.result === 'partial');
    
    const battleResult = battle.battle?.result;
    
    if (hasSuccess) {
      if (battleResult === 'attacker_win') intelligenceSuccess.attackerWin++;
      else if (battleResult === 'defender_win') intelligenceSuccess.defenderWin++;
      else if (battleResult === 'draw') intelligenceSuccess.draw++;
    }
    
    if (hasFailure) {
      if (battleResult === 'attacker_win') intelligenceFailure.attackerWin++;
      else if (battleResult === 'defender_win') intelligenceFailure.defenderWin++;
      else if (battleResult === 'draw') intelligenceFailure.draw++;
    }
    
    if (hasPartial) {
      if (battleResult === 'attacker_win') intelligencePartial.attackerWin++;
      else if (battleResult === 'defender_win') intelligencePartial.defenderWin++;
      else if (battleResult === 'draw') intelligencePartial.draw++;
    }
  }
  
  return { intelligenceSuccess, intelligenceFailure, intelligencePartial };
}

/**
 * Most effective intelligence types (sorted by success rate)
 */
export function getMostEffectiveIntelligenceTypes(events: Event[], minOperations = 2): IntelligenceStats[] {
  const stats = getAllIntelligenceStats(events);
  return stats
    .filter(s => s.totalOperations >= minOperations)
    .sort((a, b) => b.successRate - a.successRate);
}

/**
 * Most common intelligence types (sorted by operation count)
 */
export function getMostCommonIntelligenceTypes(events: Event[], limit = 5): IntelligenceStats[] {
  const stats = getAllIntelligenceStats(events);
  return stats
    .sort((a, b) => b.totalOperations - a.totalOperations)
    .slice(0, limit);
}

/**
 * Intelligence side analysis (who uses intelligence more)
 */
export type IntelligenceSideAnalysis = {
  totalOperations: number;
  attackerOperations: number;
  defenderOperations: number;
  bothSidesOperations: number;
  attackerWinRateWithIntel: number;
  defenderWinRateWithIntel: number;
};

/**
 * Analyze which side uses intelligence more effectively
 */
export function getIntelligenceSideAnalysis(events: Event[]): IntelligenceSideAnalysis {
  const battles = getBattles(events);
  const intelBattles = battles.filter(b => b.battle?.intelligence && b.battle.intelligence.length > 0);
  
  let attackerOperations = 0;
  let defenderOperations = 0;
  let bothSidesOperations = 0;
  
  let attackerWins = 0;
  let defenderWins = 0;
  let totalWithIntel = intelBattles.length;
  
  for (const battle of intelBattles) {
    const sides = new Set(battle.battle?.intelligence?.map(i => i.side) || []);
    
    if (sides.has('attacker') && !sides.has('defender')) {
      attackerOperations++;
      if (battle.battle?.result === 'attacker_win') attackerWins++;
    } else if (sides.has('defender') && !sides.has('attacker')) {
      defenderOperations++;
      if (battle.battle?.result === 'defender_win') defenderWins++;
    } else if (sides.has('both')) {
      bothSidesOperations++;
    }
  }
  
  const attackerOnly = intelBattles.filter(b => 
    b.battle?.intelligence?.some(i => i.side === 'attacker') && 
    !b.battle.intelligence.some(i => i.side === 'defender')
  );
  const defenderOnly = intelBattles.filter(b => 
    b.battle?.intelligence?.some(i => i.side === 'defender') && 
    !b.battle.intelligence.some(i => i.side === 'attacker')
  );
  
  return {
    totalOperations: intelBattles.length,
    attackerOperations,
    defenderOperations,
    bothSidesOperations,
    attackerWinRateWithIntel: attackerOnly.length > 0 
      ? (attackerOnly.filter(b => b.battle?.result === 'attacker_win').length / attackerOnly.length) * 100 
      : 0,
    defenderWinRateWithIntel: defenderOnly.length > 0 
      ? (defenderOnly.filter(b => b.battle?.result === 'defender_win').length / defenderOnly.length) * 100 
      : 0,
  };
}

/**
 * Generate intelligence-related historical insights
 */
export function getIntelligenceInsights(events: Event[]): string[] {
  const insights: string[] = [];
  const battles = getBattles(events);
  const intelBattles = battles.filter(b => b.battle?.intelligence && b.battle.intelligence.length > 0);
  
  if (intelBattles.length === 0) {
    return ['暂无情报活动相关数据'];
  }
  
  // Most common intelligence type
  const mostCommon = getMostCommonIntelligenceTypes(events, 1)[0];
  if (mostCommon && mostCommon.totalOperations > 0) {
    insights.push(`历史上最常用的情报手段是${mostCommon.label}，共有${mostCommon.totalOperations}次情报行动。`);
  }
  
  // Most effective intelligence type
  const mostEffective = getMostEffectiveIntelligenceTypes(events, 2)[0];
  if (mostEffective && mostEffective.successRate > 0) {
    insights.push(`${mostEffective.label}的成功率最高，达到${mostEffective.successRate.toFixed(1)}%，是最的情报战术。`);
  }
  
  // Intelligence and battle outcome correlation
  const correlation = getIntelligenceOutcomeCorrelation(events);
  const successWins = correlation.intelligenceSuccess.attackerWin + correlation.intelligenceSuccess.defenderWin;
  const failureWins = correlation.intelligenceFailure.attackerWin + correlation.intelligenceFailure.defenderWin;
  
  if (successWins > failureWins) {
    insights.push('情报活动成功的战役往往以进攻方或防守方的胜利告终，说明情报是决定战役胜负的关键因素之一。');
  }
  
  // Side analysis
  const sideAnalysis = getIntelligenceSideAnalysis(events);
  if (sideAnalysis.attackerOperations > sideAnalysis.defenderOperations) {
    insights.push(`进攻方更倾向于使用情报手段，共开展${sideAnalysis.attackerOperations}次情报行动。`);
  } else if (sideAnalysis.defenderOperations > sideAnalysis.attackerOperations) {
    insights.push(`防守方更注重情报工作，共开展${sideAnalysis.defenderOperations}次情报行动。`);
  }
  
  return insights;
}

/**
 * Complete intelligence summary
 */
export type IntelligenceSummary = {
  hasIntelligenceData: boolean;
  uniqueTypes: number;
  totalOperations: number;
  intelligenceStats: IntelligenceStats[];
  mostCommonTypes: IntelligenceStats[];
  mostEffectiveTypes: IntelligenceStats[];
  sideAnalysis: IntelligenceSideAnalysis;
  outcomeCorrelation: IntelligenceOutcomeCorrelation;
  insights: string[];
};

/**
 * Get complete intelligence analysis summary
 */
export function getIntelligenceSummary(events: Event[]): IntelligenceSummary {
  return {
    hasIntelligenceData: hasIntelligenceData(events),
    uniqueTypes: getUniqueIntelligenceTypes(events).length,
    totalOperations: getBattlesWithIntelligence(events).length,
    intelligenceStats: getAllIntelligenceStats(events),
    mostCommonTypes: getMostCommonIntelligenceTypes(events, 5),
    mostEffectiveTypes: getMostEffectiveIntelligenceTypes(events, 2),
    sideAnalysis: getIntelligenceSideAnalysis(events),
    outcomeCorrelation: getIntelligenceOutcomeCorrelation(events),
    insights: getIntelligenceInsights(events),
  };
}
