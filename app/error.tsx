'use client';

import LogRocket from 'logrocket';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to LogRocket
    LogRocket.captureException(error);

    // Get the LogRocket session URL
    LogRocket.getSessionURL((sessionURL: string) => {
      console.log('LogRocket session URL:', sessionURL);
      // You could send this URL to your backend or other monitoring services
    });
  }, [error]);

  return (
    <div className="error-container">
      <h2>Something went wrong</h2>
      <p>Our team has been notified and we&apos;re working on the issue.</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  );
}