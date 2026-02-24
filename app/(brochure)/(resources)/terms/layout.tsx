import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read Lofy AI's terms of service to understand the rules and guidelines for using our platform.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
