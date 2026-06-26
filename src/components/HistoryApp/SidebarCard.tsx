'use client';

import * as React from 'react';

interface SidebarCardProps {
  children: React.ReactNode;
  className?: string;
}

/** Floating white panel from Figma — rounded corners + soft shadow */
export function SidebarCard({ children, className = '' }: SidebarCardProps) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-[var(--layout-figma-sidebar-radius)] bg-[var(--color-figma-card-bg)] shadow-[var(--color-figma-card-shadow)] ${className}`}
    >
      {children}
    </div>
  );
}
