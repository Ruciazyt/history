'use client';

import * as React from 'react';
import { 
  eurasianBoundaries, 
  eastAsiaBoundaries, 
  type WorldBoundary 
} from '@/lib/history/data/worldBoundaries';

// 格式化年份
function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

function formatYearShort(year: number): string {
  if (year < 0) return `${Math.abs(year)}BCE`;
  return `${year}`;
}

// 地区配置
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
  
  // 获取所有帝国数据（去重）
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
  
  // 按地区分组帝国
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
  
  // 当前活跃帝国
  const activeEmpires = React.useMemo(() => {
    return allBoundaries.filter(b => 
      b.properties.startYear <= year && b.properties.endYear >= year
    );
  }, [allBoundaries, year]);

  // 生成年份刻度
  const yearMarks = React.useMemo(() => {
    const result: { year: number; major: boolean }[] = [];
    for (let y = maxYear; y >= minYear; y -= 50) {
      result.push({ year: y, major: y % 100 === 0 });
    }
    return result;
  }, [minYear, maxYear]);

  // 滚动到当前年份
  React.useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const totalYears = maxYear - minYear;
      const percentage = (year - minYear) / totalYears;
      const scrollTop = percentage * container.scrollHeight;
      container.scrollTop = scrollTop - container.clientHeight / 2;
    }
  }, [year, minYear, maxYear]);

  // 计算时间块位置
  const getBlockStyle = (startYear: number, endYear: number) => {
    const totalYears = maxYear - minYear;
    const topPercent = ((maxYear - Math.min(endYear, maxYear)) / totalYears) * 100;
    const heightPercent = ((Math.min(endYear, maxYear) - Math.max(startYear, minYear)) / totalYears) * 100;
    return {
      top: `${Math.max(0, topPercent)}%`,
      height: `${Math.max(0.5, heightPercent)}%`,
    };
  };

  // 处理滚动 - 同步所有列
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    // 同步所有滚动容器
    document.querySelectorAll('.sync-scroll').forEach((el) => {
      if (el !== container) {
        (el as HTMLDivElement).scrollTop = scrollTop;
      }
    });
  };

  // 隐藏滚动条的样式
  const scrollbarHiddenStyle = {
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
    '&::-webkit-scrollbar': {
      display: 'none' as const,
    },
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-white">
      {/* 顶部标题 */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">欧亚对比</h1>
          <div className="text-2xl font-bold text-blue-400">{formatYear(year)}</div>
          <div className="text-zinc-400">{activeEmpires.length} 个帝国活跃</div>
        </div>
      </header>

      {/* 主内容 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧年份列 */}
        <div className="w-16 flex-shrink-0 flex flex-col border-r border-zinc-800">
          <div className="h-10 border-b border-zinc-800 bg-zinc-800/50 flex items-center justify-center text-xs text-zinc-500">
            年份
          </div>
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto sync-scroll"
            onScroll={handleScroll}
            style={scrollbarHiddenStyle}
          >
            <div className="relative" style={{ height: '4000px' }}>
              {yearMarks.map(y => (
                <div 
                  key={y.year}
                  className={`absolute w-full ${y.major ? 'border-zinc-700' : 'border-zinc-800/30'} border-b`}
                  style={{ top: `${((maxYear - y.year) / (maxYear - minYear)) * 100}%` }}
                >
                  <span className={`text-[10px] ${y.major ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {formatYearShort(y.year)}
                  </span>
                </div>
              ))}
              <div 
                className="absolute w-full border-t-2 border-blue-500 z-10"
                style={{ top: `${((maxYear - year) / (maxYear - minYear)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 中间地区列 */}
        <div className="flex-1 flex overflow-hidden">
          {regionsData.map(region => (
            <div key={region.key} className="flex-shrink-0 w-40 flex flex-col border-r border-zinc-800">
              <div 
                className="h-10 flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: region.color }}
              >
                {region.name}
              </div>
              <div 
                className="flex-1 overflow-y-auto sync-scroll"
                onScroll={handleScroll}
                style={scrollbarHiddenStyle}
              >
                <div className="relative" style={{ height: '4000px' }}>
                  {yearMarks.map(y => (
                    <div 
                      key={y.year}
                      className={`absolute w-full ${y.major ? 'border-zinc-700' : 'border-zinc-800/30'} border-b`}
                      style={{ top: `${((maxYear - y.year) / (maxYear - minYear)) * 100}%` }}
                    />
                  ))}
                  <div 
                    className="absolute w-full border-t-2 border-blue-500 z-10"
                    style={{ top: `${((maxYear - year) / (maxYear - minYear)) * 100}%` }}
                  />
                  {region.boundaries.map((empire, idx) => {
                    const style = getBlockStyle(empire.properties.startYear, empire.properties.endYear);
                    const isActive = empire.properties.startYear <= year && empire.properties.endYear >= year;
                    
                    return (
                      <div
                        key={idx}
                        className={`absolute left-1 right-1 rounded px-1 text-[10px] text-white overflow-hidden ${
                          isActive ? 'ring-1 ring-white shadow-lg' : 'opacity-60'
                        }`}
                        style={{
                          ...style,
                          backgroundColor: empire.properties.color,
                          zIndex: isActive ? 10 : 1,
                        }}
                      >
                        <div className="font-medium truncate">{empire.properties.name}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 右侧：当前年份详情 */}
        <div className="w-72 flex-shrink-0 flex flex-col border-l border-zinc-800 bg-zinc-900/30">
          {/* 年份滑块 */}
          <div className="p-4 border-b border-zinc-800 flex-shrink-0">
            <div className="relative h-8 bg-zinc-800 rounded-full">
              <div 
                className="absolute top-0 bottom-0 w-1 bg-blue-500"
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
            <div className="flex justify-between text-xs text-zinc-500 mt-1">
              <span>{formatYear(minYear)}</span>
              <span>{formatYear(maxYear)}</span>
            </div>
          </div>
          
          {/* 当前年份详情 */}
          <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="text-lg font-bold mb-3">{formatYear(year)} 年的世界</h3>
            
            {activeEmpires.length > 0 ? (
              <div className="space-y-2">
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
                      className="p-3 rounded-lg bg-zinc-800/50 border-l-4"
                      style={{ borderLeftColor: empire.properties.color }}
                    >
                      <div className="flex items-center gap-2">
                        <span 
                          className="px-2 py-0.5 text-xs text-white rounded"
                          style={{ backgroundColor: empire.properties.color }}
                        >
                          {region?.name || '其他'}
                        </span>
                        <span className="font-bold">{empire.properties.name}</span>
                      </div>
                      <div className="text-xs text-zinc-400 mt-1">
                        {formatYear(empire.properties.startYear)} - {formatYear(empire.properties.endYear)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-zinc-500 text-center py-8">该时期无记录</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
