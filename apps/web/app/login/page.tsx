"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithOAuth } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleOAuthSignIn = async (provider: "google" | "apple") => {
    setError(null);
    await signInWithOAuth(provider);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backgroundColor: "#ffffff" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "8px", color: "#000000" }}>
          Login
        </h1>
        <p style={{ marginBottom: "32px", color: "#666666" }}>
          Sign in to your account
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

          <div style={{ marginBottom: "24px" }}>
            <label htmlFor="password" style={{ display: "block", marginBottom: "8px", color: "#000000", fontSize: "14px" }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{ marginBottom: "16px", textAlign: "center", color: "#666666" }}>
          or
        </div>

        <button
          onClick={() => handleOAuthSignIn("google")}
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
          Sign in with Google
        </button>

        <button
          onClick={() => handleOAuthSignIn("apple")}
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
          Sign in with Apple
        </button>

        <div style={{ textAlign: "center", fontSize: "14px" }}>
          <Link href="/reset-password" style={{ color: "#000000", textDecoration: "underline" }}>
            Forgot password?
          </Link>
        </div>

        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "#666666" }}>
          Don't have an account?{" "}
          <Link href="/signup" style={{ color: "#000000", textDecoration: "underline" }}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}


