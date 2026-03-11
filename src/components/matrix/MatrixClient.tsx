'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from '@/components/common/LocaleSwitcher';
import type { Era, Ruler, Event } from '@/lib/history/types';
import { formatYear } from '@/lib/history/utils';

// Colors for different polities
const POLITY_COLORS: Record<string, string> = {
  // Spring & Autumn
  'sa-zhou': '#8B4513',
  'sa-qi': '#228B22',
  'sa-jin': '#4169E1',
  'sa-chu': '#DC143C',
  'sa-qin': '#FF8C00',
  'sa-lu': '#9370DB',
  // Warring States
  'ws-qin': '#FF8C00',
  'ws-chu': '#DC143C',
  'ws-qi': '#228B22',
  'ws-yan': '#4169E1',
  'ws-zhao': '#20B2AA',
  'ws-wei': '#D2691E',
  'ws-han': '#708090',
  // Three Kingdoms
  'tk-wei': '#4169E1',
  'tk-shu': '#228B22',
  'tk-wu': '#DC143C',
  // Eastern Jin & 16 Kingdoms
  'ej-jin': '#4169E1',
  'ej-north': '#DC143C',
  // Southern & Northern
  'sn-south': '#228B22',
  'sn-north': '#4169E1',
  // Five Dynasties
  'fdtk-later-liang': '#8B4513',
  'fdtk-later-tang': '#DC143C',
  'fdtk-later-jin': '#4169E1',
  'fdtk-later-han': '#228B22',
  'fdtk-later-zhou': '#FF8C00',
};

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
    eras.length > 0 ? eras[0].id : null
  );

  const selectedEra = eras.find((e) => e.id === selectedEraId) || eras[0];

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

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-zinc-800 border-b border-zinc-700">
        <div className="flex items-center gap-4">
          <Link href={`/${locale}`} className="text-zinc-400 hover:text-white transition-colors">
            ← 返回
          </Link>
          <h1 className="text-xl font-bold">{t('matrix.title')}</h1>
        </div>
        <LocaleSwitcher />
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left: Era Selector */}
        <div className="w-48 bg-zinc-800 border-r border-zinc-700 p-4">
          <h2 className="text-sm font-semibold text-zinc-400 mb-3">{t('matrix.selectEra')}</h2>
          <div className="space-y-2">
            {eras.map((era) => (
              <button
                key={era.id}
                onClick={() => {
                  setSelectedEraId(era.id);
                  setSelectedCell(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedEraId === era.id
                    ? 'bg-zinc-700 text-white border border-zinc-500'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {t(era.nameKey)}
                <span className="block text-xs text-zinc-500 mt-1">
                  {formatYear(era.startYear)} - {formatYear(era.endYear)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Matrix Grid */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* X-axis: Polities */}
          <div className="flex border-b border-zinc-700 bg-zinc-800">
            <div className="w-20 flex-shrink-0" /> {/* Year label space */}
            {selectedEra.polities?.map((polity) => (
              <div
                key={polity.id}
                className="flex-1 px-2 py-3 text-center text-sm font-medium border-l border-zinc-700"
                style={{ backgroundColor: `${POLITY_COLORS[polity.id] || '#666'}20` }}
              >
                <div
                  className="w-3 h-3 rounded-full mx-auto mb-1"
                  style={{ backgroundColor: POLITY_COLORS[polity.id] || '#666' }}
                />
                {t(polity.nameKey)}
              </div>
            ))}
          </div>

          {/* Matrix Grid */}
          <div className="flex-1 overflow-auto">
            {yearRows.map((year) => (
              <div key={year} className="flex border-b border-zinc-800">
                {/* Y-axis: Year label */}
                <div className="w-20 flex-shrink-0 px-2 py-4 text-right text-sm text-zinc-500 border-r border-zinc-700 bg-zinc-900">
                  {formatYear(year)}
                </div>

                {/* Cells */}
                {selectedEra.polities?.map((polity) => {
                  const cell = matrixData.get(year)?.get(polity.id);
                  const hasData = cell && (cell.rulers.length > 0 || cell.events.length > 0);
                  const isSelected =
                    selectedCell?.year === year && selectedCell?.polityId === polity.id;

                  return (
                    <button
                      key={`${year}-${polity.id}`}
                      onClick={() =>
                        setSelectedCell(
                          cell || {
                            era: selectedEra,
                            polityId: polity.id,
                            polityName: t(polity.nameKey),
                            year,
                            rulers: [],
                            events: [],
                          }
                        )
                      }
                      className={`flex-1 min-h-[60px] p-1 border-l border-zinc-800 transition-colors ${
                        isSelected
                          ? 'bg-zinc-700'
                          : hasData
                          ? 'hover:bg-zinc-800'
                          : 'bg-zinc-900/50'
                      }`}
                      style={{
                        backgroundColor: isSelected
                          ? undefined
                          : hasData
                          ? `${POLITY_COLORS[polity.id] || '#666'}15`
                          : undefined,
                      }}
                    >
                      {cell?.rulers.slice(0, 2).map((ruler) => (
                        <div
                          key={ruler.id}
                          className="text-xs truncate px-1 py-0.5 rounded mb-0.5"
                          style={{ backgroundColor: POLITY_COLORS[polity.id] || '#666' }}
                        >
                          {t(ruler.nameKey)}
                        </div>
                      ))}
                      {cell && cell.rulers.length > 2 && (
                        <div className="text-xs text-zinc-500">+{cell.rulers.length - 2}</div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Detail Panel */}
        <div className="w-80 bg-zinc-800 border-l border-zinc-700 flex flex-col">
          <div className="p-4 border-b border-zinc-700">
            <h2 className="font-semibold">{t('matrix.details')}</h2>
            {selectedCell && (
              <p className="text-sm text-zinc-400 mt-1">
                {selectedCell.polityName} · {formatYear(selectedCell.year)}s
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {!selectedCell ? (
              <p className="text-zinc-500 text-sm">{t('matrix.selectCell')}</p>
            ) : (
              <>
                {/* Rulers */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-zinc-400 mb-2">
                    {t('matrix.rulers')} ({cellRulers.length})
                  </h3>
                  {cellRulers.length === 0 ? (
                    <p className="text-zinc-500 text-sm">{t('matrix.noRulers')}</p>
                  ) : (
                    <div className="space-y-2">
                      {cellRulers.map((ruler) => (
                        <div
                          key={ruler.id}
                          className="bg-zinc-700 rounded-lg p-3"
                        >
                          <div className="font-medium">{t(ruler.nameKey)}</div>
                          <div className="text-xs text-zinc-400 mt-1">
                            {formatYear(ruler.startYear)} - {formatYear(ruler.endYear)}
                          </div>
                          {ruler.eraNameKey && (
                            <div className="text-xs text-zinc-500 mt-1">
                              {t(ruler.eraNameKey)}
                            </div>
                          )}
                          {ruler.highlightKey && (
                            <div className="text-xs text-red-400 mt-1">
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
                  <h3 className="text-sm font-semibold text-zinc-400 mb-2">
                    {t('matrix.events')} ({cellEvents.length})
                  </h3>
                  {cellEvents.length === 0 ? (
                    <p className="text-zinc-500 text-sm">{t('matrix.noEvents')}</p>
                  ) : (
                    <div className="space-y-2">
                      {cellEvents.map((event) => (
                        <div
                          key={event.id}
                          className="bg-zinc-700 rounded-lg p-3"
                        >
                          <div className="font-medium">{t(event.titleKey)}</div>
                          <div className="text-xs text-zinc-400 mt-1">
                            {formatYear(event.year)}
                          </div>
                          {event.battle && (
                            <div className="mt-2 text-xs">
                              <span className="text-zinc-500">{t('matrix.battle')}: </span>
                              <span
                                className={
                                  event.battle.result === 'attacker_win'
                                    ? 'text-red-400'
                                    : event.battle.result === 'defender_win'
                                    ? 'text-green-400'
                                    : 'text-zinc-400'
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
