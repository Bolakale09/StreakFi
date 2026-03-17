import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MobileShellProps = {
  children: ReactNode;
  className?: string;
};

export function MobileShell({ children, className }: MobileShellProps) {
  return (
    <div className={cn("mx-auto w-full max-w-md px-4 sm:max-w-2xl sm:px-6", className)}>
      {children}
    </div>
  );
}
