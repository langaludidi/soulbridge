import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import fs from 'fs/promises';

// File type configurations
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
];

const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/aac',
  'audio/m4a',
];

const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/avi',
];

const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'text/plain',
];

// File size limits (in bytes)
const SIZE_LIMITS = {
  image: 5 * 1024 * 1024, // 5MB
  audio: 50 * 1024 * 1024, // 50MB
  video: 100 * 1024 * 1024, // 100MB
  document: 10 * 1024 * 1024, // 10MB
};

// Malicious file signatures to detect
const MALICIOUS_SIGNATURES = new Map([
  // Executable files
  ['4D5A', 'exe'], // PE/COFF executable
  ['7F454C46', 'elf'], // ELF executable
  ['CAFEBABE', 'java'], // Java class
  ['FEEDFACE', 'macho'], // Mach-O executable
  ['504B0304', 'zip'], // ZIP (could contain executable)
  
  // Script files that shouldn't be in uploads
  ['3C3F706870', 'php'], // <?php
  ['3C25', 'jsp'], // <%
  ['3C736372697074', 'js'], // <script
  
  // Office macros
  ['D0CF11E0', 'ole'], // OLE2 (old Office with potential macros)
]);

// Generate secure filename
const generateSecureFilename = (originalname: string, userId?: string): string => {
  const ext = path.extname(originalname).toLowerCase();
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString('hex');
  const userPrefix = userId ? crypto.createHash('md5').update(userId).digest('hex').substring(0, 8) : '';
  
  return `${userPrefix}${timestamp}_${random}${ext}`;
};

// Virus/malware signature detection
const scanFileSignature = async (filePath: string): Promise<boolean> => {
  try {
    const buffer = await fs.readFile(filePath, { 
      encoding: null,
      flag: 'r',
    });
    
    // Check first 512 bytes for malicious signatures
    const headerHex = buffer.subarray(0, 512).toString('hex').toUpperCase();
    
    for (const [signature, type] of MALICIOUS_SIGNATURES.entries()) {
      if (headerHex.startsWith(signature)) {
        logger.warn(`Malicious file signature detected: ${type}`, {
          filePath,
          signature,
          headerHex: headerHex.substring(0, 32),
        });
        return false;
      }
    }
    
    // Additional checks for embedded scripts
    const content = buffer.toString('utf8', 0, Math.min(buffer.length, 1024));
    const scriptPatterns = [
      /<script\b/i,
      /javascript:/i,
      /vbscript:/i,
      /onload\s*=/i,
      /onerror\s*=/i,
      /eval\s*\(/i,
      /document\.write/i,
    ];
    
    for (const pattern of scriptPatterns) {
      if (pattern.test(content)) {
        logger.warn('Script content detected in uploaded file', {
          filePath,
          pattern: pattern.toString(),
        });
        return false;
      }
    }
    
    return true;
  } catch (error) {
    logger.error('Error scanning file signature', { filePath, error });
    return false;
  }
};

// Image processing and security
const processImage = async (filePath: string, outputPath: string): Promise<void> => {
  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Security checks
    if (!metadata.width || !metadata.height) {
      throw new Error('Invalid image dimensions');
    }
    
    if (metadata.width > 4096 || metadata.height > 4096) {
      throw new Error('Image dimensions too large');
    }
    
    // Strip all metadata (including EXIF data that might contain location/personal info)
    await image
      .resize(Math.min(metadata.width, 2048), Math.min(metadata.height, 2048), {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85, progressive: true })
      .toFile(outputPath);
    
    // Remove original
    await fs.unlink(filePath);
    
    logger.info('Image processed successfully', {
      originalPath: filePath,
      outputPath,
      originalSize: metadata.size,
      dimensions: `${metadata.width}x${metadata.height}`,
    });
  } catch (error) {
    logger.error('Image processing failed', { filePath, error });
    throw error;
  }
};

// Multer configuration factory
export const createSecureUpload = (options: {
  fileType: 'image' | 'audio' | 'video' | 'document';
  maxFiles?: number;
  destination?: string;
}) => {
  const { fileType, maxFiles = 1, destination = '/tmp/uploads' } = options;
  
  const allowedTypes = (() => {
    switch (fileType) {
      case 'image': return ALLOWED_IMAGE_TYPES;
      case 'audio': return ALLOWED_AUDIO_TYPES;
      case 'video': return ALLOWED_VIDEO_TYPES;
      case 'document': return ALLOWED_DOCUMENT_TYPES;
      default: return [];
    }
  })();
  
  const sizeLimit = SIZE_LIMITS[fileType];
  
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      try {
        await fs.mkdir(destination, { recursive: true });
        cb(null, destination);
      } catch (error) {
        cb(error, destination);
      }
    },
    filename: (req, file, cb) => {
      const userId = (req.user as any)?.claims?.sub;
      const secureFilename = generateSecureFilename(file.originalname, userId);
      cb(null, secureFilename);
    },
  });
  
  const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Check MIME type
    if (!allowedTypes.includes(file.mimetype)) {
      logger.warn('File type not allowed', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        allowedTypes,
        userId: (req.user as any)?.claims?.sub,
        ip: req.ip,
      });
      return cb(new Error(`File type ${file.mimetype} is not allowed`));
    }
    
    // Additional filename security checks
    const filename = file.originalname.toLowerCase();
    const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.php', '.jsp', '.asp'];
    
    if (suspiciousExtensions.some(ext => filename.includes(ext))) {
      logger.warn('Suspicious file extension detected', {
        originalname: file.originalname,
        userId: (req.user as any)?.claims?.sub,
        ip: req.ip,
      });
      return cb(new Error('File contains suspicious extension'));
    }
    
    cb(null, true);
  };
  
  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: sizeLimit,
      files: maxFiles,
      fields: 10,
      fieldSize: 1024 * 1024, // 1MB for form fields
    },
  });
};

// Post-upload security processing middleware
export const postUploadSecurityCheck = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file && !req.files) {
    return next();
  }
  
  const files = req.files ? 
    (Array.isArray(req.files) ? req.files : Object.values(req.files).flat()) : 
    [req.file!];
  
  try {
    for (const file of files) {
      if (!file) continue;
      
      logger.info('Processing uploaded file', {
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        userId: (req.user as any)?.claims?.sub,
      });
      
      // Security scan
      const isSecure = await scanFileSignature(file.path);
      if (!isSecure) {
        await fs.unlink(file.path).catch(() => {}); // Clean up
        return res.status(400).json({
          error: 'File failed security scan',
          filename: file.originalname,
        });
      }
      
      // Process images
      if (file.mimetype.startsWith('image/')) {
        const outputPath = file.path + '_processed.jpg';
        await processImage(file.path, outputPath);
        
        // Update file info
        file.path = outputPath;
        file.filename = file.filename + '_processed.jpg';
        file.mimetype = 'image/jpeg';
      }
    }
    
    next();
  } catch (error) {
    logger.error('Post-upload security check failed', { error });
    
    // Clean up uploaded files
    for (const file of files) {
      if (file?.path) {
        await fs.unlink(file.path).catch(() => {});
      }
    }
    
    res.status(500).json({
      error: 'File processing failed',
      reason: 'security_check_failed',
    });
  }
};

// File access control middleware
export const fileAccessControl = (req: Request, res: Response, next: NextFunction) => {
  const filePath = req.params.filePath || req.query.file;
  const user = req.user as any;
  
  if (!filePath) {
    return res.status(400).json({ error: 'File path required' });
  }
  
  // Prevent directory traversal
  const normalizedPath = path.normalize(filePath);
  if (normalizedPath.includes('..') || normalizedPath.startsWith('/')) {
    logger.warn('Directory traversal attempt detected', {
      filePath,
      normalizedPath,
      userId: user?.claims?.sub,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
    
    return res.status(400).json({ 
      error: 'Invalid file path',
      reason: 'directory_traversal_detected',
    });
  }
  
  // Check file ownership/permissions (implement based on your access control logic)
  // For now, require authentication for file access
  if (!user) {
    return res.status(401).json({ error: 'Authentication required for file access' });
  }
  
  logger.info('File access requested', {
    filePath: normalizedPath,
    userId: user.claims?.sub,
    ip: req.ip,
  });
  
  next();
};

// Clean up temporary files periodically
const cleanupTempFiles = async () => {
  const tempDir = '/tmp/uploads';
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  
  try {
    const files = await fs.readdir(tempDir);
    const now = Date.now();
    
    for (const file of files) {
      const filePath = path.join(tempDir, file);
      const stats = await fs.stat(filePath);
      
      if (now - stats.mtime.getTime() > maxAge) {
        await fs.unlink(filePath);
        logger.info('Cleaned up old temporary file', { filePath });
      }
    }
  } catch (error) {
    logger.error('Failed to clean up temporary files', { error });
  }
};

// Schedule cleanup every hour
setInterval(cleanupTempFiles, 60 * 60 * 1000);

// Quarantine suspicious files
export const quarantineFile = async (filePath: string, reason: string) => {
  const quarantineDir = '/tmp/quarantine';
  await fs.mkdir(quarantineDir, { recursive: true });
  
  const filename = path.basename(filePath);
  const quarantinePath = path.join(quarantineDir, `${Date.now()}_${filename}`);
  
  try {
    await fs.rename(filePath, quarantinePath);
    
    logger.warn('File quarantined', {
      originalPath: filePath,
      quarantinePath,
      reason,
    });
    
    // Could send alert to security team here
  } catch (error) {
    logger.error('Failed to quarantine file', { filePath, error });
  }
};