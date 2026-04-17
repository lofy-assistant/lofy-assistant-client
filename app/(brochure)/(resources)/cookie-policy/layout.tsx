import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Read Lofy AI's cookie policy to understand how we use cookies and similar technologies for authentication, analytics, preferences, and site functionality.",
  alternates: {
    canonical: "/cookie-policy",
  },
};

export default function CookiePolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
