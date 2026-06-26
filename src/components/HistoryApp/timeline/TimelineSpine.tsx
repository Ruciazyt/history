import { lineColorVar } from '@/components/HistoryApp/timeline/tokens';
import type { TimelineDepth } from '@/components/HistoryApp/timeline/constants';

type TimelineSpineProps = {
  railX: number;
  top: number;
  bottom: number;
  depth?: TimelineDepth;
};

/** 单段竖线 */
export function TimelineSpine({ railX, top, bottom, depth = 2 }: TimelineSpineProps) {
  return (
    <div
      className="absolute w-px pointer-events-none"
      style={{
        left: `${railX}px`,
        top: `${top}px`,
        bottom: `${bottom}px`,
        backgroundColor: lineColorVar(depth),
      }}
      aria-hidden="true"
    />
  );
}
