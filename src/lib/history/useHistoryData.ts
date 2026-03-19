import { useMemo, useState, useCallback } from 'react';
import type { Era, Event, Ruler } from './types';

/**
 * 历史数据筛选 Hook
 */
export function useHistoryData({
  eras,
  rulers,
}: {
  eras: Era[];
  events?: Event[];
  rulers: Ruler[];
}) {
  const [openEraIds, setOpenEraIds] = useState<Set<string>>(new Set());
  const [selectedRulerId, setSelectedRulerId] = useState<string | null>(null);
  const [windowYears, setWindowYears] = useState<number>(50);
  const [year, setYear] = useState<number>(-350);

  // 获取当前选中的帝王
  const selectedRuler = useMemo(
    () => (selectedRulerId ? rulers.find((r) => r.id === selectedRulerId) ?? null : null),
    [rulers, selectedRulerId]
  );

  // 切换朝代展开状态
  const toggleEra = useCallback((id: string) => {
    setOpenEraIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // 计算年代范围
  const yearBounds = useMemo(() => {
    const min = Math.min(...eras.map((e) => e.startYear));
    const max = Math.max(...eras.map((e) => e.endYear));
    return { min, max };
  }, [eras]);

  // 初始化年份
  const initYear = useMemo(() => {
    return yearBounds.min <= year && year <= yearBounds.max ? year : yearBounds.min;
  }, [yearBounds, year]);

  // 当前选中帝王的统治年份范围
  const timelineRange = useMemo(() => {
    const min = selectedRuler?.startYear ?? eras[0]?.startYear ?? -1000;
    const max = selectedRuler?.endYear ?? eras[0]?.endYear ?? 0;
    return { min, max };
  }, [selectedRuler, eras]);

  // 筛选时间窗口内的事件
  const getEventsInWindow = useCallback(
    (allEvents: Event[], currentYear: number) => {
      const half = Math.floor(windowYears / 2);
      const from = currentYear - half;
      const to = currentYear + half;
      return allEvents.filter((e) => e.year >= from && e.year <= to);
    },
    [windowYears]
  );

  // 按朝代分组事件
  const groupEventsByEra = useCallback(
    (allEvents: Event[]) => {
      const currentEvents: Event[] = [];
      const otherEvents: Event[] = [];

      const filtered = getEventsInWindow(allEvents, initYear);

      for (const e of filtered) {
        if (openEraIds.has(e.entityId)) {
          currentEvents.push(e);
        } else {
          otherEvents.push(e);
        }
      }

      return {
        current: currentEvents.sort((a, b) => a.year - b.year),
        other: otherEvents.sort((a, b) => a.year - b.year),
      };
    },
    [openEraIds, getEventsInWindow, initYear]
  );

  return {
    // 状态
    openEraIds,
    selectedRulerId,
    selectedRuler,
    windowYears,
    year: initYear,
    yearBounds,
    timelineRange,
    // 设置函数
    setOpenEraIds,
    setSelectedRulerId,
    setWindowYears,
    setYear,
    toggleEra,
    // 工具函数
    getEventsInWindow,
    groupEventsByEra,
  };
}
