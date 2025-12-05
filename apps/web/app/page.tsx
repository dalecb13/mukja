"use client";

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
            <button className={styles.navButton}>Get the App</button>
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
            No more "I don't know, where do you want to eat?"
          </div>
          <h1 className={styles.heroTitle}>
            Decide where to eat,
            <br />
            <span className={styles.heroTitleAccent}>together.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Mukja turns the eternal dining debate into a fun game. Search
            restaurants, swipe with friends, and discover your group's perfect
            match.
          </p>
          <div className={styles.heroCta}>
            <button className={styles.ctaPrimary}>
              <span>Start Playing</span>
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
            </button>
            <button className={styles.ctaSecondary}>Learn More</button>
          </div>
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
                <span className={styles.mockupTitle}>Tonight's Pick</span>
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
                TripAdvisor's extensive database.
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
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            Ready to end the
            <br />
            <span className={styles.ctaTitleAccent}>"where should we eat?"</span>
            <br />
            debate forever?
          </h2>
          <p className={styles.ctaSubtitle}>
            Download Mukja and start discovering restaurants with your friends
            today.
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.appStoreButton}>
              <svg
                className={styles.appStoreIcon}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className={styles.appStoreText}>
                <span className={styles.appStoreLabel}>Download on the</span>
                <span className={styles.appStoreName}>App Store</span>
              </div>
            </button>
            <button className={styles.playStoreButton}>
              <svg
                className={styles.playStoreIcon}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm3.35-4.31c.34.27.54.68.54 1.19 0 .51-.2.92-.54 1.19l-2.5 1.5-2.5-2.5 2.5-2.5 2.5 1.12zM6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z" />
              </svg>
              <div className={styles.playStoreText}>
                <span className={styles.playStoreLabel}>Get it on</span>
                <span className={styles.playStoreName}>Google Play</span>
              </div>
            </button>
          </div>
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
