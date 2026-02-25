"use client";


import FeatureBreadcrumb from "@/components/brochure/features/feature-breadcrumb";
import FeatureHeader from "@/components/brochure/features/feature-header";
import CTA from "@/components/brochure/home/cta";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Search, Sparkles, MessageSquare, FolderOpen, Lock } from "lucide-react";

export default function SaveToMemoryPage() {
  const memoryTypes = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Ideas & Inspiration",
      description: "Capture that brilliant idea before it slips away. Save creative sparks, business concepts, or random thoughts.",
      examples: ["App idea for...", "Remember this quote", "Gift idea for mom"],
    },
    {
      icon: <FolderOpen className="w-6 h-6" />,
      title: "Important Information",
      description: "Store passwords hints, account details, addresses, or any info you need to recall later.",
      examples: ["WiFi password is...", "Doctor's number", "License plate number"],
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Conversations & Notes",
      description: "Save key points from conversations, meeting notes, or things people told you.",
      examples: ["John mentioned...", "Meeting takeaways", "Recipe from grandma"],
    },
  ];

  return (
    <div className="relative min-h-screen">


      {/* Hero Section */}
      <section className="relative py-16 bg-background">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-8">
            <FeatureBreadcrumb featureName="Save to Memory" />
          </div>
          <FeatureHeader
            badge="🧠 Memory"
            title="Save to Memory"
            description="Build a searchable archive of your mind. Capture ideas, notes, and fleeting thoughts the moment they strike."
          />
        </div>
      </section>

      {/* Memory Types Section */}
      <section className="relative py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">💭 What Can You Save?</Badge>
            <h2 className="text-4xl font-bold mb-4">Your Second Brain</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From fleeting thoughts to important details—Lofy remembers everything so you don't have to.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {memoryTypes.map((type) => (
              <Card key={type.title} className="hover:shadow-lg transition-all hover:scale-[1.02] py-4">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white mb-4">
                    {type.icon}
                  </div>
                  <CardTitle className="text-xl">{type.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription>{type.description}</CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {type.examples.map((example) => (
                      <span key={example} className="text-xs px-2 py-1 bg-muted rounded-full">
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

      {/* Key Features Section */}
      <section className="relative py-16 bg-background">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">✨ Features</Badge>
            <h2 className="text-4xl font-bold mb-4">Smart Memory Management</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              More than just storage—Lofy understands and organizes your memories intelligently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-2 py-4">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Search className="w-6 h-6 text-emerald-600" />
                  <CardTitle>Instant Search</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Just ask "What was that restaurant John recommended?" and Lofy finds it instantly.
                  Natural language search across all your memories.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-2 py-4">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Brain className="w-6 h-6 text-blue-600" />
                  <CardTitle>Auto-Categorization</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Lofy automatically tags and categorizes your memories. No manual organization needed—just
                  save and let AI do the heavy lifting.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 py-4">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  <CardTitle>Context Awareness</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Lofy understands context. Save "Call the dentist" and it knows it's health-related.
                  Ask about health stuff later and it surfaces relevant memories.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-2 py-4">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Lock className="w-6 h-6 text-orange-600" />
                  <CardTitle>Private & Secure</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your memories are encrypted and private. Only you can access them. Delete anytime
                  and they're gone forever—no backups, no traces.
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
              Saving memories is as simple as sending a message.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                1️⃣
              </div>
              <h3 className="text-xl font-bold mb-2">Tell Lofy to Remember</h3>
              <p className="text-muted-foreground">
                Just say "Remember that..." or "Save this..." followed by whatever you want to store.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                2️⃣
              </div>
              <h3 className="text-xl font-bold mb-2">Lofy Stores & Organizes</h3>
              <p className="text-muted-foreground">
                Your memory is saved, tagged, and categorized automatically. Lofy confirms what was saved.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                3️⃣
              </div>
              <h3 className="text-xl font-bold mb-2">Recall Anytime</h3>
              <p className="text-muted-foreground">
                Ask "What did I save about..." or browse your memories in the dashboard. Instant recall.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Conversation */}
      <section className="relative py-16 bg-background">
        <div className="max-w-3xl mx-auto px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">💬 In Action</Badge>
            <h2 className="text-4xl font-bold mb-4">See It In Action</h2>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-6 space-y-4">
              {/* User message */}
              <div className="flex justify-end">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-lg rounded-tr-none p-3 max-w-[80%]">
                  <p className="text-sm">Remember that Sarah's birthday is March 15th and she loves chocolate cake</p>
                </div>
              </div>

              {/* AI response */}
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg rounded-tl-none p-3 max-w-[80%]">
                  <p className="text-sm">Got it! 🧠 I've saved Sarah's birthday (March 15th) and her preference for chocolate cake. I'll remind you a week before!</p>
                </div>
              </div>

              {/* Later... */}
              <div className="text-center text-xs text-muted-foreground py-2">— 2 months later —</div>

              {/* User message */}
              <div className="flex justify-end">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-lg rounded-tr-none p-3 max-w-[80%]">
                  <p className="text-sm">When is Sarah's birthday and what cake does she like?</p>
                </div>
              </div>

              {/* AI response */}
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg rounded-tl-none p-3 max-w-[80%]">
                  <p className="text-sm">Sarah's birthday is March 15th and she loves chocolate cake! 🎂 Want me to set a reminder to order the cake?</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <CTA />

    </div>
  );
}
