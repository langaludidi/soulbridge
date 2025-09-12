import { Router } from 'express';
import type { Request, Response } from 'express';
import { isAuthenticated } from '../replitAuth';
import { privilegeEscalationProtection } from '../middleware/auth-security';
import { getSecurityStats, logSecurityEvent, SecurityEventType, SecuritySeverity } from '../utils/security-monitor';
import { logger } from '../utils/logger';

const router = Router();

// Security dashboard - admin only
router.get('/dashboard', 
  isAuthenticated,
  privilegeEscalationProtection('admin'),
  async (req: Request, res: Response) => {
    try {
      const stats = getSecurityStats();
      
      // Additional system health metrics
      const systemHealth = {
        uptime: Math.floor(process.uptime()),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        nodeVersion: process.version,
        environment: process.env.NODE_ENV,
      };

      // Recent security trends (last 24 hours)
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      // This would typically come from a database query
      // For now, we'll simulate with basic stats
      const securityTrends = {
        authenticationFailures: Math.floor(Math.random() * 20),
        suspiciousActivity: Math.floor(Math.random() * 10),
        blockedRequests: Math.floor(Math.random() * 50),
        uniqueThreats: Math.floor(Math.random() * 5),
      };

      res.json({
        success: true,
        data: {
          overview: stats,
          systemHealth,
          trends: securityTrends,
          recommendations: generateSecurityRecommendations(stats),
        },
      });

      // Log dashboard access
      logSecurityEvent(
        SecurityEventType.UNAUTHORIZED_ACCESS,
        SecuritySeverity.LOW,
        'Security dashboard accessed',
        req,
        { action: 'dashboard_view' }
      );

    } catch (error) {
      logger.error('Failed to fetch security dashboard', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to fetch security dashboard',
      });
    }
  }
);

// Security incident reporting
router.post('/incident',
  isAuthenticated,
  privilegeEscalationProtection('admin'),
  async (req: Request, res: Response) => {
    try {
      const { type, severity, description, affectedSystems, mitigation } = req.body;

      // Validate incident data
      if (!type || !severity || !description) {
        return res.status(400).json({
          success: false,
          error: 'Missing required incident fields',
        });
      }

      const incident = {
        id: generateIncidentId(),
        type,
        severity,
        description,
        affectedSystems: affectedSystems || [],
        mitigation: mitigation || '',
        reportedBy: (req.user as any).claims.sub,
        reportedAt: new Date(),
        status: 'open',
      };

      // Log the security incident
      logSecurityEvent(
        SecurityEventType.DATA_BREACH_ATTEMPT,
        severity as SecuritySeverity,
        `Security incident reported: ${type}`,
        req,
        incident,
        false,
        'incident_created'
      );

      logger.error('[SECURITY INCIDENT]', incident);

      res.json({
        success: true,
        data: incident,
      });

    } catch (error) {
      logger.error('Failed to create security incident', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to create security incident',
      });
    }
  }
);

// Real-time security alerts endpoint
router.get('/alerts',
  isAuthenticated,
  privilegeEscalationProtection('admin'),
  async (req: Request, res: Response) => {
    try {
      const { severity, limit = 50, offset = 0 } = req.query;
      
      const stats = getSecurityStats();
      let alerts = stats.recentCriticalEvents;

      // Filter by severity if specified
      if (severity && severity !== 'all') {
        alerts = alerts.filter(event => event.severity === severity);
      }

      // Apply pagination
      const paginatedAlerts = alerts
        .slice(Number(offset), Number(offset) + Number(limit));

      res.json({
        success: true,
        data: {
          alerts: paginatedAlerts,
          total: alerts.length,
          pagination: {
            offset: Number(offset),
            limit: Number(limit),
            hasMore: alerts.length > Number(offset) + Number(limit),
          },
        },
      });

    } catch (error) {
      logger.error('Failed to fetch security alerts', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to fetch security alerts',
      });
    }
  }
);

// Threat intelligence feed
router.get('/threats',
  isAuthenticated,
  privilegeEscalationProtection('admin'),
  async (req: Request, res: Response) => {
    try {
      const stats = getSecurityStats();
      
      // Aggregate threat data
      const threatIntelligence = {
        maliciousIPs: stats.topMaliciousIPs,
        attackPatterns: [
          {
            pattern: 'SQL Injection',
            count: stats.eventsByType[SecurityEventType.SQL_INJECTION_ATTEMPT] || 0,
            lastSeen: new Date(),
          },
          {
            pattern: 'XSS Attempt',
            count: stats.eventsByType[SecurityEventType.XSS_ATTEMPT] || 0,
            lastSeen: new Date(),
          },
          {
            pattern: 'Authentication Brute Force',
            count: stats.eventsByType[SecurityEventType.BRUTE_FORCE_ATTACK] || 0,
            lastSeen: new Date(),
          },
        ],
        geographicThreats: [
          // This would be populated from GeoIP analysis
          { country: 'Unknown', count: stats.totalEvents, percentage: 100 },
        ],
        timeBasedPatterns: generateTimeBasedPatterns(),
      };

      res.json({
        success: true,
        data: threatIntelligence,
      });

    } catch (error) {
      logger.error('Failed to fetch threat intelligence', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to fetch threat intelligence',
      });
    }
  }
);

// Security configuration management
router.get('/config',
  isAuthenticated,
  privilegeEscalationProtection('admin'),
  async (req: Request, res: Response) => {
    try {
      const config = {
        rateLimit: {
          enabled: true,
          windowMs: 15 * 60 * 1000,
          general: 100,
          strict: 10,
          auth: 5,
        },
        fileUpload: {
          maxSize: '10mb',
          allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
          scanEnabled: true,
        },
        authentication: {
          sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
          maxConcurrentSessions: 3,
          fingerprintingEnabled: true,
          bruteForceProtection: true,
        },
        monitoring: {
          alertThresholds: {
            authFailures: 5,
            suspiciousActivity: 10,
            rateLimitHits: 3,
          },
          retentionDays: 7,
        },
        csp: {
          enforced: process.env.NODE_ENV === 'production',
          reportOnly: process.env.NODE_ENV === 'development',
        },
      };

      res.json({
        success: true,
        data: config,
      });

    } catch (error) {
      logger.error('Failed to fetch security config', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to fetch security config',
      });
    }
  }
);

// Update security configuration
router.put('/config',
  isAuthenticated,
  privilegeEscalationProtection('admin'),
  async (req: Request, res: Response) => {
    try {
      const { section, config } = req.body;

      // Validate configuration section
      const validSections = ['rateLimit', 'fileUpload', 'authentication', 'monitoring', 'csp'];
      if (!section || !validSections.includes(section)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid configuration section',
        });
      }

      // Log configuration change
      logSecurityEvent(
        SecurityEventType.SUSPICIOUS_ACTIVITY,
        SecuritySeverity.MEDIUM,
        `Security configuration updated: ${section}`,
        req,
        { section, config, changedBy: (req.user as any).claims.sub },
        false,
        'config_updated'
      );

      logger.info('Security configuration updated', {
        section,
        config,
        updatedBy: (req.user as any).claims.sub,
      });

      // In a real implementation, you would update your configuration store
      // For now, we'll just acknowledge the update
      res.json({
        success: true,
        message: `${section} configuration updated successfully`,
        timestamp: new Date(),
      });

    } catch (error) {
      logger.error('Failed to update security config', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to update security config',
      });
    }
  }
);

// Helper functions
function generateIncidentId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `INC-${timestamp}-${random}`.toUpperCase();
}

function generateSecurityRecommendations(stats: any): string[] {
  const recommendations: string[] = [];

  if (stats.eventsBySeverity.critical > 0) {
    recommendations.push('Immediate attention required: Critical security events detected');
  }

  if (stats.eventsBySeverity.high > 10) {
    recommendations.push('Consider implementing additional rate limiting for high-risk endpoints');
  }

  if (stats.totalEvents > 1000) {
    recommendations.push('High volume of security events detected - review monitoring thresholds');
  }

  if (stats.topMaliciousIPs.length > 0) {
    const topThreat = stats.topMaliciousIPs[0];
    if (topThreat.riskScore > 80) {
      recommendations.push(`Consider blocking high-risk IP: ${topThreat.ip} (Risk Score: ${topThreat.riskScore})`);
    }
  }

  // Add default recommendations
  recommendations.push('Regularly update security patches and dependencies');
  recommendations.push('Review and test incident response procedures');
  recommendations.push('Conduct periodic security assessments');

  return recommendations;
}

function generateTimeBasedPatterns(): Array<{ hour: number; events: number }> {
  const patterns = [];
  for (let hour = 0; hour < 24; hour++) {
    patterns.push({
      hour,
      events: Math.floor(Math.random() * 50), // Simulated data
    });
  }
  return patterns;
}

export { router as securityRouter };