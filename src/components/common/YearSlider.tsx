'use client';

import * as React from 'react';
import { formatYear } from '@/lib/history/utils';
import { useTranslations } from 'next-intl';

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
  const [isDragging, setIsDragging] = React.useState(false);
  const sliderRef = React.useRef<HTMLDivElement>(null);

  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newYear = Math.round(minYear + percentage * (maxYear - minYear));
    onYearChange(Math.max(minYear, Math.min(maxYear, newYear)));
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percentage = x / rect.width;
      const newYear = Math.round(minYear + percentage * (maxYear - minYear));
      onYearChange(Math.max(minYear, Math.min(maxYear, newYear)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, minYear, maxYear, onYearChange]);

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
    <div className="w-full bg-zinc-800 text-white px-4 py-3 rounded-t-xl">
      {/* 年份显示和播放按钮 */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-2xl font-bold tabular-nums">
          {formatYear(year)}
        </div>
        {onPlayToggle && (
          <button
            onClick={onPlayToggle}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm transition-colors"
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
              <div className={`w-px ${tick.major ? 'h-3 bg-zinc-500' : 'h-1.5 bg-zinc-600'}`} />
              {tick.major && (
                <span className="text-[10px] text-zinc-500 mt-0.5 whitespace-nowrap">
                  {formatYear(tick.year)}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* 滑块轨道 */}
        <div
          ref={sliderRef}
          className="relative h-6 cursor-pointer select-none pt-6"
          onClick={handleSliderClick}
        >
          {/* 轨道背景 */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-zinc-700 rounded-full">
            {/* 已播放部分 */}
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* 滑块 thumb */}
          <div
            className="absolute top-[-4px] w-5 h-5 bg-white rounded-full shadow-lg cursor-grab active:cursor-grabbing transition-transform hover:scale-110"
            style={{ left: `calc(${percentage}% - 10px)` }}
            onMouseDown={handleMouseDown}
          />
        </div>
      </div>

      {/* 快捷按钮 */}
      <div className="flex justify-between mt-2 text-xs text-zinc-500">
        <button
          onClick={() => onYearChange(minYear)}
          className="hover:text-zinc-300 transition-colors"
        >
          {formatYear(minYear)}
        </button>
        <button
          onClick={() => onYearChange(Math.floor((minYear + maxYear) / 2))}
          className="hover:text-zinc-300 transition-colors"
        >
          {formatYear(Math.floor((minYear + maxYear) / 2))}
        </button>
        <button
          onClick={() => onYearChange(maxYear)}
          className="hover:text-zinc-300 transition-colors"
        >
          {formatYear(maxYear)}
        </button>
      </div>
    </div>
  );
}
