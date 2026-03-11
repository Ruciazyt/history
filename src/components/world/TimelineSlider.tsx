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

  // 格式化显示的年份
  const displayYear = React.useMemo(() => formatYear(year), [year]);

  // 处理滑块拖动
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updateYear(e);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (isDragging) {
        updateYear(e);
      }
    },
    [isDragging, minYear, maxYear]
  );

  const handlePointerUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  const updateYear = (e: React.PointerEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const ratio = x / rect.width;
    const newYear = Math.round(minYear + ratio * (maxYear - minYear));
    onYearChange(newYear);
  };

  // 计算滑块位置百分比
  const positionPercent = ((year - minYear) / (maxYear - minYear)) * 100;

  return (
    <div className="bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-700 px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-bold text-white min-w-[80px]">{displayYear}</span>
        <div className="flex items-center gap-2">
          {activeEmpires.length > 0 && (
            <span className="text-xs text-zinc-400">
              {activeEmpires.length} {t('empires.active') || '个帝国'}
            </span>
          )}
        </div>
      </div>

      {/* 滑块轨道 */}
      <div
        ref={sliderRef}
        className="relative h-8 cursor-pointer select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* 轨道背景 */}
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-zinc-700 rounded-full -translate-y-1/2">
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
          className="absolute top-1/2 left-0 h-2 bg-blue-500 rounded-full -translate-y-1/2"
          style={{ width: `${positionPercent}%` }}
        />

        {/* 滑块把手 */}
        <div
          className="absolute top-1/2 w-5 h-5 bg-white rounded-full shadow-lg -translate-y-1/2 -translate-x-1/2 transition-transform hover:scale-110"
          style={{ left: `${positionPercent}%` }}
        >
          <div className="absolute inset-1 bg-blue-500 rounded-full" />
        </div>
      </div>

      {/* 年份刻度标签 */}
      <div className="flex justify-between mt-1 text-xs text-zinc-500">
        <span>{formatYear(minYear)}</span>
        <span>{formatYear(Math.floor((minYear + maxYear) / 2))}</span>
        <span>{formatYear(maxYear)}</span>
      </div>
    </div>
  );
}
