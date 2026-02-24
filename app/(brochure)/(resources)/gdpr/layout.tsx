import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GDPR Compliance",
  description: "Learn how Lofy AI complies with GDPR regulations and protects the data rights of users in the European Union.",
  alternates: {
    canonical: "/gdpr",
  },
};

export default function GdprLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
