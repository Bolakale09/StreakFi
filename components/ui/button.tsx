import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "light";
};

export function getButtonClasses(variant: ButtonProps["variant"] = "primary") {
  return cn(
    "inline-flex min-h-12 items-center justify-center rounded-2xl px-5 text-sm font-semibold tracking-[0.01em] transition-all duration-200",
    "hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
    "disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-80",
    variant === "primary"
      ? "bg-ink text-white shadow-soft"
      : variant === "light"
        ? "bg-white text-ink shadow-soft"
        : "glass-card text-ink shadow-soft",
  );
}

export function Button({
  children,
  className,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(getButtonClasses(variant), className)}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
