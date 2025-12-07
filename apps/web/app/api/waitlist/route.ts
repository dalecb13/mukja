import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

const isDevelopment = process.env.NODE_ENV === "development";

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    // Support both legacy (anon) and new (publishable) key naming
    const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const hasPublishableKey = !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const hasKey = hasAnonKey || hasPublishableKey;
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !hasKey) {
      console.error("Supabase configuration missing:", {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey,
        hasPublishableKey,
      });
      return NextResponse.json(
        {
          message: "Server configuration error",
          ...(isDevelopment && { 
            details: "Supabase environment variables are not set. " +
              "Required: NEXT_PUBLIC_SUPABASE_URL and " +
              "NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY). " +
              "IMPORTANT: Use the PUBLISHABLE key (not the secret key) for RLS policies to work."
          }),
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, source, captchaToken } = body;

    // Verify hCaptcha token
    if (!captchaToken) {
      return NextResponse.json(
        { message: "Captcha verification required" },
        { status: 400 }
      );
    }

    // Verify captcha with hCaptcha API
    const captchaSecret = process.env.HCAPTCHA_SECRET_KEY;
    if (!captchaSecret) {
      console.error("HCAPTCHA_SECRET_KEY is not set");
      return NextResponse.json(
        {
          message: "Server configuration error",
          ...(isDevelopment && { details: "hCaptcha secret key is not configured" }),
        },
        { status: 500 }
      );
    }

    try {
      const captchaResponse = await fetch("https://hcaptcha.com/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: captchaSecret,
          response: captchaToken,
        }),
      });

      const captchaData = await captchaResponse.json();

      if (!captchaData.success) {
        console.error("hCaptcha verification failed:", captchaData);
        return NextResponse.json(
          {
            message: "Captcha verification failed",
            ...(isDevelopment && { details: "Invalid or expired captcha token" }),
          },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error("hCaptcha API error:", error);
      return NextResponse.json(
        {
          message: "Captcha verification error",
          ...(isDevelopment && { details: "Failed to verify captcha" }),
        },
        { status: 500 }
      );
    }

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create a fresh Supabase client for this request
    const supabase = createServerClient();

    // Debug: Log configuration (only in development)
    if (isDevelopment) {
      const keyUsed = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
      console.log("Supabase config check:", {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasPublishableKey: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        urlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20),
        keyPrefix: keyUsed?.substring(0, 10),
        keyLength: keyUsed?.length,
        keyType: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "ANON_KEY" : "PUBLISHABLE_KEY",
      });
    }

    // Sign in anonymously to create a proper session for RLS
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously();

    if (authError) {
      console.error("Anonymous sign-in error:", {
        code: authError.status,
        message: authError.message,
      });
      return NextResponse.json(
        {
          message: "Authentication error",
          ...(isDevelopment && {
            details: "Failed to sign in anonymously. Check Supabase configuration.",
            error: authError.message,
          }),
        },
        { status: 500 }
      );
    }

    if (isDevelopment) {
      console.log("Anonymous sign-in successful:", {
        userId: authData.user?.id,
        hasSession: !!authData.session,
      });
    }

    // Insert into Supabase using the authenticated session
    const { data, error } = await supabase
      .from("waitlist")
      .insert([
        {
          email: email.toLowerCase().trim(),
          source: source || "website",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error details:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });

      // Handle duplicate email (PostgreSQL unique constraint)
      if (error.code === "23505") {
        return NextResponse.json(
          { message: "You're already on the waitlist!" },
          { status: 409 }
        );
      }

      // Handle missing table (common setup issue)
      if (error.code === "42P01") {
        return NextResponse.json(
          {
            message: "Database table not found",
            ...(isDevelopment && {
              details: "The 'waitlist' table does not exist. Please run the SQL setup from WAITLIST_SETUP.md",
            }),
          },
          { status: 500 }
        );
      }

      // Handle authentication errors (401)
      if (error.message?.includes("JWT") || error.message?.includes("401") || error.code === "PGRST301") {
        return NextResponse.json(
          {
            message: "Authentication error",
            ...(isDevelopment && {
              details: "Supabase authentication failed. Check that NEXT_PUBLIC_SUPABASE_ANON_KEY is set correctly.",
              error: error.message,
            }),
          },
          { status: 401 }
        );
      }

      // Handle RLS policy issues
      if (error.code === "42501" || error.message?.includes("permission denied")) {
        return NextResponse.json(
          {
            message: "Database permission error",
            ...(isDevelopment && {
              details: "Row Level Security policy may be blocking inserts. Check your Supabase RLS policies.",
            }),
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          message: "Failed to join waitlist",
          ...(isDevelopment && {
            details: error.message,
            code: error.code,
          }),
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Successfully joined waitlist", data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Waitlist error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        message: "Internal server error",
        ...(isDevelopment && { details: errorMessage }),
      },
      { status: 500 }
    );
  }
}

