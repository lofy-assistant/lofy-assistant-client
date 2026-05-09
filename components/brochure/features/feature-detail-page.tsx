import CTA from "@/components/brochure/home/cta";
import FeatureBreadcrumb from "@/components/brochure/features/feature-breadcrumb";
import FeatureHeader from "@/components/brochure/features/feature-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import type { BrochureFeature } from "@/lib/brochure-features";

type FeatureDetailPageProps = {
  feature: BrochureFeature;
};

export function FeatureDetailPage({ feature }: FeatureDetailPageProps) {
  const Icon = feature.icon;

  return (
    <div className="min-h-screen bg-marketing-bg">
      <section className="marketing-hero-bg relative overflow-hidden border-b border-marketing-border py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-8">
            <FeatureBreadcrumb featureName={feature.title} />
          </div>

          <div className="space-y-8">
            <FeatureHeader
              badge={`${feature.badge} · ${feature.eyebrow}`}
              title={feature.heroTitle}
              description={feature.heroDescription}
            />

            <div className="flex flex-wrap justify-center gap-2">
              {feature.overviewHighlights.map((highlight) => (
                <span
                  key={highlight}
                  className="inline-flex items-center rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-medium text-marketing-chip-text shadow-sm backdrop-blur-xl"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="marketing-section">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-lg border border-marketing-border bg-marketing-accent-soft text-marketing-accent-soft-foreground shadow-sm">
              <Icon className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-marketing-body-muted">
                Product snapshot
              </p>
              <h2 className="text-2xl font-semibold text-marketing-chat-assistant-text">
                How this feature shows up in the client today
              </h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {feature.stats.map((stat) => (
              <Card
                key={stat.label}
                className="marketing-card rounded-lg py-4"
              >
                <CardHeader className="pb-2">
                  <p className="text-[11px] font-semibold uppercase text-marketing-body-muted">
                    {stat.label}
                  </p>
                  <CardTitle className="text-2xl font-semibold text-marketing-chat-assistant-text">
                    {stat.value}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-marketing-body">{stat.helper}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-section-muted">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <Badge className="mb-4 border-marketing-border bg-marketing-chip-bg text-marketing-chip-text hover:bg-marketing-chip-bg">
              Built into the dashboard
            </Badge>
            <h2 className="text-3xl font-semibold text-marketing-chat-assistant-text">
              {feature.capabilityTitle}
            </h2>
            <p className="mt-3 text-base leading-7 text-marketing-body">
              {feature.capabilityDescription}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {feature.capabilityCards.map((card) => (
              <Card
                key={card.title}
                className="marketing-card rounded-lg py-4"
              >
                <CardHeader className="space-y-3">
                  {card.badge ? (
                    <Badge className="w-fit border-marketing-chip-border bg-marketing-chip-bg text-marketing-chip-text hover:bg-marketing-chip-bg">
                      {card.badge}
                    </Badge>
                  ) : null}
                  <CardTitle className="text-xl text-marketing-chat-assistant-text">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-marketing-body">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-section">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <Badge className="mb-4 border-marketing-border bg-marketing-accent-soft text-marketing-accent-soft-foreground hover:bg-marketing-accent-soft">
              Product flow
            </Badge>
            <h2 className="text-3xl font-semibold text-marketing-chat-assistant-text">
              {feature.workflowTitle}
            </h2>
            <p className="mt-3 text-base leading-7 text-marketing-body">
              {feature.workflowDescription}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {feature.steps.map((step, index) => (
              <Card
                key={step.title}
                className="marketing-card rounded-lg py-4"
              >
                <CardHeader className="space-y-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-lg bg-marketing-accent text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <CardTitle className="text-xl text-marketing-chat-assistant-text">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-marketing-body">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-section-muted">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <Badge className="mb-4 border-marketing-chip-border bg-marketing-chip-bg text-marketing-chip-text hover:bg-marketing-chip-bg">
              Why it matters
            </Badge>
            <h2 className="text-3xl font-semibold text-marketing-chat-assistant-text">
              {feature.valueTitle}
            </h2>
            <p className="mt-3 text-base leading-7 text-marketing-body">
              {feature.valueDescription}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {feature.valueCards.map((card) => (
              <Card
                key={card.title}
                className="marketing-card rounded-lg py-4"
              >
                <CardHeader>
                  <CardTitle className="text-xl text-marketing-chat-assistant-text">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-marketing-body">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-section">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
            <Card className="marketing-card rounded-lg py-4">
              <CardHeader>
                <Badge className="w-fit border-marketing-border bg-marketing-accent-soft text-marketing-accent-soft-foreground hover:bg-marketing-accent-soft">
                  Available now
                </Badge>
                <CardTitle className="text-2xl text-marketing-chat-assistant-text">
                  What users can already do
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {feature.availableNow.map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-lg border border-marketing-border bg-white/75 px-4 py-3"
                  >
                    <CheckCircle2
                      className="mt-0.5 size-4 shrink-0 text-marketing-accent"
                      aria-hidden
                    />
                    <p className="text-sm leading-6 text-marketing-body">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="marketing-card rounded-lg py-4">
              <CardHeader>
                <Badge className="w-fit border-marketing-chip-border bg-marketing-chip-bg text-marketing-chip-text hover:bg-marketing-chip-bg">
                  Roadmap shape
                </Badge>
                <CardTitle className="text-2xl text-marketing-chat-assistant-text">
                  What this page should say next
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(feature.comingNext ?? [
                  "The current brochure copy should stay anchored to what is live, then introduce expansions as an extension of the same product surface.",
                ]).map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-marketing-border bg-white/75 px-4 py-3 text-sm leading-6 text-marketing-body"
                  >
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <CTA />
    </div>
  );
}
