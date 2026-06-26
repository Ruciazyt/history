'use client';

import * as React from 'react';
import type { Ruler } from '@/lib/history/types';
import { formatYearRangeShort } from '@/lib/history/utils';
import { useTranslations } from 'next-intl';
import { POLITY_DOT_COLORS } from '@/components/HistoryApp/eraGroups';
import {
  PolityBlock,
  RulerBranch,
  RulerTimelineRow,
  TimelineNodeRow,
  TimelineRail,
  TreeChevron,
} from '@/components/HistoryApp/timeline';

interface RulerListProps {
  eraRulers: Ruler[];
  era: {
    id: string;
    nameKey: string;
    startYear: number;
    endYear: number;
    isParallelPolities?: boolean;
    polities?: { id: string; nameKey: string }[];
  };
  openPolityIds: Set<string>;
  selectedRulerId: string | null;
  onTogglePolity: (id: string) => void;
  onSelectRuler: (id: string) => void;
  locale?: string;
}

function RulerRows({
  rulers,
  selectedRulerId,
  onSelectRuler,
  locale,
}: {
  rulers: Ruler[];
  selectedRulerId: string | null;
  onSelectRuler: (id: string) => void;
  locale: string;
}) {
  const t = useTranslations();

  return (
    <>
      {rulers.map((r) => (
        <RulerTimelineRow
          key={r.id}
          label={t(r.nameKey)}
          yearLabel={formatYearRangeShort(r.startYear, r.endYear, locale)}
          active={selectedRulerId === r.id}
          onClick={() => onSelectRuler(r.id)}
        />
      ))}
    </>
  );
}

export function RulerList({
  eraRulers,
  era,
  openPolityIds,
  selectedRulerId,
  onTogglePolity,
  onSelectRuler,
  locale = 'zh',
}: RulerListProps) {
  const t = useTranslations();
  const isMultiPolity = era.isParallelPolities && era.polities;

  if (isMultiPolity && era.polities) {
    return (
      <TimelineRail depth={2} className="pb-1" showLine={false}>
        {era.polities.map((polity) => {
          const polityRulers = eraRulers
            .filter((r) => r.polityId === polity.id)
            .sort((a, b) => a.startYear - b.startYear);
          const polityOpen = openPolityIds.has(polity.id);

          return (
            <PolityBlock
              key={polity.id}
              rulersOpen={polityOpen}
              polityRow={
                <TimelineNodeRow
                  depth={2}
                  dotColor={POLITY_DOT_COLORS[polity.id] ?? '#9ca3af'}
                  label={t(polity.nameKey)}
                  trailing={<TreeChevron open={polityOpen} />}
                  onClick={() => onTogglePolity(polity.id)}
                />
              }
            >
              <RulerRows
                rulers={polityRulers}
                selectedRulerId={selectedRulerId}
                onSelectRuler={onSelectRuler}
                locale={locale}
              />
            </PolityBlock>
          );
        })}
      </TimelineRail>
    );
  }

  return (
    <RulerBranch>
      <RulerRows
        rulers={eraRulers}
        selectedRulerId={selectedRulerId}
        onSelectRuler={onSelectRuler}
        locale={locale}
      />
    </RulerBranch>
  );
}
