import * as React from 'react';
import type { Era, Ruler } from '@/lib/history/types';
import type { TimelineDepth } from '@/components/HistoryApp/timeline/constants';
import { TimelineExpandPanel } from '@/components/HistoryApp/timeline/TimelineExpandPanel';
import { TimelineNodeRow } from '@/components/HistoryApp/timeline/TimelineNodeRow';
import { TreeChevron } from '@/components/HistoryApp/timeline/TreeChevron';
import { RulerList } from '@/components/HistoryApp/RulerList';

type EraTreeNodeProps = {
  depth: TimelineDepth;
  label: React.ReactNode;
  trailing: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  dotColor?: string;
  era: Era;
  eraRulers: Ruler[];
  openPolityIds: Set<string>;
  selectedRulerId: string | null;
  onTogglePolity: (id: string) => void;
  onSelectRuler: (id: string) => void;
  locale: string;
  /** depth-0 且无可展开内容时不渲染面板 */
  expandWhenEmpty?: boolean;
  panelClassName?: string;
};

/** 单个年代节点：行 + 可折叠君主/七国面板 */
export function EraTreeNode({
  depth,
  label,
  trailing,
  open,
  onToggle,
  dotColor,
  era,
  eraRulers,
  openPolityIds,
  selectedRulerId,
  onTogglePolity,
  onSelectRuler,
  locale,
  expandWhenEmpty = true,
  panelClassName,
}: EraTreeNodeProps) {
  const canExpand = expandWhenEmpty || eraRulers.length > 0;

  return (
    <div>
      <TimelineNodeRow depth={depth} dotColor={dotColor} label={label} trailing={trailing} onClick={onToggle} />
      <TimelineExpandPanel open={open && canExpand} panelClassName={panelClassName}>
        <RulerList
          eraRulers={eraRulers}
          era={era}
          openPolityIds={openPolityIds}
          selectedRulerId={selectedRulerId}
          onTogglePolity={onTogglePolity}
          onSelectRuler={onSelectRuler}
          locale={locale}
        />
      </TimelineExpandPanel>
    </div>
  );
}

/** 带年份 + 箭头的年代行尾缀 */
export function EraRowTrailing({ yearLabel, open }: { yearLabel: React.ReactNode; open: boolean }) {
  return (
    <>
      <span className="shrink-0 text-[13px] leading-[16px] text-[var(--color-figma-sidebar-era-year)] mr-1">
        {yearLabel}
      </span>
      <TreeChevron open={open} />
    </>
  );
}
