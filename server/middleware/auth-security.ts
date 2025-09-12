import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';

interface LoginAttempt {
  timestamp: number;
  success: boolean;
  ip: string;
  userAgent: string;
}

interface UserLoginHistory {
  attempts: LoginAttempt[];
  lockUntil?: number;
  consecutiveFailures: number;
}

// In-memory store for login attempts (in production, use Redis or database)
const loginAttempts = new Map<string, UserLoginHistory>();
const ipAttempts = new Map<string, UserLoginHistory>();

// Configuration
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_IP_ATTEMPTS = 20;

// Session security configuration
export const sessionSecurityConfig = {
  name: 'soulbridge.sid', // Don't use default session name
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  rolling: true, // Reset expiry on activity
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
};

// Enhanced login attempt tracking
export const trackLoginAttempt = (
  identifier: string,
  success: boolean,
  req: Request
) => {
  const now = Date.now();
  const attempt: LoginAttempt = {
    timestamp: now,
    success,
    ip: req.ip || 'unknown',
    userAgent: req.get('User-Agent') || 'unknown',
  };

  // Track by user identifier
  if (!loginAttempts.has(identifier)) {
    loginAttempts.set(identifier, {
      attempts: [],
      consecutiveFailures: 0,
    });
  }

  const userHistory = loginAttempts.get(identifier)!;
  
  // Remove old attempts outside the window
  userHistory.attempts = userHistory.attempts.filter(
    a => now - a.timestamp < ATTEMPT_WINDOW
  );
  
  userHistory.attempts.push(attempt);

  if (success) {
    userHistory.consecutiveFailures = 0;
    userHistory.lockUntil = undefined;
  } else {
    userHistory.consecutiveFailures++;
    
    if (userHistory.consecutiveFailures >= MAX_LOGIN_ATTEMPTS) {
      userHistory.lockUntil = now + LOCKOUT_DURATION;
      logger.warn(`User account locked due to excessive failed login attempts`, {
        identifier,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        lockUntil: new Date(userHistory.lockUntil),
      });
    }
  }

  // Track by IP address
  const ip = req.ip || 'unknown';
  if (!ipAttempts.has(ip)) {
    ipAttempts.set(ip, {
      attempts: [],
      consecutiveFailures: 0,
    });
  }

  const ipHistory = ipAttempts.get(ip)!;
  ipHistory.attempts = ipHistory.attempts.filter(
    a => now - a.timestamp < ATTEMPT_WINDOW
  );
  ipHistory.attempts.push(attempt);

  if (!success) {
    ipHistory.consecutiveFailures++;
    
    if (ipHistory.consecutiveFailures >= MAX_IP_ATTEMPTS) {
      ipHistory.lockUntil = now + LOCKOUT_DURATION;
      logger.warn(`IP address blocked due to excessive failed login attempts`, {
        ip,
        userAgent: req.get('User-Agent'),
        lockUntil: new Date(ipHistory.lockUntil),
      });
    }
  } else if (success) {
    // Reset IP failures on any successful login from this IP
    ipHistory.consecutiveFailures = Math.max(0, ipHistory.consecutiveFailures - 1);
  }
};

// Check if user or IP is locked out
export const checkLockout = (identifier: string, req: Request): boolean => {
  const now = Date.now();
  const ip = req.ip || 'unknown';

  // Check user lockout
  const userHistory = loginAttempts.get(identifier);
  if (userHistory?.lockUntil && now < userHistory.lockUntil) {
    return true;
  }

  // Check IP lockout
  const ipHistory = ipAttempts.get(ip);
  if (ipHistory?.lockUntil && now < ipHistory.lockUntil) {
    return true;
  }

  return false;
};

// Middleware to check login attempts before authentication
export const loginAttemptMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const identifier = req.body.email || req.body.username || req.ip;
  
  if (checkLockout(identifier, req)) {
    const userHistory = loginAttempts.get(identifier);
    const ipHistory = ipAttempts.get(req.ip || 'unknown');
    
    const lockUntil = Math.max(
      userHistory?.lockUntil || 0,
      ipHistory?.lockUntil || 0
    );
    
    logger.warn('Login attempt blocked due to lockout', {
      identifier,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      lockUntil: new Date(lockUntil),
    });
    
    return res.status(423).json({
      error: 'Account temporarily locked due to too many failed attempts',
      lockUntil: new Date(lockUntil),
      retryAfter: Math.ceil((lockUntil - Date.now()) / 1000),
    });
  }
  
  next();
};

// Session hijacking protection
export const sessionSecurityMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.user) {
    const currentFingerprint = generateFingerprint(req);
    
    if (!req.session.fingerprint) {
      req.session.fingerprint = currentFingerprint;
    } else if (req.session.fingerprint !== currentFingerprint) {
      logger.warn('Session fingerprint mismatch - possible hijacking attempt', {
        userId: (req.user as any).claims?.sub,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        storedFingerprint: req.session.fingerprint,
        currentFingerprint,
      });
      
      // Destroy session and force re-login
      req.session.destroy((err) => {
        if (err) {
          logger.error('Failed to destroy compromised session', { error: err });
        }
      });
      
      return res.status(401).json({
        error: 'Session security violation detected. Please log in again.',
        reason: 'fingerprint_mismatch',
      });
    }
  }
  
  next();
};

// Generate browser fingerprint for session security
const generateFingerprint = (req: Request): string => {
  const components = [
    req.ip,
    req.get('User-Agent'),
    req.get('Accept-Language'),
    req.get('Accept-Encoding'),
  ].filter(Boolean);
  
  return crypto
    .createHash('sha256')
    .update(components.join('|'))
    .digest('hex');
};

// Enhanced token validation middleware
export const tokenSecurityMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as any;
  
  if (user && user.access_token) {
    // Check token expiration with buffer
    const now = Math.floor(Date.now() / 1000);
    const tokenExpiry = user.expires_at;
    const bufferTime = 60; // 1 minute buffer
    
    if (tokenExpiry && now >= (tokenExpiry - bufferTime)) {
      logger.info('Access token near expiry, attempting refresh', {
        userId: user.claims?.sub,
        expiresAt: new Date(tokenExpiry * 1000),
        ip: req.ip,
      });
    }
    
    // Log suspicious token usage patterns
    if (req.session) {
      const lastActivity = req.session.lastActivity || now;
      const timeSinceLastActivity = now - lastActivity;
      
      // Flag if there's been no activity for a long time and suddenly active
      if (timeSinceLastActivity > 24 * 60 * 60) { // 24 hours
        logger.warn('Suspicious token activity - long dormancy followed by activity', {
          userId: user.claims?.sub,
          lastActivity: new Date(lastActivity * 1000),
          currentActivity: new Date(now * 1000),
          ip: req.ip,
          userAgent: req.get('User-Agent'),
        });
      }
      
      req.session.lastActivity = now;
    }
  }
  
  next();
};

// Privilege escalation protection
export const privilegeEscalationProtection = (requiredRole?: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;
    
    if (!user || !user.claims) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Log access attempts to sensitive resources
    if (requiredRole) {
      logger.info('Role-protected resource accessed', {
        userId: user.claims.sub,
        requiredRole,
        userRole: user.claims.role || 'user',
        path: req.path,
        method: req.method,
        ip: req.ip,
      });
    }
    
    // Check role if specified
    if (requiredRole && user.claims.role !== requiredRole) {
      logger.warn('Privilege escalation attempt detected', {
        userId: user.claims.sub,
        requiredRole,
        userRole: user.claims.role || 'user',
        path: req.path,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
      
      return res.status(403).json({ 
        error: 'Insufficient privileges',
        required: requiredRole,
        current: user.claims.role || 'user',
      });
    }
    
    next();
  };
};

// Concurrent session detection
const activeSessions = new Map<string, Set<string>>();

export const concurrentSessionProtection = (maxSessions: number = 3) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;
    
    if (user && user.claims && req.sessionID) {
      const userId = user.claims.sub;
      
      if (!activeSessions.has(userId)) {
        activeSessions.set(userId, new Set());
      }
      
      const userSessions = activeSessions.get(userId)!;
      userSessions.add(req.sessionID);
      
      if (userSessions.size > maxSessions) {
        logger.warn('Concurrent session limit exceeded', {
          userId,
          sessionCount: userSessions.size,
          maxSessions,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
        });
        
        // Could either reject or remove oldest session
        // For now, we'll just log and allow (but could implement oldest session removal)
      }
    }
    
    next();
  };
};

// Clean up old login attempt records periodically
setInterval(() => {
  const now = Date.now();
  
  // Clean user attempts
  for (const [key, history] of loginAttempts.entries()) {
    history.attempts = history.attempts.filter(
      a => now - a.timestamp < ATTEMPT_WINDOW
    );
    
    if (history.attempts.length === 0 && (!history.lockUntil || now > history.lockUntil)) {
      loginAttempts.delete(key);
    }
  }
  
  // Clean IP attempts
  for (const [key, history] of ipAttempts.entries()) {
    history.attempts = history.attempts.filter(
      a => now - a.timestamp < ATTEMPT_WINDOW
    );
    
    if (history.attempts.length === 0 && (!history.lockUntil || now > history.lockUntil)) {
      ipAttempts.delete(key);
    }
  }
}, 10 * 60 * 1000); // Clean every 10 minutes