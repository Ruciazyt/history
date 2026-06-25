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
import { RulerList } from '@/components/HistoryApp/RulerList';

import { worldComparisonEra, eastAsiaComparisonEra } from '@/lib/history/data/worldEras';
import { worldComparisonRulers, eastAsiaRulers } from '@/lib/history/data/worldRulers';
import { getWorldEraBounds, getActiveBoundaries } from '@/lib/history/data/worldBoundaries';

function rangeLabel(centerYear: number, windowYears: number, locale: string) {
  const half = Math.floor(windowYears / 2);
  const from = centerYear - half;
  const to = centerYear + half;
  return `${formatYear(from, locale)} → ${formatYear(to, locale)}`;
}

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
  const { C } = useHistoryAppColors();

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

  const [battleOfDayCollapsed, setBattleOfDayCollapsed] = React.useState(false);
  const [windowYears, setWindowYears] = React.useState<number>(50);
  const [year, setYear] = React.useState<number>(clamp(-350, min, max));

  const timelineMin = selectedRuler?.startYear ?? selectedEra?.startYear ?? min;
  const timelineMax = selectedRuler?.endYear ?? selectedEra?.endYear ?? max;

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
    const merged = [...currentEraEvents, ...otherEraEvents];
    const byId = new Map<string, Event>();
    for (const e of merged) byId.set(e.id, e);
    return [...byId.values()];
  }, [currentEraEvents, otherEraEvents]);

  return (
    <div className="flex h-screen flex-col bg-[var(--color-canvas)] text-[var(--color-ink)]">
      {/* Header - DESIGN.md top-nav style: 56px height, white background */}
      <header className="shrink-0 h-[56px] border-b border-[var(--color-hairline)] bg-[var(--color-canvas)]">
        <div className="flex h-full w-full items-center justify-between px-4 lg:px-6">
          {/* Left: hamburger (mobile) + title */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setEraDrawerOpen(true)}
              className="rounded-[var(--rounded-md)] p-2 hover:bg-[var(--color-surface-soft)] transition-colors lg:hidden"
              style={{ minWidth: '44px', minHeight: '44px' }}
              aria-label={t('ui.openEraMenu')}
            >
              <span className="text-lg">☰</span>
            </button>
            <div className="flex-1 min-w-0">
              <div className="text-caption text-[var(--text-muted)] truncate">{t('app.title')}</div>
              <h1 className="text-body-sm font-medium truncate">{t('app.subtitle')}</h1>
            </div>
          </div>

          {/* Right: controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setEventsDrawerOpen(true)}
              className="btn-circle lg:hidden"
              aria-label={t('ui.openEventsList')}
            >
              📋
            </button>
            <div className="hidden lg:flex items-center gap-2">
              <ThemeToggle />
              <SearchBox events={events} rulers={rulers} locale={currentLocale} />
              <LocaleSwitcher />
            </div>
            <div className="flex lg:hidden items-center gap-1">
              <ThemeToggle />
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Sub-header: civ switcher + era info + quick links */}
      <div className="shrink-0 border-b border-[var(--color-hairline)] bg-[var(--color-canvas)]">
        <div className="overflow-x-auto scrollbar-hide py-2 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Civilization switcher - pill toggle */}
            <div className="flex rounded-[var(--rounded-pill)] bg-[var(--color-surface-soft)] p-1 text-sm shrink-0">
              <button
                type="button"
                onClick={() => switchCiv('china')}
                className={`rounded-[var(--rounded-pill)] px-3 py-1 transition-colors whitespace-nowrap ${
                  civMode === 'china'
                    ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] font-medium'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                🏛️ {t('app.civModeChina')}
              </button>
            </div>

            {/* Era info */}
            <div className="text-body-sm text-[var(--text-secondary)] hidden sm:block">
              <span className="font-medium">{selectedEra ? t(selectedEra.nameKey) : ''}</span>
              <span className="mx-2 text-[var(--divider)]">|</span>
              <span>
                {selectedEra ? `${formatYear(selectedEra.startYear, currentLocale)}–${formatYear(selectedEra.endYear, currentLocale)}` : ''}
              </span>
            </div>

            {/* Quick links - using DESIGN.md color blocks */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <Link
                href={`/${currentLocale}/matrix`}
                className="btn-pill bg-[var(--color-block-lime)] text-[var(--color-ink)] text-sm"
              >
                ⊞ <span className="hidden sm:inline">{t('matrix.title')}</span>
              </Link>
              <Link
                href={`/${currentLocale}/battles`}
                className="btn-pill bg-[var(--color-block-pink)] text-[var(--color-ink)] text-sm"
              >
                ⚔️ <span className="hidden sm:inline">{t('nav.battles')}</span>
              </Link>
              <Link
                href={`/${currentLocale}/world`}
                className="btn-pill bg-[var(--color-block-lilac)] text-[var(--color-ink)] text-sm"
              >
                🌍 <span className="hidden sm:inline">{t('world.title')}</span>
              </Link>
              <Link
                href={`/${currentLocale}/place-names`}
                className="btn-pill bg-[var(--color-block-mint)] text-[var(--color-ink)] text-sm"
              >
                🏛️ <span className="hidden sm:inline">{t('placeNames.title')}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex w-full flex-1 flex-col overflow-hidden px-4 py-4 pb-[72px] lg:pb-4">
        <div className="grid h-full grid-cols-1 gap-4 overflow-hidden lg:grid-cols-[320px_minmax(0,1fr)_180px] xl:grid-cols-[320px_minmax(0,1fr)_200px]">
          {/* Left: era sidebar - DESIGN.md card style */}
          <aside className="hidden lg:flex max-h-full flex-col overflow-hidden rounded-[var(--rounded-lg)] border border-[var(--color-hairline)] bg-[var(--color-canvas)]">
            <div className="shrink-0 border-b border-[var(--color-hairline)] p-3">
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <div className="text-eyebrow text-[var(--text-muted)]">{t('ui.eras')}</div>
                </div>
              </div>
            </div>
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
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-[var(--color-surface-soft)] transition-colors"
                    >
                      <span className={`w-2 h-2 rounded-full shrink-0 ${eraColor.dot}`}></span>
                      <span className={`flex-1 font-semibold ${eraColor.text} text-sm`}>
                        {t(era.nameKey)}
                        {era.isParallelPolities && <span className="text-xs ml-1 text-[var(--text-muted)]">（{t('ui.parallelPolities')}）</span>}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] hidden sm:inline">
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
                      sidebarColors={C.sidebar}
                    />
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Center: map + time controls */}
          <section className="flex min-h-0 flex-col gap-3 overflow-hidden">
            {/* Timeline controls - DESIGN.md card style */}
            <div className="shrink-0 rounded-[var(--rounded-lg)] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="text-eyebrow text-[var(--text-muted)]">{t('ui.timeline')}</div>
                  <div className="text-body-sm text-[var(--text-primary)]">
                    <span className="font-semibold">{formatYear(year, currentLocale)}</span>
                    <span className="mx-2 text-[var(--divider)]">|</span>
                    <span className="hidden sm:inline">{t('ui.window.label')}: </span>
                    <span className="font-semibold">{t('ui.window.years', { count: windowYears })}</span>
                    <span className="mx-2 text-[var(--divider)] hidden sm:inline">|</span>
                    <span className="text-[var(--text-secondary)] hidden sm:inline">{rangeLabel(year, windowYears, currentLocale)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {[10, 50, 100].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setWindowYears(w)}
                      className={`rounded-[var(--rounded-pill)] px-3 py-1 text-sm font-medium transition-colors ${
                        windowYears === w
                          ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                          : 'bg-[var(--color-surface-soft)] text-[var(--text-secondary)] hover:bg-[var(--color-hairline)]'
                      }`}
                    >
                      {w}年
                    </button>
                  ))}
                  <div className="flex items-center gap-1 border-l border-[var(--color-hairline)] pl-2 ml-1">
                    <button
                      type="button"
                      onClick={() => setYear((y) => y - windowYears)}
                      disabled={year - windowYears < timelineMin}
                      className="rounded-[var(--rounded-md)] p-1.5 bg-[var(--color-surface-soft)] text-[var(--text-secondary)] hover:bg-[var(--color-hairline)] disabled:opacity-50"
                    >
                      ◀
                    </button>
                    <button
                      type="button"
                      onClick={() => setYear((y) => y + windowYears)}
                      disabled={year + windowYears > timelineMax}
                      className="rounded-[var(--rounded-md)] p-1.5 bg-[var(--color-surface-soft)] text-[var(--text-secondary)] hover:bg-[var(--color-hairline)] disabled:opacity-50"
                    >
                      ▶
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Battle of the Day - color block section */}
            {!battleOfDayCollapsed && (
              <div className="shrink-0">
                <BattleOfTheDayCard events={events} />
              </div>
            )}
            <button
              type="button"
              onClick={() => setBattleOfDayCollapsed((v) => !v)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs rounded-[var(--rounded-md)] hover:bg-[var(--color-surface-soft)] transition-colors"
            >
              <span className="opacity-60">{battleOfDayCollapsed ? '📅' : '▲'}</span>
              <span className="text-[var(--text-muted)]">{battleOfDayCollapsed ? t('battleOfTheDay.expand') : t('battleOfTheDay.collapse')}</span>
            </button>

            {/* Map container - DESIGN.md card style */}
            <div className="flex-1 min-h-0 rounded-[var(--rounded-lg)] border border-[var(--color-hairline)] bg-[var(--color-canvas)] overflow-hidden">
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
          </section>

          {/* Right: events sidebar - DESIGN.md card style */}
          <aside className="hidden lg:flex max-h-full flex-col overflow-hidden rounded-[var(--rounded-lg)] border border-[var(--color-hairline)] bg-[var(--color-canvas)]">
            <div className="shrink-0 border-b border-[var(--color-hairline)] p-3">
              <div className="text-eyebrow text-[var(--text-muted)]">
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
                      className="border-b border-[var(--color-hairline-soft)] px-3 py-2 last:border-0"
                    >
                      <div className="text-caption text-[var(--text-muted)]">
                        {formatYear(e.year, currentLocale)} {eraName ? `· ${eraName}` : ''}
                      </div>
                      <div className="mt-0.5 text-body-sm font-medium text-[var(--text-primary)]">
                        {t(e.titleKey)}
                      </div>
                      {e.tags && e.tags.includes('war') && (
                        <div className="mt-1 inline-flex items-center gap-1 rounded-[var(--rounded-full)] px-2 py-0.5 text-caption bg-[var(--color-block-pink)] text-[var(--color-ink)]">
                          ⚔️ {t('nav.battles')}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-body-sm text-[var(--text-muted)]">{t('ui.noEvents')}</div>
              )}
              {otherEraEvents.length > 0 && (
                <>
                  <div className="border-t border-[var(--color-hairline)] bg-[var(--color-surface-soft)] px-3 py-2">
                    <div className="text-eyebrow text-[var(--text-muted)]">
                      {t('ui.compare')} ({otherEraEvents.length})
                    </div>
                  </div>
                  {otherEraEvents.slice(0, 20).map((e) => {
                    const era = activeEras.find((era) => era.id === e.entityId);
                    const eraName = era ? t(era.nameKey) : '';
                    return (
                      <div
                        key={e.id}
                        className="border-b border-[var(--color-hairline-soft)] px-3 py-2 last:border-0"
                      >
                        <div className="text-caption text-[var(--text-muted)]">
                          {formatYear(e.year, currentLocale)} {eraName ? `· ${eraName}` : ''}
                        </div>
                        <div className="mt-0.5 text-body-sm text-[var(--text-secondary)]">{t(e.titleKey)}</div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Ruler detail inline */}
            {selectedRuler ? (
              <div className="shrink-0 border-t border-[var(--color-hairline)] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-eyebrow text-[var(--text-muted)]">{t('ui.rulerDetail')}</div>
                    <div className="mt-1 flex items-center gap-2 flex-wrap">
                      <span className="truncate text-body-sm font-semibold text-[var(--text-primary)]">{t(selectedRuler.nameKey)}</span>
                      {selectedRuler.eraNameKey && (
                        <span className="text-caption px-2 py-0.5 rounded-[var(--rounded-full)] bg-[var(--color-block-cream)] text-[var(--color-ink)]">
                          {tEra(selectedRuler.eraNameKey)}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-caption text-[var(--text-muted)]">
                      {formatYear(selectedRuler.startYear, currentLocale)}–{formatYear(selectedRuler.endYear, currentLocale)}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 rounded-[var(--rounded-pill)] border border-[var(--color-hairline)] bg-[var(--color-canvas)] px-3 py-1 text-caption text-[var(--text-secondary)] hover:bg-[var(--color-surface-soft)]"
                    onClick={() => setSelectedRulerId(null)}
                  >
                    {t('ui.clearRuler')}
                  </button>
                </div>
                {selectedRuler.highlightKey ? (
                  <div className="mt-2 text-body-sm text-[var(--text-secondary)]">{t(selectedRuler.highlightKey)}</div>
                ) : null}
                {selectedRuler.bioKey ? (
                  <div className="mt-2 text-body-sm text-[var(--text-muted)]">{t(selectedRuler.bioKey)}</div>
                ) : null}
                <RulerRelations
                  ruler={selectedRuler}
                  allRulers={activeRulers}
                  onRulerClick={(id) => setSelectedRulerId(id)}
                />
              </div>
            ) : (
              <div className="shrink-0 border-t border-[var(--color-hairline)] p-3 text-caption text-[var(--text-muted)]">{t('ui.seedNote')}</div>
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
        locale={currentLocale}
      />

      {/* Mobile: Events Drawer (right side) */}
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
