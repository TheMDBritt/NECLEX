import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export function Container({ size = "lg", className, ...rest }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 sm:px-10",
        size === "sm" && "max-w-[720px]",
        size === "md" && "max-w-[960px]",
        size === "lg" && "max-w-[1280px]",
        className,
      )}
      {...rest}
    />
  );
}
