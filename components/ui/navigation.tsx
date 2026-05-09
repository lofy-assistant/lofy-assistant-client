"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { BROCHURE_FEATURES } from "@/lib/brochure-features";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./navigation-menu";

interface ComponentItem {
  title: string;
  href: string;
  description?: string;
}

interface IntroItem {
  title: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
}

interface MenuItem {
  title: string;
  href?: string;
  isLink?: boolean;
  content?: ReactNode | "default" | "components";
}

interface NavigationProps {
  menuItems?: MenuItem[];
  components?: ComponentItem[];
  introItems?: IntroItem[];
}

export default function Navigation({
  menuItems = [
    {
      title: "Features",
      content: "default",
    },
    {
      title: "Resources",
      content: "components",
    },
    {
      title: "Pricing",
      isLink: true,
      href: "/pricing",
    },
  ],
  introItems = BROCHURE_FEATURES.map((feature) => ({
    title: feature.title,
    href: feature.href,
    description: feature.overviewDescription,
    icon: feature.icon,
  })),
  components = [
    {
      title: "Guides",
      href: "/guides",
      description: "Learn the product workflows in more detail.",
    },
    {
      title: "About Lofy",
      href: "/about-us",
      description: "Read the broader story behind the assistant.",
    },
  ],
}: NavigationProps) {
  const pathname = usePathname();
  const integrationHref = "/features/integrations" as const;
  const integrationItems = introItems.filter((item) => item.href === integrationHref);
  const otherFeatureItems = introItems.filter((item) => item.href !== integrationHref);

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="gap-1.5">
        {menuItems.map((item, index) => (
          <NavigationMenuItem key={index}>
            {item.isLink ? (
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "rounded-full border border-transparent bg-transparent text-[#5d4b3f] hover:border-white/55 hover:bg-white/55 hover:text-[#2f241c] focus:bg-white/60 focus:text-[#2f241c]",
                  item.href && (pathname === item.href || pathname.startsWith(`${item.href}/`))
                    ? "border-white/55 bg-white/70 text-[#2f241c] shadow-sm"
                    : ""
                )}
                asChild
              >
                <Link href={item.href || "#"}>{item.title}</Link>
              </NavigationMenuLink>
            ) : (
              <>
                <NavigationMenuTrigger
                  className={cn(
                    "rounded-full border border-transparent bg-transparent text-[#5d4b3f] hover:border-white/55 hover:bg-white/55 hover:text-[#2f241c] focus:bg-white/60 focus:text-[#2f241c]",
                    item.title === "Features" && pathname.startsWith("/features")
                      ? "border-white/55 bg-white/70 text-[#2f241c] shadow-sm"
                      : "",
                    item.title === "Resources" &&
                      (pathname.startsWith("/guides") || pathname.startsWith("/about-us"))
                      ? "border-white/55 bg-white/70 text-[#2f241c] shadow-sm"
                      : ""
                  )}
                >
                  {item.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="rounded-[1.75rem] border border-white/55 bg-[linear-gradient(145deg,rgba(255,255,255,0.92)_0%,rgba(251,244,238,0.92)_52%,rgba(239,249,245,0.88)_100%)] p-0 shadow-[0_26px_56px_-34px_rgba(61,46,34,0.55)] backdrop-blur-2xl">
                  {item.content === "default" ? (
                    <div className="p-3 md:w-[520px]">
                      <div className="mb-3 flex items-center justify-between gap-3 rounded-[1.2rem] border border-white/55 bg-white/58 px-3.5 py-2.5">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a8070]">
                            Features
                          </p>
                          <p className="text-sm text-[#6e5a4d]">
                            Current product surfaces in one place.
                          </p>
                        </div>
                        <Link
                          href="/features"
                          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#e6d7ca] bg-[#fff8f1] px-3 py-1.5 text-xs font-medium text-[#5c473b] transition-colors hover:bg-white"
                        >
                          View all
                          <ArrowUpRight className="size-3.5" />
                        </Link>
                      </div>
                      <ul className="grid auto-rows-fr gap-2.5 md:grid-cols-2">
                        {integrationItems.map((intro) => (
                          <FeatureItem
                            key={intro.href}
                            className="md:col-span-2"
                            href={intro.href}
                            title={intro.title}
                            icon={intro.icon}
                            active={pathname === intro.href || pathname.startsWith(`${intro.href}/`)}
                          >
                            {intro.description}
                          </FeatureItem>
                        ))}
                        {otherFeatureItems.map((intro) => (
                          <FeatureItem
                            key={intro.href}
                            href={intro.href}
                            title={intro.title}
                            icon={intro.icon}
                            active={pathname === intro.href || pathname.startsWith(`${intro.href}/`)}
                          >
                            {intro.description}
                          </FeatureItem>
                        ))}
                      </ul>
                    </div>
                  ) : item.content === "components" ? (
                    <ul className="grid auto-rows-fr gap-2.5 p-3 md:w-[520px] md:grid-cols-2">
                      {components.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                          active={pathname === component.href || pathname.startsWith(`${component.href}/`)}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  ) : (
                    item.content
                  )}
                </NavigationMenuContent>
              </>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function FeatureItem({
  title,
  children,
  icon: Icon,
  href,
  active,
  className,
}: {
  title: string;
  children?: ReactNode;
  icon?: LucideIcon;
  href: string;
  active?: boolean;
  className?: string;
}) {
  return (
    <li className={className}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "group flex h-full min-h-[5.5rem] flex-col rounded-[1.1rem] border p-3 leading-none outline-hidden transition-all select-none",
            active
              ? "border-[#dcece7] bg-[#edf8f4] shadow-[0_16px_34px_-28px_rgba(31,72,58,0.55)]"
              : "border-white/55 bg-white/72 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_24px_-24px_rgba(61,46,34,0.4)]"
          )}
        >
          <div className="flex min-h-0 flex-1 items-start gap-3">
            {Icon && (
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors",
                  active
                    ? "bg-white text-[#356e60]"
                    : "bg-[#fff8f1] text-[#8b6e5c] group-hover:bg-[#edf8f4] group-hover:text-[#356e60]"
                )}
              >
                <Icon className="w-4.5 h-4.5" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center justify-between gap-2">
                <div className="text-sm font-semibold leading-none text-[#2f241c]">
                  {title}
                </div>
                <ArrowUpRight className="size-3 shrink-0 text-[#a18674] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <p className="line-clamp-2 text-[11px] leading-4.5 text-[#776455]">{children}</p>
            </div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

function ListItem({
  title,
  children,
  href,
  active,
}: {
  title: string;
  children?: ReactNode;
  href: string;
  active?: boolean;
}) {
  return (
    <li className="min-h-0">
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "group flex h-full min-h-[5.5rem] flex-col rounded-[1.1rem] border p-3 leading-none outline-hidden transition-all select-none",
            active
              ? "border-[#dcece7] bg-[#edf8f4] shadow-[0_16px_34px_-28px_rgba(31,72,58,0.55)]"
              : "border-white/55 bg-white/72 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_24px_-24px_rgba(61,46,34,0.4)]"
          )}
        >
          <div className="mb-1 flex items-center justify-between gap-2">
            <div className="text-sm font-semibold leading-none text-[#2f241c]">{title}</div>
            <ArrowUpRight className="size-3 shrink-0 text-[#a18674] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
          <p className="line-clamp-2 text-[11px] leading-4.5 text-[#776455]">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
