'use client';

import * as React from 'react';
import { formatYear } from '@/lib/history/utils';
import { SLIDER_TRACK_COLORS, TIMELINE_SLIDER_COLORS } from '@/lib/history/constants';

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
  const minMaxRef = React.useRef({ minYear, maxYear, onYearChange });

  // Keep refs updated with latest values
  React.useEffect(() => {
    minMaxRef.current = { minYear, maxYear, onYearChange };
  }, [minYear, maxYear, onYearChange]);

  // 格式化显示的年份
  const displayYear = React.useMemo(() => formatYear(year), [year]);

  // 处理滑块拖动 - 更新年份
  const updateYear = React.useCallback((e: React.PointerEvent) => {
    const { minYear: min, maxYear: max, onYearChange: onChange } = minMaxRef.current;
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const ratio = x / rect.width;
    const newYear = Math.round(min + ratio * (max - min));
    onChange(newYear);
  }, []);

  const handlePointerDown = React.useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    updateYear(e);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [updateYear]);

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (isDragging) {
        updateYear(e);
      }
    },
    [isDragging, updateYear]
  );

  const handlePointerUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  // 键盘导航支持 (左右方向键)
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    const { minYear: min, maxYear: max, onYearChange: onChange } = minMaxRef.current;
    const step = Math.max(1, Math.floor((max - min) / 100)); // 按住Shift快进
    
    let newYear = year;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      newYear = Math.max(min, year - (e.shiftKey ? step * 10 : step));
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      newYear = Math.min(max, year + (e.shiftKey ? step * 10 : step));
    } else if (e.key === 'Home') {
      e.preventDefault();
      newYear = min;
    } else if (e.key === 'End') {
      e.preventDefault();
      newYear = max;
    }
    
    if (newYear !== year) {
      onChange(newYear);
    }
  }, [year]);

  // 计算滑块位置百分比
  const positionPercent = ((year - minYear) / (maxYear - minYear)) * 100;

  return (
    <div className={`${TIMELINE_SLIDER_COLORS.container.bg} border-t ${TIMELINE_SLIDER_COLORS.container.border} px-4 py-3`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-bold text-white min-w-[80px]">{displayYear}</span>
        <div className="flex items-center gap-2">
          {activeEmpires.length > 0 && (
            <span className={`text-xs ${TIMELINE_SLIDER_COLORS.yearText}`}>
              {activeEmpires.length} {t('empires.active') || '个帝国'}
            </span>
          )}
        </div>
      </div>

      {/* 滑块轨道 */}
      <div
        ref={sliderRef}
        tabIndex={0}
        role="slider"
        aria-label="年份滑块"
        aria-valuemin={minYear}
        aria-valuemax={maxYear}
        aria-valuenow={year}
        className="relative h-8 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 rounded"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onKeyDown={handleKeyDown}
      >
        {/* 轨道背景 */}
        <div className={`absolute top-1/2 left-0 right-0 h-2 ${SLIDER_TRACK_COLORS.track} rounded-full -translate-y-1/2`}>
          {/* 世纪标记 */}
          {Array.from({ length: Math.ceil((maxYear - minYear) / 100) + 1 }).map((_, i) => {
            const centuryYear = Math.ceil(minYear / 100) * 100 + i * 100;
            if (centuryYear < minYear || centuryYear > maxYear) return null;
            const pos = ((centuryYear - minYear) / (maxYear - minYear)) * 100;
            return (
              <div
                key={centuryYear}
                className={`absolute top-0 w-px h-full ${SLIDER_TRACK_COLORS.centuryMark}`}
                style={{ left: `${pos}%` }}
              />
            );
          })}
        </div>

        {/* 已选择区域 */}
        <div
          className={`absolute top-1/2 left-0 h-2 ${SLIDER_TRACK_COLORS.progress} rounded-full -translate-y-1/2`}
          style={{ width: `${positionPercent}%` }}
        />

        {/* 滑块把手 */}
        <div
          className={`absolute top-1/2 w-5 h-5 ${SLIDER_TRACK_COLORS.thumb} rounded-full shadow-lg -translate-y-1/2 -translate-x-1/2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400`}
          style={{ left: `${positionPercent}%` }}
        >
          <div className={`absolute inset-1 ${SLIDER_TRACK_COLORS.thumbInner} rounded-full`} />
        </div>
      </div>

      {/* 年份刻度标签 */}
      <div className={`flex justify-between mt-1 text-xs ${TIMELINE_SLIDER_COLORS.centuryText}`}>
        <span>{formatYear(minYear)}</span>
        <span>{formatYear(Math.floor((minYear + maxYear) / 2))}</span>
        <span>{formatYear(maxYear)}</span>
      </div>
    </div>
  );
}
