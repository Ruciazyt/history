'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { WorldEmpireMap } from '@/components/world/WorldEmpireMap';
import { TimelineSlider } from '@/components/world/TimelineSlider';
import { getActiveBoundaries, type WorldBoundary } from '@/lib/history/data/worldBoundaries';

interface WorldClientProps {
  locale: string;
  minYear: number;
  maxYear: number;
}

export function WorldClient({ locale, minYear, maxYear }: WorldClientProps) {
  const t = useTranslations();
  const [year, setYear] = React.useState(-300); // 默认公元前300年
  const [mode, setMode] = React.useState<'eurasian' | 'east-asia'>('eurasian');

  // 获取当前活跃的帝国
  const activeBoundaries = React.useMemo(
    () => getActiveBoundaries(year, mode),
    [year, mode]
  );

  // 获取活跃帝国名称列表
  const activeEmpireNames = React.useMemo(
    () => activeBoundaries.map((b) => t(b.properties.nameKey)),
    [activeBoundaries, t]
  );

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      {/* 顶部标题栏 */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            {t('nav.world') || '欧亚对比'}
          </h1>
          
          {/* 模式切换 */}
          <div className="flex gap-2">
            <button
              onClick={() => setMode('eurasian')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'eurasian'
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {t('world.eurasian') || '欧亚大陆'}
            </button>
            <button
              onClick={() => setMode('east-asia')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'east-asia'
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {t('world.eastAsia') || '东亚'}
            </button>
          </div>
        </div>
      </header>

      {/* 时间轴 */}
      <TimelineSlider
        year={year}
        minYear={minYear}
        maxYear={maxYear}
        onYearChange={setYear}
        activeEmpires={activeEmpireNames}
        t={t}
      />

      {/* 地图 */}
      <div className="flex-1">
        <WorldEmpireMap
          year={year}
          mode={mode}
          onYearChange={setYear}
        />
      </div>
    </div>
  );
}
