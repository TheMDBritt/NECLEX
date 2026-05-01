import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline";

const base =
  "inline-flex items-center gap-3 rounded-full font-body text-[15px] tracking-[0.01em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50";

const sizes = {
  md: "px-7 py-3.5",
  sm: "px-5 py-2.5 text-[14px]",
} as const;

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-indigo-deep",
  ghost: "text-ink-soft hover:text-ink",
  outline: "border border-ink/15 bg-paper/70 text-ink backdrop-blur-sm hover:border-ink/35 hover:bg-paper",
};

interface CommonProps {
  variant?: Variant;
  size?: keyof typeof sizes;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  size = "md",
  arrow,
  className,
  children,
  ...rest
}: ButtonProps) {
  const inner = (
    <>
      {children}
      {arrow ? (
        <span
          aria-hidden
          className="inline-block translate-x-0 transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      ) : null}
    </>
  );

  const classes = cn("group", base, sizes[size], variants[variant], className);

  if ("href" in rest && rest.href) {
    const { href, ...anchorRest } = rest;
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {inner}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {inner}
    </button>
  );
}
