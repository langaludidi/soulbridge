import { body, param, query, validationResult } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Enhanced validation error handler
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map(error => ({
      field: error.type === 'field' ? error.path : undefined,
      message: error.msg,
      value: error.type === 'field' ? (typeof error.value === 'string' ? error.value.substring(0, 100) : error.value) : undefined,
      location: error.type === 'field' ? error.location : undefined,
    }));

    logger.warn('API validation failed', {
      path: req.path,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: (req as any).user?.claims?.sub,
      errors: errorDetails,
      body: typeof req.body === 'object' ? JSON.stringify(req.body).substring(0, 500) : req.body,
    });
    
    return res.status(400).json({
      message: 'Validation failed',
      errors: errorDetails,
    });
  }
  next();
};

// Memorial creation validation
export const validateMemorialCreation = [
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s'-\u00C0-\u017F]+$/)
    .withMessage('First name can only contain letters, spaces, hyphens, apostrophes, and accented characters'),

  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s'-\u00C0-\u017F]+$/)
    .withMessage('Last name can only contain letters, spaces, hyphens, apostrophes, and accented characters'),

  body('dateOfBirth')
    .isISO8601()
    .withMessage('Date of birth must be a valid date')
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();
      const minDate = new Date('1900-01-01');
      
      if (date >= now) {
        throw new Error('Date of birth cannot be in the future');
      }
      if (date < minDate) {
        throw new Error('Date of birth cannot be before 1900');
      }
      
      return true;
    }),

  body('dateOfPassing')
    .isISO8601()
    .withMessage('Date of passing must be a valid date')
    .custom((value, { req }) => {
      const passingDate = new Date(value);
      const birthDate = new Date(req.body.dateOfBirth);
      const now = new Date();
      
      if (passingDate > now) {
        throw new Error('Date of passing cannot be in the future');
      }
      if (passingDate <= birthDate) {
        throw new Error('Date of passing must be after date of birth');
      }
      
      return true;
    }),

  body('memorialMessage')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Memorial message cannot exceed 2000 characters'),

  body('obituary')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Obituary cannot exceed 5000 characters'),

  body('quote')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Quote cannot exceed 500 characters'),

  body('profilePhotoUrl')
    .optional()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Profile photo URL must be a valid HTTP/HTTPS URL')
    .isLength({ max: 2000 })
    .withMessage('Profile photo URL too long'),

  handleValidationErrors,
];

// Contact form validation
export const validateContactForm = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s'-\u00C0-\u017F]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, apostrophes, and accented characters'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail()
    .isLength({ max: 254 })
    .withMessage('Email address too long'),

  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters')
    .matches(/^[a-zA-Z0-9\s.,!?'-]+$/)
    .withMessage('Subject contains invalid characters'),

  body('message')
    .trim()
    .isLength({ min: 20, max: 5000 })
    .withMessage('Message must be between 20 and 5000 characters'),

  body('phone')
    .optional()
    .trim()
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Phone number must be in valid international format'),

  handleValidationErrors,
];

// Tribute creation validation
export const validateTributeCreation = [
  body('memorialId')
    .isUUID()
    .withMessage('Memorial ID must be a valid UUID'),

  body('authorName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Author name must be between 1 and 100 characters')
    .matches(/^[a-zA-Z\s'-\u00C0-\u017F]+$/)
    .withMessage('Author name can only contain letters, spaces, hyphens, apostrophes, and accented characters'),

  body('content')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Tribute content must be between 10 and 2000 characters'),

  body('relationship')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Relationship cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Relationship can only contain letters, spaces, hyphens, and apostrophes'),

  handleValidationErrors,
];

// Partner registration validation
export const validatePartnerRegistration = [
  body('businessName')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Business name must be between 2 and 200 characters'),

  body('contactPerson')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Contact person name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s'-\u00C0-\u017F]+$/)
    .withMessage('Contact person name can only contain letters, spaces, hyphens, apostrophes, and accented characters'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail()
    .isLength({ max: 254 })
    .withMessage('Email address too long'),

  body('phone')
    .trim()
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Phone number must be in valid international format'),

  body('website')
    .optional()
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Website must be a valid HTTP/HTTPS URL')
    .isLength({ max: 500 })
    .withMessage('Website URL too long'),

  body('businessType')
    .trim()
    .isIn(['funeral_home', 'florist', 'catering', 'venue', 'photographer', 'musician', 'other'])
    .withMessage('Invalid business type'),

  body('address')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Address must be between 10 and 500 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),

  handleValidationErrors,
];

// Order of service validation
export const validateOrderOfService = [
  body('memorialId')
    .isUUID()
    .withMessage('Memorial ID must be a valid UUID'),

  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),

  body('date')
    .isISO8601()
    .withMessage('Date must be a valid date')
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();
      const maxFutureDate = new Date();
      maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 1);
      
      if (date < now) {
        throw new Error('Date cannot be in the past');
      }
      if (date > maxFutureDate) {
        throw new Error('Date cannot be more than 1 year in the future');
      }
      
      return true;
    }),

  body('location')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Location must be between 5 and 200 characters'),

  body('events')
    .isArray({ min: 1, max: 20 })
    .withMessage('Must have between 1 and 20 events'),

  body('events.*.title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Event title must be between 3 and 100 characters'),

  body('events.*.time')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Event time must be in HH:MM format'),

  body('events.*.description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Event description cannot exceed 500 characters'),

  handleValidationErrors,
];

// Billing/payment validation
export const validatePaymentRequest = [
  body('planId')
    .trim()
    .isIn(['remember', 'honour', 'celebrate'])
    .withMessage('Invalid plan ID'),

  body('provider')
    .trim()
    .isIn(['paystack', 'netcash'])
    .withMessage('Invalid payment provider'),

  body('amount')
    .isFloat({ min: 1, max: 100000 })
    .withMessage('Amount must be between R1 and R100,000'),

  body('currency')
    .trim()
    .isIn(['ZAR', 'USD'])
    .withMessage('Invalid currency'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),

  handleValidationErrors,
];

// Query parameter validation
export const validatePaginationParams = [
  query('page')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Page must be between 1 and 1000')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),

  query('sort')
    .optional()
    .trim()
    .isIn(['created_at', 'updated_at', 'firstName', 'lastName', 'dateOfPassing'])
    .withMessage('Invalid sort field'),

  query('order')
    .optional()
    .trim()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be asc or desc'),

  handleValidationErrors,
];

// Search validation
export const validateSearchParams = [
  query('q')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Search query must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s'-\u00C0-\u017F]+$/)
    .withMessage('Search query contains invalid characters'),

  query('type')
    .optional()
    .trim()
    .isIn(['memorial', 'tribute', 'partner'])
    .withMessage('Invalid search type'),

  handleValidationErrors,
];

// UUID parameter validation
export const validateUUIDParam = (paramName: string = 'id') => [
  param(paramName)
    .isUUID()
    .withMessage(`${paramName} must be a valid UUID`),
  handleValidationErrors,
];

// File upload validation
export const validateFileUpload = [
  body('category')
    .optional()
    .trim()
    .isIn(['profile', 'gallery', 'document'])
    .withMessage('Invalid file category'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('File description cannot exceed 200 characters'),

  handleValidationErrors,
];

// Subscription management validation
export const validateSubscriptionUpdate = [
  body('planId')
    .trim()
    .isIn(['remember', 'honour', 'celebrate'])
    .withMessage('Invalid plan ID'),

  body('action')
    .trim()
    .isIn(['upgrade', 'downgrade', 'cancel', 'reactivate'])
    .withMessage('Invalid subscription action'),

  handleValidationErrors,
];

// Security configuration validation
export const validateSecurityConfig = [
  body('twoFactorEnabled')
    .optional()
    .isBoolean()
    .withMessage('Two factor enabled must be a boolean'),

  body('loginNotifications')
    .optional()
    .isBoolean()
    .withMessage('Login notifications must be a boolean'),

  body('sessionTimeout')
    .optional()
    .isInt({ min: 5, max: 1440 })
    .withMessage('Session timeout must be between 5 and 1440 minutes'),

  handleValidationErrors,
];