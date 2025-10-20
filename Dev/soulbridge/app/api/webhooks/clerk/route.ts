import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { getSupabaseAdmin, upsertProfile, createAuditLog } from '@/lib/supabase/client';

/**
 * Clerk Webhook Handler
 * Syncs user data from Clerk to Supabase
 *
 * Events handled:
 * - user.created: Creates profile in Supabase
 * - user.updated: Updates profile in Supabase
 * - user.deleted: Soft deletes profile
 * - session.created: Logs user sign-in
 */

export async function POST(req: Request) {
  // Get the Webhook secret from environment
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('Missing CLERK_WEBHOOK_SECRET environment variable');
    return Response.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing svix headers');
    return Response.json(
      { error: 'Missing svix headers' },
      { status: 400 }
    );
  }

  // Get the body
  const payload = await req.text();

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the webhook signature
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return Response.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle the webhook event
  const eventType = evt.type;
  console.log(`Webhook received: ${eventType}`);

  try {
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt);
        break;
      case 'user.updated':
        await handleUserUpdated(evt);
        break;
      case 'user.deleted':
        await handleUserDeleted(evt);
        break;
      case 'session.created':
        await handleSessionCreated(evt);
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(`Error handling webhook ${eventType}:`, error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// EVENT HANDLERS
// ============================================

async function handleUserCreated(evt: WebhookEvent) {
  if (evt.type !== 'user.created') return;

  const { id, email_addresses, first_name, last_name, image_url, phone_numbers } = evt.data;

  const primaryEmail = email_addresses.find((email) => email.id === evt.data.primary_email_address_id);
  const primaryPhone = phone_numbers?.find((phone) => phone.id === evt.data.primary_phone_number_id);

  if (!primaryEmail) {
    console.error('No primary email found for user:', id);
    return;
  }

  console.log('Creating profile for user:', id);

  // Create profile in Supabase
  const profile = await upsertProfile({
    clerk_user_id: id,
    email: primaryEmail.email_address,
    first_name: first_name || undefined,
    last_name: last_name || undefined,
    avatar_url: image_url || undefined,
    phone_number: primaryPhone?.phone_number || undefined,
  });

  console.log('Profile created:', profile.id);

  // Log the action
  await createAuditLog({
    profile_id: profile.id,
    action: 'user.created',
    resource_type: 'profile',
    resource_id: profile.id,
    new_values: profile,
    metadata: {
      source: 'clerk_webhook',
      event_id: id,
    },
  });
}

async function handleUserUpdated(evt: WebhookEvent) {
  if (evt.type !== 'user.updated') return;

  const { id, email_addresses, first_name, last_name, image_url, phone_numbers } = evt.data;

  const primaryEmail = email_addresses.find((email) => email.id === evt.data.primary_email_address_id);
  const primaryPhone = phone_numbers?.find((phone) => phone.id === evt.data.primary_phone_number_id);

  if (!primaryEmail) {
    console.error('No primary email found for user:', id);
    return;
  }

  console.log('Updating profile for user:', id);

  // Update profile in Supabase
  const profile = await upsertProfile({
    clerk_user_id: id,
    email: primaryEmail.email_address,
    first_name: first_name || undefined,
    last_name: last_name || undefined,
    avatar_url: image_url || undefined,
    phone_number: primaryPhone?.phone_number || undefined,
  });

  console.log('Profile updated:', profile.id);

  // Log the action
  await createAuditLog({
    profile_id: profile.id,
    action: 'user.updated',
    resource_type: 'profile',
    resource_id: profile.id,
    new_values: profile,
    metadata: {
      source: 'clerk_webhook',
      event_id: id,
    },
  });
}

async function handleUserDeleted(evt: WebhookEvent) {
  if (evt.type !== 'user.deleted') return;

  const { id } = evt.data;

  console.log('Soft deleting profile for user:', id);

  const supabase = getSupabaseAdmin();

  // Soft delete the profile (set status to 'deleted')
  const { data: profile, error } = await supabase
    .from('profiles')
    .update({ status: 'deleted' })
    .eq('clerk_user_id', id)
    .select()
    .single();

  if (error) {
    console.error('Error soft deleting profile:', error);
    throw error;
  }

  console.log('Profile soft deleted:', profile?.id);

  // Log the action
  if (profile) {
    await createAuditLog({
      profile_id: profile.id,
      action: 'user.deleted',
      resource_type: 'profile',
      resource_id: profile.id,
      old_values: profile,
      metadata: {
        source: 'clerk_webhook',
        event_id: id,
      },
    });
  }
}

async function handleSessionCreated(evt: WebhookEvent) {
  if (evt.type !== 'session.created') return;

  const { id, user_id, client_id } = evt.data;

  console.log('Logging session for user:', user_id);

  const supabase = getSupabaseAdmin();

  // Get the profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_user_id', user_id)
    .single();

  if (!profile) {
    console.error('Profile not found for user:', user_id);
    return;
  }

  // Update last sign-in time
  await supabase
    .from('profiles')
    .update({ last_sign_in_at: new Date().toISOString() })
    .eq('id', profile.id);

  // Log the session
  await supabase.from('user_sessions').insert({
    profile_id: profile.id,
    clerk_session_id: id,
  });

  console.log('Session logged for profile:', profile.id);
}
