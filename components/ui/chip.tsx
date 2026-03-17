import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ChipProps = {
  children: ReactNode;
  className?: string;
};

export function Chip({ children, className }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border border-ink/10 bg-white/82 px-3 py-1 text-xs font-medium text-ink/80 shadow-sm backdrop-blur",
        className,
      )}
    >
      {children}
    </span>
  );
}
