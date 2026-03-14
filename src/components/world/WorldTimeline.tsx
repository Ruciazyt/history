'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
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

// 短年份格式
function formatYearShort(year: number): string {
  if (year < 0) return `${Math.abs(year)}BCE`;
  return `${year}`;
}

// 地区配置
interface RegionConfig {
  key: string;
  name: string;
  nameEn: string;
  color: string;
  boundaries: WorldBoundary[];
}

// 筛选特定地区的帝国
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
  const t = useTranslations();
  const [year, setYear] = React.useState(1); // 默认1年
  const [windowSize, setWindowSize] = React.useState<50 | 100 | 200>(100); // 时间窗口大小
  const listContainerRef = React.useRef<HTMLDivElement>(null);
  
  // 根据窗口大小计算可见年份范围
  const windowStart = year - windowSize / 2;
  const windowEnd = year + windowSize / 2;
  
  // 获取所有帝国数据
  const allBoundaries = React.useMemo(() => {
    return [...eurasianBoundaries, ...eastAsiaBoundaries];
  }, []);
  
  // 按地区分组
  const regions: RegionConfig[] = React.useMemo(() => {
    return [
      {
        key: 'china',
        name: '中国',
        nameEn: 'China',
        color: '#DC2626',
        boundaries: getEmpiresForRegion(allBoundaries, ['秦', '汉', '唐', '宋', '元', '明', '清', '隋', '三国', '晋', '南北朝', '五代']),
      },
      {
        key: 'korea',
        name: '朝鲜半岛',
        nameEn: 'Korea',
        color: '#10B981',
        boundaries: getEmpiresForRegion(allBoundaries, ['高丽', '朝鲜', '新罗', '百济', '伽倻', '渤海']),
      },
      {
        key: 'japan',
        name: '日本',
        nameEn: 'Japan',
        color: '#8B5CF6',
        boundaries: getEmpiresForRegion(allBoundaries, ['平安', '江户', '奈良', '镰仓', '室町', '飞鸟', '大和']),
      },
      {
        key: 'steppe',
        name: '中亚/草原',
        nameEn: 'Central Asia',
        color: '#F59E0B',
        boundaries: getEmpiresForRegion(allBoundaries, ['蒙古', '匈奴', '突厥', '鲜卑', '柔然', '契丹', '女真', '金朝'], false).filter(b => {
          // 排除中国王朝
          const name = b.properties.name;
          return !['秦', '汉', '唐', '宋', '元', '明', '清', '隋', '三国', '晋', '南北朝', '五代', '高丽', '朝鲜', '新罗', '平安', '江户', '奈良'].some(p => name.includes(p));
        }),
      },
      {
        key: 'west',
        name: '西方',
        nameEn: 'West',
        color: '#3B82F6',
        boundaries: getEmpiresForRegion(allBoundaries, ['罗马', '拜占庭', '奥斯曼', '波斯', '亚历山大', '帕提亚', '萨珊', '阿拉伯', '倭马亚', '阿拔斯', '帖木儿']),
      },
    ];
  }, [allBoundaries]);
  
  // 获取当前窗口内的帝国
  const activeEmpires = React.useMemo(() => {
    return allBoundaries.filter(b => 
      b.properties.startYear <= windowEnd && b.properties.endYear >= windowStart
    );
  }, [allBoundaries, windowStart, windowEnd]);

  // 生成年份列表
  const years = React.useMemo(() => {
    const result: number[] = [];
    // 从公元前550年到公元1922年（简化显示，每50年一个大标记）
    for (let y = maxYear; y >= minYear; y -= 50) {
      result.push(y);
    }
    return result;
  }, [minYear, maxYear]);

  // 滚动到当前年份
  React.useEffect(() => {
    if (listContainerRef.current) {
      const container = listContainerRef.current;
      const targetYear = year;
      const totalYears = maxYear - minYear;
      const percentage = (targetYear - minYear) / totalYears;
      const scrollTop = percentage * container.scrollHeight;
      container.scrollTop = scrollTop;
    }
  }, [year, minYear, maxYear]);

  // 计算时间块位置
  const getBlockStyle = (startYear: number, endYear: number) => {
    const totalYears = maxYear - minYear;
    const top = ((maxYear - Math.min(endYear, maxYear)) / totalYears) * 100;
    const height = ((Math.min(endYear, maxYear) - Math.max(startYear, minYear)) / totalYears) * 100;
    return {
      top: `${Math.max(0, top)}%`,
      height: `${Math.max(0.5, height)}%`,
    };
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      {/* 顶部标题栏 */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            {t('nav.world') || '欧亚对比'}
          </h1>
          
          {/* 当前年份显示 */}
          <div className="text-2xl font-bold text-blue-400">
            {formatYear(year)}
          </div>
          
          {/* 窗口大小控制 */}
          <div className="flex gap-2">
            {([50, 100, 200] as const).map(size => (
              <button
                key={size}
                onClick={() => setWindowSize(size)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  windowSize === size
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                {size}年
              </button>
            ))}
          </div>
        </div>
        
        {/* 时间范围显示 */}
        <div className="text-center text-zinc-400 mt-2">
          {formatYear(Math.floor(windowEnd))} ← {formatYear(Math.floor(windowStart))} 
          <span className="ml-3 text-zinc-500">
            ({activeEmpires.length} 个帝国活跃)
          </span>
        </div>
      </header>

      {/* 主内容区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：帝国列表 */}
        <div className="w-1/2 flex flex-col border-r border-zinc-800">
          {/* 表头 */}
          <div className="flex bg-zinc-800/50 border-b border-zinc-800">
            <div className="w-16 py-2 text-center text-xs text-zinc-500 font-medium">年份</div>
            {regions.map(region => (
              <div 
                key={region.key} 
                className="flex-1 py-2 text-center text-sm font-medium text-white"
                style={{ backgroundColor: region.color }}
              >
                {region.name}
              </div>
            ))}
          </div>
          
          {/* 列表内容 */}
          <div ref={listContainerRef} className="flex-1 overflow-y-auto">
            <div className="relative" style={{ height: '4000px' }}>
              {/* 年份刻度线 */}
              {years.map(y => (
                <div 
                  key={y}
                  className="absolute w-full border-b border-zinc-800/30 text-xs text-zinc-600"
                  style={{ top: `${((maxYear - y) / (maxYear - minYear)) * 100}%` }}
                >
                  <span className="pl-2 bg-zinc-900/80">{formatYearShort(y)}</span>
                </div>
              ))}
              
              {/* 当前年份指示线 */}
              <div 
                className="absolute w-full border-t-2 border-blue-500 z-10"
                style={{ top: `${((maxYear - year) / (maxYear - minYear)) * 100}%` }}
              />
              
              {/* 帝国块 */}
              {regions.map(region => (
                <div key={region.key} className="absolute w-full flex" style={{ top: 0, height: '100%' }}>
                  <div className="w-16" /> {/* 年份列 */}
                  <div className="flex-1 relative">
                    {region.boundaries.map((empire, idx) => {
                      const style = getBlockStyle(empire.properties.startYear, empire.properties.endYear);
                      const isActive = empire.properties.startYear <= year && empire.properties.endYear >= year;
                      
                      return (
                        <div
                          key={idx}
                          className={`absolute left-1 right-1 rounded px-1 text-[10px] text-white overflow-hidden ${
                            isActive ? 'ring-1 ring-white' : 'opacity-60'
                          }`}
                          style={{
                            ...style,
                            backgroundColor: empire.properties.color,
                          }}
                          title={`${empire.properties.name}: ${formatYear(empire.properties.startYear)} - ${formatYear(empire.properties.endYear)}`}
                        >
                          <div className="font-medium truncate">
                            {t(empire.properties.nameKey) || empire.properties.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：交互式时间轴 */}
        <div className="w-1/2 flex flex-col bg-zinc-900/30">
          {/* 时间轴头部 */}
          <div className="bg-zinc-800/30 border-b border-zinc-800 px-4 py-2">
            <div className="text-sm text-zinc-400">交互式时间轴</div>
          </div>
          
          {/* 大时间轴滑块 */}
          <div className="p-4">
            <div className="relative h-8 bg-zinc-800 rounded-full">
              {/* 窗口范围指示器 */}
              <div 
                className="absolute h-full bg-blue-500/30 rounded-full"
                style={{
                  left: `${((windowStart - minYear) / (maxYear - minYear)) * 100}%`,
                  width: `${((windowEnd - windowStart) / (maxYear - minYear)) * 100}%`,
                }}
              />
              
              {/* 当前位置指示器 */}
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
            
            {/* 年份标签 */}
            <div className="flex justify-between text-xs text-zinc-500 mt-1">
              <span>{formatYear(minYear)}</span>
              <span>{formatYear(maxYear)}</span>
            </div>
          </div>
          
          {/* 详细视图 - 当前年份信息 */}
          <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">
              {formatYear(year)} 年的世界
            </h3>
            
            {activeEmpires.length > 0 ? (
              <div className="space-y-3">
                {activeEmpires.map((empire, idx) => {
                  const region = regions.find(r => 
                    r.boundaries.includes(empire)
                  ) || regions[regions.length - 1];
                  
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
                          {region.name}
                        </span>
                        <span className="font-bold text-white">
                          {t(empire.properties.nameKey) || empire.properties.name}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 mt-1">
                        {formatYear(empire.properties.startYear)} - {formatYear(empire.properties.endYear)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-zinc-500 text-center py-8">
                该时期无记录
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
