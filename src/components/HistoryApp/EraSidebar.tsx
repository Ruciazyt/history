'use client';

import * as React from 'react';
import type { Era, Ruler } from '@/lib/history/types';
import { formatYear } from '@/lib/history/utils';
import { useTranslations } from 'next-intl';
import { ERA_COLORS, ERA_ITEM_COLORS, HISTORY_APP_COLORS, HISTORY_APP_EXTRA_COLORS } from '@/lib/history/constants';

interface EraSidebarProps {
  activeEras: Era[];
  activeRulers: Ruler[];
  openEraIds: Set<string>;
  selectedRulerId: string | null;
  onToggleEra: (id: string) => void;
  onSelectRuler: (id: string | null) => void;
}

export function EraSidebar({
  activeEras,
  activeRulers,
  openEraIds,
  selectedRulerId,
  onToggleEra,
  onSelectRuler,
}: EraSidebarProps) {
  const t = useTranslations();
  const tEra = useTranslations('rulerEraName');

  return (
    <aside
      className={`flex max-h-full flex-col overflow-hidden rounded-xl border ${HISTORY_APP_COLORS.sidebar.container.border} ${HISTORY_APP_COLORS.sidebar.container.bg}`}
    >
      <div
        className={`shrink-0 border-b ${HISTORY_APP_COLORS.sidebar.header.border} ${HISTORY_APP_COLORS.sidebar.header.bg} p-2 sm:p-3`}
      >
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <div className={`text-xs font-semibold uppercase tracking-wide ${HISTORY_APP_COLORS.sidebar.header.text}`}>
              {t('ui.eras')}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeEras.map((era) => {
          const isOpen = openEraIds.has(era.id);
          const eraRulers = activeRulers.filter((r) => r.eraId === era.id);
          const eraColor = ERA_COLORS[era.id] || ERA_ITEM_COLORS.default;
          const isMultiPolity = era.isParallelPolities && era.polities;

          const rulersByPolity = isMultiPolity
            ? eraRulers.reduce((acc, r) => {
                const polityId = r.polityId || 'other';
                if (!acc[polityId]) acc[polityId] = [];
                acc[polityId].push(r);
                return acc;
              }, {} as Record<string, typeof eraRulers>)
            : null;

          return (
            <div
              key={era.id}
              className={`border-b ${HISTORY_APP_COLORS.sidebar.eraItem.border} last:border-0 ${isOpen ? eraColor.bg : ''}`}
            >
              <button
                type="button"
                onClick={() => onToggleEra(era.id)}
                className={`flex w-full items-center gap-2 px-2 py-2.5 text-left ${HISTORY_APP_COLORS.sidebar.eraItem.hover} sm:px-3 transition-colors`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${eraColor.dot}`} />
                <span className={`flex-1 font-semibold ${eraColor.text} text-sm sm:text-base`}>
                  {t(era.nameKey)}
                  {isMultiPolity && (
                    <span className={`text-xs ml-1 ${HISTORY_APP_EXTRA_COLORS.multiPolity.text}`}>（多国并立）</span>
                  )}
                </span>
                <span className={`text-xs ${HISTORY_APP_COLORS.sidebar.eraItem.year} hidden sm:inline`}>
                  {formatYear(era.startYear)}–{formatYear(era.endYear)}
                </span>
                <span className={`text-xs ${HISTORY_APP_EXTRA_COLORS.arrow.text}`}>{isOpen ? '▼' : '▶'}</span>
              </button>

              {isOpen && (
                <div className={`${eraColor.bg} px-2 py-1 sm:px-3 sm:py-2`}>
                  {isMultiPolity && rulersByPolity ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs sm:text-sm border-collapse">
                        <thead>
                          <tr
                            className={`text-left ${HISTORY_APP_COLORS.sidebar.table.header.text} border-b ${HISTORY_APP_COLORS.sidebar.table.header.border}`}
                          >
                            <th className="px-2 py-2 font-medium w-16 shrink-0">年份</th>
                            {era.polities?.map((p) => (
                              <th key={p.id} className="px-2 py-2 font-medium min-w-[100px]">
                                {t(p.nameKey)}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const allRulers = eraRulers.sort((a, b) => a.startYear - b.startYear);
                            const rulersByYear = allRulers.reduce((acc, r) => {
                              const year = r.startYear;
                              if (!acc[year]) acc[year] = [];
                              acc[year].push(r);
                              return acc;
                            }, {} as Record<number, typeof eraRulers>);
                            const years = Object.keys(rulersByYear).map(Number).sort((a, b) => a - b);
                            return years.map((year) => {
                              const rulers = rulersByYear[year] || [];
                              return (
                                <tr
                                  key={year}
                                  className={`border-b ${HISTORY_APP_COLORS.sidebar.table.row.border} last:border-0 ${HISTORY_APP_COLORS.sidebar.table.row.hover}`}
                                >
                                  <td
                                    className={`px-2 py-2 ${HISTORY_APP_COLORS.sidebar.table.row.year} shrink-0 w-16`}
                                  >
                                    {formatYear(year)}
                                  </td>
                                  {era.polities?.map((p) => {
                                    const r = rulers.find((r) => r.polityId === p.id);
                                    if (!r)
                                      return (
                                        <td key={p.id} className="px-2 py-2" />
                                      );
                                    const isActive = selectedRulerId === r.id;
                                    return (
                                      <td key={p.id} className="px-2 py-1">
                                        <button
                                          type="button"
                                          onClick={() => onSelectRuler(r.id)}
                                          className={`w-full text-left rounded px-2 py-1.5 truncate ${
                                            isActive
                                              ? HISTORY_APP_COLORS.sidebar.table.rulerButton.active
                                              : HISTORY_APP_COLORS.sidebar.table.rulerButton.inactive
                                          }`}
                                        >
                                          <div>{t(r.nameKey)}</div>
                                          {r.eraNameKey && (
                                            <div className="text-amber-600 text-xs">
                                              {tEra(r.eraNameKey)}
                                            </div>
                                          )}
                                        </button>
                                      </td>
                                    );
                                  })}
                                </tr>
                              );
                            });
                          })()}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    eraRulers.map((r) => {
                      const isActive = selectedRulerId === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => onSelectRuler(r.id)}
                          className={`flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-xs sm:text-sm ${
                            isActive
                              ? HISTORY_APP_COLORS.sidebar.rulerList.active
                              : HISTORY_APP_COLORS.sidebar.rulerList.inactive
                          }`}
                        >
                          <span className="truncate flex items-center gap-1">
                            {r.isDynastyBlock ? (
                              <span className="font-semibold">{t(r.nameKey)}</span>
                            ) : (
                              <>
                                <span>{t(r.nameKey)}</span>
                                {r.eraNameKey && (
                                  <span className="text-amber-600 text-xs">
                                    {tEra(r.eraNameKey)}
                                  </span>
                                )}
                              </>
                            )}
                          </span>
                          <span className={`shrink-0 ${HISTORY_APP_COLORS.sidebar.eraItem.year}`}>
                            {formatYear(r.startYear)}–{formatYear(r.endYear)}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
