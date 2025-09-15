import { Router } from 'express';
import { isAuthenticated } from '../replitAuth';
import { storage } from '../storage';
import { logger } from '../utils/logger';
import { db } from '../db';
import { users, memorials, partners, subscriptions, invoices } from '@shared/schema';
import { sql, eq, desc, count, sum } from 'drizzle-orm';
import type { AuthenticatedRequest } from '../middleware/auth';

export const adminRouter = Router();

// Middleware to ensure admin access
const requireAdmin = async (req: AuthenticatedRequest, res: any, next: any) => {
  try {
    const user = await storage.getUser(req.user?.claims?.sub);
    if (user?.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  } catch (error: any) {
    logger.error("Error checking admin access", { error: error.message });
    res.status(500).json({ message: "Failed to verify admin access" });
  }
};

// Dashboard statistics endpoint
adminRouter.get('/stats', isAuthenticated, requireAdmin, async (req, res) => {
  try {
    const [
      totalMemorialsResult,
      totalUsersResult,
      totalPartnersResult,
      pendingMemorialsResult,
      pendingPartnersResult,
      totalRevenueResult,
      monthlyRevenueResult,
      totalSubscriptionsResult
    ] = await Promise.all([
      // Total memorials
      db.select({ count: count() }).from(memorials),
      
      // Total users
      db.select({ count: count() }).from(users),
      
      // Total partners
      db.select({ count: count() }).from(partners),
      
      // Pending memorials
      db.select({ count: count() }).from(memorials).where(eq(memorials.status, 'draft')),
      
      // Pending partners
      db.select({ count: count() }).from(partners).where(eq(partners.status, 'pending')),
      
      // Total revenue
      db.select({ total: sum(invoices.amount) }).from(invoices).where(eq(invoices.status, 'paid')),
      
      // Monthly revenue (current month)
      db.select({ total: sum(invoices.amount) })
        .from(invoices)
        .where(sql`${invoices.status} = 'paid' AND ${invoices.paidAt} >= date_trunc('month', current_date)`),
      
      // Total active subscriptions
      db.select({ count: count() }).from(subscriptions).where(eq(subscriptions.status, 'active'))
    ]);

    const stats = {
      totalMemorials: totalMemorialsResult[0]?.count || 0,
      totalUsers: totalUsersResult[0]?.count || 0,
      totalPartners: totalPartnersResult[0]?.count || 0,
      pendingMemorials: pendingMemorialsResult[0]?.count || 0,
      pendingPartners: pendingPartnersResult[0]?.count || 0,
      totalRevenue: parseInt(totalRevenueResult[0]?.total as string || '0'),
      monthlyRevenue: parseInt(monthlyRevenueResult[0]?.total as string || '0'),
      totalSubscriptions: totalSubscriptionsResult[0]?.count || 0,
    };

    res.json(stats);
  } catch (error: any) {
    logger.error("Error fetching admin stats", { error: error.message });
    res.status(500).json({ message: "Failed to fetch dashboard statistics" });
  }
});

// Get all users
adminRouter.get('/users', isAuthenticated, requireAdmin, async (req, res) => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        subscriptionTier: users.subscriptionTier,
        subscriptionStatus: users.subscriptionStatus,
        createdAt: users.createdAt,
        lastLoginAt: users.lastLoginAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));

    res.json(allUsers);
  } catch (error: any) {
    logger.error("Error fetching users", { error: error.message });
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Get all memorials for admin
adminRouter.get('/memorials', isAuthenticated, requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const memorialsList = await storage.getMemorials({
      status: status as string || undefined,
    });

    res.json(memorialsList);
  } catch (error: any) {
    logger.error("Error fetching admin memorials", { error: error.message });
    res.status(500).json({ message: "Failed to fetch memorials" });
  }
});

// Update memorial status
adminRouter.patch('/memorials/:id', isAuthenticated, requireAdmin, async (req, res) => {
  try {
    const memorial = await storage.updateMemorial(req.params.id, req.body);
    res.json(memorial);
  } catch (error: any) {
    logger.error("Error updating memorial", { error: error.message, memorialId: req.params.id });
    res.status(500).json({ message: "Failed to update memorial" });
  }
});

// Get all partners for admin
adminRouter.get('/partners', isAuthenticated, requireAdmin, async (req, res) => {
  try {
    const partnersList = await db
      .select({
        id: partners.id,
        name: partners.name,
        email: partners.email,
        status: partners.status,
        type: partners.type,
        partnershipModel: partners.partnershipModel,
        createdAt: partners.createdAt,
        totalReferrals: sql<number>`0`.as('totalReferrals'),
        totalEarnings: sql<number>`0`.as('totalEarnings'),
      })
      .from(partners)
      .orderBy(desc(partners.createdAt));

    res.json(partnersList);
  } catch (error: any) {
    logger.error("Error fetching partners", { error: error.message });
    res.status(500).json({ message: "Failed to fetch partners" });
  }
});

// Update partner status
adminRouter.patch('/partners/:id', isAuthenticated, requireAdmin, async (req, res) => {
  try {
    const partnerId = req.params.id;
    const updateData = req.body;
    
    // Prevent updating certain fields
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.userId;
    
    const updatedPartner = await storage.updatePartner(partnerId, {
      ...updateData,
      updatedAt: new Date(),
    });
    
    if (!updatedPartner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    
    res.json(updatedPartner);
  } catch (error: any) {
    logger.error("Error updating partner", { error: error.message, partnerId: req.params.id });
    res.status(500).json({ message: "Failed to update partner" });
  }
});

// Update user role/status
adminRouter.patch('/users/:id', isAuthenticated, requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;
    
    // Prevent updating certain sensitive fields
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.email; // Email changes should be handled separately
    
    await db
      .update(users)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
    
    const updatedUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
      .then(rows => rows[0]);
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(updatedUser);
  } catch (error: any) {
    logger.error("Error updating user", { error: error.message, userId: req.params.id });
    res.status(500).json({ message: "Failed to update user" });
  }
});

// Get system logs (for monitoring)
adminRouter.get('/logs', isAuthenticated, requireAdmin, async (req, res) => {
  try {
    // This would integrate with your logging system
    // For now, return a mock response
    const logs = [
      {
        id: '1',
        level: 'info',
        message: 'User created memorial',
        timestamp: new Date().toISOString(),
        metadata: { userId: 'user123', memorialId: 'memorial456' }
      },
      {
        id: '2',
        level: 'error',
        message: 'Payment processing failed',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        metadata: { paymentId: 'pay123', error: 'Network timeout' }
      }
    ];
    
    res.json(logs);
  } catch (error: any) {
    logger.error("Error fetching system logs", { error: error.message });
    res.status(500).json({ message: "Failed to fetch system logs" });
  }
});

// Bulk operations
adminRouter.post('/bulk/approve-memorials', isAuthenticated, requireAdmin, async (req, res) => {
  try {
    const { memorialIds } = req.body;
    
    if (!Array.isArray(memorialIds) || memorialIds.length === 0) {
      return res.status(400).json({ message: "Memorial IDs array is required" });
    }
    
    // Update multiple memorials to published status
    const updates = await Promise.all(
      memorialIds.map(id => storage.updateMemorial(id, { status: 'published' }))
    );
    
    res.json({
      success: true,
      message: `${updates.length} memorials approved`,
      updated: updates.length
    });
  } catch (error: any) {
    logger.error("Error bulk approving memorials", { error: error.message });
    res.status(500).json({ message: "Failed to bulk approve memorials" });
  }
});

// System settings
adminRouter.get('/settings', isAuthenticated, requireAdmin, async (req, res) => {
  try {
    // Return system configuration
    const settings = {
      siteName: 'SoulBridge',
      maintenanceMode: false,
      registrationEnabled: true,
      memorialApprovalRequired: true,
      partnerApprovalRequired: true,
      maxFileUploadSize: '10MB',
      supportedFileTypes: ['jpg', 'jpeg', 'png', 'webp'],
      emailNotificationsEnabled: true,
      backupFrequency: 'daily',
    };
    
    res.json(settings);
  } catch (error: any) {
    logger.error("Error fetching system settings", { error: error.message });
    res.status(500).json({ message: "Failed to fetch system settings" });
  }
});

// Update system settings
adminRouter.patch('/settings', isAuthenticated, requireAdmin, async (req, res) => {
  try {
    const settings = req.body;
    
    // In a real implementation, you'd save these to a database or configuration file
    // For now, just return the updated settings
    logger.info("System settings updated", { settings, updatedBy: req.user?.claims?.sub });
    
    res.json({
      success: true,
      message: "System settings updated successfully",
      settings
    });
  } catch (error: any) {
    logger.error("Error updating system settings", { error: error.message });
    res.status(500).json({ message: "Failed to update system settings" });
  }
});

export default adminRouter;