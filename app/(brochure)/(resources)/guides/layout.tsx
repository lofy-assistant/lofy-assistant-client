"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, BookOpen } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar trigger */}
      <div className="sticky top-0 z-40 flex items-center gap-4 border-b bg-background/95 px-4 py-3 backdrop-blur supports-backdrop-filter:bg-background/60 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center gap-2 rounded-md p-2 hover:bg-muted"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold">Lofy AI User Guide</h1>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r bg-background p-6 pt-20 transition-transform lg:sticky lg:top-0 lg:z-0 lg:self-start lg:translate-x-0 lg:pt-6",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <nav className="space-y-1">
            <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              Sections
            </div>
            {GUIDE_SECTIONS.map(({ id, label, icon: Icon }) => {
              const href = `${GUIDE_BASE_PATH}/${id}`;
              const isActive = activeSection === id || (id === "getting-started" && pathname === GUIDE_BASE_PATH);
              return (
                <Link
                  key={id}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 py-8 lg:pl-10 lg:pr-12">
          <div className="mx-auto max-w-3xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
