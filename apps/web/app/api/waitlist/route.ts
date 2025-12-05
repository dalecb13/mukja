import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const isDevelopment = process.env.NODE_ENV === "development";

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Supabase configuration missing:", {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      });
      return NextResponse.json(
        {
          message: "Server configuration error",
          ...(isDevelopment && { details: "Supabase environment variables are not set" }),
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, source } = body;

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

    // Insert into Supabase
    // Use RPC or direct insert with explicit headers for anonymous access
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

