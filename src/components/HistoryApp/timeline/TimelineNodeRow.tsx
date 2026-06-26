import { ERA_DOT_SIZE, type TimelineDepth } from '@/components/HistoryApp/timeline/constants';
import { nodeLabelClass, preventMouseFocus, ROW_BUTTON_CLASS, TIMELINE_MOTION } from '@/components/HistoryApp/timeline/styles';
import { labelPaddingForDepth, railXForDepth } from '@/components/HistoryApp/timeline/tokens';
import { TimelineDot } from '@/components/HistoryApp/timeline/TimelineDot';

type TimelineNodeRowProps = {
  depth: TimelineDepth;
  dotColor?: string;
  dotSize?: number;
  label: React.ReactNode;
  trailing?: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

/** 年代 / 国家等带圆点的树节点行 */
export function TimelineNodeRow({
  depth,
  dotColor,
  dotSize = ERA_DOT_SIZE,
  label,
  trailing,
  onClick,
  className = '',
}: TimelineNodeRowProps) {
  const Tag = onClick ? 'button' : 'div';
  const railX = railXForDepth(depth);
  const pad = labelPaddingForDepth(depth, dotSize);

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      onMouseDown={onClick ? preventMouseFocus : undefined}
      className={`relative flex w-full min-h-0 items-center gap-2 pr-3 py-[8px] text-left ${onClick ? `group ${ROW_BUTTON_CLASS}` : ''} ${className}`}
      style={{ paddingLeft: `${pad}px` }}
    >
      <TimelineDot railX={railX} depth={depth} dotColor={dotColor} dotSize={dotSize} />
      <span
        className={`flex-1 min-w-0 truncate transition-colors ${TIMELINE_MOTION} ${nodeLabelClass(depth)} ${
          onClick ? 'group-hover:text-[var(--color-figma-sidebar-era-name)]' : ''
        }`}
      >
        {label}
      </span>
      {trailing}
    </Tag>
  );
}
