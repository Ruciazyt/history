'use client';

import * as React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

import { timelineProcesses, type TimelineProcess } from '@/lib/history/data/timeline';
import { formatYear } from '@/lib/history/utils';
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from '@/components/common/LocaleSwitcher';
import { TIMELINE_COLORS, TIMELINE_BUTTON_COLORS, TIMELINE_EVENT_COLORS, TIMELINE_TAB_COLORS, TIMELINE_ITEM_COLORS } from '@/lib/history/constants';

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

  // 移动端视图切换状态
  const [mobileView, setMobileView] = React.useState<'list' | 'detail'>('list');

  return (
    <div className={`min-h-screen ${TIMELINE_COLORS.background} ${TIMELINE_COLORS.text} flex flex-col`}>
      {/* Header - 移动端简化 */}
      <header className={`flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 ${TIMELINE_COLORS.surface} border-b ${TIMELINE_COLORS.border} shrink-0`}>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href={`/${locale}`} className={`${TIMELINE_COLORS.textSecondary} hover:${TIMELINE_COLORS.text} transition-colors text-sm sm:text-base`}>
            ← {t('timeline.back')}
          </Link>
          <h1 className="text-base sm:text-xl font-bold truncate">{t('timeline.title')}</h1>
        </div>
        <LocaleSwitcher />
      </header>

      {/* 移动端标签切换 */}
      <div className={`flex lg:hidden ${TIMELINE_COLORS.surface} border-b ${TIMELINE_COLORS.border} shrink-0`}>
        <button
          onClick={() => setMobileView('list')}
          className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
            mobileView === 'list' ? `${TIMELINE_TAB_COLORS.active.border} ${TIMELINE_TAB_COLORS.active.text}` : `${TIMELINE_TAB_COLORS.inactive.border} ${TIMELINE_TAB_COLORS.inactive.text}`
          }`}
        >
          📋 {t('timeline.eventList')}
        </button>
        <button
          onClick={() => setMobileView('detail')}
          className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
            mobileView === 'detail' ? `${TIMELINE_TAB_COLORS.active.border} ${TIMELINE_TAB_COLORS.active.text}` : `${TIMELINE_TAB_COLORS.inactive.border} ${TIMELINE_TAB_COLORS.inactive.text}`
          }`}
        >
          🗺️ {t('timeline.mapDetail')}
        </button>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* 左侧：事件列表 - 移动端可切换显示 */}
        <div className={`flex lg:flex w-full lg:w-80 xl:w-96 flex-col ${TIMELINE_COLORS.surface} border-r ${TIMELINE_COLORS.border} ${mobileView === 'detail' ? 'hidden lg:flex' : ''}`}>
          <div className={`p-3 sm:p-4 border-b ${TIMELINE_COLORS.border}`}>
            <label className={`text-sm ${TIMELINE_COLORS.textSecondary} mb-2 block`}>{t('timeline.selectProcess')}</label>
            <select
              value={selectedProcess.id}
              onChange={(e) => {
                const process = timelineProcesses.find((p) => p.id === e.target.value);
                if (process) {
                  setSelectedProcess(process);
                  setCurrentEventIndex(0);
                }
              }}
              className={`w-full ${TIMELINE_BUTTON_COLORS.inactive.bg} ${TIMELINE_BUTTON_COLORS.inactive.text} px-3 py-2 rounded-lg border ${TIMELINE_BUTTON_COLORS.inactive.border} focus:outline-none ${TIMELINE_BUTTON_COLORS.inactive.hover} text-sm`}
            >
              {timelineProcesses.map((process) => (
                <option key={process.id} value={process.id}>
                  {t(process.nameKey)}
                </option>
              ))}
            </select>
            <p className={`text-xs sm:text-sm ${TIMELINE_COLORS.textSecondary} mt-2 line-clamp-2`}>{t(selectedProcess.descriptionKey)}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2">
            {selectedProcess.events.map((event, index) => (
              <button
                key={event.id}
                onClick={() => {
                  goToEvent(index);
                  // 移动端点击后切换到详情视图
                  if (window.innerWidth < 1024) setMobileView('detail');
                }}
                className={`w-full text-left p-2 sm:p-3 rounded-lg border transition-all ${
                  index === currentEventIndex
                    ? `${TIMELINE_COLORS.surface} ${TIMELINE_EVENT_COLORS.border.active}`
                    : `${TIMELINE_ITEM_COLORS.inactiveBg} ${TIMELINE_EVENT_COLORS.border.inactive} ${TIMELINE_EVENT_COLORS.border.hover}`
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className={`text-sm sm:text-lg font-bold shrink-0 ${index === currentEventIndex ? TIMELINE_EVENT_COLORS.year.active : TIMELINE_EVENT_COLORS.year.inactive}`}>
                    {formatYear(event.year)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">{t(event.titleKey)}</p>
                    <p className={`text-xs ${TIMELINE_EVENT_COLORS.location} truncate`}>{t(event.location.nameKey)}</p>
                  </div>
                  {index === currentEventIndex && <span className={`w-2 h-2 ${TIMELINE_BUTTON_COLORS.active.bg} rounded-full animate-pulse shrink-0`} />}
                </div>
              </button>
            ))}
          </div>

          {/* 播放控制 - 移动端固定在底部 */}
          <div className={`p-3 sm:p-4 border-t ${TIMELINE_COLORS.border}`}>
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              <button
                onClick={prevEvent}
                disabled={currentEventIndex === 0}
                className={`px-3 sm:px-4 py-2 ${TIMELINE_BUTTON_COLORS.inactive.bg} rounded-lg ${TIMELINE_BUTTON_COLORS.inactive.hover} disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base`}
              >
                ◀
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-4 sm:px-6 py-2 rounded-lg font-medium text-sm sm:text-base ${isPlaying ? TIMELINE_BUTTON_COLORS.play.pause : TIMELINE_BUTTON_COLORS.play.play}`}
              >
                {isPlaying ? '⏸' : '▶'} {isPlaying ? t('timeline.pause') : t('timeline.play')}
              </button>
              <button
                onClick={nextEvent}
                disabled={currentEventIndex === selectedProcess.events.length - 1}
                className={`px-3 sm:px-4 py-2 ${TIMELINE_BUTTON_COLORS.inactive.bg} rounded-lg ${TIMELINE_BUTTON_COLORS.inactive.hover} disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base`}
              >
                ▶
              </button>
            </div>
            <p className={`text-center text-xs sm:text-sm ${TIMELINE_COLORS.textSecondary} mt-2`}>
              {currentEventIndex + 1} / {selectedProcess.events.length}
            </p>
          </div>
        </div>

        {/* 右侧：详情和地图 - 移动端可切换显示 */}
        <div className={`flex-1 flex flex-col overflow-hidden ${mobileView === 'list' ? 'hidden lg:flex' : ''}`}>
          {/* 事件详情 */}
          {currentEvent && (
            <div className={`mx-2 sm:mx-4 mt-2 sm:mt-4 ${TIMELINE_COLORS.surface} rounded-lg p-3 sm:p-4 border ${TIMELINE_COLORS.border} max-h-[30vh] sm:max-h-40 overflow-y-auto shrink-0`}>
              <h2 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">{t(currentEvent.titleKey)}</h2>
              <p className={`${TIMELINE_ITEM_COLORS.description} mb-2 text-sm`}>{t(currentEvent.descriptionKey)}</p>
              <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm flex-wrap">
                <span className={TIMELINE_ITEM_COLORS.location}>📍 {t(currentEvent.location.nameKey)}</span>
                {currentEvent.factions && (
                  <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                    {currentEvent.factions.map((faction, i) => (
                      <span key={i} className="px-2 py-0.5 sm:py-1 rounded text-xs text-white" style={{ backgroundColor: faction.color }}>
                        {t(faction.nameKey)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 地图 */}
          <div className="flex-1 p-2 sm:p-4 min-h-0">
            <TimelineMap event={currentEvent ?? null} />
          </div>
        </div>
      </div>
    </div>
  );
}
