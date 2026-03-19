'use client';

import * as React from 'react';
import type { Era, Event, Ruler } from '@/lib/history/types';
import { formatYear } from '@/lib/history/utils';
import { useTranslations } from 'next-intl';
import { HISTORY_APP_COLORS, HISTORY_APP_EXTRA_COLORS } from '@/lib/history/constants';
import { RulerRelations } from '@/components/common/RulerRelations';

interface EventSidebarProps {
  currentEraEvents: Event[];
  otherEraEvents: Event[];
  activeEras: Era[];
  selectedRuler: Ruler | null;
  selectedRulerId: string | null;
  onSelectRuler: (id: string | null) => void;
}

export function EventSidebar({
  currentEraEvents,
  otherEraEvents,
  activeEras,
  selectedRuler,
  selectedRulerId: _selectedRulerId,
  onSelectRuler,
}: EventSidebarProps) {
  const t = useTranslations();
  const tEra = useTranslations('rulerEraName');

  return (
    <aside
      className={`flex max-h-full flex-col overflow-hidden rounded-xl border ${HISTORY_APP_COLORS.eventsSidebar.container.border} ${HISTORY_APP_COLORS.eventsSidebar.container.bg}`}
    >
      <div
        className={`shrink-0 border-b ${HISTORY_APP_COLORS.eventsSidebar.header.border} ${HISTORY_APP_COLORS.eventsSidebar.header.bg} p-2 sm:p-3`}
      >
        <div
          className={`text-xs font-semibold uppercase tracking-wide ${HISTORY_APP_COLORS.eventsSidebar.header.text}`}
        >
          {t('ui.events')} ({currentEraEvents.length})
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {currentEraEvents.length > 0 ? (
          currentEraEvents.map((e) => {
            const era = activeEras.find((era) => era.id === e.entityId);
            const eraName = era ? t(era.nameKey) : '';
            return (
              <div
                key={e.id}
                className={`border-b ${HISTORY_APP_COLORS.eventsSidebar.eventItem.border} px-2 py-2 last:border-0 sm:px-3`}
              >
                <div className={`text-xs ${HISTORY_APP_COLORS.eventsSidebar.eventItem.year}`}>
                  {formatYear(e.year)}{' '}
                  {eraName ? `· ${eraName}` : ''}
                </div>
                <div
                  className={`mt-0.5 text-sm font-medium ${HISTORY_APP_EXTRA_COLORS.eventTitle.default}`}
                >
                  {t(e.titleKey)}
                </div>
                {e.tags && e.tags.includes('war') && (
                  <div
                    className={`mt-1 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs ${HISTORY_APP_COLORS.eventsSidebar.eventItem.warBadge.bg} ${HISTORY_APP_COLORS.eventsSidebar.eventItem.warBadge.text}`}
                  >
                    ⚔️ 战役
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className={`p-4 text-center text-sm ${HISTORY_APP_COLORS.eventsSidebar.empty}`}>
            {t('ui.noEvents')}
          </div>
        )}

        {otherEraEvents.length > 0 && (
          <>
            <div
              className={`border-t ${HISTORY_APP_COLORS.eventsSidebar.compare.header.border} ${HISTORY_APP_COLORS.eventsSidebar.compare.header.bg} px-2 py-2 sm:px-3`}
            >
              <div
                className={`text-xs font-semibold uppercase tracking-wide ${HISTORY_APP_COLORS.eventsSidebar.compare.header.text}`}
              >
                {t('ui.compare')} ({otherEraEvents.length})
              </div>
            </div>
            {otherEraEvents.slice(0, 20).map((e) => {
              const era = activeEras.find((era) => era.id === e.entityId);
              const eraName = era ? t(era.nameKey) : '';
              return (
                <div
                  key={e.id}
                  className={`border-b ${HISTORY_APP_COLORS.eventsSidebar.eventItem.border} px-2 py-2 last:border-0 sm:px-3`}
                >
                  <div className={`text-xs ${HISTORY_APP_COLORS.eventsSidebar.eventItem.year}`}>
                    {formatYear(e.year)}{' '}
                    {eraName ? `· ${eraName}` : ''}
                  </div>
                  <div className={`mt-0.5 text-sm ${HISTORY_APP_EXTRA_COLORS.eventTitle.light}`}>
                    {t(e.titleKey)}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Ruler detail inline */}
      {selectedRuler ? (
        <div
          className={`shrink-0 border-t ${HISTORY_APP_COLORS.rulerDetail.container.border} ${HISTORY_APP_COLORS.rulerDetail.container.bg} p-2 sm:p-3`}
        >
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <div className="min-w-0">
              <div
                className={`text-xs font-semibold uppercase tracking-wide ${HISTORY_APP_COLORS.rulerDetail.header.text}`}
              >
                {t('ui.rulerDetail')}
              </div>
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                <span
                  className={`truncate text-sm sm:text-base font-semibold ${HISTORY_APP_COLORS.rulerDetail.header.name}`}
                >
                  {t(selectedRuler.nameKey)}
                </span>
                {selectedRuler.eraNameKey && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded ${HISTORY_APP_COLORS.rulerDetail.header.eraBadge.bg} ${HISTORY_APP_COLORS.rulerDetail.header.eraBadge.text}`}
                  >
                    {tEra(selectedRuler.eraNameKey)}
                  </span>
                )}
              </div>
              <div className={`mt-0.5 text-xs ${HISTORY_APP_COLORS.rulerDetail.header.year}`}>
                {formatYear(selectedRuler.startYear)}–{formatYear(selectedRuler.endYear)}
              </div>
            </div>
            <button
              type="button"
              className={`shrink-0 rounded-lg border ${HISTORY_APP_COLORS.rulerDetail.closeButton.border} ${HISTORY_APP_COLORS.rulerDetail.closeButton.bg} px-2 py-1 text-xs ${HISTORY_APP_COLORS.rulerDetail.closeButton.text} ${HISTORY_APP_COLORS.rulerDetail.closeButton.hover}`}
              onClick={() => onSelectRuler(null)}
            >
              {t('ui.clearRuler')}
            </button>
          </div>
          {selectedRuler.highlightKey ? (
            <div className={`mt-2 text-xs sm:text-sm ${HISTORY_APP_COLORS.rulerDetail.highlight}`}>
              {t(selectedRuler.highlightKey)}
            </div>
          ) : null}
          {selectedRuler.bioKey ? (
            <div className={`mt-2 text-xs sm:text-sm ${HISTORY_APP_COLORS.rulerDetail.bio}`}>
              {t(selectedRuler.bioKey)}
            </div>
          ) : null}
          <RulerRelations
            ruler={selectedRuler}
            allRulers={[]}
            onRulerClick={(id) => onSelectRuler(id)}
          />
        </div>
      ) : (
        <div
          className={`shrink-0 border-t ${HISTORY_APP_COLORS.rulerDetail.container.border} ${HISTORY_APP_COLORS.rulerDetail.container.bg} p-2 sm:p-3 text-xs ${HISTORY_APP_COLORS.rulerDetail.seedNote}`}
        >
          {t('ui.seedNote')}
        </div>
      )}
    </aside>
  );
}
