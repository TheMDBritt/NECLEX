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
    href: "/reference/drugs",
    title: "Drug library",
    pull: "Mechanism, nursing implications, what to watch.",
    body: "Source-of-truth drug cards, paired with the patho they treat. Searchable by name, class, or system.",
    accent: "lavender",
    state: "soon",
  },
  {
    href: "/reference/labs",
    title: "Lab values",
    pull: "Ranges that travel with you.",
    body: "Adult and peds reference ranges, critical values, and clinical meaning. ABG mini-tool included.",
    accent: "sage",
    state: "soon",
  },
  {
    href: "/reference/mnemonics",
    title: "Mnemonic library",
    pull: "Songs, acronyms, image-anchors.",
    body: "The library of mnemonics — including the song versions you can play on a loop while doing dishes.",
    accent: "clay",
    state: "soon",
  },
] as const;

const accentText = {
  lavender: "text-lavender-600",
  sage: "text-sage-600",
  clay: "text-clay-600",
} as const;

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
            The cabinet — open whenever you need it.
          </h1>
          <p className="mt-7 max-w-[52ch] font-body text-[1.0625rem] leading-[1.65] text-ink-soft">
            Quick lookups during practice, deep reads during downtime. Everything cited.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {cabinet.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className={`group lift relative flex flex-col rounded-2xl border border-ink/10 ${accentBg[c.accent]} p-7 sm:p-8`}
              >
                <span className="absolute right-5 top-5 rounded-full border border-ink/15 bg-paper/70 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.22em] text-ink-faint">
                  {c.state}
                </span>
                <p className="font-display text-[1.625rem] font-light leading-[1.18] tracking-[-0.02em] text-ink">
                  {c.title}
                </p>
                <p className={`mt-2 font-display text-[1.0625rem] italic leading-[1.45] ${accentText[c.accent]}`}>
                  {c.pull}
                </p>
                <p className="mt-5 max-w-[36ch] font-body text-[14.5px] leading-[1.6] text-ink-soft">
                  {c.body}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </PageFrame>
  );
}
