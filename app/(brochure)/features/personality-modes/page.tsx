import { Metadata } from "next";
import FeatureBreadcrumb from "@/components/brochure/features/feature-breadcrumb";
import FeatureHeader from "@/components/brochure/features/feature-header";

export const metadata: Metadata = {
  title: "Personality Modes Feature",
  description: "Choose how Lofy AI interacts with you by selecting different personality modes tailored to your preferences.",
  alternates: {
    canonical: "/features/personality-modes",
  },
};

import CTA from "@/components/brochure/home/cta";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PersonalityModesPage() {
  const personalities = [
    {
      name: "Hope",
      emoji: "🌱",
      description: "Optimistic, resilient, and steady. Guides you through uncertainty with clarity and hope. Calm under pressure, encouraging but realistic—the most persistent mind in the room, not the loudest.",
      color: "bg-green-500/10 border-green-500/20",
      examples: ["Reminder set. One less thing to carry.", "There are risks involved. But none of them are irreversible.", "Let's break this down and move one step forward."],
    },
    {
      name: "Sassy",
      emoji: "💅",
      description: "Confident, playful, and slightly sassy. Your bestie with boundaries—light sass, friendly tone, and quick help. Teases the situation, never the person.",
      color: "bg-pink-500/10 border-pink-500/20",
      examples: ["Wow. Bold of you to rely on me again. Done.", "Okay okay, reminder set — relax.", "I got you. As usual."],
    },
    {
      name: "Chancellor",
      emoji: "👔",
      description: "Discreet, loyal, and composed. A trusted advisor who speaks with quiet confidence. Measured, thoughtful, and tactful—serves with good judgment, not enthusiasm.",
      color: "bg-purple-500/10 border-purple-500/20",
      examples: ["Reminder set. I'll hold you to it.", "Added to calendar. You have a tight window tomorrow — worth noting.", "Memory stored. I'll remember."],
    },
    {
      name: "ATLAS",
      emoji: "🧠",
      description: "Composed, highly intelligent, and efficient. Cuts through the noise with clarity and precision. Calm, articulate, and confident—an intelligent partner who anticipates your needs.",
      color: "bg-slate-500/10 border-slate-500/20",
      examples: ["Reminder set for 3 PM. You're clear until then.", "Added to calendar. You've got three events back-to-back tomorrow — buffer time might help.", "Memory stored. I'll remember that."],
    },
  ];

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
            description="An AI assistant that truly understands you. Lofy adapts its communication style to match your needs, context, and preferences."
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
              Switch between modes instantly or let Lofy automatically adapt based on context.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {personalities.map((personality) => (
              <Card key={personality.name} className={`${personality.color} border-2 hover:scale-[1.02] transition-transform py-4`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{personality.emoji}</div>
                    <CardTitle className="text-2xl">{personality.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-base">
                    {personality.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {personality.examples.map((example) => (
                      <span key={example} className="text-xs px-2 py-1 bg-background/50 rounded-full">
                        "{example}"
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
              Different moods call for different vibes. Pick the personality that matches your energy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="py-4">
              <CardHeader>
                <CardTitle>🎯 Stay Motivated</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Need a steady guide through uncertainty? Go Hope. Need a composed, efficient partner? Go ATLAS. Match Lofy's energy to what keeps you productive.
                </p>
              </CardContent>
            </Card>

            <Card className="py-4">
              <CardHeader>
                <CardTitle>😂 Enjoy the Process</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Productivity doesn't have to be boring. Sassy adds playful flair; Chancellor brings discreet wisdom. Pick the vibe that fits.
                </p>
              </CardContent>
            </Card>

            <Card className="py-4">
              <CardHeader>
                <CardTitle>🔄 Switch Anytime</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Change personalities on the fly. Just tell Lofy "be sassy" or "switch to hope mode" and it adapts instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="py-4">
              <CardHeader>
                <CardTitle>💬 Consistent Character</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Each personality maintains its unique voice across all interactions—reminders, memories, and conversations.
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
                Choose from Hope, Sassy, Chancellor, or ATLAS in your settings or just ask Lofy to switch.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                2️⃣
              </div>
              <h3 className="text-xl font-bold mb-2">Lofy Transforms</h3>
              <p className="text-muted-foreground">
                Watch as Lofy's entire communication style shifts to match your chosen personality.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                3️⃣
              </div>
              <h3 className="text-xl font-bold mb-2">Mix It Up</h3>
              <p className="text-muted-foreground">
                Change personalities whenever you want. Feeling playful? Go Sassy. Need calm efficiency? Switch to ATLAS.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTA />

    </div>
  );
}
