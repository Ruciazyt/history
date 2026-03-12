import type { Event, BattleTerrain, BattleWeather, BattlePacing, BattleStrategy, BattleScale } from './types';
import { getBattles } from './battles';

/**
 * 战役胜负预测分析模块
 * 基于历史数据，分析影响胜负的关键因素组合，生成预测洞察
 */

// 因素权重配置（基于历史研究的经验值）
const FACTOR_WEIGHTS = {
  terrain: 0.15,
  weather: 0.10,
  pacing: 0.10,
  strategy: 0.20,
  scale: 0.10,
  season: 0.10,
  timeOfDay: 0.08,
  intelligence: 0.12,
  commanders: 0.05,
};

/**
 * 预测结果类型
 */
export type PredictionResult = {
  /** 预测的胜方 */
  predictedWinner: 'attacker' | 'defender' | 'uncertain';
  /** 预测置信度 (0-100) */
  confidence: number;
  /** 关键有利因素 */
  favorableFactors: string[];
  /** 关键不利因素 */
  unfavorableFactors: string[];
  /** 胜负关键因素 */
  keyFactors: string[];
};

/**
 * 因素分析结果
 */
export type FactorAnalysis = {
  factor: string;
  attackerAdvantage: number; // 正值表示对进攻方有利，负值表示对防守方有利
  weight: number;
  description: string;
};

/**
 * 分析地形因素对胜负的影响
 */
function analyzeTerrainFactor(battle: Event): FactorAnalysis | null {
  const terrains = battle.battle?.terrain;
  if (!terrains || terrains.length === 0) return null;

  // 地形优势分析（基于历史经验）
  const terrainAdvantages: Record<string, number> = {
    mountains: -5,     // 山地利于防守
    hills: -3,          // 丘陵利于防守
    plains: 5,          // 平原利于进攻
    water: 0,           // 水域取决于具体情况
    forest: -2,         // 森林利于伏击/防守
    marsh: -4,          // 沼泽利于防守
    desert: 0,
    plateau: -3,
    coastal: 0,
    urban: -2,
    pass: -8,           // 关隘最利于防守
  };

  let totalAdvantage = 0;
  for (const terrain of terrains) {
    totalAdvantage += terrainAdvantages[terrain] || 0;
  }

  const avgAdvantage = totalAdvantage / terrains.length;
  const terrainLabels: Record<string, string> = {
    mountains: '山地',
    hills: '丘陵',
    plains: '平原',
    water: '水域',
    forest: '森林',
    marsh: '沼泽',
    desert: '沙漠',
    plateau: '高原',
    coastal: '沿海',
    urban: '城市',
    pass: '关隘',
  };

  const terrainNames = terrains.map(t => terrainLabels[t] || t).join('、');

  return {
    factor: '地形',
    attackerAdvantage: avgAdvantage,
    weight: FACTOR_WEIGHTS.terrain,
    description: `战场位于${terrainNames}`,
  };
}

/**
 * 分析天气因素对胜负的影响
 */
function analyzeWeatherFactor(battle: Event): FactorAnalysis | null {
  const weather = battle.battle?.weather;
  if (!weather || weather.length === 0) return null;

  // 天气影响分析
  const weatherAdvantages: Record<string, number> = {
    clear: 2,      // 晴天利于进攻
    cloudy: 1,
    rainy: -3,     // 雨天不利于进攻
    snowy: -4,     // 雪天不利于作战
    windy: -1,
    foggy: 0,      // 雾天利于伏击
    stormy: -5,
    hot: -2,
    cold: -3,
  };

  let totalAdvantage = 0;
  for (const w of weather) {
    totalAdvantage += weatherAdvantages[w] || 0;
  }

  const avgAdvantage = totalAdvantage / weather.length;
  const weatherLabels: Record<string, string> = {
    clear: '晴天',
    cloudy: '多云',
    rainy: '雨天',
    snowy: '雪天',
    windy: '大风',
    foggy: '雾天',
    stormy: '暴风雨',
    hot: '炎热',
    cold: '寒冷',
  };

  const weatherNames = weather.map(w => weatherLabels[w] || w).join('、');

  return {
    factor: '天气',
    attackerAdvantage: avgAdvantage,
    weight: FACTOR_WEIGHTS.weather,
    description: `天气条件为${weatherNames}`,
  };
}

/**
 * 分析战役节奏对胜负的影响
 */
function analyzePacingFactor(battle: Event): FactorAnalysis | null {
  const pacing = battle.battle?.pacing;
  if (!pacing) return null;

  // 节奏影响分析
  const pacingAdvantages: Record<string, number> = {
    surprise: 8,    // 突袭战利于进攻方
    rapid: 3,       // 快速决战利于进攻方
    extended: -3,   // 持久战利于防守方（消耗战）
    siege: 0,       // 围城战取决于具体情况
  };

  const advantage = pacingAdvantages[pacing] || 0;
  const pacingLabels: Record<string, string> = {
    surprise: '突袭战',
    rapid: '快速决战',
    extended: '持久战',
    siege: '围城战',
  };

  return {
    factor: '战役节奏',
    attackerAdvantage: advantage,
    weight: FACTOR_WEIGHTS.pacing,
    description: `战役类型为${pacingLabels[pacing] || pacing}`,
  };
}

/**
 * 分析战略战术对胜负的影响
 */
function analyzeStrategyFactor(battle: Event): FactorAnalysis | null {
  const strategies = battle.battle?.strategy;
  if (!strategies || strategies.length === 0) return null;

  // 战术优势分析
  const strategyAdvantages: Record<string, number> = {
    ambush: 6,           // 伏击利于进攻
    fire: 4,             // 火攻效果显著
    water: 3,            // 水攻
    encirclement: 5,     // 包围
    siege: 0,            // 攻城
    pincer: 4,           // 钳形攻势
    'feigned-retreat': 5, // 诱敌深入
    alliance: 2,         // 联盟作战
    defensive: -3,       // 防御作战（防守方）
    offensive: 4,         // 进攻作战
    guerrilla: 3,        // 游击战
  };

  let totalAdvantage = 0;
  for (const strategy of strategies) {
    totalAdvantage += strategyAdvantages[strategy] || 0;
  }

  const avgAdvantage = totalAdvantage / strategies.length;
  const strategyLabels: Record<string, string> = {
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
  };

  const strategyNames = strategies.map(s => strategyLabels[s] || s).join('、');

  return {
    factor: '战术',
    attackerAdvantage: avgAdvantage,
    weight: FACTOR_WEIGHTS.strategy,
    description: `采用战术：${strategyNames}`,
  };
}

/**
 * 分析战役规模对胜负的影响
 */
function analyzeScaleFactor(battle: Event): FactorAnalysis | null {
  const scale = battle.battle?.scale;
  if (!scale) return null;

  // 规模影响分析
  const scaleAdvantages: Record<string, number> = {
    massive: 0,   // 大规模战役取决于其他因素
    large: 0,
    medium: 0,
    small: 2,     // 小规模战役灵活性更高
  };

  const advantage = scaleAdvantages[scale] || 0;
  const scaleLabels: Record<string, string> = {
    massive: '大规模',
    large: '较大规模',
    medium: '中等规模',
    small: '小规模',
  };

  return {
    factor: '规模',
    attackerAdvantage: advantage,
    weight: FACTOR_WEIGHTS.scale,
    description: `战役规模为${scaleLabels[scale] || scale}`,
  };
}

/**
 * 分析季节对胜负的影响
 */
function analyzeSeasonFactor(battle: Event): FactorAnalysis | null {
  const month = battle.month;
  if (!month) return null;

  // 季节影响分析
  let season: string;
  if (month >= 3 && month <= 5) season = 'spring';
  else if (month >= 6 && month <= 8) season = 'summer';
  else if (month >= 9 && month <= 11) season = 'autumn';
  else season = 'winter';

  const seasonAdvantages: Record<string, number> = {
    spring: 1,    // 春暖花开利于作战
    summer: -2,   // 炎热不利于作战
    autumn: 3,    // 秋高气爽最利作战
    winter: -4,   // 寒冷不利于作战
  };

  const advantage = seasonAdvantages[season] || 0;
  const seasonLabels: Record<string, string> = {
    spring: '春季',
    summer: '夏季',
    autumn: '秋季',
    winter: '冬季',
  };

  return {
    factor: '季节',
    attackerAdvantage: advantage,
    weight: FACTOR_WEIGHTS.season,
    description: `作战季节为${seasonLabels[season] || season}`,
  };
}

/**
 * 分析时间段对胜负的影响
 */
function analyzeTimeOfDayFactor(battle: Event): FactorAnalysis | null {
  const timeOfDay = battle.battle?.timeOfDay;
  if (!timeOfDay) return null;

  // 时间段影响分析
  const timeAdvantages: Record<string, number> = {
    dawn: 3,      // 黎明出击
    morning: 2,
    afternoon: 1,
    evening: 0,
    night: 0,     // 夜战取决于训练
  };

  const advantage = timeAdvantages[timeOfDay] || 0;
  const timeLabels: Record<string, string> = {
    dawn: '黎明',
    morning: '上午',
    afternoon: '下午',
    evening: '傍晚',
    night: '夜间',
  };

  return {
    factor: '时间段',
    attackerAdvantage: advantage,
    weight: FACTOR_WEIGHTS.timeOfDay,
    description: `作战时间为${timeLabels[timeOfDay] || timeOfDay}`,
  };
}

/**
 * 分析情报活动对胜负的影响
 */
function analyzeIntelligenceFactor(battle: Event): FactorAnalysis | null {
  const intelligence = battle.battle?.intelligence;
  if (!intelligence || intelligence.length === 0) return null;

  let attackerBenefit = 0;
  let defenderBenefit = 0;

  for (const intel of intelligence) {
    if (intel.result === 'success') {
      if (intel.side === 'attacker' || intel.benefit === 'attacker') {
        attackerBenefit += 3;
      } else if (intel.side === 'defender' || intel.benefit === 'defender') {
        defenderBenefit += 3;
      }
    } else if (intel.result === 'partial') {
      if (intel.side === 'attacker' || intel.benefit === 'attacker') {
        attackerBenefit += 1;
      } else if (intel.side === 'defender' || intel.benefit === 'defender') {
        defenderBenefit += 1;
      }
    }
  }

  const advantage = attackerBenefit - defenderBenefit;
  const intelligenceLabels: Record<string, string> = {
    espionage: '间谍活动',
    infiltration: '渗透',
    deception: '欺诈',
    'counter-intelligence': '反间谍',
    reconnaissance: '侦察',
    propaganda: '宣传',
    defection: '倒戈',
    sabotage: '破坏',
  };

  const intelTypes = intelligence.map(i => intelligenceLabels[i.type] || i.type).join('、');

  return {
    factor: '情报',
    attackerAdvantage: advantage,
    weight: FACTOR_WEIGHTS.intelligence,
    description: `情报活动：${intelTypes}`,
  };
}

/**
 * 分析指挥官对胜负的影响
 */
function analyzeCommanderFactor(battle: Event): FactorAnalysis | null {
  const commanders = battle.battle?.commanders;
  if (!commanders) return null;

  // 这里简化处理，实际应该分析指挥官的历史战绩
  const totalCommanders = 
    (commanders.attacker?.length || 0) + 
    (commanders.defender?.length || 0);

  if (totalCommanders === 0) return null;

  // 简单假设有指挥官数据略微有利于进攻方（因为进攻方通常更有准备）
  const advantage = 1;

  return {
    factor: '指挥官',
    attackerAdvantage: advantage,
    weight: FACTOR_WEIGHTS.commanders,
    description: `双方均有指挥官参与`,
  };
}

/**
 * 预测战役胜负
 */
export function predictBattleOutcome(battle: Event): PredictionResult {
  const factors: FactorAnalysis[] = [];
  
  // 收集所有因素分析
  const factorFunctions = [
    analyzeTerrainFactor,
    analyzeWeatherFactor,
    analyzePacingFactor,
    analyzeStrategyFactor,
    analyzeScaleFactor,
    analyzeSeasonFactor,
    analyzeTimeOfDayFactor,
    analyzeIntelligenceFactor,
    analyzeCommanderFactor,
  ];

  for (const fn of factorFunctions) {
    const result = fn(battle);
    if (result) {
      factors.push(result);
    }
  }

  // 计算加权总分
  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const factor of factors) {
    totalWeightedScore += factor.attackerAdvantage * factor.weight;
    totalWeight += factor.weight;
  }

  // 归一化分数到 -10 到 10 的范围
  const normalizedScore = totalWeight > 0 
    ? (totalWeightedScore / totalWeight) * 10 
    : 0;

  // 确定预测结果
  let predictedWinner: 'attacker' | 'defender' | 'uncertain';
  let confidence: number;

  if (Math.abs(normalizedScore) < 2) {
    predictedWinner = 'uncertain';
    confidence = 30 + Math.abs(normalizedScore) * 10;
  } else if (normalizedScore > 2) {
    predictedWinner = 'attacker';
    confidence = 50 + Math.min(normalizedScore * 5, 40);
  } else {
    predictedWinner = 'defender';
    confidence = 50 + Math.min(Math.abs(normalizedScore) * 5, 40);
  }

  // 收集有利和不利因素
  const favorableFactors: string[] = [];
  const unfavorableFactors: string[] = [];
  const keyFactors: string[] = [];

  for (const factor of factors) {
    if (factor.attackerAdvantage > 2) {
      favorableFactors.push(`${factor.factor}（${factor.description}）`);
    } else if (factor.attackerAdvantage < -2) {
      unfavorableFactors.push(`${factor.factor}（${factor.description}）`);
    }
    
    // 权重高的因素作为关键因素
    if (factor.weight >= 0.15) {
      keyFactors.push(`${factor.factor}（${factor.description}）`);
    }
  }

  return {
    predictedWinner,
    confidence: Math.round(confidence),
    favorableFactors,
    unfavorableFactors,
    keyFactors,
  };
}

/**
 * 获取因素分析详情
 */
export function getFactorAnalysis(battle: Event): FactorAnalysis[] {
  const factors: FactorAnalysis[] = [];
  
  const factorFunctions = [
    analyzeTerrainFactor,
    analyzeWeatherFactor,
    analyzePacingFactor,
    analyzeStrategyFactor,
    analyzeScaleFactor,
    analyzeSeasonFactor,
    analyzeTimeOfDayFactor,
    analyzeIntelligenceFactor,
    analyzeCommanderFactor,
  ];

  for (const fn of factorFunctions) {
    const result = fn(battle);
    if (result) {
      factors.push(result);
    }
  }

  return factors.sort((a, b) => Math.abs(b.attackerAdvantage) - Math.abs(a.attackerAdvantage));
}

/**
 * 胜负预测洞察生成
 */
export function getPredictionInsights(battle: Event): string[] {
  const insights: string[] = [];
  const prediction = predictBattleOutcome(battle);

  // 预测结果描述
  if (prediction.predictedWinner === 'attacker') {
    insights.push(`根据分析，进攻方在此战役中具有优势，预测进攻方获胜（置信度${prediction.confidence}%）`);
  } else if (prediction.predictedWinner === 'defender') {
    insights.push(`根据分析，防守方在此战役中具有优势，预测防守方获胜（置信度${prediction.confidence}%）`);
  } else {
    insights.push(`根据分析，双方势均力敌，胜负难以预测（置信度${prediction.confidence}%）`);
  }

  // 有利因素
  if (prediction.favorableFactors.length > 0) {
    insights.push(`对进攻方有利的因素：${prediction.favorableFactors.join('、')}`);
  }

  // 不利因素
  if (prediction.unfavorableFactors.length > 0) {
    insights.push(`对进攻方不利的因素：${prediction.unfavorableFactors.join('、')}`);
  }

  // 关键因素
  if (prediction.keyFactors.length > 0) {
    insights.push(`关键决定因素：${prediction.keyFactors.join('、')}`);
  }

  // 实际结果对比（如果有）
  if (battle.battle?.result) {
    const resultLabels: Record<string, string> = {
      attacker_win: '进攻方胜利',
      defender_win: '防守方胜利',
      draw: '平局',
      inconclusive: '胜负未明',
    };
    const actualResult = resultLabels[battle.battle.result];
    
    const predicted = prediction.predictedWinner === 'attacker' ? '进攻方胜利' : 
                      prediction.predictedWinner === 'defender' ? '防守方胜利' : '不确定';
    
    if (prediction.predictedWinner === 'uncertain') {
      insights.push(`实际结果：${actualResult}（预测为不确定）`);
    } else {
      const actualWinner = battle.battle.result === 'attacker_win' ? 'attacker' : 
                          battle.battle.result === 'defender_win' ? 'defender' : 'uncertain';
      const correct = actualWinner === prediction.predictedWinner;
      insights.push(`实际结果：${actualResult}，预测${correct ? '正确' : '错误'}`);
    }
  }

  return insights;
}

/**
 * 批量预测多场战役
 */
export function predictMultipleBattles(battles: Event[]): Array<{
  battleId: string;
  battleTitle: string;
  prediction: PredictionResult;
}> {
  return battles.map(battle => ({
    battleId: battle.id,
    battleTitle: battle.titleKey,
    prediction: predictBattleOutcome(battle),
  }));
}

/**
 * 统计预测准确率
 */
export function getPredictionAccuracy(
  battles: Event[]
): {
  total: number;
  correct: number;
  accuracy: number;
  byWinner: {
    attacker: { total: number; correct: number; accuracy: number };
    defender: { total: number; correct: number; accuracy: number };
  };
} {
  let correct = 0;
  let attackerTotal = 0;
  let attackerCorrect = 0;
  let defenderTotal = 0;
  let defenderCorrect = 0;

  for (const battle of battles) {
    if (!battle.battle?.result || battle.battle.result === 'draw' || battle.battle.result === 'inconclusive') {
      continue;
    }

    const prediction = predictBattleOutcome(battle);
    const actualWinner = battle.battle.result === 'attacker_win' ? 'attacker' : 'defender';

    if (prediction.predictedWinner !== 'uncertain') {
      if (prediction.predictedWinner === actualWinner) {
        correct++;
        if (actualWinner === 'attacker') {
          attackerCorrect++;
        } else {
          defenderCorrect++;
        }
      }

      if (actualWinner === 'attacker') {
        attackerTotal++;
      } else {
        defenderTotal++;
      }
    }
  }

  const total = attackerTotal + defenderTotal;

  return {
    total,
    correct,
    accuracy: total > 0 ? (correct / total) * 100 : 0,
    byWinner: {
      attacker: {
        total: attackerTotal,
        correct: attackerCorrect,
        accuracy: attackerTotal > 0 ? (attackerCorrect / attackerTotal) * 100 : 0,
      },
      defender: {
        total: defenderTotal,
        correct: defenderCorrect,
        accuracy: defenderTotal > 0 ? (defenderCorrect / defenderTotal) * 100 : 0,
      },
    },
  };
}

/**
 * 获取完整预测摘要
 */
export type PredictionSummary = {
  hasData: boolean;
  factorAnalysis: FactorAnalysis[];
  prediction: PredictionResult;
  insights: string[];
  accuracyStats?: {
    total: number;
    correct: number;
    accuracy: number;
  };
};

/**
 * 获取战役预测完整摘要
 */
export function getPredictionSummary(battle: Event): PredictionSummary {
  const factorAnalysis = getFactorAnalysis(battle);
  const prediction = predictBattleOutcome(battle);
  const insights = getPredictionInsights(battle);

  return {
    hasData: factorAnalysis.length > 0,
    factorAnalysis,
    prediction,
    insights,
  };
}
