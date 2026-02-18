"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  GUIDE_SECTIONS,
  GUIDE_BASE_PATH,
  getPrevSection,
  getNextSection,
  isValidSection,
  type GuideSectionId,
} from "../guide-config";
import { GuideSectionContent } from "../guide-section-content";
import { cn } from "@/lib/utils";

export default function GuideSectionPage() {
  const params = useParams();
  const router = useRouter();
  const section = (params?.section as string) || "getting-started";

  useEffect(() => {
    if (!isValidSection(section)) {
      router.replace(`${GUIDE_BASE_PATH}/getting-started`);
    }
  }, [section, router]);

  if (!isValidSection(section)) {
    return null; // Will redirect
  }

  const prevId = getPrevSection(section);
  const nextId = getNextSection(section);
  const currentIndex = GUIDE_SECTIONS.findIndex((s) => s.id === section);
  const total = GUIDE_SECTIONS.length;

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <GuideSectionContent sectionId={section} />

      {/* Prev / Next navigation */}
      <nav
        className={cn(
          "mt-12 flex items-center justify-between gap-4 border-t pt-8",
          !prevId && "justify-end",
          !nextId && "justify-start"
        )}
      >
        {prevId ? (
          <Link
            href={prevId === "getting-started" ? GUIDE_BASE_PATH : `${GUIDE_BASE_PATH}/${prevId}`}
            className="flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
            {GUIDE_SECTIONS.find((s) => s.id === prevId)?.label}
          </Link>
        ) : (
          <span />
        )}
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} of {total}
        </span>
        {nextId ? (
          <Link
            href={`${GUIDE_BASE_PATH}/${nextId}`}
            className="flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            {GUIDE_SECTIONS.find((s) => s.id === nextId)?.label}
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
