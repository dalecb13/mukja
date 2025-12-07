import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn(
    "Supabase environment variables are not set. Waitlist functionality will not work."
  );
  console.warn(
    "Expected: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
  );
}

// Validate that we're using the publishable key (not the secret key)
// Secret keys typically start with different patterns and should NOT be used for client operations
if (supabasePublishableKey && supabasePublishableKey.length > 0) {
  // Secret keys are longer and have different structure
  // This is a basic check - secret keys should never be in NEXT_PUBLIC_ vars anyway
  if (supabasePublishableKey.includes('secret') || supabasePublishableKey.length > 200) {
    console.error(
      "WARNING: It looks like you might be using a SECRET key instead of a PUBLISHABLE key. " +
      "For anonymous sign-in and RLS policies, you MUST use the PUBLISHABLE key. " +
      "Secret keys bypass RLS and should only be used server-side for admin operations."
    );
  }
}

// Create a server-side Supabase client for API routes
// This client is configured for anonymous access without session management
// IMPORTANT: Must use PUBLISHABLE key (not secret key) for RLS policies to work
export function createServerClient() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Supabase environment variables are not set. " +
      "Required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
    );
  }

  return createClient(supabaseUrl, supabasePublishableKey, {
    db: {
      schema: 'public', // Explicitly set schema for PostgREST
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

// Legacy export for backward compatibility (creates a new client each time)
export const supabase = createServerClient();

// Database types for waitlist
export interface WaitlistEntry {
  id: string;
  email: string;
  created_at: string;
  source?: string;
}

