'use client';

import * as React from 'react';
import { ROW_HALF, TIMELINE_RAIL_X } from '@/components/HistoryApp/timeline/constants';
import { TimelineCollapse } from '@/components/HistoryApp/timeline/TimelineCollapse';
import { TimelineSpine } from '@/components/HistoryApp/timeline/TimelineSpine';

type PolityBlockProps = {
  polityRow: React.ReactNode;
  rulersOpen: boolean;
  children?: React.ReactNode;
};

/** 国家 + 旗下君主：竖线从国家圆点连至最后一个君主圆点 */
export function PolityBlock({ polityRow, rulersOpen, children }: PolityBlockProps) {
  const rulerCount = React.Children.count(children);
  const showSpine = rulersOpen && rulerCount > 1;

  return (
    <div className="relative">
      {showSpine && (
        <TimelineSpine
          railX={TIMELINE_RAIL_X.polity}
          top={ROW_HALF.polity}
          bottom={ROW_HALF.ruler}
          depth={2}
        />
      )}
      {polityRow}
      <TimelineCollapse open={rulersOpen}>{children}</TimelineCollapse>
    </div>
  );
}
