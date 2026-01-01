import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client with service role to bypass RLS
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('[CLERK WEBHOOK] Missing CLERK_WEBHOOK_SECRET');
    return new Response('Missing webhook secret', { status: 500 });
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('[CLERK WEBHOOK] Missing svix headers');
    return new Response('Missing svix headers', { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('[CLERK WEBHOOK] Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }

  const eventType = evt.type;
  console.log(`[CLERK WEBHOOK] Received event: ${eventType}`);

  try {
    const supabase = getSupabaseAdmin();

    if (eventType === 'user.created') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;
      const primaryEmail = email_addresses?.[0]?.email_address;
      const fullName = [first_name, last_name].filter(Boolean).join(' ') || null;

      console.log(`[CLERK WEBHOOK] Creating profile for user: ${primaryEmail}`);

      const { error } = await supabase.from('profiles').upsert({
        id: id, // Clerk user ID (string)
        email: primaryEmail,
        full_name: fullName,
        avatar_url: image_url,
        role: 'user', // Default role
        subscription_status: 'inactive',
      }, {
        onConflict: 'id',
      });

      if (error) {
        console.error('[CLERK WEBHOOK] Error creating profile:', error);
        return new Response('Error creating profile', { status: 500 });
      }

      console.log(`[CLERK WEBHOOK] Profile created successfully for: ${primaryEmail}`);
    }

    if (eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;
      const primaryEmail = email_addresses?.[0]?.email_address;
      const fullName = [first_name, last_name].filter(Boolean).join(' ') || null;

      console.log(`[CLERK WEBHOOK] Updating profile for user: ${primaryEmail}`);

      const { error } = await supabase
        .from('profiles')
        .update({
          email: primaryEmail,
          full_name: fullName,
          avatar_url: image_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        console.error('[CLERK WEBHOOK] Error updating profile:', error);
        return new Response('Error updating profile', { status: 500 });
      }

      console.log(`[CLERK WEBHOOK] Profile updated successfully for: ${primaryEmail}`);
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data;

      console.log(`[CLERK WEBHOOK] Deleting profile for user: ${id}`);

      // Note: With ON DELETE CASCADE, related records will be cleaned up automatically
      const { error } = await supabase.from('profiles').delete().eq('id', id);

      if (error) {
        console.error('[CLERK WEBHOOK] Error deleting profile:', error);
        return new Response('Error deleting profile', { status: 500 });
      }

      console.log(`[CLERK WEBHOOK] Profile deleted successfully`);
    }

    return new Response('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error('[CLERK WEBHOOK] Unexpected error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

