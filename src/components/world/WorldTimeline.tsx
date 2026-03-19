'use client';

import * as React from 'react';
import { 
  eurasianBoundaries, 
  eastAsiaBoundaries, 
  type WorldBoundary 
} from '@/lib/history/data/worldBoundaries';

function formatYearShort(year: number): string {
  if (year < 0) return `${Math.abs(year)}BCE`;
  return `${year}`;
}

const EMPIRE_INFO: Record<string, { en: string }> = {
  '秦朝': { en: 'Qin' },
  '西汉': { en: 'Western Han' },
  '东汉': { en: 'Eastern Han' },
  '唐朝': { en: 'Tang' },
  '宋朝': { en: 'Song' },
  '元朝': { en: 'Yuan' },
  '明朝': { en: 'Ming' },
  '清朝': { en: 'Qing' },
  '隋朝': { en: 'Sui' },
  '三国': { en: 'Three Kingdoms' },
  '罗马帝国': { en: 'Roman Empire' },
  '拜占庭帝国': { en: 'Byzantine' },
  '奥斯曼帝国': { en: 'Ottoman' },
  '帖木儿帝国': { en: 'Timurid' },
  '平安时代': { en: 'Heian' },
  '江户时代': { en: 'Edo' },
};

const REGIONS = [
  { key: 'china', name: '中国', color: '#DC2626' },
  { key: 'korea', name: '朝鲜', color: '#10B981' },
  { key: 'japan', name: '日本', color: '#8B5CF6' },
  { key: 'steppe', name: '中亚', color: '#F59E0B' },
  { key: 'west', name: '西方', color: '#3B82F6' },
];

function mergeEmpires(boundaries: WorldBoundary[]): WorldBoundary[] {
  const nameMap = new Map<string, WorldBoundary[]>();
  boundaries.forEach(b => {
    const name = b.properties.name;
    if (!nameMap.has(name)) nameMap.set(name, []);
    nameMap.get(name)!.push(b);
  });
  
  const merged: WorldBoundary[] = [];
  nameMap.forEach((items) => {
    if (items.length === 1) {
      merged.push(items[0]!);
    } else {
      const timeKeyMap = new Map<string, WorldBoundary[]>();
      items.forEach(item => {
        const key = `${item.properties.startYear}-${item.properties.endYear}`;
        if (!timeKeyMap.has(key)) timeKeyMap.set(key, []);
        timeKeyMap.get(key)!.push(item);
      });
      timeKeyMap.forEach((timeItems) => {
        merged.push(timeItems[0]!);
      });
    }
  });
  return merged;
}

function getEmpiresForRegion(boundaries: WorldBoundary[], patterns: string[], isInclude: boolean = true): WorldBoundary[] {
  return boundaries.filter(b => {
    const name = b.properties.name;
    const matched = patterns.some(p => name.includes(p));
    return isInclude ? matched : !matched;
  });
}

export function WorldTimeline({ minYear, maxYear }: { minYear: number; maxYear: number }) {
  const [year, setYear] = React.useState(-300);
  
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
          boundaries = getEmpiresForRegion(allBoundaries, ['平安', '江户', '奈良', '镰仓', '室町', '飞鸟']);
          break;
        case 'steppe':
          boundaries = getEmpiresForRegion(allBoundaries, ['蒙古', '匈奴', '突厥', '鲜卑', '柔然', '契丹', '女真', '金'], false).filter(b => {
            const name = b.properties.name;
            return !['秦', '汉', '唐', '宋', '元', '明', '清', '隋'].some(p => name.includes(p));
          });
          break;
        case 'west':
          boundaries = getEmpiresForRegion(allBoundaries, ['罗马', '拜占庭', '奥斯曼', '波斯', '亚历山大', '帕提亚', '萨珊', '阿拉伯', '倭马亚', '阿拔斯', '帖木儿']);
          break;
        default:
          boundaries = [];
      }
      return { ...region, boundaries: mergeEmpires(boundaries) };
    });
  }, [allBoundaries]);
  
  const activeEmpires = React.useMemo(() => {
    return allBoundaries.filter(b => b.properties.startYear <= year && b.properties.endYear >= year);
  }, [allBoundaries, year]);

  const getBlockStyle = (startYear: number, endYear: number) => {
    const totalYears = maxYear - minYear;
    const topPercent = ((startYear - minYear) / totalYears) * 100;
    const heightPercent = ((endYear - startYear) / totalYears) * 100;
    return {
      top: `${topPercent}%`,
      height: `${Math.max(heightPercent, 1)}%`,
    };
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    document.querySelectorAll('.sync-scroll').forEach((el) => {
      if (el !== container) (el as HTMLDivElement).scrollTop = scrollTop;
    });
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-white">
      <header className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">欧亚对比</h1>
          <div className="text-xl font-bold text-blue-400">{year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`}</div>
          <div className="text-zinc-400 text-sm">{activeEmpires.length} 个政权</div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-10 flex-shrink-0 flex flex-col">
          <div className="h-8 border-b border-zinc-800 bg-zinc-900 flex items-center justify-center text-[10px] text-zinc-500">年份</div>
          <div className="flex-1 overflow-y-auto sync-scroll relative" onScroll={handleScroll}>
            <div className="relative" style={{ height: '2400px' }}>
              {Array.from({ length: Math.floor((maxYear - minYear) / 100) + 1 }, (_, i) => minYear + i * 100).map(y => (
                <div key={y} className="absolute w-full border-b border-zinc-800" style={{ top: `${((y - minYear) / (maxYear - minYear)) * 100}%` }}>
                  <span className="text-[8px] text-zinc-500 pl-1">{formatYearShort(y)}</span>
                </div>
              ))}
              <div className="absolute w-full border-t-2 border-blue-500 z-20" style={{ top: `${((year - minYear) / (maxYear - minYear)) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {regionsData.map(region => (
            <div key={region.key} className="flex-1 flex flex-col min-w-0">
              <div className="h-8 flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: region.color }}>
                {region.name}
              </div>
              <div className="flex-1 overflow-y-auto sync-scroll relative" onScroll={handleScroll}>
                <div className="relative" style={{ height: '2400px' }}>
                  <div className="absolute w-full border-t-2 border-blue-500 z-20" style={{ top: `${((year - minYear) / (maxYear - minYear)) * 100}%` }} />
                  {region.boundaries.map((empire, idx) => {
                    const style = getBlockStyle(empire.properties.startYear, empire.properties.endYear);
                    const isActive = empire.properties.startYear <= year && empire.properties.endYear >= year;
                    const height = empire.properties.endYear - empire.properties.startYear;
                    const info = EMPIRE_INFO[empire.properties.name];
                    
                    return (
                      <div key={idx} className={`absolute left-0 right-0 text-white flex flex-col items-center justify-center text-center ${isActive ? 'ring-1 ring-white' : ''}`}
                        style={{ ...style, backgroundColor: empire.properties.color, zIndex: isActive ? 15 : 5 }}>
                        {height > 12 && <span className="font-bold text-[8px] truncate px-1">{empire.properties.name}</span>}
                        {height > 25 && info && <span className="text-[7px] opacity-80 truncate px-1">{info.en}</span>}
                        <span className="text-[7px] opacity-90 absolute top-0.5 right-1">{formatYearShort(empire.properties.startYear)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-48 flex-shrink-0 flex flex-col border-l border-zinc-800 bg-zinc-900/30">
          <div className="p-2 border-b border-zinc-800 flex-shrink-0">
            <div className="relative h-5 bg-zinc-800 rounded-full">
              <div className="absolute top-0 bottom-0 w-0.5 bg-blue-500" style={{ left: `${((year - minYear) / (maxYear - minYear)) * 100}%` }} />
              <input type="range" min={minYear} max={maxYear} value={year} onChange={(e) => setYear(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
            <div className="flex justify-between text-[9px] text-zinc-500 mt-1">
              <span>{formatYearShort(minYear)}</span>
              <span>{formatYearShort(maxYear)}</span>
            </div>
          </div>
          
          <div className="flex-1 p-2 overflow-y-auto">
            <div className="text-sm font-bold mb-2">{year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`}</div>
            {activeEmpires.length > 0 ? (
              <div className="space-y-1">
                {activeEmpires.map((empire, idx) => (
                  <div key={idx} className="p-1.5 rounded bg-zinc-800/50 border-l-2" style={{ borderLeftColor: empire.properties.color }}>
                    <div className="flex items-center gap-1">
                      <span className="px-1 py-0.5 text-[7px] text-white rounded" style={{ backgroundColor: empire.properties.color }}>{REGIONS.find(r => 
                        (r.key === 'china' && ['秦', '汉', '唐', '宋', '元', '明', '清', '隋'].some(p => empire.properties.name.includes(p))) ||
                        (r.key === 'korea' && ['高丽', '朝鲜', '新罗', '百济'].some(p => empire.properties.name.includes(p))) ||
                        (r.key === 'japan' && ['平安', '江户', '奈良'].some(p => empire.properties.name.includes(p))) ||
                        (r.key === 'west' && ['罗马', '拜占庭', '奥斯曼', '帖木儿'].some(p => empire.properties.name.includes(p)))
                      )?.name || '其他'}</span>
                      <span className="font-bold text-xs">{empire.properties.name}</span>
                    </div>
                    <div className="text-[7px] text-zinc-500">{formatYearShort(empire.properties.startYear)} - {formatYearShort(empire.properties.endYear)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-zinc-500 text-center py-4 text-xs">无记录</div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .sync-scroll::-webkit-scrollbar { display: none !important; }
        .sync-scroll { -ms-overflow-style: none !important; scrollbar-width: none !important; }
      `}</style>
    </div>
  );
}
