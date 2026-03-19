'use client';

import * as React from 'react';
import { useTheme } from './ThemeContext';
import { THEME_TOGGLE_COLORS } from '@/lib/history/constants';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`${THEME_TOGGLE_COLORS.button.container} ${THEME_TOGGLE_COLORS.button.dimensions} ${THEME_TOGGLE_COLORS.button.border} ${THEME_TOGGLE_COLORS.button.bg} ${THEME_TOGGLE_COLORS.button.cursor} ${THEME_TOGGLE_COLORS.button.fontSize} ${THEME_TOGGLE_COLORS.button.transition} ${THEME_TOGGLE_COLORS.hover.bg} ${className || ''}`}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      title={theme === 'light' ? '深色模式' : '浅色模式'}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
