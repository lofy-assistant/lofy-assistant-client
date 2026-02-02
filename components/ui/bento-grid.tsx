"use client";

import { cn } from "@/lib/utils";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-8",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  link,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  link?: string;
}) => {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const CardContent = (
    <div className="border h-full rounded-xl overflow-hidden">
      <div className="relative bg-white flex h-full flex-col justify-between gap-4 p-4 md:p-6 dark:bg-neutral-950 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
        <div className="relative flex flex-1 flex-col justify-between gap-3">
          {header && (
            <div className="w-full h-48 overflow-hidden rounded-lg">
              {header}
            </div>
          )}
          <div className="space-y-2">
            <h3 className="font-sans text-lg font-semibold text-balance text-black md:text-xl dark:text-white">
              {title}
            </h3>
            <p className="font-sans text-sm text-justify md:text-left text-black md:text-base dark:text-neutral-400">
              {description}
            </p>
            {link && (
              <Link
                href={link}
                className="inline-flex items-center gap-1 text-sm font-medium hover:underline transition-all group/link"
              >
                Learn more
                <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn("group/bento row-span-1 relative h-full", className)}>
      {isDesktop ? (
        <GlowingEffect
          blur={0}
          borderWidth={3}
          spread={80}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        >
          {CardContent}
        </GlowingEffect>
      ) : (
        <BackgroundGradient className="rounded-xl h-full" containerClassName="h-full">
          {CardContent}
        </BackgroundGradient>
      )}
    </div>
  );
};
