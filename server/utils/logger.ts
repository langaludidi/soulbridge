export interface LogLevel {
  ERROR: 'error';
  WARN: 'warn'; 
  INFO: 'info';
  DEBUG: 'debug';
}

export const LOG_LEVELS: LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info', 
  DEBUG: 'debug',
};

class Logger {
  private isProduction: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  private log(level: keyof LogLevel, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...(meta && { meta }),
    };

    // In production, only log errors and warnings to avoid noise
    if (this.isProduction && (level === 'DEBUG' || level === 'INFO')) {
      return;
    }

    console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`, meta ? JSON.stringify(meta) : '');
  }

  error(message: string, meta?: any) {
    this.log('ERROR', message, meta);
  }

  warn(message: string, meta?: any) {
    this.log('WARN', message, meta);
  }

  info(message: string, meta?: any) {
    this.log('INFO', message, meta);
  }

  debug(message: string, meta?: any) {
    this.log('DEBUG', message, meta);
  }

  // Special method for API request logging
  request(method: string, path: string, status: number, duration: number, meta?: any) {
    const message = `${method} ${path} ${status} in ${duration}ms`;
    
    if (status >= 500) {
      this.error(message, meta);
    } else if (status >= 400) {
      this.warn(message, meta);
    } else {
      this.debug(message, meta);
    }
  }
}

export const logger = new Logger();