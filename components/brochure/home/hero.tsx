"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { CHANNEL_PICKER_PATH } from "@/lib/channel-entry";

export default function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden border-b border-marketing-border bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(251,242,233,0.95)_52%,_rgba(232,246,241,0.92)_100%)] dark:bg-[radial-gradient(circle_at_top,_oklch(0.22_0.02_260)_0%,_oklch(0.2_0.02_260)_100%)]">
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 pb-12 pt-8 md:mt-12 md:pb-16">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-6 border-marketing-border bg-marketing-chip-bg text-marketing-accent-soft-foreground shadow-sm hover:bg-marketing-chip-bg">
            <Sparkles className="mr-2 size-3.5" />
            Your channels, one assistant
          </Badge>
          <h1 className="mb-6 bg-linear-to-r from-marketing-heading-from via-marketing-heading-via to-marketing-heading-to bg-clip-text py-1 text-4xl font-bold text-transparent md:text-6xl lg:text-7xl">
            Meet Lofy
            <br />
            the assistant that acts for you
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-marketing-body md:text-xl">
            Message naturally on the apps you already use, connect your tools, and keep memory and planning in one calm
            place, aligned with what Lofy does today.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {["Chat where you work", "Google integrations", "Dashboard & memory"].map((item) => (
            <span
              key={item}
              className="inline-flex items-center rounded-full border border-marketing-chip-border bg-marketing-chip-bg px-3 py-1 text-xs font-medium text-marketing-chip-text shadow-sm"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="relative mx-auto mt-12 w-[321px] sm:w-[378px] md:w-[432px]">
          <div className="rounded-[2.5rem] border border-marketing-border bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(250,245,240,0.96)_55%,rgba(237,248,244,0.9)_100%)] p-3 shadow-[0_22px_48px_-34px_var(--marketing-shadow)] dark:bg-[linear-gradient(145deg,oklch(0.26_0.02_260)_0%,oklch(0.22_0.02_260)_100%)]">
            <div className="relative rounded-[2rem] bg-black p-3 shadow-inner">
              <div className="absolute left-1/2 top-0 z-20 flex h-7 w-36 -translate-x-1/2 items-center justify-center gap-2 rounded-b-2xl bg-black">
                <div className="h-1.5 w-20 rounded-full bg-gray-800" />
                <div className="size-4 rounded-full bg-gray-800" />
              </div>

              <div className="relative min-h-[560px] overflow-hidden rounded-[2.5rem] md:min-h-[620px]">
                <div className="flex items-center gap-3 bg-marketing-chat-header px-4 pb-3 pt-8">
                  <div className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-background">
                    <Image src="/assets/icons/lofy-logo-1.png" alt="Lofy AI" width={40} height={40} />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-base font-semibold text-white">Lofy AI</span>
                    <p className="text-xs text-white/70">online</p>
                  </div>
                  <div className="hidden gap-1 sm:flex" aria-hidden>
                    <Image src="/assets/icons/slack-icon.svg" alt="" width={18} height={18} className="size-[18px] opacity-90" />
                    <Image src="/assets/icons/telegram-icon.svg" alt="" width={18} height={18} className="size-[18px] opacity-90" />
                    <Image src="/assets/icons/whatsapp-icon.svg" alt="" width={18} height={18} className="size-[18px] opacity-90" />
                  </div>
                </div>

                <div className="relative min-h-[472px] bg-marketing-chat-surface p-3 md:min-h-[532px]">
                  <div className="space-y-3">
                    <div className="flex flex-col items-end gap-0.5">
                      <div className="flex justify-end">
                        <div className="relative max-w-[80%] overflow-hidden rounded-lg rounded-tr-none shadow-sm ring-1 ring-white/10">
                          <Image
                            src="/assets/images/schedule.jpeg"
                            alt="Schedule"
                            width={240}
                            height={160}
                            className="w-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="relative max-w-[80%] rounded-lg rounded-tr-none bg-linear-to-br from-marketing-chat-user-from to-marketing-chat-user-to p-3 shadow-sm">
                          <p className="text-sm leading-relaxed text-white">
                            Hey Lofy, can you add this schedule to my calendar?
                          </p>
                          <div className="mt-1 flex items-center justify-end gap-1">
                            <span className="text-[10px] text-white/75">10:32 AM</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="relative max-w-[80%] rounded-lg rounded-tl-none border border-marketing-chat-assistant-border bg-marketing-chat-assistant-bg p-3 shadow-sm">
                        <p className="text-sm leading-relaxed text-marketing-chat-assistant-text">
                          Done! I&apos;ve created the events with a reminder set for 15 minutes before.
                          It&apos;s synced to your Google Calendar. You&apos;re all set!
                        </p>
                        <div className="mt-1 flex items-center justify-end gap-1">
                          <span className="text-[10px] text-marketing-chat-meta">10:33 AM</span>
                        </div>
                        <div className="mt-2 border-t border-marketing-chat-assistant-border pt-2">
                          <div className="flex select-none items-center justify-center gap-1.5 py-0.5 text-sm font-medium text-marketing-chat-action">
                            <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            View Calendar
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="relative max-w-[80%] rounded-lg rounded-tr-none bg-linear-to-br from-marketing-chat-user-from to-marketing-chat-user-to p-3 shadow-sm">
                        <p className="text-sm leading-relaxed text-white">Thanks Lofy!</p>
                        <div className="mt-1 flex items-center justify-end gap-1">
                          <span className="text-[10px] text-white/75">10:33 AM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 border-t border-marketing-border bg-marketing-bg px-2 py-2 dark:bg-marketing-card-surface">
                  <div className="flex flex-1 items-center rounded-full border border-marketing-border bg-marketing-card-surface px-4 py-2">
                    <span className="text-sm text-marketing-body-muted">Type a message</span>
                  </div>
                  <div className="flex size-10 items-center justify-center rounded-full bg-marketing-accent text-white">
                    <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
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
          <Button variant="outline" asChild className="rounded-2xl border-marketing-chip-border bg-marketing-chip-bg text-marketing-chip-text hover:border-marketing-accent hover:bg-marketing-accent-soft hover:text-marketing-accent-soft-foreground">
            <Link href="/features">
              Explore features
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
