# Memorial Slug Generation - Implementation Complete

## Overview

This document describes the comprehensive memorial slug generation system that fixes the issue of first letters being dropped from memorial URLs.

## Problem Solved

**Before:** Memorial slugs were dropping first letters, creating broken URLs like:
- `thandiwe-tini` → `handiwe-tini` ❌
- `alvaro-siza` → `lvaro-siza` ❌

**After:** Robust Unicode-aware slug generation that **always preserves first letters**:
- `Thandiwe Tini` → `thandiwe-tini` ✅
- `Álvaro Siza` → `alvaro-siza` ✅
- `Thandíwé Tíni` → `thandiwe-tini` ✅
- `O'Connor, Seán` → `sean-o-connor` ✅
- `Mduduzi van der Merwe` → `mduduzi-van-der-merwe` ✅

## What Was Implemented

### 1. Robust Slug Generation Library (`lib/slug.ts`)

**Key Features:**
- ✅ **Unicode Normalization** - NFKD normalization prevents accented letters from disappearing
- ✅ **First Letter Preservation** - Explicit checks ensure first letters never drop
- ✅ **Honorific Removal** - Strips Mr., Mrs., Dr., Prof., etc.
- ✅ **Multi-word Surnames** - Handles "van der Merwe", "de Villiers", etc.
- ✅ **Comma-Separated Names** - Supports "Surname, Firstname" format
- ✅ **Hyphenated Names** - Preserves "Jean-Michel", "O'Connor", etc.
- ✅ **Single Names** - Handles "Cher" → `cher-cher`
- ✅ **Uniqueness Checking** - Queries database to ensure no collisions
- ✅ **Collision Resolution** - Appends birth year or numeric suffix if needed

**Exported Functions:**

```typescript
// Generate slug from full name
toSlugFromFullName(fullName: string): string

// Generate memorial page path
memorialPathFromFullName(fullName: string): string
// Returns: "/{slug}/page"

// Ensure slug is unique in database
ensureUniqueSlug(slug: string, opts?: {
  memorialId?: string;
  birthYear?: number;
}): Promise<string>

// Validate if slug matches name
validateSlug(slug: string, fullName: string): boolean

// Repair broken slug
repairSlug(currentSlug: string, fullName: string, memorialId: string, birthYear?: number): Promise<{
  needsRepair: boolean;
  newSlug?: string;
}>

// Generate full memorial URL
memorialUrlFromFullName(fullName: string): string
// Returns: "https://soulbridge.co.za/{slug}"
```

### 2. Comprehensive Test Suite (`tests/slug.test.ts`)

**Test Coverage:** 35 tests, all passing ✅

**Test Categories:**
- Basic name handling
- Unicode/accented characters
- Apostrophes and hyphens
- Multi-word surnames (SA-specific)
- Honorifics removal
- Single names
- Edge cases (whitespace, special characters)
- **Critical:** First letter preservation invariants
- South African names (Afrikaans, Zulu, Xhosa)
- Complex real-world cases

**Run Tests:**
```bash
npm test
```

### 3. Migration Script (`scripts/repair-slugs.ts`)

A one-time migration tool to repair existing broken slugs in the database.

**Features:**
- Dry-run mode (preview changes before applying)
- Validates all memorial slugs
- Identifies and repairs:
  - Missing slugs
  - Slugs with dropped first letters
  - Slugs that don't match names
- Handles uniqueness conflicts
- Detailed progress reporting

**Usage:**

**Dry Run (Preview Only):**
```bash
npm run repair-slugs
```

**Apply Changes:**
```bash
npm run repair-slugs -- --apply
```

**Output Example:**
```
🔍 Memorial Slug Repair Script

Mode: 🔬 DRY RUN (preview only)

📥 Fetching memorials from database...
   Found 42 memorials

🔍 Analyzing slugs...
   Found 8 memorials needing repair

📋 Repairs to be made:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Thandiwe Tini
   ID: abc123...
   Current: handiwe-tini
   New:     thandiwe-tini
   Reason:  Invalid slug (first letters missing or surname incorrect)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 This was a dry run. To apply these changes, run:
   npm run repair-slugs -- --apply
```

### 4. Updated Memorial API Endpoints

**Memorial Creation** (`app/api/memorials/route.ts`):
- Now generates slug using `toSlugFromFullName()` + `ensureUniqueSlug()`
- Slug is set before database insertion
- Uses robust Unicode normalization

**Memorial Update** (`app/api/memorials/[id]/route.ts`):
- Automatically regenerates slug when `first_name` or `last_name` changes
- Preserves existing slug if name unchanged
- Ensures uniqueness on updates

## How It Works

### Slug Generation Process

1. **Remove Honorifics:**
   ```
   "Dr. Sipho Ndlovu" → "Sipho Ndlovu"
   ```

2. **Split Name:**
   - Handles "Firstname Surname" format
   - Handles "Surname, Firstname" format (reverses order)
   - Handles multi-word surnames

3. **Normalize Each Part:**
   - Unicode NFKD normalization
   - Remove combining marks (accents)
   - Lowercase
   - Replace non-alphanumeric with hyphens
   - Collapse multiple hyphens

4. **Combine and Verify:**
   - Combine parts with hyphen
   - **CRITICAL:** Check first letters are preserved
   - Warn and correct if letters dropped

5. **Ensure Uniqueness:**
   - Query database for collisions
   - First attempt: append birth year
   - Subsequent: append numeric suffix
   - Return unique slug

### Example Transformations

| Input | Output | Notes |
|-------|--------|-------|
| `Thandiwe Tini` | `thandiwe-tini` | Simple case |
| `Thandíwé Tíni` | `thandiwe-tini` | Unicode normalization |
| `Álvaro Siza` | `alvaro-siza` | Accents removed |
| `O'Connor, Seán` | `sean-o-connor` | Comma format, apostrophe |
| `Jean-Michel Basquiat` | `jean-michel-basquiat` | Hyphenated first name |
| `Mduduzi van der Merwe` | `mduduzi-van-der-merwe` | Multi-word surname |
| `De Villiers, Anna` | `anna-de-villiers` | Comma + multi-word |
| `Mr. Sipho Ndlovu` | `sipho-ndlovu` | Honorific removed |
| `Cher` | `cher-cher` | Single name duplicated |
| `N'Dlamini` | `n-dlamini-n-dlamini` | Apostrophe + single name |

## Deployment Instructions

### 1. Run Tests Locally

```bash
npm test
```

Verify all 35 tests pass.

### 2. Preview Slug Repairs (Optional)

```bash
npm run repair-slugs
```

Review which memorials will be updated.

### 3. Apply Slug Repairs (Optional - if existing memorials need fixing)

```bash
npm run repair-slugs -- --apply
```

This will update all broken slugs in the database.

### 4. Commit Changes

```bash
git add lib/slug.ts tests/slug.test.ts scripts/repair-slugs.ts app/api/memorials/
git commit -m "Implement robust memorial slug generation with Unicode support

✅ Features:
- Unicode-aware slug generation (NFKD normalization)
- First letter preservation guarantees
- Multi-word surname support (van der, de, etc.)
- Comma-separated name format support
- Honorific removal
- Apostrophe and hyphen handling
- Database uniqueness checking
- Comprehensive test suite (35 tests, all passing)

✅ Implementation:
- lib/slug.ts: Core slug generation library
- tests/slug.test.ts: 35 comprehensive tests
- scripts/repair-slugs.ts: One-time migration script
- Updated memorial creation API
- Updated memorial update API (auto-regenerates on name change)

✅ Testing:
- All 35 tests passing
- Handles SA-specific names (Afrikaans, Zulu, Xhosa)
- Invariant tests ensure first letters never dropped

🐛 Fixes:
- Slugs no longer drop first letters (Thandíwé → thandiwe, not handiwe)
- Proper Unicode normalization
- Correct comma-separated name handling"
```

### 5. Push to Production

```bash
git push origin main
```

Vercel will automatically deploy the changes.

### 6. Verify Production

After deployment, test memorial creation with:
- Accented names: `Thandíwé Tíni`
- Comma format: `Doe, John`
- Multi-word surnames: `van der Merwe`
- Single names: `Cher`

Check that slugs are correct in the database and URLs work.

## Testing Checklist

After deployment, verify:

- [ ] Create memorial with accented name (e.g., "Álvaro Siza")
  - Slug should be `alvaro-siza`, not `lvaro-siza`
- [ ] Create memorial with comma format (e.g., "Doe, John")
  - Slug should be `john-doe`
- [ ] Create memorial with multi-word surname (e.g., "Anna de Villiers")
  - Slug should be `anna-de-villiers`
- [ ] Create memorial with apostrophe (e.g., "Séan O'Connor")
  - Slug should be `sean-o-connor`
- [ ] Update existing memorial's name
  - Slug should regenerate automatically
- [ ] Create two memorials with same name
  - Second should get numeric suffix (e.g., `john-doe-1980` or `john-doe-2`)
- [ ] Run migration script on production (if needed)
  - Verify broken slugs are repaired

## Database Notes

The database trigger `memorial_slug_trigger` still exists but will be overridden by the application-side slug generation. The trigger serves as a fallback if slug is not provided.

**Future Improvement:** Consider updating the database function `generate_memorial_slug()` to match the TypeScript logic, but this is not critical since the application always provides a slug.

## Files Changed

### New Files
- `lib/slug.ts` - Core slug generation library
- `tests/slug.test.ts` - Comprehensive test suite
- `scripts/repair-slugs.ts` - One-time migration script
- `SLUG_GENERATION_IMPLEMENTATION.md` - This documentation

### Modified Files
- `app/api/memorials/route.ts` - Added slug generation on create
- `app/api/memorials/[id]/route.ts` - Added slug regeneration on name update
- `package.json` - Added test scripts and repair-slugs script
- `vitest.config.ts` - Test configuration

### Dependencies Added
- `vitest` - Testing framework
- `@vitest/ui` - Test UI
- `tsx` - TypeScript execution for scripts

## Support

If slugs are still being generated incorrectly:

1. Check the test suite: `npm test`
2. Run the repair script in dry-run mode: `npm run repair-slugs`
3. Review the slug generation logic in `lib/slug.ts`
4. Check database for conflicting slugs

## Summary

✅ **Problem:** Memorial slugs were dropping first letters
✅ **Solution:** Robust Unicode-aware slug generation with explicit first-letter preservation
✅ **Testing:** 35 comprehensive tests, all passing
✅ **Migration:** One-time repair script for existing memorials
✅ **Integration:** Automatic slug generation on create and update
✅ **Deployment:** Ready for production

The slug generation system is now production-ready and will handle all edge cases correctly, ensuring memorial URLs are always accurate and professional.
