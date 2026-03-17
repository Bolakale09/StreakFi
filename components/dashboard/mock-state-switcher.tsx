import Link from "next/link";
import { cn } from "@/lib/utils";

type MockStateSwitcherProps = {
  currentState: "ready" | "checked-in";
};

const tabs: Array<{ key: "ready" | "checked-in"; label: string }> = [
  { key: "ready", label: "Before check-in" },
  { key: "checked-in", label: "After check-in" },
];

export function MockStateSwitcher({ currentState }: MockStateSwitcherProps) {
  return (
    <div className="glass-card flex w-fit items-center gap-2 rounded-full p-1 shadow-soft">
      {tabs.map((tab) => (
        <Link
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            currentState === tab.key ? "bg-ink text-white" : "text-ink/65",
          )}
          href={tab.key === "ready" ? "/dashboard" : "/dashboard?state=checked-in"}
          key={tab.key}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
