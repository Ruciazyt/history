import * as React from 'react';
import { EXPANDED_PANEL_CLASS } from '@/components/HistoryApp/timeline/styles';
import { TimelineCollapse } from '@/components/HistoryApp/timeline/TimelineCollapse';

type TimelineExpandPanelProps = {
  open: boolean;
  children: React.ReactNode;
  className?: string;
  panelClassName?: string;
};

/** 带设计稿面板背景的展开区 */
export function TimelineExpandPanel({
  open,
  children,
  className = '',
  panelClassName = EXPANDED_PANEL_CLASS,
}: TimelineExpandPanelProps) {
  return (
    <TimelineCollapse open={open} className={className} panelClassName={panelClassName}>
      {children}
    </TimelineCollapse>
  );
}
