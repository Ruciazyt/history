'use client';

import * as React from 'react';
import { CARD_VARIANTS, CARD_COLORS } from '@/lib/history/constants';

type CardVariant = keyof typeof CARD_VARIANTS;

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

/**
 * Reusable Card component with multiple variants
 */
export const Card = React.memo(function Card({
  children,
  variant = 'default',
  className = '',
  onClick,
  hoverable = false,
}: CardProps) {
  const variantStyles = CARD_VARIANTS[variant];
  const isClickable = !!onClick;

  return (
    <div
      className={`
        ${variantStyles.container}
        ${isClickable ? 'cursor-pointer' : ''}
        ${hoverable ? variantStyles.hover : ''}
        ${className}
      `}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {children}
    </div>
  );
});

/**
 * Card header component
 */
export const CardHeader = React.memo(function CardHeader({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`${CARD_COLORS.header.padding} border-b ${CARD_COLORS.header.border} ${className}`}>
      {children}
    </div>
  );
});

/**
 * Card body component
 */
export const CardBody = React.memo(function CardBody({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
});

/**
 * Card footer component
 */
export const CardFooter = React.memo(function CardFooter({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`${CARD_COLORS.footer.padding} border-t ${CARD_COLORS.footer.border} ${CARD_COLORS.footer.bg} ${className}`}>
      {children}
    </div>
  );
});
