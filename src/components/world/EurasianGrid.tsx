'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { eurasianBoundaries, eastAsiaBoundaries, getWorldEraBounds, getActiveBoundaries } from '@/lib/history/data/worldBoundaries';
import { formatYear } from '@/lib/history/utils';
import { HISTORY_APP_COLORS } from '@/lib/history/constants';

type GridMode = 'eurasian' | 'east-asia';

interface EurasianGridProps {
  initialMode?: GridMode;
}

interface RegionColumn {
  id: string;
  labelKey: string;
  bgColor: string;
  headerBg: string;
  /** y-position range within the grid (in "virtual pixels" per year) */
  bounds: { minYear: number; maxYear: number };
  /** Polities to show in this column */
  polities: Array<{
    id: string;
    nameKey: string;
    startYear: number;
    endYear: number;
    color: string;
  }>;
}

// Build grid columns from world boundaries
function buildEurasianColumns(mode: GridMode): RegionColumn[] {
  if (mode === 'eurasian') {
    return [
      {
        id: 'china',
        labelKey: 'grid.region.china',
        bgColor: 'bg-red-50/40',
        headerBg: 'bg-red-100 border-red-200',
        bounds: { minYear: -300, maxYear: 1912 },
        polities: eurasianBoundaries
          .filter(b => {
            const name = b.properties.name;
            return ['秦朝', '西汉', '东汉', '唐朝', '宋朝', '元朝', '明朝', '清朝'].includes(name);
          })
          .map(b => ({
            id: b.properties.nameKey,
            nameKey: b.properties.nameKey,
            startYear: b.properties.startYear,
            endYear: b.properties.endYear,
            color: b.properties.color,
          })),
      },
      {
        id: 'korea',
        labelKey: 'grid.region.korea',
        bgColor: 'bg-blue-50/40',
        headerBg: 'bg-blue-100 border-blue-200',
        bounds: { minYear: -200, maxYear: 1912 },
        polities: [
          { id: 'goguryeo', nameKey: 'empire_goguryeo', startYear: -37, endYear: 668, color: '#14B8A6' },
          { id: 'baekje', nameKey: 'empire_baekje', startYear: -18, endYear: 660, color: '#0D9488' },
          { id: 'silla', nameKey: 'empire_silla', startYear: -57, endYear: 935, color: '#06B6D4' },
          { id: 'goryeo', nameKey: 'empire_goryeo', startYear: 918, endYear: 1392, color: '#14B8A6' },
          { id: 'joseon', nameKey: 'empire_joseon', startYear: 1392, endYear: 1912, color: '#0D9488' },
        ],
      },
      {
        id: 'japan',
        labelKey: 'grid.region.japan',
        bgColor: 'bg-pink-50/40',
        headerBg: 'bg-pink-100 border-pink-200',
        bounds: { minYear: -200, maxYear: 1912 },
        polities: [
          { id: 'yamato', nameKey: 'empire_yamato', startYear: -660, endYear: 1185, color: '#EC4899' },
          { id: 'kamakura', nameKey: 'empire_kamakura', startYear: 1185, endYear: 1333, color: '#DB2777' },
          { id: 'muromachi', nameKey: 'empire_muromachi', startYear: 1336, endYear: 1573, color: '#BE185D' },
          { id: 'edo', nameKey: 'empire_edo', startYear: 1603, endYear: 1868, color: '#9D174D' },
        ],
      },
      {
        id: 'central-asia',
        labelKey: 'grid.region.central-asia',
        bgColor: 'bg-amber-50/40',
        headerBg: 'bg-amber-100 border-amber-200',
        bounds: { minYear: -550, maxYear: 1912 },
        polities: [
          { id: 'xiongnu', nameKey: 'empire_xiongnu', startYear: -209, endYear: 460, color: '#F59E0B' },
          { id: 'yuezhi', nameKey: 'empire_yuezhi', startYear: -176, endYear: 450, color: '#D97706' },
          { id: 'kushan', nameKey: 'empire_kushan', startYear: 30, endYear: 375, color: '#CA8A04' },
          { id: 'xianbei', nameKey: 'empire_xianbei', startYear: 200, endYear: 534, color: '#EAB308' },
          { id: 'gagajuddin', nameKey: 'empire_hephthalite', startYear: 420, endYear: 560, color: '#A16207' },
        ],
      },
      {
        id: 'west',
        labelKey: 'grid.region.west',
        bgColor: 'bg-purple-50/40',
        headerBg: 'bg-purple-100 border-purple-200',
        bounds: { minYear: -500, maxYear: 1912 },
        polities: [
          { id: 'rome-republic', nameKey: 'empire_rome-republic', startYear: -500, endYear: -27, color: '#7C3AED' },
          { id: 'rome-empire', nameKey: 'empire_rome-empire', startYear: -27, endYear: 395, color: '#9333EA' },
          { id: 'byzantine', nameKey: 'empire_byzantine', startYear: 395, endYear: 1453, color: '#8B5CF6' },
          { id: 'ottoman', nameKey: 'empire_ottoman', startYear: 1299, endYear: 1922, color: '#A855F7' },
          { id: 'achaemenid', nameKey: 'empire_achaemenid', startYear: -550, endYear: -330, color: '#E11D48' },
          { id: 'parthian', nameKey: 'empire_parthian', startYear: -247, endYear: 224, color: '#BE185D' },
          { id: 'sassanid', nameKey: 'empire_sassanid', startYear: 224, endYear: 651, color: '#9D174D' },
        ],
      },
    ];
  } else {
    // east-asia mode
    return [
      {
        id: 'china',
        labelKey: 'grid.region.china',
        bgColor: 'bg-red-50/40',
        headerBg: 'bg-red-100 border-red-200',
        bounds: { minYear: -221, maxYear: 1912 },
        polities: eastAsiaBoundaries
          .filter(b => {
            const name = b.properties.name;
            return ['秦朝', '西汉', '东汉', '唐朝', '宋朝', '元朝', '明朝', '清朝'].includes(name);
          })
          .map(b => ({
            id: b.properties.nameKey,
            nameKey: b.properties.nameKey,
            startYear: b.properties.startYear,
            endYear: b.properties.endYear,
            color: b.properties.color,
          })),
      },
      {
        id: 'japan',
        labelKey: 'grid.region.japan',
        bgColor: 'bg-pink-50/40',
        headerBg: 'bg-pink-100 border-pink-200',
        bounds: { minYear: -660, maxYear: 1912 },
        polities: [
          { id: 'yamato', nameKey: 'empire_yamato', startYear: -660, endYear: 710, color: '#EC4899' },
          { id: 'nara', nameKey: 'empire_nara', startYear: 710, endYear: 794, color: '#DB2777' },
          { id: 'heian', nameKey: 'empire_heian', startYear: 794, endYear: 1185, color: '#BE185D' },
          { id: 'kamakura', nameKey: 'empire_kamakura', startYear: 1185, endYear: 1333, color: '#9D174D' },
          { id: 'muromachi', nameKey: 'empire_muromachi', startYear: 1336, endYear: 1573, color: '#831843' },
          { id: 'edo', nameKey: 'empire_edo', startYear: 1603, endYear: 1868, color: '#9D174D' },
        ],
      },
      {
        id: 'korea',
        labelKey: 'grid.region.korea',
        bgColor: 'bg-blue-50/40',
        headerBg: 'bg-blue-100 border-blue-200',
        bounds: { minYear: -200, maxYear: 1912 },
        polities: [
          { id: 'goguryeo', nameKey: 'empire_goguryeo', startYear: -37, endYear: 668, color: '#14B8A6' },
          { id: 'baekje', nameKey: 'empire_baekje', startYear: -18, endYear: 660, color: '#0D9488' },
          { id: 'silla', nameKey: 'empire_silla', startYear: -57, endYear: 935, color: '#06B6D4' },
          { id: 'goryeo', nameKey: 'empire_goryeo', startYear: 918, endYear: 1392, color: '#14B8A6' },
          { id: 'joseon', nameKey: 'empire_joseon', startYear: 1392, endYear: 1897, color: '#0D9488' },
        ],
      },
      {
        id: 'vietnam',
        labelKey: 'grid.region.vietnam',
        bgColor: 'bg-green-50/40',
        headerBg: 'bg-green-100 border-green-200',
        bounds: { minYear: -200, maxYear: 1945 },
        polities: [
          { id: 'viet-tribes', nameKey: 'empire_viet-tribes', startYear: -200, endYear: 111, color: '#22C55E' },
          { id: 'ly-dynasty', nameKey: 'empire_ly-dynasty', startYear: 1009, endYear: 1225, color: '#16A34A' },
          { id: 'tran-dynasty', nameKey: 'empire_tran-dynasty', startYear: 1225, endYear: 1400, color: '#15803D' },
          { id: 'le-dynasty', nameKey: 'empire_le-dynasty', startYear: 1428, endYear: 1788, color: '#166534' },
          { id: 'nguyen-dynasty', nameKey: 'empire_nguyen-dynasty', startYear: 1802, endYear: 1945, color: '#14532D' },
        ],
      },
    ];
  }
}

// Convert year to pixel Y position
function yearToY(year: number, minYear: number, maxYear: number, heightPx: number): number {
  return ((year - minYear) / (maxYear - minYear)) * heightPx;
}

const YEAR_HEIGHT = 3; // pixels per year
const MIN_GRID_HEIGHT = 600;

export function EurasianGrid({ initialMode = 'eurasian' }: EurasianGridProps) {
  const t = useTranslations();
  const [mode, setMode] = React.useState<GridMode>(initialMode);
  const [currentYear, setCurrentYear] = React.useState<number>(1);
  const [hoveredPolity, setHoveredPolity] = React.useState<string | null>(null);
  const [selectedPolity, setSelectedPolity] = React.useState<string | null>(null);

  const columns = React.useMemo(() => buildEurasianColumns(mode), [mode]);
  const { min: minYear, max: maxYear } = React.useMemo(() => {
    return getWorldEraBounds(mode);
  }, [mode]);

  const gridHeight = React.useMemo(() => {
    const span = maxYear - minYear;
    return Math.max(MIN_GRID_HEIGHT, span * YEAR_HEIGHT);
  }, [minYear, maxYear]);

  // Get active polities at currentYear
  const activePolities = React.useMemo(() => {
    const active = getActiveBoundaries(currentYear, mode);
    return active;
  }, [currentYear, mode]);

  // Year tick marks (every 100 years)
  const yearTicks = React.useMemo(() => {
    const ticks: number[] = [];
    const startCentury = Math.ceil(minYear / 100) * 100;
    for (let y = startCentury; y <= maxYear; y += 100) {
      ticks.push(y);
    }
    return ticks;
  }, [minYear, maxYear]);

  // Smaller ticks (every 50 years)
  const minorTicks = React.useMemo(() => {
    const ticks: number[] = [];
    const startDecade = Math.ceil(minYear / 50) * 50;
    for (let y = startDecade; y <= maxYear; y += 50) {
      if (y % 100 !== 0) ticks.push(y);
    }
    return ticks;
  }, [minYear, maxYear]);

  // Current year line position
  const currentYearLineY = React.useMemo(() => {
    return yearToY(currentYear, minYear, maxYear, gridHeight);
  }, [currentYear, minYear, maxYear, gridHeight]);

  const handleYearClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const year = Math.round(minYear + (y / gridHeight) * (maxYear - minYear));
    setCurrentYear(Math.max(minYear, Math.min(maxYear, year)));
  };

  return (
    <div className={`flex h-screen flex-col ${HISTORY_APP_COLORS.container.bg} ${HISTORY_APP_COLORS.container.text}`}>
      {/* Header */}
      <header className={`shrink-0 border-b ${HISTORY_APP_COLORS.header.border} ${HISTORY_APP_COLORS.header.bg} px-4 py-3`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-zinc-900">
              🌍 {t('grid.title') || '欧亚对比网格'}
            </h1>
            <div className="flex items-center gap-4 text-sm text-zinc-500 mt-0.5">
              <span className="font-semibold text-zinc-700">
                {formatYear(currentYear)}
              </span>
              <span>|</span>
              <span>
                {activePolities.length} {t('grid.activeEmpires') || '个活跃政权'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode('eurasian')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                mode === 'eurasian'
                  ? 'bg-purple-600 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              🌍 {t('grid.eurasian') || '欧亚'}
            </button>
            <button
              type="button"
              onClick={() => setMode('east-asia')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                mode === 'east-asia'
                  ? 'bg-purple-600 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              🌏 {t('grid.eastAsia') || '东亚'}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main grid area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Grid header (fixed) */}
          <div className="shrink-0 flex border-b border-zinc-200 bg-white z-10">
            {/* Y-axis spacer */}
            <div className="w-16 shrink-0 border-r border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center">
              <span className="text-[10px] text-zinc-400 font-medium">← BCE | CE →</span>
            </div>
            {/* Column headers */}
            {columns.map(col => (
              <div
                key={col.id}
                className={`flex-1 min-w-[120px] border-r border-zinc-200 ${col.headerBg} px-2 py-2 text-center`}
              >
                <span className="text-sm font-semibold text-zinc-700">
                  {t(col.labelKey) || col.id}
                </span>
              </div>
            ))}
          </div>

          {/* Scrollable grid body */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="flex" style={{ height: gridHeight }}>
              {/* Y-axis (year ticks) */}
              <div className="w-16 shrink-0 border-r border-zinc-200 bg-zinc-50 relative">
                {/* Year tick marks */}
                {yearTicks.map(year => {
                  const y = yearToY(year, minYear, maxYear, gridHeight);
                  return (
                    <div
                      key={year}
                      className="absolute left-0 right-0 flex items-center"
                      style={{ top: y }}
                    >
                      <div className="w-8 text-right pr-1 text-[10px] text-zinc-500 leading-none">
                        {formatYear(year)}
                      </div>
                      <div className="flex-1 h-px bg-zinc-300" />
                    </div>
                  );
                })}
                {/* Minor ticks (50 years) */}
                {minorTicks.map(year => {
                  const y = yearToY(year, minYear, maxYear, gridHeight);
                  return (
                    <div
                      key={`minor-${year}`}
                      className="absolute left-12 right-0"
                      style={{ top: y }}
                    >
                      <div className="h-px bg-zinc-200" />
                    </div>
                  );
                })}

                {/* Current year indicator line on Y-axis */}
                <div
                  className="absolute left-0 right-0 h-0.5 bg-red-500 z-10"
                  style={{ top: currentYearLineY }}
                >
                  <div className="absolute -left-1 -top-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </div>
              </div>

              {/* Grid columns */}
              {columns.map(col => (
                <div
                  key={col.id}
                  className={`flex-1 min-w-[120px] relative border-r border-zinc-100 ${col.bgColor} cursor-crosshair`}
                  onClick={handleYearClick}
                >
                  {/* Background grid lines */}
                  {yearTicks.map(year => {
                    const y = yearToY(year, minYear, maxYear, gridHeight);
                    return (
                      <div
                        key={year}
                        className="absolute left-0 right-0 h-px bg-zinc-200/60"
                        style={{ top: y }}
                      />
                    );
                  })}

                  {/* Polity bands */}
                  {col.polities.map(polity => {
                    const topY = yearToY(polity.startYear, minYear, maxYear, gridHeight);
                    const bottomY = yearToY(polity.endYear, minYear, maxYear, gridHeight);
                    const height = Math.max(bottomY - topY, 8);
                    const isHovered = hoveredPolity === polity.id;
                    const isSelected = selectedPolity === polity.id;
                    const isActive = currentYear >= polity.startYear && currentYear <= polity.endYear;

                    return (
                      <div
                        key={polity.id}
                        className="absolute left-1 right-1 rounded-md transition-all duration-150 cursor-pointer group"
                        style={{
                          top: topY,
                          height,
                          backgroundColor: `${polity.color}${isSelected ? '88' : '55'}`,
                          border: `1.5px solid ${polity.color}${isActive ? 'FF' : '99'}`,
                          opacity: isActive ? 1 : 0.7,
                          zIndex: isActive || isSelected ? 10 : isHovered ? 6 : 1,
                          boxShadow: isActive ? `0 0 8px ${polity.color}44` : isSelected ? `0 0 12px ${polity.color}66` : undefined,
                        }}
                        onMouseEnter={() => setHoveredPolity(polity.id)}
                        onMouseLeave={() => setHoveredPolity(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPolity(selectedPolity === polity.id ? null : polity.id);
                        }}
                      >
                        {/* Polity name label */}
                        <div
                          className="absolute left-2 right-2 text-[10px] font-semibold leading-tight truncate transition-opacity"
                          style={{
                            color: polity.color,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            opacity: height > 20 ? 1 : isHovered || isActive ? 1 : 0,
                          }}
                        >
                          {t(polity.nameKey)}
                        </div>

                        {/* Tooltip on hover */}
                        {isHovered && height <= 30 && (
                          <div
                            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-2 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap z-20 shadow-lg"
                            style={{
                              backgroundColor: polity.color,
                              color: 'white',
                            }}
                          >
                            {t(polity.nameKey)} · {formatYear(polity.startYear)}–{formatYear(polity.endYear)}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Current year line */}
                  <div
                    className="absolute left-0 right-0 h-0.5 bg-red-500 z-10 pointer-events-none"
                    style={{ top: currentYearLineY }}
                  >
                    <div className="absolute -left-1 -top-1.5 w-2 h-2 bg-red-500 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid bottom: quick century buttons */}
          <div className={`shrink-0 border-t border-zinc-200 bg-white px-4 py-2 flex items-center gap-1 flex-wrap`}>
            <span className="text-xs text-zinc-500 mr-2">{t('grid.quickJump') || '快速跳转'}:</span>
            {[-500, -300, -200, -100, 0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900].map(year => (
              <button
                key={year}
                type="button"
                onClick={() => setCurrentYear(year)}
                className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                  Math.abs(currentYear - year) < 50
                    ? 'bg-red-100 text-red-700 font-semibold'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {formatYear(year)}
              </button>
            ))}
          </div>
        </div>

        {/* Right sidebar: active polities + navigation */}
        <aside className={`w-52 xl:w-64 shrink-0 border-l border-zinc-200 bg-white flex flex-col overflow-hidden`}>
          {/* Active polities at current year */}
          <div className={`shrink-0 border-b border-zinc-200 ${HISTORY_APP_COLORS.sidebar.header.bg} p-3`}>
            <div className={`text-xs font-semibold uppercase tracking-wide ${HISTORY_APP_COLORS.sidebar.header.text}`}>
              {t('grid.activeAtYear', { year: formatYear(currentYear) }) || `${formatYear(currentYear)} 活跃政权`}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {activePolities.length === 0 ? (
              <div className="text-xs text-zinc-400 p-2 text-center">
                {t('grid.noActive') || '无活跃政权'}
              </div>
            ) : (
              activePolities.map(b => (
                <button
                  key={b.properties.nameKey}
                  type="button"
                  onClick={() => setSelectedPolity(selectedPolity === b.properties.nameKey ? null : b.properties.nameKey)}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-colors ${
                    selectedPolity === b.properties.nameKey
                      ? 'bg-blue-100 ring-1 ring-blue-300'
                      : 'hover:bg-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: b.properties.color }}
                    />
                    <span className="font-medium text-zinc-700 truncate">
                      {t(b.properties.nameKey)}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-400 ml-3.5">
                    {formatYear(b.properties.startYear)}–{formatYear(b.properties.endYear)}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Mini timeline navigation */}
          <div className={`shrink-0 border-t border-zinc-200 bg-zinc-50 p-3`}>
            <div className="text-xs font-semibold text-zinc-600 mb-2">
              {t('grid.timeline') || '时间导航'}
            </div>
            <div className="relative h-24 bg-zinc-100 rounded-lg overflow-hidden">
              {/* Mini polity bands */}
              {columns.flatMap(col =>
                col.polities.map(polity => {
                  const topY = yearToY(polity.startYear, minYear, maxYear, 96);
                  const bottomY = yearToY(polity.endYear, minYear, maxYear, 96);
                  const height = Math.max(bottomY - topY, 2);
                  const isActive = currentYear >= polity.startYear && currentYear <= polity.endYear;
                  return (
                    <div
                      key={polity.id}
                      className="absolute left-0 right-0 rounded-sm transition-opacity"
                      style={{
                        top: topY,
                        height,
                        backgroundColor: `${polity.color}${isActive ? 'FF' : '66'}`,
                      }}
                    />
                  );
                })
              )}
              {/* Current year line */}
              <div
                className="absolute left-0 right-0 h-0.5 bg-red-500 z-10"
                style={{ top: currentYearLineY / (gridHeight / 96) }}
              />
            </div>

            {/* Timeline controls */}
            <div className="flex items-center justify-between mt-2">
              <button
                type="button"
                onClick={() => setCurrentYear(y => Math.max(minYear, y - 100))}
                disabled={currentYear <= minYear}
                className="px-2 py-1 rounded bg-zinc-200 text-zinc-600 text-xs hover:bg-zinc-300 disabled:opacity-50"
              >
                ◀ -100
              </button>
              <button
                type="button"
                onClick={() => setCurrentYear(y => Math.min(maxYear, y + 100))}
                disabled={currentYear >= maxYear}
                className="px-2 py-1 rounded bg-zinc-200 text-zinc-600 text-xs hover:bg-zinc-300 disabled:opacity-50"
              >
                +100 ▶
              </button>
            </div>

            <div className="flex items-center gap-1 mt-2 flex-wrap">
              <button
                type="button"
                onClick={() => setCurrentYear(y => Math.max(minYear, y - 50))}
                className="px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-600 text-[10px] hover:bg-zinc-300"
              >
                -50
              </button>
              <button
                type="button"
                onClick={() => setCurrentYear(y => Math.min(maxYear, y + 50))}
                className="px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-600 text-[10px] hover:bg-zinc-300"
              >
                +50
              </button>
              <button
                type="button"
                onClick={() => setCurrentYear(1)}
                className="px-1.5 py-0.5 rounded bg-red-100 text-red-600 text-[10px] hover:bg-red-200 ml-auto"
              >
                {t('grid.ce1') || '公元1年'}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
