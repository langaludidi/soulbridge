import {
  users,
  memorials,
  tributes,
  partners,
  memorialPhotos,
  funeralPrograms,
  memorialEvents,
  type User,
  type UpsertUser,
  type Memorial,
  type InsertMemorial,
  type Tribute,
  type InsertTribute,
  type Partner,
  type InsertPartner,
  type MemorialPhoto,
  type InsertMemorialPhoto,
  type FuneralProgram,
  type InsertFuneralProgram,
  type MemorialEvent,
  type InsertMemorialEvent,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Memorial operations
  getMemorials(filters?: { province?: string; status?: string }): Promise<Memorial[]>;
  getMemorial(id: string): Promise<Memorial | undefined>;
  createMemorial(memorial: InsertMemorial): Promise<Memorial>;
  updateMemorial(id: string, memorial: Partial<Memorial>): Promise<Memorial | undefined>;
  incrementMemorialViews(id: string): Promise<void>;
  
  // Tribute operations
  getTributesByMemorial(memorialId: string): Promise<Tribute[]>;
  createTribute(tribute: InsertTribute): Promise<Tribute>;
  updateTribute(id: string, tribute: Partial<Tribute>): Promise<Tribute | undefined>;
  
  // Partner operations
  getPartners(filters?: { province?: string; type?: string; status?: string }): Promise<Partner[]>;
  getPartner(id: string): Promise<Partner | undefined>;
  createPartner(partner: InsertPartner): Promise<Partner>;
  updatePartner(id: string, partner: Partial<Partner>): Promise<Partner | undefined>;
  
  // Memorial photo operations
  getMemorialPhotos(memorialId: string): Promise<MemorialPhoto[]>;
  createMemorialPhoto(photo: InsertMemorialPhoto): Promise<MemorialPhoto>;
  
  // Funeral program operations
  getFuneralPrograms(memorialId: string): Promise<FuneralProgram[]>;
  createFuneralProgram(program: InsertFuneralProgram): Promise<FuneralProgram>;
  incrementProgramDownloads(id: string): Promise<void>;
  
  // Memorial event operations
  getMemorialEvents(memorialId: string): Promise<MemorialEvent[]>;
  createMemorialEvent(event: InsertMemorialEvent): Promise<MemorialEvent>;
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
    if (filters?.status) {
      conditions.push(eq(memorials.status, filters.status));
    } else {
      conditions.push(eq(memorials.status, "published"));
    }
    
    const query = conditions.length > 0 
      ? db.select().from(memorials).where(and(...conditions))
      : db.select().from(memorials);
    
    return await query.orderBy(desc(memorials.createdAt));
  }

  async getMemorial(id: string): Promise<Memorial | undefined> {
    const [memorial] = await db.select().from(memorials).where(eq(memorials.id, id));
    return memorial;
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

  // Memorial photo operations
  async getMemorialPhotos(memorialId: string): Promise<MemorialPhoto[]> {
    return await db
      .select()
      .from(memorialPhotos)
      .where(eq(memorialPhotos.memorialId, memorialId))
      .orderBy(desc(memorialPhotos.createdAt));
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
}

export const storage = new DatabaseStorage();
