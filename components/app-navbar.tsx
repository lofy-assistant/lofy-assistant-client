import { Menu } from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "@/components/ui/button";
import { NavbarCenter, Navbar as NavbarComponent, NavbarLeft } from "@/components/ui/navbar";
import Navigation from "@/components/ui/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavbarLink {
  text: string;
  href: string;
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
  logo = <Image src="/logo.png" alt="Logo" width={32} height={32} className="size-8" />,
  name = "Lofy AI",
  homeUrl = "/",
  mobileLinks = [
    { text: "Features", href: "/features" },
    { text: "Resources", href: "/resources" },
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
      href: "/register",
      isButton: true,
      variant: "default",
    },
  ],
  showNavigation = true,
  customNavigation,
  className,
}: NavbarProps) {
  return (
    <header className={cn("sticky top-0 z-50 px-4 pb-4 w-full", className)}>
      <div className="absolute left-0 w-full h-20 fade-bottom bg-background/15 backdrop-blur-lg" />
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
                  <Link href={action.href}>
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
              <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "shrink-0 md:hidden")}>
                <Menu className="size-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link href={homeUrl} className="flex items-center gap-2 text-xl font-bold">
                    {name}
                  </Link>
                  {mobileLinks.map((link, index) => (
                    <Link key={index} href={link.href} className="text-muted-foreground hover:text-foreground">
                      {link.text}
                    </Link>
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
