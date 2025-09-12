import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { logger } from "./utils/logger";

// Enhanced security imports
import { 
  securityHeaders, 
  createRateLimiter, 
  speedLimiter, 
  sanitizeInput, 
  requestSizeLimiter,
  suspiciousActivityDetection,
  securityAuditLog,
} from "./middleware/security";
import {
  sessionSecurityMiddleware,
  tokenSecurityMiddleware,
  concurrentSessionProtection,
} from "./middleware/auth-security";

const app = express();

// Trust proxy for correct IP addresses behind reverse proxy
app.set('trust proxy', 1);

// Enhanced security headers (includes CSP, HSTS, etc.)
app.use(securityHeaders);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://soulbridge.co.za', 'https://www.soulbridge.co.za']
    : ['http://localhost:5000', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'X-CSRF-Token',
    'X-Requested-With',
    'Accept',
    'Accept-Version',
    'Content-Length',
    'Content-MD5',
    'Date',
  ],
  optionsSuccessStatus: 200, // For legacy browser support
}));

// Enhanced rate limiting with different tiers
const generalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  message: 'Too many requests from this IP, please try again later.',
});

const strictLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: 'Too many requests for this action, please try again later.',
});

const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: 'Too many authentication attempts, please try again later.',
  keyGenerator: (req) => `auth_${req.ip}_${req.body?.email || 'unknown'}`,
});

// Apply rate limiting
app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);
app.use('/api/contact', strictLimiter);
app.use('/api/billing/', strictLimiter);

// Slow down middleware for additional DDoS protection
app.use('/api/', speedLimiter);

// Request size limitation
app.use(requestSizeLimiter('10mb'));

// Security audit logging for sensitive endpoints
app.use(securityAuditLog);

// Suspicious activity detection
app.use(suspiciousActivityDetection);

// Body parsing with enhanced security
app.use(express.json({ 
  limit: '10mb',
  strict: true,
  type: ['application/json'],
}));

app.use(express.urlencoded({ 
  extended: false, 
  limit: '10mb',
  parameterLimit: 100,
}));

// Input sanitization
app.use(sanitizeInput);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      const meta = capturedJsonResponse ? { response: capturedJsonResponse } : undefined;
      logger.request(req.method, path, res.statusCode, duration, meta);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    
    // Log error details server-side only
    logger.error(`Error ${status} on ${req.method} ${req.path}`, {
      message: err.message,
      stack: err.stack,
      user: (req as any).user?.claims?.sub,
    });

    // Send sanitized error to client
    const message = status < 500 
      ? err.message || "Bad Request"
      : "Internal Server Error";
    
    res.status(status).json({ message });
    // Don't re-throw after sending response
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
