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
        { text: "Limitless Reminder", href: "/features/limitless-reminder" },
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
      text: "Login/Register",
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
                <Link key={index} href={action.href} className="hidden text-sm font-medium underline-offset-4 hover:underline tracking-wide text-white md:block">
                  {action.text}
                </Link>
              )
            )}
            <Sheet>
              <SheetTrigger className={cn(buttonVariants({ variant: "default", size: "icon" }), "shrink-0 md:hidden")}>
                <Menu className="size-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-full bg-background/98 backdrop-blur-xl border-none p-0">
                <div className="flex flex-col h-full p-6">
                  <div className="flex items-center justify-between mb-6">
                    <Link href={homeUrl} className="flex items-center gap-2 text-2xl font-bold">
                      {logo}
                      {name}
                    </Link>
                  </div>
                  
                  <nav className="flex-1 px-1">
                    {mobileLinks.map((link, index) => (
                      <div key={index} className="bg-linear-to-r from-emerald-600/30 to-indigo-600/30 my-2 rounded-xl overflow-hidden transition-all hover:bg-secondary/30">
                        {link.children ? (
                          <div className="px-4 py-1">
                            <button
                              onClick={() => toggleSection(index)}
                              className="flex items-center justify-between w-full py-3 text-lg font-medium text-foreground hover:text-primary transition-colors group"
                            >
                              <span>{link.text}</span>
                              <ChevronDown
                                className={cn(
                                  "size-5 transition-transform duration-300 text-muted-foreground group-hover:text-primary",
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
                                {link.children.map((child, childIndex) => (
                                  <Link
                                    key={childIndex}
                                    href={child.href}
                                    className="text-base text-muted-foreground hover:text-foreground transition-colors py-2 px-2 rounded-lg hover:bg-background/50"
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
                            className="flex items-center w-full px-4 py-3.5 text-lg font-medium text-foreground hover:text-primary transition-colors"
                          >
                            {link.text}
                          </Link>
                        )}
                      </div>
                    ))}
                  </nav>

                  <div className="flex flex-col w-full">
                    <div className="grid grid-cols-2 gap-4"> 
                      {actions.map((action, index) => (
                        <Button 
                          key={index} 
                          variant={action.isButton ? action.variant : "outline"} 
                          size="lg"
                          className="w-full text-base font-semibold shadow-sm" 
                          asChild
                        >
                          <Link href={action.href}>
                            {action.text}
                          </Link>
                        </Button>
                      ))}
                    </div>
                    <p className="text-center text-xs text-muted-foreground mt-2">
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
