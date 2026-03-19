import type { Ruler, Era, Event } from './types';
import { formatYear } from './utils';

export type { Ruler, Era, Event };

/**
 * 获取帝王显示名称（谥号+名字）
 */
export function getRulerDisplayName(ruler: Ruler, t: (key: string) => string): string {
  return t(ruler.nameKey);
}

/**
 * 获取帝王完整显示名称（包含年号）
 */
export function getRulerFullDisplay(ruler: Ruler, t: (key: string) => string): string {
  const name = getRulerDisplayName(ruler, t);
  
  if (ruler.eraNameKey) {
    const eraName = t(ruler.eraNameKey);
    return `${name}（${eraName}）`;
  }
  
  return name;
}

/**
 * 判断是否有年号
 */
export function hasEraName(ruler: Ruler): boolean {
  return !!ruler.eraNameKey;
}

/**
 * 判断是否是王朝块（用于长时间统治）
 */
export function isDynastyBlock(ruler: Ruler): boolean {
  return ruler.isDynastyBlock === true;
}

/**
 * 获取帝王统治年份范围
 */
export function getRulerYearRange(ruler: Ruler): {
  start: number;
  end: number;
  duration: number;
} {
  return {
    start: ruler.startYear,
    end: ruler.endYear,
    duration: ruler.endYear - ruler.startYear,
  };
}

/**
 * 格式化帝王统治年份显示
 */
export function formatRulerYears(ruler: Ruler): string {
  const { start, end } = getRulerYearRange(ruler);
  
  if (start === end) {
    return formatYear(start);
  }
  
  return `${formatYear(start)} – ${formatYear(end)}`;
}

/**
 * 判断是否是平行政权时代（多国并立）
 */
export function isParallelPolitiesEra(era: Era): boolean {
  return era.isParallelPolities === true;
}

/**
 * 获取时代的政权列表
 */
export function getEraPolities(era: Era): { id: string; nameKey: string }[] {
  return era.polities || [];
}

/**
 * 获取帝王所属政权ID
 */
export function getRulerPolityId(ruler: Ruler): string | undefined {
  return ruler.polityId;
}

/**
 * 判断帝王是否有政权信息
 */
export function hasRulerPolity(ruler: Ruler): boolean {
  return !!ruler.polityId;
}
