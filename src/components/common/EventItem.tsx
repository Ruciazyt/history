import * as React from 'react';
import type { Event } from '@/lib/history/types';
import { formatYear } from '@/lib/history/utils';

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
    <div className={`px-2 py-2 last:border-0 sm:px-3 ${isCompare ? 'border-b border-zinc-50' : 'border-b border-zinc-100'}`}>
      <div className="text-xs text-zinc-400">
        {formatYear(event.year)} {eraName ? `· ${eraName}` : ''}
      </div>
      <div className={`mt-0.5 text-sm ${isCompare ? 'text-zinc-600' : 'font-medium text-zinc-800'}`}>
        {t(event.titleKey)}
      </div>
      {isWar && (
        <div className="mt-1 inline-flex items-center gap-1 rounded bg-red-50 px-1.5 py-0.5 text-xs text-red-600">
          ⚔️ 战役
        </div>
      )}
    </div>
  );
});
