"use client";

import Link from "next/link";
import styles from "./page.module.css";

export default function LandingPage() {
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
            <Link href="/waitlist" className={styles.navButton}>Join Waitlist</Link>
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
          <Link href="/waitlist" className={styles.ctaPrimary}>
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
          </Link>
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
          <Link href="/waitlist" className={styles.ctaSubmitButton}>
            Join Waitlist
          </Link>
        </div>
      </section>
    </div>
  );
}
