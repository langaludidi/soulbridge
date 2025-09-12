import { useEffect, useRef } from 'react';
import { getPerformanceMonitor } from '@/lib/performance';

// Hook for tracking component mount/unmount performance
export function useComponentPerformance(componentName: string) {
  const startTimeRef = useRef<number>();
  const monitor = getPerformanceMonitor();

  useEffect(() => {
    startTimeRef.current = performance.now();

    return () => {
      if (startTimeRef.current && monitor) {
        const duration = performance.now() - startTimeRef.current;
        monitor.trackCustomMetric(`component_lifecycle_${componentName}`, duration, {
          type: 'component_lifecycle',
          component: componentName,
        });
      }
    };
  }, [componentName, monitor]);
}

// Hook for tracking render performance
export function useRenderPerformance(componentName: string) {
  const monitor = getPerformanceMonitor();

  useEffect(() => {
    const startTime = performance.now();
    
    // Use requestAnimationFrame to measure after render is complete
    const raf = requestAnimationFrame(() => {
      const endTime = performance.now();
      monitor?.trackCustomMetric(`component_render_${componentName}`, endTime - startTime, {
        type: 'component_render',
        component: componentName,
      });
    });

    return () => {
      cancelAnimationFrame(raf);
    };
  });
}

// Hook for tracking async operations
export function useAsyncOperationTracking() {
  const monitor = getPerformanceMonitor();

  const trackAsyncOperation = (operationName: string) => {
    const startTime = performance.now();
    
    return {
      start: startTime,
      end: (metadata?: Record<string, any>) => {
        const endTime = performance.now();
        monitor?.trackCustomMetric(`async_${operationName}`, endTime - startTime, {
          type: 'async_operation',
          operation: operationName,
          ...metadata,
        });
      },
    };
  };

  return { trackAsyncOperation };
}

// Hook for tracking page load performance
export function usePagePerformance(pageName: string) {
  const monitor = getPerformanceMonitor();

  useEffect(() => {
    const startTime = performance.now();

    // Track initial page load
    const handleLoad = () => {
      const loadTime = performance.now() - startTime;
      monitor?.trackCustomMetric(`page_load_${pageName}`, loadTime, {
        type: 'page_load',
        page: pageName,
      });
    };

    // Track if page is already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [pageName, monitor]);
}

// Hook for tracking user interactions
export function useInteractionTracking() {
  const monitor = getPerformanceMonitor();

  const trackInteraction = (interactionType: string, elementId?: string) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      monitor?.trackCustomMetric(`interaction_${interactionType}`, endTime - startTime, {
        type: 'user_interaction',
        interaction: interactionType,
        element: elementId,
      });
    };
  };

  return { trackInteraction };
}