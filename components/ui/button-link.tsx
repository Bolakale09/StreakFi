import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getButtonClasses } from "@/components/ui/button";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "light";
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(getButtonClasses(variant), className)}
      href={href}
    >
      {children}
    </Link>
  );
}
