'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ERROR_BOUNDARY_COLORS } from '@/lib/history/constants';
import { logger } from '@/lib/history/logger';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  /** Optional error boundary name for logging context */
  name?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

/** Inner class component — handles React error lifecycle. Translations are passed via props. */
interface InnerProps extends ErrorBoundaryProps {
  errorTitle: string;
  errorDesc: string;
  errorDetails: string;
  retry: string;
  refreshPage: string;
}

class ErrorBoundaryInner extends React.Component<InnerProps, ErrorBoundaryState> {
  constructor(props: InnerProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('ui', `[ErrorBoundary ${this.props.name || 'anonymous'}] caught an error`, {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
    
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <div className="text-6xl mb-4">😵</div>
          <h2 className={`text-xl font-semibold ${ERROR_BOUNDARY_COLORS.title.text} mb-2`}>
            {this.props.errorTitle}
          </h2>
          <p className={`${ERROR_BOUNDARY_COLORS.description.text} mb-4 max-w-md`}>
            {this.props.errorDesc}
          </p>
          
          {/* Show error details in development mode */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mb-6 w-full max-w-lg text-left">
              <summary className={`cursor-pointer text-sm ${ERROR_BOUNDARY_COLORS.errorDetails.summary.text} ${ERROR_BOUNDARY_COLORS.errorDetails.summary.hover}`}>
                {this.props.errorDetails}
              </summary>
              <pre className={`mt-2 overflow-auto rounded ${ERROR_BOUNDARY_COLORS.errorDetails.pre.bg} p-3 text-xs ${ERROR_BOUNDARY_COLORS.errorDetails.pre.text}`}>
                {this.state.error.message}
                {this.state.error.stack && `\n\n${this.state.error.stack}`}
              </pre>
            </details>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={this.handleRetry}
              className={`px-4 py-2 ${ERROR_BOUNDARY_COLORS.button.primary.bg} ${ERROR_BOUNDARY_COLORS.button.primary.hover} ${ERROR_BOUNDARY_COLORS.button.primary.text} rounded-lg transition-colors`}
            >
              {this.props.retry}
            </button>
            <button
              onClick={() => window.location.reload()}
              className={`px-4 py-2 ${ERROR_BOUNDARY_COLORS.button.secondary.bg} ${ERROR_BOUNDARY_COLORS.button.secondary.hover} ${ERROR_BOUNDARY_COLORS.button.secondary.text} rounded-lg transition-colors`}
            >
              {this.props.refreshPage}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * ErrorBoundary with i18n support.
 * Wraps the class-based ErrorBoundaryInner to provide translations via useTranslations hook.
 */
export function ErrorBoundary({ children, fallback, name }: ErrorBoundaryProps) {
  const t = useTranslations('error');

  return (
    <ErrorBoundaryInner
      fallback={fallback}
      name={name}
      errorTitle={t('somethingWrong')}
      errorDesc={t('loadFailed')}
      errorDetails={t('details')}
      retry={t('retry')}
      refreshPage={t('refreshPage')}
    >
      {children}
    </ErrorBoundaryInner>
  );
}
