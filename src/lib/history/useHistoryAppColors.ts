'use client';

import * as React from 'react';
import { useTheme } from '@/components/common/ThemeContext';
import { HISTORY_APP_COLORS, HISTORY_APP_EXTRA_COLORS } from '@/lib/history/constants';

export function useHistoryAppColors() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Return dark-mode-aware color sets
  const C = React.useMemo(() => {
    if (!isDark) return HISTORY_APP_COLORS;

    // Deep-clone and apply dark mode transformations
    const d = HISTORY_APP_COLORS;
    return {
      ...d,
      container: {
        bg: 'bg-zinc-900',
        text: 'text-zinc-100',
      },
      header: {
        border: 'border-zinc-700',
        bg: 'bg-zinc-800',
        title: {
          small: 'text-zinc-500',
          large: 'text-zinc-100',
        },
      },
      civSwitcher: {
        container: 'border border-zinc-700 bg-zinc-800',
        active: {
          bg: 'bg-zinc-700',
          text: 'text-zinc-100',
          shadow: 'shadow-none',
          font: 'font-medium',
        },
        inactive: 'text-zinc-400 hover:text-zinc-200',
      },
      eraInfo: {
        text: 'text-zinc-400',
        separator: 'text-zinc-600',
        font: 'font-medium',
      },
      quickLink: {
        timeline: {
          bg: 'bg-zinc-800 hover:bg-zinc-700',
          text: 'text-zinc-300',
          border: 'border-zinc-700',
        },
        matrix: {
          bg: 'bg-zinc-800 hover:bg-zinc-700',
          text: 'text-zinc-300',
          border: 'border-zinc-700',
        },
        battles: {
          bg: 'bg-zinc-800 hover:bg-zinc-700',
          text: 'text-zinc-300',
          border: 'border-zinc-700',
        },
        eurasian: {
          bg: 'bg-zinc-800 hover:bg-zinc-700',
          text: 'text-zinc-300',
          border: 'border-zinc-700',
        },
        placeNames: {
          bg: 'bg-zinc-800 hover:bg-zinc-700',
          text: 'text-zinc-300',
          border: 'border-zinc-700',
        },
      },
      sidebar: {
        container: {
          bg: 'bg-zinc-800',
          border: 'border-zinc-700',
        },
        header: {
          bg: 'bg-zinc-800',
          border: 'border-zinc-700',
          text: 'text-zinc-500',
        },
        eraItem: {
          border: 'border-zinc-800',
          hover: 'hover:bg-zinc-700',
          dot: 'bg-zinc-500',
          name: 'text-zinc-300',
          year: 'text-zinc-500',
          toggle: 'text-zinc-600',
        },
        table: {
          header: {
            border: 'border-zinc-700',
            text: 'text-zinc-500',
          },
          row: {
            border: 'border-zinc-800',
            hover: 'hover:bg-zinc-700',
            year: 'text-zinc-500 font-medium',
            cell: 'text-zinc-300',
          },
          rulerButton: {
            active: 'bg-blue-900 text-blue-200 font-medium',
            inactive: 'hover:bg-zinc-700 text-zinc-300',
          },
        },
        rulerList: {
          active: 'bg-blue-900 text-blue-200',
          inactive: 'hover:bg-zinc-700 text-zinc-400',
        },
      },
      timeline: {
        container: {
          bg: 'bg-zinc-800',
          border: 'border-zinc-700',
        },
        header: {
          text: 'text-zinc-500',
          year: 'text-zinc-100 font-semibold',
          window: 'font-semibold',
          range: 'text-zinc-400',
        },
        windowButton: {
          active: {
            bg: 'bg-blue-600',
            text: 'text-white',
          },
          inactive: {
            bg: 'bg-zinc-700',
            text: 'text-zinc-400',
            hover: 'hover:bg-zinc-600',
          },
        },
        navButton: {
          bg: 'bg-zinc-700',
          text: 'text-zinc-400',
          hover: 'hover:bg-zinc-600',
          disabled: 'disabled:opacity-40',
        },
      },
      mapContainer: {
        bg: 'bg-zinc-800',
        border: 'border-zinc-700',
      },
      eventsSidebar: {
        container: {
          bg: 'bg-zinc-800',
          border: 'border-zinc-700',
        },
        header: {
          bg: 'bg-zinc-800',
          border: 'border-zinc-700',
          text: 'text-zinc-500',
        },
        eventItem: {
          border: 'border-zinc-800',
          year: 'text-zinc-500',
          title: 'text-zinc-300',
          warBadge: {
            bg: 'bg-red-900/50',
            text: 'text-red-300',
          },
        },
        compare: {
          header: {
            bg: 'bg-zinc-900',
            border: 'border-zinc-700',
            text: 'text-zinc-500',
          },
          title: 'text-zinc-500',
        },
        empty: 'text-zinc-500',
      },
      rulerDetail: {
        container: {
          bg: 'bg-zinc-800',
          border: 'border-zinc-700',
        },
        header: {
          text: 'text-zinc-500',
          name: 'text-zinc-100',
          eraBadge: {
            bg: 'bg-amber-900/50',
            text: 'text-amber-300',
          },
          year: 'text-zinc-500',
        },
        closeButton: {
          border: 'border-zinc-600',
          bg: 'bg-zinc-700',
          text: 'text-zinc-400',
          hover: 'hover:bg-zinc-600',
        },
        highlight: 'text-zinc-300',
        bio: 'text-zinc-400',
        seedNote: 'text-zinc-500',
      },
    };
  }, [isDark]);

  const EXTRA = React.useMemo(() => {
    if (!isDark) return HISTORY_APP_EXTRA_COLORS;
    return {
      divider: {
        default: 'text-zinc-600',
        light: 'text-zinc-700',
        dark: 'text-zinc-400',
      },
      multiPolity: {
        text: 'text-zinc-500',
      },
      arrow: {
        text: 'text-zinc-600',
      },
      eventTitle: {
        default: 'text-zinc-300',
        light: 'text-zinc-500',
      },
      rangeLabel: {
        text: 'text-zinc-400',
      },
      sidebar: {
        nav: {
          border: 'border-zinc-700',
          padding: 'pl-2 ml-1',
        },
      },
      eventItem: {
        title: 'text-zinc-300',
      },
    };
  }, [isDark]);

  return { C, EXTRA };
}
