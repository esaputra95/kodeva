import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Badge({
  children,
  tone = "green",
}: {
  children: ReactNode;
  tone?: "green" | "amber" | "neutral";
}) {
  return <span className={cn("badge", `badge-${tone}`)}>{children}</span>;
}
