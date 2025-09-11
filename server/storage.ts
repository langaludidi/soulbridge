import {
  users,
  memorials,
  tributes,
  partners,
  partnerDomains,
  partnerLeads,
  partnerMembers,
  memorialPhotos,
  funeralPrograms,
  memorialEvents,
  memorialSubscriptions,
  digitalOrderOfService,
  orderOfServiceEvents,
  type User,
  type UpsertUser,
  type Memorial,
  type InsertMemorial,
  type Tribute,
  type InsertTribute,
  type Partner,
  type InsertPartner,
  type PartnerDomain,
  type InsertPartnerDomain,
  type PartnerLead,
  type InsertPartnerLead,
  type PartnerMember,
  type InsertPartnerMember,
  type MemorialPhoto,
  type InsertMemorialPhoto,
  type FuneralProgram,
  type InsertFuneralProgram,
  type MemorialEvent,
  type InsertMemorialEvent,
  type MemorialSubscription,
  type InsertMemorialSubscription,
  type DigitalOrderOfService,
  type InsertDigitalOrderOfService,
  type OrderOfServiceEvent,
  type InsertOrderOfServiceEvent,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, and, or, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Memorial operations
  getMemorials(filters?: { province?: string; status?: string }): Promise<Memorial[]>;
  getMemorialsByUser(userId: string): Promise<Memorial[]>;
  getMemorial(id: string): Promise<Memorial | undefined>;
  getMemorialWithAdmin(id: string): Promise<(Memorial & { administratorName?: string }) | undefined>;
  createMemorial(memorial: InsertMemorial): Promise<Memorial>;
  updateMemorial(id: string, memorial: Partial<Memorial>): Promise<Memorial | undefined>;
  incrementMemorialViews(id: string): Promise<void>;
  getTotalTributesByUser(userId: string): Promise<number>;
  
  // Tribute operations
  getTributesByMemorial(memorialId: string): Promise<Tribute[]>;
  createTribute(tribute: InsertTribute): Promise<Tribute>;
  updateTribute(id: string, tribute: Partial<Tribute>): Promise<Tribute | undefined>;
  
  // Partner operations
  getPartners(filters?: { province?: string; type?: string; status?: string }): Promise<Partner[]>;
  getPartner(id: string): Promise<Partner | undefined>;
  getPartnerBySlug(slug: string): Promise<Partner | undefined>;
  getPartnerByUserId(userId: string): Promise<Partner | undefined>;
  getPartnerDomainByDomain(domain: string): Promise<PartnerDomain | undefined>;
  createPartner(partner: InsertPartner): Promise<Partner>;
  updatePartner(id: string, partner: Partial<Partner>): Promise<Partner | undefined>;
  getPartnerDashboardData(partnerId: string): Promise<any>;

  // Partner Lead operations
  getPartnerLeadByEmail(email: string): Promise<PartnerLead | undefined>;
  createPartnerLead(lead: InsertPartnerLead): Promise<PartnerLead>;
  getPartnerLeads(filters?: { status?: string; partnershipModel?: string; serviceType?: string }): Promise<PartnerLead[]>;
  updatePartnerLead(id: string, updateData: Partial<PartnerLead>): Promise<PartnerLead | undefined>;

  // Partner Domain operations
  getPartnerDomains(partnerId: string): Promise<PartnerDomain[]>;
  createPartnerDomain(domain: InsertPartnerDomain): Promise<PartnerDomain>;

  // Partner Member operations
  getPartnerMembers(partnerId: string): Promise<PartnerMember[]>;
  createPartnerMember(member: InsertPartnerMember): Promise<PartnerMember>;
  getPartnerMembership(partnerId: string, userId: string): Promise<PartnerMember | undefined>;

  // Additional User operations
  getUserByEmail(email: string): Promise<User | undefined>;

  // Partner Referrals and Payouts (placeholder)
  getPartnerReferrals(partnerId: string): Promise<any[]>;
  getPartnerPayouts(partnerId: string): Promise<any[]>;
  
  // Memorial photo operations
  getMemorialPhotos(memorialId: string, mediaType?: string): Promise<MemorialPhoto[]>;
  createMemorialPhoto(photo: InsertMemorialPhoto): Promise<MemorialPhoto>;
  setCoverPhoto(memorialId: string, photoId: string): Promise<void>;
  incrementPhotoViews(photoId: string): Promise<void>;
  
  // Funeral program operations
  getFuneralPrograms(memorialId: string): Promise<FuneralProgram[]>;
  createFuneralProgram(program: InsertFuneralProgram): Promise<FuneralProgram>;
  incrementProgramDownloads(id: string): Promise<void>;
  
  // Memorial event operations
  getMemorialEvents(memorialId: string): Promise<MemorialEvent[]>;
  createMemorialEvent(event: InsertMemorialEvent): Promise<MemorialEvent>;
  
  // Memorial subscription operations
  getMemorialSubscription(memorialId: string, userId?: string, email?: string): Promise<MemorialSubscription | undefined>;
  createMemorialSubscription(subscription: InsertMemorialSubscription): Promise<MemorialSubscription>;
  updateMemorialSubscription(id: string, subscription: Partial<MemorialSubscription>): Promise<MemorialSubscription | undefined>;
  deleteMemorialSubscription(id: string): Promise<void>;

  // Digital Order of Service operations
  getOrderOfServiceByMemorial(memorialId: string): Promise<DigitalOrderOfService | undefined>;
  getOrderOfService(id: string): Promise<DigitalOrderOfService | undefined>;
  createOrderOfService(orderOfService: InsertDigitalOrderOfService): Promise<DigitalOrderOfService>;
  updateOrderOfService(id: string, orderOfService: Partial<DigitalOrderOfService>): Promise<DigitalOrderOfService | undefined>;
  deleteOrderOfService(id: string): Promise<void>;
  incrementOrderOfServiceViews(id: string): Promise<void>;
  incrementOrderOfServiceDownloads(id: string): Promise<void>;

  // Order of Service Events operations
  getOrderOfServiceEvents(orderOfServiceId: string): Promise<OrderOfServiceEvent[]>;
  createOrderOfServiceEvent(event: InsertOrderOfServiceEvent): Promise<OrderOfServiceEvent>;
  updateOrderOfServiceEvent(id: string, event: Partial<OrderOfServiceEvent>): Promise<OrderOfServiceEvent | undefined>;
  deleteOrderOfServiceEvent(id: string): Promise<void>;
  reorderServiceEvents(orderOfServiceId: string, eventIds: string[]): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Memorial operations
  async getMemorials(filters?: { province?: string; status?: string }): Promise<Memorial[]> {
    const conditions = [];
    if (filters?.province) {
      conditions.push(eq(memorials.province, filters.province));
    }
    if (filters?.status !== undefined) {
      if (filters.status === null) {
        // Special case: null means authenticated user wants both published and draft
        conditions.push(or(eq(memorials.status, "published"), eq(memorials.status, "draft")));
      } else {
        conditions.push(eq(memorials.status, filters.status));
      }
    } else {
      // Default safe behavior: published only for public access
      conditions.push(eq(memorials.status, "published"));
    }
    
    const query = conditions.length > 0 
      ? db.select().from(memorials).where(and(...conditions))
      : db.select().from(memorials);
    
    return await query.orderBy(desc(memorials.createdAt));
  }

  async getMemorialsByUser(userId: string): Promise<Memorial[]> {
    return await db
      .select()
      .from(memorials)
      .where(eq(memorials.submittedBy, userId))
      .orderBy(desc(memorials.createdAt));
  }

  async getTotalTributesByUser(userId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(tributes)
      .innerJoin(memorials, eq(tributes.memorialId, memorials.id))
      .where(and(
        eq(memorials.submittedBy, userId),
        eq(tributes.status, "published")
      ));
    
    return result[0]?.count || 0;
  }

  async getMemorial(id: string): Promise<Memorial | undefined> {
    const [memorial] = await db.select().from(memorials).where(eq(memorials.id, id));
    return memorial;
  }

  // Enhanced memorial data with administrator information
  async getMemorialWithAdmin(id: string): Promise<(Memorial & { administratorName?: string }) | undefined> {
    const result = await db
      .select({
        // All memorial fields
        id: memorials.id,
        firstName: memorials.firstName,
        middleName: memorials.middleName,
        lastName: memorials.lastName,
        dateOfBirth: memorials.dateOfBirth,
        dateOfPassing: memorials.dateOfPassing,
        dateOfFuneral: memorials.dateOfFuneral,
        funeralAddress: memorials.funeralAddress,
        province: memorials.province,
        profilePhotoUrl: memorials.profilePhotoUrl,
        memorialMessage: memorials.memorialMessage,
        status: memorials.status,
        privacy: memorials.privacy,
        submittedBy: memorials.submittedBy,
        familyId: memorials.familyId,
        partnerId: memorials.partnerId,
        viewCount: memorials.viewCount,
        createdAt: memorials.createdAt,
        updatedAt: memorials.updatedAt,
        // Administrator name from joined user data
        administratorName: sql<string>`${users.firstName} || ' ' || ${users.lastName}`.as('administrator_name'),
      })
      .from(memorials)
      .leftJoin(users, eq(memorials.submittedBy, users.id))
      .where(eq(memorials.id, id))
      .limit(1);

    return result[0] || undefined;
  }

  async createMemorial(memorial: InsertMemorial): Promise<Memorial> {
    const [created] = await db.insert(memorials).values(memorial).returning();
    return created;
  }

  async updateMemorial(id: string, memorial: Partial<Memorial>): Promise<Memorial | undefined> {
    const [updated] = await db
      .update(memorials)
      .set({ ...memorial, updatedAt: new Date() })
      .where(eq(memorials.id, id))
      .returning();
    return updated;
  }

  async incrementMemorialViews(id: string): Promise<void> {
    await db
      .update(memorials)
      .set({ viewCount: sql`${memorials.viewCount} + 1` })
      .where(eq(memorials.id, id));
  }

  // Tribute operations
  async getTributesByMemorial(memorialId: string): Promise<Tribute[]> {
    return await db
      .select()
      .from(tributes)
      .where(and(eq(tributes.memorialId, memorialId), eq(tributes.status, "published")))
      .orderBy(desc(tributes.createdAt));
  }

  async createTribute(tribute: InsertTribute): Promise<Tribute> {
    const [created] = await db.insert(tributes).values(tribute).returning();
    return created;
  }

  async updateTribute(id: string, tribute: Partial<Tribute>): Promise<Tribute | undefined> {
    const [updated] = await db
      .update(tributes)
      .set(tribute)
      .where(eq(tributes.id, id))
      .returning();
    return updated;
  }

  // Partner operations
  async getPartners(filters?: { province?: string; type?: string; status?: string }): Promise<Partner[]> {
    const conditions = [];
    if (filters?.province) {
      conditions.push(eq(partners.province, filters.province));
    }
    if (filters?.type) {
      conditions.push(eq(partners.type, filters.type));
    }
    if (filters?.status) {
      conditions.push(eq(partners.status, filters.status));
    } else {
      conditions.push(eq(partners.status, "published"));
    }
    
    const query = conditions.length > 0 
      ? db.select().from(partners).where(and(...conditions))
      : db.select().from(partners);
    
    return await query.orderBy(partners.name);
  }

  async getPartner(id: string): Promise<Partner | undefined> {
    const [partner] = await db.select().from(partners).where(eq(partners.id, id));
    return partner;
  }

  async createPartner(partner: InsertPartner): Promise<Partner> {
    const [created] = await db.insert(partners).values(partner).returning();
    return created;
  }

  async updatePartner(id: string, partner: Partial<Partner>): Promise<Partner | undefined> {
    const [updated] = await db
      .update(partners)
      .set({ ...partner, updatedAt: new Date() })
      .where(eq(partners.id, id))
      .returning();
    return updated;
  }

  async getPartnerBySlug(slug: string): Promise<Partner | undefined> {
    // For now, we'll use name as slug until we add a proper slug field
    const [partner] = await db.select().from(partners).where(
      and(
        or(
          eq(partners.name, slug),
          like(partners.name, `%${slug}%`)
        ),
        eq(partners.status, "published")
      )
    );
    return partner;
  }

  async getPartnerDomainByDomain(domain: string): Promise<PartnerDomain | undefined> {
    const [partnerDomain] = await db.select().from(partnerDomains).where(
      and(
        eq(partnerDomains.domain, domain),
        eq(partnerDomains.isActive, true)
      )
    );
    return partnerDomain;
  }

  async getPartnerByUserId(userId: string): Promise<Partner | undefined> {
    const [partner] = await db.select().from(partners).where(eq(partners.submittedBy, userId));
    return partner;
  }

  async getPartnerDashboardData(partnerId: string): Promise<any> {
    // Get memorial count and stats for the partner
    const memorialResults = await db
      .select({
        totalMemorials: sql<number>`count(*)`,
        activeMemorials: sql<number>`count(*) filter (where ${memorials.status} = 'published')`,
      })
      .from(memorials)
      .where(eq(memorials.partnerId, partnerId));

    const memorialStats = memorialResults[0] || { totalMemorials: 0, activeMemorials: 0 };

    // Mock data for other dashboard metrics (would be real calculations in production)
    return {
      ...memorialStats,
      monthlyViews: 1247,
      monthlyRevenue: 15600, // in cents
      pendingPayouts: 31200, // in cents
      referralConversions: 3,
    };
  }

  // Partner Lead operations
  async getPartnerLeadByEmail(email: string): Promise<PartnerLead | undefined> {
    const [lead] = await db.select().from(partnerLeads).where(eq(partnerLeads.email, email));
    return lead;
  }

  async createPartnerLead(lead: InsertPartnerLead): Promise<PartnerLead> {
    const [created] = await db.insert(partnerLeads).values(lead).returning();
    return created;
  }

  async getPartnerLeads(filters?: { status?: string; partnershipModel?: string; serviceType?: string }): Promise<PartnerLead[]> {
    const conditions = [];
    if (filters?.status) {
      conditions.push(eq(partnerLeads.status, filters.status));
    }
    if (filters?.partnershipModel) {
      conditions.push(eq(partnerLeads.partnershipModel, filters.partnershipModel));
    }
    if (filters?.serviceType) {
      conditions.push(eq(partnerLeads.serviceType, filters.serviceType));
    }

    const query = conditions.length > 0 
      ? db.select().from(partnerLeads).where(and(...conditions))
      : db.select().from(partnerLeads);

    return await query.orderBy(desc(partnerLeads.createdAt));
  }

  async updatePartnerLead(id: string, updateData: Partial<PartnerLead>): Promise<PartnerLead | undefined> {
    const [updated] = await db
      .update(partnerLeads)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(partnerLeads.id, id))
      .returning();
    return updated;
  }

  // Partner Domain operations
  async getPartnerDomains(partnerId: string): Promise<PartnerDomain[]> {
    return await db
      .select()
      .from(partnerDomains)
      .where(eq(partnerDomains.partnerId, partnerId))
      .orderBy(desc(partnerDomains.createdAt));
  }

  async createPartnerDomain(domain: InsertPartnerDomain): Promise<PartnerDomain> {
    const [created] = await db.insert(partnerDomains).values(domain).returning();
    return created;
  }

  // Partner Member operations
  async getPartnerMembers(partnerId: string): Promise<PartnerMember[]> {
    return await db
      .select()
      .from(partnerMembers)
      .where(eq(partnerMembers.partnerId, partnerId))
      .orderBy(desc(partnerMembers.createdAt));
  }

  async createPartnerMember(member: InsertPartnerMember): Promise<PartnerMember> {
    const [created] = await db.insert(partnerMembers).values(member).returning();
    return created;
  }

  async getPartnerMembership(partnerId: string, userId: string): Promise<PartnerMember | undefined> {
    const [membership] = await db
      .select()
      .from(partnerMembers)
      .where(
        and(
          eq(partnerMembers.partnerId, partnerId),
          eq(partnerMembers.userId, userId),
          eq(partnerMembers.isActive, true)
        )
      );
    return membership;
  }

  // Additional User operations
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  // Partner Referrals and Payouts (mock implementations)
  async getPartnerReferrals(partnerId: string): Promise<any[]> {
    // In a real implementation, this would query referral tracking data
    return [
      {
        id: "ref-1",
        partnerId,
        memorialId: "memorial-123",
        memorialName: "Sarah Mthembu",
        dateReferred: "2024-02-15",
        status: "converted",
        commission: 50000, // R500 in cents
      },
      {
        id: "ref-2",
        partnerId,
        memorialId: "memorial-124",
        memorialName: "John Sibiya",
        dateReferred: "2024-02-10",
        status: "converted",
        commission: 50000, // R500 in cents
      },
      {
        id: "ref-3",
        partnerId,
        memorialId: "memorial-125",
        memorialName: "Grace Mogale",
        dateReferred: "2024-02-08",
        status: "pending",
        commission: 0,
      },
    ];
  }

  async getPartnerPayouts(partnerId: string): Promise<any[]> {
    // In a real implementation, this would query payout history data
    return [
      {
        id: "payout-1",
        partnerId,
        type: "revenue_share",
        amount: 28500, // R285 in cents
        status: "paid",
        paidAt: "2024-01-31",
        description: "January 2024 revenue share",
      },
      {
        id: "payout-2",
        partnerId,
        type: "referral_commission",
        amount: 150000, // R1500 in cents  
        status: "paid",
        paidAt: "2024-01-31",
        description: "Referral commissions for January 2024",
      },
      {
        id: "payout-3",
        partnerId,
        type: "revenue_share",
        amount: 31200, // R312 in cents
        status: "pending",
        paidAt: null,
        description: "February 2024 revenue share",
      },
    ];
  }

  // Memorial photo operations
  async getMemorialPhotos(memorialId: string, mediaType?: string): Promise<MemorialPhoto[]> {
    const conditions = [eq(memorialPhotos.memorialId, memorialId)];
    if (mediaType) {
      conditions.push(eq(memorialPhotos.mediaType, mediaType));
    }
    
    return await db
      .select()
      .from(memorialPhotos)
      .where(and(...conditions))
      .orderBy(desc(memorialPhotos.isCoverPhoto), desc(memorialPhotos.createdAt));
  }

  async setCoverPhoto(memorialId: string, photoId: string): Promise<void> {
    // First, remove cover photo status from all photos for this memorial
    await db
      .update(memorialPhotos)
      .set({ isCoverPhoto: false })
      .where(eq(memorialPhotos.memorialId, memorialId));
    
    // Then set the new cover photo
    await db
      .update(memorialPhotos)
      .set({ isCoverPhoto: true })
      .where(eq(memorialPhotos.id, photoId));
  }

  async incrementPhotoViews(photoId: string): Promise<void> {
    await db
      .update(memorialPhotos)
      .set({ viewCount: sql`${memorialPhotos.viewCount} + 1` })
      .where(eq(memorialPhotos.id, photoId));
  }

  async createMemorialPhoto(photo: InsertMemorialPhoto): Promise<MemorialPhoto> {
    const [created] = await db.insert(memorialPhotos).values(photo).returning();
    return created;
  }

  // Funeral program operations
  async getFuneralPrograms(memorialId: string): Promise<FuneralProgram[]> {
    return await db
      .select()
      .from(funeralPrograms)
      .where(eq(funeralPrograms.memorialId, memorialId))
      .orderBy(desc(funeralPrograms.createdAt));
  }

  async createFuneralProgram(program: InsertFuneralProgram): Promise<FuneralProgram> {
    const [created] = await db.insert(funeralPrograms).values(program).returning();
    return created;
  }

  async incrementProgramDownloads(id: string): Promise<void> {
    await db
      .update(funeralPrograms)
      .set({ downloadCount: sql`${funeralPrograms.downloadCount} + 1` })
      .where(eq(funeralPrograms.id, id));
  }

  // Memorial event operations
  async getMemorialEvents(memorialId: string): Promise<MemorialEvent[]> {
    return await db
      .select()
      .from(memorialEvents)
      .where(and(eq(memorialEvents.memorialId, memorialId), eq(memorialEvents.status, "published")))
      .orderBy(memorialEvents.eventDate);
  }

  async createMemorialEvent(event: InsertMemorialEvent): Promise<MemorialEvent> {
    const [created] = await db.insert(memorialEvents).values(event).returning();
    return created;
  }

  // Memorial subscription operations
  async getMemorialSubscription(memorialId: string, userId?: string, email?: string): Promise<MemorialSubscription | undefined> {
    const conditions = [eq(memorialSubscriptions.memorialId, memorialId), eq(memorialSubscriptions.isActive, true)];
    
    if (userId) {
      conditions.push(eq(memorialSubscriptions.userId, userId));
    } else if (email) {
      conditions.push(eq(memorialSubscriptions.email, email));
    } else {
      return undefined; // Must have either userId or email
    }

    const [subscription] = await db
      .select()
      .from(memorialSubscriptions)
      .where(and(...conditions))
      .limit(1);
    
    return subscription;
  }

  async createMemorialSubscription(subscription: InsertMemorialSubscription): Promise<MemorialSubscription> {
    const [created] = await db.insert(memorialSubscriptions).values(subscription).returning();
    return created;
  }

  async updateMemorialSubscription(id: string, subscription: Partial<MemorialSubscription>): Promise<MemorialSubscription | undefined> {
    const [updated] = await db
      .update(memorialSubscriptions)
      .set({ ...subscription, updatedAt: new Date() })
      .where(eq(memorialSubscriptions.id, id))
      .returning();
    return updated;
  }

  async deleteMemorialSubscription(id: string): Promise<void> {
    await db
      .update(memorialSubscriptions)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(memorialSubscriptions.id, id));
  }

  // Digital Order of Service operations
  async getOrderOfServiceByMemorial(memorialId: string): Promise<DigitalOrderOfService | undefined> {
    const [orderOfService] = await db
      .select()
      .from(digitalOrderOfService)
      .where(eq(digitalOrderOfService.memorialId, memorialId))
      .limit(1);
    return orderOfService;
  }

  async getOrderOfService(id: string): Promise<DigitalOrderOfService | undefined> {
    const [orderOfService] = await db
      .select()
      .from(digitalOrderOfService)
      .where(eq(digitalOrderOfService.id, id));
    return orderOfService;
  }

  async createOrderOfService(orderOfServiceData: InsertDigitalOrderOfService): Promise<DigitalOrderOfService> {
    const [created] = await db.insert(digitalOrderOfService).values(orderOfServiceData).returning();
    return created;
  }

  async updateOrderOfService(id: string, orderOfServiceData: Partial<DigitalOrderOfService>): Promise<DigitalOrderOfService | undefined> {
    const [updated] = await db
      .update(digitalOrderOfService)
      .set({ ...orderOfServiceData, updatedAt: new Date() })
      .where(eq(digitalOrderOfService.id, id))
      .returning();
    return updated;
  }

  async deleteOrderOfService(id: string): Promise<void> {
    // First delete all associated events
    await db.delete(orderOfServiceEvents).where(eq(orderOfServiceEvents.orderOfServiceId, id));
    // Then delete the order of service
    await db.delete(digitalOrderOfService).where(eq(digitalOrderOfService.id, id));
  }

  async incrementOrderOfServiceViews(id: string): Promise<void> {
    await db
      .update(digitalOrderOfService)
      .set({
        viewCount: sql`${digitalOrderOfService.viewCount} + 1`,
      })
      .where(eq(digitalOrderOfService.id, id));
  }

  async incrementOrderOfServiceDownloads(id: string): Promise<void> {
    await db
      .update(digitalOrderOfService)
      .set({
        downloadCount: sql`${digitalOrderOfService.downloadCount} + 1`,
      })
      .where(eq(digitalOrderOfService.id, id));
  }

  // Order of Service Events operations
  async getOrderOfServiceEvents(orderOfServiceId: string): Promise<OrderOfServiceEvent[]> {
    return await db
      .select()
      .from(orderOfServiceEvents)
      .where(eq(orderOfServiceEvents.orderOfServiceId, orderOfServiceId))
      .orderBy(orderOfServiceEvents.orderIndex);
  }

  async createOrderOfServiceEvent(event: InsertOrderOfServiceEvent): Promise<OrderOfServiceEvent> {
    const [created] = await db.insert(orderOfServiceEvents).values(event).returning();
    return created;
  }

  async updateOrderOfServiceEvent(id: string, event: Partial<OrderOfServiceEvent>): Promise<OrderOfServiceEvent | undefined> {
    const [updated] = await db
      .update(orderOfServiceEvents)
      .set(event)
      .where(eq(orderOfServiceEvents.id, id))
      .returning();
    return updated;
  }

  async deleteOrderOfServiceEvent(id: string): Promise<void> {
    await db.delete(orderOfServiceEvents).where(eq(orderOfServiceEvents.id, id));
  }

  async reorderServiceEvents(orderOfServiceId: string, eventIds: string[]): Promise<void> {
    // Update the orderIndex for each event based on its position in the array
    for (let i = 0; i < eventIds.length; i++) {
      await db
        .update(orderOfServiceEvents)
        .set({ orderIndex: i })
        .where(and(
          eq(orderOfServiceEvents.id, eventIds[i]),
          eq(orderOfServiceEvents.orderOfServiceId, orderOfServiceId)
        ));
    }
  }
}

// In-memory storage implementation (preferred for development)
export class MemStorage implements IStorage {
  private users = new Map<string, User>();
  private memorials = new Map<string, Memorial>();
  private tributes = new Map<string, Tribute>();
  private partners = new Map<string, Partner>();
  private partnerDomains = new Map<string, PartnerDomain>();
  private partnerLeads = new Map<string, PartnerLead>();
  private partnerMembers = new Map<string, PartnerMember>();
  private memorialPhotos = new Map<string, MemorialPhoto>();
  private funeralPrograms = new Map<string, FuneralProgram>();
  private memorialEvents = new Map<string, MemorialEvent>();
  private memorialSubscriptions = new Map<string, MemorialSubscription>();
  private digitalOrderOfService = new Map<string, DigitalOrderOfService>();
  private orderOfServiceEvents = new Map<string, OrderOfServiceEvent>();

  constructor() {
    // Initialize with sample data for testing
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample memorial for testing
    const testMemorial: Memorial = {
      id: "test-id",
      firstName: "John",
      middleName: "William",
      lastName: "Mthembu",
      dateOfBirth: new Date("1955-03-15"),
      dateOfPassing: new Date("2023-08-20"),
      dateOfFuneral: new Date("2023-08-27"),
      funeralAddress: "St. Mary's Church, 123 Church Street, Pietermaritzburg, KwaZulu-Natal",
      province: "KwaZulu-Natal",
      status: "published",
      privacy: "public",
      memorialMessage: "A loving father and devoted husband who touched many lives with his kindness and wisdom. His legacy lives on in the hearts of all who knew him.",
      profilePhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=300&h=400&fit=crop&crop=face",
      familyId: null,
      partnerId: null,
      viewCount: 245,
      createdAt: new Date("2023-08-25T10:00:00Z"),
      updatedAt: new Date("2023-08-25T10:00:00Z"),
      submittedBy: "test-user-id"
    };
    this.memorials.set(testMemorial.id, testMemorial);

    // Sample tributes for testing  
    const testTributes: Tribute[] = [
      {
        id: "tribute-1",
        memorialId: "test-id",
        authorName: "Sarah Johnson",
        relationship: "Friend",
        message: "John was such a wonderful person. His warm smile and generous heart made everyone feel welcome. He will be deeply missed.",
        status: "published",
        createdAt: new Date("2023-08-26T14:30:00Z"),
        submittedBy: null
      },
      {
        id: "tribute-2", 
        memorialId: "test-id",
        authorName: "Michael Williams",
        relationship: "Colleague",
        message: "Working with John was a privilege. His dedication and mentorship helped shape many careers. A true professional and friend.",
        status: "published",
        createdAt: new Date("2023-08-27T09:15:00Z"),
        submittedBy: null
      }
    ];
    testTributes.forEach(tribute => this.tributes.set(tribute.id, tribute));

    // Sample photos for testing
    const testPhotos: MemorialPhoto[] = [
      {
        id: "photo-1",
        memorialId: "test-id",
        photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=300&h=300&fit=crop",
        caption: "Family gathering 2020",
        mediaType: "photo",
        isCoverPhoto: true,
        viewCount: 45,
        uploaderName: "Sarah Johnson",
        createdAt: new Date("2023-08-25T12:00:00Z"),
        uploadedBy: "test-user-id"
      },
      {
        id: "photo-2",
        memorialId: "test-id", 
        photoUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&w=300&h=300&fit=crop",
        caption: "Happy times",
        mediaType: "photo",
        isCoverPhoto: false,
        viewCount: 23,
        uploaderName: "Michael Williams",
        createdAt: new Date("2023-08-25T12:30:00Z"),
        uploadedBy: "test-user-id"
      },
      {
        id: "photo-3",
        memorialId: "test-id", 
        photoUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&w=300&h=300&fit=crop",
        caption: "Birthday celebration 2021",
        mediaType: "photo",
        isCoverPhoto: false,
        viewCount: 18,
        uploaderName: "Family Friend",
        createdAt: new Date("2023-08-26T14:15:00Z"),
        uploadedBy: "test-user-id"
      },
      {
        id: "video-1",
        memorialId: "test-id", 
        photoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        caption: "Birthday speech 2022",
        mediaType: "video",
        isCoverPhoto: false,
        viewCount: 67,
        uploaderName: "Family",
        createdAt: new Date("2023-08-27T09:45:00Z"),
        uploadedBy: "test-user-id"
      }
    ];
    testPhotos.forEach(photo => this.memorialPhotos.set(photo.id, photo));
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      id: userData.id || `user-${Date.now()}`,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      role: userData.role || "public",
      subscriptionTier: userData.subscriptionTier || null,
      subscriptionStatus: userData.subscriptionStatus || null,
      acquisitionPartnerId: userData.acquisitionPartnerId || null,
      acquisitionReferralCode: userData.acquisitionReferralCode || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(user.id, user);
    return user;
  }

  // Memorial operations
  async getMemorials(filters?: { province?: string; status?: string }): Promise<Memorial[]> {
    let result = Array.from(this.memorials.values());
    
    if (filters?.province) {
      result = result.filter(m => m.province === filters.province);
    }
    if (filters?.status) {
      result = result.filter(m => m.status === filters.status);
    } else {
      result = result.filter(m => m.status === "published");
    }
    
    return result.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getMemorialsByUser(userId: string): Promise<Memorial[]> {
    return Array.from(this.memorials.values())
      .filter(m => m.submittedBy === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getTotalTributesByUser(userId: string): Promise<number> {
    const userMemorials = Array.from(this.memorials.values())
      .filter(m => m.submittedBy === userId);
    
    let totalTributes = 0;
    for (const memorial of userMemorials) {
      const tributesCount = Array.from(this.tributes.values())
        .filter(t => t.memorialId === memorial.id && t.status === "published").length;
      totalTributes += tributesCount;
    }
    
    return totalTributes;
  }

  async getMemorial(id: string): Promise<Memorial | undefined> {
    return this.memorials.get(id);
  }

  // Enhanced memorial data with administrator information
  async getMemorialWithAdmin(id: string): Promise<(Memorial & { administratorName?: string }) | undefined> {
    const memorial = this.memorials.get(id);
    if (!memorial) return undefined;

    let administratorName: string | undefined;
    
    // If memorial has submitter ID, try to get user name
    if (memorial.submittedBy) {
      const user = this.users.get(memorial.submittedBy);
      if (user && user.firstName && user.lastName) {
        administratorName = `${user.firstName} ${user.lastName}`.trim();
      }
    }
    
    return {
      ...memorial,
      administratorName
    };
  }

  async createMemorial(memorial: InsertMemorial): Promise<Memorial> {
    const id = `memorial-${Date.now()}`;
    const newMemorial: Memorial = {
      ...memorial,
      id,
      middleName: memorial.middleName || null,
      dateOfFuneral: memorial.dateOfFuneral || null,
      funeralAddress: memorial.funeralAddress || null,
      profilePhotoUrl: memorial.profilePhotoUrl || null,
      memorialMessage: memorial.memorialMessage || null,
      status: memorial.status || "draft",
      privacy: memorial.privacy || "public",
      submittedBy: memorial.submittedBy || null,
      familyId: memorial.familyId || null,
      partnerId: memorial.partnerId || null,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.memorials.set(id, newMemorial);
    return newMemorial;
  }

  async updateMemorial(id: string, memorial: Partial<Memorial>): Promise<Memorial | undefined> {
    const existing = this.memorials.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...memorial, updatedAt: new Date() };
    this.memorials.set(id, updated);
    return updated;
  }

  async incrementMemorialViews(id: string): Promise<void> {
    const memorial = this.memorials.get(id);
    if (memorial) {
      memorial.viewCount = (memorial.viewCount || 0) + 1;
      this.memorials.set(id, memorial);
    }
  }

  // Tribute operations
  async getTributesByMemorial(memorialId: string): Promise<Tribute[]> {
    return Array.from(this.tributes.values())
      .filter(t => t.memorialId === memorialId && t.status === "published")
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createTribute(tribute: InsertTribute): Promise<Tribute> {
    const id = `tribute-${Date.now()}`;
    const newTribute: Tribute = {
      ...tribute,
      id,
      relationship: tribute.relationship || null,
      status: tribute.status || "draft",
      submittedBy: tribute.submittedBy || null,
      createdAt: new Date()
    };
    this.tributes.set(id, newTribute);
    return newTribute;
  }

  async updateTribute(id: string, tribute: Partial<Tribute>): Promise<Tribute | undefined> {
    const existing = this.tributes.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...tribute, updatedAt: new Date() };
    this.tributes.set(id, updated);
    return updated;
  }

  // Partner operations
  async getPartners(filters?: { province?: string; type?: string; status?: string }): Promise<Partner[]> {
    let result = Array.from(this.partners.values());
    
    if (filters?.province) {
      result = result.filter(p => p.province === filters.province);
    }
    if (filters?.type) {
      result = result.filter(p => p.type === filters.type);
    }
    if (filters?.status) {
      result = result.filter(p => p.status === filters.status);
    } else {
      result = result.filter(p => p.status === "published");
    }
    
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getPartner(id: string): Promise<Partner | undefined> {
    return this.partners.get(id);
  }

  async createPartner(partner: InsertPartner): Promise<Partner> {
    const id = `partner-${Date.now()}`;
    const newPartner: Partner = {
      ...partner,
      id,
      address: partner.address || null,
      website: partner.website || null,
      phone: partner.phone || null,
      email: partner.email || null,
      description: partner.description || null,
      logoUrl: partner.logoUrl || null,
      status: partner.status || "draft",
      tier: partner.tier || "basic",
      partnershipModel: partner.partnershipModel || "directory",
      brandingConfig: partner.brandingConfig || null,
      domainConfig: partner.domainConfig || null,
      revenueSharePct: partner.revenueSharePct || 0,
      referralPayoutZar: partner.referralPayoutZar || 0,
      billingPlan: partner.billingPlan || "basic",
      onboardingStatus: partner.onboardingStatus || "pending",
      submittedBy: partner.submittedBy || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.partners.set(id, newPartner);
    return newPartner;
  }

  async updatePartner(id: string, partner: Partial<Partner>): Promise<Partner | undefined> {
    const existing = this.partners.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...partner, updatedAt: new Date() };
    this.partners.set(id, updated);
    return updated;
  }

  async getPartnerBySlug(slug: string): Promise<Partner | undefined> {
    // For now, use name as slug
    const allPartners = Array.from(this.partners.values());
    return allPartners.find(p => 
      p.name.toLowerCase().includes(slug.toLowerCase()) && 
      p.status === "published"
    );
  }

  async getPartnerDomainByDomain(domain: string): Promise<PartnerDomain | undefined> {
    const allDomains = Array.from(this.partnerDomains.values());
    return allDomains.find(d => d.domain === domain && d.isActive);
  }

  async getPartnerByUserId(userId: string): Promise<Partner | undefined> {
    const allPartners = Array.from(this.partners.values());
    return allPartners.find(p => p.submittedBy === userId);
  }

  async getPartnerDashboardData(partnerId: string): Promise<any> {
    // Get memorial count and stats for the partner
    const memorials = Array.from(this.memorials.values()).filter(m => m.partnerId === partnerId);
    const totalMemorials = memorials.length;
    const activeMemorials = memorials.filter(m => m.status === "published").length;

    // Mock data for other dashboard metrics (would be real calculations in production)
    return {
      totalMemorials,
      activeMemorials,
      monthlyViews: 1247,
      monthlyRevenue: 15600, // in cents
      pendingPayouts: 31200, // in cents
      referralConversions: 3,
    };
  }

  // Partner Lead operations
  async getPartnerLeadByEmail(email: string): Promise<PartnerLead | undefined> {
    const allLeads = Array.from(this.partnerLeads.values());
    return allLeads.find(lead => lead.email === email);
  }

  async createPartnerLead(lead: InsertPartnerLead): Promise<PartnerLead> {
    const id = `lead-${Date.now()}`;
    const newLead: PartnerLead = {
      ...lead,
      id,
      phone: lead.phone || null,
      website: lead.website || null,
      message: lead.message || null,
      status: lead.status || "new",
      convertedToPartnerId: null,
      leadSource: "website",
      utm: null,
      contactedAt: null,
      contactedBy: null,
      notes: lead.notes || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.partnerLeads.set(id, newLead);
    return newLead;
  }

  async getPartnerLeads(filters?: { status?: string; partnershipModel?: string; serviceType?: string }): Promise<PartnerLead[]> {
    let result = Array.from(this.partnerLeads.values());
    
    if (filters?.status) {
      result = result.filter(lead => lead.status === filters.status);
    }
    if (filters?.partnershipModel) {
      result = result.filter(lead => lead.partnershipModel === filters.partnershipModel);
    }
    if (filters?.serviceType) {
      result = result.filter(lead => lead.serviceType === filters.serviceType);
    }

    return result.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async updatePartnerLead(id: string, updateData: Partial<PartnerLead>): Promise<PartnerLead | undefined> {
    const existing = this.partnerLeads.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updateData, updatedAt: new Date() };
    this.partnerLeads.set(id, updated);
    return updated;
  }

  // Partner Domain operations
  async getPartnerDomains(partnerId: string): Promise<PartnerDomain[]> {
    return Array.from(this.partnerDomains.values())
      .filter(domain => domain.partnerId === partnerId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createPartnerDomain(domain: InsertPartnerDomain): Promise<PartnerDomain> {
    const id = `domain-${Date.now()}`;
    const newDomain: PartnerDomain = {
      ...domain,
      id,
      isPrimary: domain.isPrimary || false,
      isActive: domain.isActive ?? true,
      sslStatus: domain.sslStatus || "pending",
      verificationStatus: domain.verificationStatus || "pending",
      verificationToken: domain.verificationToken || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.partnerDomains.set(id, newDomain);
    return newDomain;
  }

  // Partner Member operations
  async getPartnerMembers(partnerId: string): Promise<PartnerMember[]> {
    return Array.from(this.partnerMembers.values())
      .filter(member => member.partnerId === partnerId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createPartnerMember(member: InsertPartnerMember): Promise<PartnerMember> {
    const id = `member-${Date.now()}`;
    const newMember: PartnerMember = {
      ...member,
      id,
      role: member.role || "member",
      permissions: member.permissions || null,
      isActive: member.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.partnerMembers.set(id, newMember);
    return newMember;
  }

  async getPartnerMembership(partnerId: string, userId: string): Promise<PartnerMember | undefined> {
    const allMembers = Array.from(this.partnerMembers.values());
    return allMembers.find(member => 
      member.partnerId === partnerId && 
      member.userId === userId && 
      member.isActive
    );
  }

  // Additional User operations
  async getUserByEmail(email: string): Promise<User | undefined> {
    const allUsers = Array.from(this.users.values());
    return allUsers.find(user => user.email === email);
  }

  // Partner Referrals and Payouts (mock implementations)
  async getPartnerReferrals(partnerId: string): Promise<any[]> {
    // In a real implementation, this would query referral tracking data
    return [
      {
        id: "ref-1",
        partnerId,
        memorialId: "memorial-123",
        memorialName: "Sarah Mthembu",
        dateReferred: "2024-02-15",
        status: "converted",
        commission: 50000, // R500 in cents
      },
      {
        id: "ref-2",
        partnerId,
        memorialId: "memorial-124",
        memorialName: "John Sibiya",
        dateReferred: "2024-02-10",
        status: "converted",
        commission: 50000, // R500 in cents
      },
      {
        id: "ref-3",
        partnerId,
        memorialId: "memorial-125",
        memorialName: "Grace Mogale",
        dateReferred: "2024-02-08",
        status: "pending",
        commission: 0,
      },
    ];
  }

  async getPartnerPayouts(partnerId: string): Promise<any[]> {
    // In a real implementation, this would query payout history data
    return [
      {
        id: "payout-1",
        partnerId,
        type: "revenue_share",
        amount: 28500, // R285 in cents
        status: "paid",
        paidAt: "2024-01-31",
        description: "January 2024 revenue share",
      },
      {
        id: "payout-2",
        partnerId,
        type: "referral_commission",
        amount: 150000, // R1500 in cents  
        status: "paid",
        paidAt: "2024-01-31",
        description: "Referral commissions for January 2024",
      },
      {
        id: "payout-3",
        partnerId,
        type: "revenue_share",
        amount: 31200, // R312 in cents
        status: "pending",
        paidAt: null,
        description: "February 2024 revenue share",
      },
    ];
  }

  // Memorial photo operations
  async getMemorialPhotos(memorialId: string, mediaType?: string): Promise<MemorialPhoto[]> {
    let result = Array.from(this.memorialPhotos.values())
      .filter(p => p.memorialId === memorialId);
    
    if (mediaType) {
      result = result.filter(p => p.mediaType === mediaType);
    }
    
    return result.sort((a, b) => {
      // Cover photos first
      if (a.isCoverPhoto && !b.isCoverPhoto) return -1;
      if (!a.isCoverPhoto && b.isCoverPhoto) return 1;
      // Then by creation date
      return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
    });
  }

  async setCoverPhoto(memorialId: string, photoId: string): Promise<void> {
    // Remove cover photo status from all photos for this memorial
    Array.from(this.memorialPhotos.values())
      .filter(p => p.memorialId === memorialId)
      .forEach(p => {
        p.isCoverPhoto = false;
        this.memorialPhotos.set(p.id, p);
      });
    
    // Set the new cover photo
    const photo = this.memorialPhotos.get(photoId);
    if (photo) {
      photo.isCoverPhoto = true;
      this.memorialPhotos.set(photoId, photo);
    }
  }

  async incrementPhotoViews(photoId: string): Promise<void> {
    const photo = this.memorialPhotos.get(photoId);
    if (photo) {
      photo.viewCount = (photo.viewCount || 0) + 1;
      this.memorialPhotos.set(photoId, photo);
    }
  }

  async createMemorialPhoto(photo: InsertMemorialPhoto): Promise<MemorialPhoto> {
    const id = `photo-${Date.now()}`;
    const newPhoto: MemorialPhoto = {
      ...photo,
      id,
      caption: photo.caption || null,
      mediaType: photo.mediaType || 'photo',
      isCoverPhoto: photo.isCoverPhoto || false,
      viewCount: 0,
      uploadedBy: photo.uploadedBy || null,
      uploaderName: photo.uploaderName || null,
      createdAt: new Date()
    };
    this.memorialPhotos.set(id, newPhoto);
    return newPhoto;
  }

  // Funeral program operations  
  async getFuneralPrograms(memorialId: string): Promise<FuneralProgram[]> {
    return Array.from(this.funeralPrograms.values())
      .filter(p => p.memorialId === memorialId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createFuneralProgram(program: InsertFuneralProgram): Promise<FuneralProgram> {
    const id = `program-${Date.now()}`;
    const newProgram: FuneralProgram = {
      ...program,
      id,
      uploadedBy: program.uploadedBy || null,
      downloadCount: 0,
      createdAt: new Date()
    };
    this.funeralPrograms.set(id, newProgram);
    return newProgram;
  }

  async incrementProgramDownloads(id: string): Promise<void> {
    const program = this.funeralPrograms.get(id);
    if (program) {
      program.downloadCount = (program.downloadCount || 0) + 1;
      this.funeralPrograms.set(id, program);
    }
  }

  // Memorial event operations
  async getMemorialEvents(memorialId: string): Promise<MemorialEvent[]> {
    return Array.from(this.memorialEvents.values())
      .filter(e => e.memorialId === memorialId && e.status === "published")
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  }

  async createMemorialEvent(event: InsertMemorialEvent): Promise<MemorialEvent> {
    const id = `event-${Date.now()}`;
    const newEvent: MemorialEvent = {
      ...event,
      id,
      description: event.description || null,
      location: event.location || null,
      status: event.status || "draft",
      organizedBy: event.organizedBy || null,
      createdAt: new Date()
    };
    this.memorialEvents.set(id, newEvent);
    return newEvent;
  }

  // Memorial subscription operations
  async getMemorialSubscription(memorialId: string, userId?: string, email?: string): Promise<MemorialSubscription | undefined> {
    return Array.from(this.memorialSubscriptions.values())
      .find(sub => 
        sub.memorialId === memorialId && 
        sub.isActive &&
        ((userId && sub.userId === userId) || (email && sub.email === email))
      );
  }

  async createMemorialSubscription(subscription: InsertMemorialSubscription): Promise<MemorialSubscription> {
    const id = `subscription-${Date.now()}`;
    const newSubscription: MemorialSubscription = {
      ...subscription,
      id,
      userId: subscription.userId || null,
      email: subscription.email || null,
      subscriptionType: subscription.subscriptionType || "all_updates",
      isActive: subscription.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.memorialSubscriptions.set(id, newSubscription);
    return newSubscription;
  }

  async updateMemorialSubscription(id: string, subscription: Partial<MemorialSubscription>): Promise<MemorialSubscription | undefined> {
    const existing = this.memorialSubscriptions.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...subscription, updatedAt: new Date() };
    this.memorialSubscriptions.set(id, updated);
    return updated;
  }

  async deleteMemorialSubscription(id: string): Promise<void> {
    const existing = this.memorialSubscriptions.get(id);
    if (existing) {
      existing.isActive = false;
      existing.updatedAt = new Date();
      this.memorialSubscriptions.set(id, existing);
    }
  }

  // Digital Order of Service operations
  async getOrderOfServiceByMemorial(memorialId: string): Promise<DigitalOrderOfService | undefined> {
    return Array.from(this.digitalOrderOfService.values())
      .find(order => order.memorialId === memorialId);
  }

  async getOrderOfService(id: string): Promise<DigitalOrderOfService | undefined> {
    return this.digitalOrderOfService.get(id);
  }

  async createOrderOfService(orderOfServiceData: InsertDigitalOrderOfService): Promise<DigitalOrderOfService> {
    const id = `order-${Date.now()}`;
    const newOrderOfService: DigitalOrderOfService = {
      ...orderOfServiceData,
      id,
      title: orderOfServiceData.title || "Celebration of Life",
      theme: orderOfServiceData.theme || "classic",
      fontFamily: orderOfServiceData.fontFamily || "serif",
      status: orderOfServiceData.status || "draft",
      privacy: orderOfServiceData.privacy || "public",
      downloadCount: 0,
      viewCount: 0,
      createdBy: orderOfServiceData.createdBy || null,
      coverPhotoUrl: orderOfServiceData.coverPhotoUrl || null,
      tributeQuote: orderOfServiceData.tributeQuote || null,
      serviceDate: orderOfServiceData.serviceDate || null,
      serviceTime: orderOfServiceData.serviceTime || null,
      venue: orderOfServiceData.venue || null,
      officiant: orderOfServiceData.officiant || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.digitalOrderOfService.set(id, newOrderOfService);
    return newOrderOfService;
  }

  async updateOrderOfService(id: string, orderOfServiceData: Partial<DigitalOrderOfService>): Promise<DigitalOrderOfService | undefined> {
    const existing = this.digitalOrderOfService.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...orderOfServiceData, updatedAt: new Date() };
    this.digitalOrderOfService.set(id, updated);
    return updated;
  }

  async deleteOrderOfService(id: string): Promise<void> {
    // First delete all associated events
    Array.from(this.orderOfServiceEvents.entries()).forEach(([eventId, event]) => {
      if (event.orderOfServiceId === id) {
        this.orderOfServiceEvents.delete(eventId);
      }
    });
    // Then delete the order of service
    this.digitalOrderOfService.delete(id);
  }

  async incrementOrderOfServiceViews(id: string): Promise<void> {
    const orderOfService = this.digitalOrderOfService.get(id);
    if (orderOfService) {
      orderOfService.viewCount = (orderOfService.viewCount || 0) + 1;
      this.digitalOrderOfService.set(id, orderOfService);
    }
  }

  async incrementOrderOfServiceDownloads(id: string): Promise<void> {
    const orderOfService = this.digitalOrderOfService.get(id);
    if (orderOfService) {
      orderOfService.downloadCount = (orderOfService.downloadCount || 0) + 1;
      this.digitalOrderOfService.set(id, orderOfService);
    }
  }

  // Order of Service Events operations
  async getOrderOfServiceEvents(orderOfServiceId: string): Promise<OrderOfServiceEvent[]> {
    return Array.from(this.orderOfServiceEvents.values())
      .filter(event => event.orderOfServiceId === orderOfServiceId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async createOrderOfServiceEvent(event: InsertOrderOfServiceEvent): Promise<OrderOfServiceEvent> {
    const id = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newEvent: OrderOfServiceEvent = {
      ...event,
      id,
      description: event.description || null,
      speaker: event.speaker || null,
      duration: event.duration || null,
      content: event.content || null,
      createdAt: new Date()
    };
    this.orderOfServiceEvents.set(id, newEvent);
    return newEvent;
  }

  async updateOrderOfServiceEvent(id: string, event: Partial<OrderOfServiceEvent>): Promise<OrderOfServiceEvent | undefined> {
    const existing = this.orderOfServiceEvents.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...event };
    this.orderOfServiceEvents.set(id, updated);
    return updated;
  }

  async deleteOrderOfServiceEvent(id: string): Promise<void> {
    this.orderOfServiceEvents.delete(id);
  }

  async reorderServiceEvents(orderOfServiceId: string, eventIds: string[]): Promise<void> {
    // Update the orderIndex for each event based on its position in the array
    eventIds.forEach((eventId, index) => {
      const event = this.orderOfServiceEvents.get(eventId);
      if (event && event.orderOfServiceId === orderOfServiceId) {
        event.orderIndex = index;
        this.orderOfServiceEvents.set(eventId, event);
      }
    });
  }
}

// Use DatabaseStorage for persistent data storage
export const storage = new DatabaseStorage();
