import Link from "next/link";

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff", padding: "40px 20px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ marginBottom: "32px" }}>
          <Link href="/" style={{ color: "#000000", textDecoration: "underline", fontSize: "14px" }}>
            ← Back to Home
          </Link>
        </div>

        <h1 style={{ fontSize: "48px", fontWeight: "bold", color: "#000000", marginBottom: "24px" }}>
          About Mukja
        </h1>

        <div style={{ fontSize: "18px", lineHeight: "1.8", color: "#000000", marginBottom: "32px" }}>
          <p style={{ marginBottom: "24px" }}>
            Mukja (먹자) is a social dining decision app that transforms the age-old question of "where should we eat?" into a fun, collaborative experience.
          </p>

          <h2 style={{ fontSize: "32px", fontWeight: "600", color: "#000000", marginBottom: "16px", marginTop: "32px" }}>
            Our Mission
          </h2>
          <p style={{ marginBottom: "24px" }}>
            We believe that deciding where to eat together should be enjoyable, not frustrating. Mukja turns restaurant selection into a game where everyone gets to participate and discover new favorites.
          </p>

          <h2 style={{ fontSize: "32px", fontWeight: "600", color: "#000000", marginBottom: "16px", marginTop: "32px" }}>
            How It Works
          </h2>
          <ol style={{ paddingLeft: "24px", marginBottom: "24px" }}>
            <li style={{ marginBottom: "12px" }}>
              <strong>Create a Game:</strong> Start a new dining game with your group. Set your preferences - cuisine type, location, budget, and more.
            </li>
            <li style={{ marginBottom: "12px" }}>
              <strong>Everyone Swipes:</strong> Each person in your group swipes through restaurant options. Swipe right for yes, left for no. Your votes are private until everyone's done.
            </li>
            <li style={{ marginBottom: "12px" }}>
              <strong>Discover Matches:</strong> See which restaurants your group agrees on. View match percentages and pick the perfect spot together.
            </li>
          </ol>

          <h2 style={{ fontSize: "32px", fontWeight: "600", color: "#000000", marginBottom: "16px", marginTop: "32px" }}>
            Features
          </h2>
          <ul style={{ paddingLeft: "24px", marginBottom: "24px" }}>
            <li style={{ marginBottom: "12px" }}>
              <strong>Group Creation:</strong> Create groups with friends, family, or coworkers for recurring dinner plans.
            </li>
            <li style={{ marginBottom: "12px" }}>
              <strong>Smart Search:</strong> Search restaurants by cuisine, location, price range, and more using TripAdvisor's extensive database.
            </li>
            <li style={{ marginBottom: "12px" }}>
              <strong>Game Mode:</strong> Make restaurant selection fun with our swipe-based voting system.
            </li>
            <li style={{ marginBottom: "12px" }}>
              <strong>Results & Analytics:</strong> See where your group agrees and make informed decisions together.
            </li>
          </ul>

          <h2 style={{ fontSize: "32px", fontWeight: "600", color: "#000000", marginBottom: "16px", marginTop: "32px" }}>
            Join Us
          </h2>
          <p style={{ marginBottom: "24px" }}>
            Ready to end the "where should we eat?" debate forever? Join the waitlist to be the first to know when Mukja launches.
          </p>

          <div style={{ marginTop: "40px" }}>
            <Link
              href="/waitlist"
              style={{
                display: "inline-block",
                padding: "12px 24px",
                backgroundColor: "#000000",
                color: "#ffffff",
                textDecoration: "none",
                fontSize: "16px",
                fontWeight: "600",
                marginRight: "16px",
              }}
            >
              Join Waitlist
            </Link>
            <Link
              href="/"
              style={{
                display: "inline-block",
                padding: "12px 24px",
                backgroundColor: "#ffffff",
                color: "#000000",
                border: "1px solid #000000",
                textDecoration: "none",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
