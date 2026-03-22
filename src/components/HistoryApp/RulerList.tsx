'use client';

import * as React from 'react';
import type { Ruler } from '@/lib/history/types';
import { formatYear } from '@/lib/history/utils';
import { useTranslations } from 'next-intl';
import { ERA_COLORS, ERA_ITEM_COLORS, HISTORY_APP_COLORS } from '@/lib/history/constants';

interface RulerListProps {
  eraRulers: Ruler[];
  era: { id: string; nameKey: string; startYear: number; endYear: number; isParallelPolities?: boolean; polities?: { id: string; nameKey: string }[] };
  isOpen: boolean;
  selectedRulerId: string | null;
  onSelectRuler: (id: string) => void;
  // Use a loose type to accommodate both light-mode literal types (bg-zinc-50)
  // and dark-mode string types (bg-zinc-800) returned by useHistoryAppColors
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sidebarColors: any;
  /** @deprecated Not used in JSX; kept for type compatibility */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _extraColors?: any;
}

export function RulerList({
  eraRulers,
  era,
  isOpen,
  selectedRulerId,
  onSelectRuler,
  sidebarColors,
  _extraColors,
}: RulerListProps) {
  const t = useTranslations();
  const tEra = useTranslations('rulerEraName');
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

  if (!isOpen) return null;

  return (
    <div className={`${eraColor.bg} px-2 py-1 sm:px-3 sm:py-2`}>
      {isMultiPolity && rulersByPolity ? (
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm border-collapse">
            <thead>
              <tr
                className={`text-left ${sidebarColors.table.header.text} border-b ${sidebarColors.table.header.border}`}
              >
                <th className="px-2 py-2 font-medium w-16 shrink-0">{t('ui.year')}</th>
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
                      className={`border-b ${sidebarColors.table.row.border} last:border-0 ${sidebarColors.table.row.hover}`}
                    >
                      <td
                        className={`px-2 py-2 ${sidebarColors.table.row.year} shrink-0 w-16`}
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
                                  ? sidebarColors.table.rulerButton.active
                                  : sidebarColors.table.rulerButton.inactive
                              }`}
                            >
                              <div>{t(r.nameKey)}</div>
                              {r.eraNameKey && (
                                <div className={`${HISTORY_APP_COLORS.rulerDetail.header.eraBadge.text} text-xs`}>
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
                isActive ? sidebarColors.rulerList.active : sidebarColors.rulerList.inactive
              }`}
            >
              <span className="truncate flex items-center gap-1">
                {r.isDynastyBlock ? (
                  <span className="font-semibold">{t(r.nameKey)}</span>
                ) : (
                  <>
                    <span>{t(r.nameKey)}</span>
                    {r.eraNameKey && (
                      <span className={`${HISTORY_APP_COLORS.rulerDetail.header.eraBadge.text} text-xs`}>
                        {tEra(r.eraNameKey)}
                      </span>
                    )}
                  </>
                )}
              </span>
              <span className={`shrink-0 ${sidebarColors.eraItem.year}`}>
                {formatYear(r.startYear)}–{formatYear(r.endYear)}
              </span>
            </button>
          );
        })
      )}
    </div>
  );
}
