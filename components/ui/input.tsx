import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        data-slot="input"
        className={cn(
          // Layout & Base Styles
          "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-all outline-none",

          // File Input Styles (Grouped)
          "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",

          // Placeholder & Selection
          "placeholder:text-muted-foreground/60 selection:bg-primary selection:text-primary-foreground",

          // Interactive States (Focus & Disabled)
          "focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-[1px]",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",

          // Responsive (iOS Zoom Fix)
          "md:text-sm",

          // Dark Mode Specifics
          "dark:bg-input/30",

          // Validation States (Aria)
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",

          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
