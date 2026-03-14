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

// 时间范围
const WORLD_MIN_YEAR = -500;  // 公元前500年
const WORLD_MAX_YEAR = 1900;  // 公元1900年

export function WorldTimeline({ minYear, maxYear }: WorldTimelineProps) {
  const t = useTranslations();
  const [year, setYear] = React.useState(1); // 默认1年 CE
  const [windowSize, setWindowSize] = React.useState<50 | 100 | 200>(100); // 时间窗口大小
  const listContainerRef = React.useRef<HTMLDivElement>(null);
  
  // 根据窗口大小计算可见年份范围
  const windowStart = year - windowSize / 2;
  const windowEnd = year + windowSize / 2;
  
  // 获取所有帝国数据（去重）
  const allBoundaries = React.useMemo(() => {
    const combined = [...eurasianBoundaries, ...eastAsiaBoundaries];
    // 按名称去重
    const seen = new Set<string>();
    return combined.filter(b => {
      const key = `${b.properties.name}-${b.properties.startYear}-${b.properties.endYear}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
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
  
  // 获取当前年份正好存在的帝国（而非窗口范围）
  const activeEmpires = React.useMemo(() => {
    return allBoundaries.filter(b => 
      // 只显示当前年份正好在区间内的帝国
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
    if (listContainerRef.current) {
      const container = listContainerRef.current;
      const totalYears = maxYear - minYear;
      const percentage = (year - minYear) / totalYears;
      const scrollTop = percentage * container.scrollHeight;
      container.scrollTop = scrollTop - container.clientHeight / 2;
    }
  }, [year, minYear, maxYear]);

  // 计算时间块位置和高度
  const getBlockStyle = (startYear: number, endYear: number) => {
    const totalYears = maxYear - minYear;
    const topPercent = ((maxYear - Math.min(endYear, maxYear)) / totalYears) * 100;
    const heightPercent = ((Math.min(endYear, maxYear) - Math.max(startYear, minYear)) / totalYears) * 100;
    return {
      top: `${Math.max(0, topPercent)}%`,
      height: `${Math.max(0.5, heightPercent)}%`,
    };
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-white">
      {/* 顶部标题 */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {t('nav.world') || '欧亚对比'}
          </h1>
          
          {/* 年份显示 */}
          <div className="text-3xl font-bold text-blue-400">
            {formatYear(year)}
          </div>
          
          {/* 活跃帝国数 */}
          <div className="text-zinc-400">
            {activeEmpires.length} 个帝国活跃
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：帝国列表 */}
        <div className="w-1/2 flex flex-col border-r border-zinc-800">
          {/* 表头 */}
          <div className="flex bg-zinc-800/50 border-b border-zinc-800 flex-shrink-0">
            <div className="w-16 py-2 text-center text-xs text-zinc-500 font-medium">年份</div>
            {regions.map(region => (
              <div 
                key={region.key} 
                className="flex-1 py-2 text-center text-sm font-medium"
                style={{ backgroundColor: region.color }}
              >
                {region.name}
              </div>
            ))}
          </div>
          
          {/* 列表 */}
          <div ref={listContainerRef} className="flex-1 overflow-y-auto relative">
            <div className="relative" style={{ height: '4000px' }}>
              {/* 年份刻度线 */}
              {yearMarks.map(y => (
                <div 
                  key={y.year}
                  className={`absolute w-full ${y.major ? 'border-zinc-700' : 'border-zinc-800/30'} border-b`}
                  style={{ top: `${((maxYear - y.year) / (maxYear - minYear)) * 100}%` }}
                >
                  <span className={`pl-2 text-xs ${y.major ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {formatYearShort(y.year)}
                  </span>
                </div>
              ))}
              
              {/* 当前年份线 */}
              <div 
                className="absolute w-full border-t-2 border-blue-500 z-10"
                style={{ top: `${((maxYear - year) / (maxYear - minYear)) * 100}%` }}
              />
              
              {/* 帝国块 */}
              {regions.map(region => (
                <div key={region.key} className="absolute w-full flex" style={{ top: 0, height: '100%' }}>
                  <div className="w-16" />
                  <div className="flex-1 relative">
                    {region.boundaries.map((empire, idx) => {
                      const style = getBlockStyle(empire.properties.startYear, empire.properties.endYear);
                      const isActive = empire.properties.startYear <= year && empire.properties.endYear >= year;
                      
                      return (
                        <div
                          key={idx}
                          className={`absolute left-1 right-1 rounded px-1 text-[10px] text-white overflow-hidden ${
                            isActive ? 'ring-1 ring-white shadow-lg' : 'opacity-50'
                          }`}
                          style={{
                            ...style,
                            backgroundColor: empire.properties.color,
                          }}
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

        {/* 右侧：当前年份帝国详情 */}
        <div className="w-1/2 flex flex-col bg-zinc-900/30 p-4 overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">
            {formatYear(year)} 年的世界
          </h3>
          
          {activeEmpires.length > 0 ? (
              <div className="space-y-2">
                {activeEmpires.map((empire, idx) => {
                  const region = regions.find(r => r.boundaries.includes(empire));
                  
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
                        <span className="font-bold">
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
  );
}
