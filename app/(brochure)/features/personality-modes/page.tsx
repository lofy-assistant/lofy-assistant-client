import { Metadata } from "next";
import FeatureBreadcrumb from "@/components/brochure/features/feature-breadcrumb";
import FeatureHeader from "@/components/brochure/features/feature-header";

export const metadata: Metadata = {
  title: "Personality Modes Feature",
  description:
    "Meet A.T.L.A.S, Brad, Lexi, and Rocco: four Lofy personas you can switch anytime so your assistant matches your mood.",
  alternates: {
    canonical: "/features/personality-modes",
  },
};

import CTA from "@/components/brochure/home/cta";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PERSONA_MARKETING_LIST } from "@/lib/persona";

export default function PersonalityModesPage() {
  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 bg-background">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-8">
            <FeatureBreadcrumb featureName="Personality Modes" />
          </div>
          <FeatureHeader
            badge="🎭 Adaptive AI"
            title="Personality Modes"
            description="An AI assistant that truly understands you. Lofy adapts its voice (A.T.L.A.S, Brad, Lexi, or Rocco) to match your context, mood, and preferences."
          />
        </div>
      </section>

      {/* Personality Cards Section */}
      <section className="relative py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">🎭 Choose Your Style</Badge>
            <h2 className="text-4xl font-bold mb-4">Your AI, Your Personality</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Switch between modes instantly or let Lofy adapt based on context.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PERSONA_MARKETING_LIST.map((p) => (
              <Card
                key={p.value}
                className={`${p.colorClass} border-2 hover:scale-[1.02] transition-transform py-4`}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{p.heroEmoji}</div>
                    <CardTitle className="text-2xl">{p.cardTitle}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-base">{p.description}</CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {p.examples.map((example) => (
                      <span
                        key={example}
                        className="text-xs px-2 py-1 bg-background/50 rounded-full"
                      >
                        &quot;{example}&quot;
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Context Section */}
      <section className="relative py-16 bg-background">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">✨ Why Personality Matters</Badge>
            <h2 className="text-4xl font-bold mb-4">More Than Just an Assistant</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Different moods call for different vibes. Pick the persona that matches your energy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="py-4">
              <CardHeader>
                <CardTitle>🎯 Stay on Track</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Need steady, honest support? Try Lexi. Want sharp clarity and structure? A.T.L.A.S has you covered. Match Lofy to what keeps you productive.
                </p>
              </CardContent>
            </Card>

            <Card className="py-4">
              <CardHeader>
                <CardTitle>😂 Enjoy the Banter</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Brad brings bro energy and light teasing; Rocco turns up the wit on the mic, always playful, never punching down.
                </p>
              </CardContent>
            </Card>

            <Card className="py-4">
              <CardHeader>
                <CardTitle>🔄 Switch Anytime</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Change personas on the fly in settings or by asking Lofy to switch to Brad, Lexi, Rocco, or A.T.L.A.S.
                </p>
              </CardContent>
            </Card>

            <Card className="py-4">
              <CardHeader>
                <CardTitle>💬 Consistent Character</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Each persona keeps its voice across reminders, memories, and conversations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Getting personalized responses is effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                1️⃣
              </div>
              <h3 className="text-xl font-bold mb-2">Pick Your Vibe</h3>
              <p className="text-muted-foreground">
                Choose A.T.L.A.S, Brad, Lexi, or Rocco in settings, or just tell Lofy who you want today.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                2️⃣
              </div>
              <h3 className="text-xl font-bold mb-2">Lofy Transforms</h3>
              <p className="text-muted-foreground">
                Watch Lofy&apos;s tone and style shift to match your chosen persona.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                3️⃣
              </div>
              <h3 className="text-xl font-bold mb-2">Mix It Up</h3>
              <p className="text-muted-foreground">
                Feeling playful? Brad or Rocco. Need calm smarts? A.T.L.A.S. Want your bestie? Lexi.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </div>
  );
}
