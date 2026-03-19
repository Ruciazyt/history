'use client';

import * as React from 'react';
import { STATS_GRADIENTS, STATS_BORDER_COLORS, STATS_TEXT_COLORS, STATS_LABEL_COLORS } from '@/lib/history/constants';

interface StatsCardProps {
  /** 统计数值 */
  value: number | string;
  /** 统计标签 */
  label: string;
  /** 背景渐变方向 */
  gradient?: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'gray';
  /** 图标 */
  icon?: React.ReactNode;
  /** 是否突出显示 */
  highlighted?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 点击事件 */
  onClick?: () => void;
}

export function StatsCard({
  value,
  label,
  gradient = 'gray',
  icon,
  highlighted = false,
  className = '',
  onClick,
}: StatsCardProps) {
  const gradientClass = STATS_GRADIENTS[gradient];
  const borderClass = STATS_BORDER_COLORS[gradient];
  const textClass = STATS_TEXT_COLORS[gradient];
  const labelClass = STATS_LABEL_COLORS[gradient];

  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      onClick={onClick}
      className={`
        rounded-xl p-3 border ${borderClass} bg-gradient-to-br ${gradientClass}
        ${onClick ? 'hover:shadow-md cursor-pointer transition-all hover:scale-[1.02]' : ''}
        ${highlighted ? 'ring-2 ring-offset-2 ring-current' : ''}
        ${className}
      `}
      type={onClick ? 'button' : undefined}
    >
      <div className="flex items-center gap-2">
        {icon && (
          <div className={`text-lg ${highlighted ? '' : 'opacity-70'}`}>
            {icon}
          </div>
        )}
        <div className={icon ? '' : 'text-center w-full'}>
          <div className={`text-2xl font-bold ${textClass}`}>
            {value}
          </div>
          <div className={`text-xs ${labelClass}`}>
            {label}
          </div>
        </div>
      </div>
    </Component>
  );
}

interface StatsGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

const GRID_COLUMNS: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

export function StatsGrid({ children, columns = 4, className = '' }: StatsGridProps) {
  return (
    <div className={`grid gap-3 ${GRID_COLUMNS[columns]} ${className}`}>
      {children}
    </div>
  );
}
