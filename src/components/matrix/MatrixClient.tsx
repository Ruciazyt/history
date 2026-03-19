'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from '@/components/common/LocaleSwitcher';
import type { Era, Ruler, Event } from '@/lib/history/types';
import { formatYear } from '@/lib/history/utils';
import { POLITY_COLORS, DARK_THEME_COLORS, MATRIX_COLORS } from '@/lib/history/constants';

interface MatrixCell {
  era: Era;
  polityId: string;
  polityName: string;
  year: number;
  rulers: Ruler[];
  events: Event[];
}

export function MatrixClient({
  locale,
  eras,
  rulers,
  events,
}: {
  locale: string;
  eras: Era[];
  rulers: Ruler[];
  events: Event[];
}) {
  const t = useTranslations();
  const [selectedCell, setSelectedCell] = React.useState<MatrixCell | null>(null);
  const [selectedEraId, setSelectedEraId] = React.useState<string | null>(
    eras.length > 0 ? eras[0]?.id ?? null : null
  );

  const firstEra = eras[0];
  const selectedEra = eras.find((e) => e.id === selectedEraId) || firstEra;

  // Generate year rows for the selected era
  const yearRows = React.useMemo(() => {
    if (!selectedEra) return [];
    const years: number[] = [];
    const start = Math.ceil(selectedEra.startYear / 10) * 10;
    const end = Math.floor(selectedEra.endYear / 10) * 10;
    for (let y = start; y <= end; y += 10) {
      years.push(y);
    }
    return years;
  }, [selectedEra]);

  // Build matrix data
  const matrixData = React.useMemo(() => {
    if (!selectedEra) return new Map<number, Map<string, MatrixCell>>();

    const data = new Map<number, Map<string, MatrixCell>>();
    const polities = selectedEra.polities || [];

    // Initialize cells
    for (const year of yearRows) {
      const yearMap = new Map<string, MatrixCell>();
      for (const polity of polities) {
        yearMap.set(polity.id, {
          era: selectedEra,
          polityId: polity.id,
          polityName: t(polity.nameKey),
          year,
          rulers: [],
          events: [],
        });
      }
      data.set(year, yearMap);
    }

    // Fill in rulers
    for (const ruler of rulers) {
      if (ruler.eraId !== selectedEra.id) continue;
      const polityId = ruler.polityId || 'default';

      for (const year of yearRows) {
        // Check if ruler was active in this decade
        if (ruler.startYear <= year + 9 && ruler.endYear >= year) {
          const cell = data.get(year)?.get(polityId);
          if (cell) {
            cell.rulers.push(ruler);
          }
        }
      }
    }

    // Fill in events
    for (const event of events) {
      if (event.entityId !== selectedEra.id) continue;
      const eventYear = event.year;
      const yearIndex = yearRows.findIndex((y) => eventYear >= y && eventYear < y + 10);
      if (yearIndex === -1) continue;

      const year = yearRows[yearIndex];
      if (year === undefined) continue;
      // Determine polity from event (simplified - assign to first polity for now)
      const polityId = selectedEra.polities?.[0]?.id || 'default';
      const cell = data.get(year)?.get(polityId);
      if (cell) {
        cell.events.push(event);
      }
    }

    return data;
  }, [selectedEra, yearRows, rulers, events, t]);

  // Get unique rulers for selected cell
  const cellRulers = selectedCell
    ? matrixData.get(selectedCell.year)?.get(selectedCell.polityId)?.rulers || []
    : [];

  // Get events for selected cell
  const cellEvents = selectedCell
    ? matrixData.get(selectedCell.year)?.get(selectedCell.polityId)?.events || []
    : [];

  // 移动端视图状态
  const [mobileView, setMobileView] = React.useState<'matrix' | 'detail'>('matrix');

  return (
    <div className={`min-h-screen ${DARK_THEME_COLORS.background} ${DARK_THEME_COLORS.text} flex flex-col`}>
      {/* Header */}
      <header className={`flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 ${DARK_THEME_COLORS.surface} border-b ${DARK_THEME_COLORS.border} shrink-0`}>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href={`/${locale}`} className={`${DARK_THEME_COLORS.textSecondary} hover:${DARK_THEME_COLORS.text} transition-colors text-sm sm:text-base`}>
            ← 返回
          </Link>
          <h1 className="text-base sm:text-xl font-bold truncate">{t('matrix.title')}</h1>
        </div>
        <LocaleSwitcher />
      </header>

      {/* 移动端视图切换 */}
      <div className={`flex lg:hidden ${MATRIX_COLORS.mobile.tab} border-b ${MATRIX_COLORS.grid.xAxis.border} shrink-0`}>
        <button
          onClick={() => setMobileView('matrix')}
          className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
            mobileView === 'matrix' ? `${MATRIX_COLORS.tab.active.border} ${MATRIX_COLORS.tab.active.text}` : `${MATRIX_COLORS.tab.inactive.border} ${MATRIX_COLORS.tab.inactive.text}`
          }`}
        >
          📊 矩阵
        </button>
        <button
          onClick={() => setMobileView('detail')}
          className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
            mobileView === 'detail' ? `${MATRIX_COLORS.tab.active.border} ${MATRIX_COLORS.tab.active.text}` : `${MATRIX_COLORS.tab.inactive.border} ${MATRIX_COLORS.tab.inactive.text}`
          }`}
        >
          📋 详情 {selectedCell ? `(${cellRulers.length})` : ''}
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Era Selector - 移动端折叠到顶部 */}
        <div className={`${mobileView === 'detail' ? 'hidden' : ''} lg:flex w-full lg:w-32 xl:w-48 ${MATRIX_COLORS.eraSelector.container} lg:border-r border-b ${MATRIX_COLORS.eraSelector.border} flex-col shrink-0`}>
          <div className={`p-2 sm:p-4 border-b ${MATRIX_COLORS.border}`}>
            <h2 className={`text-xs sm:text-sm font-semibold ${MATRIX_COLORS.eraSelector.headerText} mb-2 sm:mb-3 hidden lg:block`}>{t('matrix.selectEra')}</h2>
            {/* 移动端：横向滚动时代选择器 */}
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 scrollbar-hide">
              {eras.map((era) => (
                <button
                  key={era.id}
                  onClick={() => {
                    setSelectedEraId(era.id);
                    setSelectedCell(null);
                  }}
                  className={`shrink-0 lg:w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors whitespace-nowrap ${
                    selectedEraId === era.id
                      ? `${MATRIX_COLORS.eraSelector.button.active.bg} ${MATRIX_COLORS.eraSelector.button.active.text} border ${MATRIX_COLORS.eraSelector.button.active.border}`
                      : `${MATRIX_COLORS.eraSelector.button.inactive.text} ${MATRIX_COLORS.eraSelector.button.inactive.hover}`
                  }`}
                >
                  {t(era.nameKey)}
                  <span className={`hidden lg:block ${MATRIX_COLORS.eraSelector.yearText} text-xs mt-1`}>
                    {formatYear(era.startYear)} - {formatYear(era.endYear)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Matrix Grid */}
        <div className={`flex-1 flex flex-col overflow-hidden ${mobileView === 'detail' ? 'hidden lg:flex' : ''}`}>
          {/* X-axis: Polities - 移动端简化显示 */}
          <div className={`flex border-b ${MATRIX_COLORS.grid.xAxis.border} ${MATRIX_COLORS.grid.xAxis.bg} overflow-x-auto scrollbar-hide`}>
            <div className="w-14 sm:w-20 flex-shrink-0" /> {/* Year label space */}
            {selectedEra?.polities?.map((polity) => (
              <div
                key={polity.id}
                className={`flex-1 min-w-[60px] sm:min-w-[80px] px-1 sm:px-2 py-2 sm:py-3 text-center text-xs sm:text-sm font-medium border-l ${MATRIX_COLORS.border}`}
                style={{ backgroundColor: `${POLITY_COLORS[polity.id] || '#666'}20` }}
              >
                <div
                  className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mx-auto mb-0.5 sm:mb-1"
                  style={{ backgroundColor: POLITY_COLORS[polity.id] || '#666' }}
                />
                <span className="block truncate">{t(polity.nameKey)}</span>
              </div>
            ))}
          </div>

          {/* Matrix Grid */}
          <div className="flex-1 overflow-auto">
            {yearRows.map((year) => (
              <div key={year} className={`flex border-b ${MATRIX_COLORS.grid.cell.border}`}>
                {/* Y-axis: Year label */}
                <div className={`w-14 sm:w-20 flex-shrink-0 px-1 sm:px-2 py-2 sm:py-4 text-right text-xs sm:text-sm ${MATRIX_COLORS.grid.yAxis.text} border-r ${MATRIX_COLORS.grid.yAxis.border} ${MATRIX_COLORS.grid.yAxis.bg}`}>
                  {formatYear(year)}
                </div>

                {/* Cells */}
                {selectedEra?.polities?.map((polity) => {
                  const cell = matrixData.get(year)?.get(polity.id);
                  const hasData = cell && (cell.rulers.length > 0 || cell.events.length > 0);
                  const isSelected =
                    selectedCell?.year === year && selectedCell?.polityId === polity.id;

                  return (
                    <button
                      key={`${year}-${polity.id}`}
                      onClick={() => {
                        setSelectedCell(
                          cell || {
                            era: selectedEra,
                            polityId: polity.id,
                            polityName: t(polity.nameKey),
                            year,
                            rulers: [],
                            events: [],
                          }
                        );
                        // 移动端点击后切换到详情视图
                        if (window.innerWidth < 1024) setMobileView('detail');
                      }}
                      className={`flex-1 min-h-[40px] sm:min-h-[60px] p-0.5 sm:p-1 border-l ${MATRIX_COLORS.grid.cell.border} transition-colors ${
                        isSelected
                          ? MATRIX_COLORS.grid.cell.selected
                          : hasData
                          ? MATRIX_COLORS.grid.cell.hover
                          : MATRIX_COLORS.grid.cell.empty
                      }`}
                      style={{
                        backgroundColor: isSelected
                          ? undefined
                          : hasData
                          ? `${POLITY_COLORS[polity.id] || '#666'}15`
                          : undefined,
                      }}
                    >
                      {cell?.rulers.slice(0, 1).map((ruler) => (
                        <div
                          key={ruler.id}
                          className="text-[8px] sm:text-xs truncate px-0.5 sm:px-1 py-0.5 rounded mb-0.5"
                          style={{ backgroundColor: POLITY_COLORS[polity.id] || '#666' }}
                        >
                          {t(ruler.nameKey)}
                        </div>
                      ))}
                      {cell && cell.rulers.length > 1 && (
                        <div className={`text-[8px] sm:text-xs ${MATRIX_COLORS.grid.rulerBadge}`}>+{cell.rulers.length - 1}</div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Detail Panel - 移动端可切换显示 */}
        <div className={`${mobileView === 'matrix' ? 'hidden' : ''} lg:flex w-full lg:w-72 xl:w-80 ${MATRIX_COLORS.detailPanel.container} border-l ${MATRIX_COLORS.detailPanel.border} flex-col shrink-0`}>
          <div className={`p-3 sm:p-4 border-b ${MATRIX_COLORS.border}`}>
            <h2 className="font-semibold text-sm sm:text-base">{t('matrix.details')}</h2>
            {selectedCell && (
              <p className={`text-xs sm:text-sm ${MATRIX_COLORS.detailPanel.header.text} mt-1`}>
                {selectedCell.polityName} · {formatYear(selectedCell.year)}s
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3 sm:p-4">
            {!selectedCell ? (
              <p className={`${MATRIX_COLORS.detailPanel.header.text} text-sm`}>{t('matrix.selectCell')}</p>
            ) : (
              <>
                {/* Rulers */}
                <div className="mb-4 sm:mb-6">
                  <h3 className={`text-xs sm:text-sm font-semibold ${MATRIX_COLORS.detailPanel.header.text} mb-2`}>
                    {t('matrix.rulers')} ({cellRulers.length})
                  </h3>
                  {cellRulers.length === 0 ? (
                    <p className={`${MATRIX_COLORS.detailPanel.header.text} text-sm`}>{t('matrix.noRulers')}</p>
                  ) : (
                    <div className="space-y-2">
                      {cellRulers.map((ruler) => (
                        <div
                          key={ruler.id}
                          className={MATRIX_COLORS.detailPanel.card.bg + ' rounded-lg p-2 sm:p-3'}
                        >
                          <div className="font-medium text-sm">{t(ruler.nameKey)}</div>
                          <div className={`text-xs ${MATRIX_COLORS.detailPanel.card.text} mt-1`}>
                            {formatYear(ruler.startYear)} - {formatYear(ruler.endYear)}
                          </div>
                          {ruler.eraNameKey && (
                            <div className={`text-xs ${MATRIX_COLORS.detailPanel.card.secondaryText} mt-1`}>
                              {t(ruler.eraNameKey)}
                            </div>
                          )}
                          {ruler.highlightKey && (
                            <div className={`text-xs ${MATRIX_COLORS.detailPanel.card.highlight} mt-1`}>
                              {t(ruler.highlightKey)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Events */}
                <div>
                  <h3 className={`text-xs sm:text-sm font-semibold ${MATRIX_COLORS.detailPanel.header.text} mb-2`}>
                    {t('matrix.events')} ({cellEvents.length})
                  </h3>
                  {cellEvents.length === 0 ? (
                    <p className={`${MATRIX_COLORS.detailPanel.header.text} text-sm`}>{t('matrix.noEvents')}</p>
                  ) : (
                    <div className="space-y-2">
                      {cellEvents.map((event) => (
                        <div
                          key={event.id}
                          className={MATRIX_COLORS.detailPanel.card.bg + ' rounded-lg p-2 sm:p-3'}
                        >
                          <div className="font-medium text-sm">{t(event.titleKey)}</div>
                          <div className={`text-xs ${MATRIX_COLORS.detailPanel.card.text} mt-1`}>
                            {formatYear(event.year)}
                          </div>
                          {event.battle && (
                            <div className="mt-2 text-xs">
                              <span className={MATRIX_COLORS.detailPanel.card.secondaryText}>{t('matrix.battle')}: </span>
                              <span
                                className={
                                  event.battle.result === 'attacker_win'
                                    ? MATRIX_COLORS.detailPanel.card.highlight
                                    : event.battle.result === 'defender_win'
                                    ? 'text-green-400'
                                    : MATRIX_COLORS.detailPanel.card.text
                                }
                              >
                                {event.battle.result === 'attacker_win'
                                  ? t('matrix.attackerWin')
                                  : event.battle.result === 'defender_win'
                                  ? t('matrix.defenderWin')
                                  : t('matrix.draw')}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
