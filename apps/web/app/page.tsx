"use client";

import { useState, useRef } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import styles from "./page.module.css";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const heroCaptchaRef = useRef<HCaptcha>(null);
  const ctaCaptchaRef = useRef<HCaptcha>(null);

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
        body: JSON.stringify({ email, captchaToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Log full error details to console for debugging
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
      // Reset both captchas
      heroCaptchaRef.current?.resetCaptcha();
      ctaCaptchaRef.current?.resetCaptcha();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to join waitlist");
      // Log error to console for debugging
      console.error("Waitlist submission error:", err);
      // Reset captcha on error
      heroCaptchaRef.current?.resetCaptcha();
      ctaCaptchaRef.current?.resetCaptcha();
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
  return (
    <div className={styles.page}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <a href="/" className={styles.logo}>
            <span className={styles.logoIcon}>먹자</span>
            <span className={styles.logoText}>mukja</span>
          </a>
          <div className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>
              Features
            </a>
            <a href="#how-it-works" className={styles.navLink}>
              How it Works
            </a>
            <a href="#waitlist" className={styles.navButton}>Join Waitlist</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroGradient} />
          <div className={styles.heroPattern} />
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>
            <span className={styles.heroTagIcon}>🍜</span>
            No more &ldquo;I don&apos;t know, where do you want to eat?&rdquo;
          </div>
          <h1 className={styles.heroTitle}>
            Decide where to eat,
            <br />
            <span className={styles.heroTitleAccent}>together.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Mukja turns the eternal dining debate into a fun game. Search
            restaurants, swipe with friends, and discover your group&apos;s perfect
            match.
          </p>
          <form className={styles.heroForm} onSubmit={handleSubmit}>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.emailInput}
                disabled={status === "loading" || status === "success"}
                required
              />
              <button
                type="submit"
                className={styles.ctaPrimary}
                disabled={status === "loading" || status === "success"}
              >
                {status === "loading" ? (
                  "Joining..."
                ) : status === "success" ? (
                  "You're in! ✓"
                ) : (
                  <>
                    <span>Join Waitlist</span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
            <div className={styles.captchaWrapper}>
              <HCaptcha
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || ""}
                onVerify={handleCaptchaVerify}
                onError={handleCaptchaError}
                onExpire={handleCaptchaExpire}
                ref={heroCaptchaRef}
              />
            </div>
            {status === "error" && (
              <p className={styles.errorMessage}>{errorMessage}</p>
            )}
            {status === "success" && (
              <p className={styles.successMessage}>
                🎉 Thanks for joining! We&apos;ll notify you when Mukja launches.
              </p>
            )}
          </form>
          <p className={styles.heroDisclaimer}>
            Join 500+ foodies on the waitlist. No spam, ever.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>10K+</span>
              <span className={styles.heroStatLabel}>Decisions Made</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>500+</span>
              <span className={styles.heroStatLabel}>Groups Created</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>4.9★</span>
              <span className={styles.heroStatLabel}>App Rating</span>
            </div>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.phoneFrame}>
            <div className={styles.phoneMockup}>
              <div className={styles.mockupHeader}>
                <span className={styles.mockupTitle}>Tonight&apos;s Pick</span>
                <span className={styles.mockupSubtitle}>Swipe to vote!</span>
              </div>
              <div className={styles.mockupCard}>
                <div className={styles.mockupCardImage}>
                  <span className={styles.mockupEmoji}>🍕</span>
                </div>
                <div className={styles.mockupCardContent}>
                  <span className={styles.mockupCardName}>Pizzeria Luna</span>
                  <span className={styles.mockupCardMeta}>
                    Italian • $$$ • 0.3mi
                  </span>
                  <div className={styles.mockupCardRating}>
                    <span>★★★★★</span>
                    <span className={styles.mockupCardReviews}>
                      (2,847 reviews)
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.mockupActions}>
                <button className={styles.mockupActionNo}>✕</button>
                <button className={styles.mockupActionYes}>♥</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.featuresContent}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Features</span>
            <h2 className={styles.sectionTitle}>
              Everything you need to
              <br />
              stop the dinner debate
            </h2>
          </div>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div
                className={styles.featureIcon}
                style={{ background: "var(--color-primary-100)" }}
              >
                <span>🎮</span>
              </div>
              <h3 className={styles.featureTitle}>Game Mode</h3>
              <p className={styles.featureDescription}>
                Turn restaurant selection into a fun swipe game. Everyone votes,
                matches are revealed.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div
                className={styles.featureIcon}
                style={{ background: "var(--color-accent-100)" }}
              >
                <span>👥</span>
              </div>
              <h3 className={styles.featureTitle}>Groups</h3>
              <p className={styles.featureDescription}>
                Create groups with friends, family, or coworkers. Perfect for
                recurring dinner plans.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div
                className={styles.featureIcon}
                style={{ background: "var(--color-warm-100)" }}
              >
                <span>🔍</span>
              </div>
              <h3 className={styles.featureTitle}>Smart Search</h3>
              <p className={styles.featureDescription}>
                Search by cuisine, location, price, and more. Powered by
                TripAdvisor&apos;s extensive database.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div
                className={styles.featureIcon}
                style={{ background: "var(--color-secondary-200)" }}
              >
                <span>📊</span>
              </div>
              <h3 className={styles.featureTitle}>Results</h3>
              <p className={styles.featureDescription}>
                See where your group agrees. View match percentages and make the
                final call together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={styles.howItWorks}>
        <div className={styles.howItWorksContent}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>How It Works</span>
            <h2 className={styles.sectionTitle}>
              Three steps to
              <br />
              dinner harmony
            </h2>
          </div>
          <div className={styles.stepsGrid}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Create a Game</h3>
              <p className={styles.stepDescription}>
                Start a new game solo or with your group. Set your search
                criteria—cuisine type, distance, budget.
              </p>
            </div>
            <div className={styles.stepArrow}>→</div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>Everyone Swipes</h3>
              <p className={styles.stepDescription}>
                Each person swipes through restaurants. Right for yes, left for
                no. Votes are private until the reveal.
              </p>
            </div>
            <div className={styles.stepArrow}>→</div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>See Your Match</h3>
              <p className={styles.stepDescription}>
                Discover which restaurants everyone agreed on. Pick your top
                match and go eat!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="waitlist" className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            Ready to end the
            <br />
            <span className={styles.ctaTitleAccent}>&ldquo;where should we eat?&rdquo;</span>
            <br />
            debate forever?
          </h2>
          <p className={styles.ctaSubtitle}>
            Be the first to know when Mukja launches. Join the waitlist today.
          </p>
          <form className={styles.ctaForm} onSubmit={handleSubmit}>
            <div className={styles.ctaInputWrapper}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.ctaEmailInput}
                disabled={status === "loading" || status === "success"}
                required
              />
              <button
                type="submit"
                className={styles.ctaSubmitButton}
                disabled={status === "loading" || status === "success"}
              >
                {status === "loading"
                  ? "Joining..."
                  : status === "success"
                  ? "You're in! ✓"
                  : "Join Waitlist"}
              </button>
            </div>
            <div className={styles.captchaWrapper}>
              <HCaptcha
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || ""}
                onVerify={handleCaptchaVerify}
                onError={handleCaptchaError}
                onExpire={handleCaptchaExpire}
                ref={ctaCaptchaRef}
              />
            </div>
            {status === "error" && (
              <p className={styles.ctaErrorMessage}>{errorMessage}</p>
            )}
            {status === "success" && (
              <p className={styles.ctaSuccessMessage}>
                🎉 You&apos;re on the list! We&apos;ll be in touch soon.
              </p>
            )}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <a href="/" className={styles.footerLogo}>
              <span className={styles.logoIcon}>먹자</span>
              <span className={styles.logoText}>mukja</span>
            </a>
            <p className={styles.footerTagline}>
              Decide where to eat, together.
            </p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerLinkGroup}>
              <h4 className={styles.footerLinkTitle}>Product</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How it Works</a>
              <a href="#">Pricing</a>
            </div>
            <div className={styles.footerLinkGroup}>
              <h4 className={styles.footerLinkTitle}>Company</h4>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
            </div>
            <div className={styles.footerLinkGroup}>
              <h4 className={styles.footerLinkTitle}>Legal</h4>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2024 Mukja. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
