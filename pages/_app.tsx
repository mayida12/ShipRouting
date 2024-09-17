import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import '../app/globals.css';  // Make sure this path is correct

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const originalConsoleError = console.error;
    console.error = function(...args) {
      if (args[0] && args[0].includes && args[0].includes('Warning: ReactDOM.render is no longer supported in React 18')) {
        return;
      }
      originalConsoleError.apply(console, args);
    };

    window.addEventListener('error', (event) => {
      if (event.error && event.error.message && !event.error.message.includes('ChunkLoadError')) {
        console.error('Unhandled error:', event.error);
        // Optionally, you can send this error to an error tracking service
      }
    });

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  return (
    <ThemeProvider attribute="class">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;