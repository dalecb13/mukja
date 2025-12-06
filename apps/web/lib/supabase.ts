import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase environment variables are not set. Waitlist functionality will not work."
  );
}

// Create a server-side Supabase client for API routes
// This client is configured for anonymous access without session management
export function createServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are not set");
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

