import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60";

const variants = {
  primary:
    "bg-primary text-primary-foreground shadow-soft hover:bg-secondary hover:shadow-lift hover:-translate-y-0.5",
  outline:
    "border border-primary/25 bg-card text-primary hover:border-secondary hover:bg-accent hover:-translate-y-0.5",
  ghostLight:
    "border border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/12 hover:-translate-y-0.5",
} as const;

type Variant = keyof typeof variants;

export function ActionLink({
  variant = "primary",
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant }) {
  return <a className={cn(base, variants[variant], className)} {...props} />;
}

export function ActionButton({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}
