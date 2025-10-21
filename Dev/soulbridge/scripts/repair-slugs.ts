#!/usr/bin/env tsx
/**
 * One-time migration script to repair broken memorial slugs
 *
 * This script:
 * 1. Fetches all memorials from the database
 * 2. Validates each slug against the memorial's full name
 * 3. Repairs broken slugs using the robust slug generation logic
 * 4. Provides dry-run mode to preview changes before applying
 *
 * Usage:
 *   npm run repair-slugs              # Dry run (preview changes)
 *   npm run repair-slugs -- --apply   # Apply changes to database
 */

import { getSupabaseAdmin } from '../lib/supabase/client';
import { toSlugFromFullName, validateSlug, ensureUniqueSlug } from '../lib/slug';

interface Memorial {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  slug: string | null;
  date_of_birth: string;
  date_of_death: string;
}

interface SlugRepair {
  memorialId: string;
  fullName: string;
  currentSlug: string | null;
  newSlug: string;
  reason: string;
}

async function fetchAllMemorials(): Promise<Memorial[]> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('memorials')
    .select('id, first_name, last_name, full_name, slug, date_of_birth, date_of_death')
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch memorials: ${error.message}`);
  }

  return data || [];
}

async function analyzeMemorials(memorials: Memorial[]): Promise<SlugRepair[]> {
  const repairs: SlugRepair[] = [];

  for (const memorial of memorials) {
    const fullName = memorial.full_name || `${memorial.first_name} ${memorial.last_name}`;
    const currentSlug = memorial.slug;

    // Case 1: No slug at all
    if (!currentSlug || currentSlug.trim() === '') {
      const birthYear = memorial.date_of_birth
        ? new Date(memorial.date_of_birth).getFullYear()
        : undefined;

      const baseSlug = toSlugFromFullName(fullName);
      const newSlug = await ensureUniqueSlug(baseSlug, {
        memorialId: memorial.id,
        birthYear,
      });

      repairs.push({
        memorialId: memorial.id,
        fullName,
        currentSlug: null,
        newSlug,
        reason: 'Missing slug',
      });
      continue;
    }

    // Case 2: Invalid slug (doesn't match name)
    const isValid = validateSlug(currentSlug, fullName);

    if (!isValid) {
      const birthYear = memorial.date_of_birth
        ? new Date(memorial.date_of_birth).getFullYear()
        : undefined;

      const baseSlug = toSlugFromFullName(fullName);
      const newSlug = await ensureUniqueSlug(baseSlug, {
        memorialId: memorial.id,
        birthYear,
      });

      // Only add to repairs if the new slug is actually different
      if (newSlug !== currentSlug) {
        repairs.push({
          memorialId: memorial.id,
          fullName,
          currentSlug,
          newSlug,
          reason: 'Invalid slug (first letters missing or surname incorrect)',
        });
      }
    }
  }

  return repairs;
}

async function applyRepairs(repairs: SlugRepair[]): Promise<void> {
  const supabase = getSupabaseAdmin();

  console.log(`\nApplying ${repairs.length} slug repairs...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const repair of repairs) {
    try {
      const { error } = await supabase
        .from('memorials')
        .update({ slug: repair.newSlug })
        .eq('id', repair.memorialId);

      if (error) {
        console.error(`❌ Failed to update ${repair.fullName}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Updated: ${repair.fullName}`);
        console.log(`   ${repair.currentSlug || '(none)'} → ${repair.newSlug}`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Error updating ${repair.fullName}:`, err);
      errorCount++;
    }
  }

  console.log(`\n📊 Results:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📝 Total: ${repairs.length}`);
}

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = !args.includes('--apply');

  console.log('🔍 Memorial Slug Repair Script\n');
  console.log(`Mode: ${isDryRun ? '🔬 DRY RUN (preview only)' : '⚡ APPLY CHANGES'}\n`);

  // Step 1: Fetch all memorials
  console.log('📥 Fetching memorials from database...');
  const memorials = await fetchAllMemorials();
  console.log(`   Found ${memorials.length} memorials\n`);

  // Step 2: Analyze slugs
  console.log('🔍 Analyzing slugs...');
  const repairs = await analyzeMemorials(memorials);
  console.log(`   Found ${repairs.length} memorials needing repair\n`);

  if (repairs.length === 0) {
    console.log('✅ All slugs are valid! No repairs needed.\n');
    return;
  }

  // Step 3: Show repairs
  console.log('📋 Repairs to be made:\n');
  console.log('━'.repeat(80));

  for (const repair of repairs) {
    console.log(`\n📝 ${repair.fullName}`);
    console.log(`   ID: ${repair.memorialId}`);
    console.log(`   Current: ${repair.currentSlug || '(none)'}`);
    console.log(`   New:     ${repair.newSlug}`);
    console.log(`   Reason:  ${repair.reason}`);
  }

  console.log('\n' + '━'.repeat(80));

  // Step 4: Apply or show instructions
  if (isDryRun) {
    console.log('\n💡 This was a dry run. To apply these changes, run:');
    console.log('   npm run repair-slugs -- --apply\n');
  } else {
    await applyRepairs(repairs);
    console.log('\n✅ Slug repair complete!\n');
  }
}

// Run the script
main().catch((error) => {
  console.error('\n❌ Script failed:', error);
  process.exit(1);
});
