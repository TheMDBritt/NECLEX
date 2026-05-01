import { cn } from "@/lib/utils";

interface EyebrowProps extends React.HTMLAttributes<HTMLParagraphElement> {
  withRule?: boolean;
}

export function Eyebrow({ withRule = true, className, children, ...rest }: EyebrowProps) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint",
        className,
      )}
      {...rest}
    >
      {withRule ? (
        <span
          aria-hidden
          className="mr-3 inline-block h-px w-7 translate-y-[-3px] bg-ink-faint align-middle"
        />
      ) : null}
      {children}
    </p>
  );
}
