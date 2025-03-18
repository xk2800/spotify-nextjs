// app/providers/LogRocketProvider.tsx
'use client';

import LogRocket from 'logrocket';
import { useEffect, ReactNode } from 'react';
// Or alternatively import React from 'react';

interface LogRocketProviderProps {
  children: ReactNode;
}

export function LogRocketProvider({ children }: LogRocketProviderProps) {
  useEffect(() => {
    LogRocket.init('hu8af1/xavier');

    // Capture unhandled errors
    const handleError = (event: ErrorEvent) => {
      LogRocket.captureException(event.error);
      LogRocket.getSessionURL((sessionURL: string) => {
        console.log('LogRocket session URL:', sessionURL);
      });
    };

    // Capture unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      LogRocket.captureException(event.reason);
      LogRocket.getSessionURL((sessionURL: string) => {
        console.log('LogRocket session URL:', sessionURL);
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  // The simplest solution - just return the children directly
  return children;

  // If you need a wrapper, use the JSX element directly:
  // return <Fragment>{children}</Fragment>;
  // or
  // return <>{children}</>;
}