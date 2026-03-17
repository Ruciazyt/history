import { Event, BattleWeather } from './types';

/**
 * 获取天气类型的中文标签
 */
export function getWeatherLabel(weather: BattleWeather | undefined): string {
  if (!weather) return '';
  
  const labels: Record<BattleWeather, string> = {
    clear: '晴天',
    rainy: '雨天',
    snowy: '雪天',
    windy: '大风',
    foggy: '雾天',
    stormy: '暴风雨',
    cloudy: '多云',
    hot: '炎热',
    cold: '寒冷',
    unknown: '未知'
  };
  
  return labels[weather] || '';
}

/**
 * 获取战役天气类型统计
 */
export function getWeatherStats(battles: Event[]): Map<BattleWeather, number> {
  const stats = new Map<BattleWeather, number>();
  
  battles.forEach(battle => {
    const weatherConditions = battle.battle?.weather;
    if (weatherConditions && weatherConditions.length > 0) {
      weatherConditions.forEach(weather => {
        const count = stats.get(weather) || 0;
        stats.set(weather, count + 1);
      });
    } else {
      const count = stats.get('unknown') || 0;
      stats.set('unknown', count + 1);
    }
  });
  
  return stats;
}

/**
 * 获取所有天气类型统计（包含0）
 */
export function getAllWeatherStats(battles: Event[]): Record<BattleWeather, number> {
  const weatherTypes: BattleWeather[] = ['clear', 'rainy', 'snowy', 'windy', 'foggy', 'stormy', 'cloudy', 'hot', 'cold', 'unknown'];
  const result = {} as Record<BattleWeather, number>;
  
  weatherTypes.forEach(weather => {
    result[weather] = 0;
  });
  
  battles.forEach(battle => {
    const weatherConditions = battle.battle?.weather;
    if (weatherConditions && weatherConditions.length > 0) {
      weatherConditions.forEach(weather => {
        result[weather]++;
      });
    } else {
      result.unknown++;
    }
  });
  
  return result;
}

/**
 * 获取最常见的天气类型
 */
export function getMostCommonWeather(battles: Event[]): { weather: BattleWeather; count: number } | null {
  const stats = getWeatherStats(battles);
  
  if (stats.size === 0) return null;
  
  let maxWeather: BattleWeather = 'unknown';
  let maxCount = 0;
  
  stats.forEach((count, weather) => {
    if (count > maxCount) {
      maxCount = count;
      maxWeather = weather;
    }
  });
  
  return { weather: maxWeather, count: maxCount };
}

/**
 * 获取已知天气条件的战役数量
 */
export function getKnownWeatherCount(battles: Event[]): number {
  return battles.filter(battle => 
    battle.battle?.weather && 
    battle.battle.weather.length > 0 &&
    !battle.battle.weather.includes('unknown')
  ).length;
}

/**
 * 按天气类型筛选战役
 */
export function getBattlesByWeather(battles: Event[], weather: BattleWeather): Event[] {
  return battles.filter(battle => {
    const weatherConditions = battle.battle?.weather;
    if (!weatherConditions) return weather === 'unknown';
    return weatherConditions.includes(weather);
  });
}

/**
 * 分析天气与战役结果的关系
 */
export function getWeatherOutcomeCorrelation(battles: Event[]): Map<BattleWeather, { attackerWin: number; defenderWin: number; draw: number }> {
  const correlation = new Map<BattleWeather, { attackerWin: number; defenderWin: number; draw: number }>();
  
  const weatherTypes: BattleWeather[] = ['clear', 'rainy', 'snowy', 'windy', 'foggy', 'stormy', 'cloudy', 'hot', 'cold', 'unknown'];
  
  weatherTypes.forEach(weather => {
    correlation.set(weather, { attackerWin: 0, defenderWin: 0, draw: 0 });
  });
  
  battles.forEach(battle => {
    const weatherConditions = battle.battle?.weather;
    const result = battle.battle?.result;
    
    if (!weatherConditions || !result) return;
    
    const outcomeMap = {
      'attacker_win': 'attackerWin',
      'defender_win': 'defenderWin',
      'draw': 'draw',
      'inconclusive': 'draw'
    } as const;
    
    const outcomeKey = outcomeMap[result] || 'draw';
    
    weatherConditions.forEach(weather => {
      const current = correlation.get(weather);
      if (current) {
        current[outcomeKey]++;
      }
    });
  });
  
  return correlation;
}

/**
 * 获取天气条件对进攻方/防守方胜率的影响
 */
export function getWeatherAttackerDefenderAnalysis(battles: Event[]): Record<BattleWeather, { attackerWinRate: number; defenderWinRate: number; total: number }> {
  const correlation = getWeatherOutcomeCorrelation(battles);
  const result = {} as Record<BattleWeather, { attackerWinRate: number; defenderWinRate: number; total: number }>;
  
  correlation.forEach((data, weather) => {
    const total = data.attackerWin + data.defenderWin + data.draw;
    if (total > 0) {
      result[weather] = {
        attackerWinRate: Math.round((data.attackerWin / total) * 100),
        defenderWinRate: Math.round((data.defenderWin / total) * 100),
        total
      };
    } else {
      result[weather] = {
        attackerWinRate: 0,
        defenderWinRate: 0,
        total: 0
      };
    }
  });
  
  return result;
}

/**
 * 生成天气分析洞察
 */
export function getWeatherInsights(battles: Event[]): string[] {
  const insights: string[] = [];
  const stats = getAllWeatherStats(battles);
  const knownCount = getKnownWeatherCount(battles);
  
  if (knownCount === 0) {
    insights.push('目前没有足够的天气数据进行分析');
    return insights;
  }
  
  // 最常见天气
  const mostCommon = getMostCommonWeather(battles);
  if (mostCommon && mostCommon.weather !== 'unknown') {
    const weatherNames: Record<BattleWeather, string> = {
      clear: '晴天',
      rainy: '雨天',
      snowy: '雪天',
      windy: '大风',
      foggy: '雾天',
      stormy: '暴风雨',
      cloudy: '多云',
      hot: '炎热',
      cold: '寒冷',
      unknown: '未知'
    };
    insights.push(`历史上最常见的战役天气是${weatherNames[mostCommon.weather]}，共有${mostCommon.count}场战役`);
  }
  
  // 分析不同天气的胜负概率
  const analysis = getWeatherAttackerDefenderAnalysis(battles);
  
  // 找出进攻方优势天气
  const attackerAdvantage = Object.entries(analysis)
    .filter(([, data]) => data.total >= 2 && data.attackerWinRate > data.defenderWinRate)
    .sort((a, b) => b[1].attackerWinRate - a[1].attackerWinRate);
  
  if (attackerAdvantage.length > 0) {
    const weatherNames: Record<BattleWeather, string> = {
      clear: '晴天', rainy: '雨天', snowy: '雪天', windy: '大风',
      foggy: '雾天', stormy: '暴风雨', cloudy: '多云', hot: '炎热',
      cold: '寒冷', unknown: '未知'
    };
    const best = attackerAdvantage[0];
    insights.push(`在${weatherNames[best[0] as BattleWeather]}条件下，进攻方胜率较高（${best[1].attackerWinRate}%），防守方胜率为${best[1].defenderWinRate}%`);
  }
  
  // 防守方优势天气
  const defenderAdvantage = Object.entries(analysis)
    .filter(([, data]) => data.total >= 2 && data.defenderWinRate > data.attackerWinRate)
    .sort((a, b) => b[1].defenderWinRate - a[1].defenderWinRate);
  
  if (defenderAdvantage.length > 0) {
    const weatherNames: Record<BattleWeather, string> = {
      clear: '晴天', rainy: '雨天', snowy: '雪天', windy: '大风',
      foggy: '雾天', stormy: '暴风雨', cloudy: '多云', hot: '炎热',
      cold: '寒冷', unknown: '未知'
    };
    const best = defenderAdvantage[0];
    insights.push(`在${weatherNames[best[0] as BattleWeather]}条件下，防守方胜率较高（${best[1].defenderWinRate}%），进攻方胜率为${best[1].attackerWinRate}%`);
  }
  
  // 极端天气分析
  const extremeWeather: BattleWeather[] = ['rainy', 'snowy', 'stormy', 'hot', 'cold'];
  const extremeBattles = extremeWeather.reduce((sum, w) => sum + stats[w], 0);
  
  if (extremeBattles > 0) {
    insights.push(`有${extremeBattles}场战役发生在极端天气条件下（雨、雪、暴风雨、炎热或寒冷）`);
  }
  
  return insights;
}

/**
 * 获取完整天气分析摘要
 */
export function getWeatherSummary(battles: Event[]) {
  const stats = getAllWeatherStats(battles);
  const knownCount = getKnownWeatherCount(battles);
  const analysis = getWeatherAttackerDefenderAnalysis(battles);
  const insights = getWeatherInsights(battles);
  
  return {
    stats,
    knownWeatherCount: knownCount,
    totalBattles: battles.length,
    coverage: knownCount > 0 ? Math.round((knownCount / battles.length) * 100) : 0,
    analysis,
    insights
  };
}

/**
 * 检查是否有天气数据
 */
export function hasWeatherData(battles: Event[]): boolean {
  return battles.some(battle => 
    battle.battle?.weather && 
    battle.battle.weather.length > 0 &&
    !battle.battle.weather.includes('unknown')
  );
}
