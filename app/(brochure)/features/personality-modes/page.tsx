"use client";

import AppNavBar from "@/components/app-navbar";
import FeatureBreadcrumb from "@/components/brochure/features/feature-breadcrumb";
import FeatureHeader from "@/components/brochure/features/feature-header";
import Footer from "@/components/brochure/home/footer";
import CTASection from "@/components/brochure/home/cta-section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PersonalityModesPage() {
  const personalities = [
    {
      name: "Nice",
      emoji: "😊",
      description: "Warm, supportive, and encouraging. Your friendly companion that celebrates your wins and gently guides you through challenges.",
      color: "bg-green-500/10 border-green-500/20",
      examples: ["Great job on that task!", "You've got this!", "How can I help you today?"],
    },
    {
      name: "Sassy",
      emoji: "💅",
      description: "Confident, witty, and full of personality. Get things done with a side of flair and playful attitude.",
      color: "bg-pink-500/10 border-pink-500/20",
      examples: ["Oh, another reminder? I live for this.", "Consider it handled, obviously.", "You're welcome in advance."],
    },
    {
      name: "Sarcastic",
      emoji: "🙄",
      description: "Dry humor and clever comebacks. For those who appreciate wit with their productivity.",
      color: "bg-purple-500/10 border-purple-500/20",
      examples: ["Wow, another meeting. Shocking.", "Sure, I'll remember that for you.", "Oh, you forgot again? Surprise."],
    },
    {
      name: "Mean",
      emoji: "😈",
      description: "Brutally honest tough love. No sugarcoating—just straight talk to keep you accountable and on track.",
      color: "bg-red-500/10 border-red-500/20",
      examples: ["Stop procrastinating already.", "Did you actually do it this time?", "I set 5 reminders. No excuses."],
    },
  ];

  return (
    <div className="relative min-h-screen">
      <AppNavBar />
      
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
                  Need a cheerleader? Go Nice. Need a drill sergeant? Go Mean. Match Lofy's energy to what keeps you productive.
                </p>
              </CardContent>
            </Card>

            <Card className="py-4">
              <CardHeader>
                <CardTitle>😂 Enjoy the Process</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Productivity doesn't have to be boring. Sassy and Sarcastic modes add humor to your daily tasks.
                </p>
              </CardContent>
            </Card>

            <Card className="py-4">
              <CardHeader>
                <CardTitle>🔄 Switch Anytime</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Change personalities on the fly. Just tell Lofy "be sassy" or "switch to nice mode" and it adapts instantly.
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
                Choose from Nice, Sassy, Sarcastic, or Mean in your settings or just ask Lofy to switch.
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
                Change personalities whenever you want. Feeling spicy today? Go sassy. Need tough love? Switch to mean.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  );
}
