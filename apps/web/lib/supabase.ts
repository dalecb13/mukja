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

// Create a client-side Supabase client for use in React components
// This client is configured with session persistence and auto-refresh
export function createClientClient() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Supabase environment variables are not set. " +
      "Required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
    );
  }

  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

// Database types for waitlist
export interface WaitlistEntry {
  id: string;
  email: string;
  created_at: string;
  source?: string;
}

