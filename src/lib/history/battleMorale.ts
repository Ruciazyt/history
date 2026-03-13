import type { 
  Event, 
  BattleMoraleFactor, 
  MoraleFactorType, 
  MoraleImpact, 
  MoraleSeverity,
  InitialMoraleLevel,
  MoraleShiftEvent 
} from './types';
import { getBattles } from './battles';

/**
 * 获取士气因素类型的中文标签
 */
export function getMoraleFactorLabel(type: MoraleFactorType): string {
  const labels: Record<MoraleFactorType, string> = {
    'leadership': '领导力',
    'discipline': '纪律性',
    'motivation': '战斗动机',
    'experience': '作战经验',
    'training': '训练水平',
    'loyalty': '忠诚度',
    'morale-boost': '士气提升',
    'morale-crisis': '士气危机',
    'fatigue': '疲劳',
    'fear': '恐惧',
    'unknown': '未知'
  };
  return labels[type] || '未知';
}

/**
 * 获取士气影响方向的中文标签
 */
export function getMoraleImpactLabel(impact: MoraleImpact): string {
  const labels: Record<MoraleImpact, string> = {
    'positive': '积极',
    'negative': '消极',
    'neutral': '中性'
  };
  return labels[impact] || '未知';
}

/**
 * 获取士气严重程度的中文标签
 */
export function getMoraleSeverityLabel(severity: MoraleSeverity): string {
  const labels: Record<MoraleSeverity, string> = {
    'critical': '关键',
    'major': '重大',
    'minor': '轻微',
    'unknown': '未知'
  };
  return labels[severity] || '未知';
}

/**
 * 获取初始士气水平的中文标签
 */
export function getInitialMoraleLabel(level: InitialMoraleLevel): string {
  const labels: Record<InitialMoraleLevel, string> = {
    'high': '高',
    'medium': '中',
    'low': '低',
    'unknown': '未知'
  };
  return labels[level] || '未知';
}

/**
 * 检查是否有士气数据
 */
export function hasMoraleData(events: Event[]): boolean {
  const battles = getBattles(events);
  return battles.some(b => b.battle?.moraleFactors && b.battle.moraleFactors.length > 0);
}

/**
 * 获取所有有士气数据的战役
 */
export function getBattlesWithMorale(events: Event[]): Event[] {
  const battles = getBattles(events);
  return battles.filter(b => b.battle?.moraleFactors && b.battle.moraleFactors.length > 0);
}

/**
 * 获取士气因素类型统计
 */
export function getMoraleFactorStats(events: Event[], type: MoraleFactorType): number {
  const battles = getBattlesWithMorale(events);
  return battles.reduce((count, battle) => {
    const factors = battle.battle?.moraleFactors || [];
    return count + factors.filter(f => f.type === type).length;
  }, 0);
}

/**
 * 获取所有士气因素类型统计
 */
export function getAllMoraleFactorStats(events: Event[]): Record<MoraleFactorType, number> {
  const battles = getBattlesWithMorale(events);
  const stats: Record<MoraleFactorType, number> = {
    'leadership': 0,
    'discipline': 0,
    'motivation': 0,
    'experience': 0,
    'training': 0,
    'loyalty': 0,
    'morale-boost': 0,
    'morale-crisis': 0,
    'fatigue': 0,
    'fear': 0,
    'unknown': 0
  };

  battles.forEach(battle => {
    const factors = battle.battle?.moraleFactors || [];
    factors.forEach(factor => {
      stats[factor.type]++;
    });
  });

  return stats;
}

/**
 * 获取最常见的士气因素类型
 */
export function getMostCommonMoraleFactorTypes(events: Event[], topN: number = 5): Array<{ type: MoraleFactorType; count: number }> {
  const stats = getAllMoraleFactorStats(events);
  return Object.entries(stats)
    .map(([type, count]) => ({ type: type as MoraleFactorType, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

/**
 * 按阵营分类士气因素
 */
export function getMoraleFactorsBySide(events: Event[]): { attacker: BattleMoraleFactor[]; defender: BattleMoraleFactor[]; both: BattleMoraleFactor[] } {
  const battles = getBattlesWithMorale(events);
  const attacker: BattleMoraleFactor[] = [];
  const defender: BattleMoraleFactor[] = [];
  const both: BattleMoraleFactor[] = [];

  battles.forEach(battle => {
    const factors = battle.battle?.moraleFactors || [];
    factors.forEach(factor => {
      if (factor.side === 'attacker') {
        attacker.push(factor);
      } else if (factor.side === 'defender') {
        defender.push(factor);
      } else if (factor.side === 'both') {
        both.push(factor);
      }
    });
  });

  return { attacker, defender, both };
}

/**
 * 分析士气因素与战役结果的关联
 */
export function getMoraleOutcomeCorrelation(events: Event[]): {
  positiveFactorsWinRate: number;
  negativeFactorsWinRate: number;
  analysis: string;
} {
  const battles = getBattlesWithMorale(events);
  
  let positiveWinCount = 0;
  let positiveTotalCount = 0;
  let negativeWinCount = 0;
  let negativeTotalCount = 0;

  battles.forEach(battle => {
    const factors = battle.battle?.moraleFactors || [];
    const result = battle.battle?.result;
    
    factors.forEach(factor => {
      if (factor.impact === 'positive') {
        positiveTotalCount++;
        if ((factor.side === 'attacker' && result === 'attacker_win') ||
            (factor.side === 'defender' && result === 'defender_win')) {
          positiveWinCount++;
        }
      } else if (factor.impact === 'negative') {
        negativeTotalCount++;
        if ((factor.side === 'attacker' && result === 'defender_win') ||
            (factor.side === 'defender' && result === 'attacker_win')) {
          negativeWinCount++;
        }
      }
    });
  });

  const positiveWinRate = positiveTotalCount > 0 ? (positiveWinCount / positiveTotalCount) * 100 : 0;
  const negativeWinRate = negativeTotalCount > 0 ? (negativeWinCount / negativeTotalCount) * 100 : 0;

  let analysis = '';
  if (positiveWinRate > negativeWinRate) {
    analysis = `积极士气因素的阵营胜率(${positiveWinRate.toFixed(1)}%)高于消极士气因素的阵营胜率(${negativeWinRate.toFixed(1)}%)，表明士气对战役结果有重要影响。`;
  } else if (negativeWinRate > positiveWinRate) {
    analysis = `消极士气因素的阵营反而有更高的胜率(${negativeWinRate.toFixed(1)}%)，这可能是因为这些因素是在战役过程中才出现的。`;
  } else {
    analysis = '积极和消极士气因素对胜率的影响相当。';
  }

  return {
    positiveFactorsWinRate: positiveWinRate,
    negativeFactorsWinRate: negativeWinRate,
    analysis
  };
}

/**
 * 获取士气最关键的战役（因素最多）
 */
export function getBattlesWithMostMoraleFactors(events: Event[], topN: number = 5): Array<{ battle: Event; factorCount: number }> {
  const battles = getBattlesWithMorale(events);
  return battles
    .map(battle => ({
      battle,
      factorCount: battle.battle?.moraleFactors?.length || 0
    }))
    .sort((a, b) => b.factorCount - a.factorCount)
    .slice(0, topN);
}

/**
 * 按严重程度分析士气因素
 */
export function getMoraleSeverityDistribution(events: Event[]): Record<MoraleSeverity, number> {
  const battles = getBattlesWithMorale(events);
  const distribution: Record<MoraleSeverity, number> = {
    'critical': 0,
    'major': 0,
    'minor': 0,
    'unknown': 0
  };

  battles.forEach(battle => {
    const factors = battle.battle?.moraleFactors || [];
    factors.forEach(factor => {
      const severity = factor.severity || 'unknown';
      distribution[severity]++;
    });
  });

  return distribution;
}

/**
 * 分析士气变化与战役结果关联
 */
export function getMoraleShiftOutcomeCorrelation(events: Event[]): {
  shiftsUpWinRate: number;
  shiftsDownWinRate: number;
  noShiftWinRate: number;
  analysis: string;
} {
  const battles = getBattles(events);

  let shiftsUpWin = 0;
  let shiftsUpTotal = 0;
  let shiftsDownWin = 0;
  let shiftsDownTotal = 0;
  let noShiftWin = 0;
  let noShiftTotal = 0;

  battles.forEach(battle => {
    const shifts = battle.battle?.moraleShifts || [];
    const result = battle.battle?.result;

    if (shifts.length === 0) {
      noShiftTotal++;
      if (result === 'attacker_win' || result === 'defender_win') {
        noShiftWin++;
      }
    } else {
      shifts.forEach(shift => {
        if (shift.direction === 'up') {
          shiftsUpTotal++;
          if ((shift.side === 'attacker' && result === 'attacker_win') ||
              (shift.side === 'defender' && result === 'defender_win')) {
            shiftsUpWin++;
          }
        } else if (shift.direction === 'down') {
          shiftsDownTotal++;
          if ((shift.side === 'attacker' && result === 'defender_win') ||
              (shift.side === 'defender' && result === 'attacker_win')) {
            shiftsDownWin++;
          }
        }
      });
    }
  });

  const shiftsUpWinRate = shiftsUpTotal > 0 ? (shiftsUpWin / shiftsUpTotal) * 100 : 0;
  const shiftsDownWinRate = shiftsDownTotal > 0 ? (shiftsDownWin / shiftsDownTotal) * 100 : 0;
  const noShiftWinRate = noShiftTotal > 0 ? (noShiftWin / noShiftTotal) * 100 : 0;

  let analysis = '';
  if (shiftsUpWinRate > shiftsDownWinRate) {
    analysis = `士气上升的阵营胜率(${shiftsUpWinRate.toFixed(1)}%)高于士气下降的阵营(${shiftsDownWinRate.toFixed(1)}%)，证实了士气变化对战争结果的关键影响。`;
  } else if (shiftsDownWinRate > shiftsUpWinRate) {
    analysis = `士气下降的阵营反而胜率较高，这可能由于其他因素如兵力对比的影响更大。`;
  } else {
    analysis = '士气变化方向与胜率没有明显关联。';
  }

  return {
    shiftsUpWinRate,
    shiftsDownWinRate,
    noShiftWinRate,
    analysis
  };
}

/**
 * 获取士气因素影响摘要
 */
export function getMoraleSummary(events: Event[]): {
  totalBattles: number;
  battlesWithMorale: number;
  factorCount: number;
  factorTypes: number;
  topFactorTypes: Array<{ type: MoraleFactorType; count: number; label: string }>;
  sideDistribution: { attacker: number; defender: number; both: number };
  severityDistribution: Record<MoraleSeverity, number>;
  correlation: {
    positiveFactorsWinRate: number;
    negativeFactorsWinRate: number;
    analysis: string;
  };
} {
  const battles = getBattles(events);
  const battlesWithMorale = getBattlesWithMorale(events);
  const allStats = getAllMoraleFactorStats(events);
  const topFactorTypes = getMostCommonMoraleFactorTypes(events, 5);
  const sideDist = getMoraleFactorsBySide(events);
  const severityDist = getMoraleSeverityDistribution(events);
  const correlation = getMoraleOutcomeCorrelation(events);

  return {
    totalBattles: battles.length,
    battlesWithMorale: battlesWithMorale.length,
    factorCount: Object.values(allStats).reduce((a, b) => a + b, 0),
    factorTypes: Object.keys(allStats).filter(k => allStats[k as MoraleFactorType] > 0).length,
    topFactorTypes: topFactorTypes.map(t => ({
      ...t,
      label: getMoraleFactorLabel(t.type)
    })),
    sideDistribution: {
      attacker: sideDist.attacker.length,
      defender: sideDist.defender.length,
      both: sideDist.both.length
    },
    severityDistribution: severityDist,
    correlation
  };
}

/**
 * 生成士气分析历史洞察
 */
export function getMoraleInsights(events: Event[]): string[] {
  const insights: string[] = [];
  const battles = getBattlesWithMorale(events);
  
  if (battles.length === 0) {
    return ['暂无士气数据'];
  }

  // 分析最常见的士气因素
  const topFactors = getMostCommonMoraleFactorTypes(events, 1);
  if (topFactors.length > 0 && topFactors[0].count > 0) {
    insights.push(`最常见的士气因素是${getMoraleFactorLabel(topFactors[0].type)}，共出现${topFactors[0].count}次。`);
  }

  // 分析士气与胜负关联
  const correlation = getMoraleOutcomeCorrelation(events);
  if (correlation.positiveFactorsWinRate > correlation.negativeFactorsWinRate + 10) {
    insights.push('积极士气因素显著提升获胜概率，体现了"一鼓作气"的历史智慧。');
  }

  // 分析严重程度
  const severityDist = getMoraleSeverityDistribution(events);
  if (severityDist.critical > 0) {
    insights.push(`共有${severityDist.critical}个关键性士气因素对战役结果产生了重大影响。`);
  }

  // 士气变化分析
  const shiftCorrelation = getMoraleShiftOutcomeCorrelation(events);
  if (shiftCorrelation.shiftsUpWinRate > shiftCorrelation.shiftsDownWinRate) {
    insights.push('战役过程中士气上升的一方往往最终获胜，印证了"士气如虹"的战场法则。');
  }

  // 阵营分析
  const sideDist = getMoraleFactorsBySide(events);
  if (sideDist.attacker.length > sideDist.defender.length * 1.5) {
    insights.push('进攻方在历史上记录了更多的士气因素，这可能与进攻方需要更高的士气有关。');
  }

  if (insights.length === 0) {
    insights.push('古代战役中士气因素复杂多样，需要综合考虑领导力、纪律、动机等多方面因素。');
  }

  return insights;
}
