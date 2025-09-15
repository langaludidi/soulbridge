import { Router } from 'express';
import { isAuthenticated } from '../replitAuth';
import { upload, processAndSaveImage, generateFilename, deleteUploadedFile } from '../utils/fileUpload';
import { logger } from '../utils/logger';
import type { AuthenticatedRequest } from '../middleware/auth';

export const uploadRouter = Router();

// Upload memorial photo
uploadRouter.post('/memorial-photo', isAuthenticated, upload.single('photo'), async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.claims?.sub;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate unique filename
    const memorialId = req.body.memorialId;
    const filename = generateFilename(req.file.originalname, memorialId);

    // Process and save the image
    const imageUrl = await processAndSaveImage(req.file, filename);

    logger.info('Photo uploaded successfully', {
      userId,
      memorialId,
      filename,
      originalName: req.file.originalname,
      size: req.file.size
    });

    res.json({
      success: true,
      imageUrl,
      message: 'Photo uploaded successfully'
    });

  } catch (error: any) {
    logger.error('Photo upload failed', {
      error: error.message,
      userId: (req as AuthenticatedRequest).user?.claims?.sub
    });

    if (error.message.includes('Invalid file type')) {
      return res.status(400).json({ error: error.message });
    }

    if (error.message.includes('File too large')) {
      return res.status(400).json({ error: 'File is too large. Maximum size is 5MB.' });
    }

    res.status(500).json({ error: 'Failed to upload photo' });
  }
});

// Delete uploaded photo
uploadRouter.delete('/memorial-photo/:filename', isAuthenticated, async (req, res) => {
  try {
    const { filename } = req.params;
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.claims?.sub;

    // Basic filename validation
    if (!filename || filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    await deleteUploadedFile(filename);

    logger.info('Photo deleted successfully', {
      userId,
      filename
    });

    res.json({
      success: true,
      message: 'Photo deleted successfully'
    });

  } catch (error: any) {
    logger.error('Photo deletion failed', {
      error: error.message,
      userId: (req as AuthenticatedRequest).user?.claims?.sub,
      filename: req.params.filename
    });

    res.status(500).json({ error: 'Failed to delete photo' });
  }
});