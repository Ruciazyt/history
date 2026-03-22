'use client';

import * as React from 'react';
import { BUTTON_SIZES, ACTION_COLORS, BUTTON_GHOST_COLORS } from '@/lib/history/constants';

type ButtonSize = keyof typeof BUTTON_SIZES;
type ButtonVariant = 'primary' | 'danger' | 'success' | 'neutral' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Reusable Button component with multiple variants and sizes
 */
export const Button = React.memo(function Button({
  children,
  size = 'md',
  variant = 'primary',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const sizeStyles = BUTTON_SIZES[size];
  
  // Use ACTION_COLORS from constants
  const variantStyles: Record<ButtonVariant, { bg: string; hover: string; text: string }> = {
    primary: ACTION_COLORS.primary,
    danger: ACTION_COLORS.danger,
    success: ACTION_COLORS.success,
    neutral: ACTION_COLORS.neutral,
    ghost: BUTTON_GHOST_COLORS,
  };
  
  const colorStyles = variantStyles[variant];

  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium
        ${sizeStyles.padding} ${sizeStyles.text} ${sizeStyles.radius}
        ${colorStyles.bg} ${colorStyles.hover} ${colorStyles.text}
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 animate-spin">⟳</span>
      ) : leftIcon ? (
        <span className="mr-2">{leftIcon}</span>
      ) : null}
      {children}
      {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
});
