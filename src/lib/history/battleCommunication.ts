/**
 * 战役通信/联络分析模块
 * 分析古代战役中的通信方式、信号系统、情报传递等
 */

import type { Event } from './types';

/** 通信/联络类型 */
export type CommunicationType =
  | 'signal-fire'        // 烽火台/狼烟
  | 'drum'               // 鼓声联络
  | 'horn'               // 号角联络
  | 'flag'               // 战旗/旗帜信号
  | 'messenger'          // 信使/传令兵
  | 'beacon'             // 烽火/信号灯
  | 'relay'              // 驿站/接力传递
  | 'pyrotechnic'        // 烟火信号
  | 'sound-signal'       // 声音信号
  | 'visual-signal'      // 视觉信号
  | 'encrypted-message'   // 密信/暗号
  | 'unknown';

/** 通信结果 */
export type CommunicationResult =
  | 'success'           // 成功传达
  | 'failure'           // 传达失败
  | 'intercepted'       // 被截获
  | 'delayed'           // 延迟传达
  | 'partial'           // 部分传达
  | 'unknown';

/** 通信方向 */
export type CommunicationDirection =
  | 'forward'           // 前线向后方的请求/报告
  | 'backward'          // 后方向前线的指令
  | 'lateral'           // 同级之间的联络
  | 'multi-directional'  // 多方向联络
  | 'unknown';

/** 战役通信数据 */
export type BattleCommunication = {
  /** 通信类型 */
  type: CommunicationType;
  /** 通信描述 */
  description: string;
  /** 发起方 */
  side: 'attacker' | 'defender' | 'both' | 'unknown';
  /** 通信结果 */
  result: CommunicationResult;
  /** 通信方向 */
  direction?: CommunicationDirection;
  /** 是否涉及截获/破解 */
  intercepted?: boolean;
  /** 对战役结果的影响 */
  impact?: 'decisive' | 'significant' | 'minor' | 'unknown';
  /** 备注 */
  notes?: string;
};

/**
 * 获取通信类型的中文标签
 */
export function getCommunicationTypeLabel(type: CommunicationType): string {
  const labels: Record<CommunicationType, string> = {
    'signal-fire': '烽火台/狼烟',
    'drum': '鼓声联络',
    'horn': '号角联络',
    'flag': '战旗/旗帜信号',
    'messenger': '信使/传令兵',
    'beacon': '烽火/信号灯',
    'relay': '驿站/接力传递',
    'pyrotechnic': '烟火信号',
    'sound-signal': '声音信号',
    'visual-signal': '视觉信号',
    'encrypted-message': '密信/暗号',
    'unknown': '未知',
  };
  return labels[type] || '未知';
}

/**
 * 获取通信结果的中文标签
 */
export function getCommunicationResultLabel(result: CommunicationResult): string {
  const labels: Record<CommunicationResult, string> = {
    'success': '成功传达',
    'failure': '传达失败',
    'intercepted': '被截获',
    'delayed': '延迟传达',
    'partial': '部分传达',
    'unknown': '未知',
  };
  return labels[result] || '未知';
}

/**
 * 获取通信方向的中文标签
 */
export function getCommunicationDirectionLabel(direction: CommunicationDirection): string {
  const labels: Record<CommunicationDirection, string> = {
    'forward': '前线→后方',
    'backward': '后方→前线',
    'lateral': '同级联络',
    'multi-directional': '多方向',
    'unknown': '未知',
  };
  return labels[direction] || '未知';
}

/**
 * 检查是否有通信数据
 */
export function hasCommunicationData(events: Event[]): boolean {
  return events.some(event =>
    event.battle?.communications && event.battle.communications.length > 0
  );
}

/**
 * 获取所有唯一通信类型
 */
export function getUniqueCommunicationTypes(events: Event[]): CommunicationType[] {
  const types = new Set<CommunicationType>();
  events.forEach(event => {
    if (event.battle?.communications) {
      event.battle.communications.forEach(comm => types.add(comm.type));
    }
  });
  return Array.from(types);
}

/**
 * 获取特定类型通信的统计信息
 */
export function getCommunicationTypeStats(
  events: Event[],
  type: CommunicationType
): { total: number; success: number; failure: number; intercepted: number } {
  let total = 0;
  let success = 0;
  let failure = 0;
  let intercepted = 0;

  events.forEach(event => {
    if (event.battle?.communications) {
      event.battle.communications.forEach(comm => {
        if (comm.type === type) {
          total++;
          if (comm.result === 'success') success++;
          if (comm.result === 'failure') failure++;
          if (comm.intercepted) intercepted++;
        }
      });
    }
  });

  return { total, success, failure, intercepted };
}

/**
 * 获取所有通信类型的统计信息
 */
export function getAllCommunicationTypeStats(
  events: Event[]
): Array<{
  type: CommunicationType;
  label: string;
  total: number;
  success: number;
  failure: number;
  intercepted: number;
}> {
  const uniqueTypes = getUniqueCommunicationTypes(events);
  return uniqueTypes.map(type => ({
    type,
    label: getCommunicationTypeLabel(type),
    ...getCommunicationTypeStats(events, type),
  }));
}

/**
 * 按阵营统计通信
 */
export function getCommunicationBySide(
  events: Event[]
): { attacker: number; defender: number; both: number; unknown: number } {
  const stats = { attacker: 0, defender: 0, both: 0, unknown: 0 };

  events.forEach(event => {
    if (event.battle?.communications) {
      event.battle.communications.forEach(comm => {
        if (comm.side === 'attacker') stats.attacker++;
        else if (comm.side === 'defender') stats.defender++;
        else if (comm.side === 'both') stats.both++;
        else stats.unknown++;
      });
    }
  });

  return stats;
}

/**
 * 获取有通信记录的战役
 */
export function getBattlesWithCommunication(events: Event[]): Event[] {
  return events.filter(event =>
    event.battle?.communications && event.battle.communications.length > 0
  );
}

/**
 * 按通信类型筛选战役
 */
export function getBattlesByCommunicationType(
  events: Event[],
  type: CommunicationType
): Event[] {
  return events.filter(event =>
    event.battle?.communications?.some(comm => comm.type === type)
  );
}

/**
 * 获取使用特定通信方式最频繁的战役
 */
export function getMostCommunicationBattles(
  events: Event[],
  limit: number = 5
): Array<{ event: Event; count: number }> {
  const battleCounts: Array<{ event: Event; count: number }> = [];

  events.forEach(event => {
    if (event.battle?.communications) {
      battleCounts.push({
        event,
        count: event.battle.communications.length,
      });
    }
  });

  return battleCounts
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * 分析通信与战役结果的关联
 */
export function getCommunicationResultCorrelation(
  events: Event[]
): {
  attacker: { success: number; failure: number };
  defender: { success: number; failure: number };
} {
  const stats = {
    attacker: { success: 0, failure: 0 },
    defender: { success: 0, failure: 0 },
  };

  events.forEach(event => {
    if (event.battle?.communications) {
      event.battle.communications.forEach(comm => {
        if (comm.side === 'attacker' || comm.side === 'both') {
          if (comm.result === 'success') stats.attacker.success++;
          else if (comm.result === 'failure' || comm.result === 'intercepted') {
            stats.attacker.failure++;
          }
        }
        if (comm.side === 'defender' || comm.side === 'both') {
          if (comm.result === 'success') stats.defender.success++;
          else if (comm.result === 'failure' || comm.result === 'intercepted') {
            stats.defender.failure++;
          }
        }
      });
    }
  });

  return stats;
}

/**
 * 分析通信对战役结果的影响
 */
export function getCommunicationImpactAnalysis(
  events: Event[]
): { decisive: number; significant: number; minor: number; unknown: number } {
  const impactStats = { decisive: 0, significant: 0, minor: 0, unknown: 0 };

  events.forEach(event => {
    if (event.battle?.communications) {
      event.battle.communications.forEach(comm => {
        if (comm.impact === 'decisive') impactStats.decisive++;
        else if (comm.impact === 'significant') impactStats.significant++;
        else if (comm.impact === 'minor') impactStats.minor++;
        else impactStats.unknown++;
      });
    }
  });

  return impactStats;
}

/**
 * 获取有决定性通信影响的战役
 */
export function getDecisiveCommunicationBattles(events: Event[]): Event[] {
  return events.filter(event =>
    event.battle?.communications?.some(comm => comm.impact === 'decisive')
  );
}

/**
 * 获取被截获通信的战役
 */
export function getInterceptedCommunicationBattles(events: Event[]): Event[] {
  return events.filter(event =>
    event.battle?.communications?.some(comm => comm.intercepted)
  );
}

/**
 * 生成通信分析洞察
 */
export function getCommunicationInsights(events: Event[]): string[] {
  const insights: string[] = [];

  if (!hasCommunicationData(events)) {
    return ['暂无通信数据'];
  }

  // 统计通信类型
  const allStats = getAllCommunicationTypeStats(events);
  if (allStats.length > 0) {
    const sortedByTotal = [...allStats].sort((a, b) => b.total - a.total);
    const mostUsed = sortedByTotal[0];
    if (mostUsed && mostUsed.total > 0) {
      insights.push(`最常用的通信方式是${mostUsed.label}，共${mostUsed.total}次`);
    }

    // 统计成功/失败率
    const successStats = sortedByTotal.find(s => s.total > 0 && s.success / s.total > 0.7);
    if (successStats) {
      insights.push(`${successStats.label}通信成功率最高，达到${Math.round(successStats.success / successStats.total * 100)}%`);
    }

    const failStats = sortedByTotal.find(s => s.total > 0 && s.failure / s.total > 0.5);
    if (failStats) {
      insights.push(`${failStats.label}失败率较高，需改进通信方式`);
    }
  }

  // 分析截获情况
  const sideStats = getCommunicationBySide(events);
  const totalComms = sideStats.attacker + sideStats.defender + sideStats.both;
  if (totalComms > 0) {
    const interceptedBattles = getInterceptedCommunicationBattles(events);
    if (interceptedBattles.length > 0) {
      insights.push(`有${interceptedBattles.length}场战役的通信被截获，情报安全至关重要`);
    }
  }

  // 分析通信影响
  const impactStats = getCommunicationImpactAnalysis(events);
  if (impactStats.decisive > 0) {
    insights.push(`通信在${impactStats.decisive}场战役中起到决定性作用`);
  }

  return insights.length > 0 ? insights : ['数据不足以生成洞察'];
}

/**
 * 获取完整通信分析摘要
 */
export function getCommunicationSummary(events: Event[]) {
  const battlesWithComm = getBattlesWithCommunication(events);
  const uniqueTypes = getUniqueCommunicationTypes(events);
  const bySide = getCommunicationBySide(events);
  const impactAnalysis = getCommunicationImpactAnalysis(events);
  const resultCorrelation = getCommunicationResultCorrelation(events);
  const mostUsed = getMostCommunicationBattles(events, 3);

  return {
    totalBattlesWithCommunication: battlesWithComm.length,
    uniqueCommunicationTypes: uniqueTypes.length,
    communicationTypes: uniqueTypes.map(t => ({
      type: t,
      label: getCommunicationTypeLabel(t),
    })),
    bySide,
    impactAnalysis,
    resultCorrelation,
    mostUsedBattles: mostUsed.map(b => ({
      battleId: b.event.id,
      titleKey: b.event.titleKey,
      count: b.count,
    })),
    insights: getCommunicationInsights(events),
    hasData: hasCommunicationData(events),
  };
}
