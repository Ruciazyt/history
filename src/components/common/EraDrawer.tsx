'use client';

import * as React from 'react';
import type { Era, Ruler } from '@/lib/history/types';
import { formatYear } from '@/lib/history/utils';
import { useTranslations } from 'next-intl';
import { ERA_COLORS, ERA_ITEM_COLORS } from '@/lib/history/constants';

interface EraDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeEras: Era[];
  activeRulers: Ruler[];
  openEraIds: Set<string>;
  selectedRulerId: string | null;
  onToggleEra: (id: string) => void;
  onSelectRuler: (id: string | null) => void;
  locale?: string;
}

export const EraDrawer = React.memo(function EraDrawer({
  isOpen,
  onClose,
  activeEras,
  activeRulers,
  openEraIds,
  selectedRulerId,
  onToggleEra,
  onSelectRuler,
  locale = 'zh',
}: EraDrawerProps) {
  const t = useTranslations();
  const tEra = useTranslations('rulerEraName');

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed left-0 top-0 bottom-0 z-50 w-[75vw] max-w-[300px] transform overflow-hidden lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-out`}
      >
        <div className="flex h-full flex-col bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-700">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 px-4 py-3">
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {t('ui.eras')}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              style={{ minWidth: '44px', minHeight: '44px' }}
              aria-label={t('ui.close')}
            >
              {/* X icon — consistent with ThemeToggle SVG style */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Era list */}
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
                <div key={era.id}>
                  <button
                    type="button"
                    onClick={() => onToggleEra(era.id)}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left border-b border-zinc-100 dark:border-zinc-800"
                  >
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${eraColor.dot}`} />
                    <span className={`flex-1 font-semibold ${eraColor.text} text-sm`}>
                      {t(era.nameKey)}
                      {isMultiPolity && (
                        <span className="text-xs ml-1 text-zinc-400 dark:text-zinc-500">{t('ui.parallelPolities')}</span>
                      )}
                    </span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">
                      {formatYear(era.startYear, locale)}–{formatYear(era.endYear, locale)}
                    </span>
                    {/* Chevron icon — consistent with SVG style */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`shrink-0 text-zinc-400 dark:text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                      aria-hidden="true"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className={`${eraColor.bg} px-4 py-2`}>
                      {isMultiPolity && rulersByPolity ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs border-collapse">
                            <thead>
                              <tr className="text-left border-b border-zinc-200 dark:border-zinc-700">
                                <th className="px-2 py-2 font-medium w-16 shrink-0">{t('ui.year')}</th>
                                {era.polities?.map((p) => (
                                  <th key={p.id} className="px-2 py-2 font-medium min-w-[80px]">
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
                                      className="border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                                    >
                                      <td className="px-2 py-2 shrink-0 w-16">
                                        {formatYear(year, locale)}
                                      </td>
                                      {era.polities?.map((p) => {
                                        const r = rulers.find((r) => r.polityId === p.id);
                                        if (!r) return <td key={p.id} className="px-2 py-2" />;
                                        const isActive = selectedRulerId === r.id;
                                        return (
                                          <td key={p.id} className="px-2 py-1">
                                            <button
                                              type="button"
                                              onClick={() => {
                                                onSelectRuler(r.id);
                                                onClose();
                                              }}
                                              className={`w-full text-left rounded px-2 py-1.5 truncate ${
                                                isActive
                                                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                                                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                              }`}
                                            >
                                              <div>{t(r.nameKey)}</div>
                                              {r.eraNameKey && (
                                                <div className="text-amber-700 dark:text-amber-300 text-xs">
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
                              onClick={() => {
                                onSelectRuler(r.id);
                                onClose();
                              }}
                              className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm ${
                                isActive
                                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                              }`}
                            >
                              <span className="truncate flex items-center gap-1">
                                {r.isDynastyBlock ? (
                                  <span className="font-semibold">{t(r.nameKey)}</span>
                                ) : (
                                  <>
                                    <span>{t(r.nameKey)}</span>
                                    {r.eraNameKey && (
                                      <span className="text-amber-700 dark:text-amber-300 text-xs">
                                        {tEra(r.eraNameKey)}
                                      </span>
                                    )}
                                  </>
                                )}
                              </span>
                              <span className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500">
                                {formatYear(r.startYear, locale)}–{formatYear(r.endYear, locale)}
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
        </div>
      </div>
    </>
  );
});
