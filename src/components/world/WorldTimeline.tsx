'use client';

import * as React from 'react';
import ReactECharts from 'echarts-for-react';
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

// 地区配置
interface RegionConfig {
  key: string;
  name: string;
  color: string;
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

const REGIONS: RegionConfig[] = [
  { key: 'china', name: '中国', color: '#DC2626' },
  { key: 'korea', name: '朝鲜半岛', color: '#10B981' },
  { key: 'japan', name: '日本', color: '#8B5CF6' },
  { key: 'steppe', name: '中亚/草原', color: '#F59E0B' },
  { key: 'west', name: '西方', color: '#3B82F6' },
];

export function WorldTimeline({ minYear, maxYear }: WorldTimelineProps) {
  const [year, setYear] = React.useState(1);
  const chartRef = React.useRef<ReactECharts>(null);
  
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
  
  // 按地区分组
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
      
      return {
        ...region,
        children: boundaries.map(b => ({
          name: b.properties.name,
          value: b.properties.endYear - b.properties.startYear,
          startYear: b.properties.startYear,
          endYear: b.properties.endYear,
          itemStyle: {
            color: b.properties.color,
          },
        })),
      };
    });
  }, [allBoundaries]);
  
  // 当前活跃帝国
  const activeEmpires = React.useMemo(() => {
    return allBoundaries.filter(b => 
      b.properties.startYear <= year && b.properties.endYear >= year
    );
  }, [allBoundaries, year]);

  // ECharts 配置
  const getOption = () => ({
    tooltip: {
      formatter: (info: any) => {
        const value = info.value;
        const treePathInfo = info.treePathInfo;
        const treePath = [];
        for (let i = 1; i < treePathInfo.length; i++) {
          treePath.push(treePathInfo[i].name);
        }
        return [
          `<div class="font-bold">${info.name}</div>`,
          `持续时间: ${value} 年`,
        ].join('');
      },
    },
    series: [
      {
        name: '帝国疆域',
        type: 'treemap',
        width: '100%',
        height: '100%',
        label: {
          show: true,
          formatter: '{b}',
          fontSize: 12,
          color: '#fff',
        },
        itemStyle: {
          borderColor: '#1a1a1a',
          borderWidth: 2,
          gapWidth: 2,
        },
        upperLabel: {
          show: true,
          height: 30,
          color: '#fff',
          fontSize: 14,
          fontWeight: 'bold',
        },
        levels: [
          {
            itemStyle: {
              borderColor: '#1a1a1a',
              borderWidth: 0,
              gapWidth: 5,
            },
            upperLabel: {
              show: false,
            },
          },
          {
            itemStyle: {
              borderColor: '#1a1a1a',
              borderWidth: 5,
              gapWidth: 1,
            },
            upperLabel: {
              show: true,
              backgroundColor: 'rgba(0,0,0,0.3)',
              color: '#fff',
              fontSize: 14,
              fontWeight: 'bold',
            },
          },
          {
            itemStyle: {
              borderColor: '#1a1a1a',
              borderWidth: 5,
              gapWidth: 1,
            },
            upperLabel: {
              show: true,
              color: '#fff',
            },
          },
        ],
        data: regionsData.filter(r => r.children.length > 0),
      },
    ],
  });

  // 年份变化时高亮当前帝国
  React.useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current.getEchartsInstance();
      chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
      });
      chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        name: activeEmpires.map(e => e.properties.name),
      });
    }
  }, [year, activeEmpires]);

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-white">
      {/* 顶部标题 */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">欧亚对比</h1>
          <div className="text-3xl font-bold text-blue-400">{formatYear(year)}</div>
          <div className="text-zinc-400">{activeEmpires.length} 个帝国活跃</div>
        </div>
      </header>

      {/* 主内容 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：Treemap */}
        <div className="w-2/3 p-4">
          <ReactECharts
            ref={chartRef}
            option={getOption()}
            style={{ height: '100%', width: '100%' }}
          />
        </div>

        {/* 右侧：年份选择和详情 */}
        <div className="w-1/3 flex flex-col border-l border-zinc-800">
          {/* 年份滑块 */}
          <div className="p-4 border-b border-zinc-800">
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
            <h3 className="text-xl font-bold mb-4">{formatYear(year)} 年的世界</h3>
            
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
