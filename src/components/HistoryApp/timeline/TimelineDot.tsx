import { DOT_HALO_PAD } from '@/components/HistoryApp/timeline/constants';
import { TIMELINE_MOTION } from '@/components/HistoryApp/timeline/styles';
import { dotColorVar } from '@/components/HistoryApp/timeline/tokens';
import type { TimelineDepth } from '@/components/HistoryApp/timeline/constants';

export type TimelineDotProps = {
  railX: number;
  depth: TimelineDepth;
  dotColor?: string;
  dotSize?: number;
  hollow?: boolean;
  active?: boolean;
};

export function TimelineDot({
  railX,
  depth,
  dotColor,
  dotSize = 8,
  hollow = false,
  active = false,
}: TimelineDotProps) {
  const color = dotColor ?? dotColorVar(depth);
  const outerSize = dotSize + DOT_HALO_PAD * 2;
  const showRing = hollow && !active;
  const fillColor = active ? 'var(--color-figma-nav-logo)' : color;

  return (
    <span
      className={`absolute top-1/2 flex items-center justify-center rounded-full pointer-events-none transition-opacity ${TIMELINE_MOTION}`}
      style={{
        left: `${railX}px`,
        width: outerSize,
        height: outerSize,
        transform: 'translate(-50%, -50%)',
      }}
      aria-hidden="true"
    >
      {/* 光晕层 — 仅 opacity 变化，不改变尺寸 */}
      <span
        className={`absolute inset-0 rounded-full transition-opacity ${TIMELINE_MOTION}`}
        style={{
          backgroundColor: 'rgba(143, 184, 106, 0.35)',
          opacity: active ? 1 : 0,
        }}
      />
      {/* 圆心 — box-shadow 描边，实心/空心视觉尺寸一致 */}
      <span
        className={`relative rounded-full transition-[background-color,box-shadow] ${TIMELINE_MOTION}`}
        style={{
          width: dotSize,
          height: dotSize,
          backgroundColor: showRing ? 'transparent' : fillColor,
          boxShadow: showRing ? `0 0 0 1.5px ${color}` : 'none',
        }}
      />
    </span>
  );
}
