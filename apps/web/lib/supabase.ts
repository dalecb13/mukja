import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Support both legacy (anon) and new (publishable) key naming
const supabaseAnonKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase environment variables are not set. Waitlist functionality will not work."
  );
  console.warn(
    "Expected: NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
  );
}

// Validate that we're using the publishable key (not the secret key)
// Secret keys typically start with different patterns and should NOT be used for client operations
if (supabaseAnonKey && supabaseAnonKey.length > 0) {
  // Secret keys are longer and have different structure
  // This is a basic check - secret keys should never be in NEXT_PUBLIC_ vars anyway
  if (supabaseAnonKey.includes('secret') || supabaseAnonKey.length > 200) {
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
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase environment variables are not set. " +
      "Required: NEXT_PUBLIC_SUPABASE_URL and " +
      "NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)"
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
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

