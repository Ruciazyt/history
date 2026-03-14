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

  // 处理滚动
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    // 同步滚动其他容器
    document.querySelectorAll('.sync-scroll').forEach((el) => {
      if (el !== container) {
        el.scrollTop = container.scrollTop;
      }
    });
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

      {/* 主内容：横向表格布局 */}
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
              {/* 当前年份线 */}
              <div 
                className="absolute w-full border-t-2 border-blue-500 z-10"
                style={{ top: `${((maxYear - year) / (maxYear - minYear)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 右侧地区列 - 共享滚动 */}
        <div className="flex-1 flex overflow-hidden">
          {regionsData.map(region => (
            <div key={region.key} className="flex-shrink-0 w-40 flex flex-col border-r border-zinc-800">
              {/* 地区标题 */}
              <div 
                className="h-10 flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: region.color }}
              >
                {region.name}
              </div>
              
              {/* 帝国时间块 - 同步滚动 */}
              <div 
                className="flex-1 overflow-y-auto sync-scroll"
                onScroll={handleScroll}
              >
                <div className="relative" style={{ height: '4000px' }}>
                  {/* 年份刻度线 */}
                  {yearMarks.map(y => (
                    <div 
                      key={y.year}
                      className={`absolute w-full ${y.major ? 'border-zinc-700' : 'border-zinc-800/30'} border-b`}
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
      </div>
    </div>
  );
}
