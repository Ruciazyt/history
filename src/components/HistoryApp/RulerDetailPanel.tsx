'use client';

import * as React from 'react';
import type { Era, Event, Ruler } from '@/lib/history/types';
import { formatYear, formatYearRangeShort } from '@/lib/history/utils';
import { useTranslations } from 'next-intl';
import { SidebarCard } from '@/components/HistoryApp/SidebarCard';

const DEMO_TAGS = ['励精图治', '改革变法', '兼并扩张', '长平之战'];

interface RulerDetailPanelProps {
  className?: string;
  selectedRuler: Ruler | null;
  currentEraEvents: Event[];
  activeEras: Era[];
  locale: string;
}

export function RulerDetailPanel({
  className = '',
  selectedRuler,
  currentEraEvents,
  activeEras,
  locale,
}: RulerDetailPanelProps) {
  const t = useTranslations();

  if (!selectedRuler) {
    return (
      <aside className={`hidden lg:flex ${className}`}>
        <SidebarCard className="flex-1 min-h-0">
          <div className="px-8 py-4 border-b border-[var(--color-figma-sidebar-divider)]">
            <span className="text-[15px] leading-[18px] text-[var(--color-figma-section-title)]">
              {t('ui.events')} ({currentEraEvents.length})
            </span>
          </div>
          {currentEraEvents.length > 0 ? (
            <div className="flex-1 overflow-y-auto py-2">
              {currentEraEvents.map((e) => {
                const era = activeEras.find((era) => era.id === e.entityId);
                const eraName = era ? t(era.nameKey) : '';
                return (
                  <div key={e.id} className="px-8 py-3 hover:bg-[var(--color-surface-soft)] transition-colors">
                    <div className="text-[13px] leading-[16px] text-[var(--color-figma-event-year)]">
                      {formatYear(e.year, locale)} {eraName ? `· ${eraName}` : ''}
                    </div>
                    <div className="mt-1 text-[15px] leading-[18px] text-[var(--color-figma-info-title)]">{t(e.titleKey)}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-[13px] text-[var(--text-muted)]">{t('ui.noEvents')}</div>
          )}
        </SidebarCard>
      </aside>
    );
  }

  const bioText = selectedRuler.bioKey ? t(selectedRuler.bioKey) : '';

  return (
    <aside className={`hidden lg:flex ${className}`}>
      <SidebarCard className="flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto">
          <div className="px-8 pt-10 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[16px] leading-[19px] text-[var(--color-figma-info-date)] mb-2">
                  {formatYearRangeShort(selectedRuler.startYear, selectedRuler.endYear, locale)}
                </div>
                <h2 className="text-[29px] leading-[35px] font-medium text-[var(--color-figma-info-title)]">
                  {t(selectedRuler.nameKey)}
                </h2>
              </div>
              <button
                type="button"
                className="mt-1 shrink-0 text-[var(--color-figma-info-date)] hover:text-[var(--color-figma-info-title)] transition-colors"
                aria-label="收藏"
              >
                <svg className="w-[17px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
            {bioText && (
              <p className="mt-4 text-[12px] leading-[21px] text-[var(--color-figma-info-desc)]">{bioText}</p>
            )}
          </div>

          <div className="px-8 pb-4">
            <div className="flex flex-wrap gap-2">
              {DEMO_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center h-[28px] px-3 rounded-[10px] border border-[var(--color-figma-tag-border)] bg-[var(--color-figma-tag-bg)] text-[12px] leading-none text-[var(--color-figma-tag-text)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mx-8 mb-4 h-px bg-[var(--color-figma-sidebar-divider)]" aria-hidden="true" />

          <div className="px-8 pb-4">
            <h3 className="text-[15px] leading-[18px] font-normal text-[var(--color-figma-section-title)] mb-4">重要事件</h3>
            <div className="space-y-[18px]">
              {currentEraEvents.slice(0, 5).map((e) => (
                <div key={e.id} className="flex items-center gap-3">
                  <span className="w-2 h-2 shrink-0 rounded-full bg-[var(--color-figma-event-dot)]" aria-hidden="true" />
                  <span className="w-[78px] shrink-0 text-[13px] leading-[16px] text-[var(--color-figma-event-year)]">
                    {formatYear(e.year, locale)}
                  </span>
                  <span className="min-w-0 text-[12px] leading-[15px] text-[var(--color-figma-event-title)]">{t(e.titleKey)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="shrink-0 px-8 pb-5 pt-2">
          <button
            type="button"
            className="w-full flex items-center justify-between h-[44px] px-5 rounded-[19px] border border-[var(--color-figma-explore-border)] bg-[var(--color-figma-explore-bg)] text-[14px] leading-none text-[var(--color-figma-explore-text)] hover:opacity-90 transition-opacity"
          >
            <span>探索此时期</span>
            <svg className="w-[17px] h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </SidebarCard>
    </aside>
  );
}
