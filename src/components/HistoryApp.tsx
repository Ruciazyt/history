'use client';

import * as React from 'react';

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
import { RulerList } from '@/components/HistoryApp/RulerList';

import { worldComparisonEra, eastAsiaComparisonEra } from '@/lib/history/data/worldEras';
import { worldComparisonRulers, eastAsiaRulers } from '@/lib/history/data/worldRulers';
import { getWorldEraBounds, getActiveBoundaries } from '@/lib/history/data/worldBoundaries';

function yearBounds(eras: Era[]) {
  if (eras.length === 0) return { min: 0, max: 0 };
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

  const [eraDrawerOpen, setEraDrawerOpen] = React.useState(false);
  const [eventsDrawerOpen, setEventsDrawerOpen] = React.useState(false);

  const switchCiv = React.useCallback((mode: 'china' | 'eurasian' | 'east-asia') => {
    setCivMode(mode);
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

  const timelineMin = selectedRuler?.startYear ?? selectedEra?.startYear ?? min;
  const timelineMax = selectedRuler?.endYear ?? selectedEra?.endYear ?? max;

  React.useEffect(() => {
    setYear((y) => clamp(y, timelineMin, timelineMax));
  }, [timelineMin, timelineMax]);

  const half = Math.floor(windowYears / 2);
  const from = clamp(year - half, timelineMin, timelineMax);
  const to = clamp(year + half, timelineMin, timelineMax);

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
    const merged = [...currentEraEvents, ...otherEraEvents];
    const byId = new Map<string, Event>();
    for (const e of merged) byId.set(e.id, e);
    return [...byId.values()];
  }, [currentEraEvents, otherEraEvents]);

  return (
    <div className="flex h-screen flex-col bg-[var(--color-canvas)] text-[var(--color-ink)]">
      {/* Minimal top status bar */}
      <header className="shrink-0 h-12 border-b border-[var(--color-hairline)] bg-[var(--color-canvas)]">
        <div className="flex h-full items-center justify-between px-4">
          {/* Left: hamburger (mobile) + era info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setEraDrawerOpen(true)}
              className="rounded-[var(--rounded-md)] p-2 hover:bg-[var(--color-surface-soft)] transition-colors lg:hidden"
              aria-label={t('ui.openEraMenu')}
            >
              <span className="text-lg">☰</span>
            </button>
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <span className="font-medium text-[var(--text-primary)]">
                {selectedEra ? t(selectedEra.nameKey) : ''}
              </span>
              <span className="text-[var(--divider)]">|</span>
              <span>
                {selectedEra ? `${formatYear(selectedEra.startYear, currentLocale)}–${formatYear(selectedEra.endYear, currentLocale)}` : ''}
              </span>
              {selectedRuler && (
                <>
                  <span className="text-[var(--divider)]">|</span>
                  <span className="text-[var(--text-primary)]">{t(selectedRuler.nameKey)}</span>
                </>
              )}
            </div>
          </div>

          {/* Right: controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Civ mode toggle */}
            <div className="hidden sm:flex rounded-[var(--rounded-pill)] bg-[var(--color-surface-soft)] p-0.5 text-xs">
              {(['china', 'eurasian', 'east-asia'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => switchCiv(mode)}
                  className={`rounded-[var(--rounded-pill)] px-2 py-0.5 transition-colors ${
                    civMode === mode
                      ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {mode === 'china' ? '🏛️' : mode === 'eurasian' ? '🌍' : '🌏'}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setEventsDrawerOpen(true)}
              className="btn-circle lg:hidden"
              aria-label={t('ui.openEventsList')}
            >
              📋
            </button>
            <div className="hidden lg:flex items-center gap-2">
              <SearchBox events={events} rulers={rulers} locale={currentLocale} />
              <ThemeToggle />
              <LocaleSwitcher />
            </div>
            <div className="flex lg:hidden items-center gap-1">
              <ThemeToggle />
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Main content: 3-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar: era list */}
        <aside className="hidden lg:flex w-64 xl:w-72 flex-col border-r border-[var(--color-hairline)] bg-[var(--color-canvas)]">
          <div className="flex-1 overflow-y-auto">
            {activeEras.map((era) => {
              const isOpen = openEraIds.has(era.id);
              const eraRulers = activeRulers.filter((r) => r.eraId === era.id);
              const eraColor = ERA_COLORS[era.id] || ERA_ITEM_COLORS.default;
              return (
                <div key={era.id} className={`border-b border-[var(--color-hairline-soft)] last:border-0 ${isOpen ? eraColor.bg : ''}`}>
                  <button
                    type="button"
                    onClick={() => toggleEra(era.id)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-[var(--color-surface-soft)] transition-colors"
                  >
                    <span className={`w-2 h-2 rounded-full shrink-0 ${eraColor.dot}`}></span>
                    <span className={`flex-1 font-medium ${eraColor.text} text-sm`}>
                      {t(era.nameKey)}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {formatYear(era.startYear, currentLocale)}–{formatYear(era.endYear, currentLocale)}
                    </span>
                    <span className="text-xs text-[var(--divider)]">{isOpen ? '▼' : '▶'}</span>
                  </button>
                  <RulerList
                    eraRulers={eraRulers}
                    era={era}
                    isOpen={isOpen}
                    selectedRulerId={selectedRulerId}
                    onSelectRuler={setSelectedRulerId}
                  />
                </div>
              );
            })}
          </div>
        </aside>

        {/* Center: map with timeline controls */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Timeline controls bar */}
          <div className="shrink-0 flex items-center gap-3 px-4 py-2 border-b border-[var(--color-hairline)] bg-[var(--color-surface-soft)]">
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {formatYear(year, currentLocale)}
            </span>
            <div className="flex items-center gap-1">
              {[10, 50, 100].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWindowYears(w)}
                  className={`rounded-[var(--rounded-pill)] px-2 py-0.5 text-xs font-medium transition-colors ${
                    windowYears === w
                      ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                      : 'bg-[var(--color-canvas)] text-[var(--text-secondary)] hover:bg-[var(--color-hairline)]'
                  }`}
                >
                  {w}年
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 border-l border-[var(--color-hairline)] pl-2">
              <button
                type="button"
                onClick={() => setYear((y) => y - windowYears)}
                disabled={year - windowYears < timelineMin}
                className="rounded-[var(--rounded-md)] p-1 hover:bg-[var(--color-canvas)] disabled:opacity-30 text-[var(--text-secondary)]"
              >
                ◀
              </button>
              <button
                type="button"
                onClick={() => setYear((y) => y + windowYears)}
                disabled={year + windowYears > timelineMax}
                className="rounded-[var(--rounded-md)] p-1 hover:bg-[var(--color-canvas)] disabled:opacity-30 text-[var(--text-secondary)]"
              >
                ▶
              </button>
            </div>
            <span className="text-xs text-[var(--text-muted)] hidden sm:inline">
              {t('ui.window.years', { count: windowYears })}
            </span>
          </div>

          {/* Map */}
          <div className="flex-1 min-h-0">
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
                  locale={currentLocale}
                />
              </>
            )}
          </div>
        </main>

        {/* Right sidebar: events + ruler detail */}
        <aside className="hidden lg:flex w-56 xl:w-64 flex-col border-l border-[var(--color-hairline)] bg-[var(--color-canvas)]">
          {/* Events list */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-3 py-2 border-b border-[var(--color-hairline)]">
              <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                {t('ui.events')} ({currentEraEvents.length})
              </span>
            </div>
            {currentEraEvents.length > 0 ? (
              currentEraEvents.map((e) => {
                const era = activeEras.find((era) => era.id === e.entityId);
                const eraName = era ? t(era.nameKey) : '';
                return (
                  <div
                    key={e.id}
                    className="border-b border-[var(--color-hairline-soft)] px-3 py-2 last:border-0"
                  >
                    <div className="text-xs text-[var(--text-muted)]">
                      {formatYear(e.year, currentLocale)} {eraName ? `· ${eraName}` : ''}
                    </div>
                    <div className="mt-0.5 text-sm font-medium text-[var(--text-primary)]">
                      {t(e.titleKey)}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-sm text-[var(--text-muted)]">{t('ui.noEvents')}</div>
            )}
            {otherEraEvents.length > 0 && (
              <>
                <div className="border-t border-[var(--color-hairline)] bg-[var(--color-surface-soft)] px-3 py-2">
                  <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                    {t('ui.compare')} ({otherEraEvents.length})
                  </span>
                </div>
                {otherEraEvents.slice(0, 20).map((e) => {
                  const era = activeEras.find((era) => era.id === e.entityId);
                  const eraName = era ? t(era.nameKey) : '';
                  return (
                    <div
                      key={e.id}
                      className="border-b border-[var(--color-hairline-soft)] px-3 py-2 last:border-0"
                    >
                      <div className="text-xs text-[var(--text-muted)]">
                        {formatYear(e.year, currentLocale)} {eraName ? `· ${eraName}` : ''}
                      </div>
                      <div className="mt-0.5 text-sm text-[var(--text-secondary)]">{t(e.titleKey)}</div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Ruler detail */}
          {selectedRuler ? (
            <div className="shrink-0 border-t border-[var(--color-hairline)] p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-[var(--text-primary)]">{t(selectedRuler.nameKey)}</span>
                    {selectedRuler.eraNameKey && (
                      <span className="text-xs px-1.5 py-0.5 rounded-[var(--rounded-full)] bg-[var(--color-block-cream)] text-[var(--color-ink)]">
                        {tEra(selectedRuler.eraNameKey)}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-xs text-[var(--text-muted)]">
                    {formatYear(selectedRuler.startYear, currentLocale)}–{formatYear(selectedRuler.endYear, currentLocale)}
                  </div>
                </div>
                <button
                  type="button"
                  className="shrink-0 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  onClick={() => setSelectedRulerId(null)}
                >
                  ✕
                </button>
              </div>
              {selectedRuler.highlightKey && (
                <div className="mt-2 text-xs text-[var(--text-secondary)]">{t(selectedRuler.highlightKey)}</div>
              )}
              {selectedRuler.bioKey && (
                <div className="mt-2 text-xs text-[var(--text-muted)]">{t(selectedRuler.bioKey)}</div>
              )}
              <RulerRelations
                ruler={selectedRuler}
                allRulers={activeRulers}
                onRulerClick={(id) => setSelectedRulerId(id)}
              />
            </div>
          ) : (
            <div className="shrink-0 border-t border-[var(--color-hairline)] p-3 text-xs text-[var(--text-muted)]">{t('ui.seedNote')}</div>
          )}
        </aside>
      </div>

      {/* Mobile: Bottom Navigation */}
      <BottomNav locale={currentLocale} />

      {/* Mobile: Era Drawer */}
      <EraDrawer
        isOpen={eraDrawerOpen}
        onClose={() => setEraDrawerOpen(false)}
        activeEras={activeEras}
        activeRulers={activeRulers}
        openEraIds={openEraIds}
        selectedRulerId={selectedRulerId}
        onToggleEra={toggleEra}
        onSelectRuler={setSelectedRulerId}
        locale={currentLocale}
      />

      {/* Mobile: Events Drawer */}
      <EventsDrawer
        isOpen={eventsDrawerOpen}
        onClose={() => setEventsDrawerOpen(false)}
        currentEraEvents={currentEraEvents}
        otherEraEvents={otherEraEvents}
        activeEras={activeEras}
        locale={currentLocale}
      />
    </div>
  );
}
