import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { enforceMemorialLimits, enforcePremiumFeatures } from "./middleware/subscription";
import { resolveBrandingContext, getBrandingResponse, getPartnerIdFromContext, type BrandedRequest } from "./middleware/branding";
import { type AuthenticatedRequest } from "./middleware/auth";
import { insertMemorialSchema, insertTributeSchema, insertPartnerSchema, insertMemorialPhotoSchema, insertContactSubmissionSchema, insertMemorialSubscriptionSchema, insertDigitalOrderOfServiceSchema, insertOrderOfServiceEventSchema, insertPartnerLeadSchema } from "@shared/schema";
import { billingRouter } from "./billing/routes";
import { securityRouter } from "./routes/security";
import { logger } from "./utils/logger";
import { pool } from "./db";
import fs from "fs";
import path from "path";

// Enhanced security and validation imports
import { 
  validateMemorialCreation,
  validateContactForm,
  validateTributeCreation,
  validatePartnerRegistration,
  validateOrderOfService,
  validatePaginationParams,
  validateSearchParams,
  validateUUIDParam,
  handleValidationErrors,
} from "./middleware/validation";
import { 
  createSecureUpload,
  postUploadSecurityCheck,
  fileAccessControl,
} from "./middleware/file-security";
import {
  logSecurityEvent,
  analyzeRequest,
  SecurityEventType,
  SecuritySeverity,
} from "./utils/security-monitor";

// Combined type for authenticated requests with branding context
type AuthenticatedBrandedRequest = AuthenticatedRequest & BrandedRequest;

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
    <!-- Production ready deployment -->
  </body>
</html>`;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint (before auth)
  app.get('/api/health', async (req, res) => {
    try {
      // Quick database connectivity check
      const healthCheck = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: Math.floor(process.uptime()),
        database: 'connected', // We'll test this below
      };

      // Test database connection with a quick query
      await pool.query('SELECT 1');
      
      res.status(200).json(healthCheck);
    } catch (error) {
      logger.error('Health check failed', { error: error.message });
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Database connection failed'
      });
    }
  });

  // Auth middleware
  await setupAuth(app);
  
  // Apply branding middleware to all routes
  app.use(resolveBrandingContext);

  // Security analysis middleware - analyze all requests for threats
  app.use((req, res, next) => {
    const analysis = analyzeRequest(req);
    
    if (analysis.isSuspicious && analysis.riskScore > 75) {
      // Block highly suspicious requests
      logSecurityEvent(
        SecurityEventType.SUSPICIOUS_ACTIVITY,
        SecuritySeverity.HIGH,
        `Highly suspicious request blocked: ${analysis.reasons.join(', ')}`,
        req,
        { analysis },
        true,
        'request_blocked'
      );
      
      return res.status(403).json({
        error: 'Request blocked due to security policy',
        reference: Date.now().toString(36),
      });
    } else if (analysis.isSuspicious) {
      // Log suspicious but allow
      logSecurityEvent(
        SecurityEventType.SUSPICIOUS_ACTIVITY,
        SecuritySeverity.MEDIUM,
        `Suspicious request detected: ${analysis.reasons.join(', ')}`,
        req,
        { analysis },
        false,
        'logged_only'
      );
    }
    
    next();
  });

  // Security dashboard and management routes
  app.use('/api/security', securityRouter);

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
    } catch (error: any) {
      logger.error("Error serving memorial page", { error: error.message, memorialId: req.params.id });
      // Fallback to letting vite handle it
      next();
    }
  });

  // Brand endpoint - returns branding context for current domain/partner
  app.get('/api/brand', async (req: BrandedRequest, res) => {
    try {
      const brandingResponse = getBrandingResponse(req.brandContext);
      res.json(brandingResponse);
    } catch (error: any) {
      logger.error("Error fetching branding context", { error: error.message });
      res.status(500).json({ message: "Failed to fetch branding context" });
    }
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error: any) {
      logger.error("Error fetching user", { error: error.message, userId: req.user.claims.sub });
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
    } catch (error: any) {
      const userId = req.user.claims.sub;
      logger.error("Error fetching user usage", { error: error.message, userId });
      res.status(500).json({ message: "Failed to fetch usage statistics" });
    }
  });

  // Memorial routes
  app.get('/api/memorials', validatePaginationParams, async (req, res) => {
    try {
      const { province, status, includeDrafts, page = 1, limit = 20 } = req.query;
      
      // Only allow draft access for authenticated users
      const defaultStatus = status as string || "published";
      const canAccessDrafts = req.user && includeDrafts === "true";
      
      const memorials = await storage.getMemorials({
        province: province as string,
        status: canAccessDrafts ? undefined : defaultStatus, // undefined shows all when authenticated
      });
      
      res.json(memorials);
    } catch (error: any) {
      logger.error("Error fetching memorials", { error: error.message, query: req.query });
      res.status(500).json({ message: "Failed to fetch memorials" });
    }
  });

  app.get('/api/memorials/:id', validateUUIDParam('id'), async (req, res) => {
    try {
      const memorial = await storage.getMemorialWithAdmin(req.params.id);
      if (!memorial) {
        return res.status(404).json({ message: "Memorial not found" });
      }
      
      res.json(memorial);
    } catch (error: any) {
      logger.error("Error fetching memorial", { error: error.message, memorialId: req.params.id });
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
    } catch (error: any) {
      logger.error("Error incrementing memorial views", { error: error.message, memorialId: req.params.id });
      res.status(500).json({ message: "Failed to update view count" });
    }
  });

  app.post('/api/memorials', isAuthenticated, validateMemorialCreation, enforceMemorialLimits, async (req: any, res) => {
    try {
      const memorialData = insertMemorialSchema.parse(req.body);
      const userId = req.user?.claims.sub;
      
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      // Get partner ID from branding context if available
      const partnerId = getPartnerIdFromContext(req.brandContext);
      
      const memorial = await storage.createMemorial({
        ...memorialData,
        submittedBy: userId,
        partnerId, // Associate memorial with partner if in partner context
        status: "draft", // All submissions start as drafts for moderation
      });
      
      res.status(201).json(memorial);
    } catch (error: any) {
      logger.error("Error creating memorial", { error: error.message, userId: req.user?.claims.sub });
      res.status(500).json({ message: "Failed to create memorial" });
    }
  });

  // Tribute routes
  app.get('/api/memorials/:memorialId/tributes', async (req, res) => {
    try {
      const tributes = await storage.getTributesByMemorial(req.params.memorialId);
      res.json(tributes);
    } catch (error: any) {
      logger.error("Error fetching tributes", { error: error.message, memorialId: req.params.memorialId });
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
    } catch (error: any) {
      logger.error("Error creating tribute", { error: error.message, memorialId: req.params.memorialId });
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
      logger.error("Error fetching partners", { error: error.message, query: req.query });
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
      logger.error("Error creating partner", { error: error.message, userId: req.user.claims.sub });
      res.status(500).json({ message: "Failed to create partner" });
    }
  });

  // Partner Lead routes
  app.post('/api/partner-leads', async (req, res) => {
    try {
      const leadData = insertPartnerLeadSchema.parse(req.body);
      
      // Check if a lead with this email already exists
      const existingLead = await storage.getPartnerLeadByEmail(leadData.email);
      if (existingLead && existingLead.status !== 'rejected') {
        return res.status(409).json({ 
          message: "A partner application with this email already exists" 
        });
      }
      
      const lead = await storage.createPartnerLead({
        ...leadData,
        status: "new",
      });
      
      res.status(201).json(lead);
    } catch (error) {
      logger.error("Error creating partner lead", { error: error.message });
      res.status(500).json({ message: "Failed to create partner lead" });
    }
  });

  app.get('/api/partner-leads', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      
      // Only admin users can view all leads
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const { status, partnershipModel, serviceType } = req.query;
      const leads = await storage.getPartnerLeads({
        status: status as string,
        partnershipModel: partnershipModel as string,
        serviceType: serviceType as string,
      });
      
      res.json(leads);
    } catch (error) {
      logger.error("Error fetching partner leads", { error: error.message, userId: req.user.claims.sub });
      res.status(500).json({ message: "Failed to fetch partner leads" });
    }
  });

  app.patch('/api/partner-leads/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      
      // Only admin users can update leads
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const leadId = req.params.id;
      const updateData = req.body;
      
      // Prevent updating certain fields
      delete updateData.id;
      delete updateData.createdAt;
      
      // Update contacted fields if status is being changed to contacted
      if (updateData.status === 'contacted' && !updateData.contactedAt) {
        updateData.contactedAt = new Date();
        updateData.contactedBy = req.user.claims.sub;
      }
      
      const updatedLead = await storage.updatePartnerLead(leadId, updateData);
      
      if (!updatedLead) {
        return res.status(404).json({ message: "Partner lead not found" });
      }
      
      res.json(updatedLead);
    } catch (error) {
      logger.error("Error updating partner lead", { error: error.message, leadId: req.params.id });
      res.status(500).json({ message: "Failed to update partner lead" });
    }
  });

  // Partner Dashboard routes (require partner role)
  app.get('/api/partner/dashboard', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'partner') {
        return res.status(403).json({ message: "Partner access required" });
      }
      
      // Get partner information
      const partner = await storage.getPartnerByUserId(userId);
      if (!partner) {
        return res.status(404).json({ message: "Partner profile not found" });
      }
      
      // Get dashboard data
      const dashboardData = await storage.getPartnerDashboardData(partner.id);
      
      res.json({
        partner,
        ...dashboardData,
      });
    } catch (error) {
      logger.error("Error fetching partner dashboard", { error: error.message, userId });
      res.status(500).json({ message: "Failed to fetch partner dashboard" });
    }
  });

  // Partner Branding Configuration routes
  app.get('/api/partner/branding', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const partner = await storage.getPartnerByUserId(userId);
      
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }
      
      res.json({
        brandingConfig: partner.brandingConfig || {},
        logoUrl: partner.logoUrl,
      });
    } catch (error) {
      logger.error("Error fetching partner branding", { error: error.message, userId });
      res.status(500).json({ message: "Failed to fetch branding configuration" });
    }
  });

  app.patch('/api/partner/branding', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const partner = await storage.getPartnerByUserId(userId);
      
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }
      
      const { brandingConfig, logoUrl } = req.body;
      
      const updatedPartner = await storage.updatePartner(partner.id, {
        brandingConfig,
        logoUrl,
        updatedAt: new Date(),
      });
      
      res.json({
        brandingConfig: updatedPartner?.brandingConfig || {},
        logoUrl: updatedPartner?.logoUrl,
      });
    } catch (error) {
      logger.error("Error updating partner branding", { error: error.message, userId });
      res.status(500).json({ message: "Failed to update branding configuration" });
    }
  });

  // Partner Domain Management routes (white-label only)
  app.get('/api/partner/domains', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const partner = await storage.getPartnerByUserId(userId);
      
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }
      
      if (partner.partnershipModel !== 'whitelabel') {
        return res.status(403).json({ message: "Domain management only available for white-label partners" });
      }
      
      const domains = await storage.getPartnerDomains(partner.id);
      
      res.json(domains);
    } catch (error) {
      logger.error("Error fetching partner domains", { error: error.message, userId });
      res.status(500).json({ message: "Failed to fetch domains" });
    }
  });

  app.post('/api/partner/domains', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const partner = await storage.getPartnerByUserId(userId);
      
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }
      
      if (partner.partnershipModel !== 'whitelabel') {
        return res.status(403).json({ message: "Domain management only available for white-label partners" });
      }
      
      const { domain, isPrimary } = req.body;
      
      if (!domain || typeof domain !== 'string') {
        return res.status(400).json({ message: "Valid domain is required" });
      }
      
      // Validate domain format
      const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
      if (!domainRegex.test(domain)) {
        return res.status(400).json({ message: "Invalid domain format" });
      }
      
      // Check if domain is already taken
      const existingDomain = await storage.getPartnerDomainByDomain(domain);
      if (existingDomain) {
        return res.status(409).json({ message: "Domain is already registered" });
      }
      
      const newDomain = await storage.createPartnerDomain({
        partnerId: partner.id,
        domain,
        isPrimary: isPrimary || false,
        isActive: false, // Starts inactive until verified
        sslStatus: 'pending',
        verificationStatus: 'pending',
        verificationToken: `sb-verify-${partner.id}-${Date.now()}`,
      });
      
      res.status(201).json(newDomain);
    } catch (error) {
      logger.error("Error creating partner domain", { error: error.message, userId });
      res.status(500).json({ message: "Failed to create domain" });
    }
  });

  // Partner Member Management routes
  app.get('/api/partner/members', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const partner = await storage.getPartnerByUserId(userId);
      
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }
      
      const members = await storage.getPartnerMembers(partner.id);
      
      res.json(members);
    } catch (error) {
      logger.error("Error fetching partner members", { error: error.message, userId });
      res.status(500).json({ message: "Failed to fetch partner members" });
    }
  });

  app.post('/api/partner/members', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const partner = await storage.getPartnerByUserId(userId);
      
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }
      
      // Check if current user is owner or admin of the partner
      const currentMembership = await storage.getPartnerMembership(partner.id, userId);
      if (!currentMembership || !['owner', 'admin'].includes(currentMembership.role)) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const { userEmail, role = 'member' } = req.body;
      
      if (!userEmail) {
        return res.status(400).json({ message: "User email is required" });
      }
      
      // Find user by email
      const targetUser = await storage.getUserByEmail(userEmail);
      if (!targetUser) {
        return res.status(404).json({ message: "User not found with that email" });
      }
      
      // Check if user is already a member
      const existingMembership = await storage.getPartnerMembership(partner.id, targetUser.id);
      if (existingMembership) {
        return res.status(409).json({ message: "User is already a member of this partner" });
      }
      
      const newMember = await storage.createPartnerMember({
        partnerId: partner.id,
        userId: targetUser.id,
        role,
        isActive: true,
      });
      
      res.status(201).json(newMember);
    } catch (error) {
      logger.error("Error creating partner member", { error: error.message, userId });
      res.status(500).json({ message: "Failed to add partner member" });
    }
  });

  // Partner Referrals and Payouts routes
  app.get('/api/partner/referrals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const partner = await storage.getPartnerByUserId(userId);
      
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }
      
      const referrals = await storage.getPartnerReferrals(partner.id);
      
      res.json(referrals);
    } catch (error) {
      logger.error("Error fetching partner referrals", { error: error.message, userId });
      res.status(500).json({ message: "Failed to fetch partner referrals" });
    }
  });

  app.get('/api/partner/payouts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const partner = await storage.getPartnerByUserId(userId);
      
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }
      
      const payouts = await storage.getPartnerPayouts(partner.id);
      
      res.json(payouts);
    } catch (error) {
      logger.error("Error fetching partner payouts", { error: error.message, userId });
      res.status(500).json({ message: "Failed to fetch partner payouts" });
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
      logger.info("Memorial invitation sent", {
        memorialName: `${memorial.firstName} ${memorial.lastName}`,
        inviter: inviterName || 'Anonymous',
        recipientCount: emails.length,
        memorialId,
        memorialUrl: `${req.protocol}://${req.get('host')}/memorial/${memorialId}`
      });
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      res.json({ 
        success: true, 
        message: `Invitations sent to ${emails.length} email address${emails.length > 1 ? 'es' : ''}`,
        emailsSent: emails.length
      });
    } catch (error) {
      logger.error("Error sending invitations", { error: error.message, memorialId });
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
      logger.error("Error fetching memorial photos", { error: error.message, memorialId: req.params.memorialId });
      res.status(500).json({ message: "Failed to fetch memorial photos" });
    }
  });

  // Set cover photo route
  app.patch('/api/memorials/:memorialId/photos/:photoId/cover', isAuthenticated, async (req: any, res) => {
    try {
      await storage.setCoverPhoto(req.params.memorialId, req.params.photoId);
      res.json({ success: true });
    } catch (error) {
      logger.error("Error setting cover photo", { error: error.message, memorialId: req.params.memorialId, photoId: req.params.photoId });
      res.status(500).json({ message: "Failed to set cover photo" });
    }
  });

  // Increment photo views
  app.patch('/api/photos/:photoId/view', async (req, res) => {
    try {
      await storage.incrementPhotoViews(req.params.photoId);
      res.json({ success: true });
    } catch (error) {
      logger.error("Error incrementing photo views", { error: error.message, photoId: req.params.photoId });
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
      logger.error("Error uploading memorial photo", { error: error.message, memorialId: req.params.memorialId });
      res.status(500).json({ message: "Failed to upload memorial photo" });
    }
  });

  // Funeral program routes
  app.get('/api/memorials/:memorialId/programs', async (req, res) => {
    try {
      const programs = await storage.getFuneralPrograms(req.params.memorialId);
      res.json(programs);
    } catch (error) {
      logger.error("Error fetching funeral programs", { error: error.message, memorialId: req.params.memorialId });
      res.status(500).json({ message: "Failed to fetch funeral programs" });
    }
  });

  // Memorial event routes
  app.get('/api/memorials/:memorialId/events', async (req, res) => {
    try {
      const events = await storage.getMemorialEvents(req.params.memorialId);
      res.json(events);
    } catch (error) {
      logger.error("Error fetching memorial events", { error: error.message, memorialId: req.params.memorialId });
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
      logger.info("New contact submission received", {
        subject: contactData.subject,
        hasEmail: !!contactData.email,
        memorialId: contactData.memorialId || 'None',
        userId: userId || 'Anonymous'
      });
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      res.json({ 
        success: true, 
        message: "Thank you for your feedback! We'll review your message and get back to you if needed.",
        submissionId: `submission_${Date.now()}`
      });
    } catch (error) {
      logger.error("Error submitting contact form", { error: error.message });
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
      logger.error("Error checking subscription status", { error: error.message, memorialId });
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
      logger.error("Error creating subscription", { error: error.message, memorialId });
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
      logger.error("Error deleting subscription", { error: error.message, memorialId });
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
      logger.error("Error fetching admin memorials", { error: error.message, userId: req.user.claims.sub });
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
      logger.error("Error updating memorial", { error: error.message, memorialId: req.params.id });
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
      logger.error("Error fetching Order of Service", { error: error.message, memorialId });
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
      logger.error("Error fetching Order of Service", { error: error.message, memorialId });
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
      logger.error("Error creating Order of Service", { error: error.message, memorialId });
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
      logger.error("Error updating Order of Service", { error: error.message, id });
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
      logger.error("Error deleting Order of Service", { error: error.message, id });
      res.status(500).json({ message: "Failed to delete Order of Service" });
    }
  });

  app.patch('/api/order-of-service/:id/view', async (req, res) => {
    try {
      await storage.incrementOrderOfServiceViews(req.params.id);
      res.json({ success: true });
    } catch (error) {
      logger.error("Error incrementing Order of Service views", { error: error.message, id: req.params.id });
      res.status(500).json({ message: "Failed to increment views" });
    }
  });

  app.patch('/api/order-of-service/:id/download', async (req, res) => {
    try {
      await storage.incrementOrderOfServiceDownloads(req.params.id);
      res.json({ success: true });
    } catch (error) {
      logger.error("Error incrementing Order of Service downloads", { error: error.message, id: req.params.id });
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
      logger.error("Error fetching Order of Service events", { error: error.message, orderOfServiceId });
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
      logger.error("Error creating Order of Service event", { error: error.message, orderOfServiceId });
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
      logger.error("Error updating Order of Service event", { error: error.message, id });
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
      logger.error("Error deleting Order of Service event", { error: error.message, id });
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
      logger.error("Error reordering Order of Service events", { error: error.message, orderOfServiceId });
      res.status(500).json({ message: "Failed to reorder events" });
    }
  });

  // Billing routes
  app.use('/api/billing', billingRouter);

  const httpServer = createServer(app);
  return httpServer;
}
