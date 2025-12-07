import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerBrand}>
          <Link href="/" className={styles.footerLogo}>
            <span className={styles.logoIcon}>먹자</span>
            <span className={styles.logoText}>mukja</span>
          </Link>
          <p className={styles.footerTagline}>
            Decide where to eat, together.
          </p>
        </div>
        <div className={styles.footerLinks}>
          <div className={styles.footerLinkGroup}>
            <h4 className={styles.footerLinkTitle}>Product</h4>
            <Link href="/#features">Features</Link>
            <Link href="/#how-it-works">How it Works</Link>
            <Link href="#">Pricing</Link>
          </div>
          <div className={styles.footerLinkGroup}>
            <h4 className={styles.footerLinkTitle}>Company</h4>
            <Link href="#">About</Link>
            <Link href="#">Blog</Link>
            <Link href="#">Careers</Link>
          </div>
          <div className={styles.footerLinkGroup}>
            <h4 className={styles.footerLinkTitle}>Legal</h4>
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>© 2024 Mukja. All rights reserved.</p>
      </div>
    </footer>
  );
}

