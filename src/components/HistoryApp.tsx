'use client';

import * as React from 'react';
import Link from 'next/link';

import type { Era, Event, Ruler } from '@/lib/history/types';
import { clamp, formatYear } from '@/lib/history/utils';
import { HistoryMap } from '@/components/HistoryMap';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { RulerRelations } from '@/components/RulerRelations';
import { useTranslations } from 'next-intl';
import { worldComparisonEra, eastAsiaComparisonEra } from '@/lib/history/data/worldEras';
import { worldComparisonRulers, eastAsiaRulers } from '@/lib/history/data/worldRulers';

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
      <header className="shrink-0 border-b border-zinc-200 bg-white">
        <div className="flex w-full flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm text-zinc-500">{t('app.title')}</div>
            <h1 className="text-lg font-semibold">{t('app.subtitle')}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Civilization switcher */}
            <div className="flex rounded-lg border border-zinc-200 bg-zinc-100 p-0.5 text-sm">
              <button
                type="button"
                onClick={() => switchCiv('china')}
                className={`rounded-md px-3 py-1 transition-colors ${civMode === 'china' ? 'bg-white text-zinc-900 shadow-sm font-medium' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                🏯 中国史
              </button>
              <button
                type="button"
                onClick={() => switchCiv('eurasian')}
                className={`rounded-md px-3 py-1 transition-colors ${civMode === 'eurasian' ? 'bg-white text-zinc-900 shadow-sm font-medium' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                🌍 欧亚对比
              </button>
              <button
                type="button"
                onClick={() => switchCiv('east-asia')}
                className={`rounded-md px-3 py-1 transition-colors ${civMode === 'east-asia' ? 'bg-white text-zinc-900 shadow-sm font-medium' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                🌏 东亚对比
              </button>
            </div>
            <div className="text-sm text-zinc-600">
              <span className="font-medium">{t(selectedEra.nameKey)}</span>
              <span className="mx-2 text-zinc-300">|</span>
              <span>
                {formatYear(selectedEra.startYear)}–{formatYear(selectedEra.endYear)}
              </span>
            </div>
            <LocaleSwitcher />
            <Link
              href={`/${currentLocale}/timeline`}
              className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-sm text-zinc-700 transition-colors border border-zinc-200"
            >
              📜 {t('event.viewTimeline')}
            </Link>
            <Link
              href={`/${currentLocale}/battles`}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-sm text-red-700 transition-colors border border-red-200"
            >
              ⚔️ {t('nav.battles') || '战役'}
            </Link>
          </div>
        </div>
      </header>

      <div className="flex w-full flex-1 flex-col overflow-hidden px-4 py-4">
        <div className="grid h-full grid-cols-1 gap-4 overflow-hidden lg:grid-cols-[420px_minmax(0,1fr)_320px] xl:grid-cols-[480px_minmax(0,1fr)_360px]">
        {/* Left: global vertical timeline (time-proportional, collapsible, scrollable) */}
        <aside className="flex max-h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="shrink-0 border-b border-zinc-200 bg-white p-3">
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{t('ui.timeline')}</div>
                <div className="mt-1 text-sm font-semibold text-zinc-900">{t('ui.rulers')}</div>
              </div>
              <div className="text-xs text-zinc-500">{formatYear(min)}–{formatYear(max)}</div>
            </div>
            <div className="mt-2 text-xs text-zinc-600">
              按真实时间比例排布；可滚动；时期可折叠。
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto p-3">
            {/* Flow layout: each era block sized by content, axis line spans the container */}
            <div className="relative">
              {/* Continuous axis */}
              <div className="absolute left-[20px] top-0 bottom-0 w-px bg-zinc-200" />

              {activeEras.map((era) => {
                const open = openEraIds.has(era.id);
                const eraRulers = activeRulers
                  .filter((r) => r.eraId === era.id)
                  .sort((a, b) => a.startYear - b.startYear);
                const polities = era.isParallelPolities ? (era.polities ?? []) : [];

                return (
                  <div key={era.id} className="relative">
                    {/* Era header row */}
                    <button
                      type="button"
                      onClick={() => toggleEra(era.id)}
                      className="group relative flex w-full items-center gap-3 py-2 pr-2 text-left"
                      style={{ paddingLeft: 32 }}
                    >
                      <span
                        className={`absolute z-10 h-3 w-3 rounded-full ring-4 transition ${
                          open
                            ? 'bg-zinc-900 ring-zinc-900/15'
                            : 'bg-zinc-400 ring-zinc-400/15 group-hover:bg-zinc-700 group-hover:ring-zinc-700/15'
                        }`}
                        style={{ left: 20, transform: 'translate(-50%, -50%)', top: '50%' }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="min-w-0 truncate text-sm font-semibold text-zinc-900">{t(era.nameKey)}</span>
                          <span className="shrink-0 text-xs text-zinc-500">
                            {formatYear(era.startYear)}–{formatYear(era.endYear)}
                          </span>
                        </div>
                      </div>
                    </button>

                    {/* Expanded content */}
                    {open && (
                      <div className="mb-2">
                        {!era.isParallelPolities ? (
                          /* Simple ruler list — dots aligned to the main axis (left=20px) */
                          <div className="space-y-0.5">
                            {eraRulers.length === 0 ? (
                              <div className="py-1 text-xs text-zinc-400" style={{ paddingLeft: 32 }}>—</div>
                            ) : eraRulers.map((r) => {
                              const active = selectedRulerId === r.id;
                              return (
                                <button
                                  key={r.id}
                                  type="button"
                                  onClick={() => setSelectedRulerId(r.id)}
                                  className={`group relative flex w-full items-center rounded py-1 pr-2 text-left transition ${active ? 'bg-zinc-100' : 'hover:bg-zinc-50'}`}
                                  style={{ paddingLeft: 32 }}
                                >
                                  {/* dot on axis */}
                                  <span
                                    className={`absolute h-1.5 w-1.5 rounded-full transition ${active ? 'bg-zinc-700' : 'bg-zinc-300 group-hover:bg-zinc-500'}`}
                                    style={{ left: 20, top: '50%', transform: 'translate(-50%, -50%)' }}
                                  />
                                  <div className="min-w-0 flex-1 flex items-baseline justify-between gap-2">
                                    <span className={`truncate text-[13px] font-medium ${active ? 'text-zinc-900' : 'text-zinc-600'}`}>
                                      {t(r.nameKey)}{r.eraNameKey ? <span className="text-zinc-500"> - {tEra(r.eraNameKey)}</span> : null}
                                    </span>
                                    <span className="shrink-0 text-[13px] text-zinc-400">
                                      {formatYear(r.startYear)}–{formatYear(r.endYear)}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          /* Parallel polities grid */
                          <div className="ml-8 mr-2 mb-1">
                          {(() => {
                            const span = Math.max(1, era.endYear - era.startYear);
                            const step = span <= 80 ? 5 : span <= 220 ? 10 : span <= 600 ? 20 : span <= 1500 ? 50 : 100;
                            const ticks: number[] = [];
                            for (let y = era.startYear; y <= era.endYear; y += step) ticks.push(y);
                            if (ticks[ticks.length - 1] !== era.endYear) ticks.push(era.endYear);
                            const byPolity = new Map<string, Ruler[]>();
                            for (const p of polities) {
                              byPolity.set(
                                p.id,
                                eraRulers.filter((r) => r.polityId === p.id).sort((a, b) => a.startYear - b.startYear)
                              );
                            }
                            const rulerAt = (polityId: string, y: number) => {
                              const list = byPolity.get(polityId) ?? [];
                              return list.find((r) => y >= r.startYear && y <= r.endYear) ?? null;
                            };
                            // Precompute rowspan: for each (polityId, tickIdx), how many consecutive ticks share the same ruler?
                            // We only render the cell at the first tick of a ruler's run; subsequent ticks are skipped.
                            type CellInfo = { ruler: Ruler | null; rowSpan: number } | null; // null = skip (covered by earlier rowspan)
                            const cells: CellInfo[][] = ticks.map((y, ti) =>
                              polities.map((p) => {
                                const r = rulerAt(p.id, y);
                                // Check if same ruler was already at previous tick → skip
                                if (ti > 0) {
                                  const prev = rulerAt(p.id, ticks[ti - 1]);
                                  if (prev && r && prev.id === r.id) return null;
                                }
                                // Calculate rowspan: count forward ticks with the same ruler
                                let span = 1;
                                for (let j = ti + 1; j < ticks.length; j++) {
                                  const next = rulerAt(p.id, ticks[j]);
                                  if (next && r && next.id === r.id) span++;
                                  else break;
                                }
                                return { ruler: r, rowSpan: span };
                              })
                            );
                            return (
                              <div className="overflow-auto rounded border border-zinc-200 bg-white">
                                <table className="w-full border-collapse text-[12px]">
                                  <thead>
                                    <tr>
                                      <th className="sticky top-0 z-10 border-b border-zinc-200 bg-white px-2 py-1 text-left font-semibold text-zinc-500 w-16">年份</th>
                                      {polities.map((p) => (
                                        <th key={p.id} className="sticky top-0 z-10 border-b border-l border-zinc-200 bg-white px-2 py-1 text-left font-semibold text-zinc-700">
                                          {t(p.nameKey)}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {ticks.map((y, ti) => (
                                      <tr key={y}>
                                        <td className="border-b border-zinc-100 bg-zinc-50 px-2 py-1 text-zinc-500 whitespace-nowrap">{formatYear(y)}</td>
                                        {polities.map((p, pi) => {
                                          const cell = cells[ti][pi];
                                          if (cell === null) return null; // skip — covered by rowspan above
                                          const { ruler: r, rowSpan } = cell;
                                          const active = r ? selectedRulerId === r.id : false;
                                          const isDynasty = r?.isDynastyBlock === true;
                                          return (
                                            <td
                                              key={p.id}
                                              rowSpan={rowSpan}
                                              className={`border-b border-l border-zinc-100 px-2 py-1 align-top transition ${isDynasty ? 'bg-zinc-100' : r ? active ? 'bg-zinc-900 text-white' : 'text-zinc-700' : 'text-zinc-300'}`}
                                            >
                                              {r ? (
                                                <button
                                                  type="button"
                                                  onClick={() => setSelectedRulerId(r.id)}
                                                  className={`w-full text-left hover:underline ${isDynasty ? 'text-xs font-semibold text-zinc-600 truncate' : active ? 'text-white' : ''}`}
                                                >
                                                  {t(r.nameKey)}{r.eraNameKey ? <span className="text-zinc-400"> - {tEra(r.eraNameKey)}</span> : null}
                                                </button>
                                              ) : ''}
                                            </td>
                                          );
                                        })}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            );
                          })()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ruler detail inline */}
          {selectedRuler ? (
            <div className="shrink-0 border-t border-zinc-200 bg-white p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{t('ui.rulerDetail')}</div>
                  <div className="mt-1 truncate text-base font-semibold text-zinc-900">{t(selectedRuler.nameKey)}</div>
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
                <div className="mt-2 text-sm text-zinc-700">{t(selectedRuler.highlightKey)}</div>
              ) : null}
              {selectedRuler.bioKey ? (
                <div className="mt-2 text-sm text-zinc-600">{t(selectedRuler.bioKey)}</div>
              ) : null}
              <RulerRelations
                ruler={selectedRuler}
                allRulers={activeRulers}
                onRulerClick={(id) => setSelectedRulerId(id)}
              />
            </div>
          ) : (
            <div className="shrink-0 border-t border-zinc-200 bg-white p-3 text-xs text-zinc-500">{t('ui.seedNote')}</div>
          )}
        </aside>

        {/* Center: map + time controls */}
        <section className="flex min-h-0 flex-col gap-3 overflow-hidden">
          <div className="rounded-xl border border-zinc-200 bg-white p-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{t('ui.timeline')}</div>
                <div className="text-sm text-zinc-800">
                  {t('ui.centerYear')}: <span className="font-semibold">{formatYear(year)}</span>
                  <span className="mx-2 text-zinc-300">|</span>
                  {t('ui.window.label')}: <span className="font-semibold">{t('ui.window.years', { count: windowYears })}</span>
                  <span className="mx-2 text-zinc-300">|</span>
                  <span className="text-zinc-600">{rangeLabel(year, windowYears)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-zinc-600">Window</label>
                <select
                  value={windowYears}
                  onChange={(e) => setWindowYears(Number(e.target.value))}
                  className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-sm"
                >
                  <option value={10}>{t('ui.window.10')}</option>
                  <option value={50}>{t('ui.window.50')}</option>
                  <option value={100}>{t('ui.window.100')}</option>
                </select>
              </div>
            </div>

            <div className="mt-3">
              <input
                type="range"
                min={timelineMin}
                max={timelineMax}
                step={1}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full"
              />
              <div className="mt-1 flex justify-between text-xs text-zinc-500">
                <span>{formatYear(timelineMin)}</span>
                <span>{formatYear(timelineMax)}</span>
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1">
            <HistoryMap events={mapEvents} openEraIds={openEraIds} />
          </div>
        </section>

        {/* Right: events */}
        <aside className="max-h-full overflow-auto rounded-xl border border-zinc-200 bg-white p-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            {t('ui.events')}
          </div>

          <div className="space-y-5">

            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <div className="text-sm font-semibold">{t(selectedEra.nameKey)}</div>
                <div className="text-xs text-zinc-500">{currentEraEvents.length} items</div>
              </div>
              <ul className="space-y-2">
                {currentEraEvents.length ? (
                  currentEraEvents.map((e) => (
                    <li key={e.id} className="rounded-lg border border-zinc-200 p-2">
                      <div className="text-xs text-zinc-500">{formatYear(e.year)}</div>
                      <div className="text-sm font-semibold">{t(`event.${e.id}.title`)}</div>
                      <div className="text-sm text-zinc-700">{t(`event.${e.id}.summary`)}</div>
                      {timelineLinks[e.id] ? (
                        <div className="mt-2">
                          <Link
                            href={`/${currentLocale}/timeline?process=${timelineLinks[e.id].process}${timelineLinks[e.id].event ? `&event=${timelineLinks[e.id].event}` : ''}`}
                            className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-2 py-1 text-xs font-medium text-white hover:bg-zinc-800"
                          >
                            {t('event.viewTimeline')} →
                          </Link>
                        </div>
                      ) : null}
                      {e.tags?.length ? (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {e.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </li>
                  ))
                ) : (
                  <div className="text-sm text-zinc-500">{t('ui.noEvents')}</div>
                )}
              </ul>
            </div>

            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <div className="text-sm font-semibold">{t('ui.compare')}</div>
                <div className="text-xs text-zinc-500">{otherEraEvents.length} items</div>
              </div>
              <ul className="space-y-2">
                {otherEraEvents.length ? (
                  otherEraEvents.map((e) => (
                    <li key={e.id} className="rounded-lg border border-zinc-200 p-2">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="text-xs text-zinc-500">{formatYear(e.year)}</div>
                        <div className="text-xs text-zinc-500">
                          {(() => {
                            const era = activeEras.find((x) => x.id === e.entityId);
                            return era ? t(era.nameKey) : e.entityId;
                          })()}
                        </div>
                      </div>
                      <div className="text-sm font-semibold">{t(e.titleKey)}</div>
                      <div className="text-sm text-zinc-700">{t(e.summaryKey)}</div>
                      {timelineLinks[e.id] ? (
                        <div className="mt-2">
                          <Link
                            href={`/${currentLocale}/timeline?process=${timelineLinks[e.id].process}${timelineLinks[e.id].event ? `&event=${timelineLinks[e.id].event}` : ''}`}
                            className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-2 py-1 text-xs font-medium text-white hover:bg-zinc-800"
                          >
                            {t('event.viewTimeline')} →
                          </Link>
                        </div>
                      ) : null}
                    </li>
                  ))
                ) : (
                  <div className="text-sm text-zinc-500">{t('ui.noCompare')}</div>
                )}
              </ul>
            </div>
          </div>
        </aside>
        </div>
      </div>
    </div>
  );
}
