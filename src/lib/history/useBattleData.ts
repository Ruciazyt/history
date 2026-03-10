import { useMemo, useState, useCallback } from 'react';
import type { Era, Event } from './types';
import { getBattles } from './battles';

/**
 * 战役数据 Hook
 */
export function useBattleData({
  events,
  eras,
}: {
  events: Event[];
  eras: Era[];
}) {
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 获取所有战役
  const allBattles = useMemo(() => getBattles(events), [events]);

  // 按朝代分组战役
  const battlesByEra = useMemo(() => {
    const map = new Map<string, Event[]>();
    for (const battle of allBattles) {
      const era = eras.find((e) => e.id === battle.entityId);
      const eraName = era ? era.nameKey : battle.entityId;
      if (!map.has(eraName)) map.set(eraName, []);
      map.get(eraName)!.push(battle);
    }
    // 排序
    for (const [, evts] of map) {
      evts.sort((a, b) => a.year - b.year);
    }
    return map;
  }, [allBattles, eras]);

  // 筛选后的战役
  const filteredBattles = useMemo(() => {
    let result = selectedEra
      ? battlesByEra.get(selectedEra) || []
      : allBattles;

    // 搜索过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((battle) => {
        const title = battle.titleKey.toLowerCase();
        const location = battle.location?.label?.toLowerCase() || '';
        const attacker = battle.battle?.belligerents?.attacker?.toLowerCase() || '';
        const defender = battle.battle?.belligerents?.defender?.toLowerCase() || '';
        return (
          title.includes(query) ||
          location.includes(query) ||
          attacker.includes(query) ||
          defender.includes(query)
        );
      });
    }

    return result;
  }, [allBattles, selectedEra, battlesByEra, searchQuery]);

  // 获取战役统计
  const stats = useMemo(() => {
    const total = allBattles.length;
    const byEra = Object.fromEntries(battlesByEra.entries());
    return { total, byEra };
  }, [allBattles, battlesByEra]);

  // 清除筛选
  const clearFilters = useCallback(() => {
    setSelectedEra(null);
    setSearchQuery('');
  }, []);

  return {
    // 状态
    selectedEra,
    searchQuery,
    allBattles,
    filteredBattles,
    battlesByEra,
    stats,
    // 设置函数
    setSelectedEra,
    setSearchQuery,
    clearFilters,
  };
}
