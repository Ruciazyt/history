'use client';

import * as React from 'react';
import { WorldTimeline } from '@/components/world/WorldTimeline';

interface WorldClientProps {
  locale: string;
  minYear: number;
  maxYear: number;
}

// 时间范围
const WORLD_MIN_YEAR = -500;  // 公元前500年
const WORLD_MAX_YEAR = 1900;  // 公元1900年

export function WorldClient({}: WorldClientProps) {
  return (
    <WorldTimeline 
      minYear={WORLD_MIN_YEAR} 
      maxYear={WORLD_MAX_YEAR} 
    />
  );
}
