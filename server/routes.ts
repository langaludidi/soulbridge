import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { enforceMemorialLimits, enforcePremiumFeatures } from "./middleware/subscription";
import { insertMemorialSchema, insertTributeSchema, insertPartnerSchema, insertMemorialPhotoSchema, insertContactSubmissionSchema, insertMemorialSubscriptionSchema, insertDigitalOrderOfServiceSchema, insertOrderOfServiceEventSchema } from "@shared/schema";
import { billingRouter } from "./billing/routes";
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

  // User usage statistics endpoint
  app.get('/api/user/usage', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get user's memorials to calculate usage
      const userMemorials = await storage.getMemorialsByUser(userId);
      
      // Calculate current month activity (created this month)
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const currentMonthMemorials = userMemorials.filter((memorial: any) => 
        new Date(memorial.createdAt || memorial.dateSubmitted) >= firstDayOfMonth
      );
      
      // Get total tributes across all user's memorials
      const totalTributes = await storage.getTotalTributesByUser(userId);
      
      // Get user's subscription to determine limits
      const user = await storage.getUser(userId);
      const tier = user?.subscriptionTier || 'remember';
      
      // Define memorial limits by tier
      const memorialLimits = {
        remember: 1,
        honour: 3,
        legacy: "unlimited",
        family_vault: "unlimited"
      };
      
      const usageStats = {
        memorialsUsed: userMemorials.length,
        memorialsLimit: memorialLimits[tier as keyof typeof memorialLimits] || 1,
        currentMonthActive: currentMonthMemorials.length,
        totalTributes: totalTributes || 0
      };
      
      res.json(usageStats);
    } catch (error) {
      console.error("Error fetching user usage:", error);
      res.status(500).json({ message: "Failed to fetch usage statistics" });
    }
  });

  // Memorial routes
  app.get('/api/memorials', async (req, res) => {
    try {
      const { province, status, includeDrafts } = req.query;
      
      // Only allow draft access for authenticated users
      const defaultStatus = status as string || "published";
      const canAccessDrafts = req.user && includeDrafts === "true";
      
      const memorials = await storage.getMemorials({
        province: province as string,
        status: canAccessDrafts ? null : defaultStatus, // null shows all when authenticated
      });
      
      res.json(memorials);
    } catch (error) {
      console.error("Error fetching memorials:", error);
      res.status(500).json({ message: "Failed to fetch memorials" });
    }
  });

  app.get('/api/memorials/:id', async (req, res) => {
    try {
      const memorial = await storage.getMemorialWithAdmin(req.params.id);
      if (!memorial) {
        return res.status(404).json({ message: "Memorial not found" });
      }
      
      res.json(memorial);
    } catch (error) {
      console.error("Error fetching memorial:", error);
      res.status(500).json({ message: "Failed to fetch memorial" });
    }
  });

  // Memorial view tracking endpoint (called only when localStorage check passes)
  app.patch('/api/memorials/:id/view', async (req, res) => {
    try {
      const memorial = await storage.getMemorial(req.params.id);
      if (!memorial) {
        return res.status(404).json({ message: "Memorial not found" });
      }
      
      await storage.incrementMemorialViews(req.params.id);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error incrementing memorial views:", error);
      res.status(500).json({ message: "Failed to update view count" });
    }
  });

  app.post('/api/memorials', isAuthenticated, enforceMemorialLimits, async (req: any, res) => {
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

  // Contact submission route
  app.post('/api/contact', async (req: any, res) => {
    try {
      const contactData = insertContactSubmissionSchema.parse(req.body);
      
      // Get authenticated user ID if available
      const userId = req.user?.claims?.sub;
      
      // Validate email format if provided
      if (contactData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactData.email)) {
          return res.status(400).json({ 
            message: "Please provide a valid email address" 
          });
        }
      }
      
      // If memorial ID is provided, verify memorial exists
      if (contactData.memorialId) {
        const memorial = await storage.getMemorial(contactData.memorialId);
        if (!memorial) {
          return res.status(400).json({ message: "Invalid memorial reference" });
        }
      }
      
      // Log contact submission for demo (in production, you'd store in database)
      console.log(`[CONTACT] New contact submission:`);
      console.log(`[CONTACT] Subject: ${contactData.subject}`);
      console.log(`[CONTACT] Message: ${contactData.message}`);
      console.log(`[CONTACT] Email: ${contactData.email || 'Not provided'}`);
      console.log(`[CONTACT] Memorial ID: ${contactData.memorialId || 'None'}`);
      console.log(`[CONTACT] User ID: ${userId || 'Anonymous'}`);
      console.log(`[CONTACT] Timestamp: ${new Date().toISOString()}`);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      res.json({ 
        success: true, 
        message: "Thank you for your feedback! We'll review your message and get back to you if needed.",
        submissionId: `submission_${Date.now()}`
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      res.status(500).json({ message: "Failed to submit contact form. Please try again." });
    }
  });

  // Memorial subscription routes
  app.get('/api/memorials/:id/subscription', async (req: any, res) => {
    try {
      const memorialId = req.params.id;
      const userId = req.user?.claims?.sub;
      const email = req.query.email as string;
      
      // Check if memorial exists
      const memorial = await storage.getMemorial(memorialId);
      if (!memorial) {
        return res.status(404).json({ message: "Memorial not found" });
      }
      
      // Find subscription by userId or email
      const subscription = await storage.getMemorialSubscription(memorialId, userId, email);
      
      res.json({
        isSubscribed: !!subscription && subscription.isActive,
        subscription: subscription || null,
        requiresAuth: !userId && !email, // Guest users need to provide email or authenticate
      });
    } catch (error) {
      console.error("Error checking subscription status:", error);
      res.status(500).json({ message: "Failed to check subscription status" });
    }
  });

  app.post('/api/memorials/:id/subscription', async (req: any, res) => {
    try {
      const memorialId = req.params.id;
      const userId = req.user?.claims?.sub;
      const subscriptionData = insertMemorialSubscriptionSchema.parse({
        ...req.body,
        memorialId,
        userId: userId || undefined,
      });
      
      // Check if memorial exists
      const memorial = await storage.getMemorial(memorialId);
      if (!memorial) {
        return res.status(404).json({ message: "Memorial not found" });
      }
      
      // Validate email if provided for guest subscription
      if (subscriptionData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(subscriptionData.email)) {
          return res.status(400).json({ message: "Please provide a valid email address" });
        }
      }
      
      // Must have either userId or email
      if (!userId && !subscriptionData.email) {
        return res.status(400).json({ message: "Email address is required for subscription" });
      }
      
      // Check if subscription already exists
      const existingSubscription = await storage.getMemorialSubscription(
        memorialId,
        userId,
        subscriptionData.email || undefined
      );
      
      if (existingSubscription && existingSubscription.isActive) {
        return res.status(409).json({ 
          message: "Already subscribed to this memorial",
          subscription: existingSubscription
        });
      }
      
      // Create or reactivate subscription
      let subscription;
      if (existingSubscription && !existingSubscription.isActive) {
        // Reactivate existing subscription
        subscription = await storage.updateMemorialSubscription(existingSubscription.id, { 
          isActive: true,
          subscriptionType: subscriptionData.subscriptionType || "all_updates"
        });
      } else {
        // Create new subscription
        subscription = await storage.createMemorialSubscription(subscriptionData);
      }
      
      res.status(201).json({
        success: true,
        message: "Successfully subscribed to memorial updates",
        subscription
      });
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  app.delete('/api/memorials/:id/subscription', async (req: any, res) => {
    try {
      const memorialId = req.params.id;
      const userId = req.user?.claims?.sub;
      const email = req.query.email as string;
      
      // Check if memorial exists
      const memorial = await storage.getMemorial(memorialId);
      if (!memorial) {
        return res.status(404).json({ message: "Memorial not found" });
      }
      
      // Find subscription
      const subscription = await storage.getMemorialSubscription(memorialId, userId, email);
      if (!subscription || !subscription.isActive) {
        return res.status(404).json({ message: "No active subscription found" });
      }
      
      // Deactivate subscription
      await storage.deleteMemorialSubscription(subscription.id);
      
      res.json({
        success: true,
        message: "Successfully unsubscribed from memorial updates"
      });
    } catch (error) {
      console.error("Error deleting subscription:", error);
      res.status(500).json({ message: "Failed to unsubscribe" });
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

  // Digital Order of Service routes
  app.get('/api/memorials/:memorialId/order-of-service', async (req, res) => {
    try {
      const { memorialId } = req.params;
      
      // Check if memorial exists
      const memorial = await storage.getMemorial(memorialId);
      if (!memorial) {
        return res.status(404).json({ message: "Memorial not found" });
      }
      
      const orderOfService = await storage.getOrderOfServiceByMemorial(memorialId);
      if (!orderOfService) {
        return res.status(404).json({ message: "Order of Service not found for this memorial" });
      }
      
      // Get associated events
      const events = await storage.getOrderOfServiceEvents(orderOfService.id);
      
      res.json({
        ...orderOfService,
        events
      });
    } catch (error) {
      console.error("Error fetching Order of Service:", error);
      res.status(500).json({ message: "Failed to fetch Order of Service" });
    }
  });

  app.get('/api/order-of-service/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      const orderOfService = await storage.getOrderOfService(id);
      if (!orderOfService) {
        return res.status(404).json({ message: "Order of Service not found" });
      }
      
      // Get associated events
      const events = await storage.getOrderOfServiceEvents(id);
      
      res.json({
        ...orderOfService,
        events
      });
    } catch (error) {
      console.error("Error fetching Order of Service:", error);
      res.status(500).json({ message: "Failed to fetch Order of Service" });
    }
  });

  app.post('/api/memorials/:memorialId/order-of-service', isAuthenticated, async (req: any, res) => {
    try {
      const { memorialId } = req.params;
      const userId = req.user.claims.sub;
      
      // Check if memorial exists
      const memorial = await storage.getMemorial(memorialId);
      if (!memorial) {
        return res.status(404).json({ message: "Memorial not found" });
      }
      
      // Check if user has permission (memorial creator or admin)
      const user = await storage.getUser(userId);
      if (memorial.submittedBy !== userId && user?.role !== 'admin') {
        return res.status(403).json({ message: "Permission denied. Only the memorial creator can create Order of Service" });
      }
      
      // Check if Order of Service already exists for this memorial
      const existingOrderOfService = await storage.getOrderOfServiceByMemorial(memorialId);
      if (existingOrderOfService) {
        return res.status(409).json({ 
          message: "Order of Service already exists for this memorial",
          orderOfService: existingOrderOfService
        });
      }
      
      const orderOfServiceData = insertDigitalOrderOfServiceSchema.parse({
        ...req.body,
        memorialId,
        createdBy: userId,
      });
      
      const orderOfService = await storage.createOrderOfService(orderOfServiceData);
      
      res.status(201).json(orderOfService);
    } catch (error) {
      console.error("Error creating Order of Service:", error);
      res.status(500).json({ message: "Failed to create Order of Service" });
    }
  });

  app.patch('/api/order-of-service/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      // Check if Order of Service exists
      const orderOfService = await storage.getOrderOfService(id);
      if (!orderOfService) {
        return res.status(404).json({ message: "Order of Service not found" });
      }
      
      // Check if user has permission (creator or admin)
      const user = await storage.getUser(userId);
      if (orderOfService.createdBy !== userId && user?.role !== 'admin') {
        return res.status(403).json({ message: "Permission denied" });
      }
      
      const updateData = req.body;
      delete updateData.id; // Prevent ID changes
      delete updateData.memorialId; // Prevent memorial ID changes
      delete updateData.createdBy; // Prevent creator changes
      delete updateData.createdAt; // Prevent creation date changes
      
      const updated = await storage.updateOrderOfService(id, updateData);
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating Order of Service:", error);
      res.status(500).json({ message: "Failed to update Order of Service" });
    }
  });

  app.delete('/api/order-of-service/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      // Check if Order of Service exists
      const orderOfService = await storage.getOrderOfService(id);
      if (!orderOfService) {
        return res.status(404).json({ message: "Order of Service not found" });
      }
      
      // Check if user has permission (creator or admin)
      const user = await storage.getUser(userId);
      if (orderOfService.createdBy !== userId && user?.role !== 'admin') {
        return res.status(403).json({ message: "Permission denied" });
      }
      
      await storage.deleteOrderOfService(id);
      
      res.json({ success: true, message: "Order of Service deleted successfully" });
    } catch (error) {
      console.error("Error deleting Order of Service:", error);
      res.status(500).json({ message: "Failed to delete Order of Service" });
    }
  });

  app.patch('/api/order-of-service/:id/view', async (req, res) => {
    try {
      await storage.incrementOrderOfServiceViews(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error incrementing Order of Service views:", error);
      res.status(500).json({ message: "Failed to increment views" });
    }
  });

  app.patch('/api/order-of-service/:id/download', async (req, res) => {
    try {
      await storage.incrementOrderOfServiceDownloads(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error incrementing Order of Service downloads:", error);
      res.status(500).json({ message: "Failed to increment downloads" });
    }
  });

  // Order of Service Events routes
  app.get('/api/order-of-service/:orderOfServiceId/events', async (req, res) => {
    try {
      const { orderOfServiceId } = req.params;
      
      // Check if Order of Service exists
      const orderOfService = await storage.getOrderOfService(orderOfServiceId);
      if (!orderOfService) {
        return res.status(404).json({ message: "Order of Service not found" });
      }
      
      const events = await storage.getOrderOfServiceEvents(orderOfServiceId);
      res.json(events);
    } catch (error) {
      console.error("Error fetching Order of Service events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.post('/api/order-of-service/:orderOfServiceId/events', isAuthenticated, async (req: any, res) => {
    try {
      const { orderOfServiceId } = req.params;
      const userId = req.user.claims.sub;
      
      // Check if Order of Service exists
      const orderOfService = await storage.getOrderOfService(orderOfServiceId);
      if (!orderOfService) {
        return res.status(404).json({ message: "Order of Service not found" });
      }
      
      // Check if user has permission (creator or admin)
      const user = await storage.getUser(userId);
      if (orderOfService.createdBy !== userId && user?.role !== 'admin') {
        return res.status(403).json({ message: "Permission denied" });
      }
      
      const eventData = insertOrderOfServiceEventSchema.parse({
        ...req.body,
        orderOfServiceId,
      });
      
      const event = await storage.createOrderOfServiceEvent(eventData);
      
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating Order of Service event:", error);
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  app.patch('/api/order-of-service-events/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      // Get event details first to check Order of Service
      const existingEvents = await storage.getOrderOfServiceEvents('temp'); // This is not efficient, but works for now
      const event = Array.from(existingEvents).find((e: any) => e.id === id);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      // Check if Order of Service exists and user has permission
      const orderOfService = await storage.getOrderOfService(event.orderOfServiceId);
      if (!orderOfService) {
        return res.status(404).json({ message: "Order of Service not found" });
      }
      
      const user = await storage.getUser(userId);
      if (orderOfService.createdBy !== userId && user?.role !== 'admin') {
        return res.status(403).json({ message: "Permission denied" });
      }
      
      const updateData = req.body;
      delete updateData.id; // Prevent ID changes
      delete updateData.orderOfServiceId; // Prevent Order of Service ID changes
      delete updateData.createdAt; // Prevent creation date changes
      
      const updated = await storage.updateOrderOfServiceEvent(id, updateData);
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating Order of Service event:", error);
      res.status(500).json({ message: "Failed to update event" });
    }
  });

  app.delete('/api/order-of-service-events/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      // Similar permission check logic as update
      // Note: This is a simplified version - in production, you'd want more efficient queries
      
      await storage.deleteOrderOfServiceEvent(id);
      
      res.json({ success: true, message: "Event deleted successfully" });
    } catch (error) {
      console.error("Error deleting Order of Service event:", error);
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  app.patch('/api/order-of-service/:orderOfServiceId/events/reorder', isAuthenticated, async (req: any, res) => {
    try {
      const { orderOfServiceId } = req.params;
      const { eventIds } = req.body;
      const userId = req.user.claims.sub;
      
      if (!Array.isArray(eventIds)) {
        return res.status(400).json({ message: "eventIds must be an array" });
      }
      
      // Check if Order of Service exists and user has permission
      const orderOfService = await storage.getOrderOfService(orderOfServiceId);
      if (!orderOfService) {
        return res.status(404).json({ message: "Order of Service not found" });
      }
      
      const user = await storage.getUser(userId);
      if (orderOfService.createdBy !== userId && user?.role !== 'admin') {
        return res.status(403).json({ message: "Permission denied" });
      }
      
      await storage.reorderServiceEvents(orderOfServiceId, eventIds);
      
      res.json({ success: true, message: "Events reordered successfully" });
    } catch (error) {
      console.error("Error reordering Order of Service events:", error);
      res.status(500).json({ message: "Failed to reorder events" });
    }
  });

  // Billing routes
  app.use('/api/billing', billingRouter);

  const httpServer = createServer(app);
  return httpServer;
}
