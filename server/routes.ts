import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertMemorialSchema, insertTributeSchema, insertPartnerSchema, insertMemorialPhotoSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Memorial routes
  app.get('/api/memorials', async (req, res) => {
    try {
      const { province, status = "published" } = req.query;
      const memorials = await storage.getMemorials({
        province: province as string,
        status: status as string,
      });
      res.json(memorials);
    } catch (error) {
      console.error("Error fetching memorials:", error);
      res.status(500).json({ message: "Failed to fetch memorials" });
    }
  });

  app.get('/api/memorials/:id', async (req, res) => {
    try {
      const memorial = await storage.getMemorial(req.params.id);
      if (!memorial) {
        return res.status(404).json({ message: "Memorial not found" });
      }
      
      // Increment view count
      await storage.incrementMemorialViews(req.params.id);
      
      res.json(memorial);
    } catch (error) {
      console.error("Error fetching memorial:", error);
      res.status(500).json({ message: "Failed to fetch memorial" });
    }
  });

  app.post('/api/memorials', isAuthenticated, async (req: any, res) => {
    try {
      const memorialData = insertMemorialSchema.parse(req.body);
      const userId = req.user.claims.sub;
      
      const memorial = await storage.createMemorial({
        ...memorialData,
        submittedBy: userId,
        status: "draft", // All submissions start as drafts for moderation
      });
      
      res.status(201).json(memorial);
    } catch (error) {
      console.error("Error creating memorial:", error);
      res.status(500).json({ message: "Failed to create memorial" });
    }
  });

  // Tribute routes
  app.get('/api/memorials/:memorialId/tributes', async (req, res) => {
    try {
      const tributes = await storage.getTributesByMemorial(req.params.memorialId);
      res.json(tributes);
    } catch (error) {
      console.error("Error fetching tributes:", error);
      res.status(500).json({ message: "Failed to fetch tributes" });
    }
  });

  app.post('/api/memorials/:memorialId/tributes', async (req: any, res) => {
    try {
      const tributeData = insertTributeSchema.parse({
        ...req.body,
        memorialId: req.params.memorialId,
      });
      
      // Check if user is authenticated for submittedBy field
      const userId = req.user?.claims?.sub;
      
      const tribute = await storage.createTribute({
        ...tributeData,
        submittedBy: userId,
        status: "draft", // All submissions start as drafts for moderation
      });
      
      res.status(201).json(tribute);
    } catch (error) {
      console.error("Error creating tribute:", error);
      res.status(500).json({ message: "Failed to create tribute" });
    }
  });

  // Partner routes
  app.get('/api/partners', async (req, res) => {
    try {
      const { province, type, status = "published" } = req.query;
      const partners = await storage.getPartners({
        province: province as string,
        type: type as string,
        status: status as string,
      });
      res.json(partners);
    } catch (error) {
      console.error("Error fetching partners:", error);
      res.status(500).json({ message: "Failed to fetch partners" });
    }
  });

  app.post('/api/partners', isAuthenticated, async (req: any, res) => {
    try {
      const partnerData = insertPartnerSchema.parse(req.body);
      const userId = req.user.claims.sub;
      
      const partner = await storage.createPartner({
        ...partnerData,
        submittedBy: userId,
        status: "draft", // All submissions start as drafts for moderation
      });
      
      res.status(201).json(partner);
    } catch (error) {
      console.error("Error creating partner:", error);
      res.status(500).json({ message: "Failed to create partner" });
    }
  });

  // Memorial photo routes
  app.get('/api/memorials/:memorialId/photos', async (req, res) => {
    try {
      const { mediaType } = req.query;
      const photos = await storage.getMemorialPhotos(
        req.params.memorialId,
        mediaType as string
      );
      res.json(photos);
    } catch (error) {
      console.error("Error fetching memorial photos:", error);
      res.status(500).json({ message: "Failed to fetch memorial photos" });
    }
  });

  // Set cover photo route
  app.patch('/api/memorials/:memorialId/photos/:photoId/cover', isAuthenticated, async (req: any, res) => {
    try {
      await storage.setCoverPhoto(req.params.memorialId, req.params.photoId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error setting cover photo:", error);
      res.status(500).json({ message: "Failed to set cover photo" });
    }
  });

  // Increment photo views
  app.patch('/api/photos/:photoId/view', async (req, res) => {
    try {
      await storage.incrementPhotoViews(req.params.photoId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error incrementing photo views:", error);
      res.status(500).json({ message: "Failed to increment photo views" });
    }
  });

  app.post('/api/memorials/:memorialId/photos', isAuthenticated, async (req: any, res) => {
    try {
      const photoData = insertMemorialPhotoSchema.parse({
        ...req.body,
        memorialId: req.params.memorialId,
      });
      
      // Get authenticated user ID
      const userId = req.user.claims.sub;
      
      const photo = await storage.createMemorialPhoto({
        ...photoData,
        uploadedBy: userId,
      });
      
      res.status(201).json(photo);
    } catch (error) {
      console.error("Error uploading memorial photo:", error);
      res.status(500).json({ message: "Failed to upload memorial photo" });
    }
  });

  // Funeral program routes
  app.get('/api/memorials/:memorialId/programs', async (req, res) => {
    try {
      const programs = await storage.getFuneralPrograms(req.params.memorialId);
      res.json(programs);
    } catch (error) {
      console.error("Error fetching funeral programs:", error);
      res.status(500).json({ message: "Failed to fetch funeral programs" });
    }
  });

  // Memorial event routes
  app.get('/api/memorials/:memorialId/events', async (req, res) => {
    try {
      const events = await storage.getMemorialEvents(req.params.memorialId);
      res.json(events);
    } catch (error) {
      console.error("Error fetching memorial events:", error);
      res.status(500).json({ message: "Failed to fetch memorial events" });
    }
  });

  // Admin routes for content moderation
  app.get('/api/admin/memorials', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const memorials = await storage.getMemorials({ status: req.query.status as string });
      res.json(memorials);
    } catch (error) {
      console.error("Error fetching admin memorials:", error);
      res.status(500).json({ message: "Failed to fetch memorials" });
    }
  });

  app.patch('/api/admin/memorials/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const memorial = await storage.updateMemorial(req.params.id, req.body);
      res.json(memorial);
    } catch (error) {
      console.error("Error updating memorial:", error);
      res.status(500).json({ message: "Failed to update memorial" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
