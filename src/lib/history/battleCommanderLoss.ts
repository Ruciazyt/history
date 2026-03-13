/**
 * 战役将领损失分析模块
 * 分析将领阵亡、被俘、投降等对战役结果的影响
 */

import type { Event } from './types';

/** 将领损失类型 */
export type CommanderLossType =
  | 'killed-in-action'     // 阵亡
  | 'captured'            // 被俘
  | 'defected'            // 倒戈/投诚
  | 'deserted'            // 逃亡/开小差
  | 'executed'            // 被处决
  | 'wounded-died'        // 受伤后死亡
  | 'suicide'             // 自杀
  | 'unknown';

/** 将领损失严重程度 */
export type LossSeverity = 'critical' | 'major' | 'minor' | 'unknown';

/** 将领损失阵营 */
export type LossSide = 'attacker' | 'defender' | 'both' | 'unknown';

/** 战役将领损失数据 */
export type BattleCommanderLoss = {
  /** 将领名称 */
  name: string;
  /** 损失类型 */
  type: CommanderLossType;
  /** 描述 */
  description?: string;
  /** 所属阵营 */
  side: LossSide;
  /** 严重程度 */
  severity?: LossSeverity;
  /** 发生在哪个阶段 */
  phase?: string;
  /** 是否为关键将领（对战役有重大影响） */
  isKeyCommander?: boolean;
};

/** 将领损失统计 */
export type CommanderLossStats = {
  type: CommanderLossType;
  count: number;
  battles: string[];
  victoryCount: number;
  defeatCount: number;
  drawCount: number;
};

/** 阵营损失统计 */
export type SideLossStats = {
  side: LossSide;
  totalLosses: number;
  keyCommanderLosses: number;
  battles: string[];
};

/**
 * 获取将领损失类型的中文标签
 */
export function getLossTypeLabel(type: CommanderLossType): string {
  const labels: Record<CommanderLossType, string> = {
    'killed-in-action': '阵亡',
    'captured': '被俘',
    'defected': '倒戈',
    'deserted': '逃亡',
    'executed': '被处决',
    'wounded-died': '受伤不治',
    'suicide': '自杀',
    'unknown': '未知',
  };
  return labels[type] || '未知';
}

/**
 * 获取严重程度的中文标签
 */
export function getSeverityLabel(severity: LossSeverity): string {
  const labels: Record<LossSeverity, string> = {
    critical: '重大损失',
    major: '较大损失',
    minor: '轻微损失',
    unknown: '未知',
  };
  return labels[severity] || '未知';
}

/**
 * 获取所有唯一的将领损失类型
 */
export function getUniqueLossTypes(events: Event[]): CommanderLossType[] {
  const types = new Set<CommanderLossType>();
  for (const event of events) {
    if (event.battle?.commandersLoss) {
      for (const loss of event.battle.commandersLoss) {
        if (loss.type !== 'unknown') {
          types.add(loss.type);
        }
      }
    }
  }
  return Array.from(types);
}

/**
 * 检查是否有将领损失数据
 */
export function hasLossData(events: Event[]): boolean {
  return events.some(event => 
    event.battle?.commandersLoss && event.battle.commandersLoss.length > 0
  );
}

/**
 * 获取特定损失类型的统计
 */
export function getLossTypeStats(
  events: Event[],
  lossType: CommanderLossType
): CommanderLossStats {
  const battles: string[] = [];
  let victoryCount = 0;
  let defeatCount = 0;
  let drawCount = 0;

  for (const event of events) {
    if (event.battle?.commandersLoss) {
      const hasThisType = event.battle.commandersLoss.some(
        loss => loss.type === lossType
      );
      if (hasThisType) {
        battles.push(event.titleKey);
        if (event.battle.result === 'attacker_win') victoryCount++;
        else if (event.battle.result === 'defender_win') defeatCount++;
        else drawCount++;
      }
    }
  }

  return {
    type: lossType,
    count: battles.length,
    battles,
    victoryCount,
    defeatCount,
    drawCount,
  };
}

/**
 * 获取所有损失类型的统计
 */
export function getAllLossTypeStats(events: Event[]): CommanderLossStats[] {
  const uniqueTypes = getUniqueLossTypes(events);
  return uniqueTypes.map(type => getLossTypeStats(events, type));
}

/**
 * 按阵营统计将领损失
 */
export function getLossBySide(events: Event[]): SideLossStats[] {
  const sideStats: Record<string, SideLossStats> = {
    attacker: { side: 'attacker', totalLosses: 0, keyCommanderLosses: 0, battles: [] },
    defender: { side: 'defender', totalLosses: 0, keyCommanderLosses: 0, battles: [] },
    both: { side: 'both', totalLosses: 0, keyCommanderLosses: 0, battles: [] },
    unknown: { side: 'unknown', totalLosses: 0, keyCommanderLosses: 0, battles: [] },
  };

  for (const event of events) {
    if (event.battle?.commandersLoss) {
      for (const loss of event.battle.commandersLoss) {
        const side = loss.side || 'unknown';
        if (sideStats[side]) {
          sideStats[side].totalLosses++;
          if (loss.isKeyCommander) {
            sideStats[side].keyCommanderLosses++;
          }
          if (!sideStats[side].battles.includes(event.titleKey)) {
            sideStats[side].battles.push(event.titleKey);
          }
        }
      }
    }
  }

  return Object.values(sideStats).filter(s => s.totalLosses > 0);
}

/**
 * 获取有将领损失的战役
 */
export function getBattlesWithLosses(events: Event[]): Event[] {
  return events.filter(event => 
    event.battle?.commandersLoss && event.battle.commandersLoss.length > 0
  );
}

/**
 * 按损失类型筛选战役
 */
export function getBattlesByLossType(
  events: Event[],
  lossType: CommanderLossType
): Event[] {
  return events.filter(event =>
    event.battle?.commandersLoss?.some(loss => loss.type === lossType)
  );
}

/**
 * 获取关键将领损失的战役
 */
export function getBattlesWithKeyCommanderLoss(events: Event[]): Event[] {
  return events.filter(event =>
    event.battle?.commandersLoss?.some(loss => loss.isKeyCommander)
  );
}

/**
 * 分析将领损失与战役结果的关联
 */
export function getLossResultCorrelation(events: Event[]): {
  totalBattlesWithLoss: number;
  attackerLossVictory: number;
  attackerLossDefeat: number;
  defenderLossVictory: number;
  defenderLossDefeat: number;
  keyLossVictory: number;
  keyLossDefeat: number;
} {
  let attackerLossVictory = 0;
  let attackerLossDefeat = 0;
  let defenderLossVictory = 0;
  let defenderLossDefeat = 0;
  let keyLossVictory = 0;
  let keyLossDefeat = 0;
  let totalBattlesWithLoss = 0;

  for (const event of events) {
    if (event.battle?.commandersLoss && event.battle.commandersLoss.length > 0) {
      totalBattlesWithLoss++;
      const hasAttackerLoss = event.battle.commandersLoss.some(l => l.side === 'attacker');
      const hasDefenderLoss = event.battle.commandersLoss.some(l => l.side === 'defender');
      const hasKeyLoss = event.battle.commandersLoss.some(l => l.isKeyCommander);

      if (event.battle.result === 'attacker_win') {
        if (hasAttackerLoss) attackerLossVictory++;
        if (hasDefenderLoss) defenderLossVictory++;
        if (hasKeyLoss) keyLossVictory++;
      } else if (event.battle.result === 'defender_win') {
        if (hasAttackerLoss) attackerLossDefeat++;
        if (hasDefenderLoss) defenderLossDefeat++;
        if (hasKeyLoss) keyLossDefeat++;
      }
    }
  }

  return {
    totalBattlesWithLoss,
    attackerLossVictory,
    attackerLossDefeat,
    defenderLossVictory,
    defenderLossDefeat,
    keyLossVictory,
    keyLossDefeat,
  };
}

/**
 * 获取损失最严重的战役
 */
export function getMostLossesBattles(events: Event[], limit = 5): {
  event: Event;
  lossCount: number;
  keyLossCount: number;
}[] {
  const battlesWithLosses = getBattlesWithLosses(events);
  
  const sorted = battlesWithLosses
    .map(event => ({
      event,
      lossCount: event.battle?.commandersLoss?.length || 0,
      keyLossCount: event.battle?.commandersLoss?.filter(l => l.isKeyCommander).length || 0,
    }))
    .sort((a, b) => b.lossCount - a.lossCount || b.keyLossCount - a.keyLossCount);

  return sorted.slice(0, limit);
}

/**
 * 分析阵亡将领统计
 */
export function getKilledInActionStats(events: Event[]): {
  total: number;
  attackerKilled: number;
  defenderKilled: number;
  battles: string[];
} {
  let attackerKilled = 0;
  let defenderKilled = 0;
  const battles: string[] = [];

  for (const event of events) {
    if (event.battle?.commandersLoss) {
      const hasKilled = event.battle.commandersLoss.some(l => l.type === 'killed-in-action');
      if (hasKilled) {
        battles.push(event.titleKey);
        for (const loss of event.battle.commandersLoss) {
          if (loss.type === 'killed-in-action') {
            if (loss.side === 'attacker') attackerKilled++;
            else if (loss.side === 'defender') defenderKilled++;
          }
        }
      }
    }
  }

  return {
    total: attackerKilled + defenderKilled,
    attackerKilled,
    defenderKilled,
    battles,
  };
}

/**
 * 分析被俘将领统计
 */
export function getCapturedStats(events: Event[]): {
  total: number;
  attackerCaptured: number;
  defenderCaptured: number;
  battles: string[];
} {
  let attackerCaptured = 0;
  let defenderCaptured = 0;
  const battles: string[] = [];

  for (const event of events) {
    if (event.battle?.commandersLoss) {
      const hasCaptured = event.battle.commandersLoss.some(l => l.type === 'captured');
      if (hasCaptured) {
        battles.push(event.titleKey);
        for (const loss of event.battle.commandersLoss) {
          if (loss.type === 'captured') {
            if (loss.side === 'attacker') attackerCaptured++;
            else if (loss.side === 'defender') defenderCaptured++;
          }
        }
      }
    }
  }

  return {
    total: attackerCaptured + defenderCaptured,
    attackerCaptured,
    defenderCaptured,
    battles,
  };
}

/**
 * 生成将领损失分析洞察
 */
export function getCommanderLossInsights(events: Event[]): string[] {
  const insights: string[] = [];
  
  if (!hasLossData(events)) {
    insights.push('暂无将领损失数据');
    return insights;
  }

  // 统计各种损失类型
  const allStats = getAllLossTypeStats(events);
  if (allStats.length > 0) {
    const sortedByCount = [...allStats].sort((a, b) => b.count - a.count);
    const mostCommon = sortedByCount[0];
    insights.push(`最常见的将领损失类型是${getLossTypeLabel(mostCommon.type)}，共${mostCommon.count}场战役`);
    
    // 分析胜负关联
    if (mostCommon.victoryCount > mostCommon.defeatCount) {
      insights.push(`当出现${getLossTypeLabel(mostCommon.type)}时，进攻方胜率较高`);
    } else if (mostCommon.defeatCount > mostCommon.victoryCount) {
      insights.push(`当出现${getLossTypeLabel(mostCommon.type)}时，防守方胜率较高`);
    }
  }

  // 分析阵营损失
  const sideStats = getLossBySide(events);
  const attackerStats = sideStats.find(s => s.side === 'attacker');
  const defenderStats = sideStats.find(s => s.side === 'defender');
  
  if (attackerStats && defenderStats) {
    if (attackerStats.totalLosses > defenderStats.totalLosses) {
      insights.push(`进攻方将领损失较多（${attackerStats.totalLosses}人），可能与主动进攻风险较高有关`);
    } else if (defenderStats.totalLosses > attackerStats.totalLosses) {
      insights.push(`防守方将领损失较多（${defenderStats.totalLosses}人），防守失败往往代价惨重`);
    }
  }

  // 分析关键将领损失
  const correlation = getLossResultCorrelation(events);
  if (correlation.keyLossVictory > correlation.keyLossDefeat) {
    insights.push('关键将领损失后，进攻方仍能获胜的案例较多，说明体系化作战不依赖单一将领');
  } else if (correlation.keyLossDefeat > correlation.keyLossVictory) {
    insights.push('关键将领损失往往导致战败，凸显了优秀指挥官的重要性');
  }

  // 分析阵亡统计
  const killedStats = getKilledInActionStats(events);
  if (killedStats.total > 0) {
    insights.push(`历史上有${killedStats.total}位将领在战斗中阵亡，其中进攻方${killedStats.attackerKilled}人，防守方${killedStats.defenderKilled}人`);
  }

  return insights;
}

/**
 * 获取将领损失分析摘要
 */
export function getLossSummary(events: Event[]): {
  hasData: boolean;
  totalLosses: number;
  uniqueLossTypes: number;
  battlesWithLosses: number;
  keyCommanderLosses: number;
  statsByType: CommanderLossStats[];
  statsBySide: SideLossStats[];
  correlation: ReturnType<typeof getLossResultCorrelation>;
  mostLossesBattles: ReturnType<typeof getMostLossesBattles>;
  insights: string[];
} {
  const hasData = hasLossData(events);
  
  if (!hasData) {
    return {
      hasData: false,
      totalLosses: 0,
      uniqueLossTypes: 0,
      battlesWithLosses: 0,
      keyCommanderLosses: 0,
      statsByType: [],
      statsBySide: [],
      correlation: {
        totalBattlesWithLoss: 0,
        attackerLossVictory: 0,
        attackerLossDefeat: 0,
        defenderLossVictory: 0,
        defenderLossDefeat: 0,
        keyLossVictory: 0,
        keyLossDefeat: 0,
      },
      mostLossesBattles: [],
      insights: ['暂无将领损失数据'],
    };
  }

  const allLosses = events.flatMap(e => e.battle?.commandersLoss || []);
  const keyCommanderLosses = allLosses.filter(l => l.isKeyCommander).length;
  const battlesWithLosses = getBattlesWithLosses(events).length;

  return {
    hasData: true,
    totalLosses: allLosses.length,
    uniqueLossTypes: getUniqueLossTypes(events).length,
    battlesWithLosses,
    keyCommanderLosses,
    statsByType: getAllLossTypeStats(events),
    statsBySide: getLossBySide(events),
    correlation: getLossResultCorrelation(events),
    mostLossesBattles: getMostLossesBattles(events),
    insights: getCommanderLossInsights(events),
  };
}
