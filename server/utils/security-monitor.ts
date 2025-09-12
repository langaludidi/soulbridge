import type { Request, Response } from 'express';
import { logger } from './logger';

// Security event types
export enum SecurityEventType {
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  AUTHENTICATION_FAILURE = 'authentication_failure',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  INVALID_INPUT = 'invalid_input',
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  SESSION_ANOMALY = 'session_anomaly',
  FILE_UPLOAD_THREAT = 'file_upload_threat',
  SQL_INJECTION_ATTEMPT = 'sql_injection_attempt',
  XSS_ATTEMPT = 'xss_attempt',
  CSRF_ATTEMPT = 'csrf_attempt',
  PRIVILEGE_ESCALATION = 'privilege_escalation',
  DATA_BREACH_ATTEMPT = 'data_breach_attempt',
  MALICIOUS_FILE_UPLOAD = 'malicious_file_upload',
  ACCOUNT_ENUMERATION = 'account_enumeration',
  BRUTE_FORCE_ATTACK = 'brute_force_attack',
}

// Security event severity levels
export enum SecuritySeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

interface SecurityEvent {
  type: SecurityEventType;
  severity: SecuritySeverity;
  message: string;
  details: Record<string, any>;
  timestamp: Date;
  source: {
    ip: string;
    userAgent?: string;
    userId?: string;
    sessionId?: string;
    path: string;
    method: string;
  };
  risk_score: number; // 1-100
  blocked: boolean;
  action_taken?: string;
}

interface ThreatIntelligence {
  known_malicious_ips: Set<string>;
  suspicious_patterns: RegExp[];
  blocked_user_agents: RegExp[];
  honeypot_endpoints: Set<string>;
}

class SecurityMonitor {
  private static instance: SecurityMonitor;
  private events: SecurityEvent[] = [];
  private threatIntel: ThreatIntelligence;
  private alertThresholds: Map<SecurityEventType, number> = new Map();
  private eventCounts: Map<string, Map<SecurityEventType, number>> = new Map();

  private constructor() {
    this.threatIntel = {
      known_malicious_ips: new Set([
        // Add known malicious IPs (these would come from threat feeds)
      ]),
      suspicious_patterns: [
        /\b(union|select|insert|delete|update|drop|create|alter)\s+/gi,
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /eval\s*\(/gi,
        /base64_decode|file_get_contents|system|exec|shell_exec/gi,
        /\.\.\/|\.\.\\|\.\.\%2f|\.\.\%5c/gi, // Directory traversal
      ],
      blocked_user_agents: [
        /sqlmap/i,
        /nikto/i,
        /nessus/i,
        /burpsuite/i,
        /owasp.zap/i,
        /acunetix/i,
        /netsparker/i,
        /w3af/i,
        /masscan/i,
        /nmap/i,
      ],
      honeypot_endpoints: new Set([
        '/admin',
        '/wp-admin',
        '/phpmyadmin',
        '/mysql',
        '/backup',
        '/.env',
        '/config.php',
      ]),
    };

    // Set alert thresholds
    this.alertThresholds.set(SecurityEventType.AUTHENTICATION_FAILURE, 5);
    this.alertThresholds.set(SecurityEventType.RATE_LIMIT_EXCEEDED, 3);
    this.alertThresholds.set(SecurityEventType.SUSPICIOUS_ACTIVITY, 10);
    this.alertThresholds.set(SecurityEventType.UNAUTHORIZED_ACCESS, 3);

    // Initialize cleanup interval
    this.startCleanupInterval();
  }

  public static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor();
    }
    return SecurityMonitor.instance;
  }

  public logEvent(
    type: SecurityEventType,
    severity: SecuritySeverity,
    message: string,
    req: Request,
    details: Record<string, any> = {},
    blocked: boolean = false,
    actionTaken?: string
  ): void {
    const event: SecurityEvent = {
      type,
      severity,
      message,
      details,
      timestamp: new Date(),
      source: {
        ip: req.ip || 'unknown',
        userAgent: req.get('User-Agent'),
        userId: (req as any).user?.claims?.sub,
        sessionId: req.sessionID,
        path: req.path,
        method: req.method,
      },
      risk_score: this.calculateRiskScore(type, severity, req, details),
      blocked,
      action_taken: actionTaken,
    };

    this.events.push(event);
    this.updateEventCounts(event.source.ip, type);

    // Log based on severity
    switch (severity) {
      case SecuritySeverity.CRITICAL:
        logger.error(`[SECURITY CRITICAL] ${message}`, event);
        this.sendAlert(event);
        break;
      case SecuritySeverity.HIGH:
        logger.error(`[SECURITY HIGH] ${message}`, event);
        this.sendAlert(event);
        break;
      case SecuritySeverity.MEDIUM:
        logger.warn(`[SECURITY MEDIUM] ${message}`, event);
        break;
      case SecuritySeverity.LOW:
        logger.info(`[SECURITY LOW] ${message}`, event);
        break;
    }

    // Check if we need to send aggregated alerts
    this.checkAggregatedAlerts(event.source.ip, type);
  }

  private calculateRiskScore(
    type: SecurityEventType,
    severity: SecuritySeverity,
    req: Request,
    details: Record<string, any>
  ): number {
    let score = 0;

    // Base score by severity
    switch (severity) {
      case SecuritySeverity.CRITICAL: score += 80; break;
      case SecuritySeverity.HIGH: score += 60; break;
      case SecuritySeverity.MEDIUM: score += 40; break;
      case SecuritySeverity.LOW: score += 20; break;
    }

    // Additional risk factors
    const ip = req.ip || '';
    const userAgent = req.get('User-Agent') || '';

    // Known malicious IP
    if (this.threatIntel.known_malicious_ips.has(ip)) {
      score += 20;
    }

    // Suspicious user agent
    if (this.threatIntel.blocked_user_agents.some(pattern => pattern.test(userAgent))) {
      score += 15;
    }

    // Frequency of events from this IP
    const ipEvents = this.eventCounts.get(ip);
    if (ipEvents) {
      const totalEvents = Array.from(ipEvents.values()).reduce((sum, count) => sum + count, 0);
      score += Math.min(totalEvents * 2, 20); // Cap at 20 points
    }

    // Time of day (higher risk during off-hours)
    const hour = new Date().getHours();
    if (hour < 6 || hour > 22) {
      score += 5;
    }

    // Geographic location risk (would need GeoIP integration)
    // if (isHighRiskCountry(ip)) score += 10;

    return Math.min(score, 100);
  }

  private updateEventCounts(ip: string, type: SecurityEventType): void {
    if (!this.eventCounts.has(ip)) {
      this.eventCounts.set(ip, new Map());
    }
    
    const ipEvents = this.eventCounts.get(ip)!;
    const currentCount = ipEvents.get(type) || 0;
    ipEvents.set(type, currentCount + 1);
  }

  private checkAggregatedAlerts(ip: string, type: SecurityEventType): void {
    const threshold = this.alertThresholds.get(type);
    if (!threshold) return;

    const ipEvents = this.eventCounts.get(ip);
    if (!ipEvents) return;

    const count = ipEvents.get(type) || 0;
    if (count >= threshold) {
      const alertEvent: SecurityEvent = {
        type,
        severity: SecuritySeverity.HIGH,
        message: `Threshold exceeded for ${type} from IP ${ip}`,
        details: { count, threshold, ip },
        timestamp: new Date(),
        source: {
          ip,
          path: 'aggregated',
          method: 'ALERT',
        },
        risk_score: 75,
        blocked: false,
        action_taken: 'alert_sent',
      };

      logger.error('[SECURITY ALERT] Threshold exceeded', alertEvent);
      this.sendAlert(alertEvent);
    }
  }

  private sendAlert(event: SecurityEvent): void {
    // In production, you would integrate with:
    // - Email alerts
    // - Slack/Teams notifications
    // - Security Information and Event Management (SIEM) systems
    // - PagerDuty or similar alerting services

    logger.error('[SECURITY ALERT]', {
      type: event.type,
      severity: event.severity,
      message: event.message,
      ip: event.source.ip,
      riskScore: event.risk_score,
      timestamp: event.timestamp,
      userId: event.source.userId,
    });

    // Example: Send to external monitoring service
    if (process.env.SECURITY_WEBHOOK_URL) {
      fetch(process.env.SECURITY_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      }).catch(error => {
        logger.error('Failed to send security alert to webhook', { error });
      });
    }
  }

  public analyzeRequest(req: Request): {
    isSuspicious: boolean;
    reasons: string[];
    riskScore: number;
  } {
    const reasons: string[] = [];
    let riskScore = 0;

    const ip = req.ip || '';
    const userAgent = req.get('User-Agent') || '';
    const path = req.path;
    
    // Check against threat intelligence
    if (this.threatIntel.known_malicious_ips.has(ip)) {
      reasons.push('Known malicious IP address');
      riskScore += 30;
    }

    if (this.threatIntel.blocked_user_agents.some(pattern => pattern.test(userAgent))) {
      reasons.push('Suspicious user agent');
      riskScore += 20;
    }

    if (this.threatIntel.honeypot_endpoints.has(path)) {
      reasons.push('Honeypot endpoint accessed');
      riskScore += 25;
    }

    // Check request content for suspicious patterns
    const requestData = JSON.stringify({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    for (const pattern of this.threatIntel.suspicious_patterns) {
      if (pattern.test(requestData)) {
        reasons.push(`Suspicious pattern detected: ${pattern.source.substring(0, 50)}`);
        riskScore += 15;
      }
    }

    // Check for common attack indicators
    const headers = req.headers;
    if (headers['x-forwarded-for'] && typeof headers['x-forwarded-for'] === 'string') {
      const forwardedIPs = headers['x-forwarded-for'].split(',');
      if (forwardedIPs.length > 5) {
        reasons.push('Excessive X-Forwarded-For chain');
        riskScore += 10;
      }
    }

    // Check for unusual request patterns
    if (req.method === 'OPTIONS' && !req.get('Access-Control-Request-Method')) {
      reasons.push('Suspicious OPTIONS request');
      riskScore += 5;
    }

    // Check content length vs actual content
    const contentLength = parseInt(req.get('Content-Length') || '0');
    const bodySize = JSON.stringify(req.body || {}).length;
    if (contentLength > 0 && Math.abs(contentLength - bodySize) > 1000) {
      reasons.push('Content-Length mismatch');
      riskScore += 10;
    }

    return {
      isSuspicious: riskScore > 25,
      reasons,
      riskScore: Math.min(riskScore, 100),
    };
  }

  public getSecurityStats(): {
    totalEvents: number;
    eventsByType: Record<SecurityEventType, number>;
    eventsBySeverity: Record<SecuritySeverity, number>;
    topMaliciousIPs: Array<{ ip: string; count: number; riskScore: number }>;
    recentCriticalEvents: SecurityEvent[];
  } {
    const eventsByType = {} as Record<SecurityEventType, number>;
    const eventsBySeverity = {} as Record<SecuritySeverity, number>;

    // Initialize counters
    Object.values(SecurityEventType).forEach(type => {
      eventsByType[type as SecurityEventType] = 0;
    });
    Object.values(SecuritySeverity).forEach(severity => {
      eventsBySeverity[severity as SecuritySeverity] = 0;
    });

    // Count events
    this.events.forEach(event => {
      eventsByType[event.type]++;
      eventsBySeverity[event.severity]++;
    });

    // Get top malicious IPs
    const ipStats = new Map<string, { count: number; totalRisk: number }>();
    this.events.forEach(event => {
      const existing = ipStats.get(event.source.ip) || { count: 0, totalRisk: 0 };
      ipStats.set(event.source.ip, {
        count: existing.count + 1,
        totalRisk: existing.totalRisk + event.risk_score,
      });
    });

    const topMaliciousIPs = Array.from(ipStats.entries())
      .map(([ip, stats]) => ({
        ip,
        count: stats.count,
        riskScore: Math.round(stats.totalRisk / stats.count),
      }))
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 10);

    // Get recent critical events
    const recentCriticalEvents = this.events
      .filter(event => event.severity === SecuritySeverity.CRITICAL)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 20);

    return {
      totalEvents: this.events.length,
      eventsByType,
      eventsBySeverity,
      topMaliciousIPs,
      recentCriticalEvents,
    };
  }

  private startCleanupInterval(): void {
    // Clean up old events every hour
    setInterval(() => {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      this.events = this.events.filter(event => event.timestamp > oneWeekAgo);

      // Clean up event counts
      for (const [ip, eventMap] of this.eventCounts.entries()) {
        const recentEvents = this.events.filter(e => 
          e.source.ip === ip && 
          e.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
        );

        if (recentEvents.length === 0) {
          this.eventCounts.delete(ip);
        }
      }

      logger.info('Security monitor cleanup completed', {
        eventsRetained: this.events.length,
        ipCountsRetained: this.eventCounts.size,
      });
    }, 60 * 60 * 1000); // Every hour
  }
}

// Export singleton instance
export const securityMonitor = SecurityMonitor.getInstance();

// Convenience functions
export const logSecurityEvent = (
  type: SecurityEventType,
  severity: SecuritySeverity,
  message: string,
  req: Request,
  details: Record<string, any> = {},
  blocked: boolean = false,
  actionTaken?: string
) => {
  securityMonitor.logEvent(type, severity, message, req, details, blocked, actionTaken);
};

export const analyzeRequest = (req: Request) => {
  return securityMonitor.analyzeRequest(req);
};

export const getSecurityStats = () => {
  return securityMonitor.getSecurityStats();
};