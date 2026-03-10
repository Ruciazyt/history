import type { Event } from './types';

/**
 * Filter events to get only battles (wars)
 */
export function getBattles(events: Event[]): Event[] {
  return events.filter((e) => e.tags?.includes('war'));
}

/**
 * Get battle label in Chinese
 */
export function getBattleResultLabel(result?: Event['battle']): string {
  if (!result) return '';
  const battleResult = result.result;
  if (!battleResult) return '';
  const labels: Record<string, string> = {
    attacker_win: '进攻方胜利',
    defender_win: '防守方胜利',
    draw: '平局',
    inconclusive: '胜负未明',
  };
  return labels[battleResult] || '';
}

/**
 * Sort battles by year (ascending by default)
 */
export function sortBattlesByYear(battles: Event[], ascending = true): Event[] {
  return [...battles].sort((a, b) => 
    ascending ? a.year - b.year : b.year - a.year
  );
}

/**
 * Get battles within a year range
 */
export function getBattlesByYearRange(
  events: Event[], 
  startYear: number, 
  endYear: number
): Event[] {
  const battles = getBattles(events);
  return battles.filter(b => b.year >= startYear && b.year <= endYear);
}

/**
 * Get attacker/defender name from a battle
 */
export function getBattleParties(battle: Event): { attacker?: string; defender?: string } {
  return {
    attacker: battle.battle?.belligerents?.attacker,
    defender: battle.battle?.belligerents?.defender,
  };
}

/**
 * Check if a battle has complete information
 */
export function isBattleComplete(battle: Event): boolean {
  const hasBelligerents = !!battle.battle?.belligerents?.attacker && 
                          !!battle.battle?.belligerents?.defender;
  const hasResult = !!battle.battle?.result;
  const hasLocation = !!battle.location;
  
  return hasBelligerents && hasResult && hasLocation;
}

/**
 * Separate events into battles and non-battles
 * Returns an object with battle and normal event arrays
 */
export function separateBattlesAndEvents(events: Event[]): { battles: Event[]; normalEvents: Event[] } {
  const battleIds = new Set(getBattles(events).map((b) => b.id));
  return {
    battles: events.filter((e) => battleIds.has(e.id)),
    normalEvents: events.filter((e) => !battleIds.has(e.id)),
  };
}

/**
 * Filter events that have valid location coordinates
 */
export function getMappableEvents(events: Event[]): Event[] {
  return events.filter(
    (e) => e.location && Number.isFinite(e.location.lon) && Number.isFinite(e.location.lat)
  );
}

/**
 * Statistics for battles
 */
export type BattleStats = {
  /** Total number of battles */
  total: number;
  /** Number of battles won by attacker */
  attackerWins: number;
  /** Number of battles won by defender */
  defenderWins: number;
  /** Number of draws */
  draws: number;
  /** Number of inconclusive results */
  inconclusive: number;
  /** Number of battles with unknown result */
  unknown: number;
};

/**
 * Calculate battle statistics
 */
export function getBattleStats(battles: Event[]): BattleStats {
  const stats: BattleStats = {
    total: battles.length,
    attackerWins: 0,
    defenderWins: 0,
    draws: 0,
    inconclusive: 0,
    unknown: 0,
  };

  for (const battle of battles) {
    const result = battle.battle?.result;
    switch (result) {
      case 'attacker_win':
        stats.attackerWins++;
        break;
      case 'defender_win':
        stats.defenderWins++;
        break;
      case 'draw':
        stats.draws++;
        break;
      case 'inconclusive':
        stats.inconclusive++;
        break;
      default:
        stats.unknown++;
    }
  }

  return stats;
}

/**
 * Battle count by era
 */
export type BattleCountByEra = {
  eraId: string;
  eraName: string;
  count: number;
};

/**
 * Get battle counts grouped by era
 */
export function getBattleCountByEra(battles: Event[], eras: { id: string; nameKey: string }[], t: (key: string) => string): BattleCountByEra[] {
  const counts = new Map<string, number>();

  for (const battle of battles) {
    const current = counts.get(battle.entityId) || 0;
    counts.set(battle.entityId, current + 1);
  }

  const result: BattleCountByEra[] = [];
  for (const era of eras) {
    const count = counts.get(era.id) || 0;
    if (count > 0) {
      result.push({
        eraId: era.id,
        eraName: t(era.nameKey),
        count,
      });
    }
  }

  // Sort by count descending
  result.sort((a, b) => b.count - a.count);
  return result;
}

/**
 * Timeline entry for battle timeline view
 */
export type BattleTimelineEntry = {
  battle: Event;
  eraName: string;
  eraColor: string;
};

/**
 * Get timeline color for era
 */
export function getEraColor(eraId: string): string {
  const colorMap: Record<string, string> = {
    'period-spring-autumn': '#3b82f6', // blue
    'period-warring-states': '#a855f7', // purple
    'qin': '#52525b', // zinc
    'han': '#dc2626', // red
    'wz-western-zhou': '#f59e0b', // amber
    'wz-eastern-zhou': '#f59e0b',
    'period-three-kingdoms': '#ef4444',
    'period-north-south': '#22c55e',
    'sui': '#14b8a6',
    'tang': '#f97316',
    'period-five-dynasties': '#ec4899',
    'song': '#8b5cf6',
    'yuan': '#06b6d4',
    'ming': '#eab308',
    'qing': '#65a30d',
  };
  return colorMap[eraId] || '#6b7280';
}

/**
 * Group battles by war name
 */
export type BattleWarGroup = {
  warName: string;
  battles: Event[];
};

/**
 * Group battles by war name if they have one
 */
export function groupBattlesByWar(battles: Event[]): BattleWarGroup[] {
  const warGroups = new Map<string, Event[]>();
  
  for (const battle of battles) {
    const warName = battle.battle?.warNameKey 
      ? battle.battle.warNameKey 
      : `独立战役`;
    
    if (!warGroups.has(warName)) {
      warGroups.set(warName, []);
    }
    warGroups.get(warName)!.push(battle);
  }
  
  // Sort battles within each war by year
  for (const [, warBattles] of warGroups) {
    warBattles.sort((a, b) => a.year - b.year);
  }
  
  // Sort wars by first battle year
  const result: BattleWarGroup[] = [];
  const sortedWars = Array.from(warGroups.entries()).sort(
    (a, b) => a[1][0].year - b[1][0].year
  );
  
  for (const [warName, warBattles] of sortedWars) {
    result.push({ warName, battles: warBattles });
  }
  
  return result;
}
