"use client";

import Link from "next/link";
import styles from "./page.module.css";

export default function AboutPage() {
  return (
    <div className={styles.page}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>먹자</span>
            <span className={styles.logoText}>mukja</span>
          </Link>
          <div className={styles.navLinks}>
            <Link href="/#features" className={styles.navLink}>
              Features
            </Link>
            <Link href="/#how-it-works" className={styles.navLink}>
              How it Works
            </Link>
            <Link href="/waitlist" className={styles.navButton}>Join Waitlist</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>About Mukja</h1>
            <p className={styles.subtitle}>
              We&apos;re on a mission to end the eternal &ldquo;where should we eat?&rdquo; debate.
            </p>
          </div>

          <div className={styles.content}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Our Story</h2>
              <p className={styles.paragraph}>
                Mukja was born from a simple frustration: deciding where to eat with friends
                shouldn&apos;t be so hard. We&apos;ve all been there—endless group chats, conflicting
                preferences, and that moment when everyone just gives up and picks the same place
                they always do.
              </p>
              <p className={styles.paragraph}>
                We believe choosing a restaurant should be fun, collaborative, and quick. That&apos;s
                why we created Mukja—a game that turns restaurant discovery into an engaging
                experience where everyone has a voice.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>How It Works</h2>
              <p className={styles.paragraph}>
                Mukja combines the power of TripAdvisor&apos;s restaurant database with a simple
                swipe-to-vote game. Create a group, set your preferences, and let everyone swipe
                through curated restaurant options. When you&apos;re done, see where your group
                agrees and pick your perfect match.
              </p>
              <p className={styles.paragraph}>
                No more endless debates. No more defaulting to the same old spots. Just fun,
                fast, and fair restaurant discovery.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Our Mission</h2>
              <p className={styles.paragraph}>
                We&apos;re building Mukja to make dining decisions easier, more democratic, and more
                enjoyable. We want to help people discover new restaurants, try new cuisines, and
                create better shared experiences with friends and family.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Join Us</h2>
              <p className={styles.paragraph}>
                Mukja is currently in development. We&apos;re working hard to bring you the best
                restaurant discovery experience possible. Join our waitlist to be notified when we
                launch!
              </p>
              <Link href="/waitlist" className={styles.ctaButton}>
                Join the Waitlist
              </Link>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

