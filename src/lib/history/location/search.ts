import { CHINA_EVENTS } from '../data/chinaEvents';
import type { Event } from '../types';

/**
 * 地点搜索结果
 */
export interface LocationSearchResult {
  location: string;
  events: {
    event: Event;
    year: number;
  }[];
  firstAppearance: number;
  lastAppearance: number;
}

/**
 * 搜索地点（基于现有事件数据）
 * 返回地点名称及相关的历史事件序列
 */
export function searchLocation(query: string, locale: 'zh' | 'en' | 'ja'): LocationSearchResult[] {
  const lowerQuery = query.toLowerCase();
  
  // 收集所有地点
  const locationMap = new Map<string, LocationSearchResult>();
  
  for (const event of CHINA_EVENTS) {
    const location = event.location;
    if (!location?.label) continue;
    const label = location.label;
    
    // 匹配查询（支持中英文）
    const matchZh = label.toLowerCase().includes(lowerQuery);
    // 英文匹配（简化版，实际可用翻译数据）
    const matchEn = label.toLowerCase() === lowerQuery || 
                   label.toLowerCase().includes(lowerQuery.replace(/[^a-z]/g, ''));
    
    if (matchZh || matchEn || lowerQuery.length >= 2) {
      const key = label.toLowerCase();
      if (!locationMap.has(key)) {
        locationMap.set(key, {
          location: label,
          events: [],
          firstAppearance: event.year,
          lastAppearance: event.year,
        });
      }
      const result = locationMap.get(key)!;
      result.events.push({ event, year: event.year });
      result.firstAppearance = Math.min(result.firstAppearance, event.year);
      result.lastAppearance = Math.max(result.lastAppearance, event.year);
    }
  }
  
  // 过滤并排序
  const results = Array.from(locationMap.values())
    .filter(r => r.location.toLowerCase().includes(lowerQuery) || lowerQuery.length >= 2)
    .sort((a, b) => b.events.length - a.events.length)
    .slice(0, 10);
  
  return results;
}

/**
 * 获取某地点的历史演变
 * 返回按时间排序的事件序列
 */
export function getLocationHistory(locationLabel: string): {
  location: string;
  timeline: Array<{
    year: number;
    event: Event;
  }>;
} {
  const events = CHINA_EVENTS.filter(e => 
    e.location?.label?.toLowerCase() === locationLabel.toLowerCase()
  ).sort((a, b) => a.year - b.year);
  
  return {
    location: locationLabel,
    timeline: events.map(e => ({ year: e.year, event: e })),
  };
}
