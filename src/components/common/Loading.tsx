'use client';

import * as React from 'react';
import { LOADING_STATE_COLORS, LIST_SKELETON_COLORS } from '@/lib/history/constants';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export function Loading({ size = 'md', text, fullScreen = false }: LoadingProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses[size]} ${LOADING_STATE_COLORS.spinner.ring}`} />
      {text && <p className={`text-sm ${LOADING_STATE_COLORS.spinner.text}`}>{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full">
        {content}
      </div>
    );
  }

  return content;
}

// Skeleton loading for cards
export function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className={`h-32 ${LOADING_STATE_COLORS.skeleton.bg} rounded-xl`} />
    </div>
  );
}

// Skeleton loading for list items
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3 animate-pulse">
      <div className={`w-8 h-8 ${LIST_SKELETON_COLORS.avatar.bg} rounded-full`} />
      <div className="flex-1 space-y-2">
        <div className={`h-4 ${LIST_SKELETON_COLORS.title.bg} rounded w-3/4`} />
        <div className={`h-3 ${LIST_SKELETON_COLORS.subtitle.bg} rounded w-1/2`} />
      </div>
    </div>
  );
}
