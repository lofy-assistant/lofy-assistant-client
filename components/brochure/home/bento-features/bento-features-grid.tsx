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
          <h2 className="mb-6 py-1 text-4xl md:text-5xl font-bold text-transparent bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text">
            Smart Companion
          </h2>
          <p className="max-w-5xl mx-auto leading-relaxed text-gray-600 text-sm md:text-md text-justify md:text-center lg:text-lg">
            Lofy is simple to understand, a friendly convenience, and an
            assistant without sleep. It integrates into your daily life,
            understanding context and reasoning, exist solely to make your life
            more manageable.
          </p>
        </div>
        <BentoGrid className="md:auto-rows-[20rem]">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              className={item.className}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full rounded-xl bg-linear-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);
const items = [
  {
    title: "All Your Apps, Connected",
    description:
      "Connect your favorite tools and let everything work together automatically.",
    header: <BentoIntegration />,
    className: "lg:col-span-5 md:col-span-5",
  },
  {
    title: "Unlimited Reminders",
    description: "Tailor reminders to any specific task or events.",
    header: <BentoReminder />,
    className: "lg:col-span-3 md:col-span-3",
  },
  {
    title: "Save To Memory",
    description:
      "Build a searchable archive of your mind. Capture ideas, and fleeting thoughts the moment they strike.",
    header: <BentoMemory />,
    className: "lg:col-span-4 md:col-span-4",
  },
  {
    title: "Personality Modes",
    description:
      "Pick a personality and watch your AI instantly change how it talks and thinks.",
    header: <BentoPersona />,
    className: "lg:col-span-4 md:col-span-4",
  },
];
