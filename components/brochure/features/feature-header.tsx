"use client";

import { Badge } from "@/components/ui/badge";

interface FeatureHeaderProps {
  badge?: string;
  title: string;
  description: string;
}

export default function FeatureHeader({ badge, title, description }: FeatureHeaderProps) {
  return (
    <div className="space-y-5 text-center">
      {badge && (
        <Badge
          variant="default"
          className="border-white/70 bg-white/80 px-4 py-2 text-marketing-accent-soft-foreground shadow-sm backdrop-blur-xl hover:bg-white/90"
        >
          <span>{badge}</span>
        </Badge>
      )}
      <h1 className="marketing-heading py-2 text-4xl font-bold leading-tight text-balance md:text-5xl lg:text-6xl">
        {title}
      </h1>
      <p className="mx-auto max-w-3xl text-lg leading-8 text-marketing-body md:text-xl">
        {description}
      </p>
    </div>
  );
}
