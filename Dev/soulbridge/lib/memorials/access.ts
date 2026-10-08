/**
 * Single rule for the public memorial page and API.
 *
 * Public: discoverable after publishing.
 * Unlisted: published pages can be viewed by anyone holding the URL, but must
 * never be indexed or added to discovery listings.
 * Private: owner only, even when published.
 * Draft/archived: owner only, regardless of visibility.
 */
export type MemorialAccessRecord = {
  profile_id: string;
  status: string;
  visibility: string;
};

export function canViewMemorial(
  memorial: MemorialAccessRecord,
  viewerProfileId: string | null | undefined
): boolean {
  if (viewerProfileId && viewerProfileId === memorial.profile_id) return true;
  if (memorial.status !== 'published') return false;
  return memorial.visibility === 'public' || memorial.visibility === 'unlisted';
}

export function isDiscoverableMemorial(memorial: MemorialAccessRecord): boolean {
  return memorial.status === 'published' && memorial.visibility === 'public';
}
