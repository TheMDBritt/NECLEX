import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "soft" | "outlined" | "raised";
  interactive?: boolean;
}

export function Card({
  variant = "soft",
  interactive = false,
  className,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl",
        variant === "soft" && "bg-paper-deep/50 backdrop-blur-[2px]",
        variant === "outlined" && "border border-ink/10 bg-paper/60",
        variant === "raised" && "border border-ink/8 bg-paper shadow-[var(--shadow-soft)]",
        interactive && "lift cursor-pointer",
        className,
      )}
      {...rest}
    />
  );
}
