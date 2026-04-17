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
  const hasPrev = Boolean(prevId);
  const hasNext = Boolean(nextId);
  const hasBoth = hasPrev && hasNext;

  return (
    <div className="max-w-none">
      <GuideSectionContent sectionId={section} />

      <nav
        className="not-prose mt-14 grid grid-cols-1 gap-4 border-t border-border/60 pt-10 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center"
        aria-label="Guide pagination"
      >
        <span className="justify-self-center text-center text-xs font-medium uppercase tracking-wide text-muted-foreground sm:col-start-2 sm:row-start-1">
          {currentIndex + 1} / {total}
        </span>

        <div
          className={cn(
            "col-span-full flex flex-row gap-3 sm:contents",
            !hasBoth && (hasPrev || hasNext) && "justify-center"
          )}
        >
          {hasPrev ? (
            <Link
              href={prevId === "getting-started" ? GUIDE_BASE_PATH : `${GUIDE_BASE_PATH}/${prevId}`}
              className={cn(
                "group inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-4 py-3 text-sm font-medium shadow-sm transition hover:border-primary/20 hover:bg-primary/[0.04]",
                hasBoth
                  ? "min-w-0 flex-1 justify-center sm:col-start-1 sm:row-start-1 sm:w-auto sm:max-w-none sm:flex-initial sm:justify-self-start"
                  : "w-1/2 max-w-[50%] justify-center text-center sm:col-start-1 sm:row-start-1 sm:w-auto sm:max-w-none sm:justify-self-start"
              )}
            >
              <ChevronLeft className="h-4 w-4 shrink-0 transition group-hover:-translate-x-0.5" aria-hidden />
              <span className="min-w-0 truncate sm:max-w-[14rem]">{GUIDE_SECTIONS.find((s) => s.id === prevId)?.label}</span>
            </Link>
          ) : (
            <span className="hidden sm:col-start-1 sm:row-start-1 sm:block sm:min-w-0" aria-hidden />
          )}

          {hasNext ? (
            <Link
              href={`${GUIDE_BASE_PATH}/${nextId}`}
              className={cn(
                "group inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-4 py-3 text-sm font-medium shadow-sm transition hover:border-primary/20 hover:bg-primary/[0.04]",
                hasBoth
                  ? "min-w-0 flex-1 justify-center sm:col-start-3 sm:row-start-1 sm:w-auto sm:max-w-none sm:flex-initial sm:justify-self-end"
                  : "w-1/2 max-w-[50%] justify-center text-center sm:col-start-3 sm:row-start-1 sm:w-auto sm:max-w-none sm:justify-self-end"
              )}
            >
              <span className="min-w-0 truncate text-center sm:max-w-[14rem]">{GUIDE_SECTIONS.find((s) => s.id === nextId)?.label}</span>
              <ChevronRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-0.5" aria-hidden />
            </Link>
          ) : (
            <span className="hidden sm:col-start-3 sm:row-start-1 sm:block sm:min-w-0" aria-hidden />
          )}
        </div>
      </nav>
    </div>
  );
}
