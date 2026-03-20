'use client';

import * as React from 'react';
import Link from 'next/link';

import type { Era, Event, Ruler } from '@/lib/history/types';
import { clamp, formatYear } from '@/lib/history/utils';
import { HistoryMap } from '@/components/HistoryMap';
import { WorldEmpireMap } from '@/components/world/WorldEmpireMap';
import { TimelineSlider } from '@/components/world/TimelineSlider';
import { LocaleSwitcher } from '@/components/common/LocaleSwitcher';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { RulerRelations } from '@/components/common/RulerRelations';
import { SearchBox } from '@/components/common/SearchBox';
import { BottomNav } from '@/components/common/BottomNav';
import { EraDrawer } from '@/components/common/EraDrawer';
import { EventsDrawer } from '@/components/common/EventsDrawer';
import { useTranslations } from 'next-intl';
import { ERA_COLORS, ERA_ITEM_COLORS } from '@/lib/history/constants';
import { BattleOfTheDayCard } from '@/components/battles/BattleOfTheDayCard';
import { useHistoryAppColors } from '@/lib/history/useHistoryAppColors';

import { worldComparisonEra, eastAsiaComparisonEra } from '@/lib/history/data/worldEras';
import { worldComparisonRulers, eastAsiaRulers } from '@/lib/history/data/worldRulers';
import { getWorldEraBounds, getActiveBoundaries } from '@/lib/history/data/worldBoundaries';

function rangeLabel(centerYear: number, windowYears: number) {
  const half = Math.floor(windowYears / 2);
  const from = centerYear - half;
  const to = centerYear + half;
  return `${formatYear(from)} → ${formatYear(to)}`;
}

function yearBounds(eras: Era[]) {
  const min = Math.min(...eras.map((e) => e.startYear));
  const max = Math.max(...eras.map((e) => e.endYear));
  return { min, max };
}

export function HistoryApp({
  eras,
  events,
  rulers,
  locale,
}: {
  eras: Era[];
  events: Event[];
  rulers: Ruler[];
  locale?: string;
}) {
  const t = useTranslations();
  const tEra = useTranslations('rulerEraName');
  const currentLocale = locale || 'zh';
  const { C, EXTRA } = useHistoryAppColors();

  const [civMode, setCivMode] = React.useState<'china' | 'eurasian' | 'east-asia'>('china');
  
  // 世界帝国地图的当前年份
  const [worldYear, setWorldYear] = React.useState<number>(1);
  const worldEraBounds = React.useMemo(() => getWorldEraBounds(civMode === 'eurasian' ? 'eurasian' : 'east-asia'), [civMode]);
  const activeWorldBoundaries = React.useMemo(() => 
    getActiveBoundaries(worldYear, civMode === 'eurasian' ? 'eurasian' : 'east-asia'),
    [worldYear, civMode]
  );
  
  const activeEras = React.useMemo(() => 
    civMode === 'china' ? eras : civMode === 'eurasian' ? [worldComparisonEra] : [eastAsiaComparisonEra],
    [civMode, eras]
  );
  const activeRulers = React.useMemo(() => 
    civMode === 'china' ? rulers : civMode === 'eurasian' ? worldComparisonRulers : eastAsiaRulers,
    [civMode, rulers]
  );

  const { min, max } = React.useMemo(() => yearBounds(activeEras), [activeEras]);

  const [openEraIds, setOpenEraIds] = React.useState<Set<string>>(new Set(['world-comparison', 'east-asia-comparison']));
  const toggleEra = React.useCallback((id: string) => {
    setOpenEraIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const [selectedRulerId, setSelectedRulerId] = React.useState<string | null>(null);

  // Mobile drawer states
  const [eraDrawerOpen, setEraDrawerOpen] = React.useState(false);
  const [eventsDrawerOpen, setEventsDrawerOpen] = React.useState(false);

  const switchCiv = React.useCallback((mode: 'china' | 'eurasian' | 'east-asia') => {
    setCivMode(mode);
    // 默认展开：欧亚对比/东亚对比
    if (mode === 'eurasian') setOpenEraIds(new Set(['world-comparison']));
    else if (mode === 'east-asia') setOpenEraIds(new Set(['east-asia-comparison']));
    else setOpenEraIds(new Set());
    setSelectedRulerId(null);
  }, []);

  const selectedRuler = React.useMemo(
    () => (selectedRulerId ? activeRulers.find((r) => r.id === selectedRulerId) ?? null : null),
    [activeRulers, selectedRulerId]
  );

  const selectedEra = React.useMemo(() => {
    if (selectedRulerId) {
      const r = activeRulers.find((r) => r.id === selectedRulerId);
      if (r) return activeEras.find((e) => e.id === r.eraId) ?? activeEras[0];
    }
    const firstOpen = activeEras.find((e) => openEraIds.has(e.id));
    return firstOpen ?? activeEras[0];

  }, [activeEras, activeRulers, selectedRulerId, openEraIds]);

  const [battleOfDayCollapsed, setBattleOfDayCollapsed] = React.useState(false);
  const [windowYears, setWindowYears] = React.useState<number>(50);
  const [year, setYear] = React.useState<number>(clamp(-350, min, max));

  const timelineMin = selectedRuler?.startYear ?? selectedEra?.startYear ?? min;
  const timelineMax = selectedRuler?.endYear ?? selectedEra?.endYear ?? max;

  // Keep year within selection (ruler reign if selected; otherwise era).
  React.useEffect(() => {
    setYear((y) => clamp(y, timelineMin, timelineMax));
  }, [timelineMin, timelineMax]);

  const half = Math.floor(windowYears / 2);
  const rawFrom = year - half;
  const rawTo = year + half;

  const from = clamp(rawFrom, timelineMin, timelineMax);
  const to = clamp(rawTo, timelineMin, timelineMax);

  const inWindow = React.useMemo(
    () => (e: Event) => e.year >= from && e.year <= to,
    [from, to]
  );

  const currentEraEvents = React.useMemo(() => {
    return events
      .filter((e) => openEraIds.has(e.entityId))
      .filter(inWindow)
      .sort((a, b) => a.year - b.year);
  }, [events, inWindow, openEraIds]);

  const otherEraEvents = React.useMemo(() => {
    return events
      .filter((e) => !openEraIds.has(e.entityId))
      .filter(inWindow)
      .sort((a, b) => a.year - b.year);
  }, [events, inWindow, openEraIds]);

  const mapEvents = React.useMemo(() => {
    // Prefer showing selected era events, but include others to support comparison.
    const merged = [...currentEraEvents, ...otherEraEvents];
    // dedupe by id
    const byId = new Map<string, Event>();
    for (const e of merged) byId.set(e.id, e);
    return [...byId.values()];
  }, [currentEraEvents, otherEraEvents]);

  return (
    <div className={`flex h-screen flex-col ${C.container.bg} ${C.container.text}`}>
      {/* Header */}
      <header className={`shrink-0 border-b ${C.header.border} ${C.header.bg}`}>
        <div className="flex w-full flex-col gap-2 px-3 py-3 sm:px-4 sm:py-4">
          {/* Top row: title + locale - mobile: hamburger + title + events icon */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* Mobile: hamburger menu button */}
              <button
                type="button"
                onClick={() => setEraDrawerOpen(true)}
                className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors lg:hidden"
                style={{ minWidth: '44px', minHeight: '44px' }}
                aria-label="打开朝代菜单"
              >
                <span className="text-lg">☰</span>
              </button>
              <div className="flex-1 min-w-0">
                <div className={`text-xs sm:text-sm ${C.header.title.small} truncate`}>{t('app.title')}</div>
                <h1 className={`text-base sm:text-lg font-semibold truncate`}>{t('app.subtitle')}</h1>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Mobile: events button */}
              <button
                type="button"
                onClick={() => setEventsDrawerOpen(true)}
                className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors lg:hidden"
                style={{ minWidth: '44px', minHeight: '44px' }}
                aria-label="打开事件列表"
              >
                <span className="text-lg">📋</span>
              </button>
              {/* Desktop only controls */}
              <div className="hidden lg:flex items-center gap-2 shrink-0">
                <ThemeToggle />
                <SearchBox events={events} rulers={rulers} locale={currentLocale} />
                <LocaleSwitcher />
              </div>
              {/* Mobile: theme + locale icons */}
              <div className="flex lg:hidden items-center gap-1">
                <ThemeToggle />
                <LocaleSwitcher />
              </div>
            </div>
          </div>
          
          {/* Second row: civ switcher - scrollable on mobile */}
          <div className="overflow-x-auto scrollbar-hide py-1 -mx-1 px-1">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Civilization switcher */}
              <div className={`flex rounded-lg ${C.civSwitcher.container} p-0.5 text-xs sm:text-sm shrink-0`}>
                <button
                  type="button"
                  onClick={() => switchCiv('china')}
                  className={`rounded-md px-2 sm:px-3 py-1 transition-colors whitespace-nowrap ${civMode === 'china' ? `${C.civSwitcher.active.bg} ${C.civSwitcher.active.text} ${C.civSwitcher.active.shadow} ${C.civSwitcher.active.font}` : C.civSwitcher.inactive}`}
                >
                  🏯 中国史
                </button>
              </div>
              
              {/* Era info */}
              <div className={`text-xs sm:text-sm ${C.eraInfo.text} hidden sm:block`}>
                <span className={C.eraInfo.font}>{selectedEra ? t(selectedEra.nameKey) : ''}</span>
                <span className={`mx-2 ${EXTRA.divider.default}`}>|</span>
                <span>
                  {selectedEra ? `${formatYear(selectedEra.startYear)}–${formatYear(selectedEra.endYear)}` : ''}
                </span>
              </div>
              
              {/* Quick links - desktop only */}
              <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 shrink-0">
                <Link
                  href={`/${currentLocale}/timeline`}
                  className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors whitespace-nowrap ${C.quickLink.timeline.bg} ${C.quickLink.timeline.text} ${C.quickLink.timeline.border}`}
                >
                  📜 <span className="hidden sm:inline">{t('event.viewTimeline')}</span>
                </Link>
                <Link
                  href={`/${currentLocale}/matrix`}
                  className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors whitespace-nowrap ${C.quickLink.matrix.bg} ${C.quickLink.matrix.text} ${C.quickLink.matrix.border}`}
                >
                  ⊞ <span className="hidden sm:inline">{t('matrix.title')}</span>
                </Link>
                <Link
                  href={`/${currentLocale}/battles`}
                  className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors whitespace-nowrap ${C.quickLink.battles.bg} ${C.quickLink.battles.text} ${C.quickLink.battles.border}`}
                >
                  ⚔️ <span className="hidden sm:inline">{t('nav.battles')}</span>
                </Link>
                <Link
                  href={`/${currentLocale}/commanders`}
                  className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors whitespace-nowrap ${C.quickLink.battles.bg} ${C.quickLink.battles.text} ${C.quickLink.battles.border}`}
                >
                  👑 <span className="hidden sm:inline">{t('nav.commanders')}</span>
                </Link>
                <Link
                  href={`/${currentLocale}/world`}
                  className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors whitespace-nowrap ${C.quickLink.eurasian.bg} ${C.quickLink.eurasian.text} ${C.quickLink.eurasian.border} hover:opacity-90`}
                >
                  🌍 <span className="hidden sm:inline">{t('world.title')}</span>
                </Link>
                <Link
                  href={`/${currentLocale}/place-names`}
                  className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors whitespace-nowrap ${C.quickLink.placeNames.bg} ${C.quickLink.placeNames.text} ${C.quickLink.placeNames.border} hover:opacity-90`}
                >
                  🏛️ <span className="hidden sm:inline">{t('placeNames.title') || '地名演化'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex w-full flex-1 flex-col overflow-hidden px-2 sm:px-4 py-2 sm:py-4 pb-[72px] lg:pb-4">
        <div className="grid h-full grid-cols-1 gap-2 sm:gap-4 overflow-hidden lg:grid-cols-[280px_minmax(0,1fr)_180px] xl:grid-cols-[280px_minmax(0,1fr)_200px]">
          {/* Left: global vertical timeline - desktop only */}
          <aside className={`hidden lg:flex max-h-full flex-col overflow-hidden rounded-xl border ${C.sidebar.container.border} ${C.sidebar.container.bg}`}>
            <div className={`shrink-0 border-b ${C.sidebar.header.border} ${C.sidebar.header.bg} p-2 sm:p-3`}>
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <div className={`text-xs font-semibold uppercase tracking-wide ${C.sidebar.header.text}`}>{t('ui.eras')}</div>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {activeEras.map((era) => {
                const isOpen = openEraIds.has(era.id);
                const eraRulers = activeRulers.filter((r) => r.eraId === era.id);
                const eraColor = ERA_COLORS[era.id] || ERA_ITEM_COLORS.default;
                const isMultiPolity = era.isParallelPolities && era.polities;
                
                // 多国并立时期：按polity分组
                const rulersByPolity = isMultiPolity 
                  ? eraRulers.reduce((acc, r) => {
                      const polityId = r.polityId || 'other';
                      if (!acc[polityId]) acc[polityId] = [];
                      acc[polityId].push(r);
                      return acc;
                    }, {} as Record<string, typeof eraRulers>)
                  : null;
                
                return (
                  <div key={era.id} className={`border-b ${C.sidebar.eraItem.border} last:border-0 ${isOpen ? eraColor.bg : ''}`}>
                    <button
                      type="button"
                      onClick={() => toggleEra(era.id)}
                      className={`flex w-full items-center gap-2 px-2 py-2.5 text-left ${C.sidebar.eraItem.hover} sm:px-3 transition-colors`}
                    >
                      <span className={`w-2 h-2 rounded-full shrink-0 ${eraColor.dot}`}></span>
                      <span className={`flex-1 font-semibold ${eraColor.text} text-sm sm:text-base`}>
                        {t(era.nameKey)}
                        {isMultiPolity && <span className={`text-xs ml-1 ${EXTRA.multiPolity.text}`}>（多国并立）</span>}
                      </span>
                      <span className={`text-xs ${C.sidebar.eraItem.year} hidden sm:inline`}>
                        {formatYear(era.startYear)}–{formatYear(era.endYear)}
                      </span>
                      <span className={`text-xs ${EXTRA.arrow.text}`}>{isOpen ? '▼' : '▶'}</span>
                    </button>
                    {isOpen && (
                      <div className={`${eraColor.bg} px-2 py-1 sm:px-3 sm:py-2`}>
                        {isMultiPolity && rulersByPolity ? (
                          // 多国并立时期：表格形式（纵轴为时间）
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs sm:text-sm border-collapse">
                              <thead>
                                <tr className={`text-left ${C.sidebar.table.header.text} border-b ${C.sidebar.table.header.border}`}>
                                  <th className="px-2 py-2 font-medium w-16 shrink-0">年份</th>
                                  {era.polities?.map(p => (
                                    <th key={p.id} className="px-2 py-2 font-medium min-w-[100px]">{t(p.nameKey)}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {(() => {
                                  // 按年份排序所有统治者
                                  const allRulers = eraRulers.sort((a, b) => a.startYear - b.startYear);
                                  // 按起始年份分组
                                  const rulersByYear = allRulers.reduce((acc, r) => {
                                    const year = r.startYear;
                                    if (!acc[year]) acc[year] = [];
                                    acc[year].push(r);
                                    return acc;
                                  }, {} as Record<number, typeof eraRulers>);
                                  const years = Object.keys(rulersByYear).map(Number).sort((a, b) => a - b);
                                  return years.map(year => {
                                    const rulers = rulersByYear[year] || [];
                                    return (
                                      <tr key={year} className={`border-b ${C.sidebar.table.row.border} last:border-0 ${C.sidebar.table.row.hover}`}>
                                        <td className={`px-2 py-2 ${C.sidebar.table.row.year} shrink-0 w-16`}>
                                          {formatYear(year)}
                                        </td>
                                        {era.polities?.map(p => {
                                          const r = rulers.find(r => r.polityId === p.id);
                                          if (!r) return <td key={p.id} className="px-2 py-2"></td>;
                                          const isActive = selectedRulerId === r.id;
                                          return (
                                            <td key={p.id} className="px-2 py-1">
                                              <button
                                                type="button"
                                                onClick={() => setSelectedRulerId(r.id)}
                                                className={`w-full text-left rounded px-2 py-1.5 truncate ${
                                                  isActive ? C.sidebar.table.rulerButton.active : C.sidebar.table.rulerButton.inactive
                                                }`}
                                              >
                                                <div>{t(r.nameKey)}</div>
                                                {r.eraNameKey && (
                                                  <div className={`${C.rulerDetail.header.eraBadge.text} text-xs`}>{tEra(r.eraNameKey)}</div>
                                                )}
                                              </button>
                                            </td>
                                          );
                                        })}
                                      </tr>
                                    );
                                  });
                                })()}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          // 普通时期：列表形式
                          eraRulers.map((r) => {
                            const isActive = selectedRulerId === r.id;
                            return (
                              <button
                                key={r.id}
                                type="button"
                                onClick={() => setSelectedRulerId(r.id)}
                                className={`flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-xs sm:text-sm ${
                                  isActive ? C.sidebar.rulerList.active : C.sidebar.rulerList.inactive
                                }`}
                              >
                                <span className="truncate flex items-center gap-1">
                                  {r.isDynastyBlock ? (
                                    <span className="font-semibold">{t(r.nameKey)}</span>
                                  ) : (
                                    <>
                                      <span>{t(r.nameKey)}</span>
                                      {r.eraNameKey && (
                                        <span className={`${C.rulerDetail.header.eraBadge.text} text-xs`}>{tEra(r.eraNameKey)}</span>
                                      )}
                                    </>
                                  )}
                                </span>
                                <span className={`shrink-0 ${C.sidebar.eraItem.year}`}>
                                  {formatYear(r.startYear)}–{formatYear(r.endYear)}
                                </span>
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Center: map + time controls */}
          <section className="flex min-h-0 flex-col gap-2 sm:gap-3 overflow-hidden">
            <div className={`rounded-xl border ${C.timeline.container.border} ${C.timeline.container.bg} p-2 sm:p-3`}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className={`text-xs font-semibold uppercase tracking-wide ${C.timeline.header.text}`}>{t('ui.timeline')}</div>
                  <div className={`text-xs sm:text-sm ${EXTRA.eventTitle.default}`}>
                    <span className={C.timeline.header.year}>{formatYear(year)}</span>
                    <span className={`mx-1.5 sm:mx-2 ${EXTRA.divider.default}`}>|</span>
                    <span className="hidden sm:inline">{t('ui.window.label')}: </span>
                    <span className={C.timeline.header.window}>{t('ui.window.years', { count: windowYears })}</span>
                    <span className={`mx-1.5 sm:mx-2 ${EXTRA.divider.default} hidden sm:inline`}>|</span>
                    <span className={`${EXTRA.rangeLabel.text} hidden sm:inline`}>{rangeLabel(year, windowYears)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  {[10, 50, 100].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setWindowYears(w)}
                      className={`shrink-0 rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium transition-colors ${
                        windowYears === w
                          ? C.timeline.windowButton.active.bg + ' ' + C.timeline.windowButton.active.text
                          : C.timeline.windowButton.inactive.bg + ' ' + C.timeline.windowButton.inactive.text + ' ' + C.timeline.windowButton.inactive.hover
                      }`}
                    >
                      {w}年
                    </button>
                  ))}
                  <div className={`flex items-center gap-1 border-l ${EXTRA.sidebar.nav.border} ${EXTRA.sidebar.nav.padding}`}>
                    <button
                      type="button"
                      onClick={() => setYear((y) => y - windowYears)}
                      disabled={year - windowYears < timelineMin}
                      className={`rounded-lg p-1.5 ${C.timeline.navButton.bg} ${C.timeline.navButton.text} ${C.timeline.navButton.hover} ${C.timeline.navButton.disabled}`}
                    >
                      ◀
                    </button>
                    <button
                      type="button"
                      onClick={() => setYear((y) => y + windowYears)}
                      disabled={year + windowYears > timelineMax}
                      className={`rounded-lg p-1.5 ${C.timeline.navButton.bg} ${C.timeline.navButton.text} ${C.timeline.navButton.hover} ${C.timeline.navButton.disabled}`}
                    >
                      ▶
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Battle of the Day banner */}
            {!battleOfDayCollapsed && (
              <div className="shrink-0">
                <BattleOfTheDayCard events={events} />
              </div>
            )}
            <button
              type="button"
              onClick={() => setBattleOfDayCollapsed((v) => !v)}
              className={`w-full flex items-center justify-center gap-1.5 py-1.5 text-xs rounded-lg border transition-colors ${C.sidebar.eraItem.hover} border-transparent hover:border ${C.sidebar.eraItem.border}`}
            >
              <span className="opacity-60">{battleOfDayCollapsed ? '📅' : '▲'}</span>
              <span className={C.sidebar.eraItem.year}>{battleOfDayCollapsed ? t('battleOfTheDay.expand') : t('battleOfTheDay.collapse')}</span>
            </button>

            <div className={`flex-1 min-h-0 rounded-xl border ${C.mapContainer.border} ${C.mapContainer.bg} overflow-hidden`}>
              {civMode === 'china' ? (
                <HistoryMap events={mapEvents} openEraIds={openEraIds} />
              ) : (
                <>
                  <div className="flex-1 min-h-0">
                    <WorldEmpireMap 
                      year={worldYear} 
                      mode={civMode === 'eurasian' ? 'eurasian' : 'east-asia'}
                    />
                  </div>
                  <TimelineSlider
                    year={worldYear}
                    minYear={worldEraBounds.min}
                    maxYear={worldEraBounds.max}
                    onYearChange={setWorldYear}
                    activeEmpires={activeWorldBoundaries.map(b => b.properties.nameKey)}
                    t={(key: string) => t(key)}
                  />
                </>
              )}
            </div>
          </section>

          {/* Right: events - desktop only */}
          <aside className={`hidden lg:flex max-h-full flex-col overflow-hidden rounded-xl border ${C.eventsSidebar.container.border} ${C.eventsSidebar.container.bg}`}>
            <div className={`shrink-0 border-b ${C.eventsSidebar.header.border} ${C.eventsSidebar.header.bg} p-2 sm:p-3`}>
              <div className={`text-xs font-semibold uppercase tracking-wide ${C.eventsSidebar.header.text}`}>
                {t('ui.events')} ({currentEraEvents.length})
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {currentEraEvents.length > 0 ? (
                currentEraEvents.map((e) => {
                  const era = activeEras.find((era) => era.id === e.entityId);
                  const eraName = era ? t(era.nameKey) : '';
                  return (
                    <div
                      key={e.id}
                      className={`border-b ${C.eventsSidebar.eventItem.border} px-2 py-2 last:border-0 sm:px-3`}
                    >
                      <div className={`text-xs ${C.eventsSidebar.eventItem.year}`}>
                        {formatYear(e.year)} {eraName ? `· ${eraName}` : ''}
                      </div>
                      <div className={`mt-0.5 text-sm font-medium ${EXTRA.eventTitle.default}`}>
                        {t(e.titleKey)}
                      </div>
                      {e.tags && e.tags.includes('war') && (
                        <div className={`mt-1 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs ${C.eventsSidebar.eventItem.warBadge.bg} ${C.eventsSidebar.eventItem.warBadge.text}`}>
                          ⚔️ 战役
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className={`p-4 text-center text-sm ${C.eventsSidebar.empty}`}>{t('ui.noEvents')}</div>
              )}
              {otherEraEvents.length > 0 && (
                <>
                  <div className={`border-t ${C.eventsSidebar.compare.header.border} ${C.eventsSidebar.compare.header.bg} px-2 py-2 sm:px-3`}>
                    <div className={`text-xs font-semibold uppercase tracking-wide ${C.eventsSidebar.compare.header.text}`}>
                      {t('ui.compare')} ({otherEraEvents.length})
                    </div>
                  </div>
                  {otherEraEvents.slice(0, 20).map((e) => {
                    const era = activeEras.find((era) => era.id === e.entityId);
                    const eraName = era ? t(era.nameKey) : '';
                    return (
                      <div
                        key={e.id}
                        className={`border-b ${C.eventsSidebar.eventItem.border} px-2 py-2 last:border-0 sm:px-3`}
                      >
                        <div className={`text-xs ${C.eventsSidebar.eventItem.year}`}>
                          {formatYear(e.year)} {eraName ? `· ${eraName}` : ''}
                        </div>
                        <div className={`mt-0.5 text-sm ${EXTRA.eventTitle.light}`}>{t(e.titleKey)}</div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Ruler detail inline */}
            {selectedRuler ? (
              <div className={`shrink-0 border-t ${C.rulerDetail.container.border} ${C.rulerDetail.container.bg} p-2 sm:p-3`}>
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div className="min-w-0">
                    <div className={`text-xs font-semibold uppercase tracking-wide ${C.rulerDetail.header.text}`}>{t('ui.rulerDetail')}</div>
                    <div className="mt-1 flex items-center gap-2 flex-wrap">
                      <span className={`truncate text-sm sm:text-base font-semibold ${C.rulerDetail.header.name}`}>{t(selectedRuler.nameKey)}</span>
                      {selectedRuler.eraNameKey && (
                        <span className={`text-xs px-1.5 py-0.5 rounded ${C.rulerDetail.header.eraBadge.bg} ${C.rulerDetail.header.eraBadge.text}`}>
                          {tEra(selectedRuler.eraNameKey)}
                        </span>
                      )}
                    </div>
                    <div className={`mt-0.5 text-xs ${C.rulerDetail.header.year}`}>
                      {formatYear(selectedRuler.startYear)}–{formatYear(selectedRuler.endYear)}
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`shrink-0 rounded-lg border ${C.rulerDetail.closeButton.border} ${C.rulerDetail.closeButton.bg} px-2 py-1 text-xs ${C.rulerDetail.closeButton.text} ${C.rulerDetail.closeButton.hover}`}
                    onClick={() => setSelectedRulerId(null)}
                  >
                    {t('ui.clearRuler')}
                  </button>
                </div>
                {selectedRuler.highlightKey ? (
                  <div className={`mt-2 text-xs sm:text-sm ${C.rulerDetail.highlight}`}>{t(selectedRuler.highlightKey)}</div>
                ) : null}
                {selectedRuler.bioKey ? (
                  <div className={`mt-2 text-xs sm:text-sm ${C.rulerDetail.bio}`}>{t(selectedRuler.bioKey)}</div>
                ) : null}
                <RulerRelations
                  ruler={selectedRuler}
                  allRulers={activeRulers}
                  onRulerClick={(id) => setSelectedRulerId(id)}
                />
              </div>
            ) : (
              <div className={`shrink-0 border-t ${C.rulerDetail.container.border} ${C.rulerDetail.container.bg} p-2 sm:p-3 text-xs ${C.rulerDetail.seedNote}`}>{t('ui.seedNote')}</div>
            )}
          </aside>
        </div>
      </div>

      {/* Mobile: Bottom Navigation */}
      <BottomNav locale={currentLocale} />

      {/* Mobile: Era Drawer (left side) */}
      <EraDrawer
        isOpen={eraDrawerOpen}
        onClose={() => setEraDrawerOpen(false)}
        activeEras={activeEras}
        activeRulers={activeRulers}
        openEraIds={openEraIds}
        selectedRulerId={selectedRulerId}
        onToggleEra={toggleEra}
        onSelectRuler={setSelectedRulerId}
      />

      {/* Mobile: Events Drawer (right side) */}
      <EventsDrawer
        isOpen={eventsDrawerOpen}
        onClose={() => setEventsDrawerOpen(false)}
        currentEraEvents={currentEraEvents}
        otherEraEvents={otherEraEvents}
        activeEras={activeEras}
      />
    </div>
  );
}
