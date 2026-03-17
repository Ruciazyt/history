import type { AftermathType, AftermathSeverity, AftermathScope, Event } from './types';
import { getBattles } from './battles';

/**
 * Get aftermath type label in Chinese
 */
export function getAftermathTypeLabel(type?: AftermathType): string {
  if (!type) return '';
  const labels: Record<string, string> = {
    'territorial-change': '领土变化',
    'political-upheaval': '政治动荡',
    'dynastic-change': '朝代更替',
    'military-weakening': '军事衰弱',
    'military-strengthening': '军事增强',
    'economic-decline': '经济衰退',
    'economic-growth': '经济发展',
    'population-displacement': '人口迁移',
    'cultural-shift': '文化变迁',
    'treaty-signed': '条约签订',
    'system-collapse': '制度崩溃',
    'unification': '统一',
    'fragmentation': '分裂',
    'unknown': '未知',
  };
  return labels[type] || '';
}

/**
 * Get severity label in Chinese
 */
export function getSeverityLabel(severity?: AftermathSeverity): string {
  if (!severity) return '';
  const labels: Record<string, string> = {
    massive: '巨大',
    significant: '重大',
    moderate: '中等',
    minor: '轻微',
    unknown: '未知',
  };
  return labels[severity] || '';
}

/**
 * Get scope label in Chinese
 */
export function getScopeLabel(scope?: AftermathScope): string {
  if (!scope) return '';
  const labels: Record<string, string> = {
    continental: '全国',
    regional: '区域性',
    local: '局部',
    unknown: '未知',
  };
  return labels[scope] || '';
}

/**
 * Get all unique aftermath types from battles
 */
export function getUniqueAftermathTypes(events: Event[]): AftermathType[] {
  const battles = getBattles(events);
  const types = new Set<AftermathType>();
  
  for (const battle of battles) {
    const aftermath = battle.battle?.aftermath;
    if (aftermath) {
      aftermath.forEach(a => types.add(a.type));
    }
  }
  
  return Array.from(types).sort();
}

/**
 * Check if there is aftermath data available
 */
export function hasAftermathData(events: Event[]): boolean {
  const battles = getBattles(events);
  return battles.some(b => b.battle?.aftermath && b.battle.aftermath.length > 0);
}

/**
 * Aftermath statistics for a specific type
 */
export type AftermathTypeStats = {
  type: AftermathType;
  label: string;
  count: number;
  longTermCount: number;
  averageDuration?: number;
  severityBreakdown: Record<AftermathSeverity, number>;
  scopeBreakdown: Record<AftermathScope, number>;
};

/**
 * Get aftermath statistics for a specific type
 */
export function getAftermathTypeStats(events: Event[], type: AftermathType): AftermathTypeStats {
  const battles = getBattles(events);
  const filteredBattles = battles.filter(b => 
    b.battle?.aftermath?.some(a => a.type === type)
  );
  
  let longTermCount = 0;
  let totalDuration = 0;
  let durationCount = 0;
  const severityBreakdown: Record<AftermathSeverity, number> = {
    massive: 0,
    significant: 0,
    moderate: 0,
    minor: 0,
    unknown: 0,
  };
  const scopeBreakdown: Record<AftermathScope, number> = {
    continental: 0,
    regional: 0,
    local: 0,
    unknown: 0,
  };
  
  for (const battle of filteredBattles) {
    const aftermath = battle.battle?.aftermath?.filter(a => a.type === type);
    if (!aftermath) continue;
    
    for (const a of aftermath) {
      if (a.isLongTerm) longTermCount++;
      if (a.duration) {
        totalDuration += a.duration;
        durationCount++;
      }
      if (a.severity) {
        severityBreakdown[a.severity]++;
      }
      if (a.scope) {
        scopeBreakdown[a.scope]++;
      }
    }
  }
  
  return {
    type,
    label: getAftermathTypeLabel(type),
    count: filteredBattles.length,
    longTermCount,
    averageDuration: durationCount > 0 ? totalDuration / durationCount : undefined,
    severityBreakdown,
    scopeBreakdown,
  };
}

/**
 * Get all aftermath type statistics
 */
export function getAllAftermathTypeStats(events: Event[]): AftermathTypeStats[] {
  const types = getUniqueAftermathTypes(events);
  return types.map(t => getAftermathTypeStats(events, t));
}

/**
 * Get battles by aftermath type
 */
export function getBattlesByAftermathType(events: Event[], type: AftermathType): Event[] {
  const battles = getBattles(events);
  return battles.filter(b => b.battle?.aftermath?.some(a => a.type === type));
}

/**
 * Get most common aftermath types (sorted by count)
 */
export function getMostCommonAftermathTypes(events: Event[], limit = 5): AftermathTypeStats[] {
  const stats = getAllAftermathTypeStats(events);
  return stats
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Get battles with most severe aftermaths
 */
export function getMostSevereAftermathBattles(events: Event[], minSeverity: AftermathSeverity = 'moderate'): Event[] {
  const battles = getBattles(events);
  const severityOrder: AftermathSeverity[] = ['massive', 'significant', 'moderate', 'minor', 'unknown'];
  const minIndex = severityOrder.indexOf(minSeverity);
  
  return battles.filter(b => {
    const aftermath = b.battle?.aftermath;
    if (!aftermath || aftermath.length === 0) return false;
    
    return aftermath.some(a => {
      if (!a.severity) return minSeverity === 'unknown';
      return severityOrder.indexOf(a.severity) <= minIndex;
    });
  });
}

/**
 * Get long-term aftermaths
 */
export function getLongTermAftermathBattles(events: Event[]): Event[] {
  const battles = getBattles(events);
  return battles.filter(b => 
    b.battle?.aftermath?.some(a => a.isLongTerm === true)
  );
}

/**
 * Aftermath severity distribution
 */
export type AftermathSeverityDistribution = {
  severity: AftermathSeverity;
  label: string;
  count: number;
  percentage: number;
};

/**
 * Get overall severity distribution
 */
export function getAftermathSeverityDistribution(events: Event[]): AftermathSeverityDistribution[] {
  const battles = getBattles(events);
  const severityCounts: Record<AftermathSeverity, number> = {
    massive: 0,
    significant: 0,
    moderate: 0,
    minor: 0,
    unknown: 0,
  };
  
  let total = 0;
  for (const battle of battles) {
    const aftermath = battle.battle?.aftermath;
    if (!aftermath) continue;
    
    for (const a of aftermath) {
      total++;
      if (a.severity) {
        severityCounts[a.severity]++;
      } else {
        severityCounts.unknown++;
      }
    }
  }
  
  const severities: AftermathSeverity[] = ['massive', 'significant', 'moderate', 'minor', 'unknown'];
  return severities.map(s => ({
    severity: s,
    label: getSeverityLabel(s),
    count: severityCounts[s],
    percentage: total > 0 ? (severityCounts[s] / total) * 100 : 0,
  }));
}

/**
 * Aftermath scope distribution
 */
export type AftermathScopeDistribution = {
  scope: AftermathScope;
  label: string;
  count: number;
  percentage: number;
};

/**
 * Get overall scope distribution
 */
export function getAftermathScopeDistribution(events: Event[]): AftermathScopeDistribution[] {
  const battles = getBattles(events);
  const scopeCounts: Record<AftermathScope, number> = {
    continental: 0,
    regional: 0,
    local: 0,
    unknown: 0,
  };
  
  let total = 0;
  for (const battle of battles) {
    const aftermath = battle.battle?.aftermath;
    if (!aftermath) continue;
    
    for (const a of aftermath) {
      total++;
      if (a.scope) {
        scopeCounts[a.scope]++;
      } else {
        scopeCounts.unknown++;
      }
    }
  }
  
  const scopes: AftermathScope[] = ['continental', 'regional', 'local', 'unknown'];
  return scopes.map(s => ({
    scope: s,
    label: getScopeLabel(s),
    count: scopeCounts[s],
    percentage: total > 0 ? (scopeCounts[s] / total) * 100 : 0,
  }));
}

/**
 * Analyze correlation between battle result and aftermath type
 */
export type AftermathResultCorrelation = {
  aftermathType: AftermathType;
  label: string;
  attackerWinBattles: number;
  defenderWinBattles: number;
  attackerWinRate: number;
};

/**
 * Get aftermath-result correlation
 */
export function getAftermathResultCorrelation(events: Event[]): AftermathResultCorrelation[] {
  const types = getUniqueAftermathTypes(events);
  const result: AftermathResultCorrelation[] = [];
  
  for (const type of types) {
    const battles = getBattlesByAftermathType(events, type);
    let attackerWins = 0;
    let defenderWins = 0;
    
    for (const battle of battles) {
      const result = battle.battle?.result;
      if (result === 'attacker_win') {
        attackerWins++;
      } else if (result === 'defender_win') {
        defenderWins++;
      }
    }
    
    const decided = attackerWins + defenderWins;
    result.push({
      aftermathType: type,
      label: getAftermathTypeLabel(type),
      attackerWinBattles: attackerWins,
      defenderWinBattles: defenderWins,
      attackerWinRate: decided > 0 ? (attackerWins / decided) * 100 : 0,
    });
  }
  
  return result.sort((a, b) => b.attackerWinRate - a.attackerWinRate);
}

/**
 * Generate aftermath-related historical insights
 */
export function getAftermathInsights(events: Event[]): string[] {
  const insights: string[] = [];
  const stats = getAllAftermathTypeStats(events);
  const hasData = stats.some(s => s.count > 0);
  
  if (!hasData) {
    return ['暂无战役后果相关数据'];
  }
  
  // Most common aftermath type
  const mostCommon = [...stats].sort((a, b) => b.count - a.count)[0];
  if (mostCommon && mostCommon.count > 0) {
    insights.push(`历史上最常见的战役后果类型是${mostCommon.label}，共有${mostCommon.count}场战役产生了此类后果。`);
  }
  
  // Long-term aftermath analysis
  const longTermBattles = getLongTermAftermathBattles(events);
  if (longTermBattles.length > 0) {
    insights.push(`有${longTermBattles.length}场战役产生了长期影响，影响持续数十年甚至数百年。`);
  }
  
  // Most severe aftermaths
  const severeBattles = getMostSevereAftermathBattles(events, 'significant');
  if (severeBattles.length > 0) {
    insights.push(`${severeBattles.length}场战役产生了重大或巨大的历史性后果，彻底改变了历史进程。`);
  }
  
  // Scope analysis
  const scopeDist = getAftermathScopeDistribution(events);
  const continental = scopeDist.find(s => s.scope === 'continental');
  if (continental && continental.count > 0) {
    insights.push(`其中${continental.count}场战役的后果影响范围覆盖全国，影响深远。`);
  }
  
  return insights;
}

/**
 * Complete aftermath summary
 */
export type AftermathSummary = {
  hasAftermathData: boolean;
  uniqueAftermathTypes: number;
  totalBattlesWithAftermath: number;
  totalAftermathRecords: number;
  longTermAftermathCount: number;
  typeStats: AftermathTypeStats[];
  mostCommonTypes: AftermathTypeStats[];
  severityDistribution: AftermathSeverityDistribution[];
  scopeDistribution: AftermathScopeDistribution[];
  resultCorrelation: AftermathResultCorrelation[];
  insights: string[];
};

/**
 * Get complete aftermath analysis summary
 */
export function getAftermathSummary(events: Event[]): AftermathSummary {
  const battles = getBattles(events);
  const battlesWithAftermath = battles.filter(b => b.battle?.aftermath && b.battle.aftermath.length > 0);
  
  let totalAftermathRecords = 0;
  let longTermCount = 0;
  
  for (const battle of battlesWithAftermath) {
    const aftermath = battle.battle?.aftermath;
    if (aftermath) {
      totalAftermathRecords += aftermath.length;
      longTermCount += aftermath.filter(a => a.isLongTerm).length;
    }
  }
  
  return {
    hasAftermathData: hasAftermathData(events),
    uniqueAftermathTypes: getUniqueAftermathTypes(events).length,
    totalBattlesWithAftermath: battlesWithAftermath.length,
    totalAftermathRecords,
    longTermAftermathCount: longTermCount,
    typeStats: getAllAftermathTypeStats(events),
    mostCommonTypes: getMostCommonAftermathTypes(events, 5),
    severityDistribution: getAftermathSeverityDistribution(events),
    scopeDistribution: getAftermathScopeDistribution(events),
    resultCorrelation: getAftermathResultCorrelation(events),
    insights: getAftermathInsights(events),
  };
}
