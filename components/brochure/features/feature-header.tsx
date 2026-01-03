"use client";

import { Badge } from "@/components/ui/badge";

interface FeatureHeaderProps {
  badge?: string;
  title: string;
  description: string;
}

export default function FeatureHeader({ badge, title, description }: FeatureHeaderProps) {
  return (
    <div className="space-y-6 text-center">
      {badge && (
        <Badge
          variant="default"
          className="px-4 py-2 text-emerald-700 bg-emerald-100 border-emerald-200 hover:bg-emerald-100"
        >
          <span>{badge}</span>
        </Badge>
      )}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text">
        {title}
      </h1>
      <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-600">
        {description}
      </p>
    </div>
  );
}
