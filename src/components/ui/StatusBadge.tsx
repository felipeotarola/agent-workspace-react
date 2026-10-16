import type { HTMLAttributes } from "react";
export function StatusBadge({
  tone = "neutral",
  className = "",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
}) {
  return (
    <span className={`ui-badge ${className}`} data-tone={tone} {...props} />
  );
}
