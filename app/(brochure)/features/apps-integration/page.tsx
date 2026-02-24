import { Metadata } from "next";
import FeatureBreadcrumb from "@/components/brochure/features/feature-breadcrumb";
import FeatureHeader from "@/components/brochure/features/feature-header";

export const metadata: Metadata = {
  title: "Apps Integration Feature",
  description: "Seamlessly connect your favorite apps and platforms like WhatsApp, Telegram, and Google Calendar with Lofy AI for a unified productivity experience.",
  alternates: {
    canonical: "/features/apps-integration",
  },
};

import CTASection from "@/components/brochure/home/cta-section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AppsIntegrationPage() {
  const communicationChannels = [
    {
      name: "WhatsApp",
      icon: "/assets/icons/whatsapp-icon.svg",
      description: "Your primary channel. Chat with Lofy directly on WhatsApp for seamless task management.",
      status: "Available",
      features: ["Create reminders", "Schedule events", "Save memories", "Get notifications"],
    },
    {
      name: "Telegram",
      icon: "/assets/icons/telegram-icon.svg",
      description: "Alternative messaging platform with full Lofy functionality.",
      status: "Coming Soon",
      features: ["Full chat support", "Bot commands", "Group integration", "Media handling"],
    },
    {
      name: "Slack",
      icon: "/assets/icons/slack-icon.svg",
      description: "Get Lofy notifications and manage tasks right from your Slack workspace.",
      status: "Coming Soon",
      features: ["Team reminders", "Channel notifications", "Task updates", "Quick commands"],
    },
    {
      name: "Microsoft Teams",
      icon: "/assets/icons/msteams-icon.svg",
      description: "Integrate Lofy into your Teams workspace for enterprise productivity.",
      status: "Coming Soon",
      features: ["Team collaboration", "Channel integration", "Meeting scheduling", "Task management"],
    },
  ];

  const toolsIntegrations = [
    {
      name: "Google Calendar",
      icon: "/assets/icons/google-calendar-icon.svg",
      description: "Two-way sync with your calendar. Events created via Lofy appear instantly.",
      status: "Available",
      features: ["Auto-sync events", "Smart scheduling", "Conflict detection", "Meeting reminders"],
    },
    // {
    //   name: "Google Drive",
    //   icon: "/assets/icons/gdrive-icon.svg",
    //   description: "Store and access your files directly through Lofy conversations.",
    //   status: "Coming Soon",
    //   features: ["File storage", "Document access", "Share files", "Backup memories"],
    // },
    {
      name: "Gmail",
      icon: "/assets/icons/gmail-icon.svg",
      description: "Send emails and manage your inbox through natural conversations.",
      status: "Coming Soon",
      features: ["Send emails", "Draft messages", "Email summaries", "Smart replies"],
    },
    {
      name: "Outlook",
      icon: "/assets/icons/outlook-icon.svg",
      description: "Connect your Outlook calendar and email for unified productivity.",
      status: "Coming Soon",
      features: ["Calendar sync", "Email integration", "Contact management", "Task sync"],
    },
  ];

  return (
    <div className="relative min-h-screen">


      {/* Hero Section */}
      <section className="relative py-16 bg-background">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-8">
            <FeatureBreadcrumb featureName="Apps Integration" />
          </div>
          <FeatureHeader
            badge="🔗 Connected"
            title="Apps Integration"
            description="Lofy lives where you do. Seamlessly connect your favorite apps and platforms for a unified productivity experience."
          />
        </div>
      </section>

      {/* Communication Channels Section */}
      <section className="relative py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">💬 Communication</Badge>
            <h2 className="text-4xl font-bold mb-4">Communication Channels</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Talk to Lofy through your favorite messaging platforms. One assistant, multiple channels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communicationChannels.map((integration) => (
              <Card key={integration.name} className="hover:shadow-lg transition-all hover:scale-[1.02] py-4">
                <CardHeader>
                  <div className="flex flex-col items-center text-center gap-3">
                    <img src={integration.icon} alt={integration.name} className="w-12 h-12" />
                    <CardTitle className="text-xl">{integration.name}</CardTitle>
                    <Badge variant={integration.status === "Available" ? "default" : "indigo"}>
                      {integration.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-center">{integration.description}</CardDescription>
                  <div className="flex flex-wrap justify-center gap-2">
                    {integration.features.map((feature) => (
                      <span key={feature} className="text-xs px-2 py-1 bg-muted rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Integration Section */}
      <section className="relative py-16 bg-background">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">🔧 Tools</Badge>
            <h2 className="text-4xl font-bold mb-4">Tools Integration</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect your productivity tools and let Lofy manage them for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {toolsIntegrations.map((integration) => (
              <Card key={integration.name} className="hover:shadow-lg transition-all hover:scale-[1.02] py-4">
                <CardHeader>
                  <div className="flex flex-col items-center text-center gap-3">
                    <img src={integration.icon} alt={integration.name} className="w-12 h-12" />
                    <CardTitle className="text-xl">{integration.name}</CardTitle>
                    <Badge variant={integration.status === "Available" ? "default" : "indigo"}>
                      {integration.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-center">{integration.description}</CardDescription>
                  <div className="flex flex-wrap justify-center gap-2">
                    {integration.features.map((feature) => (
                      <span key={feature} className="text-xs px-2 py-1 bg-muted rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="relative py-16 bg-background">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">✨ Benefits</Badge>
            <h2 className="text-4xl font-bold mb-4">Why Integrate?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connecting your apps unlocks powerful cross-platform capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 py-4">
              <CardHeader>
                <CardTitle>⚡ Real-Time Sync</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Create a reminder on WhatsApp and see it in your Google Calendar instantly.
                  Changes propagate across all connected platforms in real-time.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 py-4">
              <CardHeader>
                <CardTitle>🎯 Single Source of Truth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No more scattered tasks across different apps. Lofy centralizes everything
                  while keeping each platform in sync.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 py-4">
              <CardHeader>
                <CardTitle>🔒 Secure Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All integrations use OAuth 2.0 for secure authentication. Your credentials
                  are never stored—only secure access tokens.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-2 py-4">
              <CardHeader>
                <CardTitle>🔧 Easy Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect or disconnect apps anytime from your dashboard. Full control over
                  what Lofy can access and when.
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
              Connecting your apps takes just a few seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                1️⃣
              </div>
              <h3 className="text-xl font-bold mb-2">Choose an App</h3>
              <p className="text-muted-foreground">
                Browse available integrations in your dashboard and select the app you want to connect.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                2️⃣
              </div>
              <h3 className="text-xl font-bold mb-2">Authorize Access</h3>
              <p className="text-muted-foreground">
                Sign in to the app and grant Lofy the permissions it needs. You control what's shared.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                3️⃣
              </div>
              <h3 className="text-xl font-bold mb-2">Start Using</h3>
              <p className="text-muted-foreground">
                That's it! Your apps are now connected. Lofy handles the rest automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
