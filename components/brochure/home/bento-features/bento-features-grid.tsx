"use client";

import React from "react";
import { Brain, History, Layers3, Plug, Sparkles, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import BentoFriends from "./bento-friends";
import { BentoMemory } from "./bento-memory";
import BentoPersona from "./bento-persona";
import { BentoReminder } from "./bento-reminder";
import BentoIntegration from "./bento-integration";

export function BentoFeatures() {
  return (
    <section className="marketing-section-muted relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center md:mb-24">
          <Badge className="mb-5 border-marketing-chip-border bg-marketing-chip-bg px-3 py-1 text-marketing-chip-text hover:bg-marketing-chip-bg">
            <Layers3 className="mr-2 size-3.5" />
            Product surfaces
          </Badge>
          <h2 className="marketing-heading mb-5 py-1 text-4xl font-bold md:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
            Five pillars, one calm workflow
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-marketing-body md:text-lg">
            Integrations, timeline, memories, your circle, and the voice you choose, aligned in one dashboard without
            hopping between apps.
          </p>
        </div>

        <BentoGrid className="md:auto-rows-min">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              className={item.className}
              link={item.link}
              icon={item.icon}
              featured={item.featured}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}

const items = [
  {
    title: "Integrations",
    description:
      "Wire messaging and Google together so Lofy can read context and take action in the tools you already rely on.",
    header: <BentoIntegration />,
    className: "md:col-span-8",
    link: "/features/integrations",
    icon: <Plug className="size-5" strokeWidth={2} aria-hidden />,
    featured: true,
  },
  {
    title: "History & planning",
    description: "See reminders, calendar moves, and follow-ups in one timeline after Lofy runs.",
    header: <BentoReminder />,
    className: "md:col-span-4",
    link: "/features/history",
    icon: <History className="size-5" strokeWidth={2} aria-hidden />,
    featured: false,
  },
  {
    title: "Memories",
    description: "Save and recall facts, preferences, and snippets next to the rest of your dashboard.",
    header: <BentoMemory />,
    className: "md:col-span-4",
    link: "/features/memories",
    icon: <Brain className="size-5" strokeWidth={2} aria-hidden />,
    featured: false,
  },
  {
    title: "Friends",
    description: "Invite people by phone, grow your circle, and unlock shared memory with the relationships you trust.",
    header: <BentoFriends />,
    className: "md:col-span-8",
    link: "/features/friends",
    icon: <Users className="size-5" strokeWidth={2} aria-hidden />,
    featured: true,
  },
  {
    title: "Personas",
    description: "Swap tone and style, from crisp and analytical to warm or playful, for the moment you are in.",
    header: <BentoPersona />,
    className: "md:col-span-8",
    link: "/features/personas",
    icon: <Sparkles className="size-5" strokeWidth={2} aria-hidden />,
    featured: true,
  },
];
