'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from './ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const t = useTranslations('ui');
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  // Icon colors: use conditional classes to ensure visibility in both light and dark mode.
  // - Sun icon (shown in dark mode): amber on dark header = amber-400 (warm, high contrast)
  // - Moon icon (shown in light mode): zinc on light header = zinc-600 (neutral, subtle)
  const sunIconColor = 'text-amber-400';
  const moonIconColor = 'text-zinc-600';

  return (
    <button
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center w-9 h-9 border-0 rounded-lg bg-transparent cursor-pointer transition-colors duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 ${className || ''}`}
      aria-label={isDark ? t('themeLight') : t('themeDark')}
      title={isDark ? t('themeLight') : t('themeDark')}
    >
      {isDark ? (
        // Sun icon (user is in dark mode, clicking switches to light)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={sunIconColor}
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        // Moon icon (user is in light mode, clicking switches to dark)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={moonIconColor}
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
