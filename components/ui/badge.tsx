import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 [&>svg]:size-3 [&>svg]:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 transition-colors duration-200",
  {
    variants: {
      variant: {
        default:
          // Soft but readable primary tone for both modes
          "border-transparent bg-primary/90 text-primary-foreground hover:bg-primary/80 dark:bg-primary/80 dark:hover:bg-primary/70",
        secondary:
          // Muted background with subtle contrast in dark mode
          "border-transparent bg-secondary/90 text-secondary-foreground hover:bg-secondary/80 dark:bg-secondary/70 dark:hover:bg-secondary/60",
        destructive:
          // Keep contrast high, balance saturation between modes
          "border-transparent bg-destructive/90 text-white hover:bg-destructive/80 focus-visible:ring-destructive/40 dark:bg-destructive/70 dark:hover:bg-destructive/60",
        outline:
          // Transparent with subtle hover tint
          "border-border text-foreground hover:bg-accent/10 hover:text-accent-foreground dark:border-border dark:hover:bg-accent/20",
        success:
          // Consistent green tone with good readability
          "border-transparent bg-emerald-600 text-white dark:text-gray-800 hover:bg-emerald-700 focus-visible:ring-emerald-400 dark:bg-emerald-500 dark:hover:bg-emerald-600",
        muted:
          // Elegant neutral tag style
          "border-transparent bg-muted text-muted-foreground hover:bg-muted/80 dark:bg-muted/60 dark:text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
