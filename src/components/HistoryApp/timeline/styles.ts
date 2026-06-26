import type { MouseEvent } from 'react';
import type { TimelineDepth } from '@/components/HistoryApp/timeline/constants';

export const TIMELINE_MOTION = 'duration-200 ease-out';

/** 鼠标点击不抢焦点，避免 focus 样式闪动 */
export function preventMouseFocus(e: MouseEvent) {
  e.preventDefault();
}

export const ROW_BUTTON_CLASS =
  'timeline-row-btn border-0 bg-transparent outline-none ring-0 focus:outline-none focus:ring-0 [-webkit-tap-highlight-color:transparent] select-none active:bg-transparent touch-manipulation';

export const EXPANDED_PANEL_CLASS =
  'bg-[var(--color-figma-sidebar-expanded-panel-bg)] -mx-[14px] px-[14px]';

export const ERA_YEAR_CLASS =
  'shrink-0 text-[13px] leading-[16px] text-[var(--color-figma-sidebar-era-year)]';

export function nodeLabelClass(depth: TimelineDepth): string {
  if (depth === 0) {
    return 'text-[15px] leading-[18px] text-[var(--color-figma-sidebar-era-name)]';
  }
  if (depth === 2) {
    return 'text-[13px] leading-[16px] text-[var(--color-figma-polity-name)]';
  }
  return 'text-[13px] leading-[16px] text-[var(--color-figma-sidebar-era-name)]';
}

export function rulerNameClass(active: boolean): string {
  return active
    ? 'text-[var(--color-figma-ruler-active-name)]'
    : 'text-[var(--color-figma-ruler-name)] group-hover:text-[var(--color-figma-sidebar-era-name)]';
}

export function rulerYearClass(active: boolean): string {
  return active
    ? 'text-[var(--color-figma-ruler-active-year)]'
    : 'text-[var(--color-figma-ruler-year)] group-hover:text-[var(--color-figma-sidebar-era-year)]';
}
