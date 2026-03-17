import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BaseCardProps = {
  children: ReactNode;
  className?: string;
};

export function BaseCard({ children, className }: BaseCardProps) {
  return (
    <section className={cn("glass-card rounded-4xl p-5 shadow-soft", className)}>
      {children}
    </section>
  );
}
