'use client';

import * as React from 'react';
import { formatYear } from '@/lib/history/utils';

interface TimelineSliderProps {
  year: number;
  minYear: number;
  maxYear: number;
  onYearChange: (year: number) => void;
  activeEmpires: string[];
  t: (key: string) => string;
}

export function TimelineSlider({
  year,
  minYear,
  maxYear,
  onYearChange,
  activeEmpires,
  t,
}: TimelineSliderProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const sliderRef = React.useRef<HTMLDivElement>(null);

  // 使用 ref 存储最新值，避免闭包问题
  const stateRef = React.useRef({ year, minYear, maxYear, onYearChange });
  React.useEffect(() => {
    stateRef.current = { year, minYear, maxYear, onYearChange };
  }, [year, minYear, maxYear, onYearChange]);

  // 格式化显示的年份
  const displayYear = React.useMemo(() => formatYear(year), [year]);

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
    <div className="bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-700 px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        {/* Mobile: larger year display for easier reading */}
        <span className="text-xl sm:text-lg font-bold text-white min-w-[80px]">{displayYear}</span>
        <div className="flex items-center gap-2">
          {activeEmpires.length > 0 && (
            <span className="text-xs text-zinc-400">
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
        aria-label="世界帝国年份滑块"
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
        <div className="absolute top-1/2 left-0 right-0 h-2 sm:h-2 bg-zinc-700 rounded-full -translate-y-1/2 touch-none">
          {/* 世纪标记 */}
          {Array.from({ length: Math.ceil((maxYear - minYear) / 100) + 1 }).map((_, i) => {
            const centuryYear = Math.ceil(minYear / 100) * 100 + i * 100;
            if (centuryYear < minYear || centuryYear > maxYear) return null;
            const pos = ((centuryYear - minYear) / (maxYear - minYear)) * 100;
            return (
              <div
                key={centuryYear}
                className="absolute top-0 w-px h-full bg-zinc-600"
                style={{ left: `${pos}%` }}
              />
            );
          })}
        </div>

        {/* 已选择区域 */}
        <div
          className="absolute top-1/2 left-0 h-2 sm:h-2 bg-blue-500 rounded-full -translate-y-1/2 touch-none"
          style={{ width: `${positionPercent}%` }}
        />

        {/* 滑块把手 - mobile: larger thumb */}
        <div
          className="absolute top-1/2 w-6 h-6 sm:w-5 sm:h-5 bg-white rounded-full shadow-lg -translate-y-1/2 -translate-x-1/2 transition-transform hover:scale-110 active:scale-125 touch-none"
          style={{ left: `${positionPercent}%` }}
        >
          <div className="absolute inset-1 bg-blue-500 rounded-full" />
        </div>
      </div>

      {/* 年份刻度标签 - mobile: show start/end years */}
      <div className="flex justify-between mt-1 text-xs text-zinc-500">
        <span>{formatYear(minYear)}</span>
        <span className="sm:hidden">{formatYear(Math.floor((minYear + maxYear) / 2))}</span>
        <span>{formatYear(maxYear)}</span>
      </div>
    </div>
  );
}
