'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { 
  eurasianBoundaries, 
  eastAsiaBoundaries, 
  getActiveBoundaries, 
  type WorldBoundary 
} from '@/lib/history/data/worldBoundaries';

interface WorldTimelineProps {
  minYear: number;
  maxYear: number;
}

// 地区分组
const REGIONS = [
  { key: 'china', name: '中国', color: '#DC2626' },
  { key: 'korea', name: '朝鲜半岛', color: '#10B981' },
  { key: 'japan', name: '日本', color: '#8B5CF6' },
  { key: 'steppe', name: '中亚/草原', color: '#F59E0B' },
];

// 将帝国分配到不同地区
function getEmpiresByRegion(boundaries: WorldBoundary[], mode: 'eurasian' | 'east-asia') {
  const chinaPatterns = ['秦', '汉', '唐', '宋', '元', '明', '清', '隋'];
  const koreaPatterns = ['高丽', '朝鲜', '新罗', '百济', '伽倻'];
  const japanPatterns = ['平安', '江户', '奈良', '镰仓', '室町', '飞鸟'];
  
  const china: WorldBoundary[] = [];
  const korea: WorldBoundary[] = [];
  const japan: WorldBoundary[] = [];
  const steppe: WorldBoundary[] = [];

  boundaries.forEach(b => {
    const name = b.properties.name;
    if (chinaPatterns.some(p => name.includes(p))) {
      china.push(b);
    } else if (koreaPatterns.some(p => name.includes(p))) {
      korea.push(b);
    } else if (japanPatterns.some(p => name.includes(p))) {
      japan.push(b);
    } else {
      // 其他归类到中亚/草原
      steppe.push(b);
    }
  });

  return { china, korea, japan, steppe };
}

// 格式化年份
function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

// 计算时间块的高度
function getBlockHeight(startYear: number, endYear: number, minYear: number, maxYear: number, containerHeight: number): number {
  const totalYears = maxYear - minYear;
  const yearRange = endYear - startYear;
  return (yearRange / totalYears) * containerHeight;
}

// 计算顶部偏移
function getBlockTop(startYear: number, minYear: number, maxYear: number, containerHeight: number): number {
  const totalYears = maxYear - minYear;
  const yearOffset = startYear - minYear;
  return (yearOffset / totalYears) * containerHeight;
}

export function WorldTimeline({ minYear, maxYear }: WorldTimelineProps) {
  const t = useTranslations();
  const [year, setYear] = React.useState(618); // 默认唐朝618年
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // 获取当前年份的帝国
  const activeBoundaries = React.useMemo(
    () => [...eurasianBoundaries, ...eastAsiaBoundaries].filter(
      b => year >= b.properties.startYear && year <= b.properties.endYear
    ),
    [year]
  );

  const empiresByRegion = React.useMemo(
    () => getEmpiresByRegion([...eurasianBoundaries, ...eastAsiaBoundaries], 'eurasian'),
    []
  );

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
  };

  const timelineHeight = 600; // 时间轴总高度

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      {/* 顶部标题栏 */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            {t('nav.world') || '欧亚对比'}
          </h1>
          <div className="text-zinc-400">
            {formatYear(year)}
          </div>
        </div>
      </header>

      {/* 时间选择器 */}
      <div className="bg-zinc-900/50 px-6 py-3 flex-shrink-0 border-b border-zinc-800">
        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={year}
          onChange={(e) => handleYearChange(Number(e.target.value))}
          className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-xs text-zinc-500 mt-1">
          <span>{formatYear(minYear)}</span>
          <span>{formatYear(maxYear)}</span>
        </div>
      </div>

      {/* 当前活跃帝国指示器 */}
      <div className="bg-zinc-800/50 px-6 py-2 flex-shrink-0 flex flex-wrap gap-2">
        {activeBoundaries.length > 0 ? (
          activeBoundaries.map((b, i) => (
            <span
              key={i}
              className="px-2 py-1 text-xs text-white rounded"
              style={{ backgroundColor: b.properties.color }}
            >
              {t(b.properties.nameKey)}
            </span>
          ))
        ) : (
          <span className="text-xs text-zinc-500">No empires at this time</span>
        )}
      </div>

      {/* 时间线主体 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧年份刻度 */}
        <div className="w-16 flex-shrink-0 bg-zinc-900 border-r border-zinc-800 overflow-y-auto">
          {Array.from({ length: Math.ceil((maxYear - minYear) / 100) + 1 }, (_, i) => minYear + i * 100).map(y => (
            <div 
              key={y} 
              className="h-6 text-xs text-zinc-500 border-b border-zinc-800 flex items-center justify-center"
              style={{ height: `${600 / ((maxYear - minYear) / 100)}px` }}
            >
              {formatYear(y)}
            </div>
          ))}
        </div>

        {/* 右侧帝国时间块 */}
        <div className="flex-1 flex overflow-x-auto">
          {REGIONS.map(region => {
            const empires = empiresByRegion[region.key as keyof typeof empiresByRegion];
            return (
              <div 
                key={region.key} 
                className="flex-1 min-w-[150px] border-r border-zinc-800 relative"
                style={{ height: '600px' }}
              >
                {/* 地区标题 */}
                <div 
                  className="text-center py-2 text-sm font-medium text-white sticky top-0 z-10"
                  style={{ backgroundColor: region.color }}
                >
                  {region.name}
                </div>
                
                {/* 帝国时间块 */}
                <div className="relative" style={{ height: '600px' }}>
                  {empires.map((empire, idx) => {
                    const top = getBlockTop(empire.properties.startYear, minYear, maxYear, 600);
                    const height = getBlockHeight(empire.properties.startYear, empire.properties.endYear, minYear, maxYear, 600);
                    const isActive = year >= empire.properties.startYear && year <= empire.properties.endYear;
                    
                    return (
                      <div
                        key={idx}
                        className={`absolute left-1 right-1 rounded px-2 py-1 text-xs text-white overflow-hidden cursor-pointer transition-all ${
                          isActive ? 'ring-2 ring-white scale-105 z-10' : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{
                          top: `${top}px`,
                          height: `${Math.max(height, 20)}px`,
                          backgroundColor: empire.properties.color,
                        }}
                        title={`${empire.properties.name} (${formatYear(empire.properties.startYear)} - ${formatYear(empire.properties.endYear)})`}
                      >
                        <div className="font-medium truncate">
                          {t(empire.properties.nameKey) || empire.properties.name}
                        </div>
                        <div className="text-[10px] opacity-80 truncate">
                          {formatYear(empire.properties.startYear)} - {formatYear(empire.properties.endYear)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
