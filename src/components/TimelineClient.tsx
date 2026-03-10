'use client';

import * as React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

import { timelineProcesses, type TimelineProcess } from '@/lib/history/data/timeline';
import { formatYear } from '@/lib/history/utils';
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';

const TimelineMap = dynamic(
  () => import('@/components/TimelineMap').then((m) => m.TimelineMap),
  { ssr: false }
);

export function TimelineClient({ locale }: { locale: string }) {
  const t = useTranslations();
  const searchParams = useSearchParams();

  const [selectedProcess, setSelectedProcess] = React.useState<TimelineProcess>(timelineProcesses[0]);
  const [currentEventIndex, setCurrentEventIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const currentEvent = selectedProcess.events[currentEventIndex];

  // 支持从主页面通过 query 跳转定位到特定进程/事件
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
    // 仅在首次加载/参数变化时生效
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

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <header className="flex items-center justify-between px-6 py-4 bg-zinc-800 border-b border-zinc-700">
        <div className="flex items-center gap-4">
          <Link href={`/${locale}`} className="text-zinc-400 hover:text-white transition-colors">
            ← 返回
          </Link>
          <h1 className="text-xl font-bold">{t('timeline.title')}</h1>
        </div>
        <LocaleSwitcher />
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        <div className="w-96 flex flex-col bg-zinc-800 border-r border-zinc-700">
          <div className="p-4 border-b border-zinc-700">
            <label className="text-sm text-zinc-400 mb-2 block">{t('timeline.selectProcess')}</label>
            <select
              value={selectedProcess.id}
              onChange={(e) => {
                const process = timelineProcesses.find((p) => p.id === e.target.value);
                if (process) {
                  setSelectedProcess(process);
                  setCurrentEventIndex(0);
                }
              }}
              className="w-full bg-zinc-700 text-white px-3 py-2 rounded-lg border border-zinc-600 focus:outline-none focus:border-zinc-500"
            >
              {timelineProcesses.map((process) => (
                <option key={process.id} value={process.id}>
                  {t(process.nameKey)}
                </option>
              ))}
            </select>
            <p className="text-sm text-zinc-400 mt-2">{t(selectedProcess.descriptionKey)}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {selectedProcess.events.map((event, index) => (
              <button
                key={event.id}
                onClick={() => goToEvent(index)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  index === currentEventIndex
                    ? 'bg-zinc-700 border-red-500'
                    : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${index === currentEventIndex ? 'text-red-400' : 'text-zinc-500'}`}>
                    {formatYear(event.year)}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{t(event.titleKey)}</p>
                    <p className="text-xs text-zinc-400">{t(event.location.nameKey)}</p>
                  </div>
                  {index === currentEventIndex && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                </div>
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-zinc-700">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={prevEvent}
                disabled={currentEventIndex === 0}
                className="px-4 py-2 bg-zinc-700 rounded-lg hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ◀
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-6 py-2 rounded-lg font-medium ${isPlaying ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'}`}
              >
                {isPlaying ? '⏸' : '▶'} {isPlaying ? t('timeline.pause') : t('timeline.play')}
              </button>
              <button
                onClick={nextEvent}
                disabled={currentEventIndex === selectedProcess.events.length - 1}
                className="px-4 py-2 bg-zinc-700 rounded-lg hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ▶
              </button>
            </div>
            <p className="text-center text-sm text-zinc-400 mt-2">
              {currentEventIndex + 1} / {selectedProcess.events.length}
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {/* 事件详情 - 放在地图上方 */}
          {currentEvent && (
            <div className="mx-4 mt-4 bg-zinc-800 rounded-lg p-4 border border-zinc-700 max-h-40 overflow-y-auto">
              <h2 className="text-lg font-bold mb-2">{t(currentEvent.titleKey)}</h2>
              <p className="text-zinc-300 mb-2 text-sm">{t(currentEvent.descriptionKey)}</p>
              <div className="flex items-center gap-4 text-sm flex-wrap">
                <span className="text-zinc-400">📍 {t(currentEvent.location.nameKey)}</span>
                {currentEvent.factions && (
                  <div className="flex gap-2 flex-wrap">
                    {currentEvent.factions.map((faction, i) => (
                      <span key={i} className="px-2 py-1 rounded text-xs text-white" style={{ backgroundColor: faction.color }}>
                        {t(faction.nameKey)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 地图 */}
          <div className="flex-1 p-4">
            <TimelineMap event={currentEvent} />
          </div>
        </div>
      </div>
    </div>
  );
}
