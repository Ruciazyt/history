'use client';

import * as React from 'react';
import type { Era, Ruler } from '@/lib/history/types';
import { formatYear, formatYearRangeShort } from '@/lib/history/utils';
import { useTranslations } from 'next-intl';
import { SidebarCard } from '@/components/HistoryApp/SidebarCard';
import { PRE_QIN_ERA_IDS, PRE_QIN_GROUP_ID } from '@/components/HistoryApp/eraGroups';
import {
  EraRowTrailing,
  EraTreeNode,
  TimelineCollapse,
  TimelineNodeRow,
  TimelineRail,
  TimelineYearLabel,
  TreeChevron,
} from '@/components/HistoryApp/timeline';

interface EraSidebarProps {
  className?: string;
  activeEras: Era[];
  activeRulers: Ruler[];
  openEraIds: Set<string>;
  openGroupIds: Set<string>;
  openPolityIds: Set<string>;
  selectedRulerId: string | null;
  onToggleEra: (id: string) => void;
  onToggleGroup: (id: string) => void;
  onTogglePolity: (id: string) => void;
  onSelectRuler: (id: string) => void;
  locale: string;
}

export function EraSidebar({
  className = '',
  activeEras,
  activeRulers,
  openEraIds,
  openGroupIds,
  openPolityIds,
  selectedRulerId,
  onToggleEra,
  onToggleGroup,
  onTogglePolity,
  onSelectRuler,
  locale,
}: EraSidebarProps) {
  const t = useTranslations();

  const preQinEras = activeEras.filter((e) => (PRE_QIN_ERA_IDS as readonly string[]).includes(e.id));
  const postQinEras = activeEras.filter((e) => !(PRE_QIN_ERA_IDS as readonly string[]).includes(e.id));
  const preQinOpen = openGroupIds.has(PRE_QIN_GROUP_ID);

  const rulerPanelProps = {
    openPolityIds,
    selectedRulerId,
    onTogglePolity,
    onSelectRuler,
    locale,
  };

  return (
    <aside className={`era-sidebar hidden lg:flex ${className}`}>
      <SidebarCard className="flex-1 min-h-0">
        <div className="flex items-center justify-between px-[33px] pt-[34px] pb-[16px] shrink-0">
          <h2 className="text-[17px] leading-[21px] font-normal text-[var(--color-figma-sidebar-header)]">历史年代</h2>
          <button
            type="button"
            className="flex items-center gap-1 h-[34px] px-3 rounded-[13px] border border-[var(--color-figma-filter-border)] bg-[var(--color-figma-filter-bg)] text-[14px] leading-none text-[var(--color-figma-filter-text)] hover:opacity-90 transition-opacity"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            筛选
          </button>
        </div>

        <div className="mx-[29px] mb-3 h-px bg-[var(--color-figma-sidebar-divider)] shrink-0" aria-hidden="true" />

        <div className="flex-1 overflow-y-auto px-[14px] pb-[14px]">
          <TimelineRail depth={0}>
            <div>
              <TimelineNodeRow
                depth={0}
                dotColor="var(--color-figma-nav-logo)"
                label="先秦"
                trailing={
                  <>
                    <TimelineYearLabel className="mr-1">{formatYear(-221, locale)}</TimelineYearLabel>
                    <TreeChevron open={preQinOpen} />
                  </>
                }
                onClick={() => onToggleGroup(PRE_QIN_GROUP_ID)}
              />
              <TimelineCollapse open={preQinOpen}>
                <TimelineRail depth={1}>
                  {preQinEras.map((era) => {
                    const isOpen = openEraIds.has(era.id);
                    const eraRulers = activeRulers.filter((r) => r.eraId === era.id);
                    return (
                      <EraTreeNode
                        key={era.id}
                        depth={1}
                        open={isOpen}
                        onToggle={() => onToggleEra(era.id)}
                        era={era}
                        eraRulers={eraRulers}
                        label={t(era.nameKey)}
                        trailing={
                          <>
                            <TimelineYearLabel className={`mr-1 ${isOpen ? '' : 'invisible'}`}>
                              ({formatYearRangeShort(era.startYear, era.endYear, locale)})
                            </TimelineYearLabel>
                            <TreeChevron open={isOpen} />
                          </>
                        }
                        {...rulerPanelProps}
                      />
                    );
                  })}
                </TimelineRail>
              </TimelineCollapse>
            </div>

            {postQinEras.map((era) => {
              const isOpen = openEraIds.has(era.id);
              const eraRulers = activeRulers.filter((r) => r.eraId === era.id);
              return (
                <EraTreeNode
                  key={era.id}
                  depth={0}
                  open={isOpen}
                  onToggle={() => onToggleEra(era.id)}
                  era={era}
                  eraRulers={eraRulers}
                  expandWhenEmpty={false}
                  panelClassName="bg-[var(--color-figma-sidebar-expanded-panel-bg)] -mx-[14px] px-[14px] pb-1"
                  label={t(era.nameKey)}
                  trailing={
                    <EraRowTrailing
                      open={isOpen}
                      yearLabel={`${formatYear(era.startYear, locale)}–${formatYear(era.endYear, locale)}`}
                    />
                  }
                  {...rulerPanelProps}
                />
              );
            })}
          </TimelineRail>
        </div>
      </SidebarCard>
    </aside>
  );
}
