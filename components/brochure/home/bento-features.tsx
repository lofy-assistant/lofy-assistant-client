"use client";
import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Badge } from "@/components/ui/badge";
import {
  IconListCheck,
  IconCalendarWeek,
  IconClock12,
  IconBrain,
  IconVolume,
} from "@tabler/icons-react";

export function BentoFeatures() {
  return (
    <section className="relative py-24 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-20 text-center">
          <h2 className="mb-6 py-1 text-5xl font-bold text-transparent bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text">
            Your Personal Assistant AI Agent
          </h2>
          <p className="max-w-4xl mx-auto leading-relaxed text-gray-600 text-md lg:text-lg">
            Lofy is an agentic AI personal assistant that integrates seamlessly
            into your daily life, understanding context and reasoning to boost
            your productivity with intelligent automation.
          </p>
        </div>
        <BentoGrid className="md:auto-rows-[22rem]">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              icon={item.icon}
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
    title: "Smart Calendar",
    description:
      "Instantly schedule meetings and create calendar events using simple, natural language input.",
    header: <Skeleton />,
    icon: <IconCalendarWeek className="h-6 w-6 text-neutral-500" />,
    className: "lg:col-span-5 md:col-span-5",
  },
  {
    title: "Flexible Reminders",
    description: "Tailor reminders to any specific task or calendar event.",
    header: <Skeleton />,
    icon: <IconClock12 className="h-6 w-6 text-neutral-500" />,
    className: "lg:col-span-3 md:col-span-3",
  },
  {
    title: "Save To Memory",
    description:
      "Build a searchable archive of your mind. Capture ideas, and fleeting thoughts the moment they strike.",
    header: <Skeleton />,
    icon: <IconBrain className="h-6 w-6 text-neutral-500" />,
    className: "lg:col-span-4 md:col-span-4",
  },
  {
    title: "Centralized Task Management",
    description:
      "Command center for getting things done. Organize, assign, and plan your steps.",
    header: <Skeleton />,
    icon: <IconListCheck className="h-6 w-6 text-neutral-500" />,
    className: "lg:col-span-4 md:col-span-4",
  },
];
