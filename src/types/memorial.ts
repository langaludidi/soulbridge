export interface Memorial {
  id: string;
  slug: string;
  name: string;
  birthDate: string;
  deathDate: string;
  birthPlace?: string;
  deathPlace?: string;
  portrait: string;
  coverImage: string;
  obituary: string;

  services: Service[];
  donation?: Donation;
  photos: Photo[];
  memories: Memory[];
  familyTree?: FamilyMember[];
}

export interface Service {
  id: string;
  type: 'Visitation' | 'Funeral Service' | 'Celebration of Life' | 'Burial' | 'Other';
  date: string;
  startTime: string;
  endTime?: string;
  location: string;
  address: string;
  details?: string;
  mapUrl?: string;
  directions?: string;
}

export interface Donation {
  organization: string;
  description?: string;
  link?: string;
}

export interface Photo {
  id: string;
  url: string;
  caption?: string;
  uploadedBy?: string;
  uploadedAt?: string;
  type?: 'image' | 'video';
}

export interface Memory {
  id: string;
  authorName: string;
  authorPhoto?: string;
  message: string;
  photo?: string;
  createdAt: string;
  candles?: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  photo?: string;
  children?: FamilyMember[];
}
