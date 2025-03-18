// components/ErrorBoundary.tsx
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import LogRocket from 'logrocket';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    LogRocket.captureException(error, {
      extra: {
        errorInfo: JSON.stringify(errorInfo)
      }
    });

    LogRocket.getSessionURL((sessionURL: string) => {
      console.log('LogRocket session URL:', sessionURL);
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>Please try again later</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;