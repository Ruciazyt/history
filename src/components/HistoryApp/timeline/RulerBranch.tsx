'use client';

import * as React from 'react';
import { ROW_HALF, TIMELINE_RAIL_X } from '@/components/HistoryApp/timeline/constants';
import { TimelineSpine } from '@/components/HistoryApp/timeline/TimelineSpine';

/** 君主列表竖线 — 仅 2 个及以上君主时连接 */
export function RulerBranch({ children }: { children: React.ReactNode }) {
  const rulerCount = React.Children.count(children);
  if (rulerCount === 0) return null;

  return (
    <div className="relative">
      {rulerCount > 1 && (
        <TimelineSpine
          railX={TIMELINE_RAIL_X.polity}
          top={ROW_HALF.ruler}
          bottom={ROW_HALF.ruler}
          depth={2}
        />
      )}
      {children}
    </div>
  );
}
