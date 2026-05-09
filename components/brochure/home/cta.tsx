"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { CHANNEL_PICKER_PATH } from "@/lib/channel-entry";

type CTAProps = {
  className?: string;
};

const CTA = ({ className }: CTAProps) => {
  const ref = useRef(null);

  const bottomAnimation = {
    initial: { y: "5%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 1, delay: 0.8 },
  };

  return (
    <section className={className}>
      <div className="py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div
            ref={ref}
            className="relative flex min-h-80 items-center justify-center overflow-hidden rounded-lg border border-marketing-border bg-[linear-gradient(145deg,var(--marketing-card-surface)_0%,var(--marketing-accent-soft)_100%)] px-6 py-12 shadow-[0_22px_48px_-36px_var(--marketing-shadow)]"
          >
            <motion.div {...bottomAnimation} className="relative z-10 mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
              <div className="flex flex-col gap-3">
                <h2 className="marketing-heading text-2xl font-bold md:text-4xl">
                  AI assistance that feels human
                </h2>
                <p className="mx-auto text-marketing-body md:text-lg">
                  Experience a calmer way to manage messages, memory, and planning. Then explore each surface in detail.
                </p>
              </div>
              <Button
                className="group relative h-12 w-fit cursor-pointer overflow-hidden rounded-full border border-white/50 bg-marketing-cta-bg p-1 ps-6 pe-14 text-sm font-medium text-marketing-cta-fg shadow-[0_14px_30px_-18px_var(--marketing-shadow)] transition-all duration-500 hover:bg-marketing-cta-hover hover:ps-14 hover:pe-6"
                asChild
              >
                <Link href={CHANNEL_PICKER_PATH}>
                  <span className="relative z-10 transition-all duration-500">Get started</span>
                  <div className="absolute right-1 flex size-10 items-center justify-center rounded-full bg-marketing-cta-fg text-marketing-cta-bg transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
                    <ArrowUpRight size={16} />
                  </div>
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
