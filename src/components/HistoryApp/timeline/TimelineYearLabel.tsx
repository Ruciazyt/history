import * as React from 'react';
import { ERA_YEAR_CLASS } from '@/components/HistoryApp/timeline/styles';

export function TimelineYearLabel({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={`${ERA_YEAR_CLASS} ${className}`.trim()}>{children}</span>;
}
