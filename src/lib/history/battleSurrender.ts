/**
 * 战役投降/改编分析模块
 * 分析战役中的投降、改编、投诚等情况
 */

import type { Event } from './types';

/** 投降/改编类型 */
export type SurrenderType =
  | 'surrender'           // 投降
  | 'capitulation'       // 投降（正式）
  | 'defection'          // 倒戈/投诚
  | 'surrender-after-wound'  // 受伤后投降
  | 'mass-surrender'     // 大规模投降
  | 'surrender-pursuit' // 投降后追击
  | 'refused-surrender'  // 拒绝投降
  | 'negotiated-surrender' // 谈判投降
  | 'unknown';

/** 投降方阵营 */
export type SurrenderSide = 'attacker' | 'defender' | 'both' | 'unknown';

/** 投降/改编严重程度 */
export type SurrenderSeverity = 'massive' | 'significant' | 'moderate' | 'minor' | 'unknown';

/** 战役投降/改编数据 */
export type BattleSurrender = {
  /** 投降/改编类型 */
  type: SurrenderType;
  /** 描述 */
  description: string;
  /** 投降方 */
  side: SurrenderSide;
  /** 严重程度 */
  severity?: SurrenderSeverity;
  /** 投降的人数规模（可选） */
  number?: number;
  /** 投降后的人员处理 */
  treatment?: 'enslaved' | 'integrated' | 'released' | 'executed' | 'unknown';
  /** 是否涉及关键人物 */
  involvesKeyPerson?: boolean;
  /** 投降后对战役结果的影响 */
  impact?: 'decisive' | 'significant' | 'minor' | 'unknown';
};

/** 投降统计 */
export type SurrenderStats = {
  type: SurrenderType;
  count: number;
  battles: string[];
  averageScale?: number;
};

/** 阵营投降统计 */
export type SideSurrenderStats = {
  side: SurrenderSide;
  total: number;
  battles: string[];
};

/**
 * 获取投降类型的中文标签
 */
export function getSurrenderTypeLabel(type: SurrenderType): string {
  const labels: Record<SurrenderType, string> = {
    surrender: '投降',
    capitulation: '投降（正式）',
    defection: '倒戈',
    'surrender-after-wound': '受伤投降',
    'mass-surrender': '大规模投降',
    'surrender-pursuit': '投降后追击',
    'refused-surrender': '拒绝投降',
    'negotiated-surrender': '谈判投降',
    unknown: '未知',
  };
  return labels[type] || '未知';
}

/**
 * 获取严重程度的中文标签
 */
export function getSurrenderSeverityLabel(severity: SurrenderSeverity): string {
  const labels: Record<SurrenderSeverity, string> = {
    massive: '大规模',
    significant: '重大',
    moderate: '中等',
    minor: '轻微',
    unknown: '未知',
  };
  return labels[severity] || '未知';
}

/**
 * 获取处理方式的中文标签
 */
export function getTreatmentLabel(treatment: BattleSurrender['treatment']): string {
  const labels: Record<string, string> = {
    enslaved: '沦为奴隶',
    integrated: '改编整合',
    released: '释放',
    executed: '处决',
    unknown: '未知',
  };
  return labels[treatment || 'unknown'] || '未知';
}

/**
 * 获取所有唯一的投降类型
 */
export function getUniqueSurrenderTypes(events: Event[]): SurrenderType[] {
  const types = new Set<SurrenderType>();
  for (const event of events) {
    if (event.battle?.surrender) {
      for (const s of event.battle.surrender) {
        if (s.type !== 'unknown') {
          types.add(s.type);
        }
      }
    }
  }
  return Array.from(types);
}

/**
 * 检查是否有投降数据
 */
export function hasSurrenderData(events: Event[]): boolean {
  return events.some(event => 
    event.battle?.surrender && event.battle.surrender.length > 0
  );
}

/**
 * 获取特定投降类型的统计
 */
export function getSurrenderTypeStats(
  events: Event[],
  surrenderType: SurrenderType
): SurrenderStats {
  const battles: string[] = [];
  let totalScale = 0;
  let countWithScale = 0;

  for (const event of events) {
    if (event.battle?.surrender) {
      const hasThisType = event.battle.surrender.some(
        s => s.type === surrenderType
      );
      if (hasThisType) {
        battles.push(event.titleKey);
        for (const s of event.battle.surrender) {
          if (s.type === surrenderType && s.number) {
            totalScale += s.number;
            countWithScale++;
          }
        }
      }
    }
  }

  return {
    type: surrenderType,
    count: battles.length,
    battles,
    averageScale: countWithScale > 0 ? Math.round(totalScale / countWithScale) : undefined,
  };
}

/**
 * 获取所有投降类型的统计
 */
export function getAllSurrenderTypeStats(events: Event[]): SurrenderStats[] {
  const uniqueTypes = getUniqueSurrenderTypes(events);
  return uniqueTypes.map(type => getSurrenderTypeStats(events, type));
}

/**
 * 按阵营统计投降
 */
export function getSurrenderBySide(events: Event[]): SideSurrenderStats[] {
  const sideStats: Record<string, SideSurrenderStats> = {
    attacker: { side: 'attacker', total: 0, battles: [] },
    defender: { side: 'defender', total: 0, battles: [] },
    both: { side: 'both', total: 0, battles: [] },
    unknown: { side: 'unknown', total: 0, battles: [] },
  };

  for (const event of events) {
    if (event.battle?.surrender) {
      for (const s of event.battle.surrender) {
        const side = s.side || 'unknown';
        if (sideStats[side]) {
          sideStats[side].total++;
          if (!sideStats[side].battles.includes(event.titleKey)) {
            sideStats[side].battles.push(event.titleKey);
          }
        }
      }
    }
  }

  return Object.values(sideStats).filter(s => s.total > 0);
}

/**
 * 获取有投降记录的战役
 */
export function getBattlesWithSurrender(events: Event[]): Event[] {
  return events.filter(event => 
    event.battle?.surrender && event.battle.surrender.length > 0
  );
}

/**
 * 按投降类型筛选战役
 */
export function getBattlesBySurrenderType(
  events: Event[],
  surrenderType: SurrenderType
): Event[] {
  return events.filter(event =>
    event.battle?.surrender?.some(s => s.type === surrenderType)
  );
}

/**
 * 获取大规模投降的战役
 */
export function getMassSurrenderBattles(events: Event[]): Event[] {
  return events.filter(event =>
    event.battle?.surrender?.some(s => s.type === 'mass-surrender' || s.severity === 'massive')
  );
}

/**
 * 获取倒戈的战役
 */
export function getDefectionBattles(events: Event[]): Event[] {
  return events.filter(event =>
    event.battle?.surrender?.some(s => s.type === 'defection')
  );
}

/**
 * 获取决定性投降的战役
 */
export function getDecisiveSurrenderBattles(events: Event[]): Event[] {
  return events.filter(event =>
    event.battle?.surrender?.some(s => s.impact === 'decisive')
  );
}

/**
 * 分析投降与战役结果的关联
 */
export function getSurrenderResultCorrelation(events: Event[]): {
  totalBattlesWithSurrender: number;
  attackerSurrenderVictory: number;
  attackerSurrenderDefeat: number;
  defenderSurrenderVictory: number;
  defenderSurrenderDefeat: number;
  decisiveImpactVictory: number;
  decisiveImpactDefeat: number;
} {
  let attackerSurrenderVictory = 0;
  let attackerSurrenderDefeat = 0;
  let defenderSurrenderVictory = 0;
  let defenderSurrenderDefeat = 0;
  let decisiveImpactVictory = 0;
  let decisiveImpactDefeat = 0;
  let totalBattlesWithSurrender = 0;

  for (const event of events) {
    if (event.battle?.surrender && event.battle.surrender.length > 0) {
      totalBattlesWithSurrender++;
      const hasAttackerSurrender = event.battle.surrender.some(s => s.side === 'attacker');
      const hasDefenderSurrender = event.battle.surrender.some(s => s.side === 'defender');
      const hasDecisiveImpact = event.battle.surrender.some(s => s.impact === 'decisive');

      if (event.battle.result === 'attacker_win') {
        if (hasAttackerSurrender) attackerSurrenderVictory++;
        if (hasDefenderSurrender) defenderSurrenderVictory++;
        if (hasDecisiveImpact) decisiveImpactVictory++;
      } else if (event.battle.result === 'defender_win') {
        if (hasAttackerSurrender) attackerSurrenderDefeat++;
        if (hasDefenderSurrender) defenderSurrenderDefeat++;
        if (hasDecisiveImpact) decisiveImpactDefeat++;
      }
    }
  }

  return {
    totalBattlesWithSurrender,
    attackerSurrenderVictory,
    attackerSurrenderDefeat,
    defenderSurrenderVictory,
    defenderSurrenderDefeat,
    decisiveImpactVictory,
    decisiveImpactDefeat,
  };
}

/**
 * 获取投降人员处理方式统计
 */
export function getTreatmentStats(events: Event[]): {
  treatment: string;
  count: number;
  battles: string[];
}[] {
  const treatmentCount = new Map<string, { count: number; battles: Set<string> }>();

  for (const event of events) {
    if (event.battle?.surrender) {
      for (const s of event.battle.surrender) {
        const treatment = s.treatment || 'unknown';
        if (!treatmentCount.has(treatment)) {
          treatmentCount.set(treatment, { count: 0, battles: new Set() });
        }
        const stats = treatmentCount.get(treatment)!;
        stats.count++;
        stats.battles.add(event.titleKey);
      }
    }
  }

  const results: { treatment: string; count: number; battles: string[] }[] = [];
  for (const [treatment, stats] of treatmentCount) {
    results.push({
      treatment: getTreatmentLabel(treatment as BattleSurrender['treatment']),
      count: stats.count,
      battles: Array.from(stats.battles),
    });
  }

  return results.sort((a, b) => b.count - a.count);
}

/**
 * 分析倒戈对战局的影响
 */
export function getDefectionImpact(events: Event[]): {
  totalDefections: number;
  defectorWins: number;
  defectorLoses: number;
  keyPersonInvolved: number;
} {
  let defectorWins = 0;
  let defectorLoses = 0;
  let keyPersonInvolved = 0;
  let totalDefections = 0;

  for (const event of events) {
    if (event.battle?.surrender) {
      for (const s of event.battle.surrender) {
        if (s.type === 'defection') {
          totalDefections++;
          if (s.involvesKeyPerson) keyPersonInvolved++;
          
          if (event.battle.result === 'attacker_win') {
            defectorWins++;
          } else if (event.battle.result === 'defender_win') {
            defectorLoses++;
          }
        }
      }
    }
  }

  return {
    totalDefections,
    defectorWins,
    defectorLoses,
    keyPersonInvolved,
  };
}

/**
 * 生成投降分析洞察
 */
export function getSurrenderInsights(events: Event[]): string[] {
  const insights: string[] = [];
  
  if (!hasSurrenderData(events)) {
    insights.push('暂无投降/改编数据');
    return insights;
  }

  // 统计投降类型
  const allStats = getAllSurrenderTypeStats(events);
  if (allStats.length > 0) {
    const sortedByCount = [...allStats].sort((a, b) => b.count - a.count);
    const mostCommon = sortedByCount[0];
    insights.push(`最常见的投降类型是${getSurrenderTypeLabel(mostCommon.type)}，共${mostCommon.count}场战役`);
  }

  // 分析阵营投降
  const sideStats = getSurrenderBySide(events);
  const attackerStats = sideStats.find(s => s.side === 'attacker');
  const defenderStats = sideStats.find(s => s.side === 'defender');
  
  if (attackerStats && defenderStats) {
    if (attackerStats.total > defenderStats.total) {
      insights.push(`进攻方投降次数较多（${attackerStats.total}次），可能与攻坚难度高、损失惨重有关`);
    } else if (defenderStats.total > attackerStats.total) {
      insights.push(`防守方投降次数较多（${defenderStats.total}次），防守失败往往导致更大损失`);
    }
  }

  // 分析投降与胜负关联
  const correlation = getSurrenderResultCorrelation(events);
  if (correlation.defenderSurrenderVictory > correlation.defenderSurrenderDefeat) {
    insights.push('防守方投降后，进攻方获胜的概率较高，说明防守方投降往往标志着战役结束');
  }

  // 分析倒戈影响
  const defectionImpact = getDefectionImpact(events);
  if (defectionImpact.totalDefections > 0) {
    insights.push(`历史上有${defectionImpact.totalDefections}次倒戈事件，其中${defectionImpact.keyPersonInvolved}次涉及关键人物`);
    
    if (defectionImpact.defectorWins > defectionImpact.defectorLoses) {
      insights.push('倒戈方在倒戈后获胜的案例较多，说明倒戈往往能改变战局走向');
    }
  }

  // 分析处理方式
  const treatmentStats = getTreatmentStats(events);
  if (treatmentStats.length > 0) {
    const topTreatment = treatmentStats[0];
    insights.push(`最常见的投降人员处理方式是${topTreatment.treatment}（${topTreatment.count}次）`);
  }

  return insights;
}

/**
 * 获取投降分析摘要
 */
export function getSurrenderSummary(events: Event[]): {
  hasData: boolean;
  totalSurrenders: number;
  uniqueSurrenderTypes: number;
  battlesWithSurrender: number;
  statsByType: SurrenderStats[];
  statsBySide: SideSurrenderStats[];
  correlation: ReturnType<typeof getSurrenderResultCorrelation>;
  treatmentStats: ReturnType<typeof getTreatmentStats>;
  defectionImpact: ReturnType<typeof getDefectionImpact>;
  insights: string[];
} {
  const hasData = hasSurrenderData(events);
  
  if (!hasData) {
    return {
      hasData: false,
      totalSurrenders: 0,
      uniqueSurrenderTypes: 0,
      battlesWithSurrender: 0,
      statsByType: [],
      statsBySide: [],
      correlation: {
        totalBattlesWithSurrender: 0,
        attackerSurrenderVictory: 0,
        attackerSurrenderDefeat: 0,
        defenderSurrenderVictory: 0,
        defenderSurrenderDefeat: 0,
        decisiveImpactVictory: 0,
        decisiveImpactDefeat: 0,
      },
      treatmentStats: [],
      defectionImpact: {
        totalDefections: 0,
        defectorWins: 0,
        defectorLoses: 0,
        keyPersonInvolved: 0,
      },
      insights: ['暂无投降/改编数据'],
    };
  }

  const allSurrenders = events.flatMap(e => e.battle?.surrender || []);
  const battlesWithSurrender = getBattlesWithSurrender(events).length;

  return {
    hasData: true,
    totalSurrenders: allSurrenders.length,
    uniqueSurrenderTypes: getUniqueSurrenderTypes(events).length,
    battlesWithSurrender,
    statsByType: getAllSurrenderTypeStats(events),
    statsBySide: getSurrenderBySide(events),
    correlation: getSurrenderResultCorrelation(events),
    treatmentStats: getTreatmentStats(events),
    defectionImpact: getDefectionImpact(events),
    insights: getSurrenderInsights(events),
  };
}
