import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", {
  variants: {
    variant: {
      default: "border-[var(--line)] bg-[var(--surface-soft)] text-[var(--ink)]",
      good: "border-[#b7dfd9] bg-[#ecfdf9] text-[var(--primary-strong)]",
      warn: "border-[#f3d7ad] bg-[#fff7ed] text-[#9a3412]",
      bad: "border-[#f2c6c6] bg-[#fff5f5] text-[#991b1b]",
      info: "border-[#c7d8ff] bg-[#eaf1ff] text-[#1e40af]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
