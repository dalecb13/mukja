import type { Metadata } from "next";
import "../styles/global.css";
import { AuthProvider } from "./contexts/AuthContext";

export const metadata: Metadata = {
  title: "Mukja - Let's Eat Together",
  description:
    "Discover restaurants with friends. Play, vote, and find the perfect place to eat together.",
  keywords: ["restaurants", "food", "friends", "dining", "discovery"],
  openGraph: {
    title: "Mukja - Let's Eat Together",
    description:
      "Discover restaurants with friends. Play, vote, and find the perfect place to eat together.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
