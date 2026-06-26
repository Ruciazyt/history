'use client';

import * as React from 'react';

import type { Era, Event, Ruler } from '@/lib/history/types';
import { clamp } from '@/lib/history/utils';
import { BottomNav } from '@/components/common/BottomNav';
import { EraDrawer } from '@/components/common/EraDrawer';
import { EventsDrawer } from '@/components/common/EventsDrawer';
import { useTranslations } from 'next-intl';
import { HistoryAppHeader } from '@/components/HistoryApp/Header';
import { EraSidebar } from '@/components/HistoryApp/EraSidebar';
import { HistoryAppMap } from '@/components/HistoryApp/HistoryAppMap';
import { RulerDetailPanel } from '@/components/HistoryApp/RulerDetailPanel';
import { PRE_QIN_GROUP_ID } from '@/components/HistoryApp/eraGroups';

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
  const currentLocale = locale || 'zh';

  const activeEras = eras;
  const activeRulers = rulers;

  const { min, max } = React.useMemo(() => yearBounds(activeEras), [activeEras]);

  const [openGroupIds, setOpenGroupIds] = React.useState<Set<string>>(() => new Set([PRE_QIN_GROUP_ID]));
  const [openEraIds, setOpenEraIds] = React.useState<Set<string>>(() => new Set(['period-warring-states']));
  const [openPolityIds, setOpenPolityIds] = React.useState<Set<string>>(() => new Set(['ws-qin']));

  const toggleGroup = React.useCallback((id: string) => {
    setOpenGroupIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleEra = React.useCallback((id: string) => {
    setOpenEraIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const togglePolity = React.useCallback((id: string) => {
    setOpenPolityIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const [selectedRulerId, setSelectedRulerId] = React.useState<string | null>('ws-qin-zhaoxiang');

  const [eraDrawerOpen, setEraDrawerOpen] = React.useState(false);
  const [eventsDrawerOpen, setEventsDrawerOpen] = React.useState(false);

  const selectedRuler = React.useMemo(
    () => (selectedRulerId ? activeRulers.find((r) => r.id === selectedRulerId) ?? null : null),
    [activeRulers, selectedRulerId]
  );

  const selectedEra = React.useMemo(() => {
    if (selectedRulerId) {
      const ruler = activeRulers.find((r) => r.id === selectedRulerId);
      if (ruler) return activeEras.find((e) => e.id === ruler.eraId) ?? activeEras[0];
    }
    const firstOpen = activeEras.find((e) => openEraIds.has(e.id));
    return firstOpen ?? activeEras[0];
  }, [activeEras, activeRulers, selectedRulerId, openEraIds]);

  const windowYears = 50;
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

  return (
    <div className="relative h-screen overflow-hidden text-[var(--color-ink)]">
      {/* 地图铺满整屏 */}
      <HistoryAppMap
        events={currentEraEvents}
        year={year}
        openPolityIds={openPolityIds}
        selectedRuler={selectedRuler}
      />

      {/* Header + 侧栏浮在地图之上 */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <HistoryAppHeader
          className="pointer-events-auto absolute top-[var(--layout-figma-page-inset-y)] left-[var(--layout-figma-header-inset-x)] right-[var(--layout-figma-header-inset-x)]"
          onOpenMobileMenu={() => setEraDrawerOpen(true)}
          openEraMenuLabel={t('ui.openEraMenu')}
        />

        <EraSidebar
          className="pointer-events-auto absolute top-[var(--layout-figma-sidebar-top)] left-[var(--layout-figma-page-inset-x)] bottom-[var(--layout-figma-sidebar-bottom)] w-[var(--layout-figma-sidebar-left-width)]"
          activeEras={activeEras}
          activeRulers={activeRulers}
          openEraIds={openEraIds}
          openGroupIds={openGroupIds}
          openPolityIds={openPolityIds}
          selectedRulerId={selectedRulerId}
          onToggleEra={toggleEra}
          onToggleGroup={toggleGroup}
          onTogglePolity={togglePolity}
          onSelectRuler={setSelectedRulerId}
          locale={currentLocale}
        />

        <RulerDetailPanel
          className="pointer-events-auto absolute top-[var(--layout-figma-sidebar-top)] right-[var(--layout-figma-sidebar-right-inset)] bottom-[var(--layout-figma-sidebar-bottom)] w-[var(--layout-figma-sidebar-right-width)]"
          selectedRuler={selectedRuler}
          currentEraEvents={currentEraEvents}
          activeEras={activeEras}
          locale={currentLocale}
        />
      </div>

      <BottomNav locale={currentLocale} />

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
