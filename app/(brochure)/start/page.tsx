import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getWhatsAppEntryUrl } from "@/lib/channel-entry";

export const metadata: Metadata = {
  title: "Choose your channel",
  description:
    "Connect Lofy on WhatsApp today. More messaging channels — Telegram, Slack, Microsoft Teams — are coming soon.",
};

const channels = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Chat with Lofy where you already message.",
    icon: "/assets/icons/whatsapp-icon.svg",
    available: true,
  },
  {
    id: "telegram",
    name: "Telegram",
    description: "Coming soon.",
    icon: "/assets/icons/telegram-icon.svg",
    available: false,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Coming soon.",
    icon: "/assets/icons/slack-icon.svg",
    available: false,
  },
  {
    id: "msteams",
    name: "Microsoft Teams",
    description: "Coming soon.",
    icon: "/assets/icons/teams-icon.svg",
    available: false,
  },
] as const;

export default function StartPage() {
  const whatsappUrl = getWhatsAppEntryUrl();

  return (
    <div className="relative border-b border-marketing-border bg-marketing-bg-subtle py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <div className="mb-10">
          <Button variant="ghost" size="sm" className="-ms-2 mb-6 gap-2 text-marketing-body hover:text-marketing-heading-from" asChild>
            <Link href="/">
              <ArrowLeft className="size-4" />
              Back to home
            </Link>
          </Button>
          <Badge className="mb-4 border-marketing-border bg-marketing-chip-bg text-marketing-accent-soft-foreground hover:bg-marketing-chip-bg">
            Get started
          </Badge>
          <h1 className="mb-4 bg-linear-to-r from-marketing-heading-from via-marketing-heading-via to-marketing-heading-to bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
            Choose where you chat
          </h1>
          <p className="max-w-2xl text-lg text-marketing-body">
            Connect Lofy on your preferred messaging app. WhatsApp is available today; other channels will open up as we
            ship them.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {channels.map((ch) => (
            <Card
              key={ch.id}
              className="flex flex-col border-marketing-border bg-marketing-card-surface shadow-[0_18px_40px_-34px_var(--marketing-shadow)]"
            >
              <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-marketing-border bg-background">
                  <Image src={ch.icon} alt="" width={28} height={28} className="size-7 object-contain" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <CardTitle className="text-lg text-foreground">{ch.name}</CardTitle>
                  <CardDescription className="text-marketing-body">{ch.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1" />
              <CardFooter className="pt-0">
                {ch.available ? (
                  <Button className="w-full rounded-xl bg-marketing-cta-bg text-marketing-cta-fg hover:bg-marketing-cta-hover" asChild>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      Continue with WhatsApp
                      <ArrowUpRight className="size-4" />
                    </a>
                  </Button>
                ) : (
                  <Button disabled variant="outline" className="w-full rounded-xl border-marketing-border text-marketing-body-muted">
                    Coming soon
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
