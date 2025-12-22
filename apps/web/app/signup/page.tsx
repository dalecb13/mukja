"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp, signInWithOAuth } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
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

    const { error } = await signUp(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider: "google" | "apple") => {
    setError(null);
    await signInWithOAuth(provider);
  };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backgroundColor: "#ffffff" }}>
        <div style={{ width: "100%", maxWidth: "400px", textAlign: "center" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "16px", color: "#000000" }}>
            Check your email
          </h1>
          <p style={{ marginBottom: "24px", color: "#666666" }}>
            We've sent you a confirmation email. Please click the link in the email to verify your account.
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
          Sign Up
        </h1>
        <p style={{ marginBottom: "32px", color: "#666666" }}>
          Create a new account
        </p>

        {error && (
          <div style={{ padding: "12px", marginBottom: "24px", backgroundColor: "#f5f5f5", border: "1px solid #000000", color: "#000000" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
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

          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="password" style={{ display: "block", marginBottom: "8px", color: "#000000", fontSize: "14px" }}>
              Password
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
              Confirm Password
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
              marginBottom: "16px",
            }}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div style={{ marginBottom: "16px", textAlign: "center", color: "#666666" }}>
          or
        </div>

        <button
          onClick={() => handleOAuthSignUp("google")}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#ffffff",
            color: "#000000",
            border: "1px solid #000000",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: "12px",
          }}
        >
          Sign up with Google
        </button>

        <button
          onClick={() => handleOAuthSignUp("apple")}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#ffffff",
            color: "#000000",
            border: "1px solid #000000",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: "24px",
          }}
        >
          Sign up with Apple
        </button>

        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "#666666" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#000000", textDecoration: "underline" }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
