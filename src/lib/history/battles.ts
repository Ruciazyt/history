import type { Event, BattleType, BattleImpact } from './types';

export type { Event };

/**
 * Filter events to get only battles (wars)
 */
export function getBattles(events: Event[]): Event[] {
  return events.filter((e) => e.tags?.includes('war'));
}

/**
 * Get battles from the same era (entityId) as a reference battle.
 * Excludes the reference battle itself.
 */
export function getSameEraBattles(events: Event[], referenceBattle: Event): Event[] {
  return events.filter(
    (e) => e.tags?.includes('war') && e.entityId === referenceBattle.entityId && e.id !== referenceBattle.id
  );
}

/**
 * Get battle label in Chinese
 */
export function getBattleResultLabel(result?: Event['battle']): string {
  if (!result) return '';
  const battleResult = result.result;
  if (!battleResult) return '';
  const keys: Record<string, string> = {
    attacker_win: 'battle.result.attacker_win',
    defender_win: 'battle.result.defender_win',
    draw: 'battle.result.draw',
    inconclusive: 'battle.result.inconclusive',
  };
  return keys[battleResult] || '';
}

/**
 * Get battle impact i18n key
 */
export function getBattleImpactLabel(impact?: string): string {
  if (!impact) return '';
  const keys: Record<string, string> = {
    decisive: 'battle.impact.decisive',
    major: 'battle.impact.major',
    minor: 'battle.impact.minor',
    unknown: 'battle.impact.unknown',
  };
  return keys[impact] || '';
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
 * Get a random battle from events.
 * Returns undefined if no battles exist in the events array.
 */
export function getRandomBattle(events: Event[]): Event | undefined {
  const battles = getBattles(events);
  if (battles.length === 0) return undefined;
  return battles[Math.floor(Math.random() * battles.length)];
}

/**
 * Get the "battle of the day" — a deterministic random battle seeded by date.
 * The same date always returns the same battle, making it suitable for
 * "今日战役" / "Battle of the Day" features.
 *
 * @param events  - Full event list
 * @param date    - Optional date for seeding (defaults to today).
 *                  Pass a custom Date to get a deterministic result for testing.
 */
export function getBattleOfTheDay(events: Event[], date?: Date): Event | undefined {
  const battles = getBattles(events);
  if (battles.length === 0) return undefined;

  const d = date ?? new Date();
  // Use year + month + day as a numeric seed so the same calendar day always
  // maps to the same battle index.
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  const index = seed % battles.length;
  return battles[index];
}

/**
 * Get battles for "历史上的今天" (Battle of This Day) feature.
 * Since battle data only contains year (not specific month/day), this function
 * uses the date to deterministically select a window of battles, giving the
 * illusion of "today's historical battles" in a fun, engaging way.
 *
 * Uses the date to generate a reproducible selection of 1-3 battles,
 * making each day feel like a curated historical moment.
 *
 * @param events  - Full event list
 * @param date    - Optional date (defaults to today)
 * @param limit   - Maximum number of battles to return (default 3)
 * @returns Deterministically-selected battles for the given date, sorted by year
 */
export function getBattlesOnThisDay(events: Event[], date?: Date, limit = 3): Event[] {
  const battles = getBattles(events);
  if (battles.length === 0) return [];

  const d = date ?? new Date();
  // Seed from year + month + day for deterministic daily selection
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();

  // Use seed to pick a sliding window start position
  const startIndex = seed % battles.length;
  const result: Event[] = [];

  // Collect up to `limit` battles wrapping around the array
  for (let i = 0; i < limit; i++) {
    const idx = (startIndex + i) % battles.length;
    if (battles[idx]) result.push(battles[idx]);
  }

  return result.sort((a, b) => a.year - b.year);
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
 * Get timeline color for era.
 * Must use the same era IDs as chinaEras.ts.
 */
export function getEraColor(eraId: string): string {
  const colorMap: Record<string, string> = {
    'wz-western-zhou': '#f59e0b', // amber
    'period-spring-autumn': '#3b82f6', // blue
    'period-warring-states': '#a855f7', // purple
    'qin': '#52525b', // zinc
    'han-western': '#dc2626', // red
    'han': '#dc2626', // alias
    'xin': '#eab308', // yellow
    'han-eastern': '#f97316', // orange
    'three-kingdoms': '#22c55e', // green
    'jin-western': '#06b6d4', // cyan
    'jin-eastern-16k': '#14b8a6', // teal
    'southern-northern': '#6366f1', // indigo
    'sui': '#ec4899', // pink
    'tang': '#f97316', // orange
    'five-dynasties-ten-kingdoms': '#ec4899', // pink
    'song': '#8b5cf6', // violet
    'yuan': '#06b6d4', // cyan
    'ming': '#d97706', // amber
    'qing': '#16a34a', // emerald
    'roc': '#2563eb', // blue
    'prc': '#dc2626', // red
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
  const sortedWars = Array.from(warGroups.entries())
    .filter(([, battles]) => battles.length > 0)
    .sort((a, b) => {
      const aFirst = a[1][0];
      const bFirst = b[1][0];
      return (aFirst?.year ?? 0) - (bFirst?.year ?? 0);
    });
  
  for (const [warName, warBattles] of sortedWars) {
    result.push({ warName, battles: warBattles });
  }
  
  return result;
}

/**
 * Battle search options
 */
export type BattleSearchOptions = {
  /** Search query - matches title, location label, or parties */
  query?: string;
  /** Filter by battle result */
  result?: ('attacker_win' | 'defender_win' | 'draw' | 'inconclusive')[];
  /** Filter by era IDs */
  eraIds?: string[];
  /** Filter by year range */
  yearRange?: { start: number; end: number };
};

/**
 * Search and filter battles
 */
export function searchBattles(
  battles: Event[], 
  options: BattleSearchOptions,
  t: (key: string) => string
): Event[] {
  let result = [...battles];

  // Filter by search query
  if (options.query && options.query.trim()) {
    const query = options.query.toLowerCase().trim();
    result = result.filter((battle) => {
      const title = t(battle.titleKey).toLowerCase();
      const location = battle.location?.label?.toLowerCase() || '';
      const attacker = battle.battle?.belligerents?.attacker?.toLowerCase() || '';
      const defender = battle.battle?.belligerents?.defender?.toLowerCase() || '';
      const warName = battle.battle?.warNameKey ? t(battle.battle.warNameKey).toLowerCase() : '';
      
      return (
        title.includes(query) ||
        location.includes(query) ||
        attacker.includes(query) ||
        defender.includes(query) ||
        warName.includes(query)
      );
    });
  }

  // Filter by result
  if (options.result && options.result.length > 0) {
    result = result.filter((battle) => 
      battle.battle?.result && options.result!.includes(battle.battle.result)
    );
  }

  // Filter by era
  if (options.eraIds && options.eraIds.length > 0) {
    result = result.filter((battle) => 
      options.eraIds!.includes(battle.entityId)
    );
  }

  // Filter by year range
  if (options.yearRange) {
    const { start, end } = options.yearRange;
    result = result.filter((battle) => battle.year >= start && battle.year <= end);
  }

  return result;
}

/**
 * Battle sort options
 */
export type BattleSortOption = 'year' | 'title' | 'result';

/**
 * Sort battles with custom comparator
 */
export function sortBattles(
  battles: Event[], 
  sortBy: BattleSortOption = 'year',
  ascending = true,
  t: (key: string) => string
): Event[] {
  const result = [...battles];
  
  result.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'year':
        comparison = a.year - b.year;
        break;
      case 'title':
        comparison = t(a.titleKey).localeCompare(t(b.titleKey));
        break;
      case 'result':
        const resultOrder = ['attacker_win', 'defender_win', 'draw', 'inconclusive'];
        const aIndex = a.battle?.result ? resultOrder.indexOf(a.battle.result) : 4;
        const bIndex = b.battle?.result ? resultOrder.indexOf(b.battle.result) : 4;
        comparison = aIndex - bIndex;
        break;
    }
    
    return ascending ? comparison : -comparison;
  });
  
  return result;
}

/**
 * Get unique battle participants (attackers and defenders)
 */
export function getUniqueParticipants(battles: Event[]): string[] {
  const participants = new Set<string>();
  
  for (const battle of battles) {
    if (battle.battle?.belligerents?.attacker) {
      participants.add(battle.battle.belligerents.attacker);
    }
    if (battle.battle?.belligerents?.defender) {
      participants.add(battle.battle.belligerents.defender);
    }
  }
  
  return Array.from(participants).sort();
}

/**
 * Get battles involving a specific participant
 */
export function getBattlesByParticipant(battles: Event[], participant: string): Event[] {
  const name = participant.toLowerCase();
  
  return battles.filter((battle) => {
    const attacker = battle.battle?.belligerents?.attacker?.toLowerCase() || '';
    const defender = battle.battle?.belligerents?.defender?.toLowerCase() || '';
    return attacker === name || defender === name;
  });
}

/**
 * Calculate win rate for a specific participant
 */
export function getParticipantStats(
  battles: Event[], 
  participant: string
): { total: number; wins: number; losses: number; draws: number; inconclusive: number } {
  const participantBattles = getBattlesByParticipant(battles, participant);
  
  const stats = {
    total: participantBattles.length,
    wins: 0,
    losses: 0,
    draws: 0,
    inconclusive: 0,
  };
  
  for (const battle of participantBattles) {
    const isAttacker = battle.battle?.belligerents?.attacker?.toLowerCase() === participant.toLowerCase();
    const result = battle.battle?.result;
    
    if (result === 'draw') {
      stats.draws++;
    } else if (result === 'inconclusive') {
      stats.inconclusive++;
    } else if (result === 'attacker_win') {
      if (isAttacker) {
        stats.wins++;
      } else {
        stats.losses++;
      }
    } else if (result === 'defender_win') {
      if (!isAttacker) {
        stats.wins++;
      } else {
        stats.losses++;
      }
    }
  }
  
  return stats;
}

/**
 * Battle comparison data structure
 */
export type BattleComparison = {
  battle1: Event;
  battle2: Event;
  comparison: {
    yearDiff: number;
    sameResult: boolean;
    sameWinnerSide: boolean | null; // 'attacker' | 'defender' | null (null if draw/inconclusive)
    sameEra: boolean;
    locationDistance?: number; // km
  };
};

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(
  lon1: number, 
  lat1: number, 
  lon2: number, 
  lat2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Compare two battles
 */
export function compareBattles(battle1: Event, battle2: Event): BattleComparison {
  const yearDiff = Math.abs(battle1.year - battle2.year);
  
  const result1 = battle1.battle?.result;
  const result2 = battle2.battle?.result;
  const sameResult = result1 === result2;
  
  // Determine winner side for each battle
  const getWinnerSide = (battle: Event): 'attacker' | 'defender' | null => {
    const result = battle.battle?.result;
    if (result === 'draw' || result === 'inconclusive' || !result) return null;
    return result === 'attacker_win' ? 'attacker' : 'defender';
  };
  
  const winner1 = getWinnerSide(battle1);
  const winner2 = getWinnerSide(battle2);
  
  // If either battle has no winner (draw/inconclusive), return null
  // Otherwise compare if they have the same winner side
  let sameWinnerSide: boolean | null = null;
  if (winner1 !== null && winner2 !== null) {
    sameWinnerSide = winner1 === winner2;
  }
  
  const sameEra = battle1.entityId === battle2.entityId;
  
  // Calculate distance if both have locations
  let locationDistance: number | undefined;
  if (battle1.location?.lon && battle1.location?.lat && 
      battle2.location?.lon && battle2.location?.lat) {
    locationDistance = calculateDistance(
      battle1.location.lon,
      battle1.location.lat,
      battle2.location.lon,
      battle2.location.lat
    );
  }
  
  return {
    battle1,
    battle2,
    comparison: {
      yearDiff,
      sameResult,
      sameWinnerSide,
      sameEra,
      locationDistance,
    },
  };
}

/**
 * Generate comparison summary text
 */
export function getComparisonSummary(
  comparison: BattleComparison['comparison']
): string[] {
  const summary: string[] = [];
  
  if (comparison.yearDiff > 0) {
    summary.push(`时间相差 ${comparison.yearDiff} 年`);
  } else {
    summary.push('同年发生');
  }
  
  if (comparison.sameEra) {
    summary.push('同一时期');
  }
  
  if (comparison.sameResult) {
    summary.push('结果相同');
  } else {
    summary.push('结果不同');
  }
  
  if (comparison.sameWinnerSide === true) {
    summary.push('胜利方相同');
  } else if (comparison.sameWinnerSide === false) {
    summary.push('胜利方不同');
  }
  
  if (comparison.locationDistance !== undefined) {
    if (comparison.locationDistance < 100) {
      summary.push('地理位置接近');
    } else {
      summary.push(`相距约 ${Math.round(comparison.locationDistance)} km`);
    }
  }
  
  return summary;
}

// ============ Seasonality Analysis ============

/**
 * Season types for ancient Chinese military analysis
 */
export type BattleSeason = 'spring' | 'summer' | 'autumn' | 'winter' | 'unknown';

/**
 * Seasonality data for battles
 */
export type BattleSeasonality = {
  season: BattleSeason;
  seasonName: string;
  count: number;
  percentage: number;
  attackerWins: number;
  defenderWins: number;
  draws: number;
};

/**
 * Get season from month (1-12)
 * Ancient Chinese military wisdom: 冬夏不兴兵 (no wars in winter/summer)
 */
export function getSeasonFromMonth(month: number): BattleSeason {
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  if (month === 12 || month === 1 || month === 2) return 'winter';
  return 'unknown';
}

/**
 * Get season name in Chinese
 */
export function getSeasonName(season: BattleSeason): string {
  const names: Record<BattleSeason, string> = {
    spring: '春季',
    summer: '夏季',
    autumn: '秋季',
    winter: '冬季',
    unknown: '未知',
  };
  return names[season];
}

/**
 * Get battle month from event (if available)
 * Events can have a month field or be inferred from other data
 */
export function getBattleMonth(battle: Event): number | null {
  // Check if month is directly available
  if (battle.month !== undefined) {
    return battle.month;
  }
  return null;
}

/**
 * Calculate battle seasonality statistics
 */
export function getBattleSeasonality(battles: Event[]): BattleSeasonality[] {
  const seasonCounts = new Map<BattleSeason, number>();
  const seasonWins = new Map<BattleSeason, number>();
  const seasonLosses = new Map<BattleSeason, number>();
  const seasonDraws = new Map<BattleSeason, number>();
  
  // Initialize all seasons
  const seasons: BattleSeason[] = ['spring', 'summer', 'autumn', 'winter', 'unknown'];
  for (const season of seasons) {
    seasonCounts.set(season, 0);
    seasonWins.set(season, 0);
    seasonLosses.set(season, 0);
    seasonDraws.set(season, 0);
  }
  
  let totalKnownSeason = 0;
  
  for (const battle of battles) {
    const month = getBattleMonth(battle);
    const season = month ? getSeasonFromMonth(month) : 'unknown';
    
    const currentCount = seasonCounts.get(season) || 0;
    seasonCounts.set(season, currentCount + 1);
    
    if (season !== 'unknown') {
      totalKnownSeason++;
    }
    
    // Track results by season
    const result = battle.battle?.result;
    if (result === 'attacker_win') {
      const wins = seasonWins.get(season) || 0;
      seasonWins.set(season, wins + 1);
    } else if (result === 'defender_win') {
      const wins = seasonWins.get(season) || 0;
      seasonWins.set(season, wins + 1);
    } else if (result === 'draw') {
      const draws = seasonDraws.get(season) || 0;
      seasonDraws.set(season, draws + 1);
    }
  }
  
  const result: BattleSeasonality[] = [];
  for (const season of seasons) {
    const count = seasonCounts.get(season) || 0;
    const percentage = totalKnownSeason > 0 && season !== 'unknown'
      ? (count / totalKnownSeason) * 100
      : 0;
    
    result.push({
      season,
      seasonName: getSeasonName(season),
      count,
      percentage: Math.round(percentage * 10) / 10,
      attackerWins: seasonWins.get(season) || 0,
      defenderWins: seasonWins.get(season) || 0, // Simplified - actual implementation would track separately
      draws: seasonDraws.get(season) || 0,
    });
  }
  
  // Sort by count descending, but put unknown last
  result.sort((a, b) => {
    if (a.season === 'unknown') return 1;
    if (b.season === 'unknown') return -1;
    return b.count - a.count;
  });
  
  return result;
}

/**
 * Get the most active battle season
 */
export function getMostActiveSeason(battles: Event[]): BattleSeasonality | null {
  const seasonality = getBattleSeasonality(battles);
  return seasonality.find(s => s.season !== 'unknown' && s.count > 0) || null;
}

// ============ Victory Pattern Analysis ============

/**
 * Victory pattern by side (attacker vs defender)
 */
export type VictoryPattern = {
  side: 'attacker' | 'defender';
  wins: number;
  losses: number;
  draws: number;
  inconclusive: number;
  total: number;
  winRate: number;
};

/**
 * Analyze overall attacker vs defender victory patterns
 */
export function getAttackerDefenderPattern(battles: Event[]): VictoryPattern[] {
  let attackerWins = 0;
  let attackerLosses = 0;
  let attackerDraws = 0;
  let attackerInconclusive = 0;
  
  let defenderWins = 0;
  let defenderLosses = 0;
  let defenderDraws = 0;
  let defenderInconclusive = 0;
  
  for (const battle of battles) {
    const result = battle.battle?.result;
    
    switch (result) {
      case 'attacker_win':
        attackerWins++;
        defenderLosses++;
        break;
      case 'defender_win':
        defenderWins++;
        attackerLosses++;
        break;
      case 'draw':
        attackerDraws++;
        defenderDraws++;
        break;
      case 'inconclusive':
        attackerInconclusive++;
        defenderInconclusive++;
        break;
    }
  }
  
  const attackerTotal = attackerWins + attackerLosses + attackerDraws + attackerInconclusive;
  const defenderTotal = defenderWins + defenderLosses + defenderDraws + defenderInconclusive;
  
  return [
    {
      side: 'attacker',
      wins: attackerWins,
      losses: attackerLosses,
      draws: attackerDraws,
      inconclusive: attackerInconclusive,
      total: attackerTotal,
      winRate: attackerTotal > 0 ? Math.round((attackerWins / attackerTotal) * 1000) / 10 : 0,
    },
    {
      side: 'defender',
      wins: defenderWins,
      losses: defenderLosses,
      draws: defenderDraws,
      inconclusive: defenderInconclusive,
      total: defenderTotal,
      winRate: defenderTotal > 0 ? Math.round((defenderWins / defenderTotal) * 1000) / 10 : 0,
    },
  ];
}

/**
 * Victory pattern by era
 */
export type EraVictoryPattern = {
  eraId: string;
  eraName: string;
  battles: number;
  attackerWins: number;
  defenderWins: number;
  draws: number;
  inconclusive: number;
  attackerWinRate: number;
};

/**
 * Get victory patterns grouped by era
 */
export function getVictoryPatternByEra(
  battles: Event[],
  eras: { id: string; nameKey: string }[],
  t: (key: string) => string
): EraVictoryPattern[] {
  const eraStats = new Map<string, { battles: number; attackerWins: number; defenderWins: number; draws: number; inconclusive: number }>();
  
  // Initialize all eras
  for (const era of eras) {
    eraStats.set(era.id, { battles: 0, attackerWins: 0, defenderWins: 0, draws: 0, inconclusive: 0 });
  }
  
  // Count battles by era
  for (const battle of battles) {
    const stats = eraStats.get(battle.entityId);
    if (!stats) continue;
    
    stats.battles++;
    const result = battle.battle?.result;
    
    if (result === 'attacker_win') stats.attackerWins++;
    else if (result === 'defender_win') stats.defenderWins++;
    else if (result === 'draw') stats.draws++;
    else if (result === 'inconclusive') stats.inconclusive++;
  }
  
  // Build result
  const result: EraVictoryPattern[] = [];
  for (const era of eras) {
    const stats = eraStats.get(era.id)!;
    if (stats.battles > 0) {
      const determined = stats.attackerWins + stats.defenderWins;
      result.push({
        eraId: era.id,
        eraName: t(era.nameKey),
        battles: stats.battles,
        attackerWins: stats.attackerWins,
        defenderWins: stats.defenderWins,
        draws: stats.draws,
        inconclusive: stats.inconclusive,
        attackerWinRate: determined > 0 ? Math.round((stats.attackerWins / determined) * 1000) / 10 : 0,
      });
    }
  }
  
  // Sort by battle count descending
  result.sort((a, b) => b.battles - a.battles);
  return result;
}

/**
 * Victory pattern by season
 */
export type SeasonVictoryPattern = {
  season: BattleSeason;
  seasonName: string;
  battles: number;
  attackerWins: number;
  defenderWins: number;
  draws: number;
  attackerWinRate: number;
};

/**
 * Get victory patterns by season
 */
export function getVictoryPatternBySeason(battles: Event[]): SeasonVictoryPattern[] {
  const seasonStats = new Map<BattleSeason, { battles: number; attackerWins: number; defenderWins: number; draws: number }>();
  
  const seasons: BattleSeason[] = ['spring', 'summer', 'autumn', 'winter'];
  for (const season of seasons) {
    seasonStats.set(season, { battles: 0, attackerWins: 0, defenderWins: 0, draws: 0 });
  }
  
  for (const battle of battles) {
    const month = getBattleMonth(battle);
    const season = month ? getSeasonFromMonth(month) : null;
    if (!season || season === 'unknown') continue;
    
    const stats = seasonStats.get(season)!;
    stats.battles++;
    
    const result = battle.battle?.result;
    if (result === 'attacker_win') stats.attackerWins++;
    else if (result === 'defender_win') stats.defenderWins++;
    else if (result === 'draw') stats.draws++;
  }
  
  const result: SeasonVictoryPattern[] = [];
  for (const season of seasons) {
    const stats = seasonStats.get(season)!;
    if (stats.battles > 0) {
      const determined = stats.attackerWins + stats.defenderWins;
      result.push({
        season,
        seasonName: getSeasonName(season),
        battles: stats.battles,
        attackerWins: stats.attackerWins,
        defenderWins: stats.defenderWins,
        draws: stats.draws,
        attackerWinRate: determined > 0 ? Math.round((stats.attackerWins / determined) * 1000) / 10 : 0,
      });
    }
  }
  
  return result;
}

/**
 * Key insight from battle analysis
 */
export type BattleInsight = {
  type: 'era_dominance' | 'season_advantage' | 'attacker_trend' | 'defender_trend';
  title: string;
  description: string;
  value: number; // percentage or count
};

/**
 * Generate key insights from battle data
 */
export function getBattleInsights(
  battles: Event[],
  eras: { id: string; nameKey: string }[],
  t: (key: string) => string
): BattleInsight[] {
  const insights: BattleInsight[] = [];
  
  // Get attacker/defender pattern
  const pattern = getAttackerDefenderPattern(battles);
  const attackerPattern = pattern.find(p => p.side === 'attacker')!;
  
  // Attacker vs Defender trend
  if (attackerPattern.total >= 3) {
    if (attackerPattern.winRate > 60) {
      insights.push({
        type: 'attacker_trend',
        title: '进攻方优势',
        description: `进攻方胜率${attackerPattern.winRate}%，明显高于防守方`,
        value: attackerPattern.winRate,
      });
    } else if (attackerPattern.winRate < 40) {
      insights.push({
        type: 'defender_trend',
        title: '防守方优势',
        description: `防守方胜率${100 - attackerPattern.winRate}%，明显高于进攻方`,
        value: 100 - attackerPattern.winRate,
      });
    }
  }
  
  // Season advantage
  const seasonPattern = getVictoryPatternBySeason(battles);
  const dominantSeason = seasonPattern.find(s => s.battles >= 2);
  if (dominantSeason) {
    insights.push({
      type: 'season_advantage',
      title: `${dominantSeason.seasonName}战役最多`,
      description: `该季节共发生${dominantSeason.battles}场战役`,
      value: dominantSeason.battles,
    });
  }
  
  // Era dominance
  const eraPattern = getVictoryPatternByEra(battles, eras, t);
  const dominantEra = eraPattern.find(e => e.battles >= 3);
  if (dominantEra) {
    insights.push({
      type: 'era_dominance',
      title: `${dominantEra.eraName}时期战役最多`,
      description: `该时期共发生${dominantEra.battles}场战役`,
      value: dominantEra.battles,
    });
  }
  
  return insights;
}

/**
 * Check if battles follow ancient Chinese military wisdom
 * (less activity in summer and winter)
 */
export function getSeasonalityInsight(battles: Event[]): {
  followsWisdom: boolean;
  summerPercentage: number;
  winterPercentage: number;
  autumnPercentage: number;
  springPercentage: number;
  insight: string;
} {
  const seasonality = getBattleSeasonality(battles);
  
  const getPercent = (season: BattleSeason) => {
    const s = seasonality.find(s => s.season === season);
    return s?.percentage || 0;
  };
  
  const summerPct = getPercent('summer');
  const winterPct = getPercent('winter');
  const autumnPct = getPercent('autumn');
  const springPct = getPercent('spring');
  
  // Ancient wisdom: 冬夏不兴兵 (no wars in winter/summer)
  // 春秋时节用兵 (wars in spring/autumn)
  const followsWisdom = (summerPct + winterPct) < (springPct + autumnPct);
  
  let insight = '';
  if (followsWisdom) {
    insight = '符合"冬夏不兴兵，春秋时节用兵"的古代军事思想';
  } else {
    insight = '打破了"冬夏不兴兵"的传统观念';
  }
  
  return {
    followsWisdom,
    summerPercentage: summerPct,
    winterPercentage: winterPct,
    autumnPercentage: autumnPct,
    springPercentage: springPct,
    insight,
  };
}

// ============ Geographic Region Analysis ============

/**
 * Geographic regions for ancient Chinese battles
 * Based on historical military geography
 */
export type BattleRegion = 
  | 'central-plains'   // 中原 - Central Henan area
  | 'jiangdong'        // 江东 - East of Yangtze (Jiangsu, Zhejiang)
  | 'sichuan'          // 四川盆地 - Sichuan Basin
  | 'northwest'        // 西北 - Shaanxi, Gansu
  | 'north-plains'     // 华北平原 - Hebei, Shanxi
  | 'south-yangtze'   // 江南 - South of Yangtze
  | 'lingnan'          //岭南 - Guangdong, Guangxi
  | 'yunnan-guizhou'   // 云南贵州
  | 'inner-mongolia'   // 塞北/内蒙古
  | 'korea'            // 朝鲜半岛
  | 'unknown';         // Unknown location

/**
 * Region metadata
 */
export type BattleRegionMeta = {
  id: BattleRegion;
  name: string;
  latRange: [number, number];  // approximate latitude range
  lonRange: [number, number]; // approximate longitude range
  description: string;
};

/**
 * All geographic regions with their definitions
 */
export const BATTLE_REGIONS: BattleRegionMeta[] = [
  {
    id: 'central-plains',
    name: '中原',
    latRange: [33, 36],
    lonRange: [110, 116],
    description: '中原核心地带',
  },
  {
    id: 'north-plains',
    name: '华北平原',
    latRange: [36, 40],
    lonRange: [113, 120],
    description: '河北、山东地区',
  },
  {
    id: 'northwest',
    name: '西北',
    latRange: [34, 42],
    lonRange: [100, 110],
    description: '关中、西北地区',
  },
  {
    id: 'jiangdong',
    name: '江东',
    latRange: [28, 33],
    lonRange: [116, 122],
    description: '江浙沪地区',
  },
  {
    id: 'south-yangtze',
    name: '江南',
    latRange: [24, 30],
    lonRange: [106, 120],
    description: '长江以南',
  },
  {
    id: 'sichuan',
    name: '四川',
    latRange: [26, 32],
    lonRange: [102, 110],
    description: '四川盆地',
  },
  {
    id: 'lingnan',
    name: '岭南',
    latRange: [20, 25],
    lonRange: [106, 115],
    description: '两广地区',
  },
  {
    id: 'yunnan-guizhou',
    name: '云贵',
    latRange: [22, 29],
    lonRange: [100, 110],
    description: '云南、贵州',
  },
  {
    id: 'inner-mongolia',
    name: '塞北',
    latRange: [38, 48],
    lonRange: [105, 125],
    description: '北方边疆',
  },
  {
    id: 'korea',
    name: '朝鲜半岛',
    latRange: [33, 43],
    lonRange: [124, 130],
    description: '朝鲜半岛',
  },
];

/**
 * Classify a battle location into a geographic region
 */
export function getBattleRegion(battle: Event): BattleRegion {
  const location = battle.location;
  if (!location?.lon || !location?.lat) {
    return 'unknown';
  }
  
  const lon = location.lon;
  const lat = location.lat;
  
  // Check each region's boundaries
  for (const region of BATTLE_REGIONS) {
    const [latMin, latMax] = region.latRange;
    const [lonMin, lonMax] = region.lonRange;
    
    if (lat >= latMin && lat <= latMax && lon >= lonMin && lon <= lonMax) {
      return region.id;
    }
  }
  
  // Default classification based on latitude for battles outside defined regions
  if (lat > 40) return 'inner-mongolia';
  if (lat < 24) return 'lingnan';
  
  return 'unknown';
}

/**
 * Get region name in Chinese
 */
export function getRegionName(regionId: BattleRegion): string {
  if (regionId === 'unknown') return '未知';
  const region = BATTLE_REGIONS.find(r => r.id === regionId);
  return region?.name || '未知';
}

/**
 * Battle count by region
 */
export type BattleCountByRegion = {
  regionId: BattleRegion;
  regionName: string;
  count: number;
  percentage: number;
  attackerWins: number;
  defenderWins: number;
  attackerWinRate: number;
};

/**
 * Get battle counts and win rates grouped by region
 */
export function getBattleCountByRegion(battles: Event[]): BattleCountByRegion[] {
  const regionStats = new Map<BattleRegion, {
    count: number;
    attackerWins: number;
    defenderWins: number;
  }>();
  
  // Initialize all regions
  for (const region of BATTLE_REGIONS) {
    regionStats.set(region.id, { count: 0, attackerWins: 0, defenderWins: 0 });
  }
  regionStats.set('unknown', { count: 0, attackerWins: 0, defenderWins: 0 });
  
  let totalWithLocation = 0;
  
  for (const battle of battles) {
    const region = getBattleRegion(battle);
    const stats = regionStats.get(region)!;
    
    stats.count++;
    if (region !== 'unknown') {
      totalWithLocation++;
    }
    
    const result = battle.battle?.result;
    if (result === 'attacker_win') {
      stats.attackerWins++;
    } else if (result === 'defender_win') {
      stats.defenderWins++;
    }
  }
  
  const result: BattleCountByRegion[] = [];
  for (const [regionId, stats] of regionStats) {
    if (stats.count > 0) {
      const determined = stats.attackerWins + stats.defenderWins;
      result.push({
        regionId,
        regionName: getRegionName(regionId),
        count: stats.count,
        percentage: totalWithLocation > 0 
          ? Math.round((stats.count / totalWithLocation) * 1000) / 10 
          : 0,
        attackerWins: stats.attackerWins,
        defenderWins: stats.defenderWins,
        attackerWinRate: determined > 0 
          ? Math.round((stats.attackerWins / determined) * 1000) / 10 
          : 0,
      });
    }
  }
  
  // Sort by count descending
  result.sort((a, b) => b.count - a.count);
  return result;
}

/**
 * Get battles within a specific region
 */
export function getBattlesByRegion(battles: Event[], region: BattleRegion): Event[] {
  return battles.filter(battle => getBattleRegion(battle) === region);
}

/**
 * Geographic insight about battles
 */
export type GeographicInsight = {
  type: 'most-battles-region' | 'attacker-favored-region' | 'defender-favored-region';
  title: string;
  description: string;
  regionName: string;
  value: number;
};

/**
 * Generate geographic insights from battle data
 */
export function getGeographicInsights(battles: Event[]): GeographicInsight[] {
  const insights: GeographicInsight[] = [];
  const regionStats = getBattleCountByRegion(battles);
  
  // Most battles region
  const mostBattles = regionStats.find(r => r.count >= 2);
  if (mostBattles) {
    insights.push({
      type: 'most-battles-region',
      title: '主战场',
      description: `${mostBattles.regionName}是最主要的战场，共发生${mostBattles.count}场战役`,
      regionName: mostBattles.regionName,
      value: mostBattles.count,
    });
  }
  
  // Attacker-favored region (high attacker win rate with sufficient battles)
  const attackerFavored = regionStats.find(r => r.count >= 2 && r.attackerWinRate > 60);
  if (attackerFavored) {
    insights.push({
      type: 'attacker-favored-region',
      title: '进攻方优势',
      description: `${attackerFavored.regionName}利于进攻方，进攻方胜率达${attackerFavored.attackerWinRate}%`,
      regionName: attackerFavored.regionName,
      value: attackerFavored.attackerWinRate,
    });
  }
  
  // Defender-favored region
  const defenderFavored = regionStats.find(r => r.count >= 2 && r.attackerWinRate < 40);
  if (defenderFavored) {
    insights.push({
      type: 'defender-favored-region',
      title: '防守方优势',
      description: `${defenderFavored.regionName}利于防守方，防守方胜率达${100 - defenderFavored.attackerWinRate}%`,
      regionName: defenderFavored.regionName,
      value: 100 - defenderFavored.attackerWinRate,
    });
  }
  
  return insights;
}

// ============ Battle Streak Analysis (连胜连败分析) ============

/**
 * A single battle result for streak tracking
 */
type BattleResult = {
  battle: Event;
  participant: 'attacker' | 'defender';
  result: 'win' | 'loss' | 'draw' | 'inconclusive';
  year: number;
};

/**
 * A streak of consecutive wins or losses
 */
export type BattleStreak = {
  participant: string;
  streakType: 'win' | 'loss';
  length: number;
  startYear: number;
  endYear: number;
  battles: Event[];
  isLongest: boolean;
};

/**
 * Participant streak statistics
 */
export type ParticipantStreakStats = {
  participant: string;
  longestWinStreak: number;
  longestLossStreak: number;
  currentWinStreak: number;
  currentLossStreak: number;
  winStreaks: BattleStreak[];
  lossStreaks: BattleStreak[];
};

/**
 * Track battle results for a specific participant
 */
function getParticipantBattleResults(battles: Event[], participant: string): BattleResult[] {
  const results: BattleResult[] = [];
  const sortedBattles = sortBattlesByYear(battles);
  
  for (const battle of sortedBattles) {
    const attacker = battle.battle?.belligerents?.attacker;
    const defender = battle.battle?.belligerents?.defender;
    const battleResult = battle.battle?.result;
    
    if (!attacker || !defender || !battleResult) continue;
    
    const participantLower = participant.toLowerCase();
    const attackerLower = attacker.toLowerCase();
    const defenderLower = defender.toLowerCase();
    
    if (attackerLower === participantLower) {
      results.push({
        battle,
        participant: 'attacker',
        result: battleResult === 'attacker_win' ? 'win' : 
                battleResult === 'defender_win' ? 'loss' : 
                battleResult === 'draw' ? 'draw' : 'inconclusive',
        year: battle.year,
      });
    } else if (defenderLower === participantLower) {
      results.push({
        battle,
        participant: 'defender',
        result: battleResult === 'defender_win' ? 'win' : 
                battleResult === 'attacker_win' ? 'loss' : 
                battleResult === 'draw' ? 'draw' : 'inconclusive',
        year: battle.year,
      });
    }
  }
  
  return results;
}

/**
 * Extract streaks from battle results
 */
function extractStreaks(results: BattleResult[], streakType: 'win' | 'loss'): BattleStreak[] {
  const streaks: BattleStreak[] = [];
  let currentStreak: BattleResult[] = [];
  
  for (const result of results) {
    if (result.result === streakType) {
      currentStreak.push(result);
    } else {
      // Streak broken
      if (currentStreak.length >= 2) {
        const firstBattle = currentStreak[0];
        const battleData = firstBattle?.battle?.battle;
        const belligerents = battleData?.belligerents;
        const participantSide = firstBattle?.participant === 'attacker' ? 'attacker' : 'defender';
        streaks.push({
          participant: belligerents?.[participantSide] ?? '',
          streakType,
          length: currentStreak.length,
          startYear: firstBattle?.year ?? 0,
          endYear: currentStreak[currentStreak.length - 1]?.year ?? 0,
          battles: currentStreak.map(r => r.battle),
          isLongest: false,
        });
      }
      currentStreak = [];
    }
  }
  
  // Handle last streak
  if (currentStreak.length >= 2) {
    const firstBattle = currentStreak[0];
    const battleData = firstBattle?.battle?.battle;
    const belligerents = battleData?.belligerents;
    const participantSide = firstBattle?.participant === 'attacker' ? 'attacker' : 'defender';
    streaks.push({
      participant: belligerents?.[participantSide] ?? '',
      streakType,
      length: currentStreak.length,
      startYear: firstBattle?.year ?? 0,
      endYear: currentStreak[currentStreak.length - 1]?.year ?? 0,
      battles: currentStreak.map(r => r.battle),
      isLongest: false,
    });
  }
  
  return streaks;
}

/**
 * Get streak statistics for a specific participant
 */
export function getParticipantStreakStats(battles: Event[], participant: string): ParticipantStreakStats {
  const results = getParticipantBattleResults(battles, participant);
  
  const winStreaks = extractStreaks(results, 'win');
  const lossStreaks = extractStreaks(results, 'loss');
  
  // Mark longest streaks
  let longestWin = 0;
  let longestLoss = 0;
  
  for (const streak of winStreaks) {
    if (streak.length > longestWin) {
      longestWin = streak.length;
    }
  }
  
  for (const streak of lossStreaks) {
    if (streak.length > longestLoss) {
      longestLoss = streak.length;
    }
  }
  
  for (const streak of winStreaks) {
    if (streak.length === longestWin && longestWin >= 2) {
      streak.isLongest = true;
    }
  }
  
  for (const streak of lossStreaks) {
    if (streak.length === longestLoss && longestLoss >= 2) {
      streak.isLongest = true;
    }
  }
  
  // Calculate current streak (from most recent battle)
  let currentWinStreak = 0;
  let currentLossStreak = 0;
  const reversedResults = [...results].reverse();
  
  for (const result of reversedResults) {
    if (result.result === 'win') {
      currentWinStreak++;
    } else if (result.result === 'loss') {
      currentLossStreak++;
    } else {
      break; // Streak broken by draw/inconclusive
    }
  }
  
  return {
    participant,
    longestWinStreak: longestWin,
    longestLossStreak: longestLoss,
    currentWinStreak,
    currentLossStreak,
    winStreaks,
    lossStreaks,
  };
}

/**
 * Get all participants with their streak statistics
 */
export function getAllParticipantsStreakStats(battles: Event[]): ParticipantStreakStats[] {
  const participants = getUniqueParticipants(battles);
  const stats: ParticipantStreakStats[] = [];
  
  for (const participant of participants) {
    const participantStats = getParticipantStreakStats(battles, participant);
    // Only include participants with at least 2 battles
    if (participantStats.longestWinStreak >= 2 || participantStats.longestLossStreak >= 2) {
      stats.push(participantStats);
    }
  }
  
  // Sort by longest win streak descending
  stats.sort((a, b) => b.longestWinStreak - a.longestWinStreak);
  
  return stats;
}

/**
 * Get top streaks across all participants
 */
export function getTopStreaks(battles: Event[], limit = 5): BattleStreak[] {
  const allStats = getAllParticipantsStreakStats(battles);
  const allStreaks: BattleStreak[] = [];
  
  for (const stats of allStats) {
    allStreaks.push(...stats.winStreaks, ...stats.lossStreaks);
  }
  
  // Sort by length descending
  allStreaks.sort((a, b) => b.length - a.length);
  
  return allStreaks.slice(0, limit);
}

/**
 * Streak insight type
 */
export type StreakInsight = {
  type: 'dominant-force' | 'turning-point' | 'historical-pattern';
  title: string;
  description: string;
  participant?: string;
  streak?: BattleStreak;
  value: number;
};

/**
 * Generate insights from streak analysis
 */
export function getStreakInsights(battles: Event[]): StreakInsight[] {
  const insights: StreakInsight[] = [];
  const allStats = getAllParticipantsStreakStats(battles);
  
  if (allStats.length === 0) return insights;
  
  // Find dominant force (longest win streak)
  const dominantForce = allStats.find(s => s.longestWinStreak >= 3);
  if (dominantForce) {
    const streak = dominantForce.winStreaks.find(s => s.isLongest);
    insights.push({
      type: 'dominant-force',
      title: '连胜霸主',
      description: `${dominantForce.participant}曾在历史上创造${dominantForce.longestWinStreak}连胜的辉煌战绩`,
      participant: dominantForce.participant,
      streak,
      value: dominantForce.longestWinStreak,
    });
  }
  
  // Find significant loss streaks (3+ consecutive losses)
  const losingStreak = allStats.find(s => s.longestLossStreak >= 3);
  if (losingStreak) {
    const streak = losingStreak.lossStreaks.find(s => s.isLongest);
    insights.push({
      type: 'historical-pattern',
      title: '连败记录',
      description: `${losingStreak.participant}曾遭遇${losingStreak.longestLossStreak}连败`,
      participant: losingStreak.participant,
      streak,
      value: losingStreak.longestLossStreak,
    });
  }
  
  return insights;
}

// ============ Commander Analysis (指挥官分析) ============

/**
 * Commander statistics
 */
export type CommanderStats = {
  name: string;
  totalBattles: number;
  wins: number;
  losses: number;
  draws: number;
  inconclusive: number;
  winRate: number;
  firstBattleYear: number;
  lastBattleYear: number;
  battles: Event[];
  side: 'attacker' | 'defender' | 'both';
};

/**
 * Get all unique commanders from battles
 */
export function getUniqueCommanders(battles: Event[]): string[] {
  const commanders = new Set<string>();
  
  for (const battle of battles) {
    const cmd = battle.battle?.commanders;
    if (cmd?.attacker) {
      for (const name of cmd.attacker) {
        if (name) commanders.add(name);
      }
    }
    if (cmd?.defender) {
      for (const name of cmd.defender) {
        if (name) commanders.add(name);
      }
    }
  }
  
  return Array.from(commanders).sort();
}

/**
 * Get battles involving a specific commander
 */
export function getBattlesByCommander(battles: Event[], commander: string): {
  battle: Event;
  side: 'attacker' | 'defender';
}[] {
  const results: { battle: Event; side: 'attacker' | 'defender' }[] = [];
  const commanderLower = commander.toLowerCase();
  
  for (const battle of battles) {
    const cmd = battle.battle?.commanders;
    if (cmd?.attacker) {
      for (const name of cmd.attacker) {
        if (name?.toLowerCase() === commanderLower) {
          results.push({ battle, side: 'attacker' });
        }
      }
    }
    if (cmd?.defender) {
      for (const name of cmd.defender) {
        if (name?.toLowerCase() === commanderLower) {
          results.push({ battle, side: 'defender' });
        }
      }
    }
  }
  
  return results;
}

/**
 * Get commander statistics
 */
export function getCommanderStats(battles: Event[], commander: string): CommanderStats {
  const commanderBattles = getBattlesByCommander(battles, commander);
  
  let wins = 0;
  let losses = 0;
  let draws = 0;
  let inconclusive = 0;
  let asAttacker = 0;
  let asDefender = 0;
  
  const sortedBattles = [...commanderBattles].sort((a, b) => a.battle.year - b.battle.year);
  let firstBattleYear = 0;
  let lastBattleYear = 0;
  
  if (sortedBattles.length > 0) {
    firstBattleYear = sortedBattles[0]?.battle?.year ?? 0;
    lastBattleYear = sortedBattles[sortedBattles.length - 1]?.battle?.year ?? 0;
  }
  
  for (const { battle, side } of commanderBattles) {
    const result = battle.battle?.result;
    
    if (side === 'attacker') {
      asAttacker++;
    } else {
      asDefender++;
    }
    
    if (result === 'attacker_win') {
      if (side === 'attacker') wins++;
      else losses++;
    } else if (result === 'defender_win') {
      if (side === 'defender') wins++;
      else losses++;
    } else if (result === 'draw') {
      draws++;
    } else {
      inconclusive++;
    }
  }
  
  const total = wins + losses + draws + inconclusive;
  const determined = wins + losses;
  
  let side: 'attacker' | 'defender' | 'both' = 'both';
  if (asAttacker > 0 && asDefender === 0) side = 'attacker';
  else if (asDefender > 0 && asAttacker === 0) side = 'defender';
  
  return {
    name: commander,
    totalBattles: total,
    wins,
    losses,
    draws,
    inconclusive,
    winRate: determined > 0 ? Math.round((wins / determined) * 1000) / 10 : 0,
    firstBattleYear,
    lastBattleYear,
    battles: commanderBattles.map(c => c.battle),
    side,
  };
}

/**
 * Get statistics for all commanders
 */
export function getAllCommandersStats(battles: Event[]): CommanderStats[] {
  const commanders = getUniqueCommanders(battles);
  const stats: CommanderStats[] = [];
  
  for (const commander of commanders) {
    const commanderStats = getCommanderStats(battles, commander);
    // Only include commanders with at least 1 battle
    if (commanderStats.totalBattles > 0) {
      stats.push(commanderStats);
    }
  }
  
  // Sort by win rate (with at least 1 battle), then by total battles
  stats.sort((a, b) => {
    if (b.totalBattles !== a.totalBattles) {
      return b.totalBattles - a.totalBattles;
    }
    return b.winRate - a.winRate;
  });
  
  return stats;
}

/**
 * Top commanders by win rate (minimum 1 battle)
 */
export function getTopCommanders(battles: Event[], limit = 10): CommanderStats[] {
  const allStats = getAllCommandersStats(battles);
  return allStats.slice(0, limit);
}

/**
 * Most experienced commanders (most battles)
 */
export function getMostExperiencedCommanders(battles: Event[], limit = 10): CommanderStats[] {
  const allStats = getAllCommandersStats(battles);
  return allStats
    .sort((a, b) => b.totalBattles - a.totalBattles)
    .slice(0, limit);
}

/**
 * Commander insight type
 */
export type CommanderInsight = {
  type: 'legendary-commander' | 'undefeated' | 'most-experienced' | 'battlefield-star';
  title: string;
  description: string;
  commander?: CommanderStats;
  value: number;
};

/**
 * Generate insights from commander analysis
 */
export function getCommanderInsights(battles: Event[]): CommanderInsight[] {
  const insights: CommanderInsight[] = [];
  const allStats = getAllCommandersStats(battles);
  
  if (allStats.length === 0) return insights;
  
  // Legendary commander (highest win rate with at least 2 battles)
  const legendary = allStats.find(s => s.totalBattles >= 2 && s.winRate >= 70);
  if (legendary) {
    insights.push({
      type: 'legendary-commander',
      title: '传奇名将',
      description: `${legendary.name}参与${legendary.totalBattles}场战役，胜率高达${legendary.winRate}%`,
      commander: legendary,
      value: legendary.winRate,
    });
  }
  
  // Undefeated commander (at least 2 battles, no losses)
  const undefeated = allStats.find(s => s.totalBattles >= 2 && s.losses === 0 && s.wins > 0);
  if (undefeated) {
    insights.push({
      type: 'undefeated',
      title: '常胜将军',
      description: `${undefeated.name}保持${undefeated.totalBattles}战全胜的不败纪录`,
      commander: undefeated,
      value: undefeated.totalBattles,
    });
  }
  
  // Most experienced
  const experienced = allStats.find(s => s.totalBattles >= 2);
  if (experienced) {
    insights.push({
      type: 'most-experienced',
      title: '身经百战',
      description: `${experienced.name}参与战役最多，共${experienced.totalBattles}场`,
      commander: experienced,
      value: experienced.totalBattles,
    });
  }
  
  return insights;
}

/**
 * Check if battles have commander data
 */
export function hasCommanderData(battles: Event[]): boolean {
  return battles.some(b => 
    (b.battle?.commanders?.attacker?.length ?? 0) > 0 ||
    (b.battle?.commanders?.defender?.length ?? 0) > 0
  );
}

// ==================== Battle Type Analysis ====================

/** Battle type statistics */
export type BattleTypeStats = {
  type: BattleType;
  typeName: string;
  total: number;
  attackerWins: number;
  defenderWins: number;
  draws: number;
  inconclusive: number;
  attackerWinRate: number;
  defenderWinRate: number;
};

/**
 * Get Chinese name for battle type
 */
export function getBattleTypeName(type: BattleType): string {
  const keys: Record<BattleType, string> = {
    'founding': 'battle.type.founding',
    'unification': 'battle.type.unification',
    'conquest': 'battle.type.conquest',
    'defense': 'battle.type.defense',
    'rebellion': 'battle.type.rebellion',
    'civil-war': 'battle.type.civil_war',
    'frontier': 'battle.type.frontier',
    'invasion': 'battle.type.invasion',
    'unknown': 'battle.type.unknown',
  };
  return keys[type] || 'battle.type.unknown';
}

/**
 * Get all unique battle types present in the data
 */
export function getBattleTypesPresent(battles: Event[]): BattleType[] {
  const types = new Set<BattleType>();
  for (const battle of battles) {
    if (battle.battle?.battleType) {
      types.add(battle.battle.battleType);
    }
  }
  return Array.from(types);
}

/**
 * Get battles filtered by type
 */
export function getBattlesByType(battles: Event[], battleType: BattleType): Event[] {
  return battles.filter(b => b.battle?.battleType === battleType);
}

/**
 * Calculate statistics for a specific battle type
 */
export function getStatsByBattleType(battles: Event[], battleType: BattleType): BattleTypeStats {
  const typeBattles = getBattlesByType(battles, battleType);
  
  let attackerWins = 0;
  let defenderWins = 0;
  let draws = 0;
  let inconclusive = 0;
  
  for (const battle of typeBattles) {
    const result = battle.battle?.result;
    switch (result) {
      case 'attacker_win':
        attackerWins++;
        break;
      case 'defender_win':
        defenderWins++;
        break;
      case 'draw':
        draws++;
        break;
      case 'inconclusive':
        inconclusive++;
        break;
    }
  }
  
  const total = typeBattles.length;
  const knownResults = attackerWins + defenderWins + draws + inconclusive;
  
  return {
    type: battleType,
    typeName: getBattleTypeName(battleType),
    total,
    attackerWins,
    defenderWins,
    draws,
    inconclusive,
    attackerWinRate: knownResults > 0 ? (attackerWins / knownResults) * 100 : 0,
    defenderWinRate: knownResults > 0 ? (defenderWins / knownResults) * 100 : 0,
  };
}

/**
 * Get statistics for all battle types
 */
export function getAllBattleTypesStats(battles: Event[]): BattleTypeStats[] {
  const types = getBattleTypesPresent(battles);
  return types.map(type => getStatsByBattleType(battles, type))
    .sort((a, b) => b.total - a.total);
}

/** Battle impact level statistics */
export type BattleImpactStats = {
  impact: BattleImpact;
  impactName: string;
  total: number;
  attackerWins: number;
  defenderWins: number;
  draws: number;
  inconclusive: number;
  attackerWinRate: number;
  defenderWinRate: number;
};

/**
 * Get Chinese name for battle impact
 */
export function getBattleImpactName(impact: BattleImpact): string {
  const names: Record<BattleImpact, string> = {
    'decisive': '决定性战役',
    'major': '重要战役',
    'minor': '小型战役',
    'unknown': '未知影响',
  };
  return names[impact] || '未知影响';
}

/**
 * Get all unique battle impacts present in the data
 */
export function getBattleImpactsPresent(battles: Event[]): BattleImpact[] {
  const impacts = new Set<BattleImpact>();
  for (const battle of battles) {
    if (battle.battle?.impact) {
      impacts.add(battle.battle.impact);
    }
  }
  return Array.from(impacts);
}

/**
 * Get battles filtered by impact level
 */
export function getBattlesByImpact(battles: Event[], impact: BattleImpact): Event[] {
  return battles.filter(b => b.battle?.impact === impact);
}

/**
 * Calculate statistics for a specific battle impact level
 */
export function getStatsByBattleImpact(battles: Event[], impact: BattleImpact): BattleImpactStats {
  const impactBattles = getBattlesByImpact(battles, impact);
  
  let attackerWins = 0;
  let defenderWins = 0;
  let draws = 0;
  let inconclusive = 0;
  
  for (const battle of impactBattles) {
    const result = battle.battle?.result;
    switch (result) {
      case 'attacker_win':
        attackerWins++;
        break;
      case 'defender_win':
        defenderWins++;
        break;
      case 'draw':
        draws++;
        break;
      case 'inconclusive':
        inconclusive++;
        break;
    }
  }
  
  const total = impactBattles.length;
  const knownResults = attackerWins + defenderWins + draws + inconclusive;
  
  return {
    impact,
    impactName: getBattleImpactName(impact),
    total,
    attackerWins,
    defenderWins,
    draws,
    inconclusive,
    attackerWinRate: knownResults > 0 ? (attackerWins / knownResults) * 100 : 0,
    defenderWinRate: knownResults > 0 ? (defenderWins / knownResults) * 100 : 0,
  };
}

/**
 * Get statistics for all battle impact levels
 */
export function getAllBattleImpactsStats(battles: Event[]): BattleImpactStats[] {
  const impacts = getBattleImpactsPresent(battles);
  return impacts.map(impact => getStatsByBattleImpact(battles, impact))
    .sort((a, b) => b.total - a.total);
}

/** Combined battle type and impact analysis */
export type BattleTypeImpactAnalysis = {
  type: BattleType;
  impact: BattleImpact;
  count: number;
  attackerWins: number;
  defenderWins: number;
};

/**
 * Get cross-analysis of battle types and impacts
 */
export function getBattleTypeImpactMatrix(battles: Event[]): BattleTypeImpactAnalysis[] {
  const matrix: BattleTypeImpactAnalysis[] = [];
  const types = getBattleTypesPresent(battles);
  const impacts = getBattleImpactsPresent(battles);
  
  for (const type of types) {
    for (const impact of impacts) {
      const filtered = battles.filter(
        b => b.battle?.battleType === type && b.battle?.impact === impact
      );
      
      if (filtered.length > 0) {
        let attackerWins = 0;
        let defenderWins = 0;
        
        for (const battle of filtered) {
          if (battle.battle?.result === 'attacker_win') attackerWins++;
          else if (battle.battle?.result === 'defender_win') defenderWins++;
        }
        
        matrix.push({
          type,
          impact,
          count: filtered.length,
          attackerWins,
          defenderWins,
        });
      }
    }
  }
  
  return matrix.sort((a, b) => b.count - a.count);
}

/** Battle type insight */
export type BattleTypeInsight = {
  type: BattleType;
  typeName: string;
  insight: string;
  confidence: 'high' | 'medium' | 'low';
};

/**
 * Generate insights about battle types
 */
export function getBattleTypeInsights(battles: Event[]): BattleTypeInsight[] {
  const insights: BattleTypeInsight[] = [];
  const stats = getAllBattleTypesStats(battles);
  
  for (const stat of stats) {
    if (stat.total < 2) continue;
    
    const { type, typeName, attackerWinRate, defenderWinRate, total } = stat;
    
    // High confidence insights (lots of data)
    if (total >= 3) {
      if (attackerWinRate > 70) {
        insights.push({
          type,
          typeName,
          insight: `${typeName}通常由进攻方主导，进攻方胜率高达${attackerWinRate.toFixed(1)}%`,
          confidence: 'high',
        });
      } else if (defenderWinRate > 70) {
        insights.push({
          type,
          typeName,
          insight: `${typeName}往往是防守方的天下，防守方胜率达${defenderWinRate.toFixed(1)}%`,
          confidence: 'high',
        });
      } else if (attackerWinRate > 50) {
        insights.push({
          type,
          typeName,
          insight: `${typeName}中进攻方略占优势，胜率${attackerWinRate.toFixed(1)}%`,
          confidence: 'medium',
        });
      } else if (defenderWinRate > 50) {
        insights.push({
          type,
          typeName,
          insight: `${typeName}中防守方略有优势，胜率${defenderWinRate.toFixed(1)}%`,
          confidence: 'medium',
        });
      }
    } else {
      // Lower confidence for fewer battles
      if (attackerWinRate > 50) {
        insights.push({
          type,
          typeName,
          insight: `${typeName}初步显示进攻方有一定优势`,
          confidence: 'low',
        });
      } else if (defenderWinRate > 50) {
        insights.push({
          type,
          typeName,
          insight: `${typeName}初步显示防守方有一定优势`,
          confidence: 'low',
        });
      }
    }
  }
  
  return insights;
}

/**
 * Get most common battle type
 */
export function getMostCommonBattleType(battles: Event[]): BattleTypeStats | null {
  const stats = getAllBattleTypesStats(battles);
  return stats.length > 0 ? (stats[0] ?? null) : null;
}

/**
 * Get battle type with highest attacker win rate
 */
export function getMostAggressiveBattleType(battles: Event[]): BattleTypeStats | null {
  const stats = getAllBattleTypesStats(battles);
  return stats.reduce((max, stat) => 
    stat.attackerWinRate > (max?.attackerWinRate ?? 0) ? stat : max
  , null as BattleTypeStats | null);
}

/**
 * Get battle type with highest defender win rate
 */
export function getMostDefensiveBattleType(battles: Event[]): BattleTypeStats | null {
  const stats = getAllBattleTypesStats(battles);
  return stats.reduce((max, stat) => 
    stat.defenderWinRate > (max?.defenderWinRate ?? 0) ? stat : max
  , null as BattleTypeStats | null);
}

/** Battle impact insight */
export type BattleImpactInsight = {
  impact: BattleImpact;
  impactName: string;
  insight: string;
  confidence: 'high' | 'medium' | 'low';
};

/**
 * Generate insights about battle impacts
 */
export function getBattleImpactInsights(battles: Event[]): BattleImpactInsight[] {
  const insights: BattleImpactInsight[] = [];
  const stats = getAllBattleImpactsStats(battles);
  
  for (const stat of stats) {
    if (stat.total < 2) continue;
    
    const { impact, impactName, attackerWinRate, defenderWinRate, total } = stat;
    
    // Generate insights based on impact level
    if (total >= 3) {
      // High confidence insights
      if (attackerWinRate > 70) {
        insights.push({
          impact,
          impactName,
          insight: `${impactName}战役通常由进攻方主导，进攻方胜率高达${attackerWinRate.toFixed(1)}%`,
          confidence: 'high',
        });
      } else if (defenderWinRate > 70) {
        insights.push({
          impact,
          impactName,
          insight: `${impactName}战役中防守方表现更为出色，胜率达${defenderWinRate.toFixed(1)}%`,
          confidence: 'high',
        });
      } else if (attackerWinRate > 50) {
        insights.push({
          impact,
          impactName,
          insight: `${impactName}战役中进攻方略占优势，胜率${attackerWinRate.toFixed(1)}%`,
          confidence: 'medium',
        });
      } else if (defenderWinRate > 50) {
        insights.push({
          impact,
          impactName,
          insight: `${impactName}战役中防守方略有优势，胜率${defenderWinRate.toFixed(1)}%`,
          confidence: 'medium',
        });
      }
    } else {
      // Lower confidence for fewer battles
      if (attackerWinRate > 50) {
        insights.push({
          impact,
          impactName,
          insight: `${impactName}战役初步显示进攻方有一定优势`,
          confidence: 'low',
        });
      } else if (defenderWinRate > 50) {
        insights.push({
          impact,
          impactName,
          insight: `${impactName}战役初步显示防守方有一定优势`,
          confidence: 'low',
        });
      }
    }
  }
  
  return insights;
}

/**
 * Get impact level distribution
 */
export function getImpactDistribution(battles: Event[]): { impact: BattleImpact; count: number; percentage: number }[] {
  const stats = getAllBattleImpactsStats(battles);
  const total = battles.length;
  
  return stats.map(stat => ({
    impact: stat.impact,
    count: stat.total,
    percentage: total > 0 ? (stat.total / total) * 100 : 0,
  })).sort((a, b) => b.count - a.count);
}

/**
 * Get most common impact level
 */
export function getMostCommonImpact(battles: Event[]): BattleImpactStats | null {
  const stats = getAllBattleImpactsStats(battles);
  return stats.length > 0 ? (stats[0] ?? null) : null;
}

/**
 * Get battles that are both decisive and have commander data
 */
export function getDecisiveBattlesWithCommanders(battles: Event[]): Event[] {
  return battles.filter(b => 
    b.battle?.impact === 'decisive' && 
    (b.battle?.commanders?.attacker?.length || 0) > 0
  );
}

/**
 * Analyze correlation between impact and result
 */
export function getImpactResultCorrelation(battles: Event[]): {
  impact: BattleImpact;
  attackerWins: number;
  defenderWins: number;
  winRate: 'attacker' | 'defender' | 'equal';
}[] {
  const stats = getAllBattleImpactsStats(battles);
  
  return stats.map(stat => ({
    impact: stat.impact,
    attackerWins: stat.attackerWins,
    defenderWins: stat.defenderWins,
    winRate: stat.attackerWinRate > stat.defenderWinRate ? 'attacker' :
             stat.defenderWinRate > stat.attackerWinRate ? 'defender' : 'equal',
  }));
}

// ============ 势力(Faction)分析功能 ============

export type FactionStats = {
  name: string;
  totalBattles: number;
  asAttacker: number;
  asDefender: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  /** 作为进攻方时的胜率 */
  attackerWinRate: number;
  /** 作为防守方时的胜率 */
  defenderWinRate: number;
  /** 参与的战役年份范围 */
  yearRange: { start: number; end: number };
};

export type FactionBattles = {
  asAttacker: Event[];
  asDefender: Event[];
};

export type FactionVsFaction = {
  faction1: string;
  faction2: string;
  battles: Event[];
  faction1Wins: number;
  faction2Wins: number;
  draws: number;
};

export type FactionInsight = {
  faction: string;
  insight: string;
  confidence: 'high' | 'medium' | 'low';
  stat?: string;
};

/**
 * Get all unique factions (participants) from battles
 */
export function getAllFactions(battles: Event[]): string[] {
  const factions = new Set<string>();
  battles.forEach(battle => {
    const { attacker, defender } = getBattleParties(battle);
    if (attacker) factions.add(attacker);
    if (defender) factions.add(defender);
  });
  return Array.from(factions).sort();
}

/**
 * Get faction's battle history
 */
export function getFactionBattles(battles: Event[], faction: string): FactionBattles {
  return {
    asAttacker: battles.filter(b => b.battle?.belligerents?.attacker === faction),
    asDefender: battles.filter(b => b.battle?.belligerents?.defender === faction),
  };
}

/**
 * Get statistics for a specific faction
 */
export function getFactionStats(battles: Event[], faction: string): FactionStats | null {
  const factionBattles = getFactionBattles(battles, faction);
  
  if (factionBattles.asAttacker.length === 0 && factionBattles.asDefender.length === 0) {
    return null;
  }
  
  const asAttacker = factionBattles.asAttacker;
  const asDefender = factionBattles.asDefender;
  const allBattles = [...asAttacker, ...asDefender];
  
  const wins = allBattles.filter(b => {
    const isAttacker = b.battle?.belligerents?.attacker === faction;
    return isAttacker ? b.battle?.result === 'attacker_win' : b.battle?.result === 'defender_win';
  }).length;
  
  const losses = allBattles.filter(b => {
    const isAttacker = b.battle?.belligerents?.attacker === faction;
    return isAttacker ? b.battle?.result === 'defender_win' : b.battle?.result === 'attacker_win';
  }).length;
  
  const draws = allBattles.filter(b => b.battle?.result === 'draw').length;
  
  const attackerWins = asAttacker.filter(b => b.battle?.result === 'attacker_win').length;
  const defenderWins = asDefender.filter(b => b.battle?.result === 'defender_win').length;
  
  const years = allBattles.map(b => b.year).filter(y => y !== undefined);
  const startYear = years.length > 0 ? Math.min(...years) : 0;
  const endYear = years.length > 0 ? Math.max(...years) : 0;
  
  return {
    name: faction,
    totalBattles: allBattles.length,
    asAttacker: asAttacker.length,
    asDefender: asDefender.length,
    wins,
    losses,
    draws,
    winRate: allBattles.length > 0 ? (wins / allBattles.length) * 100 : 0,
    attackerWinRate: asAttacker.length > 0 ? (attackerWins / asAttacker.length) * 100 : 0,
    defenderWinRate: asDefender.length > 0 ? (defenderWins / asDefender.length) * 100 : 0,
    yearRange: { start: startYear, end: endYear },
  };
}

/**
 * Get statistics for all factions
 */
export function getAllFactionsStats(battles: Event[]): FactionStats[] {
  const factions = getAllFactions(battles);
  return factions
    .map(faction => getFactionStats(battles, faction))
    .filter((stat): stat is FactionStats => stat !== null)
    .sort((a, b) => b.totalBattles - a.totalBattles);
}

/**
 * Get top most active factions
 */
export function getTopFactions(battles: Event[], limit = 10): FactionStats[] {
  return getAllFactionsStats(battles).slice(0, limit);
}

/**
 * Get top factions by win rate (minimum 3 battles)
 */
export function getTopFactionsByWinRate(battles: Event[], limit = 10): FactionStats[] {
  return getAllFactionsStats(battles)
    .filter(f => f.totalBattles >= 3)
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, limit);
}

/**
 * Get factions that have the best record as attackers
 */
export function getMostAggressiveFactions(battles: Event[], limit = 10): FactionStats[] {
  return getAllFactionsStats(battles)
    .filter(f => f.asAttacker >= 3)
    .sort((a, b) => b.attackerWinRate - a.attackerWinRate)
    .slice(0, limit);
}

/**
 * Get factions that have the best record as defenders
 */
export function getMostDefensiveFactions(battles: Event[], limit = 10): FactionStats[] {
  return getAllFactionsStats(battles)
    .filter(f => f.asDefender >= 3)
    .sort((a, b) => b.defenderWinRate - a.defenderWinRate)
    .slice(0, limit);
}

/**
 * Get head-to-head record between two factions
 */
export function getFactionVsFaction(battles: Event[], faction1: string, faction2: string): FactionVsFaction | null {
  const relevantBattles = battles.filter(b => {
    const { attacker, defender } = getBattleParties(b);
    return (attacker === faction1 && defender === faction2) ||
           (attacker === faction2 && defender === faction1);
  });
  
  if (relevantBattles.length === 0) {
    return null;
  }
  
  const faction1Wins = relevantBattles.filter(b => {
    const { attacker } = getBattleParties(b);
    if (attacker === faction1) {
      return b.battle?.result === 'attacker_win';
    } else {
      return b.battle?.result === 'defender_win';
    }
  }).length;
  
  const faction2Wins = relevantBattles.filter(b => {
    const { attacker } = getBattleParties(b);
    if (attacker === faction2) {
      return b.battle?.result === 'attacker_win';
    } else {
      return b.battle?.result === 'defender_win';
    }
  }).length;
  
  const draws = relevantBattles.filter(b => b.battle?.result === 'draw').length;
  
  return {
    faction1,
    faction2,
    battles: relevantBattles,
    faction1Wins,
    faction2Wins,
    draws,
  };
}

/**
 * Get rivalry analysis - factions that fought each other most often
 */
export function getTopRivalries(battles: Event[], limit = 10): FactionVsFaction[] {
  const factions = getAllFactions(battles);
  const rivalries: FactionVsFaction[] = [];
  
  for (let i = 0; i < factions.length; i++) {
    for (let j = i + 1; j < factions.length; j++) {
      const factionI = factions[i];
      const factionJ = factions[j];
      if (factionI && factionJ) {
        const rivalry = getFactionVsFaction(battles, factionI, factionJ);
        if (rivalry && rivalry.battles.length > 0) {
          rivalries.push(rivalry);
        }
      }
    }
  }
  
  return rivalries
    .sort((a, b) => b.battles.length - a.battles.length)
    .slice(0, limit);
}

/**
 * Check if there is faction data in battles
 */
export function hasFactionData(battles: Event[]): boolean {
  return battles.some(b => 
    b.battle?.belligerents?.attacker || b.battle?.belligerents?.defender
  );
}

/**
 * Generate insights about factions
 */
export function getFactionInsights(battles: Event[]): FactionInsight[] {
  const insights: FactionInsight[] = [];
  const allStats = getAllFactionsStats(battles);
  
  if (allStats.length === 0) return insights;
  
  // Most active faction
  const mostActive = allStats[0];
  if (mostActive) {
    insights.push({
      faction: mostActive.name,
      insight: `${mostActive.name} 是最活跃的势力，参与了 ${mostActive.totalBattles} 场战役`,
      confidence: 'high',
      stat: `${mostActive.totalBattles} 场战役`,
    });
  }
  
  // Best win rate
  const minBattlesForBestRate = 3;
  const bestWinRate = allStats.filter(f => f.totalBattles >= minBattlesForBestRate)[0];
  if (bestWinRate && bestWinRate.totalBattles >= minBattlesForBestRate) {
    insights.push({
      faction: bestWinRate.name,
      insight: `${bestWinRate.name} 拥有最高胜率，达 ${bestWinRate.winRate.toFixed(1)}%（至少${minBattlesForBestRate}场战役）`,
      confidence: bestWinRate.totalBattles >= 5 ? 'high' : 'medium',
      stat: `${bestWinRate.winRate.toFixed(1)}% 胜率`,
    });
  }
  
  // Most aggressive (attacker wins)
  const aggressiveFactions = allStats
    .filter(f => f.asAttacker >= 3)
    .sort((a, b) => b.attackerWinRate - a.attackerWinRate);
  if (aggressiveFactions.length > 0) {
    const aggressive = aggressiveFactions[0];
    if (aggressive) {
      insights.push({
        faction: aggressive.name,
        insight: `${aggressive.name} 作为进攻方时胜率高达 ${aggressive.attackerWinRate.toFixed(1)}%，是最具进攻性的势力`,
        confidence: aggressive.asAttacker >= 5 ? 'high' : 'medium',
        stat: `${aggressive.attackerWinRate.toFixed(1)}% 进攻胜率`,
      });
    }
  }
  
  // Most defensive (defender wins)
  const defensiveFactions = allStats
    .filter(f => f.asDefender >= 3)
    .sort((a, b) => b.defenderWinRate - a.defenderWinRate);
  if (defensiveFactions.length > 0) {
    const defensive = defensiveFactions[0];
    if (defensive) {
      insights.push({
        faction: defensive.name,
        insight: `${defensive.name} 作为防守方时表现出色，防守胜率达 ${defensive.defenderWinRate.toFixed(1)}%`,
        confidence: defensive.asDefender >= 5 ? 'high' : 'medium',
        stat: `${defensive.defenderWinRate.toFixed(1)}% 防守胜率`,
      });
    }
  }
  
  // Longest military history
  const sortedByHistory = [...allStats].sort((a, b) => 
    (b.yearRange.end - b.yearRange.start) - (a.yearRange.end - a.yearRange.start)
  );
  if (sortedByHistory.length > 0) {
    const longestHistory = sortedByHistory[0];
    if (longestHistory && longestHistory.yearRange.end !== longestHistory.yearRange.start) {
      const span = longestHistory.yearRange.end - longestHistory.yearRange.start;
      insights.push({
        faction: longestHistory.name,
        insight: `${longestHistory.name} 军事活动跨度最长，持续约 ${span} 年`,
        confidence: 'medium',
        stat: `约 ${span} 年`,
      });
    }
  }
  
  return insights;
}
