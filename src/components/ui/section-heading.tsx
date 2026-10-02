import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  titleClassName,
  descriptionClassName,
}: Props) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className={cn("text-3xl font-semibold text-primary sm:text-4xl", titleClassName)}>
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed text-muted-foreground",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
