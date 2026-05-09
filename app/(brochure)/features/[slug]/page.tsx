import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { FeatureDetailPage } from "@/components/brochure/features/feature-detail-page";
import {
  BROCHURE_FEATURES,
  getBrochureFeature,
  LEGACY_FEATURE_REDIRECTS,
} from "@/lib/brochure-features";

type FeatureDetailRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return BROCHURE_FEATURES.map((feature) => ({
    slug: feature.slug,
  }));
}

export async function generateMetadata({
  params,
}: FeatureDetailRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const redirectedSlug = LEGACY_FEATURE_REDIRECTS[slug];
  const feature = getBrochureFeature(redirectedSlug ?? slug);

  if (!feature) {
    return {
      title: "Feature",
    };
  }

  return {
    title: feature.metadataTitle,
    description: feature.metadataDescription,
    alternates: {
      canonical: feature.href,
    },
  };
}

export default async function FeatureDetailRoute({
  params,
}: FeatureDetailRouteProps) {
  const { slug } = await params;
  const redirectedSlug = LEGACY_FEATURE_REDIRECTS[slug];

  if (redirectedSlug) {
    redirect(`/features/${redirectedSlug}`);
  }

  const feature = getBrochureFeature(slug);

  if (!feature) {
    notFound();
  }

  return <FeatureDetailPage feature={feature} />;
}
