"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, Menu, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { GUIDE_SECTIONS, GUIDE_BASE_PATH } from "./guide-config";

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const activeSection = pathname?.replace(`${GUIDE_BASE_PATH}/`, "") || "getting-started";

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-primary/[0.07] blur-3xl" />
        <div className="absolute bottom-0 right-[-120px] h-[380px] w-[380px] rounded-full bg-accent/[0.06] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.28]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--border)) 1px, transparent 0)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Mobile sidebar trigger */}
      <div className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-md supports-backdrop-filter:bg-background/75 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-muted"
          aria-label="Open guide navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <BookOpen className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          <p className="truncate text-sm font-semibold">Lofy guide</p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium backdrop-blur transition-colors hover:bg-muted/70"
        >
          <LayoutDashboard className="h-3.5 w-3.5" aria-hidden />
          Dashboard
        </Link>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-[60] w-[min(18rem,100vw-3rem)] shrink-0 border-r border-border/60 bg-background/95 p-5 pt-[4.5rem] shadow-lg backdrop-blur-md transition-transform duration-200 ease-out lg:sticky lg:top-0 lg:z-0 lg:h-[100dvh] lg:w-64 lg:translate-x-0 lg:self-start lg:bg-background/80 lg:p-6 lg:pt-8 lg:shadow-none",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="mb-8 hidden lg:block">
            <Link href={GUIDE_BASE_PATH} className="group inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-foreground transition-colors hover:text-primary">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/15 bg-gradient-to-br from-primary/12 to-accent/10 transition group-hover:border-primary/25">
                <Sparkles className="h-4 w-4 text-primary" aria-hidden />
              </span>
              <span className="leading-tight">
                Lofy guide
                <span className="mt-0.5 block text-xs font-normal text-muted-foreground">Use the assistant well</span>
              </span>
            </Link>
          </div>

          <nav className="space-y-1" aria-label="Guide sections">
            <p className="mb-3 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Contents</p>
            {GUIDE_SECTIONS.map(({ id, label, icon: Icon }) => {
              const href = `${GUIDE_BASE_PATH}/${id}`;
              const isActive = activeSection === id || (id === "getting-started" && pathname === GUIDE_BASE_PATH);
              return (
                <Link
                  key={id}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-primary/12 font-medium text-primary shadow-sm ring-1 ring-primary/15"
                      : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "opacity-80")} aria-hidden />
                  <span className="leading-snug">{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-10 rounded-xl border border-border/70 bg-muted/30 p-4">
            <p className="text-xs font-medium text-muted-foreground">Manage account</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground/90">Memories, calendar sync, and personas live in the dashboard.</p>
            <Link
              href="/dashboard"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground shadow-sm transition hover:opacity-95"
            >
              <LayoutDashboard className="h-3.5 w-3.5" aria-hidden />
              Open dashboard
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:pl-10 lg:pr-14 lg:py-12">
          <div className="mx-auto max-w-4xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
