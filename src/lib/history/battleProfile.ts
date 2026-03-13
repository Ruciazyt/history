import type { Event, Era, BattleTerrain, BattleWeather, BattlePacing, BattleStrategy, BattleFormation } from './types';
import { getBattles } from './battles';

/**
 * 战役综合画像分析模块
 * 整合所有分析维度，生成单场战役的全面分析报告
 */

// 地形标签映射
const TERRAIN_LABELS: Record<string, string> = {
  plains: '平原',
  mountains: '山地',
  hills: '丘陵',
  water: '水域',
  desert: '沙漠',
  plateau: '高原',
  forest: '森林',
  marsh: '沼泽',
  coastal: '沿海',
  urban: '城市',
  pass: '关隘',
  unknown: '未知',
};

// 天气标签映射
const WEATHER_LABELS: Record<string, string> = {
  clear: '晴天',
  rainy: '雨天',
  snowy: '雪天',
  windy: '大风',
  foggy: '雾天',
  stormy: '暴风雨',
  cloudy: '多云',
  hot: '炎热',
  cold: '寒冷',
  unknown: '未知',
};

// 战术标签映射
const STRATEGY_LABELS: Record<string, string> = {
  ambush: '伏击',
  fire: '火攻',
  water: '水攻',
  encirclement: '包围',
  siege: '攻城',
  pincer: '钳形攻势',
  'feigned-retreat': '诱敌深入',
  alliance: '联盟作战',
  defensive: '防御作战',
  offensive: '进攻作战',
  guerrilla: '游击战',
  unknown: '未知',
};

// 节奏标签映射
const PACING_LABELS: Record<string, string> = {
  surprise: '突袭战',
  rapid: '快速决战',
  extended: '持久战',
  siege: '围城战',
  unknown: '未知',
};

// 时间段标签映射
const TIME_OF_DAY_LABELS: Record<string, string> = {
  dawn: '黎明',
  morning: '上午',
  afternoon: '下午',
  evening: '傍晚',
  night: '夜间',
  unknown: '未知',
};

// 持续时间分类标签
const DURATION_CATEGORY_LABELS: Record<string, string> = {
  daily: '一日之战',
  short: '短期战役(1-3天)',
  medium: '中期战役(4-7天)',
  extended: '长期战役(8-30天)',
  protracted: '持久战(30天以上)',
  unknown: '未知',
};

// 阵型标签映射
const FORMATION_LABELS: Record<string, string> = {
  'long-wedge': '锥形阵',
  'frontal-attack': '正面突击',
  flanking: '侧翼攻击',
  encirclement: '包围阵型',
  defensive: '防御阵型',
  retreating: '撤退阵型',
  'center-break': '中央突破',
  skirmish: '散兵阵型',
  'cavalry-flank': '骑兵侧翼',
  'chariot-charge': '战车冲击',
  'mixed-formation': '混合阵型',
  unknown: '未知',
};

/**
 * 战役画像数据类型
 */
export type BattleProfileData = {
  /** 基础信息 */
  basic: {
    id: string;
    name: string;
    year: number;
    month?: number;
    dynasty: string;
    result: 'attacker_win' | 'defender_win' | 'draw' | 'inconclusive';
    resultLabel: string;
  };
  /** 参战方信息 */
  belligerents: {
    attacker: string;
    defender: string;
    commanders: {
      attacker: string[];
      defender: string[];
    };
  };
  /** 规模信息 */
  scale: {
    level: string;
    label: string;
  };
  /** 影响力信息 */
  impact: {
    level: string;
    label: string;
  };
  /** 地形分析 */
  terrain: {
    types: string[];
    labels: string[];
    advantage: string;
  };
  /** 天气分析 */
  weather: {
    conditions: string[];
    labels: string[];
  };
  /** 战术分析 */
  strategy: {
    tactics: string[];
    labels: string[];
    style: string;
  };
  /** 节奏分析 */
  pacing: {
    type: string;
    label: string;
    timeOfDay?: string;
    timeOfDayLabel?: string;
  };
  /** 转折点分析 */
  turningPoints: {
    count: number;
    descriptions: string[];
  };
  /** 后果分析 */
  aftermath: {
    count: number;
    types: string[];
    descriptions: string[];
  };
  /** 情报分析 */
  intelligence: {
    count: number;
    types: string[];
    descriptions: string[];
  };
  /** 原因分析 */
  causes: {
    count: number;
    types: string[];
    descriptions: string[];
  };
  /** 持续时间 */
  duration: {
    days: number;
    category: string;
    label: string;
  };
  /** 阵型分析 */
  formations: {
    attacker: string[];
    attackerLabels: string[];
    defender: string[];
    defenderLabels: string[];
  };
  /** 士气因素 */
  morale: {
    factors: string[];
    descriptions: string[];
    initialAttacker?: string;
    initialDefender?: string;
  };
  /** 综合洞察 */
  insights: string[];
  /** 独特特征 */
  uniqueFeatures: string[];
};

/**
 * 画像摘要类型
 */
export type ProfileSummary = {
  totalBattles: number;
  analyzedBattles: number;
  averageScale: string;
  mostCommonResult: string;
  analysisCoverage: {
    hasTerrain: number;
    hasWeather: number;
    hasStrategy: number;
    hasTurningPoints: number;
    hasAftermath: number;
    hasIntelligence: number;
    hasMorale: number;
    hasDuration: number;
    hasFormations: number;
  };
};

/**
 * 地形优势分析
 */
function analyzeTerrainAdvantage(terrains?: BattleTerrain[]): string {
  if (!terrains || terrains.length === 0) return '未知';
  
  const defensiveTerrains = ['mountains', 'hills', 'marsh', 'pass'];
  const offensiveTerrains = ['plains'];
  
  const hasDefensive = terrains.some(t => defensiveTerrains.includes(t));
  const hasOffensive = terrains.some(t => offensiveTerrains.includes(t));
  
  if (hasDefensive && !hasOffensive) return '防守方优势';
  if (hasOffensive && !hasDefensive) return '进攻方优势';
  return '双方平衡';
}

/**
 * 战术风格分析
 */
function analyzeStrategyStyle(strategies?: BattleStrategy[]): string {
  if (!strategies || strategies.length === 0) return '未知';
  
  const offensiveStrategies = ['offensive', 'ambush', 'fire', 'encirclement', 'pincer'];
  const defensiveStrategies = ['defensive', 'siege'];
  
  const offensiveCount = strategies.filter(s => offensiveStrategies.includes(s)).length;
  const defensiveCount = strategies.filter(s => defensiveStrategies.includes(s)).length;
  
  if (offensiveCount > defensiveCount) return '进攻型';
  if (defensiveCount > offensiveCount) return '防守型';
  return '灵活型';
}

/**
 * 获取持续时间分类
 */
function getDurationCategory(days?: number): string {
  if (!days) return 'unknown';
  if (days <= 1) return 'daily';
  if (days <= 3) return 'short';
  if (days <= 7) return 'medium';
  if (days <= 30) return 'extended';
  return 'protracted';
}

/**
 * 生成独特特征
 */
function generateUniqueFeatures(battle: Event): string[] {
  const features: string[] = [];
  const bd = battle.battle;
  if (!bd) return features;

  // 规模特征
  if (bd.scale === 'massive') {
    features.push('超大规模战役');
  } else if (bd.scale === 'large') {
    features.push('大规模战役');
  }

  // 影响力特征
  if (bd.impact === 'decisive') {
    features.push('决定性战役');
  } else if (bd.impact === 'major') {
    features.push('重大战役');
  }

  // 转折点特征 (2个及以上即为多转折点)
  if ((bd.turningPoints?.length || 0) >= 2) {
    features.push('多转折点战役');
  }

  // 战术特征
  if (bd.strategy?.includes('ambush')) {
    features.push('伏击经典战例');
  }
  if (bd.strategy?.includes('fire')) {
    features.push('火攻战例');
  }
  if (bd.strategy?.includes('water')) {
    features.push('水攻战例');
  }

  // 天气特征
  if (bd.weather?.includes('foggy')) {
    features.push('雾战');
  }
  if (bd.weather?.includes('rainy')) {
    features.push('雨战');
  }

  // 地形特征
  if (bd.terrain?.includes('pass')) {
    features.push('关隘争夺战');
  }
  if (bd.terrain?.includes('marsh')) {
    features.push('沼泽战');
  }

  // 持续时间特征
  if (bd.duration === 1) {
    features.push('一日决战');
  } else if ((bd.duration || 0) > 30) {
    features.push('持久战');
  }

  // 后果特征
  if (bd.aftermath?.some(a => a.type === 'dynastic-change')) {
    features.push('改朝换代');
  }
  if (bd.aftermath?.some(a => a.type === 'territorial-change')) {
    features.push('领土变更');
  }

  // 士气特征
  if (bd.moraleFactors?.length) {
    features.push('士气因素显著');
  }

  // 情报特征
  if (bd.intelligence?.length) {
    features.push('情报战');
  }

  return features;
}

/**
 * 生成洞察
 */
function generateInsights(battle: Event): string[] {
  const insights: string[] = [];
  const bd = battle.battle;
  if (!bd) return insights;

  // 结果洞察
  if (bd.result === 'attacker_win') {
    insights.push('进攻方取得胜利');
  } else if (bd.result === 'defender_win') {
    insights.push('防守方取得胜利');
  }

  // 指挥官洞察
  if (bd.commanders?.attacker?.length) {
    insights.push(`进攻方指挥官: ${bd.commanders.attacker.join('、')}`);
  }
  if (bd.commanders?.defender?.length) {
    insights.push(`防守方指挥官: ${bd.commanders.defender.join('、')}`);
  }

  // 规模洞察
  if (bd.scale === 'massive') {
    insights.push('这是一场超大规模的战役');
  }

  // 影响力洞察
  if (bd.impact === 'decisive') {
    insights.push('此战役对战局产生决定性影响');
  }

  // 战术洞察
  if (bd.strategy?.includes('ambush')) {
    insights.push('运用了伏击战术');
  }
  if (bd.strategy?.includes('fire')) {
    insights.push('使用了火攻策略');
  }

  return insights;
}

/**
 * 根据ID获取战役
 */
function getBattleById(events: Event[], battleId: string): Event | undefined {
  const battles = getBattles(events);
  return battles.find(b => b.id === battleId);
}

/**
 * 获取战役画像
 * @param events 所有事件数据
 * @param eras 所有时代数据
 * @param battleId 战役ID
 * @returns 战役画像数据
 */
export function getBattleProfile(events: Event[], eras: Era[], battleId: string): BattleProfileData | null {
  const battle = getBattleById(events, battleId);
  if (!battle || !battle.battle) return null;

  const battleData = battle.battle;
  const name = battle.titleKey || battleId;
  
  // 获取朝代名称
  const era = eras.find(e => e.id === battle.entityId);
  const dynastyName = era?.nameKey || battle.entityId;

  const resultLabels: Record<string, string> = {
    attacker_win: '进攻方胜利',
    defender_win: '防守方胜利',
    draw: '平局',
    inconclusive: '未决',
  };

  const scaleLabels: Record<string, string> = {
    massive: '超大规模',
    large: '大规模',
    medium: '中等规模',
    small: '小规模',
    unknown: '未知',
  };

  const impactLabels: Record<string, string> = {
    decisive: '决定性',
    major: '重大',
    minor: '轻微',
    unknown: '未知',
  };

  // 生成独特特征
  const uniqueFeatures = generateUniqueFeatures(battle);

  // 生成洞察
  const insights = generateInsights(battle);

  return {
    basic: {
      id: battle.id,
      name,
      year: battle.year,
      month: battle.month,
      dynasty: dynastyName,
      result: battleData.result || 'inconclusive',
      resultLabel: resultLabels[battleData.result || 'inconclusive'] || '未决',
    },
    belligerents: {
      attacker: battleData.belligerents?.attacker || '未知',
      defender: battleData.belligerents?.defender || '未知',
      commanders: {
        attacker: battleData.commanders?.attacker || [],
        defender: battleData.commanders?.defender || [],
      },
    },
    scale: {
      level: battleData.scale || 'unknown',
      label: scaleLabels[battleData.scale || 'unknown'] || '未知',
    },
    impact: {
      level: battleData.impact || 'unknown',
      label: impactLabels[battleData.impact || 'unknown'] || '未知',
    },
    terrain: {
      types: battleData.terrain?.map(t => t) || [],
      labels: (battleData.terrain?.map(t => TERRAIN_LABELS[t] || t) || []),
      advantage: analyzeTerrainAdvantage(battleData.terrain),
    },
    weather: {
      conditions: battleData.weather?.map(w => w) || [],
      labels: (battleData.weather?.map(w => WEATHER_LABELS[w] || w) || []),
    },
    strategy: {
      tactics: battleData.strategy?.map(s => s) || [],
      labels: (battleData.strategy?.map(s => STRATEGY_LABELS[s] || s) || []),
      style: analyzeStrategyStyle(battleData.strategy),
    },
    pacing: {
      type: battleData.pacing || 'unknown',
      label: PACING_LABELS[battleData.pacing || 'unknown'] || '未知',
      timeOfDay: battleData.timeOfDay,
      timeOfDayLabel: battleData.timeOfDay ? (TIME_OF_DAY_LABELS[battleData.timeOfDay] || '未知') : undefined,
    },
    turningPoints: {
      count: battleData.turningPoints?.length || 0,
      descriptions: battleData.turningPoints?.map(tp => tp.description) || [],
    },
    aftermath: {
      count: battleData.aftermath?.length || 0,
      types: battleData.aftermath?.map(a => a.type) || [],
      descriptions: battleData.aftermath?.map(a => a.description) || [],
    },
    intelligence: {
      count: battleData.intelligence?.length || 0,
      types: battleData.intelligence?.map(i => i.type) || [],
      descriptions: battleData.intelligence?.map(i => i.description) || [],
    },
    causes: {
      count: battleData.causes?.length || 0,
      types: battleData.causes?.map(c => c.type) || [],
      descriptions: battleData.causes?.map(c => c.description) || [],
    },
    duration: {
      days: battleData.duration || 0,
      category: getDurationCategory(battleData.duration),
      label: DURATION_CATEGORY_LABELS[getDurationCategory(battleData.duration)] || '未知',
    },
    formations: {
      attacker: battleData.formations?.filter(f => f.side === 'attacker' || f.side === 'both').map(f => f.formation) || [],
      attackerLabels: battleData.formations?.filter(f => f.side === 'attacker' || f.side === 'both').map(f => FORMATION_LABELS[f.formation] || f.formation) || [],
      defender: battleData.formations?.filter(f => f.side === 'defender' || f.side === 'both').map(f => f.formation) || [],
      defenderLabels: battleData.formations?.filter(f => f.side === 'defender' || f.side === 'both').map(f => FORMATION_LABELS[f.formation] || f.formation) || [],
    },
    morale: {
      factors: battleData.moraleFactors?.map(m => m.type) || [],
      descriptions: battleData.moraleFactors?.map(m => m.description) || [],
      initialAttacker: battleData.initialMorale?.attacker,
      initialDefender: battleData.initialMorale?.defender,
    },
    insights,
    uniqueFeatures,
  };
}

/**
 * 获取所有战役的画像摘要
 * @param events 所有事件数据
 * @param eras 所有时代数据
 * @returns 画像摘要
 */
export function getProfileSummary(events: Event[], eras: Era[]): ProfileSummary {
  const battles = getBattles(events);
  const battleList = battles.filter(b => b.battle);

  // 统计各分析维度的覆盖率
  let hasTerrain = 0, hasWeather = 0, hasStrategy = 0;
  let hasTurningPoints = 0, hasAftermath = 0, hasIntelligence = 0;
  let hasMorale = 0, hasDuration = 0, hasFormations = 0;

  const scaleCounts: Record<string, number> = {};

  for (const battle of battleList) {
    const bd = battle.battle;
    if (!bd) continue;

    if (bd.terrain?.length) hasTerrain++;
    if (bd.weather?.length) hasWeather++;
    if (bd.strategy?.length) hasStrategy++;
    if (bd.turningPoints?.length) hasTurningPoints++;
    if (bd.aftermath?.length) hasAftermath++;
    if (bd.intelligence?.length) hasIntelligence++;
    if (bd.moraleFactors?.length || bd.initialMorale) hasMorale++;
    if (bd.duration) hasDuration++;
    if (bd.formations?.length) hasFormations++;

    if (bd.scale) {
      scaleCounts[bd.scale] = (scaleCounts[bd.scale] || 0) + 1;
    }
  }

  // 找出最常见规模
  let mostCommonScale = 'unknown';
  let maxScaleCount = 0;
  for (const [scale, count] of Object.entries(scaleCounts)) {
    if (count > maxScaleCount) {
      maxScaleCount = count;
      mostCommonScale = scale;
    }
  }

  const scaleLabels: Record<string, string> = {
    massive: '超大规模',
    large: '大规模',
    medium: '中等规模',
    small: '小规模',
    unknown: '未知',
  };

  // 统计最常见结果
  const resultCounts: Record<string, number> = {};
  for (const battle of battleList) {
    const result = battle.battle?.result || 'unknown';
    resultCounts[result] = (resultCounts[result] || 0) + 1;
  }
  let mostCommonResult = 'unknown';
  let maxCount = 0;
  for (const [result, count] of Object.entries(resultCounts)) {
    if (count > maxCount) {
      maxCount = count;
      mostCommonResult = result;
    }
  }

  const resultLabels: Record<string, string> = {
    attacker_win: '进攻方胜利',
    defender_win: '防守方胜利',
    draw: '平局',
    inconclusive: '未决',
    unknown: '未知',
  };

  return {
    totalBattles: events.length,
    analyzedBattles: battleList.length,
    averageScale: scaleLabels[mostCommonScale] || '未知',
    mostCommonResult: resultLabels[mostCommonResult] || '未知',
    analysisCoverage: {
      hasTerrain,
      hasWeather,
      hasStrategy,
      hasTurningPoints,
      hasAftermath,
      hasIntelligence,
      hasMorale,
      hasDuration,
      hasFormations,
    },
  };
}

/**
 * 获取战役对比报告
 * @param events 所有事件数据
 * @param eras 所有时代数据
 * @param battleId1 第一场战役ID
 * @param battleId2 第二场战役ID
 * @returns 对比报告
 */
export function compareBattleProfiles(
  events: Event[], 
  eras: Era[], 
  battleId1: string, 
  battleId2: string
): {
  profile1: BattleProfileData | null;
  profile2: BattleProfileData | null;
  comparison: {
    dimension: string;
    winner: 'profile1' | 'profile2' | 'tie';
    detail: string;
  }[];
  summary: string;
} | null {
  const profile1 = getBattleProfile(events, eras, battleId1);
  const profile2 = getBattleProfile(events, eras, battleId2);

  if (!profile1 || !profile2) return null;

  const comparison: {
    dimension: string;
    winner: 'profile1' | 'profile2' | 'tie';
    detail: string;
  }[] = [];

  // 规模对比
  const scaleOrder = ['massive', 'large', 'medium', 'small', 'unknown'];
  const scale1Idx = scaleOrder.indexOf(profile1.scale.level);
  const scale2Idx = scaleOrder.indexOf(profile2.scale.level);
  
  if (scale1Idx < scale2Idx) {
    comparison.push({
      dimension: '战役规模',
      winner: 'profile1',
      detail: `${profile1.basic.name} (${profile1.scale.label}) vs ${profile2.basic.name} (${profile2.scale.label})`,
    });
  } else if (scale1Idx > scale2Idx) {
    comparison.push({
      dimension: '战役规模',
      winner: 'profile2',
      detail: `${profile1.basic.name} (${profile1.scale.label}) vs ${profile2.basic.name} (${profile2.scale.label})`,
    });
  }

  // 影响力对比
  const impactOrder = ['decisive', 'major', 'minor', 'unknown'];
  const impact1Idx = impactOrder.indexOf(profile1.impact.level);
  const impact2Idx = impactOrder.indexOf(profile2.impact.level);
  
  if (impact1Idx < impact2Idx) {
    comparison.push({
      dimension: '影响力',
      winner: 'profile1',
      detail: `${profile1.basic.name} (${profile1.impact.label}) vs ${profile2.basic.name} (${profile2.impact.label})`,
    });
  } else if (impact1Idx > impact2Idx) {
    comparison.push({
      dimension: '影响力',
      winner: 'profile2',
      detail: `${profile1.basic.name} (${profile1.impact.label}) vs ${profile2.basic.name} (${profile2.impact.label})`,
    });
  }

  // 转折点对比
  if (profile1.turningPoints.count > profile2.turningPoints.count) {
    comparison.push({
      dimension: '转折点数量',
      winner: 'profile1',
      detail: `${profile1.turningPoints.count} vs ${profile2.turningPoints.count}`,
    });
  } else if (profile1.turningPoints.count < profile2.turningPoints.count) {
    comparison.push({
      dimension: '转折点数量',
      winner: 'profile2',
      detail: `${profile1.turningPoints.count} vs ${profile2.turningPoints.count}`,
    });
  }

  // 持续时间对比
  if (profile1.duration.days > profile2.duration.days) {
    comparison.push({
      dimension: '持续时间',
      winner: 'profile1',
      detail: `${profile1.duration.days}天 vs ${profile2.duration.days}天`,
    });
  } else if (profile1.duration.days < profile2.duration.days) {
    comparison.push({
      dimension: '持续时间',
      winner: 'profile2',
      detail: `${profile1.duration.days}天 vs ${profile2.duration.days}天`,
    });
  }

  // 独特特征对比
  comparison.push({
    dimension: '独特特征',
    winner: 'tie',
    detail: `${profile1.basic.name}: ${profile1.uniqueFeatures.join('、') || '无'}\n${profile2.basic.name}: ${profile2.uniqueFeatures.join('、') || '无'}`,
  });

  // 生成总结
  let summary = '';
  const scaleWinner = scale1Idx < scale2Idx ? profile1.basic.name : (scale1Idx > scale2Idx ? profile2.basic.name : '持平');
  summary = `${profile1.basic.name} 与 ${profile2.basic.name} 对比：规模方面${scaleWinner}`;

  return {
    profile1,
    profile2,
    comparison,
    summary,
  };
}

/**
 * 检查是否有画像数据
 * @param events 所有事件数据
 * @returns 是否有画像数据
 */
export function hasProfileData(events: Event[]): boolean {
  const battles = getBattles(events);
  return battles.some(b => b.battle);
}
