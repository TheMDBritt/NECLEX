import type { ReactNode } from "react";

type Token = string | ReactNode;
type Line = Token[];

interface RevealHeadingProps {
  /**
   * Each inner array is a line; each token is a word (or inline element).
   * Words animate in sequence with stagger.
   */
  lines: Line[];
}

/**
 * Renders a multi-line display heading with staggered word reveal on mount.
 * The underlying animation is CSS-only (`reveal-word` utility) for SSR-friendly motion.
 */
export function RevealHeading({ lines }: RevealHeadingProps) {
  let i = 0;
  return (
    <span className="block">
      {lines.map((line, lineIdx) => (
        <span key={lineIdx} className="block">
          {line.map((token, tokenIdx) => {
            const idx = i++;
            return (
              <span
                key={tokenIdx}
                className="reveal-word mr-[0.22em] last:mr-0"
                style={{ ["--reveal-i" as string]: idx }}
              >
                {token}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}
