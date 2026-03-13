import type { Event } from './types';

/** 纪念/遗产类型 */
export type HeritageType =
  | 'memorial'           // 纪念碑/纪念馆
  | 'museum'             // 博物馆
  | 'archaeological-site' // 古战场遗址
  | 'tomb'               // 陵墓/墓地
  | 'temple'             // 祠堂/寺庙
  | 'cultural-site'      // 文化遗址
  | 'literary-work'      // 文学作品
  | 'film-tv'           // 影视作品
  | 'game'               // 游戏
  | 'idiom-proverb'      // 成语/谚语
  | 'place-name'         // 地名影响
  | 'festival'           // 节日/纪念活动
  | 'education'          // 教育/教材
  | 'unknown';

/** 遗产严重程度/重要性 */
export type HeritageSignificance = 'world' | 'national' | 'regional' | 'local' | 'unknown';

/** 战役遗产/纪念数据 */
export type BattleHeritage = {
  /** 遗产类型 */
  type: HeritageType;
  /** 遗产名称 */
  name: string;
  /** 描述 */
  description?: string;
  /** 位置（可选） */
  location?: string;
  /** 重要性级别 */
  significance?: HeritageSignificance;
  /** 建立/出现时间 */
  establishedYear?: number;
  /** 相关人物（可选） */
  relatedFigures?: string[];
  /** 备注 */
  notes?: string;
};

/**
 * 获取遗产类型的中文标签
 */
export function getHeritageTypeLabel(type: HeritageType): string {
  const labels: Record<HeritageType, string> = {
    'memorial': '纪念碑/纪念馆',
    'museum': '博物馆',
    'archaeological-site': '古战场遗址',
    'tomb': '陵墓/墓地',
    'temple': '祠堂/寺庙',
    'cultural-site': '文化遗址',
    'literary-work': '文学作品',
    'film-tv': '影视作品',
    'game': '游戏',
    'idiom-proverb': '成语/谚语',
    'place-name': '地名影响',
    'festival': '节日/纪念活动',
    'education': '教育/教材',
    'unknown': '未知',
  };
  return labels[type] || '未知';
}

/**
 * 获取遗产重要性的中文标签
 */
export function getSignificanceLabel(significance: HeritageSignificance): string {
  const labels: Record<HeritageSignificance, string> = {
    'world': '世界级',
    'national': '国家级',
    'regional': '省级',
    'local': '地方级',
    'unknown': '未知',
  };
  return labels[significance] || '未知';
}

/**
 * 获取所有唯一的遗产类型
 */
export function getUniqueHeritageTypes(events: Event[]): HeritageType[] {
  const types = new Set<HeritageType>();
  events.forEach((event) => {
    if (event.battle?.heritage) {
      event.battle.heritage.forEach((h) => {
        types.add(h.type);
      });
    }
  });
  return Array.from(types);
}

/**
 * 检查是否有遗产数据
 */
export function hasHeritageData(events: Event[]): boolean {
  return events.some((event) => event.battle?.heritage && event.battle.heritage.length > 0);
}

/**
 * 获取特定类型遗产的统计信息
 */
export function getHeritageTypeStats(
  events: Event[],
  type: HeritageType
): { count: number; battles: Event[] } {
  const battles: Event[] = [];
  let count = 0;

  events.forEach((event) => {
    if (event.battle?.heritage) {
      const typeCount = event.battle.heritage.filter((h) => h.type === type).length;
      if (typeCount > 0) {
        count += typeCount;
        battles.push(event);
      }
    }
  });

  return { count, battles };
}

/**
 * 获取所有类型的遗产统计
 */
export function getAllHeritageTypeStats(
  events: Event[]
): Array<{ type: HeritageType; count: number; battles: Event[] }> {
  const uniqueTypes = getUniqueHeritageTypes(events);
  return uniqueTypes.map((type) => ({
    type,
    ...getHeritageTypeStats(events, type),
  }));
}

/**
 * 按遗产类型筛选战役
 */
export function getBattlesByHeritageType(
  events: Event[],
  type: HeritageType
): Event[] {
  return events.filter((event) =>
    event.battle?.heritage?.some((h) => h.type === type)
  );
}

/**
 * 获取最常见的遗产类型
 */
export function getMostCommonHeritageTypes(
  events: Event[],
  limit = 5
): Array<{ type: HeritageType; count: number }> {
  const stats = getAllHeritageTypeStats(events);
  return stats
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((s) => ({ type: s.type, count: s.count }));
}

/**
 * 获取有遗产数据的战役
 */
export function getBattlesWithHeritage(events: Event[]): Event[] {
  return events.filter((event) => event.battle?.heritage && event.battle.heritage.length > 0);
}

/**
 * 获取世界级/国家级的战役遗产
 */
export function getSignificantHeritageBattles(
  events: Event[],
  significance: HeritageSignificance
): Event[] {
  return events.filter((event) =>
    event.battle?.heritage?.some((h) => h.significance === significance)
  );
}

/**
 * 获取有文学作品记载的战役
 */
export function getBattlesWithLiteraryHeritage(events: Event[]): Event[] {
  return getBattlesByHeritageType(events, 'literary-work');
}

/**
 * 获取产生成语的战役
 */
export function getBattlesWithIdioms(events: Event[]): Event[] {
  return getBattlesByHeritageType(events, 'idiom-proverb');
}

/**
 * 获取有影视作品的战役
 */
export function getBattlesWithFilmTV(events: Event[]): Event[] {
  return getBattlesByHeritageType(events, 'film-tv');
}

/**
 * 获取有博物馆/纪念馆的战役
 */
export function getBattlesWithMuseums(events: Event[]): Event[] {
  return events.filter((event) =>
    event.battle?.heritage?.some(
      (h) => h.type === 'memorial' || h.type === 'museum'
    )
  );
}

/**
 * 统计各重要性级别的遗产数量
 */
export function getHeritageSignificanceDistribution(
  events: Event[]
): Array<{ significance: HeritageSignificance; count: number }> {
  const distribution: Record<HeritageSignificance, number> = {
    'world': 0,
    'national': 0,
    'regional': 0,
    'local': 0,
    'unknown': 0,
  };

  events.forEach((event) => {
    event.battle?.heritage?.forEach((h) => {
      const sig = h.significance || 'unknown';
      distribution[sig]++;
    });
  });

  return Object.entries(distribution)
    .filter(([, count]) => count > 0)
    .map(([significance, count]) => ({
      significance: significance as HeritageSignificance,
      count,
    }));
}

/**
 * 获取遗产最多的战役
 */
export function getBattlesWithMostHeritage(
  events: Event[],
  limit = 10
): Array<{ battle: Event; count: number }> {
  const battlesWithHeritage = getBattlesWithHeritage(events);
  return battlesWithHeritage
    .map((battle) => ({
      battle,
      count: battle.battle?.heritage?.length || 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * 遗产与战役结果关联分析
 */
export function getHeritageResultCorrelation(
  events: Event[]
): Array<{ result: string; avgHeritageCount: number; battlesWithHeritage: number }> {
  const resultGroups: Record<string, Event[]> = {
    'attacker_win': [],
    'defender_win': [],
    'draw': [],
    'inconclusive': [],
  };

  events.forEach((event) => {
    const result = event.battle?.result;
    if (result && resultGroups[result]) {
      resultGroups[result].push(event);
    }
  });

  return Object.entries(resultGroups).map(([result, battles]) => {
    const battlesWithHeritage = battles.filter(
      (b) => b.battle?.heritage && b.battle.heritage.length > 0
    ).length;
    const totalHeritage = battles.reduce(
      (sum, b) => sum + (b.battle?.heritage?.length || 0),
      0
    );
    return {
      result,
      avgHeritageCount: battles.length > 0 ? totalHeritage / battles.length : 0,
      battlesWithHeritage,
    };
  });
}

/**
 * 生成遗产分析洞察
 */
export function getHeritageInsights(events: Event[]): string[] {
  const insights: string[] = [];

  if (!hasHeritageData(events)) {
    insights.push('暂无战役遗产数据');
    return insights;
  }

  // 统计最常见的遗产类型
  const commonTypes = getMostCommonHeritageTypes(events, 3);
  if (commonTypes.length > 0) {
    const typeLabels = commonTypes
      .map((t) => getHeritageTypeLabel(t.type))
      .join('、');
    insights.push(`最常见的纪念形式为：${typeLabels}`);
  }

  // 统计成语相关的战役
  const idiomBattles = getBattlesWithIdioms(events);
  if (idiomBattles.length > 0) {
    insights.push(`有${idiomBattles.length}场战役产生了成语典故`);
  }

  // 统计有影视作品的战役
  const filmBattles = getBattlesWithFilmTV(events);
  if (filmBattles.length > 0) {
    insights.push(`有${filmBattles.length}场战役被改编为影视作品`);
  }

  // 统计分析世界级/国家级的遗产
  const significantBattles = getSignificantHeritageBattles(events, 'national');
  if (significantBattles.length > 0) {
    insights.push(`有${significantBattles.length}场战役拥有国家级纪念设施`);
  }

  // 关联胜负分析
  const correlation = getHeritageResultCorrelation(events);
  const attackerWin = correlation.find((c) => c.result === 'attacker_win');
  const defenderWin = correlation.find((c) => c.result === 'defender_win');
  if (attackerWin && defenderWin) {
    if (attackerWin.avgHeritageCount > defenderWin.avgHeritageCount) {
      insights.push('胜利方战役更容易被后人纪念');
    } else if (attackerWin.avgHeritageCount < defenderWin.avgHeritageCount) {
      insights.push('失败方战役同样受到后人关注');
    }
  }

  return insights;
}

/**
 * 获取遗产分析摘要
 */
export function getHeritageSummary(events: Event[]): {
  totalHeritage: number;
  battlesWithHeritage: number;
  heritageTypes: number;
  mostCommonTypes: Array<{ type: HeritageType; count: number }>;
  significanceDistribution: Array<{ significance: HeritageSignificance; count: number }>;
  battlesWithMostHeritage: Array<{ battle: Event; count: number }>;
  insights: string[];
} {
  const battlesWithHeritage = getBattlesWithHeritage(events);
  const allStats = getAllHeritageTypeStats(events);

  return {
    totalHeritage: allStats.reduce((sum, s) => sum + s.count, 0),
    battlesWithHeritage: battlesWithHeritage.length,
    heritageTypes: allStats.length,
    mostCommonTypes: getMostCommonHeritageTypes(events, 5),
    significanceDistribution: getHeritageSignificanceDistribution(events),
    battlesWithMostHeritage: getBattlesWithMostHeritage(events, 5),
    insights: getHeritageInsights(events),
  };
}
