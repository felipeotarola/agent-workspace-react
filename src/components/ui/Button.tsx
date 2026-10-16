import type { ButtonHTMLAttributes } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  shape?: "pill" | "icon";
};

export function Button({
  variant = "ghost",
  size = "md",
  shape = "pill",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`ui-button ${className}`}
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      {...props}
    />
  );
}
