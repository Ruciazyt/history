'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { HISTORY_APP_COLORS } from '@/lib/history/constants';

interface TimelineControlsProps {
  civMode: 'china' | 'eurasian' | 'east-asia';
  onCivModeChange: (mode: 'china' | 'eurasian' | 'east-asia') => void;
  year: number;
  onYearChange: (year: number) => void;
  isPlaying: boolean;
  onPlayToggle: () => void;
}

export function TimelineControls({
  civMode,
  onCivModeChange,
  year,
  onYearChange,
  isPlaying,
  onPlayToggle,
}: TimelineControlsProps) {
  const t = useTranslations();

  const quickButtons: Array<{ label: string; year: number }> = [
    { label: '−100', year: year - 100 },
    { label: '−50', year: year - 50 },
    { label: '−10', year: year - 10 },
    { label: '+10', year: year + 10 },
    { label: '+50', year: year + 50 },
    { label: '+100', year: year + 100 },
  ];

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3 py-2 sm:px-4 sm:py-2.5 ${HISTORY_APP_COLORS.timeline.container.bg} ${HISTORY_APP_COLORS.timeline.container.border}`}
    >
      {/* Civilization Mode Tabs */}
      <div className="flex items-center gap-1">
        {(['china', 'eurasian', 'east-asia'] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onCivModeChange(mode)}
            className={`rounded-md px-2 py-1 text-xs sm:text-sm font-medium transition-colors ${
              civMode === mode
                ? `${HISTORY_APP_COLORS.timeline.windowButton.active.bg} ${HISTORY_APP_COLORS.timeline.windowButton.active.text}`
                : `${HISTORY_APP_COLORS.timeline.windowButton.inactive.bg} ${HISTORY_APP_COLORS.timeline.windowButton.inactive.text} ${HISTORY_APP_COLORS.timeline.windowButton.inactive.hover}`
            }`}
          >
            {mode === 'china' ? '中国' : mode === 'eurasian' ? '欧亚' : '东亚'}
          </button>
        ))}
      </div>

      {/* Year display */}
      <div className={`hidden sm:flex items-center gap-2 text-sm ${HISTORY_APP_COLORS.timeline.header.text}`}>
        <span className={`font-bold ${HISTORY_APP_COLORS.timeline.header.year}`}>{year}</span>
        <span className={HISTORY_APP_COLORS.timeline.header.window}>·</span>
        <span className={HISTORY_APP_COLORS.timeline.header.range}>
          ← {Math.abs(year)} {year < 0 ? 'BCE' : 'CE'}
        </span>
      </div>

      {/* Mobile year */}
      <div className={`sm:hidden text-sm ${HISTORY_APP_COLORS.timeline.header.text}`}>
        <span className={`font-bold ${HISTORY_APP_COLORS.timeline.header.year}`}>{year}</span>
      </div>

      {/* Quick navigation */}
      <div className="flex items-center gap-1">
        {quickButtons.map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={() => onYearChange(btn.year)}
            className={`rounded-md px-2 py-1 text-xs ${HISTORY_APP_COLORS.timeline.navButton.bg} ${HISTORY_APP_COLORS.timeline.navButton.text} ${HISTORY_APP_COLORS.timeline.navButton.hover} ${HISTORY_APP_COLORS.timeline.navButton.disabled}`}
          >
            {btn.label}
          </button>
        ))}

        {/* Play/Pause */}
        <button
          type="button"
          onClick={onPlayToggle}
          className={`ml-1 rounded-md px-2.5 py-1 text-xs font-medium ${isPlaying ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-green-600 hover:bg-green-500 text-white'}`}
          aria-label={isPlaying ? t('ui.pause') : t('ui.play')}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>
    </div>
  );
}
