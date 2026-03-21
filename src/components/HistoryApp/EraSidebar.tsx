'use client';

import * as React from 'react';
import type { Era, Ruler } from '@/lib/history/types';
import { formatYear } from '@/lib/history/utils';
import { useTranslations } from 'next-intl';
import { ERA_COLORS, ERA_ITEM_COLORS, HISTORY_APP_COLORS, HISTORY_APP_EXTRA_COLORS } from '@/lib/history/constants';
import { RulerList } from './RulerList';

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
                  {era.isParallelPolities && (
                    <span className={`text-xs ml-1 ${HISTORY_APP_EXTRA_COLORS.multiPolity.text}`}>（多国并立）</span>
                  )}
                </span>
                <span className={`text-xs ${HISTORY_APP_COLORS.sidebar.eraItem.year} hidden sm:inline`}>
                  {formatYear(era.startYear)}–{formatYear(era.endYear)}
                </span>
                <span className={`text-xs ${HISTORY_APP_EXTRA_COLORS.arrow.text}`}>{isOpen ? '▼' : '▶'}</span>
              </button>

              <RulerList
                eraRulers={eraRulers}
                era={era}
                isOpen={isOpen}
                selectedRulerId={selectedRulerId}
                onSelectRuler={onSelectRuler}
                sidebarColors={HISTORY_APP_COLORS.sidebar}
                _extraColors={HISTORY_APP_EXTRA_COLORS}
              />
            </div>
          );
        })}
      </div>
    </aside>
  );
}
