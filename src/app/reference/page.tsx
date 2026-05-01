import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { PageFrame } from "@/components/shell/page-frame";

export const metadata: Metadata = {
  title: "Reference",
};

const cabinet = [
  {
    href: "/reference/labs",
    title: "Lab values",
    body: "Adult ranges, critical values, and what each lab actually means.",
    accent: "sage",
  },
  {
    href: "/reference/drugs",
    title: "Drug library",
    body: "Mechanism, nursing implications, and what to monitor.",
    accent: "lavender",
  },
  {
    href: "/reference/mnemonics",
    title: "Mnemonics",
    body: "Acronyms, songs, and image anchors. Audio coming.",
    accent: "clay",
  },
] as const;

const accentBg = {
  lavender: "bg-lavender-50",
  sage: "bg-sage-50",
  clay: "bg-clay-50",
} as const;

export default function ReferencePage() {
  return (
    <PageFrame>
      <Container>
        <section className="pb-16 pt-20 sm:pt-28">
          <Eyebrow>Reference</Eyebrow>
          <h1 className="mt-5 max-w-[20ch] font-display text-[clamp(2.25rem,5vw,4.5rem)] font-light leading-[1.06] tracking-[-0.03em] text-ink">
            Quick lookups.
          </h1>

          <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {cabinet.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className={`group lift relative flex flex-col rounded-2xl border border-ink/10 ${accentBg[c.accent]} p-7 sm:p-8`}
              >
                <p className="font-display text-[1.625rem] font-light leading-[1.18] tracking-[-0.02em] text-ink">
                  {c.title}
                </p>
                <p className="mt-3 max-w-[36ch] font-body text-[14.5px] leading-[1.55] text-ink-soft">
                  {c.body}
                </p>
                <p className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink">
                  Open
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </p>
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </PageFrame>
  );
}
