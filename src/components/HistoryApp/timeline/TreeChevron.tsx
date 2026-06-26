import { TIMELINE_MOTION } from '@/components/HistoryApp/timeline/styles';

export function TreeChevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-[10px] h-[10px] shrink-0 text-[var(--color-figma-sidebar-era-year)] transition-transform ${TIMELINE_MOTION} ${open ? 'rotate-90' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
