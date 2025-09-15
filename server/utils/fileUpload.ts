import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import { Request } from 'express';

// Supported image types
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'memorial-photos');

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// Configure multer for memory storage (we'll process before saving)
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
    }
  }
});

// Process and save uploaded image
export async function processAndSaveImage(
  file: Express.Multer.File,
  filename: string
): Promise<string> {
  await ensureUploadDir();

  const processedBuffer = await sharp(file.buffer)
    .resize(800, 800, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({
      quality: 85,
      progressive: true
    })
    .toBuffer();

  const finalFilename = `${filename}.jpg`;
  const filePath = path.join(UPLOAD_DIR, finalFilename);
  
  await fs.writeFile(filePath, processedBuffer);
  
  // Return relative URL path
  return `/uploads/memorial-photos/${finalFilename}`;
}

// Generate unique filename
export function generateFilename(originalName: string, memorialId?: string): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const prefix = memorialId ? `memorial-${memorialId}` : 'photo';
  return `${prefix}-${timestamp}-${randomStr}`;
}

// Delete uploaded file
export async function deleteUploadedFile(filename: string): Promise<void> {
  try {
    const filePath = path.join(UPLOAD_DIR, filename);
    await fs.unlink(filePath);
  } catch (error) {
    // File doesn't exist or other error - log but don't throw
    console.warn(`Failed to delete file ${filename}:`, error);
  }
}