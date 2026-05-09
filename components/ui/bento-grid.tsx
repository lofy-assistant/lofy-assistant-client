"use client";

import { cn } from "@/lib/utils";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export const BentoGrid = ({ className, children }: { className?: string; children?: ReactNode }) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-8 md:gap-6 md:gap-y-6",
        className
      )}
    >
      {children}
    </div>
  );
};

type BentoGridItemProps = {
  className?: string;
  title?: ReactNode;
  description?: ReactNode;
  header?: ReactNode;
  link?: string;
  icon?: ReactNode;
  /** Larger visual area for the illustration (e.g. full-width integrations card). */
  featured?: boolean;
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  link,
  icon,
  featured = false,
}: BentoGridItemProps) => {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const CardContent = (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-marketing-border bg-marketing-card-surface shadow-[0_22px_48px_-38px_var(--marketing-shadow)] transition-[box-shadow,transform] duration-300 group-hover/bento:-translate-y-0.5 group-hover/bento:shadow-[0_28px_56px_-36px_var(--marketing-shadow)] dark:border-white/10 dark:bg-marketing-card-surface">
      <div className="relative flex min-h-0 flex-1 flex-col gap-5 bg-linear-to-br from-marketing-card-surface via-marketing-bg-subtle/40 to-marketing-accent-soft/25 p-5 md:p-7 dark:from-marketing-card-surface dark:via-marketing-bg-subtle/50 dark:to-marketing-accent-soft/15">
        {header && (
          <div
            className={cn(
              "relative w-full shrink-0 overflow-hidden rounded-2xl border border-marketing-border/80 bg-linear-to-b from-marketing-bg/90 to-marketing-accent-soft/20 ring-1 ring-black/[0.03] dark:from-marketing-chat-surface dark:to-marketing-card-surface dark:ring-white/[0.06]",
              featured
                ? "min-h-[13rem] sm:min-h-[15rem] md:min-h-[17rem]"
                : "min-h-[11rem] h-48 sm:min-h-[12rem]"
            )}
          >
            {header}
          </div>
        )}
        <div className="flex min-h-0 flex-1 flex-col justify-end gap-4">
          <div className="flex gap-4">
            {icon && (
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-marketing-border bg-marketing-accent-soft text-marketing-accent-soft-foreground shadow-sm dark:border-white/10">
                {icon}
              </span>
            )}
            <div className={cn("min-w-0 space-y-2", !icon && "flex-1")}>
              <h3 className="text-balance text-lg font-semibold tracking-tight text-marketing-chat-assistant-text md:text-xl dark:text-foreground">
                {title}
              </h3>
              <p className="text-pretty text-sm leading-relaxed text-marketing-body md:text-[0.9375rem]">{description}</p>
            </div>
          </div>
          {link && (
            <Link
              href={link}
              className="group/link mt-auto inline-flex w-fit items-center gap-2 rounded-full border border-marketing-border bg-marketing-chip-bg px-4 py-2 text-sm font-medium text-marketing-accent-soft-foreground transition-colors hover:border-marketing-accent/40 hover:bg-marketing-accent-soft dark:border-white/15 dark:bg-white/5 dark:text-marketing-accent-soft-foreground dark:hover:bg-white/10"
            >
              Explore
              <ArrowUpRight className="size-4 transition-transform group-hover/link:-translate-y-px group-hover/link:translate-x-px" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn("group/bento relative row-span-1 h-full min-h-0", featured && "md:min-h-[28rem]", className)}>
      {isDesktop ? (
        <GlowingEffect
          blur={0}
          borderWidth={2}
          spread={56}
          glow={true}
          disabled={false}
          proximity={72}
          inactiveZone={0.02}
        >
          {CardContent}
        </GlowingEffect>
      ) : (
        <BackgroundGradient className="h-full rounded-3xl" containerClassName="h-full">
          {CardContent}
        </BackgroundGradient>
      )}
    </div>
  );
};
