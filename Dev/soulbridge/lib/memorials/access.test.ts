import { describe, expect, it } from 'vitest';
import { canViewMemorial, isDiscoverableMemorial } from './access';

describe('memorial access', () => {
  const owner = 'profile-owner';
  const stranger = 'another-profile';
  const memorial = (status: string, visibility: string) => ({
    profile_id: owner, status, visibility,
  });

  it('lets owners view all of their own statuses and visibilities', () => {
    for (const status of ['draft', 'published', 'archived']) {
      for (const visibility of ['private', 'unlisted', 'public']) {
        expect(canViewMemorial(memorial(status, visibility), owner)).toBe(true);
      }
    }
  });

  it('allows anonymous and non-owner access only to published public and unlisted links', () => {
    for (const visibility of ['public', 'unlisted']) {
      expect(canViewMemorial(memorial('published', visibility), null)).toBe(true);
      expect(canViewMemorial(memorial('published', visibility), stranger)).toBe(true);
    }
    for (const status of ['draft', 'archived']) {
      for (const visibility of ['public', 'private', 'unlisted']) {
        expect(canViewMemorial(memorial(status, visibility), null)).toBe(false);
        expect(canViewMemorial(memorial(status, visibility), stranger)).toBe(false);
      }
    }
    expect(canViewMemorial(memorial('published', 'private'), stranger)).toBe(false);
    expect(canViewMemorial(memorial('published', 'private'), null)).toBe(false);
  });

  it('only indexes published public memorials', () => {
    expect(isDiscoverableMemorial(memorial('published', 'public'))).toBe(true);
    expect(isDiscoverableMemorial(memorial('published', 'unlisted'))).toBe(false);
    expect(isDiscoverableMemorial(memorial('published', 'private'))).toBe(false);
    expect(isDiscoverableMemorial(memorial('draft', 'public'))).toBe(false);
  });
});
