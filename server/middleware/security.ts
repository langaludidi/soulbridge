import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { body, validationResult, param, query } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Create DOMPurify instance for server-side sanitization
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window as any);

// Content Security Policy configuration
export const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'", // Required for Vite in development
      "'unsafe-eval'", // Required for development
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
      "https://js.paystack.co",
      "https://checkout.paystack.com",
      "https://replit.com",
      process.env.NODE_ENV === 'development' ? "'unsafe-inline'" : null,
    ].filter(Boolean),
    styleSrc: [
      "'self'",
      "'unsafe-inline'", // Required for CSS-in-JS
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
    ],
    imgSrc: [
      "'self'",
      "data:",
      "blob:",
      "https:",
      "*.amazonaws.com",
      "*.cloudfront.net",
      "res.cloudinary.com",
      "images.unsplash.com",
    ],
    fontSrc: [
      "'self'",
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
      "data:",
    ],
    connectSrc: [
      "'self'",
      "https://api.paystack.co",
      "https://js.paystack.co",
      "https://checkout.paystack.com",
      "wss:",
      process.env.NODE_ENV === 'development' ? "ws://localhost:*" : null,
      process.env.NODE_ENV === 'development' ? "http://localhost:*" : null,
    ].filter(Boolean),
    frameSrc: [
      "'self'",
      "https://js.paystack.co",
      "https://checkout.paystack.com",
    ],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'", "blob:", "data:", "https:"],
    manifestSrc: ["'self'"],
    workerSrc: ["'self'", "blob:"],
  },
  reportOnly: process.env.NODE_ENV === 'development',
};

// Enhanced security headers configuration
export const securityHeaders = helmet({
  contentSecurityPolicy: cspConfig,
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  permissionsPolicy: {
    features: {
      camera: [],
      microphone: [],
      location: [],
      notifications: [],
      push: [],
      sync: [],
      magnetometer: [],
      gyroscope: [],
      accelerometer: [],
      ambient_light_sensor: [],
      encrypted_media: [],
      usb: [],
      vr: [],
      wake_lock: [],
      web_share: [],
      xr_spatial_tracking: [],
    },
  },
});

// Enhanced rate limiting with different tiers
export const createRateLimiter = (options: {
  windowMs?: number;
  limit?: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
  keyGenerator?: (req: Request) => string;
}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes
    limit: options.limit || 100,
    message: {
      error: options.message || 'Too many requests, please try again later.',
      resetTime: new Date(Date.now() + (options.windowMs || 15 * 60 * 1000)),
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,
    keyGenerator: options.keyGenerator || ((req) => req.ip || 'unknown'),
    handler: (req: Request, res: Response) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`, {
        path: req.path,
        method: req.method,
        userAgent: req.get('User-Agent'),
        userId: (req as any).user?.claims?.sub,
      });
      res.status(429).json({
        error: options.message || 'Too many requests, please try again later.',
        resetTime: new Date(Date.now() + (options.windowMs || 15 * 60 * 1000)),
      });
    },
  });
};

// Slow down middleware for brute force protection
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 10, // Allow 10 requests per 15 minutes at full speed
  delayMs: 500, // Add 500ms delay after delayAfter is reached
  maxDelayMs: 20000, // Maximum delay of 20 seconds
});

// Input sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      // Remove potential XSS
      return DOMPurify.sanitize(obj, { ALLOWED_TAGS: [] });
    } else if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    } else if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          sanitized[key] = sanitizeObject(obj[key]);
        }
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};

// Validation error handler
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation errors', {
      errors: errors.array(),
      path: req.path,
      method: req.method,
      ip: req.ip,
      userId: (req as any).user?.claims?.sub,
    });
    
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.type === 'field' ? error.path : undefined,
        message: error.msg,
        value: error.type === 'field' ? error.value : undefined,
      })),
    });
  }
  next();
};

// Common validation schemas
export const validators = {
  // User input validators
  name: body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),

  firstName: body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes'),

  lastName: body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes'),

  email: body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),

  phone: body('phone')
    .optional()
    .trim()
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Phone number must be in valid international format'),

  message: body('message')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Message must be between 10 and 5000 characters'),

  memorialMessage: body('memorialMessage')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Memorial message cannot exceed 2000 characters'),

  // Date validators
  date: (field: string) => body(field)
    .isISO8601()
    .withMessage(`${field} must be a valid date`)
    .toDate(),

  // ID validators
  uuid: (field: string) => param(field)
    .isUUID()
    .withMessage(`${field} must be a valid UUID`),

  mongoId: (field: string) => param(field)
    .isMongoId()
    .withMessage(`${field} must be a valid ID`),

  // Query parameter validators
  limit: query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),

  offset: query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer')
    .toInt(),

  search: query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),

  // File upload validators
  imageFile: body('file')
    .custom((value, { req }) => {
      if (!req.file) return true; // Optional file
      
      const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedMimes.includes(req.file.mimetype)) {
        throw new Error('File must be a valid image (JPEG, PNG, WebP)');
      }
      
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (req.file.size > maxSize) {
        throw new Error('File size cannot exceed 5MB');
      }
      
      return true;
    }),
};

// Security audit logging middleware
export const securityAuditLog = (req: Request, res: Response, next: NextFunction) => {
  const sensitiveEndpoints = ['/api/auth/', '/api/login', '/api/logout', '/api/billing/'];
  const isSensitive = sensitiveEndpoints.some(endpoint => req.path.startsWith(endpoint));
  
  if (isSensitive) {
    logger.info('Security-sensitive endpoint accessed', {
      path: req.path,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      referer: req.get('Referer'),
      userId: (req as any).user?.claims?.sub,
      timestamp: new Date().toISOString(),
    });
  }
  
  next();
};

// Request size limitation
export const requestSizeLimiter = (maxSize: string = '1mb') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = req.get('Content-Length');
    if (contentLength) {
      const sizeInBytes = parseInt(contentLength);
      const maxSizeInBytes = maxSize.endsWith('mb') 
        ? parseInt(maxSize.slice(0, -2)) * 1024 * 1024
        : parseInt(maxSize);
      
      if (sizeInBytes > maxSizeInBytes) {
        logger.warn(`Request size exceeded limit: ${sizeInBytes} bytes`, {
          path: req.path,
          method: req.method,
          ip: req.ip,
          userId: (req as any).user?.claims?.sub,
        });
        
        return res.status(413).json({
          error: 'Request entity too large',
          maxSize: maxSize,
        });
      }
    }
    next();
  };
};

// Suspicious activity detection
export const suspiciousActivityDetection = (req: Request, res: Response, next: NextFunction) => {
  const suspiciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /eval\s*\(/gi,
    /(union|select|insert|delete|update|drop|create|alter|exec|execute)\s+/gi,
    /'(\s*(or|and)\s*)+'/gi,
  ];
  
  const checkForSuspiciousContent = (obj: any, path = ''): boolean => {
    if (typeof obj === 'string') {
      return suspiciousPatterns.some(pattern => pattern.test(obj));
    } else if (Array.isArray(obj)) {
      return obj.some((item, index) => checkForSuspiciousContent(item, `${path}[${index}]`));
    } else if (obj && typeof obj === 'object') {
      return Object.keys(obj).some(key => 
        checkForSuspiciousContent(obj[key], path ? `${path}.${key}` : key)
      );
    }
    return false;
  };
  
  const suspicious = [req.body, req.query, req.params].some(data => 
    data && checkForSuspiciousContent(data)
  );
  
  if (suspicious) {
    logger.warn('Suspicious activity detected', {
      path: req.path,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      body: req.body,
      query: req.query,
      params: req.params,
      userId: (req as any).user?.claims?.sub,
    });
    
    return res.status(400).json({
      error: 'Request contains potentially malicious content',
    });
  }
  
  next();
};