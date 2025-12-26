"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <ProtectedRoute>
      <div style={{ minHeight: "100vh", backgroundColor: "#ffffff", padding: "20px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
            <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#000000", margin: 0 }}>
              Dashboard
            </h1>
            <button
              onClick={handleSignOut}
              style={{
                padding: "8px 16px",
                backgroundColor: "#ffffff",
                color: "#000000",
                border: "1px solid #000000",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </div>

          <div style={{ marginBottom: "32px", padding: "20px", border: "1px solid #000000" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#000000", marginBottom: "12px" }}>
              User Information
            </h2>
            {user && (
              <div>
                <p style={{ color: "#000000", marginBottom: "8px" }}>
                  <strong>Email:</strong> {user.email}
                </p>
                {user.email_confirmed_at ? (
                  <p style={{ color: "#000000", marginBottom: "8px" }}>
                    <strong>Email Status:</strong> Verified
                  </p>
                ) : (
                  <p style={{ color: "#666666", marginBottom: "8px" }}>
                    <strong>Email Status:</strong> Not verified - Please check your email
                  </p>
                )}
              </div>
            )}
          </div>

          <div style={{ padding: "20px", border: "1px solid #000000" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#000000", marginBottom: "12px" }}>
              Navigation
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Link
                href="/"
                style={{
                  display: "block",
                  padding: "12px",
                  border: "1px solid #000000",
                  color: "#000000",
                  textDecoration: "none",
                  fontSize: "16px",
                }}
              >
                Go to Landing Page
              </Link>
              <Link
                href="/about"
                style={{
                  display: "block",
                  padding: "12px",
                  border: "1px solid #000000",
                  color: "#000000",
                  textDecoration: "none",
                  fontSize: "16px",
                }}
              >
                About Mukja
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}


