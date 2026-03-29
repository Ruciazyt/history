'use client';

import * as React from 'react';
import { EMPTY_STATE_COLORS } from '@/lib/history/constants';

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

export default EmptyState;
