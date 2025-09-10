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
  getMemorialWithAdmin(id: string): Promise<(Memorial & { administratorName?: string }) | undefined>;
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

  // Enhanced memorial data with administrator information
  async getMemorialWithAdmin(id: string): Promise<(Memorial & { administratorName?: string }) | undefined> {
    const result = await db
      .select({
        // All memorial fields
        id: memorials.id,
        firstName: memorials.firstName,
        lastName: memorials.lastName,
        dateOfBirth: memorials.dateOfBirth,
        dateOfPassing: memorials.dateOfPassing,
        province: memorials.province,
        profilePhotoUrl: memorials.profilePhotoUrl,
        memorialMessage: memorials.memorialMessage,
        status: memorials.status,
        privacy: memorials.privacy,
        submittedBy: memorials.submittedBy,
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
}

// In-memory storage implementation (preferred for development)
export class MemStorage implements IStorage {
  private users = new Map<string, User>();
  private memorials = new Map<string, Memorial>();
  private tributes = new Map<string, Tribute>();
  private partners = new Map<string, Partner>();
  private memorialPhotos = new Map<string, MemorialPhoto>();
  private funeralPrograms = new Map<string, FuneralProgram>();
  private memorialEvents = new Map<string, MemorialEvent>();

  constructor() {
    // Initialize with sample data for testing
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample memorial for testing
    const testMemorial: Memorial = {
      id: "test-id",
      firstName: "John",
      lastName: "Mthembu",
      dateOfBirth: new Date("1955-03-15"),
      dateOfPassing: new Date("2023-08-20"),
      province: "KwaZulu-Natal",
      status: "published",
      privacy: "public",
      memorialMessage: "A loving father and devoted husband who touched many lives with his kindness and wisdom. His legacy lives on in the hearts of all who knew him.",
      profilePhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=300&h=400&fit=crop&crop=face",
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
      profilePhotoUrl: memorial.profilePhotoUrl || null,
      memorialMessage: memorial.memorialMessage || null,
      status: memorial.status || "draft",
      privacy: memorial.privacy || "public",
      submittedBy: memorial.submittedBy || null,
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
}

// Use MemStorage for development (preferred over database)
export const storage = new MemStorage();
