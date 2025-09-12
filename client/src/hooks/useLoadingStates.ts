import { useState, useCallback, useRef } from 'react';

interface LoadingState {
  isLoading: boolean;
  error: Error | null;
  progress?: number;
}

interface LoadingStates {
  [key: string]: LoadingState;
}

interface UseLoadingStatesReturn {
  loadingStates: LoadingStates;
  setLoading: (key: string, isLoading: boolean) => void;
  setError: (key: string, error: Error | null) => void;
  setProgress: (key: string, progress: number) => void;
  isLoading: (key: string) => boolean;
  hasError: (key: string) => boolean;
  getError: (key: string) => Error | null;
  getProgress: (key: string) => number;
  clearLoading: (key: string) => void;
  clearAllLoading: () => void;
  withLoading: <T extends any[], R>(
    key: string,
    fn: (...args: T) => Promise<R>
  ) => (...args: T) => Promise<R>;
}

export function useLoadingStates(): UseLoadingStatesReturn {
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({});
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        isLoading,
        error: isLoading ? null : prev[key]?.error || null,
      },
    }));

    // Clear any existing timeout for this key
    const existingTimeout = timeoutsRef.current.get(key);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      timeoutsRef.current.delete(key);
    }

    // Set a timeout to automatically clear loading state after 30 seconds
    if (isLoading) {
      const timeout = setTimeout(() => {
        setLoadingStates(prev => ({
          ...prev,
          [key]: {
            ...prev[key],
            isLoading: false,
            error: new Error('Request timeout'),
          },
        }));
        timeoutsRef.current.delete(key);
      }, 30000);
      
      timeoutsRef.current.set(key, timeout);
    }
  }, []);

  const setError = useCallback((key: string, error: Error | null) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        error,
        isLoading: false,
      },
    }));
  }, []);

  const setProgress = useCallback((key: string, progress: number) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        progress: Math.min(100, Math.max(0, progress)),
      },
    }));
  }, []);

  const isLoading = useCallback((key: string) => {
    return loadingStates[key]?.isLoading || false;
  }, [loadingStates]);

  const hasError = useCallback((key: string) => {
    return !!loadingStates[key]?.error;
  }, [loadingStates]);

  const getError = useCallback((key: string) => {
    return loadingStates[key]?.error || null;
  }, [loadingStates]);

  const getProgress = useCallback((key: string) => {
    return loadingStates[key]?.progress || 0;
  }, [loadingStates]);

  const clearLoading = useCallback((key: string) => {
    setLoadingStates(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });

    const timeout = timeoutsRef.current.get(key);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(key);
    }
  }, []);

  const clearAllLoading = useCallback(() => {
    setLoadingStates({});
    
    // Clear all timeouts
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current.clear();
  }, []);

  const withLoading = useCallback(<T extends any[], R>(
    key: string,
    fn: (...args: T) => Promise<R>
  ) => {
    return async (...args: T): Promise<R> => {
      setLoading(key, true);
      setError(key, null);
      
      try {
        const result = await fn(...args);
        setLoading(key, false);
        return result;
      } catch (error) {
        setError(key, error instanceof Error ? error : new Error(String(error)));
        throw error;
      }
    };
  }, [setLoading, setError]);

  return {
    loadingStates,
    setLoading,
    setError,
    setProgress,
    isLoading,
    hasError,
    getError,
    getProgress,
    clearLoading,
    clearAllLoading,
    withLoading,
  };
}

// Specialized hook for async operations with automatic loading states
export function useAsyncOperation<T extends any[], R>(
  key: string,
  operation: (...args: T) => Promise<R>
) {
  const {
    isLoading,
    hasError,
    getError,
    getProgress,
    setLoading,
    setError,
    setProgress,
    clearLoading,
  } = useLoadingStates();

  const execute = useCallback(async (...args: T): Promise<R> => {
    setLoading(key, true);
    setError(key, null);
    
    try {
      const result = await operation(...args);
      setLoading(key, false);
      return result;
    } catch (error) {
      setError(key, error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }, [key, operation, setLoading, setError]);

  const executeWithProgress = useCallback(async (
    progressCallback: (progress: number) => void,
    ...args: T
  ): Promise<R> => {
    setLoading(key, true);
    setError(key, null);
    setProgress(key, 0);
    
    try {
      const result = await operation(...args);
      setProgress(key, 100);
      setTimeout(() => setLoading(key, false), 500); // Brief delay to show 100%
      return result;
    } catch (error) {
      setError(key, error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }, [key, operation, setLoading, setError, setProgress]);

  return {
    execute,
    executeWithProgress,
    isLoading: isLoading(key),
    hasError: hasError(key),
    error: getError(key),
    progress: getProgress(key),
    updateProgress: (progress: number) => setProgress(key, progress),
    clear: () => clearLoading(key),
  };
}

// Hook for managing multiple related loading states
export function usePageLoadingStates() {
  const loadingStates = useLoadingStates();

  const pageStates = {
    initial: 'page_initial',
    data: 'page_data',
    save: 'page_save',
    delete: 'page_delete',
    export: 'page_export',
    import: 'page_import',
  };

  return {
    ...loadingStates,
    page: {
      isInitialLoading: loadingStates.isLoading(pageStates.initial),
      isDataLoading: loadingStates.isLoading(pageStates.data),
      isSaving: loadingStates.isLoading(pageStates.save),
      isDeleting: loadingStates.isLoading(pageStates.delete),
      isExporting: loadingStates.isLoading(pageStates.export),
      isImporting: loadingStates.isLoading(pageStates.import),
      
      setInitialLoading: (loading: boolean) => loadingStates.setLoading(pageStates.initial, loading),
      setDataLoading: (loading: boolean) => loadingStates.setLoading(pageStates.data, loading),
      setSaving: (loading: boolean) => loadingStates.setLoading(pageStates.save, loading),
      setDeleting: (loading: boolean) => loadingStates.setLoading(pageStates.delete, loading),
      setExporting: (loading: boolean) => loadingStates.setLoading(pageStates.export, loading),
      setImporting: (loading: boolean) => loadingStates.setLoading(pageStates.import, loading),

      hasError: (state: keyof typeof pageStates) => loadingStates.hasError(pageStates[state]),
      getError: (state: keyof typeof pageStates) => loadingStates.getError(pageStates[state]),
      clearError: (state: keyof typeof pageStates) => loadingStates.setError(pageStates[state], null),
    },
  };
}