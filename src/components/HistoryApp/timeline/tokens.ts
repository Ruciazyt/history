import {
  RULER_DOT_SIZE,
  RULER_TEXT_EXTRA_INDENT,
  TIMELINE_RAIL_X,
  type TimelineDepth,
} from '@/components/HistoryApp/timeline/constants';

const DEPTH_TO_RAIL: Record<TimelineDepth, number> = {
  0: TIMELINE_RAIL_X.era,
  1: TIMELINE_RAIL_X.period,
  2: TIMELINE_RAIL_X.polity,
};

export function railXForDepth(depth: TimelineDepth): number {
  return DEPTH_TO_RAIL[depth];
}

export function lineColorVar(depth: TimelineDepth): string {
  const d = Math.min(depth, 2) as 0 | 1 | 2;
  return `var(--color-figma-tree-line-${d})`;
}

export function dotColorVar(depth: TimelineDepth): string {
  const d = Math.min(depth, 2) as 0 | 1 | 2;
  return `var(--color-figma-tree-dot-${d})`;
}

export function labelPaddingForDepth(depth: TimelineDepth, dotSize: number): number {
  return DEPTH_TO_RAIL[depth] + dotSize / 2 + 8;
}

export function rulerLabelPadding(dotSize = RULER_DOT_SIZE): number {
  return labelPaddingForDepth(2, dotSize) + RULER_TEXT_EXTRA_INDENT;
}
