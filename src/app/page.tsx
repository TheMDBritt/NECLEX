import Link from "next/link";
import { Botanical } from "@/components/marks/botanical";
import { Button } from "@/components/primitives/button";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { PageFrame } from "@/components/shell/page-frame";

const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

const queues = [
  {
    href: "/study",
    title: "Practice",
    pull: "Questions tuned to the 2026 plan.",
    body: "Open a fresh set — single-best-answer and select-all items, all source-cited, all shuffled. No timer unless you ask.",
    accent: "lavender",
    cta: "Begin a set",
  },
  {
    href: "/reference",
    title: "Reference",
    pull: "Drugs · labs · mnemonics.",
    body: "Open the cabinet — drug cards, lab ranges, and the mnemonic songs that actually stick.",
    accent: "clay",
    cta: "Browse",
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

export default function HomePage() {
  return (
    <PageFrame withAtmosphere>
      <Botanical
        aria-hidden
        className="pointer-events-none absolute -right-32 top-[280px] -z-10 h-[680px] w-[680px] text-lavender-200/55 sm:-right-20 lg:right-0"
      />

      <Container>
        <section className="pb-16 pt-20 sm:pt-28">
          <Eyebrow>{today}</Eyebrow>
          <h1 className="mt-5 max-w-[20ch] font-display text-[clamp(2.5rem,6vw,5.5rem)] font-light leading-[1.04] tracking-[-0.035em] text-ink">
            Welcome back. Take a{" "}
            <em className="font-display italic text-lavender-600">slow breath</em>, then begin.
          </h1>
          <p className="mt-7 max-w-[52ch] font-body text-[1.0625rem] leading-[1.65] text-ink-soft">
            Today's queue is ready when you are. No timer unless you ask for one.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="/study" arrow>
              Begin today's mix
            </Button>
            <Button href="/reference" variant="ghost" size="sm">
              <span className="link-draw">Open the reference cabinet</span>
            </Button>
          </div>
        </section>

        <section aria-labelledby="queues" className="pb-16">
          <h2 id="queues" className="sr-only">
            Study queues
          </h2>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {queues.map((q) => (
              <Link
                key={q.title}
                href={q.href}
                className={`group lift relative flex flex-col justify-between rounded-2xl border border-ink/10 ${accentBg[q.accent]} p-7 sm:p-8`}
              >
                <div>
                  <p className={`font-display text-[1.625rem] font-light leading-[1.18] tracking-[-0.02em] text-ink`}>
                    {q.title}
                  </p>
                  <p className={`mt-2 font-display text-[1.0625rem] italic leading-[1.45] ${accentText[q.accent]}`}>
                    {q.pull}
                  </p>
                  <p className="mt-5 max-w-[36ch] font-body text-[14.5px] leading-[1.6] text-ink-soft">
                    {q.body}
                  </p>
                </div>
                <p className="mt-10 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink">
                  {q.cta}
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </p>
              </Link>
            ))}
          </div>
        </section>

        <aside className="mb-12 rounded-2xl border border-ink/10 bg-paper-deep/40 px-7 py-7 sm:px-8">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
            A small note
          </p>
          <p className="mt-3 max-w-[58ch] font-display text-[1.0625rem] italic leading-[1.5] text-lavender-600">
            "There's no rush. Pick up where you left off, or start a fresh set — both are fine."
          </p>
        </aside>
      </Container>
    </PageFrame>
  );
}
