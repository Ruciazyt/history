'use client';

import * as React from 'react';
import { formatYear } from '@/lib/history/utils';
import { useDarkMode } from '@/lib/history/hooks/useDarkMode';

interface TimelineSliderProps {
  year: number;
  minYear: number;
  maxYear: number;
  onYearChange: (year: number) => void;
  activeEmpires: string[];
  t: (key: string) => string;
  locale?: string;
}

export function TimelineSlider({
  year,
  minYear,
  maxYear,
  onYearChange,
  activeEmpires,
  t,
  locale = 'zh',
}: TimelineSliderProps) {
  const [_isDragging, setIsDragging] = React.useState(false);
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const isDark = useDarkMode();

  // Theme-aware color classes
  const colors = React.useMemo(() => ({
    container: isDark
      ? 'bg-zinc-900/95 border-zinc-700'
      : 'bg-white/95 border-zinc-200',
    yearDisplay: isDark ? 'text-white' : 'text-zinc-900',
    activeCountText: isDark ? 'text-zinc-400' : 'text-zinc-500',
    track: isDark ? 'bg-zinc-700' : 'bg-zinc-200',
    centuryMark: isDark ? 'bg-zinc-600' : 'bg-zinc-300',
    thumbOuter: isDark ? 'bg-white' : 'bg-white',
    thumbInner: isDark ? 'bg-blue-400' : 'bg-blue-500',
    tickLabel: isDark ? 'text-zinc-500' : 'text-zinc-400',
  }), [isDark]);

  // 使用 ref 存储最新值，避免闭包问题
  const stateRef = React.useRef({ year, minYear, maxYear, onYearChange });
  React.useEffect(() => {
    stateRef.current = { year, minYear, maxYear, onYearChange };
  }, [year, minYear, maxYear, onYearChange]);

  // 格式化显示的年份
  const displayYear = React.useMemo(() => formatYear(year, locale), [year, locale]);

  // 计算滑块位置百分比
  const positionPercent = React.useMemo(
    () => ((year - minYear) / (maxYear - minYear)) * 100,
    [year, minYear, maxYear]
  );

  // 更新年份的逻辑
  const updateYear = React.useCallback((e: React.PointerEvent | MouseEvent) => {
    if (!sliderRef.current) return;
    const { minYear: min, maxYear: max, onYearChange: onChange } = stateRef.current;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const ratio = x / rect.width;
    const newYear = Math.round(min + ratio * (max - min));
    onChange(newYear);
  }, []);

  // 处理滑块拖动
  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      updateYear(e);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [updateYear]
  );

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (e.buttons === 0) return;
      updateYear(e);
    },
    [updateYear]
  );

  const handlePointerUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

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

  return (
    <div className={`backdrop-blur-sm border-t px-4 py-3 ${colors.container}`}>
      <div className="flex items-center justify-between mb-2">
        {/* Mobile: larger year display for easier reading */}
        <span className={`text-xl sm:text-lg font-bold min-w-[80px] ${colors.yearDisplay}`}>{displayYear}</span>
        <div className="flex items-center gap-2">
          {activeEmpires.length > 0 && (
            <span className={`text-xs ${colors.activeCountText}`}>
              {activeEmpires.length} {t('empires.active')}
            </span>
          )}
        </div>
      </div>

      {/* 滑块轨道 - mobile: larger touch targets */}
      <div
        ref={sliderRef}
        className="relative h-12 sm:h-8 cursor-pointer select-none"
        role="slider"
        aria-label={t('world.ariaLabel')}
        aria-valuemin={minYear}
        aria-valuemax={maxYear}
        aria-valuenow={year}
        aria-valuetext={displayYear}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onKeyDown={handleKeyDown}
      >
        {/* 轨道背景 - mobile: taller track */}
        <div className={`absolute top-1/2 left-0 right-0 h-2 sm:h-2 rounded-full -translate-y-1/2 touch-none ${colors.track}`}>
          {/* 世纪标记 */}
          {Array.from({ length: Math.ceil((maxYear - minYear) / 100) + 1 }).map((_, i) => {
            const centuryYear = Math.ceil(minYear / 100) * 100 + i * 100;
            if (centuryYear < minYear || centuryYear > maxYear) return null;
            const pos = ((centuryYear - minYear) / (maxYear - minYear)) * 100;
            return (
              <div
                key={centuryYear}
                className={`absolute top-0 w-px h-full ${colors.centuryMark}`}
                style={{ left: `${pos}%` }}
              />
            );
          })}
        </div>

        {/* 已选择区域 */}
        <div
          className={`absolute top-1/2 left-0 h-2 sm:h-2 bg-blue-500 rounded-full -translate-y-1/2 touch-none`}
          style={{ width: `${positionPercent}%` }}
        />

        {/* 滑块把手 - mobile: larger thumb */}
        <div
          className={`absolute top-1/2 w-6 h-6 sm:w-5 sm:h-5 rounded-full shadow-lg -translate-y-1/2 -translate-x-1/2 transition-transform hover:scale-110 active:scale-125 touch-none ${colors.thumbOuter}`}
          style={{ left: `${positionPercent}%` }}
        >
          <div className={`absolute inset-1 rounded-full ${colors.thumbInner}`} />
        </div>
      </div>

      {/* 年份刻度标签 - mobile: show start/end years */}
      <div className={`flex justify-between mt-1 text-xs ${colors.tickLabel}`}>
        <span>{formatYear(minYear, locale)}</span>
        <span className="sm:hidden">{formatYear(Math.floor((minYear + maxYear) / 2), locale)}</span>
        <span>{formatYear(maxYear, locale)}</span>
      </div>
    </div>
  );
}
