'use client';

import * as React from 'react';

const NAV_ITEMS = [
  { key: 'timeline', label: '时间轴', active: true },
  { key: 'map', label: '地图探索', active: false },
  { key: 'theme', label: '主题', active: false },
  { key: 'people', label: '人物', active: false },
  { key: 'events', label: '事件', active: false },
  { key: 'docs', label: '文献', active: false },
] as const;

function LogoIcon() {
  return (
    <svg width="22" height="20" viewBox="0 0 22 20" fill="none" aria-hidden="true">
      <rect x="2" y="10" width="3" height="8" rx="1" fill="currentColor" />
      <rect x="9" y="6" width="3" height="12" rx="1" fill="currentColor" />
      <rect x="16" y="2" width="3" height="16" rx="1" fill="currentColor" />
    </svg>
  );
}

interface HistoryAppHeaderProps {
  className?: string;
  onOpenMobileMenu: () => void;
  openEraMenuLabel: string;
}

export function HistoryAppHeader({ className = '', onOpenMobileMenu, openEraMenuLabel }: HistoryAppHeaderProps) {
  return (
    <header
      className={`relative h-[var(--layout-figma-header-height)] overflow-hidden rounded-[12px] bg-[var(--color-figma-card-bg)] shadow-[var(--color-figma-card-shadow)] ${className}`}
    >
      <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center pl-[var(--layout-figma-header-pl)] pr-[var(--layout-figma-header-pr)]">
        {/* 左：Logo */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-2 text-[var(--color-figma-nav-logo)]">
            <LogoIcon />
            <span className="text-[20px] leading-none font-normal">时光地图</span>
          </div>
          <span className="hidden lg:block w-px h-[20px] bg-[var(--color-figma-tree-line)]" aria-hidden="true" />
          <span className="hidden lg:inline text-[14px] leading-none text-[var(--color-figma-nav-tagline)] whitespace-nowrap">
            探索历史的每一步
          </span>
        </div>

        {/* 中：导航（下划线在 header 内部底部） */}
        <nav className="hidden lg:flex items-stretch gap-[38px] h-full">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`relative flex items-center h-full text-[15px] leading-none transition-colors ${
                item.active
                  ? 'text-[var(--color-figma-nav-active)]'
                  : 'text-[var(--color-figma-nav-inactive)] hover:text-[var(--color-figma-nav-active)]'
              }`}
            >
              {item.label}
              {item.active && (
                <span
                  className="absolute bottom-[10px] left-1/2 -translate-x-1/2 w-[25px] h-[2px] bg-[var(--color-figma-nav-active)] rounded-full"
                  aria-hidden="true"
                />
              )}
            </button>
          ))}
        </nav>

        {/* 右：操作区 */}
        <div className="flex items-center justify-end gap-[30px] shrink-0">
          <button
            type="button"
            className="hidden md:flex text-[var(--color-figma-nav-inactive)] hover:text-[var(--color-figma-nav-active)] transition-colors"
            aria-label="搜索"
          >
            <svg className="w-[19px] h-[19px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button
            type="button"
            className="hidden md:flex text-[var(--color-figma-nav-inactive)] hover:text-[var(--color-figma-nav-active)] transition-colors"
            aria-label="收藏"
          >
            <svg className="w-[15px] h-[19px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
          <button
            type="button"
            className="hidden md:inline-flex items-center justify-center gap-1 h-[36px] w-[76px] rounded-[18px] border border-[var(--color-figma-login-border)] bg-[var(--color-figma-login-bg)] text-[13px] leading-none text-[var(--color-figma-login-text)] hover:opacity-90 transition-opacity"
          >
            <svg className="w-[12px] h-[12px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            登录
          </button>
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden text-[var(--color-figma-nav-inactive)]"
            aria-label={openEraMenuLabel}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
