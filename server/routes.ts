import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertMemorialSchema, insertTributeSchema, insertPartnerSchema, insertMemorialPhotoSchema } from "@shared/schema";
import fs from "fs";
import path from "path";

// Function to generate HTML with OpenGraph meta tags for memorial pages
function generateMemorialHTML(memorial: any, request: any): string {
  const memorialUrl = `${request.protocol}://${request.get('host')}/memorial/${memorial.id}`;
  const title = `${memorial.firstName} ${memorial.lastName} - Memorial | SoulBridge`;
  const description = memorial.memorialMessage 
    ? `${memorial.memorialMessage.substring(0, 160)}${memorial.memorialMessage.length > 160 ? '...' : ''}`
    : `Remember ${memorial.firstName} ${memorial.lastName} (${new Date(memorial.dateOfBirth).getFullYear()} - ${new Date(memorial.dateOfPassing).getFullYear()}) on SoulBridge. Honor their memory and share precious moments with family and friends.`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    
    <!-- Standard Meta Tags -->
    <title>${title.replace(/"/g, '&quot;')}</title>
    <meta name="description" content="${description.replace(/"/g, '&quot;')}" />
    
    <!-- OpenGraph Meta Tags for ${memorial.firstName} ${memorial.lastName} -->
    <meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />
    <meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />
    <meta property="og:type" content="profile" />
    <meta property="og:url" content="${memorialUrl}" />
    <meta property="og:site_name" content="SoulBridge" />
    <meta property="profile:first_name" content="${memorial.firstName.replace(/"/g, '&quot;')}" />
    <meta property="profile:last_name" content="${memorial.lastName.replace(/"/g, '&quot;')}" />
    ${memorial.profilePhotoUrl ? `<meta property="og:image" content="${memorial.profilePhotoUrl}" />
    <meta property="og:image:alt" content="Memorial photo of ${memorial.firstName} ${memorial.lastName}" />
    <meta property="og:image:type" content="image/jpeg" />` : `<meta property="og:image" content="${memorialUrl}/api/og-image/${memorial.id}" />
    <meta property="og:image:alt" content="Memorial for ${memorial.firstName} ${memorial.lastName}" />`}
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />
    <meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />
    ${memorial.profilePhotoUrl ? `<meta name="twitter:image" content="${memorial.profilePhotoUrl}" />` : ''}
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Architects+Daughter&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Fira+Code:wght@300..700&family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400..700;1,400..700&family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Outfit:wght@100..900&family=Oxanium:wght@200..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100..900;1,100..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&family=Space+Grotesk:wght@300..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
    <!-- This is a replit script which adds a banner on the top of the page when opened in development mode outside the replit environment -->
    <script type="text/javascript" src="https://replit.com/public/js/replit-dev-banner.js"></script>
  </body>
</html>`;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Memorial page route with OpenGraph meta tags for social media crawlers
  app.get('/memorial/:id', async (req, res, next) => {
    try {
      // Check if this is a social media crawler
      const userAgent = req.get('User-Agent') || '';
      const isCrawler = /facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|slackbot|googlebot/i.test(userAgent);
      
      // Only serve OpenGraph HTML for crawlers, let React handle regular users
      if (!isCrawler) {
        return next(); // Continue to vite middleware
      }
      
      const memorial = await storage.getMemorial(req.params.id);
      
      if (!memorial) {
        // If memorial doesn't exist, let vite handle it (will show 404 page)
        return next();
      }
      
      // Generate HTML with OpenGraph meta tags for crawlers
      const html = generateMemorialHTML(memorial, req);
      
      res.status(200).set({ "Content-Type": "text/html" }).send(html);
    } catch (error) {
      console.error("Error serving memorial page:", error);
      // Fallback to letting vite handle it
      next();
    }
  });

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

  // Memorial invitation routes
  app.post('/api/memorials/:memorialId/invitations', async (req: any, res) => {
    try {
      const { emails, message, inviterName } = req.body;
      const memorialId = req.params.memorialId;
      
      // Validate request data
      if (!emails || !Array.isArray(emails) || emails.length === 0) {
        return res.status(400).json({ 
          message: "At least one email address is required" 
        });
      }
      
      // Limit number of emails to prevent spam
      if (emails.length > 10) {
        return res.status(400).json({ 
          message: "Cannot send to more than 10 email addresses at once" 
        });
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const invalidEmails = emails.filter(email => !emailRegex.test(email));
      if (invalidEmails.length > 0) {
        return res.status(400).json({ 
          message: `Invalid email addresses: ${invalidEmails.join(', ')}` 
        });
      }
      
      // Get memorial details for the invitation
      const memorial = await storage.getMemorial(memorialId);
      if (!memorial) {
        return res.status(404).json({ message: "Memorial not found" });
      }
      
      // Log invitation for demo (in production, you'd send actual emails)
      console.log(`[INVITATION] Sending invitation for ${memorial.firstName} ${memorial.lastName}`);
      console.log(`[INVITATION] Inviter: ${inviterName || 'Anonymous'}`);
      console.log(`[INVITATION] Recipients: ${emails.join(', ')}`);
      console.log(`[INVITATION] Message: ${message}`);
      console.log(`[INVITATION] Memorial URL: ${req.protocol}://${req.get('host')}/memorial/${memorialId}`);
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      res.json({ 
        success: true, 
        message: `Invitations sent to ${emails.length} email address${emails.length > 1 ? 'es' : ''}`,
        emailsSent: emails.length
      });
    } catch (error) {
      console.error("Error sending invitations:", error);
      res.status(500).json({ message: "Failed to send invitations" });
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
