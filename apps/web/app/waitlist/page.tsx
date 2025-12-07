"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import styles from "./page.module.css";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const captchaRef = useRef<HCaptcha>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Validate captcha
    if (!captchaToken) {
      setErrorMessage("Please complete the captcha verification");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, captchaToken, source: "waitlist-page" }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Waitlist API error:", {
          status: response.status,
          statusText: response.statusText,
          error: data,
        });
        throw new Error(data.message || data.details || "Something went wrong");
      }

      setStatus("success");
      setEmail("");
      setCaptchaToken(null);
      captchaRef.current?.resetCaptcha();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to join waitlist");
      console.error("Waitlist submission error:", err);
      captchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
    }
  };

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
  };

  const handleCaptchaError = () => {
    setCaptchaToken(null);
    setErrorMessage("Captcha verification failed. Please try again.");
  };

  const handleCaptchaExpire = () => {
    setCaptchaToken(null);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className={styles.page}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <Link href="/" className={styles.logo} onClick={closeMenu}>
            <span className={styles.logoIcon}>먹자</span>
            <span className={styles.logoText}>mukja</span>
          </Link>
          <button
            className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
          {isMenuOpen && (
            <div
              className={styles.menuOverlay}
              onClick={closeMenu}
              aria-hidden="true"
            />
          )}
          <div className={`${styles.navLinks} ${isMenuOpen ? styles.navLinksOpen : ""}`}>
            <Link href="/#features" className={styles.navLink} onClick={closeMenu}>
              Features
            </Link>
            <Link href="/#how-it-works" className={styles.navLink} onClick={closeMenu}>
              How it Works
            </Link>
            <Link href="/" className={styles.navButton} onClick={closeMenu}>
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Join the Waitlist</h1>
            <p className={styles.subtitle}>
              Be the first to know when Mukja launches. We&apos;ll notify you as soon as we&apos;re ready.
            </p>
          </div>

          {status === "success" ? (
            <div className={styles.successCard}>
              <div className={styles.successIcon}>🎉</div>
              <h2 className={styles.successTitle}>You&apos;re in!</h2>
              <p className={styles.successMessage}>
                Thanks for joining the waitlist. We&apos;ll send you an email when Mukja launches.
              </p>
              <Link href="/" className={styles.backButton}>
                Back to Home
              </Link>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  disabled={status === "loading"}
                  required
                />
              </div>

              <div className={styles.captchaWrapper}>
                <HCaptcha
                  sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || ""}
                  onVerify={handleCaptchaVerify}
                  onError={handleCaptchaError}
                  onExpire={handleCaptchaExpire}
                  ref={captchaRef}
                />
              </div>

              {status === "error" && (
                <div className={styles.errorMessage}>{errorMessage}</div>
              )}

              <button
                type="submit"
                className={styles.submitButton}
                disabled={status === "loading" || !captchaToken}
              >
                {status === "loading" ? "Joining..." : "Join Waitlist"}
              </button>

              <p className={styles.disclaimer}>
                By joining, you agree to receive updates about Mukja. No spam, ever.
              </p>
            </form>
          )}

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>500+</span>
              <span className={styles.statLabel}>People Waiting</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNumber}>10K+</span>
              <span className={styles.statLabel}>Decisions Made</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNumber}>4.9★</span>
              <span className={styles.statLabel}>App Rating</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

