"use client";

import { ArrowUpRight, ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { BROCHURE_FEATURES } from "@/lib/brochure-features";
import { CHANNEL_PICKER_PATH } from "@/lib/channel-entry";

import { Button, buttonVariants } from "@/components/ui/button";
import { NavbarCenter, Navbar as NavbarComponent, NavbarLeft } from "@/components/ui/navbar";
import Navigation from "@/components/ui/navigation";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface NavbarLink {
  text: string;
  href: string;
  children?: { text: string; href: string }[];
}

interface NavbarActionProps {
  text: string;
  href: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  icon?: ReactNode;
  iconRight?: ReactNode;
  isButton?: boolean;
}

interface NavbarProps {
  logo?: ReactNode;
  name?: string;
  homeUrl?: string;
  mobileLinks?: NavbarLink[];
  actions?: NavbarActionProps[];
  showNavigation?: boolean;
  customNavigation?: ReactNode;
  className?: string;
}

const brochureFeatureLinks = BROCHURE_FEATURES.map((feature) => ({
  text: feature.title,
  href: feature.href,
}));

const resourceLinks = [
  { text: "Guides", href: "/guides" },
  { text: "About Lofy", href: "/about-us" },
];

function isExternalLink(href: string) {
  return href.startsWith("http");
}

function matchesPath(pathname: string, href: string) {
  if (href === "/") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AppNavbar({
  logo = <Image src="/assets/icons/lofy-logo-1.png" alt="Logo" width={32} height={32} className="size-8" />,
  name = "Lofy AI",
  homeUrl = "/",
  mobileLinks = [
    {
      text: "Features",
      href: "/features",
      children: brochureFeatureLinks,
    },
    {
      text: "Resources",
      href: "/guides",
      children: resourceLinks,
    },
    { text: "Pricing", href: "/pricing" },
  ],
  actions,
  showNavigation = true,
  customNavigation,
  className,
}: NavbarProps) {
  const [openSections, setOpenSections] = useState<{ [key: number]: boolean }>({});
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const pathname = usePathname();

  const toggleSection = (index: number) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await fetch("/api/auth/check-session", { method: "GET", credentials: "include" });
        const data = (await res.json().catch(() => ({}))) as { isLoggedIn?: boolean };
        if (!cancelled) setIsLoggedIn(Boolean(data?.isLoggedIn));
      } catch {
        if (!cancelled) setIsLoggedIn(false);
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  const computedActions = useMemo<NavbarActionProps[]>(() => {
    if (actions?.length) return actions;

    return [
      isLoggedIn
        ? { text: "Dashboard", href: "/dashboard", isButton: false }
        : { text: "Log in", href: "/login", isButton: false },
      {
        text: "Get started",
        href: CHANNEL_PICKER_PATH,
        isButton: true,
        variant: "default",
        iconRight: <ArrowUpRight className="size-4" />,
      },
    ];
  }, [actions, isLoggedIn]);

  return (
    <header className={cn("sticky top-4 z-50 w-full px-4 md:px-6", className)}>
      <div className="relative mx-auto max-w-7xl">
        <NavbarComponent className="rounded-[1.75rem] border border-marketing-border/50 bg-marketing-card-surface/90 px-4 py-3 shadow-[0_22px_48px_-28px_var(--marketing-shadow)] backdrop-blur-2xl md:px-5 dark:border-white/10 dark:bg-marketing-navbar-surface">
          <NavbarLeft className="gap-4 md:gap-6">
            <Link
              href={homeUrl}
              className="group flex items-center gap-3 rounded-full px-2 py-1.5 text-marketing-chat-assistant-text transition-colors"
            >
              {logo}
              <span className="hidden text-lg font-semibold tracking-tight text-marketing-chat-assistant-text sm:inline">
                {name}
              </span>
            </Link>
            {showNavigation && (customNavigation || <Navigation />)}
          </NavbarLeft>
          <NavbarCenter className="gap-2 md:gap-3">
            {computedActions.map((action, index) =>
              action.isButton ? (
                <Button
                  key={index}
                  variant={action.variant}
                  className="hidden rounded-full border border-white/50 bg-marketing-cta-bg px-5 text-marketing-cta-fg shadow-[0_14px_30px_-18px_var(--marketing-shadow)] transition-all hover:bg-marketing-cta-hover hover:shadow-[0_18px_34px_-18px_var(--marketing-shadow)] md:inline-flex"
                  asChild
                >
                  <Link
                    href={action.href}
                    target={isExternalLink(action.href) ? "_blank" : undefined}
                    rel={isExternalLink(action.href) ? "noopener noreferrer" : undefined}
                  >
                    {action.icon}
                    {action.text}
                    {action.iconRight}
                  </Link>
                </Button>
              ) : (
                <Link
                  key={index}
                  href={action.href}
                  className={cn(
                    "hidden rounded-full px-3.5 py-2 text-sm font-medium tracking-wide transition-colors md:block",
                    matchesPath(pathname, action.href)
                      ? "bg-white/70 text-marketing-chat-assistant-text shadow-sm dark:bg-white/10"
                      : "text-marketing-chip-text hover:bg-white/55 hover:text-marketing-chat-assistant-text dark:hover:bg-white/10"
                  )}
                >
                  {action.text}
                </Link>
              )
            )}
            <Sheet>
              <SheetTrigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "shrink-0 rounded-full border border-white/50 bg-white/55 text-marketing-chat-assistant-text shadow-sm backdrop-blur-xl hover:bg-white/70 md:hidden dark:bg-white/10 dark:text-marketing-body"
                )}
              >
                <Menu className="size-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-full overflow-y-auto border-white/45 bg-[linear-gradient(180deg,var(--marketing-card-surface)_0%,var(--marketing-bg-subtle)_48%,var(--marketing-accent-soft)_100%)] px-4 backdrop-blur-2xl sm:w-96 dark:border-white/10"
              >
                <VisuallyHidden>
                  <SheetTitle>Navigation Menu</SheetTitle>
                </VisuallyHidden>
                <div className="flex flex-col h-full">
                  <div className="mb-6 mt-3 rounded-[1.75rem] border border-white/55 bg-white/60 px-4 py-4 shadow-[0_18px_42px_-30px_var(--marketing-shadow)] dark:bg-white/10">
                    <Link href={homeUrl} className="flex items-center gap-3 text-marketing-chat-assistant-text">
                      {logo}
                      <span className="text-xl font-semibold tracking-tight">{name}</span>
                    </Link>
                  </div>

                  <nav className="flex-1 px-1">
                    {mobileLinks.map((link, index) => (
                      <div
                        key={index}
                        className="my-2 overflow-hidden rounded-[1.5rem] border border-white/55 bg-white/55 shadow-[0_18px_34px_-30px_rgba(61,46,34,0.5)] transition-all"
                      >
                        {link.children ? (
                          <div className="px-4 py-2">
                            <button
                              onClick={() => toggleSection(index)}
                              className="group flex w-full items-center justify-between py-3 text-left text-lg font-medium text-marketing-chat-assistant-text transition-colors"
                            >
                              <span>{link.text}</span>
                              <ChevronDown
                                className={cn(
                                  "size-5 text-marketing-body-muted transition-transform duration-300 group-hover:text-marketing-chat-assistant-text",
                                  openSections[index] && "rotate-180"
                                )}
                              />
                            </button>
                            <div
                              className={cn(
                                "grid gap-2 overflow-hidden transition-all duration-300 ease-in-out",
                                openSections[index] ? "grid-rows-[1fr] opacity-100 pb-3" : "grid-rows-[0fr] opacity-0"
                              )}
                            >
                              <div className="min-h-0 flex flex-col gap-2">
                                <Link
                                  href={link.href}
                                  className={cn(
                                    "rounded-2xl border px-3 py-2 text-sm font-medium transition-colors",
                                    matchesPath(pathname, link.href)
                                      ? "border-marketing-border bg-marketing-accent-soft text-marketing-accent-soft-foreground"
                                      : "border-white/60 bg-white/75 text-marketing-chip-text hover:bg-white dark:border-white/20 dark:bg-white/10"
                                  )}
                                >
                                  View all {link.text.toLowerCase()}
                                </Link>
                                {link.children.map((child, childIndex) => (
                                  <Link
                                    key={childIndex}
                                    href={child.href}
                                    className={cn(
                                      "rounded-2xl px-3 py-2 text-base transition-colors",
                                      matchesPath(pathname, child.href)
                                        ? "bg-marketing-chip-bg text-marketing-chat-assistant-text"
                                        : "text-marketing-chip-text hover:bg-white/80 hover:text-marketing-chat-assistant-text dark:hover:bg-white/10"
                                    )}
                                  >
                                    {child.text}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <Link
                            href={link.href}
                            className={cn(
                              "flex w-full items-center px-4 py-3.5 text-lg font-medium transition-colors",
                              matchesPath(pathname, link.href)
                                ? "bg-marketing-chip-bg text-marketing-chat-assistant-text"
                                : "text-marketing-chat-assistant-text hover:bg-white/70 dark:hover:bg-white/10"
                            )}
                          >
                            {link.text}
                          </Link>
                        )}
                      </div>
                    ))}
                  </nav>

                  <div className="flex flex-col w-full">
                    <div className="grid grid-cols-2 gap-3">
                      {computedActions.map((action, index) => (
                        <Button
                          key={index}
                          variant={action.isButton ? action.variant : "outline"}
                          size="lg"
                          className={cn(
                            "w-full rounded-2xl text-base font-semibold shadow-sm",
                            action.isButton
                              ? "border border-white/45 bg-marketing-cta-bg text-marketing-cta-fg hover:bg-marketing-cta-hover"
                              : "border-white/55 bg-white/70 text-marketing-chat-assistant-text hover:bg-white dark:bg-white/10 dark:hover:bg-white/15"
                          )}
                          asChild
                        >
                          <Link
                            href={action.href}
                            target={isExternalLink(action.href) ? "_blank" : undefined}
                            rel={isExternalLink(action.href) ? "noopener noreferrer" : undefined}
                          >
                            {action.text}
                          </Link>
                        </Button>
                      ))}
                    </div>
                    <p className="my-4 text-center text-xs text-marketing-body-muted">
                      © {new Date().getFullYear()} {name}. All rights reserved.
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </NavbarCenter>
        </NavbarComponent>
      </div>
    </header>
  );
}
