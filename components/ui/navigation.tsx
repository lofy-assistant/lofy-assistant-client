"use client";

import Link from "next/link";
import { type ReactNode, type ComponentProps } from "react";
import {
  Calendar,
  Bell,
  Brain,
  ListChecks,
  Mic,
  LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

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
  logoTitle?: string;
  logoDescription?: string;
  logoHref?: string;
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
  introItems = [
    {
      title: "Apps Integration",
      href: "/features/apps-integration",
      description: "Connect your apps",
      icon: Calendar,
    },
    {
      title: "Unlimited Reminders",
      href: "/features/unlimited-reminders",
      description: "Never miss tasks",
      icon: Bell,
    },
    {
      title: "Save To Memory",
      href: "/features/save-to-memory",
      description: "Store important info",
      icon: Brain,
    },
    {
      title: "Personality Modes",
      href: "/features/personality-modes",
      description: "Choose how Lofy interacts",
      icon: ListChecks,
    },
  ],
  components = [
    {
      title: "Guides",
      href: "/guides",
    },
    {
      title: "About Us",
      href: "/about-us",
      
    },
  ],
}: NavigationProps) {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {menuItems.map((item, index) => (
          <NavigationMenuItem key={index}>
            {item.isLink ? (
              <NavigationMenuLink
                className={cn(navigationMenuTriggerStyle(), "bg-transparent text-white")}
                asChild
              >
                <Link href={item.href || "#"}>{item.title}</Link>
              </NavigationMenuLink>
            ) : (
              <>
                <NavigationMenuTrigger className="bg-transparent text-white">{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  {item.content === "default" ? (
                    <ul className="grid gap-3 p-6 md:w-[500px] lg:w-[600px] md:grid-cols-2">
                      {introItems.map((intro, i) => (
                        <FeatureItem
                          key={i}
                          href={intro.href}
                          title={intro.title}
                          icon={intro.icon}
                        >
                          {intro.description}
                        </FeatureItem>
                      ))}
                    </ul>
                  ) : item.content === "components" ? (
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {components.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
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
  className,
  title,
  children,
  icon: Icon,
  ...props
}: ComponentProps<"a"> & { title: string; icon?: LucideIcon }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          data-slot="feature-item"
          className={cn(
            "group block space-y-2 rounded-lg p-4 leading-none no-underline outline-hidden transition-all select-none",
            "hover:bg-accent/50 hover:scale-105 hover:shadow-sm",
            "focus:bg-accent focus:scale-105",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="flex items-center justify-center w-10 h-10 transition-colors rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div className="flex-1">
              <div className="mb-1 text-sm font-semibold leading-none">
                {title}
              </div>
              <p className="text-xs text-muted-foreground">{children}</p>
            </div>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
}

function ListItem({
  className,
  title,
  children,
  ...props
}: ComponentProps<"a"> & { title: string }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          data-slot="list-item"
          className={cn(
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-sm leading-snug text-muted-foreground line-clamp-2">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
}
