import { getSupabaseAdmin } from './supabase/client';

/**
 * Removes honorifics from the beginning of a name
 */
function removeHonorifics(name: string): string {
  return name.replace(/^(mr|mrs|ms|miss|dr|prof)\.?\s+/i, '');
}

/**
 * Normalizes a string for slug generation:
 * 1. Unicode NFKD normalization + remove combining marks
 * 2. Lowercase
 * 3. Keep letters, digits, hyphens, apostrophes
 * 4. Convert other chars to single hyphen
 * 5. Collapse multiple hyphens
 * 6. Trim hyphens from start/end
 */
function normalizeForSlug(str: string): string {
  // Unicode normalize and remove combining marks (accents)
  const normalized = str
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '');

  // Lowercase
  const lower = normalized.toLowerCase();

  // Replace non-alphanumeric (except hyphen and apostrophe) with hyphen
  // Keep internal hyphens and apostrophes as word joiners
  const slugged = lower
    .replace(/[^a-z0-9\-']+/g, '-')
    // Replace apostrophes with hyphens for URLs
    .replace(/'/g, '-')
    // Collapse multiple hyphens
    .replace(/-+/g, '-')
    // Trim hyphens
    .replace(/^-+|-+$/g, '');

  return slugged;
}

/**
 * Splits full name into first name and surname
 * Handles multi-word surnames and single names
 * Handles "Surname, Firstname" format
 */
function splitName(fullName: string): { firstName: string; surname: string } {
  // Remove honorifics first
  const cleaned = removeHonorifics(fullName.trim());

  // Collapse multiple spaces to single space
  const normalized = cleaned.replace(/\s+/g, ' ');

  // Check if name contains comma (Surname, Firstname format)
  if (normalized.includes(',')) {
    const parts = normalized.split(',').map(p => p.trim());
    if (parts.length >= 2 && parts[0] && parts[1]) {
      // "O'Connor, Seán" -> firstName: "Seán", surname: "O'Connor"
      return {
        firstName: parts[1].split(/\s+/)[0], // Take first word after comma as first name
        surname: parts[0], // Everything before comma is surname
      };
    }
  }

  // Split by spaces
  const tokens = normalized.split(/\s+/).filter(t => t.length > 0);

  if (tokens.length === 0) {
    return { firstName: 'memorial', surname: 'memorial' };
  }

  if (tokens.length === 1) {
    // Single name like "Cher" -> use twice
    return { firstName: tokens[0], surname: tokens[0] };
  }

  // First token is first name, rest is surname
  const firstName = tokens[0];
  const surname = tokens.slice(1).join(' ');

  return { firstName, surname };
}

/**
 * Converts a full name to a URL-safe slug
 * Ensures first letters are never dropped
 *
 * @example
 * toSlugFromFullName("Thandiwe Tini") → "thandiwe-tini"
 * toSlugFromFullName("O'Connor, Seán") → "sean-oconnor"
 * toSlugFromFullName("Jean-Michel Basquiat") → "jean-michel-basquiat"
 */
export function toSlugFromFullName(fullName: string): string {
  const { firstName, surname } = splitName(fullName);

  // Normalize each part separately
  const firstSlug = normalizeForSlug(firstName);
  const surnameSlug = normalizeForSlug(surname);

  // Combine with hyphen
  let slug = `${firstSlug}-${surnameSlug}`;

  // Collapse any double hyphens that might occur
  slug = slug.replace(/-+/g, '-');

  // Safety check: ensure slug is not empty
  if (!slug || slug === '-') {
    slug = 'memorial';
  }

  // CRITICAL: Verify first letters are preserved
  const firstNameFirstChar = firstName.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().charAt(0);
  const surnameFirstChar = surname.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().charAt(0);

  // Ensure slug starts with first name's first letter
  if (firstSlug && !slug.startsWith(firstNameFirstChar)) {
    console.warn(`Slug "${slug}" doesn't start with expected first letter "${firstNameFirstChar}" - prepending`);
    slug = firstNameFirstChar + slug;
  }

  // Ensure slug contains surname start
  const surnameStart = surnameSlug.split('-')[0];
  if (surnameSlug && !slug.includes(surnameStart)) {
    console.warn(`Slug "${slug}" doesn't contain surname "${surnameStart}" - appending`);
    slug = `${slug}-${surnameStart}`;
  }

  return slug;
}

/**
 * Ensures a slug is unique by checking the database
 * Resolves collisions by appending birth year or numeric suffix
 *
 * @param slug - Base slug to make unique
 * @param opts - Options for uniqueness check
 * @returns Unique slug
 */
export async function ensureUniqueSlug(
  slug: string,
  opts?: {
    memorialId?: string;
    birthYear?: number;
  }
): Promise<string> {
  const supabase = getSupabaseAdmin();

  // Check if slug exists
  let currentSlug = slug;
  let attempt = 0;
  const maxAttempts = 100; // Safety limit

  while (attempt < maxAttempts) {
    const query = supabase
      .from('memorials')
      .select('id')
      .eq('slug', currentSlug);

    // If we're updating an existing memorial, exclude it from the check
    if (opts?.memorialId) {
      query.neq('id', opts.memorialId);
    }

    const { data, error } = await query.single();

    // If no match or error (not found), slug is unique
    if (error || !data) {
      return currentSlug;
    }

    // Collision detected - try next variant
    attempt++;

    if (attempt === 1 && opts?.birthYear) {
      // First collision: try with birth year
      currentSlug = `${slug}-${opts.birthYear}`;
    } else {
      // Subsequent collisions: use numeric suffix
      // Remove any existing numeric suffix first
      const baseSlug = slug.replace(/-\d+$/, '');
      const suffix = attempt + (opts?.birthYear ? 1 : 0); // Offset if we tried birth year
      currentSlug = `${baseSlug}-${suffix}`;
    }
  }

  // Fallback: append timestamp if we somehow hit max attempts
  return `${slug}-${Date.now()}`;
}

/**
 * Generates the memorial page path from a full name
 *
 * @example
 * memorialPathFromFullName("Thandiwe Tini") → "/thandiwe-tini/page"
 */
export function memorialPathFromFullName(fullName: string): string {
  const slug = toSlugFromFullName(fullName);
  return `/${slug}/page`;
}

/**
 * Generates the full memorial URL from a full name
 *
 * @example
 * memorialUrlFromFullName("Thandiwe Tini") → "https://soulbridge.co.za/thandiwe-tini"
 */
export function memorialUrlFromFullName(fullName: string): string {
  const slug = toSlugFromFullName(fullName);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://soulbridge.co.za';
  return `${baseUrl}/${slug}`;
}

/**
 * Validates if a slug matches the expected format for a name
 * Returns true if the slug appears to correctly represent the name
 */
export function validateSlug(slug: string, fullName: string): boolean {
  const { firstName, surname } = splitName(fullName);

  const firstNameNormalized = normalizeForSlug(firstName);
  const surnameNormalized = normalizeForSlug(surname);

  // Check if slug starts with first name's first letter
  const firstChar = firstNameNormalized.charAt(0);
  if (!slug.startsWith(firstChar)) {
    return false;
  }

  // Check if slug contains the surname
  const surnameStart = surnameNormalized.split('-')[0];
  if (!slug.includes(surnameStart)) {
    return false;
  }

  return true;
}

/**
 * Repairs a broken slug for a given name
 * Use this to fix existing slugs that may have lost first letters
 */
export async function repairSlug(
  currentSlug: string,
  fullName: string,
  memorialId: string,
  birthYear?: number
): Promise<{ needsRepair: boolean; newSlug?: string }> {
  // Check if current slug is valid
  if (validateSlug(currentSlug, fullName)) {
    return { needsRepair: false };
  }

  // Generate correct slug
  const correctSlug = toSlugFromFullName(fullName);

  // Make it unique
  const uniqueSlug = await ensureUniqueSlug(correctSlug, {
    memorialId,
    birthYear,
  });

  return {
    needsRepair: true,
    newSlug: uniqueSlug,
  };
}
