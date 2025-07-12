import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Prevent error from bubbling up to Vite overlay
    if (error.message === 'Script error.' || error.message.includes('Script error')) {
      // This is likely a cross-origin script error, suppress it
      return;
    }
  }

  public render() {
    if (this.state.hasError) {
      // Return fallback UI or continue rendering children
      return this.props.fallback || this.props.children;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;