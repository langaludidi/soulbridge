// Performance monitoring and web vitals tracking
// import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals'; // Disabled for build

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

interface PerformanceConfig {
  enableLogging?: boolean;
  enableAnalytics?: boolean;
  reportEndpoint?: string;
  sampleRate?: number;
}

class PerformanceMonitor {
  private config: PerformanceConfig;
  private metrics: Map<string, PerformanceMetric> = new Map();
  private observers: PerformanceObserver[] = [];

  constructor(config: PerformanceConfig = {}) {
    this.config = {
      enableLogging: config.enableLogging ?? process.env.NODE_ENV === 'development',
      enableAnalytics: config.enableAnalytics ?? process.env.NODE_ENV === 'production',
      sampleRate: config.sampleRate ?? 0.1, // 10% of users
      ...config,
    };

    this.init();
  }

  private init() {
    // Only monitor performance for a sample of users
    if (Math.random() > this.config.sampleRate) {
      return;
    }

    this.setupWebVitals();
    this.setupResourceTiming();
    this.setupNavigationTiming();
    this.setupLongTasks();
  }

  private setupWebVitals() {
    // Core Web Vitals
    onCLS(this.handleMetric.bind(this, 'CLS'));
    onINP(this.handleMetric.bind(this, 'INP')); // INP replaced FID in v5
    onFCP(this.handleMetric.bind(this, 'FCP'));
    onLCP(this.handleMetric.bind(this, 'LCP'));
    onTTFB(this.handleMetric.bind(this, 'TTFB'));
  }

  private setupResourceTiming() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            this.trackResourceTiming(entry as PerformanceResourceTiming);
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['resource'] });
        this.observers.push(observer);
      } catch (e) {
        // PerformanceObserver not supported
      }
    }
  }

  private setupNavigationTiming() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            this.trackNavigationTiming(entry as PerformanceNavigationTiming);
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['navigation'] });
        this.observers.push(observer);
      } catch (e) {
        // PerformanceObserver not supported
      }
    }
  }

  private setupLongTasks() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'longtask') {
            this.trackLongTask(entry);
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['longtask'] });
        this.observers.push(observer);
      } catch (e) {
        // Long task observer not supported
      }
    }
  }

  private handleMetric(metricName: string, metric: any) {
    const performanceMetric: PerformanceMetric = {
      name: metricName,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType || 'unknown',
    };

    this.metrics.set(metricName, performanceMetric);

    if (this.config.enableLogging) {
      console.log(`[Performance] ${metricName}:`, performanceMetric);
    }

    if (this.config.enableAnalytics) {
      this.sendToAnalytics(performanceMetric);
    }
  }

  private trackResourceTiming(entry: PerformanceResourceTiming) {
    const slowThreshold = 1000; // 1 second
    const duration = entry.responseEnd - entry.startTime;

    if (duration > slowThreshold) {
      if (this.config.enableLogging) {
        console.warn(`[Performance] Slow resource: ${entry.name} (${duration.toFixed(2)}ms)`);
      }

      if (this.config.enableAnalytics) {
        this.sendToAnalytics({
          name: 'slow_resource',
          value: duration,
          rating: 'poor',
          delta: 0,
          id: `resource_${Date.now()}`,
          navigationType: 'resource',
          resource: {
            name: entry.name,
            type: entry.initiatorType,
            size: entry.transferSize,
          },
        });
      }
    }
  }

  private trackNavigationTiming(entry: PerformanceNavigationTiming) {
    const metrics = {
      dns_lookup: entry.domainLookupEnd - entry.domainLookupStart,
      tcp_connect: entry.connectEnd - entry.connectStart,
      ssl_negotiation: entry.connectEnd - entry.secureConnectionStart,
      request_response: entry.responseEnd - entry.requestStart,
      dom_processing: entry.domContentLoadedEventStart - entry.responseEnd,
      total_load: entry.loadEventEnd - entry.navigationStart,
    };

    if (this.config.enableLogging) {
      console.log('[Performance] Navigation timing:', metrics);
    }

    if (this.config.enableAnalytics) {
      Object.entries(metrics).forEach(([key, value]) => {
        if (value > 0) {
          this.sendToAnalytics({
            name: `navigation_${key}`,
            value,
            rating: value > 1000 ? 'poor' : value > 500 ? 'needs-improvement' : 'good',
            delta: 0,
            id: `nav_${key}_${Date.now()}`,
            navigationType: 'navigation',
          });
        }
      });
    }
  }

  private trackLongTask(entry: PerformanceEntry) {
    if (this.config.enableLogging) {
      console.warn(`[Performance] Long task detected: ${entry.duration.toFixed(2)}ms`);
    }

    if (this.config.enableAnalytics) {
      this.sendToAnalytics({
        name: 'long_task',
        value: entry.duration,
        rating: 'poor',
        delta: 0,
        id: `longtask_${Date.now()}`,
        navigationType: 'longtask',
      });
    }
  }

  private sendToAnalytics(metric: any) {
    // Send to analytics service (e.g., Google Analytics, custom endpoint)
    if (this.config.reportEndpoint) {
      fetch(this.config.reportEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...metric,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
        }),
      }).catch((error) => {
        console.error('Failed to send performance metric:', error);
      });
    }

    // Send to Google Analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.value),
        non_interaction: true,
      });
    }
  }

  // Public methods for manual tracking
  public trackCustomMetric(name: string, value: number, attributes: Record<string, any> = {}) {
    const metric = {
      name: `custom_${name}`,
      value,
      rating: 'good' as const,
      delta: 0,
      id: `custom_${name}_${Date.now()}`,
      navigationType: 'custom',
      ...attributes,
    };

    if (this.config.enableLogging) {
      console.log(`[Performance] Custom metric - ${name}:`, metric);
    }

    if (this.config.enableAnalytics) {
      this.sendToAnalytics(metric);
    }
  }

  public trackTiming(name: string, startTime: number, endTime?: number) {
    const end = endTime || performance.now();
    const duration = end - startTime;
    this.trackCustomMetric(name, duration, { type: 'timing' });
  }

  public getMetrics(): Map<string, PerformanceMetric> {
    return new Map(this.metrics);
  }

  public getCurrentPageMetrics() {
    return {
      cls: this.metrics.get('CLS'),
      inp: this.metrics.get('INP'), // Updated to use INP instead of FID
      fcp: this.metrics.get('FCP'),
      lcp: this.metrics.get('LCP'),
      ttfb: this.metrics.get('TTFB'),
    };
  }

  public destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

export function initPerformanceMonitoring(config?: PerformanceConfig) {
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor(config);
  }
  return performanceMonitor;
}

export function getPerformanceMonitor(): PerformanceMonitor | null {
  return performanceMonitor;
}

// Utility functions for common performance measurements
export function measurePageLoad() {
  if ('performance' in window && 'measure' in performance) {
    performance.measure('page-load', 'navigationStart');
  }
}

export function measureComponentRender(componentName: string) {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    performanceMonitor?.trackTiming(`component_render_${componentName}`, startTime, endTime);
  };
}

export function measureAsyncOperation(operationName: string) {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    performanceMonitor?.trackTiming(`async_${operationName}`, startTime, endTime);
  };
}

// React hook for component performance tracking
export function usePerformanceTracking(componentName: string) {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    performanceMonitor?.trackTiming(`react_${componentName}`, startTime, endTime);
  };
}