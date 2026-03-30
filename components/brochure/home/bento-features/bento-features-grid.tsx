"use client";
import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import BentoIntegration from "./bento-integration";
import { BentoReminder } from "./bento-reminder";
import { BentoMemory } from "./bento-memory";
import BentoPersona from "./bento-persona";

export function BentoFeatures() {
  return (
    <section className="relative py-24 my-8 md:my-16 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-20 text-center">
          <h2 className="mb-6 py-1 text-4xl md:text-5xl font-bold text-transparent bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text">Just Send It to Lofy</h2>
          <p className="max-w-5xl mx-auto leading-relaxed text-gray-600 text-sm md:text-md text-justify md:text-center lg:text-lg">
            Lofy saves you time by letting you manage your work just by messaging it—no app switching, all while understanding your context and working quietly in the background.
          </p>
        </div>
        <BentoGrid className="md:auto-rows-[21.5rem]">
          {items.map((item, i) => (
            <BentoGridItem key={i} title={item.title} description={item.description} header={item.header} className={item.className} link={item.link} />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}

const Skeleton = () => <div className="flex flex-1 w-full h-full rounded-xl bg-linear-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>;
const items = [
  {
    title: "Connect All Your Apps",
    description: "Connect your favorite tools and let everything work together automatically.",
    header: <BentoIntegration />,
    className: "lg:col-span-5 md:col-span-5",
    link: "/features/apps-integration",
  },
  {
    title: "Limitless Reminder",
    description: "Set reminders for any task or event. Lofy will send you a message when it's time to act.",
    header: <BentoReminder />,
    className: "lg:col-span-3 md:col-span-3",
    link: "/features/limitless-reminder",
  },
  {
    title: "Memory Capture",
    description: "Build a searchable archive of your mind. Capture ideas, and fleeting thoughts the moment they strike.",
    header: <BentoMemory />,
    className: "lg:col-span-4 md:col-span-4",
    link: "/features/save-to-memory",
  },
  {
    title: "Personality Modes",
    description: "Choose A.T.L.A.S, Brad, Lexi, or Rocco and watch Lofy shift how it talks and thinks.",
    header: <BentoPersona />,
    className: "lg:col-span-4 md:col-span-4",
    link: "/features/personality-modes",
  },
];
