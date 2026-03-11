'use client';

import * as React from 'react';
import Link from 'next/link';

import type { Era, Event, Ruler } from '@/lib/history/types';
import { clamp, formatYear } from '@/lib/history/utils';
import { HistoryMap } from '@/components/HistoryMap';
import { WorldEmpireMap } from '@/components/world/WorldEmpireMap';
import { TimelineSlider } from '@/components/world/TimelineSlider';
import { LocaleSwitcher } from '@/components/common/LocaleSwitcher';
import { RulerRelations } from '@/components/common/RulerRelations';
import { SearchBox } from '@/components/common/SearchBox';
import { useTranslations } from 'next-intl';

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

  const [civMode, setCivMode] = React.useState<'china' | 'eurasian' | 'east-asia'>('china');
  
  // 世界帝国地图的当前年份
  const [worldYear, setWorldYear] = React.useState<number>(1);
  const worldEraBounds = React.useMemo(() => getWorldEraBounds(civMode === 'eurasian' ? 'eurasian' : 'east-asia'), [civMode]);
  const activeWorldBoundaries = React.useMemo(() => 
    getActiveBoundaries(worldYear, civMode === 'eurasian' ? 'eurasian' : 'east-asia'),
    [worldYear, civMode]
  );
  
  const activeEras = civMode === 'china' ? eras : civMode === 'eurasian' ? [worldComparisonEra] : [eastAsiaComparisonEra];
  const activeRulers = civMode === 'china' ? rulers : civMode === 'eurasian' ? worldComparisonRulers : eastAsiaRulers;

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

  const [windowYears, setWindowYears] = React.useState<number>(50);
  const [year, setYear] = React.useState<number>(clamp(-350, min, max));

  const timelineMin = selectedRuler?.startYear ?? selectedEra.startYear;
  const timelineMax = selectedRuler?.endYear ?? selectedEra.endYear;

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

  // 主页面事件 → 时间线页面跳转（先做 MVP：反秦建汉）
  const timelineLinks: Record<string, { process: string; event?: string }> = {
    'qin-209-dazexiang': { process: 'anti-qin', event: 'daze-agriculture' },
    'han-202-han-founded': { process: 'anti-qin', event: 'han-unification' },
  };

  return (
    <div className="flex h-screen flex-col bg-zinc-50 text-zinc-900">
      {/* Header - 移动端优化 */}
      <header className="shrink-0 border-b border-zinc-200 bg-white">
        <div className="flex w-full flex-col gap-2 px-3 py-3 sm:px-4 sm:py-4">
          {/* Top row: title + locale */}
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="text-xs sm:text-sm text-zinc-500 truncate">{t('app.title')}</div>
              <h1 className="text-base sm:text-lg font-semibold truncate">{t('app.subtitle')}</h1>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <SearchBox eras={eras} events={events} rulers={rulers} locale={currentLocale} />
              <LocaleSwitcher />
            </div>
          </div>
          
          {/* Second row: civ switcher - scrollable on mobile */}
          <div className="overflow-x-auto scrollbar-hide py-1 -mx-1 px-1">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Civilization switcher */}
              <div className="flex rounded-lg border border-zinc-200 bg-zinc-100 p-0.5 text-xs sm:text-sm shrink-0">
                <button
                  type="button"
                  onClick={() => switchCiv('china')}
                  className={`rounded-md px-2 sm:px-3 py-1 transition-colors whitespace-nowrap ${civMode === 'china' ? 'bg-white text-zinc-900 shadow-sm font-medium' : 'text-zinc-500 hover:text-zinc-700'}`}
                >
                  🏯 中国史
                </button>
                <button
                  type="button"
                  onClick={() => switchCiv('eurasian')}
                  className={`rounded-md px-2 sm:px-3 py-1 transition-colors whitespace-nowrap ${civMode === 'eurasian' ? 'bg-white text-zinc-900 shadow-sm font-medium' : 'text-zinc-500 hover:text-zinc-700'}`}
                >
                  🌍 欧亚
                </button>
                <button
                  type="button"
                  onClick={() => switchCiv('east-asia')}
                  className={`rounded-md px-2 sm:px-3 py-1 transition-colors whitespace-nowrap ${civMode === 'east-asia' ? 'bg-white text-zinc-900 shadow-sm font-medium' : 'text-zinc-500 hover:text-zinc-700'}`}
                >
                  🌏 东亚
                </button>
              </div>
              
              {/* Era info */}
              <div className="text-xs sm:text-sm text-zinc-600 hidden sm:block">
                <span className="font-medium">{t(selectedEra.nameKey)}</span>
                <span className="mx-2 text-zinc-300">|</span>
                <span>
                  {formatYear(selectedEra.startYear)}–{formatYear(selectedEra.endYear)}
                </span>
              </div>
              
              {/* Quick links */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <Link
                  href={`/${currentLocale}/timeline`}
                  className="px-2 sm:px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-xs sm:text-sm text-zinc-700 transition-colors border border-zinc-200 whitespace-nowrap"
                >
                  📜 <span className="hidden sm:inline">{t('event.viewTimeline')}</span>
                </Link>
                <Link
                  href={`/${currentLocale}/matrix`}
                  className="px-2 sm:px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg text-xs sm:text-sm text-blue-700 transition-colors border border-blue-200 whitespace-nowrap"
                >
                  ⊞ <span className="hidden sm:inline">{t('matrix.title')}</span>
                </Link>
                <Link
                  href={`/${currentLocale}/battles`}
                  className="px-2 sm:px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-xs sm:text-sm text-red-700 transition-colors border border-red-200 whitespace-nowrap"
                >
                  ⚔️ <span className="hidden sm:inline">{t('nav.battles')}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex w-full flex-1 flex-col overflow-hidden px-2 sm:px-4 py-2 sm:py-4">
        <div className="grid h-full grid-cols-1 gap-2 sm:gap-4 overflow-hidden lg:grid-cols-[380px_minmax(0,1fr)_280px] xl:grid-cols-[420px_minmax(0,1fr)_320px]">
          {/* Left: global vertical timeline */}
          <aside className="flex max-h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <div className="shrink-0 border-b border-zinc-200 bg-white p-2 sm:p-3">
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{t('ui.eras')}</div>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {activeEras.map((era) => {
                const isOpen = openEraIds.has(era.id);
                const eraRulers = activeRulers.filter((r) => r.eraId === era.id);
                const eraColor = ERA_COLORS[era.id] || { bg: 'bg-zinc-50', text: 'text-zinc-700', dot: 'bg-zinc-400' };
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
                  <div key={era.id} className={`border-b border-zinc-100 last:border-0 ${isOpen ? eraColor.bg : ''}`}>
                    <button
                      type="button"
                      onClick={() => toggleEra(era.id)}
                      className="flex w-full items-center gap-2 px-2 py-2.5 text-left hover:bg-zinc-100/50 sm:px-3 transition-colors"
                    >
                      <span className={`w-2 h-2 rounded-full shrink-0 ${eraColor.dot}`}></span>
                      <span className={`flex-1 font-semibold ${eraColor.text} text-sm sm:text-base`}>
                        {t(era.nameKey)}
                        {isMultiPolity && <span className="text-xs ml-1 text-zinc-400">（多国并立）</span>}
                      </span>
                      <span className="text-xs text-zinc-400 hidden sm:inline">
                        {formatYear(era.startYear)}–{formatYear(era.endYear)}
                      </span>
                      <span className="text-xs text-zinc-300">{isOpen ? '▼' : '▶'}</span>
                    </button>
                    {isOpen && (
                      <div className="bg-zinc-50 px-2 py-1 sm:px-3 sm:py-2">
                        {isMultiPolity && rulersByPolity ? (
                          // 多国并立时期：表格形式（纵轴为时间）
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs sm:text-sm border-collapse">
                              <thead>
                                <tr className="text-left text-zinc-500 border-b border-zinc-200">
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
                                    const rulers = rulersByYear[year];
                                    return (
                                      <tr key={year} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-100/50">
                                        <td className="px-2 py-2 text-zinc-500 font-medium shrink-0 w-16">
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
                                                  isActive ? 'bg-blue-100 text-blue-800 font-medium' : 'hover:bg-zinc-100 text-zinc-700'
                                                }`}
                                              >
                                                <div>{t(r.nameKey)}</div>
                                                {r.eraNameKey && (
                                                  <div className="text-amber-600 text-xs">{tEra(r.eraNameKey)}</div>
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
                                  isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-zinc-100 text-zinc-600'
                                }`}
                              >
                                <span className="truncate flex items-center gap-1">
                                  {r.isDynastyBlock ? (
                                    <span className="font-semibold">{t(r.nameKey)}</span>
                                  ) : (
                                    <>
                                      <span>{t(r.nameKey)}</span>
                                      {r.eraNameKey && (
                                        <span className="text-amber-600 text-xs">{tEra(r.eraNameKey)}</span>
                                      )}
                                    </>
                                  )}
                                </span>
                                <span className="shrink-0 text-zinc-400">
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
            <div className="rounded-xl border border-zinc-200 bg-white p-2 sm:p-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{t('ui.timeline')}</div>
                  <div className="text-xs sm:text-sm text-zinc-800">
                    <span className="font-semibold">{formatYear(year)}</span>
                    <span className="mx-1.5 sm:mx-2 text-zinc-300">|</span>
                    <span className="hidden sm:inline">{t('ui.window.label')}: </span>
                    <span className="font-semibold">{t('ui.window.years', { count: windowYears })}</span>
                    <span className="mx-1.5 sm:mx-2 text-zinc-300 hidden sm:inline">|</span>
                    <span className="text-zinc-600 hidden sm:inline">{rangeLabel(year, windowYears)}</span>
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
                          ? 'bg-blue-600 text-white'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                      }`}
                    >
                      {w}年
                    </button>
                  ))}
                  <div className="flex items-center gap-1 border-l border-zinc-200 pl-2 ml-1">
                    <button
                      type="button"
                      onClick={() => setYear((y) => y - windowYears)}
                      disabled={year - windowYears < timelineMin}
                      className="rounded-lg bg-zinc-100 p-1.5 text-zinc-600 hover:bg-zinc-200 disabled:opacity-50"
                    >
                      ◀
                    </button>
                    <button
                      type="button"
                      onClick={() => setYear((y) => y + windowYears)}
                      disabled={year + windowYears > timelineMax}
                      className="rounded-lg bg-zinc-100 p-1.5 text-zinc-600 hover:bg-zinc-200 disabled:opacity-50"
                    >
                      ▶
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0 rounded-xl border border-zinc-200 bg-white overflow-hidden">
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

          {/* Right: events */}
          <aside className="flex max-h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <div className="shrink-0 border-b border-zinc-200 bg-white p-2 sm:p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
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
                      className="border-b border-zinc-100 px-2 py-2 last:border-0 sm:px-3"
                    >
                      <div className="text-xs text-zinc-400">
                        {formatYear(e.year)} {eraName ? `· ${eraName}` : ''}
                      </div>
                      <div className="mt-0.5 text-sm font-medium text-zinc-800">
                        {t(e.titleKey)}
                      </div>
                      {e.tags && e.tags.includes('war') && (
                        <div className="mt-1 inline-flex items-center gap-1 rounded bg-red-50 px-1.5 py-0.5 text-xs text-red-600">
                          ⚔️ 战役
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-sm text-zinc-400">{t('ui.noEvents')}</div>
              )}
              {otherEraEvents.length > 0 && (
                <>
                  <div className="border-t border-zinc-200 bg-zinc-50 px-2 py-2 sm:px-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      {t('ui.compare')} ({otherEraEvents.length})
                    </div>
                  </div>
                  {otherEraEvents.slice(0, 20).map((e) => {
                    const era = activeEras.find((era) => era.id === e.entityId);
                    const eraName = era ? t(era.nameKey) : '';
                    return (
                      <div
                        key={e.id}
                        className="border-b border-zinc-100 px-2 py-2 last:border-0 sm:px-3"
                      >
                        <div className="text-xs text-zinc-400">
                          {formatYear(e.year)} {eraName ? `· ${eraName}` : ''}
                        </div>
                        <div className="mt-0.5 text-sm text-zinc-600">{t(e.titleKey)}</div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Ruler detail inline */}
            {selectedRuler ? (
              <div className="shrink-0 border-t border-zinc-200 bg-white p-2 sm:p-3">
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{t('ui.rulerDetail')}</div>
                    <div className="mt-1 flex items-center gap-2 flex-wrap">
                      <span className="truncate text-sm sm:text-base font-semibold text-zinc-900">{t(selectedRuler.nameKey)}</span>
                      {selectedRuler.eraNameKey && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                          {tEra(selectedRuler.eraNameKey)}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-xs text-zinc-500">
                      {formatYear(selectedRuler.startYear)}–{formatYear(selectedRuler.endYear)}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-50"
                    onClick={() => setSelectedRulerId(null)}
                  >
                    {t('ui.clearRuler')}
                  </button>
                </div>
                {selectedRuler.highlightKey ? (
                  <div className="mt-2 text-xs sm:text-sm text-zinc-700">{t(selectedRuler.highlightKey)}</div>
                ) : null}
                {selectedRuler.bioKey ? (
                  <div className="mt-2 text-xs sm:text-sm text-zinc-600">{t(selectedRuler.bioKey)}</div>
                ) : null}
                <RulerRelations
                  ruler={selectedRuler}
                  allRulers={activeRulers}
                  onRulerClick={(id) => setSelectedRulerId(id)}
                />
              </div>
            ) : (
              <div className="shrink-0 border-t border-zinc-200 bg-white p-2 sm:p-3 text-xs text-zinc-500">{t('ui.seedNote')}</div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

// 朝代颜色映射
const ERA_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  'wz-western-zhou': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'period-spring-autumn': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  'period-warring-states': { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
  'qin': { bg: 'bg-zinc-100', text: 'text-zinc-700', dot: 'bg-zinc-600' },
  'han': { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  'xin': { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
  'eastern-han': { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
  'three-kingdoms': { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
};

// Era colors
