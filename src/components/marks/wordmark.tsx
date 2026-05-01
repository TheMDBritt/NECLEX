import Link from "next/link";

export function Wordmark() {
  return (
    <Link
      href="/"
      aria-label="NECLEX — home"
      className="group inline-flex items-baseline gap-2 font-display text-[22px] font-medium tracking-[-0.02em] text-ink"
    >
      <span className="relative">
        ne
        <span className="text-lavender-600">c</span>
        lex
      </span>
      <span className="hidden h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-sage-400 transition-colors duration-500 group-hover:bg-lavender-400 sm:inline-block" />
    </Link>
  );
}
