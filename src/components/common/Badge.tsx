'use client';

import * as React from 'react';
import { BADGE_VARIANTS } from '@/lib/history/constants';

type BadgeVariant = keyof typeof BADGE_VARIANTS;

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

/**
 * Reusable Badge component with multiple variants
 */
export const Badge = React.memo(function Badge({ 
  children, 
  variant = 'default',
  className = '' 
}: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${BADGE_VARIANTS[variant]} ${className}`}>
      {children}
    </span>
  );
});
