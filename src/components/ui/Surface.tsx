import type { HTMLAttributes } from "react";
export function Surface({
  as: Tag = "section",
  className = "",
  ...props
}: HTMLAttributes<HTMLElement> & { as?: "section" | "article" | "div" }) {
  return <Tag className={`ui-surface ${className}`} {...props} />;
}
