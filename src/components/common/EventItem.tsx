import * as React from 'react';
import type { Event } from '@/lib/history/types';
import { formatYear } from '@/lib/history/utils';
import { EVENT_ITEM_COLORS } from '@/lib/history/constants';

interface EventItemProps {
  event: Event;
  eraName?: string;
  isCompare?: boolean;
  t: (key: string) => string;
}

export const EventItem = React.memo(function EventItem({
  event,
  eraName,
  isCompare = false,
  t,
}: EventItemProps) {
  const isWar = event.tags?.includes('war');
  
  return (
    <div className={`px-2 py-2 last:border-0 sm:px-3 ${isCompare ? EVENT_ITEM_COLORS.container.compare : EVENT_ITEM_COLORS.container.default}`}>
      <div className={`text-xs ${EVENT_ITEM_COLORS.year.text}`}>
        {formatYear(event.year)} {eraName ? `· ${eraName}` : ''}
      </div>
      <div className={`mt-0.5 text-sm ${isCompare ? EVENT_ITEM_COLORS.title.compare : EVENT_ITEM_COLORS.title.default}`}>
        {t(event.titleKey)}
      </div>
      {isWar && (
        <div className={`mt-1 inline-flex items-center gap-1 rounded ${EVENT_ITEM_COLORS.warBadge.bg} px-1.5 py-0.5 text-xs ${EVENT_ITEM_COLORS.warBadge.text}`}>
          ⚔️ 战役
        </div>
      )}
    </div>
  );
});
