'use client';

import * as React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

import { timelineProcesses, type TimelineProcess } from '@/lib/history/data/timeline';
import { formatYear } from '@/lib/history/utils';
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from '@/components/common/LocaleSwitcher';

const TimelineMap = dynamic(
  () => import('@/components/timeline/TimelineMap').then((m) => m.TimelineMap),
  { ssr: false }
);

export function TimelineClient({ locale }: { locale: string }) {
  const t = useTranslations();
  const searchParams = useSearchParams();

  const defaultProcess = timelineProcesses[0];
  const [selectedProcess, setSelectedProcess] = React.useState<TimelineProcess>(defaultProcess!);
  const [currentEventIndex, setCurrentEventIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const currentEvent = selectedProcess.events[currentEventIndex];

  React.useEffect(() => {
    const processId = searchParams.get('process');
    const eventId = searchParams.get('event');
    if (!processId) return;

    const process = timelineProcesses.find((p) => p.id === processId);
    if (!process) return;

    setSelectedProcess(process);

    if (eventId) {
      const idx = process.events.findIndex((e) => e.id === eventId);
      if (idx >= 0) setCurrentEventIndex(idx);
      else setCurrentEventIndex(0);
    } else {
      setCurrentEventIndex(0);
    }

    setIsPlaying(false);
  }, [searchParams]);

  React.useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentEventIndex((prev) => {
        if (prev < selectedProcess.events.length - 1) return prev + 1;
        setIsPlaying(false);
        return prev;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying, selectedProcess.events.length]);

  const goToEvent = (index: number) => {
    setCurrentEventIndex(index);
    setIsPlaying(false);
  };

  const nextEvent = () => {
    if (currentEventIndex < selectedProcess.events.length - 1) setCurrentEventIndex((p) => p + 1);
  };

  const prevEvent = () => {
    if (currentEventIndex > 0) setCurrentEventIndex((p) => p - 1);
  };

  const [mobileView, setMobileView] = React.useState<'list' | 'detail'>('list');

  return (
    <div className="min-h-screen bg-[var(--color-inverse-canvas)] text-[var(--color-inverse-ink)] flex flex-col">
      {/* Header - DESIGN.md style */}
      <header className="flex items-center justify-between px-4 py-3 bg-[var(--color-inverse-canvas)] border-b border-[var(--color-hairline)] shrink-0 h-[56px]">
        <div className="flex items-center gap-3">
          <Link href={`/${locale}`} className="text-body-sm text-[var(--text-muted)] hover:text-[var(--color-inverse-ink)] transition-colors">
            ← {t('timeline.back')}
          </Link>
          <h1 className="text-body font-medium truncate">{t('timeline.title')}</h1>
        </div>
        <LocaleSwitcher />
      </header>

      {/* Mobile tab switcher */}
      <div className="flex lg:hidden bg-[var(--color-inverse-canvas)] border-b border-[var(--color-hairline)] shrink-0">
        <button
          onClick={() => setMobileView('list')}
          className={`flex-1 py-2 text-body-sm font-medium border-b-2 transition-colors ${
            mobileView === 'list' ? 'border-[var(--color-on-primary)] text-[var(--color-inverse-ink)]' : 'border-transparent text-[var(--text-muted)]'
          }`}
        >
          📋 {t('timeline.eventList')}
        </button>
        <button
          onClick={() => setMobileView('detail')}
          className={`flex-1 py-2 text-body-sm font-medium border-b-2 transition-colors ${
            mobileView === 'detail' ? 'border-[var(--color-on-primary)] text-[var(--color-inverse-ink)]' : 'border-transparent text-[var(--text-muted)]'
          }`}
        >
          🗺️ {t('timeline.mapDetail')}
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: event list */}
        <div className={`flex lg:flex w-full lg:w-80 xl:w-96 flex-col bg-[var(--color-inverse-canvas)] border-r border-[var(--color-hairline)] ${mobileView === 'detail' ? 'hidden lg:flex' : ''}`}>
          <div className="p-4 border-b border-[var(--color-hairline)]">
            <label className="text-body-sm text-[var(--text-muted)] mb-2 block">{t('timeline.selectProcess')}</label>
            <select
              value={selectedProcess.id}
              onChange={(e) => {
                const process = timelineProcesses.find((p) => p.id === e.target.value);
                if (process) {
                  setSelectedProcess(process);
                  setCurrentEventIndex(0);
                }
              }}
              className="w-full bg-[var(--color-inverse-canvas)] text-[var(--color-inverse-ink)] px-3 py-2 rounded-[var(--rounded-md)] border border-[var(--color-hairline)] focus:outline-none text-body-sm"
            >
              {timelineProcesses.map((process) => (
                <option key={process.id} value={process.id}>
                  {t(process.nameKey)}
                </option>
              ))}
            </select>
            <p className="text-body-sm text-[var(--text-muted)] mt-2 line-clamp-2">{t(selectedProcess.descriptionKey)}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {selectedProcess.events.map((event, index) => (
              <button
                key={event.id}
                onClick={() => {
                  goToEvent(index);
                  if (window.innerWidth < 1024) setMobileView('detail');
                }}
                className={`w-full text-left p-3 rounded-[var(--rounded-lg)] border transition-all ${
                  index === currentEventIndex
                    ? 'bg-[var(--color-inverse-canvas)] border-[var(--color-on-primary)]'
                    : 'bg-[var(--color-inverse-canvas)]/50 border-[var(--color-hairline)] hover:border-[var(--text-muted)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-body-lg font-bold shrink-0 ${index === currentEventIndex ? 'text-[var(--color-on-primary)]' : 'text-[var(--text-muted)]'}`}>
                    {formatYear(event.year, locale)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-body-sm truncate">{t(event.titleKey)}</p>
                    <p className="text-caption text-[var(--text-muted)] truncate">{t(event.location.nameKey)}</p>
                  </div>
                  {index === currentEventIndex && <span className="w-2 h-2 bg-[var(--color-on-primary)] rounded-full animate-pulse shrink-0" />}
                </div>
              </button>
            ))}
          </div>

          {/* Playback controls */}
          <div className="p-4 border-t border-[var(--color-hairline)]">
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={prevEvent}
                disabled={currentEventIndex === 0}
                className="btn-pill bg-[var(--color-inverse-canvas)] text-[var(--text-muted)] hover:text-[var(--color-inverse-ink)] disabled:opacity-50 disabled:cursor-not-allowed text-sm px-3 py-1"
              >
                ◀
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`btn-pill font-medium text-sm px-4 py-1 ${isPlaying ? 'bg-[var(--color-accent-magenta)] text-[var(--color-on-primary)]' : 'bg-[var(--color-on-primary)] text-[var(--color-inverse-canvas)]'}`}
              >
                {isPlaying ? '⏸' : '▶'} {isPlaying ? t('timeline.pause') : t('timeline.play')}
              </button>
              <button
                onClick={nextEvent}
                disabled={currentEventIndex === selectedProcess.events.length - 1}
                className="btn-pill bg-[var(--color-inverse-canvas)] text-[var(--text-muted)] hover:text-[var(--color-inverse-ink)] disabled:opacity-50 disabled:cursor-not-allowed text-sm px-3 py-1"
              >
                ▶
              </button>
            </div>
            <p className="text-center text-body-sm text-[var(--text-muted)] mt-2">
              {currentEventIndex + 1} / {selectedProcess.events.length}
            </p>
          </div>
        </div>

        {/* Right: detail and map */}
        <div className={`flex-1 flex flex-col overflow-hidden ${mobileView === 'list' ? 'hidden lg:flex' : ''}`}>
          {/* Event detail */}
          {currentEvent && (
            <div className="mx-4 mt-4 bg-[var(--color-inverse-canvas)] rounded-[var(--rounded-lg)] p-4 border border-[var(--color-hairline)] max-h-[30vh] sm:max-h-40 overflow-y-auto shrink-0">
              <h2 className="text-body font-bold mb-2">{t(currentEvent.titleKey)}</h2>
              <p className="text-body-sm text-[var(--text-muted)] mb-2">{t(currentEvent.descriptionKey)}</p>
              <div className="flex items-center gap-3 text-caption flex-wrap">
                <span className="text-[var(--text-muted)]">📍 {t(currentEvent.location.nameKey)}</span>
                {currentEvent.factions && (
                  <div className="flex gap-2 flex-wrap">
                    {currentEvent.factions.map((faction, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-[var(--rounded-full)] text-caption text-white" style={{ backgroundColor: faction.color }}>
                        {t(faction.nameKey)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Map */}
          <div className="flex-1 p-4 min-h-0">
            <TimelineMap event={currentEvent ?? null} />
          </div>
        </div>
      </div>
    </div>
  );
}
