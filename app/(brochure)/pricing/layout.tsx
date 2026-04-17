import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Lofy pricing: Pro from $4.99 / RM14.99 with context-aware AI, RAG knowledge base, integrations, and friends; Premium adds recipes and an execution agent; Enterprise is contact-based with SLA-style support, SSO path, and custom rollout.",
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
