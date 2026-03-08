'use client';

import * as React from 'react';

import type { Era, Event, Ruler } from '@/lib/history/types';
import { clamp, formatYear } from '@/lib/history/utils';
import { HistoryMap } from '@/components/HistoryMap';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { useTranslations } from 'next-intl';

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
}: {
  eras: Era[];
  events: Event[];
  rulers: Ruler[];
}) {
  const t = useTranslations();
  const { min, max } = React.useMemo(() => yearBounds(eras), [eras]);

  const [selectedEraId, setSelectedEraId] = React.useState<string>(eras[1]?.id ?? eras[0]?.id);
  const selectedEra = React.useMemo(
    () => eras.find((e) => e.id === selectedEraId) ?? eras[0],
    [eras, selectedEraId]
  );

  const [selectedRulerId, setSelectedRulerId] = React.useState<string | null>(null);
  const selectedRuler = React.useMemo(
    () => (selectedRulerId ? rulers.find((r) => r.id === selectedRulerId) ?? null : null),
    [rulers, selectedRulerId]
  );

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
    const set = new Set([selectedEraId]);
    return events
      .filter((e) => set.has(e.entityId))
      .filter(inWindow)
      .sort((a, b) => a.year - b.year);
  }, [events, inWindow, selectedEraId]);

  const otherEraEvents = React.useMemo(() => {
    return events
      .filter((e) => e.entityId !== selectedEraId)
      .filter(inWindow)
      .sort((a, b) => a.year - b.year);
  }, [events, inWindow, selectedEraId]);

  const mapEvents = React.useMemo(() => {
    // Prefer showing selected era events, but include others to support comparison.
    const merged = [...currentEraEvents, ...otherEraEvents];
    // dedupe by id
    const byId = new Map<string, Event>();
    for (const e of merged) byId.set(e.id, e);
    return [...byId.values()];
  }, [currentEraEvents, otherEraEvents]);

  return (
    <div className="flex h-screen flex-col bg-zinc-50 text-zinc-900">
      <header className="shrink-0 border-b border-zinc-200 bg-white">
        <div className="flex w-full flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm text-zinc-500">{t('app.title')}</div>
            <h1 className="text-lg font-semibold">{t('app.subtitle')}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-zinc-600">
              <span className="font-medium">{t(selectedEra.nameKey)}</span>
              <span className="mx-2 text-zinc-300">|</span>
              <span>
                {formatYear(selectedEra.startYear)}–{formatYear(selectedEra.endYear)}
              </span>
            </div>
            <LocaleSwitcher />
          </div>
        </div>
      </header>

      <div className="flex w-full flex-1 flex-col overflow-hidden px-4 py-4">
        <div className="grid h-full grid-cols-1 gap-4 overflow-hidden lg:grid-cols-[320px_minmax(0,1fr)_380px] xl:grid-cols-[360px_minmax(0,1fr)_420px]">
        {/* Left: vertical timeline (rulers live on the timeline, not in a right sidebar) */}
        <aside className="flex max-h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white">
          {/* Era picker */}
          <div className="shrink-0 border-b border-zinc-200 p-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">{t('ui.eras')}</div>
            <div className="flex items-center gap-2">
              <select
                value={selectedEraId}
                onChange={(e) => {
                  setSelectedEraId(e.target.value);
                  setSelectedRulerId(null);
                }}
                className="min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-sm"
              >
                {eras.map((era) => (
                  <option key={era.id} value={era.id}>
                    {t(era.nameKey)} · {formatYear(era.startYear)}–{formatYear(era.endYear)}
                  </option>
                ))}
              </select>
              <div className="shrink-0 rounded-full bg-zinc-100 px-2 py-1 text-[11px] font-medium text-zinc-700">
                {t('ui.rulers')}
              </div>
            </div>
          </div>

          {/* Timeline canvas */}
          <div className="min-h-0 flex-1 overflow-auto p-3">
            {(() => {
              const era = selectedEra;
              const eraRulers = rulers
                .filter((r) => r.eraId === era.id)
                .sort((a, b) => a.startYear - b.startYear);

              const polities = era.isParallelPolities ? (era.polities ?? []) : [];

              // Single-polity: a vertical axis; each ruler becomes a dot with label to the right.
              if (!era.isParallelPolities) {
                if (!eraRulers.length) return <div className="text-sm text-zinc-500">-</div>;

                const span = Math.max(1, era.endYear - era.startYear);
                const pxPerYear = 1.8; // MVP: readable density
                const innerH = Math.max(520, Math.round(span * pxPerYear));

                const yFor = (y: number) => {
                  const ratio = (y - era.startYear) / span;
                  return Math.round(ratio * (innerH - 32)) + 16;
                };

                return (
                  <div className="rounded-xl border border-zinc-200 bg-gradient-to-b from-white to-zinc-50 p-3">
                    <div className="mb-2 flex items-baseline justify-between gap-2">
                      <div className="text-sm font-semibold text-zinc-900">{t(era.nameKey)}</div>
                      <div className="text-xs text-zinc-500">
                        {formatYear(era.startYear)}–{formatYear(era.endYear)}
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
                      <div className="relative" style={{ height: innerH }}>
                        <div className="absolute left-5 top-0 h-full w-px bg-zinc-200" />

                        {eraRulers.map((r) => {
                          const y = yFor(r.startYear);
                          const active = selectedRulerId === r.id;
                          return (
                            <div key={r.id} className="absolute left-0 right-0" style={{ top: y }}>
                              <button
                                type="button"
                                onClick={() => setSelectedRulerId(r.id)}
                                className="group flex w-full items-start gap-3 px-3 py-2 text-left"
                              >
                                <span
                                  className={`mt-[6px] h-2 w-2 rounded-full ring-4 transition ${
                                    active
                                      ? 'bg-zinc-900 ring-zinc-900/15'
                                      : 'bg-zinc-400 ring-zinc-400/15 group-hover:bg-zinc-700 group-hover:ring-zinc-700/15'
                                  }`}
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-baseline justify-between gap-3">
                                    <div className={`truncate text-sm font-semibold ${active ? 'text-zinc-900' : 'text-zinc-800'}`}>
                                      {t(r.nameKey)}
                                    </div>
                                    <div className="shrink-0 text-xs text-zinc-500">
                                      {formatYear(r.startYear)}–{formatYear(r.endYear)}
                                    </div>
                                  </div>
                                  {r.highlightKey ? (
                                    <div className="mt-1 line-clamp-2 text-xs text-zinc-600">{t(r.highlightKey)}</div>
                                  ) : null}
                                </div>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              // Parallel polities: left column is the vertical time axis; columns to the right are states.
              const span = era.endYear - era.startYear;
              const step = span <= 80 ? 5 : span <= 220 ? 10 : 20;
              const ticks: number[] = [];
              for (let y = era.startYear; y <= era.endYear; y += step) ticks.push(y);
              if (ticks[ticks.length - 1] !== era.endYear) ticks.push(era.endYear);

              const byPolity = new Map<string, Ruler[]>();
              for (const p of polities) {
                byPolity.set(
                  p.id,
                  eraRulers
                    .filter((r) => r.polityId === p.id)
                    .sort((a, b) => a.startYear - b.startYear)
                );
              }
              const rulerAt = (polityId: string, y: number) => {
                const list = byPolity.get(polityId) ?? [];
                return list.find((r) => y >= r.startYear && y <= r.endYear) ?? null;
              };

              return (
                <div className="rounded-xl border border-zinc-200 bg-gradient-to-b from-white to-zinc-50 p-3">
                  <div className="mb-2 flex items-baseline justify-between gap-2">
                    <div className="text-sm font-semibold text-zinc-900">{t(era.nameKey)}</div>
                    <div className="text-xs text-zinc-500">
                      {formatYear(era.startYear)}–{formatYear(era.endYear)}
                    </div>
                  </div>

                  <div className="overflow-auto rounded-lg border border-zinc-200 bg-white">
                    <div
                      className="grid min-w-[760px]"
                      style={{ gridTemplateColumns: `92px repeat(${polities.length}, minmax(0, 1fr))` }}
                    >
                      <div className="sticky top-0 z-10 border-b border-zinc-200 bg-white px-2 py-2 text-[11px] font-semibold text-zinc-500">
                        {t('ui.timeline')}
                      </div>
                      {polities.map((p) => (
                        <div
                          key={p.id}
                          className="sticky top-0 z-10 border-b border-l border-zinc-200 bg-white px-2 py-2 text-[11px] font-semibold text-zinc-700"
                        >
                          {t(p.nameKey)}
                        </div>
                      ))}

                      {ticks.map((y) => (
                        <React.Fragment key={y}>
                          <div className="border-b border-zinc-200 bg-zinc-50 px-2 py-2 text-[11px] text-zinc-600">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-zinc-300" />
                              <span>{formatYear(y)}</span>
                            </div>
                          </div>
                          {polities.map((p) => {
                            const r = rulerAt(p.id, y);
                            const active = r ? selectedRulerId === r.id : false;
                            return (
                              <button
                                key={`${p.id}-${y}`}
                                type="button"
                                onClick={() => {
                                  if (!r) return;
                                  setSelectedRulerId(r.id);
                                }}
                                className={`border-b border-l border-zinc-200 px-2 py-2 text-left text-[11px] transition ${
                                  r
                                    ? active
                                      ? 'bg-zinc-900 text-white'
                                      : 'bg-white text-zinc-800 hover:bg-zinc-50'
                                    : 'bg-white text-zinc-300'
                                }`}
                              >
                                {r ? t(r.nameKey) : ''}
                              </button>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Ruler detail inline (moved from right sidebar) */}
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
            <HistoryMap events={mapEvents} />
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
                      <div className="text-sm font-semibold">{t(e.titleKey)}</div>
                      <div className="text-sm text-zinc-700">{t(e.summaryKey)}</div>
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
                            const era = eras.find((x) => x.id === e.entityId);
                            return era ? t(era.nameKey) : e.entityId;
                          })()}
                        </div>
                      </div>
                      <div className="text-sm font-semibold">{t(e.titleKey)}</div>
                      <div className="text-sm text-zinc-700">{t(e.summaryKey)}</div>
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
