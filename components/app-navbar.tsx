"use client";

import { Menu, ChevronDown } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "@/components/ui/button";
import { NavbarCenter, Navbar as NavbarComponent, NavbarLeft } from "@/components/ui/navbar";
import Navigation from "@/components/ui/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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

export default function AppNavbar({
  logo = <Image src="/assets/logo/lofy-logo-1.png" alt="Logo" width={32} height={32} className="size-8" />,
  name = "Lofy AI",
  homeUrl = "/",
  mobileLinks = [
    { 
      text: "Features", 
      href: "/features",
      children: [
        { text: "Apps Integration", href: "/features/apps-integration" },
        { text: "Unlimited Reminders", href: "/features/unlimited-reminders" },
        { text: "Save To Memory", href: "/features/save-to-memory" },
        { text: "Personality Modes", href: "/features/personality-modes" },
      ]
    },
    { 
      text: "Resources", 
      href: "/resources",
      children: [
        { text: "Guides", href: "/guides" },
        { text: "About Us", href: "/about-us" },
      ]
    },
    { text: "Pricing", href: "/pricing" },
  ],
  actions = [
    {
      text: "Sign in",
      href: "/login",
      isButton: false,
    },
    {
      text: "Get Started",
      href: "https://wa.me/60178230685?text=Hey%2C%20I%20just%20get%20started",
      isButton: true,
      variant: "default",
    },
  ],
  showNavigation = true,
  customNavigation,
  className,
}: NavbarProps) {
  const [openSections, setOpenSections] = useState<{ [key: number]: boolean }>({});

  const toggleSection = (index: number) => {
    setOpenSections(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <header className={cn("sticky top-0 z-50 px-4 w-full", className)}>
      <div className="absolute left-0 w-full h-18 fade-bottom bg-foreground backdrop-blur-md" />
      <div className="relative mx-auto max-w-7xl">
        <NavbarComponent>
          <NavbarLeft>
            <Link href={homeUrl} className="flex items-center gap-2 text-xl font-bold">
              {logo}
              {name}
            </Link>
            {showNavigation && (customNavigation || <Navigation />)}
          </NavbarLeft>
          <NavbarCenter>
            {actions.map((action, index) =>
              action.isButton ? (
                <Button key={index} variant={action.variant} asChild>
                  <Link 
                    href={action.href}
                    target={action.href.startsWith('http') ? '_blank' : undefined}
                    rel={action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {action.icon}
                    {action.text}
                    {action.iconRight}
                  </Link>
                </Button>
              ) : (
                <Link key={index} href={action.href} className="hidden text-sm md:block">
                  {action.text}
                </Link>
              )
            )}
            <Sheet>
              <SheetTrigger className={cn(buttonVariants({ variant: "default", size: "icon" }), "shrink-0 md:hidden")}>
                <Menu className="size-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link href={homeUrl} className="flex items-center gap-2 text-xl font-bold">
                    {name}
                  </Link>
                  {mobileLinks.map((link, index) => (
                    <div key={index}>
                      {link.children ? (
                        <div>
                          <button
                            onClick={() => toggleSection(index)}
                            className="flex items-center justify-between w-full text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <span>{link.text}</span>
                            <ChevronDown
                              className={cn(
                                "size-4 transition-transform",
                                openSections[index] && "rotate-180"
                              )}
                            />
                          </button>
                          {openSections[index] && (
                            <div className="ml-4 mt-3 grid gap-3">
                              {link.children.map((child, childIndex) => (
                                <Link
                                  key={childIndex}
                                  href={child.href}
                                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  {child.text}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                          {link.text}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </NavbarCenter>
        </NavbarComponent>
      </div>
    </header>
  );
}
