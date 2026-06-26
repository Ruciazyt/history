'use client';

import * as React from 'react';

const PANEL_MOTION = 'duration-200 ease-out';

type TimelineCollapseProps = {
  open: boolean;
  children: React.ReactNode;
  className?: string;
  panelClassName?: string;
};

/** 高度 + 透明度过渡的展开/收起容器（grid 0fr/1fr） */
export function TimelineCollapse({
  open,
  children,
  className = '',
  panelClassName = '',
}: TimelineCollapseProps) {
  return (
    <div
      className={`history-timeline-collapse grid transition-[grid-template-rows,opacity] ${PANEL_MOTION} ${
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      } ${className}`}
      style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      aria-hidden={!open}
    >
      <div className={`min-h-0 overflow-hidden ${panelClassName}`}>{children}</div>
    </div>
  );
}
