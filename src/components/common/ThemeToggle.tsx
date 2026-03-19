'use client';

import * as React from 'react';
import { useTheme } from './ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center w-9 h-9 border-none rounded-lg bg-transparent cursor-pointer text-lg transition-colors duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 ${className || ''}`}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      title={theme === 'light' ? '深色模式' : '浅色模式'}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
