'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { eurasianBoundaries, eastAsiaBoundaries, getWorldEraBounds, getActiveBoundaries, type WorldBoundary } from '@/lib/history/data/worldBoundaries';
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

/** Region classification helper: categorize a boundary into a region column */
type RegionId = 'china' | 'korea' | 'japan' | 'central-asia' | 'west' | 'vietnam' | 'other';

const CHINA_NAMES = new Set(['秦朝', '西汉', '东汉', '唐朝', '宋朝', '元朝', '明朝', '清朝']);
const KOREA_NAMES = new Set(['高丽王朝', '朝鲜王朝']);
const JAPAN_NAMES = new Set(['平安时代', '江户时代', '飞鸟时代', '室町时代', '弥生时代', '大和时代', '奈良时代']);
const VIETNAM_NAMES = new Set(['李朝', '黎朝', '阮朝']);
// Central Asia: Mongolian, Indian-subcontinent, Southeast Asian maritime empires
const CENTRAL_ASIA_NAMES = new Set(['蒙古帝国', '孔雀王朝', '贵霜帝国', '莫卧儿帝国', '印度河文明', '萨塔瓦哈纳', '室利佛逝', '笈多帝国', '朱罗帝国']);
// West: Rome, Persian, Islamic, Hellenistic, Egyptian, Mesopotamian empires (prefix matches for names with suffixes)
const WEST_NAMES = new Set(['罗马', '拜占庭', '奥斯曼', '波斯', '阿契美尼德', '帕提亚', '萨珊', '萨法维', '亚历山大', '帖木儿', '阿拔斯', '倭马亚', '古埃及', '托勒密埃及', '亚述', '巴比伦', '阿卡德', '赫梯']);
// Extended matches: prefixes for boundary names that have additional suffixes
const CHINA_NAMESMatches = ['蜀', '吴', '晋', '隋', '南北朝', '五代', '三国'];
const KOREA_NAMESMatches: string[] = [];
const JAPAN_NAMESMatches: string[] = [];
const VIETNAM_NAMESMatches: string[] = [];
const CENTRAL_ASIA_NAMESMatches: string[] = ['贵霜', '笈多', '朱罗', '希腊-巴克特里亚'];
const WEST_NAMESMatches = ['罗马', '拜占庭', '奥斯曼', '波斯', '阿契美尼德', '帕提亚', '萨珊', '萨法维', '亚历山大', '帖木儿', '阿拔斯', '倭马亚', '塞琉古', '亚述', '巴比伦', '阿卡德', '赫梯', '神圣', '继业者'];

/** Era band configuration: defines historical period dividers shown on the grid */
interface EraBandDef {
  labelKey: string;
  /** Background CSS class applied to the era band in the grid column */
  bgClass: string;
  /** Label badge CSS class shown on the Y-axis */
  badgeClass: string;
}

export const ERA_BANDS: EraBandDef[] = [
  { labelKey: 'grid.eraBand.ancient',    bgClass: 'bg-amber-50/70',   badgeClass: 'bg-amber-100/80 text-amber-700' },
  { labelKey: 'grid.eraBand.medieval',   bgClass: 'bg-stone-50/60',   badgeClass: 'bg-stone-200/80 text-stone-700' },
  { labelKey: 'grid.eraBand.earlyModern', bgClass: 'bg-blue-50/50',   badgeClass: 'bg-blue-100/80 text-blue-700' },
];

/** Era band boundary years (chronological order)
 * 476 = Fall of Western Roman Empire (476 CE)
 * 1500 = Age of Discovery / Early Modern threshold
 */
export const ERA_BOUNDARY_YEARS = [476, 1500] as const;

/** Returns the era band index (0=ancient, 1=medieval, 2=earlyModern) for a given year */
export function getEraBandIndex(year: number): number {
  if (year < ERA_BOUNDARY_YEARS[0]) return 0;
  if (year < ERA_BOUNDARY_YEARS[1]) return 1;
  return 2;
}

/** Quick-jump century buttons shown at the bottom of the grid */
export const QUICK_JUMP_YEARS = [
  -2500, -2000, -1500, -1000, -500,
  -300, -200, -100, 0, 100, 200, 300, 400, 500,
  600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500,
  1600, 1700, 1800, 1900,
] as const;

export function classifyRegion(boundary: WorldBoundary): RegionId {
  const name = boundary.properties.name;
  // Use prefix matching since boundary names include suffixes (e.g. "罗马帝国" matches "罗马")
  if (CHINA_NAMES.has(name) || CHINA_NAMESMatches.some(n => name.startsWith(n))) return 'china';
  if (KOREA_NAMES.has(name) || KOREA_NAMESMatches.some(n => name.startsWith(n))) return 'korea';
  if (JAPAN_NAMES.has(name) || JAPAN_NAMESMatches.some(n => name.startsWith(n))) return 'japan';
  if (VIETNAM_NAMES.has(name) || VIETNAM_NAMESMatches.some(n => name.startsWith(n))) return 'vietnam';
  if (CENTRAL_ASIA_NAMES.has(name) || CENTRAL_ASIA_NAMESMatches.some(n => name.startsWith(n))) return 'central-asia';
  if (WEST_NAMES.has(name) || WEST_NAMESMatches.some(n => name.startsWith(n))) return 'west';
  return 'other';
}

/** Column definitions with region metadata */
const COLUMN_DEFINITIONS: Record<RegionId, { labelKey: string; bgColor: string; headerBg: string }> = {
  china: { labelKey: 'grid.region.china', bgColor: 'bg-red-50/40', headerBg: 'bg-red-100 border-red-200' },
  korea: { labelKey: 'grid.region.korea', bgColor: 'bg-blue-50/40', headerBg: 'bg-blue-100 border-blue-200' },
  japan: { labelKey: 'grid.region.japan', bgColor: 'bg-pink-50/40', headerBg: 'bg-pink-100 border-pink-200' },
  'central-asia': { labelKey: 'grid.region.central-asia', bgColor: 'bg-amber-50/40', headerBg: 'bg-amber-100 border-amber-200' },
  west: { labelKey: 'grid.region.west', bgColor: 'bg-purple-50/40', headerBg: 'bg-purple-100 border-purple-200' },
  vietnam: { labelKey: 'grid.region.vietnam', bgColor: 'bg-green-50/40', headerBg: 'bg-green-100 border-green-200' },
  other: { labelKey: 'grid.region.other', bgColor: 'bg-zinc-50/40', headerBg: 'bg-zinc-100 border-zinc-200' },
};

// Build grid columns from world boundaries (deduplicated, using shared data source)
export function buildEurasianColumns(mode: GridMode): RegionColumn[] {
  const boundaries = mode === 'eurasian' ? eurasianBoundaries : eastAsiaBoundaries;
  const { min, max } = getWorldEraBounds(mode);

  // Group boundaries by region
  const byRegion = new Map<RegionId, WorldBoundary[]>();
  for (const b of boundaries) {
    const region = classifyRegion(b);
    if (!byRegion.has(region)) byRegion.set(region, []);
    byRegion.get(region)!.push(b);
  }

  // Build columns for regions that have data
  const columns: RegionColumn[] = [];
  for (const [regionId, regionBoundaries] of byRegion) {
    if (regionBoundaries.length === 0) continue;
    const def = COLUMN_DEFINITIONS[regionId];
    columns.push({
      id: regionId,
      labelKey: def.labelKey,
      bgColor: def.bgColor,
      headerBg: def.headerBg,
      bounds: { minYear: min, maxYear: max },
      polities: regionBoundaries.map(b => ({
        id: b.properties.nameKey,
        nameKey: b.properties.nameKey,
        startYear: b.properties.startYear,
        endYear: b.properties.endYear,
        color: b.properties.color,
      })),
    });
  }

  // Ensure consistent column order
  const order: RegionId[] = ['china', 'japan', 'korea', 'vietnam', 'central-asia', 'west'];
  columns.sort((a, b) => {
    const ai = order.indexOf(a.id as RegionId);
    const bi = order.indexOf(b.id as RegionId);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return columns;
}

// Convert year to pixel Y position
export function yearToY(year: number, minYear: number, maxYear: number, heightPx: number): number {
  return ((year - minYear) / (maxYear - minYear)) * heightPx;
}

const YEAR_HEIGHT = 8; // pixels per year
const MIN_GRID_HEIGHT = 1200;

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

  // Per-column active polity count for column header badges
  const activeCountByColumn = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const col of columns) {
      counts[col.id] = col.polities.filter(
        p => currentYear >= p.startYear && currentYear <= p.endYear
      ).length;
    }
    return counts;
  }, [columns, currentYear]);

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

  const handleYearClick = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const year = Math.round(minYear + (y / gridHeight) * (maxYear - minYear));
    setCurrentYear(Math.max(minYear, Math.min(maxYear, year)));
  }, [minYear, maxYear, gridHeight]);

  return (
    <div className={`flex h-screen flex-col ${HISTORY_APP_COLORS.container.bg} ${HISTORY_APP_COLORS.container.text}`}>
      {/* Header */}
      <header className={`shrink-0 border-b ${HISTORY_APP_COLORS.header.border} ${HISTORY_APP_COLORS.header.bg} px-4 py-3`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-zinc-900">
              🌍 {t('grid.title')}
            </h1>
            <div className="flex items-center gap-4 text-sm text-zinc-500 mt-0.5">
              <span className="font-semibold text-zinc-700">
                {formatYear(currentYear)}
              </span>
              <span>|</span>
              <span>
                {activePolities.length} {t('grid.activeEmpires')}
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
              🌍 {t('grid.eurasian')}
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
              🌏 {t('grid.eastAsia')}
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
                className={`flex-1 min-w-[160px] sm:min-w-[200px] border-r border-zinc-200 ${col.headerBg} px-3 py-2.5 text-center flex flex-col items-center gap-0.5`}
              >
                <span className="text-base font-semibold text-zinc-700">
                  {t(col.labelKey) || col.id}
                </span>
                {(activeCountByColumn[col.id] ?? 0) > 0 && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-white/80 text-zinc-600 ring-1 ring-zinc-200">
                    {activeCountByColumn[col.id] ?? 0}
                  </span>
                )}
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

                {/* Year 0 — BCE/CE separator marker */}
                {minYear < 0 && maxYear > 0 && (() => {
                  const y0 = yearToY(0, minYear, maxYear, gridHeight);
                  return (
                    <div
                      className="absolute left-0 right-0 flex items-center pointer-events-none z-20"
                      style={{ top: y0 }}
                    >
                      <div className="w-8 text-right pr-1 text-[10px] font-bold text-purple-600 leading-none">
                        0
                      </div>
                      <div className="flex-1 h-px bg-purple-400" />
                    </div>
                  );
                })()}

                {/* Ancient era label at top when grid starts before 500 */}
                {minYear < ERA_BOUNDARY_YEARS[0] && ERA_BANDS[0] && (
                  <div
                    className="absolute left-0 right-0 flex items-center pointer-events-none z-20"
                    style={{ top: 0 }}
                  >
                    <div className={`w-10 text-[9px] font-semibold px-0.5 text-center rounded-sm ${ERA_BANDS[0].badgeClass}`}>
                      {t(ERA_BANDS[0].labelKey)}
                    </div>
                    <div className="flex-1 h-px bg-amber-300/60" />
                  </div>
                )}

                {/* Era boundary labels */}
                {ERA_BOUNDARY_YEARS.map((boundaryYear, idx) => {
                  if (boundaryYear <= minYear || boundaryYear >= maxYear) return null;
                  const y = yearToY(boundaryYear, minYear, maxYear, gridHeight);
                  // The label belongs to the era AFTER this boundary
                  const bandIdx = idx + 1; // ERA_BANDS[0] = ancient (before 500), [1] = medieval, [2] = earlyModern
                  const band = ERA_BANDS[bandIdx];
                  if (!band) return null;
                  return (
                    <div
                      key={boundaryYear}
                      className="absolute left-0 right-0 flex items-center pointer-events-none z-20"
                      style={{ top: y }}
                    >
                      <div className={`w-10 text-[9px] font-semibold px-0.5 text-center rounded-sm ${band.badgeClass}`}>
                        {t(band.labelKey)}
                      </div>
                      <div className="flex-1 h-px bg-amber-300/60" />
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
                  className={`flex-1 min-w-[160px] sm:min-w-[200px] relative border-r border-zinc-100 ${col.bgColor} cursor-crosshair overflow-hidden`}
                  onClick={handleYearClick}
                >
                  {/* Era band backgrounds */}
                  {[
                    { band: ERA_BANDS[0], start: minYear, end: ERA_BOUNDARY_YEARS[0] },
                    { band: ERA_BANDS[1], start: ERA_BOUNDARY_YEARS[0], end: ERA_BOUNDARY_YEARS[1] },
                    { band: ERA_BANDS[2], start: ERA_BOUNDARY_YEARS[1], end: maxYear },
                  ].map(({ band, start, end }) => {
                    if (!band) return null;
                    const topY = yearToY(start, minYear, maxYear, gridHeight);
                    const bottomY = yearToY(end, minYear, maxYear, gridHeight);
                    const height = Math.max(bottomY - topY, 2);
                    return (
                      <div
                        key={band.labelKey}
                        className={`absolute left-0 right-0 pointer-events-none ${band.bgClass}`}
                        style={{ top: topY, height }}
                      />
                    );
                  })}

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

                  {/* Era boundary separator lines across each column */}
                  {ERA_BOUNDARY_YEARS.map(boundaryYear => {
                    if (boundaryYear <= minYear || boundaryYear >= maxYear) return null;
                    const y = yearToY(boundaryYear, minYear, maxYear, gridHeight);
                    return (
                      <div
                        key={`era-line-${boundaryYear}`}
                        className="absolute left-0 right-0 h-px bg-amber-400/50 pointer-events-none z-[3]"
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
                        {/* Polity name label - centered, larger, bold */}
                        <div
                          className="absolute inset-x-2 text-base font-bold leading-tight text-center truncate pointer-events-none select-none"
                          style={{
                            color: polity.color,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            opacity: height > 20 ? 1 : isHovered || isActive ? 1 : 0,
                            textShadow: '0 1px 2px rgba(255,255,255,0.8), 0 -1px 2px rgba(255,255,255,0.8)',
                          }}
                        >
                          {t(polity.nameKey)}
                        </div>
                        {/* Start year - top right corner */}
                        <div
                          className="absolute right-2 top-0.5 text-[10px] font-medium opacity-75"
                          style={{ color: polity.color }}
                        >
                          {formatYear(polity.startYear)}
                        </div>

                        {/* End year - bottom right corner (only for tall bands where tooltip doesn't appear) */}
                        {height > 20 && (
                          <div
                            className="absolute right-2 bottom-0.5 text-[10px] font-medium opacity-75"
                            style={{ color: polity.color }}
                          >
                            {formatYear(polity.endYear)}
                          </div>
                        )}

                        {/* Tooltip on hover — flips above/below based on proximity to grid edge */}
                        {isHovered && height <= 30 && (() => {
                          const tooltipFlip = topY < 40; // flip above when near top edge
                          return (
                            <div
                              className={`absolute left-1/2 -translate-x-1/2 ${tooltipFlip ? 'top-full mt-1' : 'bottom-full mb-1'} px-2 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap z-20 shadow-lg`}
                              style={{
                                backgroundColor: polity.color,
                                color: 'white',
                              }}
                            >
                              {t(polity.nameKey)} · {formatYear(polity.startYear)}–{formatYear(polity.endYear)}
                            </div>
                          );
                        })()}
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
            <span className="text-xs text-zinc-500 mr-2">{t('grid.quickJump')}:</span>
            {QUICK_JUMP_YEARS.map(year => {
              const eraIdx = getEraBandIndex(year);
              const eraClasses = [
                'bg-amber-50 text-amber-700 hover:bg-amber-100',
                'bg-stone-100 text-stone-600 hover:bg-stone-200',
                'bg-blue-50 text-blue-700 hover:bg-blue-100',
              ];
              const isCurrent = Math.abs(currentYear - year) < 50;
              return (
                <button
                  key={year}
                  type="button"
                  onClick={() => setCurrentYear(year)}
                  className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                    isCurrent
                      ? 'bg-red-100 text-red-700 font-semibold ring-1 ring-red-200'
                      : `${eraClasses[eraIdx]} font-medium`
                  }`}
                  title={t(ERA_BANDS[eraIdx]!.labelKey)}
                >
                  {formatYear(year)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right sidebar: active polities + navigation */}
        <aside className={`w-44 xl:w-56 shrink-0 border-l border-zinc-200 bg-white flex flex-col overflow-hidden`}>
          {/* Active polities at current year */}
          <div className={`shrink-0 border-b border-zinc-200 ${HISTORY_APP_COLORS.sidebar.header.bg} p-3`}>
            <div className={`text-xs font-semibold uppercase tracking-wide ${HISTORY_APP_COLORS.sidebar.header.text}`}>
              {t('grid.activeAtYear', { year: formatYear(currentYear) })}
            </div>
            <div className={`mt-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-md w-fit ${ERA_BANDS[getEraBandIndex(currentYear)]!.badgeClass}`}>
              {t(ERA_BANDS[getEraBandIndex(currentYear)]!.labelKey)}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {activePolities.length === 0 ? (
              <div className="text-xs text-zinc-400 p-2 text-center">
                {t('grid.noActive')}
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
              {t('grid.timeline')}
            </div>
            <div className="relative h-24 bg-zinc-100 rounded-lg overflow-hidden">
              {/* Era band backgrounds for visual context */}
              {[
                { band: ERA_BANDS[0], start: minYear, end: ERA_BOUNDARY_YEARS[0] },
                { band: ERA_BANDS[1], start: ERA_BOUNDARY_YEARS[0], end: ERA_BOUNDARY_YEARS[1] },
                { band: ERA_BANDS[2], start: ERA_BOUNDARY_YEARS[1], end: maxYear },
              ].map(({ band, start, end }) => {
                if (!band) return null;
                const topY = yearToY(start, minYear, maxYear, 96);
                const bottomY = yearToY(end, minYear, maxYear, 96);
                const height = Math.max(bottomY - topY, 2);
                return (
                  <div
                    key={band.labelKey}
                    className={`absolute left-0 right-0 pointer-events-none ${band.bgClass}`}
                    style={{ top: topY, height }}
                  />
                );
              })}
              {/* Century tick marks */}
              {(() => {
                const miniTicks: number[] = [];
                const startCentury = Math.ceil(minYear / 100) * 100;
                for (let y = startCentury; y <= maxYear; y += 100) {
                  miniTicks.push(y);
                }
                return miniTicks.map(year => {
                  const y = yearToY(year, minYear, maxYear, 96);
                  return (
                    <div
                      key={year}
                      className="absolute left-0 right-0 flex items-center"
                      style={{ top: y }}
                    >
                      <div className="w-4 text-[8px] text-zinc-400 text-right pr-0.5 leading-none">
                        {year > 0 ? `${Math.floor((year - 1) / 100) + 1}` : `${Math.ceil(-year / 100)}c`}
                      </div>
                      <div className="flex-1 h-px bg-zinc-300/60" />
                    </div>
                  );
                });
              })()}
              {/* Era boundary tick marks */}
              {ERA_BOUNDARY_YEARS.map(boundaryYear => {
                if (boundaryYear <= minYear || boundaryYear >= maxYear) return null;
                const y = yearToY(boundaryYear, minYear, maxYear, 96);
                return (
                  <div
                    key={boundaryYear}
                    className="absolute left-0 right-0 h-px bg-amber-400/60 z-10 pointer-events-none"
                    style={{ top: y }}
                  />
                );
              })}
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
                className="absolute left-0 right-0 h-0.5 bg-red-500 z-20"
                style={{ top: currentYearLineY / (gridHeight / 96) }}
              >
                <div className="absolute -left-0.5 -top-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
              </div>
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
                onClick={() => setCurrentYear(y => Math.max(minYear, y - 10))}
                className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-500 text-[10px] hover:bg-zinc-200"
              >
                -10
              </button>
              <button
                type="button"
                onClick={() => setCurrentYear(y => Math.min(maxYear, y + 10))}
                className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-500 text-[10px] hover:bg-zinc-200"
              >
                +10
              </button>
              <button
                type="button"
                onClick={() => setCurrentYear(1)}
                className="px-1.5 py-0.5 rounded bg-red-100 text-red-600 text-[10px] hover:bg-red-200 ml-auto"
              >
                {t('grid.ce1')}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
