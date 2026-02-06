import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap gap-1 transition-colors", {
  variants: {
    variant: {
      default: "text-foreground",
      primary: "border-transparent bg-primary text-primary-foreground",
      emerald: "border-transparent bg-emerald-200/80 text-foreground",
      indigo: "border-transparent bg-sky-200/80 text-foreground",
      orange: "border-transparent bg-orange-200/70 text-foreground",
      destructive: "border-transparent bg-destructive text-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function Badge({ className, variant, asChild = false, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
