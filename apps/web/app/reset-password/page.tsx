"use client";

import { useState, FormEvent, Suspense } from "react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // If there's a token, we're resetting the password (from email link)
  // Otherwise, we're requesting a password reset email
  const isResettingPassword = !!token;

  const handleRequestReset = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    // TODO: Implement password update with token
    // This would typically use supabase.auth.updateUser() after verifying the token
    setError("Password reset with token not yet implemented. Please use the reset link from your email.");
    setLoading(false);
  };

  if (success && !isResettingPassword) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backgroundColor: "#ffffff" }}>
        <div style={{ width: "100%", maxWidth: "400px", textAlign: "center" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "16px", color: "#000000" }}>
            Check your email
          </h1>
          <p style={{ marginBottom: "24px", color: "#666666" }}>
            We've sent you a password reset link. Please check your email and click the link to reset your password.
          </p>
          <Link href="/login" style={{ color: "#000000", textDecoration: "underline" }}>
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backgroundColor: "#ffffff" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "8px", color: "#000000" }}>
          {isResettingPassword ? "Reset Password" : "Forgot Password"}
        </h1>
        <p style={{ marginBottom: "32px", color: "#666666" }}>
          {isResettingPassword
            ? "Enter your new password"
            : "Enter your email address and we'll send you a link to reset your password"}
        </p>

        {error && (
          <div style={{ padding: "12px", marginBottom: "24px", backgroundColor: "#f5f5f5", border: "1px solid #000000", color: "#000000" }}>
            {error}
          </div>
        )}

        <form onSubmit={isResettingPassword ? handleResetPassword : handleRequestReset}>
          {!isResettingPassword && (
            <div style={{ marginBottom: "24px" }}>
              <label htmlFor="email" style={{ display: "block", marginBottom: "8px", color: "#000000", fontSize: "14px" }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #000000",
                  backgroundColor: "#ffffff",
                  color: "#000000",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          )}

          {isResettingPassword && (
            <>
              <div style={{ marginBottom: "20px" }}>
                <label htmlFor="password" style={{ display: "block", marginBottom: "8px", color: "#000000", fontSize: "14px" }}>
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #000000",
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    fontSize: "16px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label htmlFor="confirmPassword" style={{ display: "block", marginBottom: "8px", color: "#000000", fontSize: "14px" }}>
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #000000",
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    fontSize: "16px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: loading ? "#999999" : "#000000",
              color: "#ffffff",
              border: "none",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: "24px",
            }}
          >
            {loading
              ? isResettingPassword
                ? "Resetting password..."
                : "Sending email..."
              : isResettingPassword
              ? "Reset Password"
              : "Send Reset Link"}
          </button>
        </form>

        <div style={{ textAlign: "center", fontSize: "14px" }}>
          <Link href="/login" style={{ color: "#000000", textDecoration: "underline" }}>
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backgroundColor: "#ffffff" }}>
        <div style={{ color: "#000000", fontSize: "16px" }}>Loading...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
