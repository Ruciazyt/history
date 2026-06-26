import { ROW_HALF, type TimelineDepth } from '@/components/HistoryApp/timeline/constants';
import { TimelineSpine } from '@/components/HistoryApp/timeline/TimelineSpine';
import { railXForDepth } from '@/components/HistoryApp/timeline/tokens';

type TimelineRailProps = {
  depth: TimelineDepth;
  children: React.ReactNode;
  className?: string;
  insetTop?: number;
  insetBottom?: number;
  showLine?: boolean;
};

function defaultInset(depth: TimelineDepth): number {
  if (depth === 2) return ROW_HALF.polity;
  return ROW_HALF.era;
}

/** 同级节点共享一条竖线，圆点均落在同一 X 上 */
export function TimelineRail({
  depth,
  children,
  className = '',
  insetTop,
  insetBottom,
  showLine = true,
}: TimelineRailProps) {
  const railX = railXForDepth(depth);
  const topInset = insetTop ?? defaultInset(depth);
  const bottomInset = insetBottom ?? topInset;

  return (
    <div className={`relative ${className}`}>
      {showLine && <TimelineSpine railX={railX} top={topInset} bottom={bottomInset} depth={depth} />}
      {children}
    </div>
  );
}
