import type { Event, RiverOperationType, RiverOperationResult, RiverPosition } from './types';
import { getBattles } from './battles';

/**
 * Get Chinese label for river operation type
 */
export function getRiverOperationTypeLabel(type: RiverOperationType): string {
  const labels: Record<string, string> = {
    'river-crossing': '渡河作战',
    'pontoon-bridge': '浮桥渡河',
    'ford-crossing': '涉水渡河',
    'boat-crossing': '船只渡河',
    swimming: '游泳渡河',
    'naval-battle': '水战/海战',
    'river-ambush': '河湾伏击',
    'dam-flooding': '水攻/水淹',
    'island-attack': '岛屿进攻',
    'coastal-landing': '登陆作战',
    unknown: '未知',
  };
  return labels[type] || '';
}

/**
 * Get Chinese label for river operation result
 */
export function getRiverOperationResultLabel(result: RiverOperationResult): string {
  const labels: Record<string, string> = {
    success: '成功',
    failure: '失败',
    partial: '部分成功',
    delayed: '延误',
    unknown: '未知',
  };
  return labels[result] || '';
}

/**
 * Get Chinese label for river position
 */
export function getRiverPositionLabel(position: RiverPosition): string {
  const labels: Record<string, string> = {
    upstream: '上游（占据优势）',
    downstream: '下游',
    midstream: '中游',
    riverbank: '河岸',
    unknown: '未知',
  };
  return labels[position] || '';
}

/**
 * Get all unique river operation types from battles
 */
export function getUniqueRiverOperationTypes(events: Event[]): RiverOperationType[] {
  const battles = getBattles(events);
  const types = new Set<RiverOperationType>();
  
  for (const battle of battles) {
    const ops = battle.battle?.riverOperations;
    if (ops) {
      ops.forEach(op => types.add(op.type));
    }
  }
  
  return Array.from(types).sort();
}

/**
 * Check if there is river operation data available
 */
export function hasRiverOperationData(events: Event[]): boolean {
  const battles = getBattles(events);
  return battles.some(b => b.battle?.riverOperations && b.battle.riverOperations.length > 0);
}

/**
 * River operation statistics type
 */
export type RiverOperationStats = {
  type: RiverOperationType;
  label: string;
  totalOperations: number;
  successCount: number;
  failureCount: number;
  partialCount: number;
  delayedCount: number;
  unknownCount: number;
  successRate: number;
  attackerSide: number;
  defenderSide: number;
  bothSides: number;
  decisiveCount: number;
};

/**
 * Get statistics for a specific river operation type
 */
export function getRiverOperationStats(events: Event[], type: RiverOperationType): RiverOperationStats {
  const battles = getBattles(events);
  const operations = battles.flatMap(b => 
    (b.battle?.riverOperations || []).filter(op => op.type === type)
  );
  
  let successCount = 0;
  let failureCount = 0;
  let partialCount = 0;
  let delayedCount = 0;
  let unknownCount = 0;
  let attackerSide = 0;
  let defenderSide = 0;
  let bothSides = 0;
  let decisiveCount = 0;
  
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
      case 'delayed':
        delayedCount++;
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
    
    if (op.decisive) {
      decisiveCount++;
    }
  }
  
  const total = operations.length;
  const decided = successCount + failureCount;
  
  return {
    type,
    label: getRiverOperationTypeLabel(type),
    totalOperations: total,
    successCount,
    failureCount,
    partialCount,
    delayedCount,
    unknownCount,
    successRate: decided > 0 ? (successCount / decided) * 100 : 0,
    attackerSide,
    defenderSide,
    bothSides,
    decisiveCount,
  };
}

/**
 * Get all river operation type statistics
 */
export function getAllRiverOperationStats(events: Event[]): RiverOperationStats[] {
  const types = getUniqueRiverOperationTypes(events);
  return types.map(t => getRiverOperationStats(events, t));
}

/**
 * Get battles with river operations
 */
export function getBattlesWithRiverOperations(events: Event[]): Event[] {
  const battles = getBattles(events);
  return battles.filter(b => b.battle?.riverOperations && b.battle.riverOperations.length > 0);
}

/**
 * Get battles by river operation type
 */
export function getBattlesByRiverOperationType(events: Event[], type: RiverOperationType): Event[] {
  const battles = getBattles(events);
  return battles.filter(b => 
    b.battle?.riverOperations?.some(op => op.type === type)
  );
}

/**
 * Get battles by river operation result
 */
export function getBattlesByRiverOperationResult(events: Event[], result: RiverOperationResult): Event[] {
  const battles = getBattles(events);
  return battles.filter(b => 
    b.battle?.riverOperations?.some(op => op.result === result)
  );
}

/**
 * Get most common river operation types
 */
export function getMostCommonRiverOperationTypes(events: Event[], limit = 5): RiverOperationStats[] {
  const stats = getAllRiverOperationStats(events);
  return stats
    .sort((a, b) => b.totalOperations - a.totalOperations)
    .slice(0, limit);
}

/**
 * Get most effective river operation types (sorted by success rate)
 */
export function getMostEffectiveRiverOperationTypes(events: Event[], minOperations = 2): RiverOperationStats[] {
  const stats = getAllRiverOperationStats(events);
  return stats
    .filter(s => s.totalOperations >= minOperations)
    .sort((a, b) => b.successRate - a.successRate);
}

/**
 * River outcome correlation type
 */
export type RiverOutcomeCorrelation = {
  riverSuccess: {
    attackerWin: number;
    defenderWin: number;
    draw: number;
  };
  riverFailure: {
    attackerWin: number;
    defenderWin: number;
    draw: number;
  };
  riverPartial: {
    attackerWin: number;
    defenderWin: number;
    draw: number;
  };
};

/**
 * Analyze correlation between river operation success and battle outcome
 */
export function getRiverOutcomeCorrelation(events: Event[]): RiverOutcomeCorrelation {
  const battles = getBattles(events);
  const riverBattles = battles.filter(b => b.battle?.riverOperations && b.battle.riverOperations.length > 0);
  
  const riverSuccess = { attackerWin: 0, defenderWin: 0, draw: 0 };
  const riverFailure = { attackerWin: 0, defenderWin: 0, draw: 0 };
  const riverPartial = { attackerWin: 0, defenderWin: 0, draw: 0 };
  
  for (const battle of riverBattles) {
    const hasSuccess = battle.battle?.riverOperations?.some(op => op.result === 'success');
    const hasFailure = battle.battle?.riverOperations?.some(op => op.result === 'failure');
    const hasPartial = battle.battle?.riverOperations?.some(op => op.result === 'partial');
    
    const battleResult = battle.battle?.result;
    
    if (hasSuccess) {
      if (battleResult === 'attacker_win') riverSuccess.attackerWin++;
      else if (battleResult === 'defender_win') riverSuccess.defenderWin++;
      else if (battleResult === 'draw') riverSuccess.draw++;
    }
    
    if (hasFailure) {
      if (battleResult === 'attacker_win') riverFailure.attackerWin++;
      else if (battleResult === 'defender_win') riverFailure.defenderWin++;
      else if (battleResult === 'draw') riverFailure.draw++;
    }
    
    if (hasPartial) {
      if (battleResult === 'attacker_win') riverPartial.attackerWin++;
      else if (battleResult === 'defender_win') riverPartial.defenderWin++;
      else if (battleResult === 'draw') riverPartial.draw++;
    }
  }
  
  return { riverSuccess, riverFailure, riverPartial };
}

/**
 * River position advantage analysis
 */
export type RiverPositionAnalysis = {
  upstream: { total: number; attackerWin: number; defenderWin: number; draw: number };
  downstream: { total: number; attackerWin: number; defenderWin: number; draw: number };
  midstream: { total: number; attackerWin: number; defenderWin: number; draw: number };
  riverbank: { total: number; attackerWin: number; defenderWin: number; draw: number };
};

/**
 * Analyze river position advantage correlation with outcomes
 */
export function getRiverPositionAnalysis(events: Event[]): RiverPositionAnalysis {
  const battles = getBattles(events);
  const riverBattles = battles.filter(b => b.battle?.riverOperations && b.battle.riverOperations.length > 0);
  
  const upstream = { total: 0, attackerWin: 0, defenderWin: 0, draw: 0 };
  const downstream = { total: 0, attackerWin: 0, defenderWin: 0, draw: 0 };
  const midstream = { total: 0, attackerWin: 0, defenderWin: 0, draw: 0 };
  const riverbank = { total: 0, attackerWin: 0, defenderWin: 0, draw: 0 };
  
  for (const battle of riverBattles) {
    const positions = battle.battle?.riverOperations?.map(op => op.position).filter(Boolean) as RiverPosition[] || [];
    const battleResult = battle.battle?.result;
    
    for (const pos of positions) {
      if (pos === 'upstream') {
        upstream.total++;
        if (battleResult === 'attacker_win') upstream.attackerWin++;
        else if (battleResult === 'defender_win') upstream.defenderWin++;
        else if (battleResult === 'draw') upstream.draw++;
      } else if (pos === 'downstream') {
        downstream.total++;
        if (battleResult === 'attacker_win') downstream.attackerWin++;
        else if (battleResult === 'defender_win') downstream.defenderWin++;
        else if (battleResult === 'draw') downstream.draw++;
      } else if (pos === 'midstream') {
        midstream.total++;
        if (battleResult === 'attacker_win') midstream.attackerWin++;
        else if (battleResult === 'defender_win') midstream.defenderWin++;
        else if (battleResult === 'draw') midstream.draw++;
      } else if (pos === 'riverbank') {
        riverbank.total++;
        if (battleResult === 'attacker_win') riverbank.attackerWin++;
        else if (battleResult === 'defender_win') riverbank.defenderWin++;
        else if (battleResult === 'draw') riverbank.draw++;
      }
    }
  }
  
  return { upstream, downstream, midstream, riverbank };
}

/**
 * Get decisive river operation battles
 */
export function getDecisiveRiverOperationBattles(events: Event[]): Event[] {
  const battles = getBattles(events);
  return battles.filter(b => 
    b.battle?.riverOperations?.some(op => op.decisive === true)
  );
}

/**
 * Get battles involving water terrain
 */
export function getBattlesWithWaterTerrain(events: Event[]): Event[] {
  const battles = getBattles(events);
  return battles.filter(b => 
    b.battle?.terrain?.includes('water') || b.battle?.terrain?.includes('coastal')
  );
}

/**
 * River side analysis type
 */
export type RiverSideAnalysis = {
  totalBattles: number;
  attackerOperations: number;
  defenderOperations: number;
  bothSidesOperations: number;
  attackerWinRateWithRiver: number;
  defenderWinRateWithRiver: number;
  waterTerrainBattles: number;
};

/**
 * Analyze which side uses river operations more effectively
 */
export function getRiverSideAnalysis(events: Event[]): RiverSideAnalysis {
  const battles = getBattles(events);
  const riverBattles = battles.filter(b => b.battle?.riverOperations && b.battle.riverOperations.length > 0);
  const waterBattles = getBattlesWithWaterTerrain(events);
  
  let attackerOperations = 0;
  let defenderOperations = 0;
  let bothSidesOperations = 0;
  
  let attackerWins = 0;
  let defenderWins = 0;
  
  for (const battle of riverBattles) {
    const sides = new Set(battle.battle?.riverOperations?.map(op => op.side) || []);
    
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
  
  const attackerOnly = riverBattles.filter(b => 
    b.battle?.riverOperations?.some(op => op.side === 'attacker') && 
    !b.battle.riverOperations.some(op => op.side === 'defender')
  );
  const defenderOnly = riverBattles.filter(b => 
    b.battle?.riverOperations?.some(op => op.side === 'defender') && 
    !b.battle.riverOperations.some(op => op.side === 'attacker')
  );
  
  return {
    totalBattles: riverBattles.length,
    attackerOperations,
    defenderOperations,
    bothSidesOperations,
    attackerWinRateWithRiver: attackerOnly.length > 0 
      ? (attackerOnly.filter(b => b.battle?.result === 'attacker_win').length / attackerOnly.length) * 100 
      : 0,
    defenderWinRateWithRiver: defenderOnly.length > 0 
      ? (defenderOnly.filter(b => b.battle?.result === 'defender_win').length / defenderOnly.length) * 100 
      : 0,
    waterTerrainBattles: waterBattles.length,
  };
}

/**
 * Generate river operation-related historical insights
 */
export function getRiverOperationInsights(events: Event[]): string[] {
  const insights: string[] = [];
  const battles = getBattles(events);
  const riverBattles = battles.filter(b => b.battle?.riverOperations && b.battle.riverOperations.length > 0);
  const waterBattles = getBattlesWithWaterTerrain(events);
  
  if (riverBattles.length === 0 && waterBattles.length === 0) {
    return ['暂无渡河/水战相关数据'];
  }
  
  // Most common river operation type
  const mostCommon = getMostCommonRiverOperationTypes(events, 1)[0];
  if (mostCommon && mostCommon.totalOperations > 0) {
    insights.push(`历史上最常见的渡河/水战形式是${mostCommon.label}，共有${mostCommon.totalOperations}次作战记录。`);
  }
  
  // Most effective river operation type
  const mostEffective = getMostEffectiveRiverOperationTypes(events, 2)[0];
  if (mostEffective && mostEffective.successRate > 0) {
    insights.push(`${mostEffective.label}的成功率最高，达到${mostEffective.successRate.toFixed(1)}%，是最有效的水上战术。`);
  }
  
  // Water terrain battles
  if (waterBattles.length > 0) {
    insights.push(`共有${waterBattles.length}场战役发生在水域地形附近，体现了水系在古代战争中的重要战略意义。`);
  }
  
  // River position advantage
  const positionAnalysis = getRiverPositionAnalysis(events);
  if (positionAnalysis.upstream.total > 0) {
    const upstreamWinRate = positionAnalysis.upstream.total > 0 
      ? ((positionAnalysis.upstream.attackerWin + positionAnalysis.upstream.defenderWin) / positionAnalysis.upstream.total * 100).toFixed(1)
      : '0';
    insights.push(`占据上游位置的战役占${positionAnalysis.upstream.total}场，上游优势在古代水战中被广泛认知。`);
  }
  
  // River operations and battle outcome
  const correlation = getRiverOutcomeCorrelation(events);
  const successWins = correlation.riverSuccess.attackerWin + correlation.riverSuccess.defenderWin;
  const failureWins = correlation.riverFailure.attackerWin + correlation.riverFailure.defenderWin;
  
  if (successWins > failureWins) {
    insights.push('渡河/水战成功的战役往往以进攻方或防守方的胜利告终，说明水域控制是决定战役胜负的重要因素。');
  }
  
  // Side analysis
  const sideAnalysis = getRiverSideAnalysis(events);
  if (sideAnalysis.attackerOperations > sideAnalysis.defenderOperations) {
    insights.push(`进攻方更倾向于实施渡河作战，共开展${sideAnalysis.attackerOperations}次渡河行动。`);
  } else if (sideAnalysis.defenderOperations > sideAnalysis.attackerOperations) {
    insights.push(`防守方更注重水域防御，共开展${sideAnalysis.defenderOperations}次水域作战行动。`);
  }
  
  // Decisive river operations
  const decisiveBattles = getDecisiveRiverOperationBattles(events);
  if (decisiveBattles.length > 0) {
    insights.push(`有${decisiveBattles.length}场战役的渡河/水战操作起到了决定性作用，直接影响了战役结果。`);
  }
  
  return insights;
}

/**
 * Complete river operation summary
 */
export type RiverOperationSummary = {
  hasRiverOperationData: boolean;
  uniqueTypes: number;
  totalOperations: number;
  waterTerrainBattles: number;
  riverOperationStats: RiverOperationStats[];
  mostCommonTypes: RiverOperationStats[];
  mostEffectiveTypes: RiverOperationStats[];
  sideAnalysis: RiverSideAnalysis;
  positionAnalysis: RiverPositionAnalysis;
  outcomeCorrelation: RiverOutcomeCorrelation;
  decisiveBattles: number;
  insights: string[];
};

/**
 * Get complete river operation analysis summary
 */
export function getRiverOperationSummary(events: Event[]): RiverOperationSummary {
  return {
    hasRiverOperationData: hasRiverOperationData(events),
    uniqueTypes: getUniqueRiverOperationTypes(events).length,
    totalOperations: getBattlesWithRiverOperations(events).length,
    waterTerrainBattles: getBattlesWithWaterTerrain(events).length,
    riverOperationStats: getAllRiverOperationStats(events),
    mostCommonTypes: getMostCommonRiverOperationTypes(events, 5),
    mostEffectiveTypes: getMostEffectiveRiverOperationTypes(events, 2),
    sideAnalysis: getRiverSideAnalysis(events),
    positionAnalysis: getRiverPositionAnalysis(events),
    outcomeCorrelation: getRiverOutcomeCorrelation(events),
    decisiveBattles: getDecisiveRiverOperationBattles(events).length,
    insights: getRiverOperationInsights(events),
  };
}
