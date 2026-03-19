'use client';

import * as React from 'react';
import { formatYear } from '@/lib/history/utils';
import { useTranslations } from 'next-intl';
import { SLIDER_COLORS } from '@/lib/history/constants';
import { useTheme } from './ThemeContext';

interface YearSliderProps {
  year: number;
  minYear: number;
  maxYear: number;
  onYearChange: (year: number) => void;
  isPlaying?: boolean;
  onPlayToggle?: () => void;
}

export function YearSlider({
  year,
  minYear,
  maxYear,
  onYearChange,
  isPlaying = false,
  onPlayToggle,
}: YearSliderProps) {
  const t = useTranslations();
  const { themeColors } = useTheme();
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const stateRef = React.useRef({ year, minYear, maxYear, onYearChange });

  // Keep refs in sync with latest props to avoid stale closures in event handlers
  React.useEffect(() => {
    stateRef.current = { year, minYear, maxYear, onYearChange };
  }, [year, minYear, maxYear, onYearChange]);

  const updateYearFromPointer = React.useCallback((e: React.PointerEvent | MouseEvent) => {
    const { minYear: min, maxYear: max, onYearChange: onChange } = stateRef.current;
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const ratio = x / rect.width;
    const newYear = Math.round(min + ratio * (max - min));
    onChange(newYear);
  }, []);

  const handlePointerDown = React.useCallback((e: React.PointerEvent) => {
    updateYearFromPointer(e);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [updateYearFromPointer]);

  const handlePointerMove = React.useCallback((e: React.PointerEvent) => {
    if (e.buttons === 0) return; // Button not pressed
    updateYearFromPointer(e);
  }, [updateYearFromPointer]);

  // 键盘导航支持 (左右方向键，以1年为单位，Shift+方向键以10年为单位)
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    const { year: y, minYear: min, maxYear: max, onYearChange: onChange } = stateRef.current;
    const step = Math.max(1, Math.floor((max - min) / 100));
    let newYear = y;

    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      newYear = Math.max(min, y - (e.shiftKey ? step * 10 : step));
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      newYear = Math.min(max, y + (e.shiftKey ? step * 10 : step));
    } else if (e.key === 'Home') {
      e.preventDefault();
      newYear = min;
    } else if (e.key === 'End') {
      e.preventDefault();
      newYear = max;
    } else {
      return;
    }

    if (newYear !== y) {
      onChange(newYear);
    }
  }, []);

  const percentage = ((year - minYear) / (maxYear - minYear)) * 100;

  // 生成年份刻度线（每100年一个）
  const ticks = React.useMemo(() => {
    const result: { year: number; position: number; major: boolean }[] = [];
    const start = Math.ceil(minYear / 100) * 100;
    for (let y = start; y <= maxYear; y += 100) {
      result.push({
        year: y,
        position: ((y - minYear) / (maxYear - minYear)) * 100,
        major: y % 500 === 0,
      });
    }
    return result;
  }, [minYear, maxYear]);

  return (
    <div className={`w-full ${SLIDER_COLORS.background} ${themeColors.text} px-4 py-3 rounded-t-xl`}>
      {/* 年份显示和播放按钮 */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-2xl font-bold tabular-nums">
          {formatYear(year)}
        </div>
        {onPlayToggle && (
          <button
            onClick={onPlayToggle}
            className={`flex items-center gap-2 px-3 py-1.5 ${SLIDER_COLORS.track} ${SLIDER_COLORS.playButton.hover} rounded-lg text-sm transition-colors`}
          >
            <span className="text-lg">{isPlaying ? '⏸️' : '▶️'}</span>
            <span>{isPlaying ? t('timeline.pause') : t('timeline.play')}</span>
          </button>
        )}
      </div>

      {/* 滑块区域 */}
      <div className="relative">
        {/* 刻度线 */}
        <div className="absolute top-0 left-0 right-0 h-2 flex items-end pointer-events-none">
          {ticks.map((tick) => (
            <div
              key={tick.year}
              className="absolute flex flex-col items-center"
              style={{ left: `${tick.position}%` }}
            >
              <div className={`w-px ${tick.major ? `h-3 ${SLIDER_COLORS.majorTick}` : `h-1.5 ${SLIDER_COLORS.centuryMark}`}`} />
              {tick.major && (
                <span className={`text-[10px] ${SLIDER_COLORS.tickLabel} mt-0.5 whitespace-nowrap`}>
                  {formatYear(tick.year)}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* 滑块轨道 - 使用 pointer events 获得更好的拖拽体验 */}
        <div
          ref={sliderRef}
          className="relative h-6 cursor-pointer select-none pt-6"
          role="slider"
          aria-label="年份滑块"
          aria-valuemin={minYear}
          aria-valuemax={maxYear}
          aria-valuenow={year}
          aria-valuetext={formatYear(year)}
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onKeyDown={handleKeyDown}
        >
          {/* 轨道背景 */}
          <div className={`absolute top-0 left-0 right-0 h-1.5 ${SLIDER_COLORS.track} rounded-full`}>
            {/* 已播放部分 */}
            <div
              className={`h-full ${SLIDER_COLORS.progress} rounded-full`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* 滑块 thumb */}
          <div
            className="absolute top-[-4px] w-5 h-5 bg-white rounded-full shadow-lg cursor-grab active:cursor-grabbing transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
            style={{ left: `calc(${percentage}% - 10px)` }}
          />
        </div>
      </div>

      {/* 快捷按钮 */}
      <div className={`flex justify-between mt-2 text-xs ${SLIDER_COLORS.quickButton.default}`}>
        <button
          onClick={() => onYearChange(minYear)}
          className={`${SLIDER_COLORS.quickButton.hover} transition-colors`}
        >
          {formatYear(minYear)}
        </button>
        <button
          onClick={() => onYearChange(Math.floor((minYear + maxYear) / 2))}
          className={`${SLIDER_COLORS.quickButton.hover} transition-colors`}
        >
          {formatYear(Math.floor((minYear + maxYear) / 2))}
        </button>
        <button
          onClick={() => onYearChange(maxYear)}
          className={`${SLIDER_COLORS.quickButton.hover} transition-colors`}
        >
          {formatYear(maxYear)}
        </button>
      </div>
    </div>
  );
}

