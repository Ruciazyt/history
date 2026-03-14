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

const EMPIRE_INFO: Record<string, { en: string; desc: string }> = {
  '秦朝': { en: 'Qin Dynasty', desc: 'First unified empire' },
  '西汉': { en: 'Western Han', desc: 'Golden age of Confucianism' },
  '东汉': { en: 'Eastern Han', desc: 'Han dynasty revival' },
  '唐朝': { en: 'Tang Dynasty', desc: 'Golden age of Chinese culture' },
  '宋朝': { en: 'Song Dynasty', desc: 'Economic prosperity' },
  '元朝': { en: 'Yuan Dynasty', desc: 'Mongol rule over China' },
  '明朝': { en: 'Ming Dynasty', desc: 'Age of exploration' },
  '清朝': { en: 'Qing Dynasty', desc: 'Last imperial dynasty' },
  '隋朝': { en: 'Sui Dynasty', desc: 'Reunification of China' },
  '三国': { en: 'Three Kingdoms', desc: 'Warring states period' },
  '晋朝': { en: 'Jin Dynasty', desc: '短暂统一' },
  '南北朝': { en: 'Southern & Northern Dynasties', desc: '分裂时期' },
  '五代': { en: 'Five Dynasties', desc: '五代十国' },
  '罗马共和国': { en: 'Roman Republic', desc: 'Ancient Rome' },
  '罗马帝国': { en: 'Roman Empire', desc: 'Pax Romana' },
  '拜占庭帝国': { en: 'Byzantine Empire', desc: 'Eastern Roman Empire' },
  '奥斯曼帝国': { en: 'Ottoman Empire', desc: 'Turkish empire' },
  '阿契美尼德波斯': { en: 'Achaemenid Persia', desc: 'First Persian Empire' },
  '帕提亚帝国': { en: 'Parthian Empire', desc: 'Persian Hellenistic state' },
  '萨珊波斯': { en: 'Sassanid Empire', desc: 'Persian empire' },
  '萨法维波斯': { en: 'Safavid Dynasty', desc: 'Persian empire' },
  '倭马亚王朝': { en: 'Umayyad Caliphate', desc: 'Arab caliphate' },
  '阿拔斯王朝': { en: 'Abbasid Caliphate', desc: 'Islamic golden age' },
  '帖木儿帝国': { en: 'Timurid Empire', desc: 'Central Asian empire' },
  '亚历山大帝国': { en: 'Alexandrian Empire', desc: 'Macedonian empire' },
  '孔雀王朝': { en: 'Maurya Empire', desc: 'Indian empire' },
  '莫卧儿帝国': { en: 'Mughal Empire', desc: 'Indian empire' },
  '高丽王朝': { en: 'Goryeo Dynasty', desc: 'Korean dynasty' },
  '朝鲜王朝': { en: 'Joseon Dynasty', desc: 'Korean dynasty' },
  '平安时代': { en: 'Heian Period', desc: 'Japanese golden age' },
  '江户时代': { en: 'Edo Period', desc: 'Japanese isolation' },
  '奈良时代': { en: 'Nara Period', desc: 'Japanese capital' },
  '镰仓时代': { en: 'Kamakura Period', desc: 'Samurai government' },
  '室町时代': { en: 'Muromachi Period', desc: 'Japanese civil war' },
  '飞鸟时代': { en: 'Asuka Period', desc: 'Japanese formation' },
  '李朝': { en: 'Ly Dynasty', desc: 'Vietnamese dynasty' },
  '黎朝': { en: 'Le Dynasty', desc: 'Vietnamese dynasty' },
  '阮朝': { en: 'Nguyen Dynasty', desc: 'Vietnamese dynasty' },
  '渤海': { en: 'Balhae', desc: 'Korean kingdom' },
};

const REGIONS = [
  { key: 'china', name: '中国', color: '#DC2626' },
  { key: 'korea', name: '朝鲜半岛', color: '#10B981' },
  { key: 'japan', name: '日本', color: '#8B5CF6' },
  { key: 'steppe', name: '中亚/草原', color: '#F59E0B' },
  { key: 'west', name: '西方', color: '#3B82F6' },
];

// 合并完全相同的政权块
function mergeEmpires(boundaries: WorldBoundary[]): WorldBoundary[] {
  const nameMap = new Map<string, WorldBoundary[]>();
  
  boundaries.forEach(b => {
    const name = b.properties.name;
    if (!nameMap.has(name)) {
      nameMap.set(name, []);
    }
    nameMap.get(name)!.push(b);
  });
  
  const merged: WorldBoundary[] = [];
  nameMap.forEach((items) => {
    if (items.length === 1) {
      merged.push(items[0]);
    } else {
      // 检查是否有完全相同的起止时间
      const timeKeyMap = new Map<string, WorldBoundary[]>();
      items.forEach(item => {
        const key = `${item.properties.startYear}-${item.properties.endYear}`;
        if (!timeKeyMap.has(key)) {
          timeKeyMap.set(key, []);
        }
        timeKeyMap.get(key)!.push(item);
      });
      
      timeKeyMap.forEach((timeItems) => {
        const largest = timeItems.reduce((a, b) => {
          const aLen = a.properties.endYear - a.properties.startYear;
          const bLen = b.properties.endYear - b.properties.startYear;
          return aLen >= bLen ? a : b;
        });
        merged.push(largest);
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

interface WorldTimelineProps {
  minYear: number;
  maxYear: number;
}

// Canvas 绘制时间轴
function TimelineCanvas({ 
  boundaries, 
  year, 
  minYear, 
  maxYear, 
  color,
  onHover 
}: { 
  boundaries: WorldBoundary[]; 
  year: number; 
  minYear: number; 
  maxYear: number;
  color: string;
  onHover?: (empire: WorldBoundary | null) => void;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
    ctx.scale(dpr, dpr);
    
    const totalYears = maxYear - minYear;
    
    // 绘制当前年份线
    const yearY = ((year - minYear) / totalYears) * dimensions.height;
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, yearY);
    ctx.lineTo(dimensions.width, yearY);
    ctx.stroke();
    
    // 绘制帝国块
    boundaries.forEach(empire => {
      const startY = ((empire.properties.startYear - minYear) / totalYears) * dimensions.height;
      const endY = ((empire.properties.endYear - minYear) / totalYears) * dimensions.height;
      const height = endY - startY;
      const isActive = empire.properties.startYear <= year && empire.properties.endYear >= year;
      
      // 绘制色块
      ctx.fillStyle = empire.properties.color;
      if (isActive) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(2, startY, dimensions.width - 4, height);
      }
      ctx.fillRect(2, startY, dimensions.width - 4, Math.max(height, 8));
      
      // 绘制文字（只在块足够大时显示）
      if (height > 20) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(empire.properties.name, dimensions.width / 2, startY + height / 2);
        
        // 英文名
        const info = EMPIRE_INFO[empire.properties.name];
        if (info && height > 35) {
          ctx.font = '7px sans-serif';
          ctx.fillStyle = 'rgba(255,255,255,0.8)';
          ctx.fillText(info.en, dimensions.width / 2, startY + height / 2 + 10);
        }
        
        // 开始时间（右上角）
        ctx.font = '7px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(formatYearShort(empire.properties.startYear), dimensions.width - 4, startY + 8);
      }
    });
  }, [boundaries, year, dimensions, minYear, maxYear]);

  return (
    <canvas 
      ref={canvasRef}
      className="absolute top-0 left-0"
    />
  );
}

export function WorldTimeline({ minYear, maxYear }: WorldTimelineProps) {
  const [year, setYear] = React.useState(-300);
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
      const merged = mergeEmpires(boundaries);
      return { ...region, boundaries: merged };
    });
  }, [allBoundaries]);
  
  const activeEmpires = React.useMemo(() => {
    return allBoundaries.filter(b => 
      b.properties.startYear <= year && b.properties.endYear >= year
    );
  }, [allBoundaries, year]);

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
      <header className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">欧亚对比</h1>
          <div className="text-xl font-bold text-blue-400">{year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`}</div>
          <div className="text-zinc-400 text-sm">{activeEmpires.length} 个政权</div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧年份列 - Canvas */}
        <div className="w-12 flex-shrink-0 flex flex-col">
          <div className="h-8 border-b border-zinc-800 bg-zinc-900 flex items-center justify-center text-[10px] text-zinc-500">年份</div>
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto sync-scroll relative" onScroll={handleScroll}>
            <TimelineCanvas 
              boundaries={allBoundaries}
              year={year}
              minYear={minYear}
              maxYear={maxYear}
              color="#3b82f6"
            />
          </div>
        </div>

        {/* 中间地区列 - Canvas */}
        <div className="flex-1 flex">
          {regionsData.map(region => (
            <div key={region.key} className="flex-1 flex flex-col min-w-0">
              <div className="h-8 flex items-center justify-center text-xs font-bold flex-shrink-0 border-b-0" style={{ backgroundColor: region.color }}>
                {region.name}
              </div>
              <div className="flex-1 overflow-y-auto sync-scroll relative" onScroll={handleScroll}>
                <TimelineCanvas 
                  boundaries={region.boundaries}
                  year={year}
                  minYear={minYear}
                  maxYear={maxYear}
                  color={region.color}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 右侧详情 */}
        <div className="w-56 flex-shrink-0 flex flex-col border-l border-zinc-800 bg-zinc-900/30">
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
            <h3 className="text-sm font-bold mb-2">{year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`}</h3>
            
            {activeEmpires.length > 0 ? (
              <div className="space-y-1">
                {activeEmpires.map((empire, idx) => {
                  const region = REGIONS.find(r => {
                    const name = empire.properties.name;
                    if (r.key === 'china') return ['秦', '汉', '唐', '宋', '元', '明', '清', '隋', '三国', '晋', '南北朝', '五代'].some(p => name.includes(p));
                    if (r.key === 'korea') return ['高丽', '朝鲜', '新罗', '百济', '伽倻', '渤海'].some(p => name.includes(p));
                    if (r.key === 'japan') return ['平安', '江户', '奈良', '镰仓', '室町', '飞鸟', '大和'].some(p => name.includes(p));
                    if (r.key === 'west') return ['罗马', '拜占庭', '奥斯曼', '波斯', '亚历山大', '帕提亚', '萨珊', '阿拉伯', '倭马亚', '阿拔斯', '帖木儿'].some(p => name.includes(p));
                    return false;
                  });
                  const info = EMPIRE_INFO[empire.properties.name] || { en: '', desc: '' };
                  
                  return (
                    <div key={idx} className="p-1.5 rounded bg-zinc-800/50 border-l-2" style={{ borderLeftColor: empire.properties.color }}>
                      <div className="flex items-center gap-1">
                        <span className="px-1 py-0.5 text-[8px] text-white rounded" style={{ backgroundColor: empire.properties.color }}>{region?.name || '其他'}</span>
                        <span className="font-bold text-xs">{empire.properties.name}</span>
                      </div>
                      {info.en && <div className="text-[8px] text-zinc-400 mt-0.5">{info.en}</div>}
                      <div className="text-[8px] text-zinc-500 mt-0.5">{formatYearShort(empire.properties.startYear)} - {formatYearShort(empire.properties.endYear)}</div>
                    </div>
                  );
                })}
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
