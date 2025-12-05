import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase environment variables are not set. Waitlist functionality will not work."
  );
}

// Create Supabase client configured for server-side usage with anonymous access
// For server-side API routes, we need to explicitly set the apikey header
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
  {
    auth: {
      persistSession: false, // Don't persist session on server
      autoRefreshToken: false, // No token refresh needed for anonymous
      detectSessionInUrl: false, // No session detection needed
    },
    global: {
      headers: supabaseAnonKey
        ? {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
          }
        : {},
    },
  }
);

// Database types for waitlist
export interface WaitlistEntry {
  id: string;
  email: string;
  created_at: string;
  source?: string;
}

