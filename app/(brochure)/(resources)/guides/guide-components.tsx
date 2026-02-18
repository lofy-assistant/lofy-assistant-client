"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
