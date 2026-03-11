import type { Event, BattleType, BattleImpact } from './types';
import {
  getBattles,
  getBattleRegion,
  getSeasonFromMonth,
  getBattleMonth,
  getBattleStats,
  getAttackerDefenderPattern,
  getVictoryPatternBySeason,
  getVictoryPatternByEra,
  getBattleCountByRegion,
  getAllBattleTypesStats,
  getAllBattleImpactsStats,
  getBattleSeasonality,
  type BattleSeason,
} from './battles';

// ============ Outcome Correlation Types ============

/** A single correlation factor */
export type CorrelationFactor = {
  factor: string;
  factorType: 'season' | 'region' | 'type' | 'impact' | 'era';
  total: number;
  attackerWins: number;
  defenderWins: number;
  draws: number;
  inconclusive: number;
  attackerWinRate: number;
  defenderWinRate: number;
  correlation: 'attacker' | 'defender' | 'neutral';
  strength: 'strong' | 'moderate' | 'weak';
};

/** Combined correlation analysis result */
export type OutcomeCorrelationAnalysis = {
  factors: CorrelationFactor[];
  strongestAttackerFactor: CorrelationFactor | null;
  strongestDefenderFactor: CorrelationFactor | null;
  overallAttackerWinRate: number;
  overallDefenderWinRate: number;
};

/** Victory factor insight */
export type VictoryFactorInsight = {
  type: 'season_victory' | 'region_victory' | 'type_victory' | 'impact_victory';
  factor: string;
  description: string;
  attackerWinRate: number;
  defenderWinRate: number;
  correlation: 'attacker' | 'defender' | 'neutral';
  confidence: 'high' | 'medium' | 'low';
};

// ============ Helper Functions ============

function calculateAttackerWinRate(attackerWins: number, defenderWins: number): number {
  const total = attackerWins + defenderWins;
  return total > 0 ? Math.round((attackerWins / total) * 1000) / 10 : 0;
}

function getCorrelationStrength(attackerWinRate: number, defenderWinRate: number): 'strong' | 'moderate' | 'weak' {
  const diff = Math.abs(attackerWinRate - defenderWinRate);
  if (diff >= 30) return 'strong';
  if (diff >= 15) return 'moderate';
  return 'weak';
}

// ============ Main Analysis Functions ============

/**
 * Get season correlation factor
 */
function getSeasonCorrelation(battles: Event[]): CorrelationFactor[] {
  const factors: CorrelationFactor[] = [];
  const seasonData = getBattleSeasonality(battles);

  for (const season of seasonData) {
    if (season.season === 'unknown') continue;
    if (season.count < 1) continue;

    const attackerWinRate = season.attackerWins;
    const defenderWinRate = season.defenderWins;
    const totalKnown = attackerWinRate + defenderWinRate;

    if (totalKnown > 0) {
      const attrWinPct = calculateAttackerWinRate(attackerWinRate, defenderWinRate);
      factors.push({
        factor: season.seasonName,
        factorType: 'season',
        total: season.count,
        attackerWins: season.attackerWins,
        defenderWins: season.defenderWins,
        draws: season.draws,
        inconclusive: 0,
        attackerWinRate: attrWinPct,
        defenderWinRate: 100 - attrWinPct,
        correlation: attrWinPct > 55 ? 'attacker' : attrWinPct < 45 ? 'defender' : 'neutral',
        strength: getCorrelationStrength(attrWinPct, 100 - attrWinPct),
      });
    }
  }

  return factors;
}

/**
 * Get region correlation factor
 */
function getRegionCorrelation(battles: Event[]): CorrelationFactor[] {
  const factors: CorrelationFactor[] = [];
  const regionData = getBattleCountByRegion(battles);

  for (const region of regionData) {
    if (region.count < 1) continue;

    const attackerWinRate = region.attackerWins;
    const defenderWinRate = region.defenderWins;
    const totalKnown = attackerWinRate + defenderWinRate;

    if (totalKnown > 0) {
      const attrWinPct = calculateAttackerWinRate(attackerWinRate, defenderWinRate);
      factors.push({
        factor: region.regionName,
        factorType: 'region',
        total: region.count,
        attackerWins: region.attackerWins,
        defenderWins: region.defenderWins,
        draws: 0,
        inconclusive: 0,
        attackerWinRate: attrWinPct,
        defenderWinRate: 100 - attrWinPct,
        correlation: attrWinPct > 55 ? 'attacker' : attrWinPct < 45 ? 'defender' : 'neutral',
        strength: getCorrelationStrength(attrWinPct, 100 - attrWinPct),
      });
    }
  }

  return factors;
}

/**
 * Get battle type correlation factor
 */
function getBattleTypeCorrelation(battles: Event[]): CorrelationFactor[] {
  const factors: CorrelationFactor[] = [];
  const typeData = getAllBattleTypesStats(battles);

  for (const stat of typeData) {
    if (stat.total < 1) continue;

    const known = stat.attackerWins + stat.defenderWins;
    if (known > 0) {
      const attrWinPct = calculateAttackerWinRate(stat.attackerWins, stat.defenderWins);
      factors.push({
        factor: stat.typeName,
        factorType: 'type',
        total: stat.total,
        attackerWins: stat.attackerWins,
        defenderWins: stat.defenderWins,
        draws: stat.draws,
        inconclusive: stat.inconclusive,
        attackerWinRate: attrWinPct,
        defenderWinRate: 100 - attrWinPct,
        correlation: attrWinPct > 55 ? 'attacker' : attrWinPct < 45 ? 'defender' : 'neutral',
        strength: getCorrelationStrength(attrWinPct, 100 - attrWinPct),
      });
    }
  }

  return factors;
}

/**
 * Get battle impact correlation factor
 */
function getBattleImpactCorrelation(battles: Event[]): CorrelationFactor[] {
  const factors: CorrelationFactor[] = [];
  const impactData = getAllBattleImpactsStats(battles);

  for (const stat of impactData) {
    if (stat.total < 1) continue;

    const known = stat.attackerWins + stat.defenderWins;
    if (known > 0) {
      const attrWinPct = calculateAttackerWinRate(stat.attackerWins, stat.defenderWins);
      factors.push({
        factor: stat.impactName,
        factorType: 'impact',
        total: stat.total,
        attackerWins: stat.attackerWins,
        defenderWins: stat.defenderWins,
        draws: stat.draws,
        inconclusive: stat.inconclusive,
        attackerWinRate: attrWinPct,
        defenderWinRate: 100 - attrWinPct,
        correlation: attrWinPct > 55 ? 'attacker' : attrWinPct < 45 ? 'defender' : 'neutral',
        strength: getCorrelationStrength(attrWinPct, 100 - attrWinPct),
      });
    }
  }

  return factors;
}

/**
 * Analyze overall battle outcome correlations
 */
export function getOutcomeCorrelationAnalysis(battles: Event[]): OutcomeCorrelationAnalysis {
  const battlesOnly = getBattles(battles);

  // Get all correlation factors
  const seasonFactors = getSeasonCorrelation(battlesOnly);
  const regionFactors = getRegionCorrelation(battlesOnly);
  const typeFactors = getBattleTypeCorrelation(battlesOnly);
  const impactFactors = getBattleImpactCorrelation(battlesOnly);

  // Combine all factors
  const factors = [
    ...seasonFactors,
    ...regionFactors,
    ...typeFactors,
    ...impactFactors,
  ];

  // Calculate overall stats
  const stats = getBattleStats(battlesOnly);
  const totalKnown = stats.attackerWins + stats.defenderWins;
  const overallAttackerWinRate = totalKnown > 0
    ? Math.round((stats.attackerWins / totalKnown) * 1000) / 10
    : 0;
  const overallDefenderWinRate = 100 - overallAttackerWinRate;

  // Find strongest correlations
  const attackerFactors = factors.filter(f => f.correlation === 'attacker');
  const defenderFactors = factors.filter(f => f.correlation === 'defender');

  // Sort by strength within each category
  attackerFactors.sort((a, b) => {
    const aScore = a.strength === 'strong' ? 3 : a.strength === 'moderate' ? 2 : 1;
    const bScore = b.strength === 'strong' ? 3 : b.strength === 'moderate' ? 2 : 1;
    return bScore - aScore || b.attackerWinRate - a.attackerWinRate;
  });

  defenderFactors.sort((a, b) => {
    const aScore = a.strength === 'strong' ? 3 : a.strength === 'moderate' ? 2 : 1;
    const bScore = b.strength === 'strong' ? 3 : b.strength === 'moderate' ? 2 : 1;
    return bScore - aScore || b.defenderWinRate - a.defenderWinRate;
  });

  return {
    factors,
    strongestAttackerFactor: attackerFactors[0] || null,
    strongestDefenderFactor: defenderFactors[0] || null,
    overallAttackerWinRate,
    overallDefenderWinRate,
  };
}

/**
 * Generate insights from outcome correlation analysis
 */
export function getVictoryFactorInsights(battles: Event[]): VictoryFactorInsight[] {
  const insights: VictoryFactorInsight[] = [];
  const analysis = getOutcomeCorrelationAnalysis(battles);

  for (const factor of analysis.factors) {
    if (factor.total < 2) continue; // Need at least 2 battles for insight

    const confidence: 'high' | 'medium' | 'low' =
      factor.total >= 5 ? 'high' : factor.total >= 3 ? 'medium' : 'low';

    if (factor.correlation === 'attacker' && factor.strength !== 'weak') {
      if (factor.factorType === 'season') {
        insights.push({
          type: 'season_victory',
          factor: factor.factor,
          description: `${factor.factor}发生的战役中，进攻方胜率达${factor.attackerWinRate}%${
            factor.strength === 'strong' ? '，具有明显优势' : '，略占优势'
          }`,
          attackerWinRate: factor.attackerWinRate,
          defenderWinRate: factor.defenderWinRate,
          correlation: 'attacker',
          confidence,
        });
      } else if (factor.factorType === 'region') {
        insights.push({
          type: 'region_victory',
          factor: factor.factor,
          description: `在${factor.factor}地区，进攻方胜率达${factor.attackerWinRate}%${
            factor.strength === 'strong' ? '，具有明显优势' : '，略占优势'
          }`,
          attackerWinRate: factor.attackerWinRate,
          defenderWinRate: factor.defenderWinRate,
          correlation: 'attacker',
          confidence,
        });
      } else if (factor.factorType === 'type') {
        insights.push({
          type: 'type_victory',
          factor: factor.factor,
          description: `${factor.factor}中，进攻方胜率达${factor.attackerWinRate}%${
            factor.strength === 'strong' ? '，具有明显优势' : '，略占优势'
          }`,
          attackerWinRate: factor.attackerWinRate,
          defenderWinRate: factor.defenderWinRate,
          correlation: 'attacker',
          confidence,
        });
      } else if (factor.factorType === 'impact') {
        insights.push({
          type: 'impact_victory',
          factor: factor.factor,
          description: `${factor.factor}中，进攻方胜率达${factor.attackerWinRate}%${
            factor.strength === 'strong' ? '，具有明显优势' : '，略占优势'
          }`,
          attackerWinRate: factor.attackerWinRate,
          defenderWinRate: factor.defenderWinRate,
          correlation: 'attacker',
          confidence,
        });
      }
    } else if (factor.correlation === 'defender' && factor.strength !== 'weak') {
      if (factor.factorType === 'season') {
        insights.push({
          type: 'season_victory',
          factor: factor.factor,
          description: `${factor.factor}发生的战役中，防守方胜率达${factor.defenderWinRate}%${
            factor.strength === 'strong' ? '，具有明显优势' : '，略占优势'
          }`,
          attackerWinRate: factor.attackerWinRate,
          defenderWinRate: factor.defenderWinRate,
          correlation: 'defender',
          confidence,
        });
      } else if (factor.factorType === 'region') {
        insights.push({
          type: 'region_victory',
          factor: factor.factor,
          description: `在${factor.factor}地区，防守方胜率达${factor.defenderWinRate}%${
            factor.strength === 'strong' ? '，具有明显优势' : '，略占优势'
          }`,
          attackerWinRate: factor.attackerWinRate,
          defenderWinRate: factor.defenderWinRate,
          correlation: 'defender',
          confidence,
        });
      } else if (factor.factorType === 'type') {
        insights.push({
          type: 'type_victory',
          factor: factor.factor,
          description: `${factor.factor}中，防守方胜率达${factor.defenderWinRate}%${
            factor.strength === 'strong' ? '，具有明显优势' : '，略占优势'
          }`,
          attackerWinRate: factor.attackerWinRate,
          defenderWinRate: factor.defenderWinRate,
          correlation: 'defender',
          confidence,
        });
      } else if (factor.factorType === 'impact') {
        insights.push({
          type: 'impact_victory',
          factor: factor.factor,
          description: `${factor.factor}中，防守方胜率达${factor.defenderWinRate}%${
            factor.strength === 'strong' ? '，具有明显优势' : '，略占优势'
          }`,
          attackerWinRate: factor.attackerWinRate,
          defenderWinRate: factor.defenderWinRate,
          correlation: 'defender',
          confidence,
        });
      }
    }
  }

  // Sort by confidence then by strength
  insights.sort((a, b) => {
    const confidenceOrder = { high: 3, medium: 2, low: 1 };
    return confidenceOrder[b.confidence] - confidenceOrder[a.confidence];
  });

  return insights;
}

/**
 * Get summary of key victory factors
 */
export function getKeyVictoryFactorsSummary(
  battles: Event[],
  t?: (key: string) => string
): string[] {
  const battlesOnly = battles.filter(e => e.tags?.includes('war'));
  
  // Return empty array if no battles
  if (battlesOnly.length === 0) {
    return [];
  }
  
  const analysis = getOutcomeCorrelationAnalysis(battles);
  const summary: string[] = [];

  // Overall trend
  if (analysis.overallAttackerWinRate > 55) {
    summary.push(`整体来看，进攻方胜率较高（${analysis.overallAttackerWinRate}%）`);
  } else if (analysis.overallDefenderWinRate > 55) {
    summary.push(`整体来看，防守方胜率较高（${analysis.overallDefenderWinRate}%）`);
  } else {
    summary.push(`整体来看，攻守双方势均力敌`);
  }

  // Strongest attacker factor
  if (analysis.strongestAttackerFactor) {
    const factor = analysis.strongestAttackerFactor;
    summary.push(`${factor.factor}最有利于进攻方（胜率${factor.attackerWinRate}%）`);
  }

  // Strongest defender factor
  if (analysis.strongestDefenderFactor) {
    const factor = analysis.strongestDefenderFactor;
    summary.push(`${factor.factor}最有利于防守方（胜率${factor.defenderWinRate}%）`);
  }

  return summary;
}

/**
 * Compare two specific factors (e.g., "春季 vs 秋季")
 */
export function compareFactors(
  battles: Event[],
  factor1Type: CorrelationFactor['factorType'],
  factor1Name: string,
  factor2Type: CorrelationFactor['factorType'],
  factor2Name: string
): {
  factor1: CorrelationFactor | null;
  factor2: CorrelationFactor | null;
  comparison: string;
} {
  const analysis = getOutcomeCorrelationAnalysis(battles);

  const factor1 = analysis.factors.find(
    f => f.factorType === factor1Type && f.factor === factor1Name
  );
  const factor2 = analysis.factors.find(
    f => f.factorType === factor2Type && f.factor === factor2Name
  );

  let comparison = '';
  if (factor1 && factor2) {
    const diff = Math.abs(factor1.attackerWinRate - factor2.attackerWinRate);
    if (diff < 5) {
      comparison = `${factor1Name}和${factor2Name}的进攻方胜率相近`;
    } else if (factor1.attackerWinRate > factor2.attackerWinRate) {
      comparison = `${factor1Name}比${factor2Name}更有利于进攻方`;
    } else {
      comparison = `${factor2Name}比${factor1Name}更有利于进攻方`;
    }
  } else if (!factor1 && !factor2) {
    comparison = '未找到相关因素数据';
  } else if (!factor1) {
    comparison = `未找到${factor1Name}的数据`;
  } else {
    comparison = `未找到${factor2Name}的数据`;
  }

  return { factor1: factor1 ?? null, factor2: factor2 ?? null, comparison };
}
