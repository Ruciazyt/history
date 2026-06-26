import { RULER_DOT_SIZE, TIMELINE_RAIL_X } from '@/components/HistoryApp/timeline/constants';
import { preventMouseFocus, ROW_BUTTON_CLASS, rulerNameClass, rulerYearClass, TIMELINE_MOTION } from '@/components/HistoryApp/timeline/styles';
import { rulerLabelPadding } from '@/components/HistoryApp/timeline/tokens';
import { TimelineDot } from '@/components/HistoryApp/timeline/TimelineDot';

type RulerTimelineRowProps = {
  label: React.ReactNode;
  yearLabel: string;
  active?: boolean;
  onClick: () => void;
};

/** 君主行 — 圆点与国家同一轨道，仅文本额外缩进 */
export function RulerTimelineRow({ label, yearLabel, active = false, onClick }: RulerTimelineRowProps) {
  const pad = rulerLabelPadding(RULER_DOT_SIZE);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={preventMouseFocus}
      className={`group relative flex w-full min-h-0 items-center justify-between gap-3 pr-3 py-[7px] text-left ${ROW_BUTTON_CLASS}`}
      style={{ paddingLeft: `${pad}px` }}
    >
      <TimelineDot
        railX={TIMELINE_RAIL_X.polity}
        depth={2}
        dotSize={RULER_DOT_SIZE}
        hollow={!active}
        active={active}
      />
      <span className={`min-w-0 truncate text-[13px] leading-[16px] transition-colors ${TIMELINE_MOTION} ${rulerNameClass(active)}`}>
        {label}
      </span>
      <span className={`shrink-0 text-[11px] leading-[13px] tabular-nums transition-colors ${TIMELINE_MOTION} ${rulerYearClass(active)}`}>
        {yearLabel}
      </span>
    </button>
  );
}
