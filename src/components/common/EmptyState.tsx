'use client';

import * as React from 'react';
import { EMPTY_STATE_COLORS, LOADING_STATE_COLORS, CARD_SKELETON_COLORS } from '@/lib/history/constants';

// Pre-defined skeleton widths to avoid impure Math.random() during render
const SKELETON_WIDTHS = [60, 80, 70, 90, 65, 85, 75, 95];

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Empty state component for displaying when no data is available
 */
export const EmptyState = React.memo(function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${EMPTY_STATE_COLORS.container}`}>
      <div className={EMPTY_STATE_COLORS.icon}>{icon}</div>
      <h3 className={EMPTY_STATE_COLORS.title}>{title}</h3>
      {description && (
        <p className={EMPTY_STATE_COLORS.description}>{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className={EMPTY_STATE_COLORS.actionButton.default}
        >
          {action.label}
        </button>
      )}
    </div>
  );
});

interface LoadingStateProps {
  variant?: 'spinner' | 'skeleton';
  lines?: number;
}

/**
 * Loading state component with skeleton support
 */
export const LoadingState = React.memo(function LoadingState({ variant = 'spinner', lines = 3 }: LoadingStateProps) {
  if (variant === 'skeleton') {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-4 ${LOADING_STATE_COLORS.skeleton.bg} rounded ${LOADING_STATE_COLORS.skeleton.animate}`}
            style={{ width: `${SKELETON_WIDTHS[i % SKELETON_WIDTHS.length]}%` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={LOADING_STATE_COLORS.spinner.container}>
      <div className={LOADING_STATE_COLORS.spinner.ring} />
    </div>
  );
});

/**
 * Card skeleton for loading states
 */
export function CardSkeleton() {
  return (
    <div className={CARD_SKELETON_COLORS.container}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className={CARD_SKELETON_COLORS.title} />
          <div className={CARD_SKELETON_COLORS.subtitle} />
        </div>
        <div className={CARD_SKELETON_COLORS.badge} />
      </div>
      <div className={CARD_SKELETON_COLORS.content} />
    </div>
  );
}

export default EmptyState;
