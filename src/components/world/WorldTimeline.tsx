'use client';

import * as React from 'react';
import { 
  eurasianBoundaries, 
  eastAsiaBoundaries, 
  type WorldBoundary 
} from '@/lib/history/data/worldBoundaries';

function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

function formatYearShort(year: number): string {
  if (year < 0) return `${Math.abs(year)}BCE`;
  return `${year}`;
}

const REGIONS = [
  { key: 'china', name: '中国', color: '#DC2626' },
  { key: 'korea', name: '朝鲜半岛', color: '#10B981' },
  { key: 'japan', name: '日本', color: '#8B5CF6' },
  { key: 'steppe', name: '中亚/草原', color: '#F59E0B' },
  { key: 'west', name: '西方', color: '#3B82F6' },
];

function getEmpiresForRegion(boundaries: WorldBoundary[], patterns: string[], isInclude: boolean = true): WorldBoundary[] {
  return boundaries.filter(b => {
    const name = b.properties.name;
    const matched = patterns.some(p => name.includes(p));
    return isInclude ? matched : !matched;
  });
}

interface WorldTimelineProps {
  minYear: number;
  maxYear: number;
}

export function WorldTimeline({ minYear, maxYear }: WorldTimelineProps) {
  const [year, setYear] = React.useState(1);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  
  const allBoundaries = React.useMemo(() => {
    const combined = [...eurasianBoundaries, ...eastAsiaBoundaries];
    const seen = new Set<string>();
    return combined.filter(b => {
      const key = `${b.properties.name}-${b.properties.startYear}-${b.properties.endYear}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, []);
  
  const regionsData = React.useMemo(() => {
    return REGIONS.map(region => {
      let boundaries: WorldBoundary[];
      switch (region.key) {
        case 'china':
          boundaries = getEmpiresForRegion(allBoundaries, ['秦', '汉', '唐', '宋', '元', '明', '清', '隋', '三国', '晋', '南北朝', '五代']);
          break;
        case 'korea':
          boundaries = getEmpiresForRegion(allBoundaries, ['高丽', '朝鲜', '新罗', '百济', '伽倻', '渤海']);
          break;
        case 'japan':
          boundaries = getEmpiresForRegion(allBoundaries, ['平安', '江户', '奈良', '镰仓', '室町', '飞鸟', '大和']);
          break;
        case 'steppe':
          boundaries = getEmpiresForRegion(allBoundaries, ['蒙古', '匈奴', '突厥', '鲜卑', '柔然', '契丹', '女真', '金朝'], false).filter(b => {
            const name = b.properties.name;
            return !['秦', '汉', '唐', '宋', '元', '明', '清', '隋', '三国', '晋', '南北朝', '五代', '高丽', '朝鲜', '新罗', '平安', '江户', '奈良'].some(p => name.includes(p));
          });
          break;
        case 'west':
          boundaries = getEmpiresForRegion(allBoundaries, ['罗马', '拜占庭', '奥斯曼', '波斯', '亚历山大', '帕提亚', '萨珊', '阿拉伯', '倭马亚', '阿拔斯', '帖木儿']);
          break;
        default:
          boundaries = [];
      }
      return { ...region, boundaries };
    });
  }, [allBoundaries]);
  
  const activeEmpires = React.useMemo(() => {
    return allBoundaries.filter(b => 
      b.properties.startYear <= year && b.properties.endYear >= year
    );
  }, [allBoundaries, year]);

  const yearMarks = React.useMemo(() => {
    const result: { year: number; major: boolean }[] = [];
    for (let y = maxYear; y >= minYear; y -= 50) {
      result.push({ year: y, major: y % 100 === 0 });
    }
    return result;
  }, [minYear, maxYear]);

  React.useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const totalYears = maxYear - minYear;
      const percentage = (year - minYear) / totalYears;
      const scrollTop = percentage * container.scrollHeight;
      container.scrollTop = scrollTop - container.clientHeight / 2;
    }
  }, [year, minYear, maxYear]);

  const getBlockStyle = (startYear: number, endYear: number) => {
    const totalYears = maxYear - minYear;
    const topPercent = ((maxYear - Math.min(endYear, maxYear)) / totalYears) * 100;
    const heightPercent = ((Math.min(endYear, maxYear) - Math.max(startYear, minYear)) / totalYears) * 100;
    return {
      top: `${Math.max(0, topPercent)}%`,
      height: `${Math.max(0.5, heightPercent)}%`,
    };
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    document.querySelectorAll('.sync-scroll').forEach((el) => {
      if (el !== container) {
        (el as HTMLDivElement).scrollTop = scrollTop;
      }
    });
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-white">
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">欧亚对比</h1>
          <div className="text-2xl font-bold text-blue-400">{formatYear(year)}</div>
          <div className="text-zinc-400">{activeEmpires.length} 个帝国活跃</div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧年份列 */}
        <div className="w-12 flex-shrink-0 flex flex-col border-r border-zinc-800">
          <div className="h-10 border-b border-zinc-800 bg-zinc-900 flex items-center justify-center text-xs text-zinc-500">
            年份
          </div>
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto sync-scroll relative"
            onScroll={handleScroll}
          >
            {/* 年份刻度 - 只在正确位置显示 */}
            {yearMarks.map(y => (
              <div 
                key={y.year}
                className="absolute w-full pointer-events-none"
                style={{ top: `${((maxYear - y.year) / (maxYear - minYear)) * 100}%`, height: `${100 / (maxYear - minYear) * 50}%` }}
              >
                <span className={`text-[9px] pl-0.5 ${y.major ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {y.major ? formatYearShort(y.year) : ''}
                </span>
              </div>
            ))}
            {/* 当前年份线 */}
            <div 
              className="absolute w-full border-t-2 border-blue-500 z-10"
              style={{ top: `${((maxYear - year) / (maxYear - minYear)) * 100}%` }}
            />
          </div>
        </div>

        {/* 中间地区列 - 无格子线条 */}
        <div className="flex-1 flex">
          {regionsData.map(region => (
            <div key={region.key} className="flex-1 flex flex-col">
              <div 
                className="h-10 flex items-center justify-center text-sm font-bold flex-shrink-0 border-b border-zinc-800"
                style={{ backgroundColor: region.color }}
              >
                {region.name}
              </div>
              <div 
                className="flex-1 overflow-y-auto sync-scroll relative"
                onScroll={handleScroll}
              >
                {/* 年份刻度线 */}
                {yearMarks.map(y => (
                  <div 
                    key={y.year}
                    className={`absolute w-full ${y.major ? 'border-zinc-700' : 'border-transparent'} border-b pointer-events-none`}
                    style={{ top: `${((maxYear - y.year) / (maxYear - minYear)) * 100}%` }}
                  />
                ))}
                {/* 当前年份线 */}
                <div 
                  className="absolute w-full border-t-2 border-blue-500 z-10"
                  style={{ top: `${((maxYear - year) / (maxYear - minYear)) * 100}%` }}
                />
                {/* 帝国块 */}
                {region.boundaries.map((empire, idx) => {
                  const style = getBlockStyle(empire.properties.startYear, empire.properties.endYear);
                  const isActive = empire.properties.startYear <= year && empire.properties.endYear >= year;
                  
                  return (
                    <div
                      key={idx}
                      className={`absolute left-0 right-0 px-1 text-[9px] text-white flex items-center justify-center ${
                        isActive ? 'ring-1 ring-white' : ''
                      }`}
                      style={{
                        ...style,
                        backgroundColor: empire.properties.color,
                        zIndex: isActive ? 10 : 1,
                      }}
                    >
                      <span className="font-medium truncate">{empire.properties.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 右侧详情 */}
        <div className="w-64 flex-shrink-0 flex flex-col border-l border-zinc-800 bg-zinc-900/30">
          <div className="p-3 border-b border-zinc-800 flex-shrink-0">
            <div className="relative h-6 bg-zinc-800 rounded-full">
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-blue-500"
                style={{ left: `${((year - minYear) / (maxYear - minYear)) * 100}%` }}
              />
              <input
                type="range"
                min={minYear}
                max={maxYear}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
              <span>{formatYear(minYear)}</span>
              <span>{formatYear(maxYear)}</span>
            </div>
          </div>
          
          <div className="flex-1 p-3 overflow-y-auto">
            <h3 className="text-base font-bold mb-2">{formatYear(year)} 年的世界</h3>
            
            {activeEmpires.length > 0 ? (
              <div className="space-y-1.5">
                {activeEmpires.map((empire, idx) => {
                  const region = REGIONS.find(r => {
                    const name = empire.properties.name;
                    if (r.key === 'china') return ['秦', '汉', '唐', '宋', '元', '明', '清', '隋', '三国', '晋', '南北朝', '五代'].some(p => name.includes(p));
                    if (r.key === 'korea') return ['高丽', '朝鲜', '新罗', '百济', '伽倻', '渤海'].some(p => name.includes(p));
                    if (r.key === 'japan') return ['平安', '江户', '奈良', '镰仓', '室町', '飞鸟', '大和'].some(p => name.includes(p));
                    if (r.key === 'west') return ['罗马', '拜占庭', '奥斯曼', '波斯', '亚历山大', '帕提亚', '萨珊', '阿拉伯', '倭马亚', '阿拔斯', '帖木儿'].some(p => name.includes(p));
                    return false;
                  });
                  
                  return (
                    <div 
                      key={idx}
                      className="p-2 rounded bg-zinc-800/50 border-l-2"
                      style={{ borderLeftColor: empire.properties.color }}
                    >
                      <div className="flex items-center gap-1.5">
                        <span 
                          className="px-1.5 py-0.5 text-[9px] text-white rounded"
                          style={{ backgroundColor: empire.properties.color }}
                        >
                          {region?.name || '其他'}
                        </span>
                        <span className="font-bold text-sm">{empire.properties.name}</span>
                      </div>
                      <div className="text-[9px] text-zinc-400 mt-0.5">
                        {formatYear(empire.properties.startYear)} - {formatYear(empire.properties.endYear)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-zinc-500 text-center py-6 text-sm">该时期无记录</div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .sync-scroll::-webkit-scrollbar {
          display: none !important;
        }
        .sync-scroll {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>
    </div>
  );
}
