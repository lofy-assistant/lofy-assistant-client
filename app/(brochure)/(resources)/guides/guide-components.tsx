"use client";

import { useState } from "react";
import { Copy, Check, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function CopyableExample({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied! Paste this into your chat with Lofy.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "group flex items-center gap-2 rounded-md px-2 py-1 -mx-2 text-left transition-colors hover:bg-muted/80",
        className
      )}
      title="Click to copy"
    >
      <span className="flex-1">&quot;{text}&quot;</span>
      {copied ? (
        <Check className="h-3.5 w-3.5 shrink-0 text-green-600" />
      ) : (
        <Copy className="h-3.5 w-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
      )}
    </button>
  );
}

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: "info" | "tip" | "important";
  title?: string;
  children: React.ReactNode;
}) {
  const label = type === "tip" ? "Tip" : type === "important" ? "Important" : null;
  const showHeader = label || title;
  return (
    <div
      className={cn(
        "rounded-lg border p-4 my-4",
        type === "tip" && "bg-primary/5 border-primary/20",
        type === "important" && "bg-amber-500/10 border-amber-500/30 dark:bg-amber-500/5 dark:border-amber-500/20",
        type === "info" && "bg-muted/50 border-border"
      )}
    >
      {showHeader && (
        <p className="mb-2 text-sm font-semibold">
          {label && `${label}${title ? ": " : ""}`}
          {title}
        </p>
      )}
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

export function GuideKicker({ icon: Icon, children }: { icon?: LucideIcon; children: React.ReactNode }) {
  return (
    <Badge variant="indigo" className="mb-5 w-fit gap-1.5 px-3 py-1 font-medium">
      {Icon ? <Icon className="size-3.5" aria-hidden /> : null}
      {children}
    </Badge>
  );
}

export function GuidePageTitle({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <header className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/12 to-accent/10 shadow-sm">
            <Icon className="h-6 w-6 text-primary" aria-hidden />
          </div>
          <div className="min-w-0 space-y-2">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{title}</h1>
            {description ? <p className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p> : null}
          </div>
        </div>
      </div>
    </header>
  );
}

export function GuideExamplePanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/35 p-4 shadow-sm sm:p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

export function GuideSubheading({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h2 className={cn("text-lg font-semibold tracking-tight text-foreground", className)}>{children}</h2>;
}
