'use client';

import * as React from 'react';

import type { Era, Event } from '@/lib/history/types';
import { clamp, formatYear } from '@/lib/history/utils';
import { HistoryMap } from '@/components/HistoryMap';

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

export function HistoryApp({ eras, events }: { eras: Era[]; events: Event[] }) {
  const { min, max } = React.useMemo(() => yearBounds(eras), [eras]);

  const [selectedEraId, setSelectedEraId] = React.useState<string>(eras[1]?.id ?? eras[0]?.id);
  const selectedEra = React.useMemo(
    () => eras.find((e) => e.id === selectedEraId) ?? eras[0],
    [eras, selectedEraId]
  );

  const [windowYears, setWindowYears] = React.useState<number>(50);
  const [year, setYear] = React.useState<number>(clamp(-350, min, max));

  // Keep year within selected era by default, but don't be strict when user explores.
  React.useEffect(() => {
    if (!selectedEra) return;
    setYear((y) => clamp(y, selectedEra.startYear, selectedEra.endYear));
  }, [selectedEra]);

  const half = Math.floor(windowYears / 2);
  const rawFrom = year - half;
  const rawTo = year + half;

  const from = selectedEra ? clamp(rawFrom, selectedEra.startYear, selectedEra.endYear) : rawFrom;
  const to = selectedEra ? clamp(rawTo, selectedEra.startYear, selectedEra.endYear) : rawTo;

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
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <div className="text-sm text-zinc-500">History Atlas (MVP)</div>
            <h1 className="text-lg font-semibold">China · Eras + Events + Map</h1>
          </div>
          <div className="text-sm text-zinc-600">
            <span className="font-medium">{selectedEra?.name}</span>
            <span className="mx-2 text-zinc-300">|</span>
            <span>{formatYear(selectedEra.startYear)}–{formatYear(selectedEra.endYear)}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-[280px_1fr_360px]">
        {/* Left: era list */}
        <aside className="rounded-xl border border-zinc-200 bg-white p-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Eras (China)
          </div>
          <div className="space-y-1">
            {eras.map((era) => {
              const active = era.id === selectedEraId;
              return (
                <button
                  key={era.id}
                  type="button"
                  onClick={() => setSelectedEraId(era.id)}
                  className={`w-full rounded-lg px-2 py-2 text-left text-sm transition ${
                    active
                      ? 'bg-zinc-900 text-white'
                      : 'hover:bg-zinc-50 text-zinc-800'
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="font-medium">{era.name}</div>
                    <div className={`text-xs ${active ? 'text-zinc-200' : 'text-zinc-500'}`}>
                      {formatYear(era.startYear)}–{formatYear(era.endYear)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Center: map + time controls */}
        <section className="flex flex-col gap-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Timeline</div>
                <div className="text-sm text-zinc-800">
                  Center: <span className="font-semibold">{formatYear(year)}</span>
                  <span className="mx-2 text-zinc-300">|</span>
                  Window: <span className="font-semibold">{windowYears}y</span>
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
                  <option value={10}>10 years</option>
                  <option value={50}>50 years</option>
                  <option value={100}>100 years</option>
                </select>
              </div>
            </div>

            <div className="mt-3">
              <input
                type="range"
                min={selectedEra.startYear}
                max={selectedEra.endYear}
                step={1}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full"
              />
              <div className="mt-1 flex justify-between text-xs text-zinc-500">
                <span>{formatYear(selectedEra.startYear)}</span>
                <span>{formatYear(selectedEra.endYear)}</span>
              </div>
            </div>
          </div>

          <div className="h-[520px]">
            <HistoryMap events={mapEvents} />
          </div>
        </section>

        {/* Right: events */}
        <aside className="rounded-xl border border-zinc-200 bg-white p-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Events
          </div>

          <div className="space-y-5">
            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <div className="text-sm font-semibold">{selectedEra.name}</div>
                <div className="text-xs text-zinc-500">{currentEraEvents.length} items</div>
              </div>
              <ul className="space-y-2">
                {currentEraEvents.length ? (
                  currentEraEvents.map((e) => (
                    <li key={e.id} className="rounded-lg border border-zinc-200 p-2">
                      <div className="text-xs text-zinc-500">{formatYear(e.year)}</div>
                      <div className="text-sm font-semibold">{e.title}</div>
                      <div className="text-sm text-zinc-700">{e.summary}</div>
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
                  <div className="text-sm text-zinc-500">No events in this window.</div>
                )}
              </ul>
            </div>

            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <div className="text-sm font-semibold">同期对比（其他时期）</div>
                <div className="text-xs text-zinc-500">{otherEraEvents.length} items</div>
              </div>
              <ul className="space-y-2">
                {otherEraEvents.length ? (
                  otherEraEvents.map((e) => (
                    <li key={e.id} className="rounded-lg border border-zinc-200 p-2">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="text-xs text-zinc-500">{formatYear(e.year)}</div>
                        <div className="text-xs text-zinc-500">
                          {eras.find((x) => x.id === e.entityId)?.name ?? e.entityId}
                        </div>
                      </div>
                      <div className="text-sm font-semibold">{e.title}</div>
                      <div className="text-sm text-zinc-700">{e.summary}</div>
                    </li>
                  ))
                ) : (
                  <div className="text-sm text-zinc-500">No comparable events in this window.</div>
                )}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      <footer className="mx-auto max-w-7xl px-4 pb-8 text-xs text-zinc-500">
        Seed data is illustrative for the MVP; dates/locations are approximate.
      </footer>
    </div>
  );
}
