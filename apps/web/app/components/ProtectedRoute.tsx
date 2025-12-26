"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || !session) {
        router.push("/login");
        return;
      }

      // Check if email is verified (required for full access)
      if (!user.email_confirmed_at) {
        // User is logged in but email is not verified
        // You could redirect to a verification page here, or allow access with a banner
        // For now, we'll allow access but this can be customized
      }
    }
  }, [user, session, loading, router]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#ffffff" }}>
        <div style={{ color: "#000000", fontSize: "16px" }}>Loading...</div>
      </div>
    );
  }

  if (!user || !session) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
}


